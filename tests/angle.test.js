const test = require('node:test');
const assert = require('node:assert/strict');
const {
  angleBetweenPoints2D,
  angleBetweenPoints3D,
  rollFromEyes,
  estimateHeadPose,
} = require('../src/angle.js');

test('angleBetweenPoints2D - 90 degrees', () => {
  const a = { x: 0, y: 1 }, b = { x: 0, y: 0 }, c = { x: 1, y: 0 };
  assert.ok(Math.abs(angleBetweenPoints2D(a, b, c) - 90) < 1e-6);
});

test('rollFromEyes - horizontal eyes -> 0°', () => {
  const leftEye = { x: 0, y: 0 }, rightEye = { x: 1, y: 0 };
  assert.ok(Math.abs(rollFromEyes(leftEye, rightEye) - 0) < 1e-6);
});

test('rollFromEyes - 45° tilt', () => {
  const leftEye = { x: 0, y: 0 }, rightEye = { x: 1, y: 1 };
  assert.ok(Math.abs(rollFromEyes(leftEye, rightEye) - 45) < 1e-6);
});

test('angleBetweenPoints3D - 90 degrees', () => {
  const a = { x: 0, y: 0, z: 0 }, b = { x: 1, y: 0, z: 0 }, c = { x: 1, y: 1, z: 0 };
  assert.ok(Math.abs(angleBetweenPoints3D(a, b, c) - 90) < 1e-6);
});

test('estimateHeadPose - approximate frontal face', () => {
  const leftEye = { x: -0.03, y: 0 }, rightEye = { x: 0.03, y: 0 };
  const nose = { x: 0, y: 0.12 };
  const chin = { x: 0, y: 0.5 };
  const p = estimateHeadPose({ leftEye, rightEye, nose, chin });
  assert.ok(Math.abs(p.roll) < 1, `roll=${p.roll}`);
  assert.ok(Math.abs(p.yaw) < 1, `yaw=${p.yaw}`);
  assert.ok(Math.abs(p.pitch) < 15, `pitch=${p.pitch}`);
});

test('estimateHeadPose - yaw to the right', () => {
  const leftEye = { x: -0.03, y: 0 }, rightEye = { x: 0.03, y: 0 };
  const nose = { x: 0.05, y: 0.12 };
  const chin = { x: 0.05, y: 0.5 };
  const p = estimateHeadPose({ leftEye, rightEye, nose, chin });
  assert.ok(p.yaw > 0.5, `yaw=${p.yaw}`);
});
