/**
 * Angle utilities for medical-photo standardization.
 * - Works with 2D image landmarks and optional 3D (z) coordinates.
 * - Coordinate convention used in helpers: x -> right, y -> down (image pixel coords).
 *
 * Start with these platform-agnostic primitives; they can be fed by VisionCamera landmarks
 * or MediaPipe outputs later.
 */

function toDegrees(rad) { return rad * 180 / Math.PI; }

// 2D helpers
function dot2(u,v) { return u.x*v.x + u.y*v.y; }
function cross2(u,v) { return u.x*v.y - u.y*v.x; }
function norm2(u) { return Math.hypot(u.x, u.y); }

/**
 * Angle ABC in degrees (0..180) using 2D image coordinates.
 * a,b,c: {x:number, y:number}
 */
function angleBetweenPoints2D(a, b, c) {
  const BA = { x: a.x - b.x, y: a.y - b.y };
  const BC = { x: c.x - b.x, y: c.y - b.y };
  const dot = dot2(BA, BC);
  const cross = cross2(BA, BC);
  const angle = Math.atan2(Math.abs(cross), dot);
  return toDegrees(angle);
}

// 3D helpers
function vec3(a,b) { return { x: (a.x - b.x), y: (a.y - b.y), z: ((a.z || 0) - (b.z || 0)) }; }
function dot3(u,v) { return u.x*v.x + u.y*v.y + u.z*v.z; }
function cross3(u,v) { return { x: u.y*v.z - u.z*v.y, y: u.z*v.x - u.x*v.z, z: u.x*v.y - u.y*v.x }; }
function norm3(u) { return Math.hypot(u.x, u.y, u.z); }

/**
 * Angle ABC in degrees using 3D coordinates (if z present).
 */
function angleBetweenPoints3D(a, b, c) {
  const BA = vec3(a, b);
  const BC = vec3(c, b);
  const dot = dot3(BA, BC);
  const cross = cross3(BA, BC);
  const crossNorm = norm3(cross);
  const angle = Math.atan2(crossNorm, dot);
  return toDegrees(angle);
}

/**
 * Roll estimation from the eye line (degrees).
 * Positive value -> clockwise tilt in image coordinates (y points down).
 */
function rollFromEyes(leftEye, rightEye) {
  const dy = rightEye.y - leftEye.y;
  const dx = rightEye.x - leftEye.x;
  return toDegrees(Math.atan2(dy, dx));
}

/**
 * Heuristic head-pose estimate (very lightweight).
 * Input `landmarks` should contain at least: leftEye, rightEye, nose, chin
 * Returns angles in degrees: { pitch, yaw, roll }
 *
 * Notes:
 * - These are approximate, deterministic heuristics intended for frame selection & gating.
 * - For production-grade accuracy replace with solvePnP/MediaPipe pose estimation.
 */
function estimateHeadPose(landmarks) {
  const { leftEye, rightEye, nose, chin } = landmarks;
  if (!leftEye || !rightEye || !nose || !chin) {
    throw new Error('estimateHeadPose requires leftEye, rightEye, nose and chin landmarks');
  }

  const midEye = { x: (leftEye.x + rightEye.x) / 2, y: (leftEye.y + rightEye.y) / 2 };
  const interEyeDist = Math.hypot(rightEye.x - leftEye.x, rightEye.y - leftEye.y) || 1e-6;

  // Roll: tilt of the eye-line
  const roll = rollFromEyes(leftEye, rightEye);

  // Yaw: lateral offset of nose relative to eye-midpoint normalized by inter-eye distance
  // Positive -> nose is to the right of mid-eyes (subject rotated to their right)
  const xOffset = nose.x - midEye.x;
  const yaw = toDegrees(Math.atan2(xOffset, interEyeDist));

  // Pitch: how far nose is between eyes and chin vertically
  // Positive -> nose is closer to chin (head tilted down)
  const eyeToChin = chin.y - midEye.y || 1e-6;
  const noseOffset = nose.y - midEye.y;
  const pitch = toDegrees(Math.atan2(noseOffset, eyeToChin));

  return { pitch, yaw, roll };
}

module.exports = {
  angleBetweenPoints2D,
  angleBetweenPoints3D,
  rollFromEyes,
  estimateHeadPose,
};
