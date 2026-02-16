# 🏥 Clinic Photo AI

**AI-Powered Medical Photo Standardization App**

An intelligent React Native application that standardizes medical photography using real-time face detection, angle measurement, and AI-powered analysis.

---

## 🎯 **Project Overview**

Clinic Photo AI revolutionizes medical photography by providing:
- **Real-time face detection** with confidence scoring
- **Precise angle measurement** (0°, 45°, 90° left/right)
- **Automated photo standardization** for clinical documentation
- **AI-powered before/after comparison** analysis
- **Professional medical workflow** integration

---

## 🚀 **Current Progress**

### ✅ **Phase 1: Video Recording - COMPLETE**
- ✅ VisionCamera v4 integration
- ✅ Real video file processing (7.6MB files)
- ✅ 5-second auto-recording with timer sync
- ✅ Frame extraction system
- ✅ Progression through 5 angles

### ✅ **Phase 1.5: EAS Build Setup - COMPLETE**
- ✅ Custom development build with worklets
- ✅ React Native Vision Camera integration
- ✅ Frame processor support
- ✅ Real-time face detection foundation

### 🔄 **Phase 2: Real AI Angle Detection - IN PROGRESS**
- ✅ Face detection state management
- ✅ UI overlay for face detection status
- ✅ Frame processor implementation
- 🔄 Real angle calculation algorithm
- 🔄 Smart frame extraction at perfect angles

---

## Phase 2.2 — Real Angle Calculation (IMMEDIATE NEXT)

Why this first
- Foundation for all downstream features (frame selection, quality checks).
- Most critical AI component that must be accurate and repeatable.

Recommended approach (start here)
1. VisionCamera built-in landmarks -> fast, simple integration (start)
2. Upgrade to MediaPipe for robust 3D/pose if results are insufficient
3. Custom TFLite model only if project needs specialized clinical accuracy

What I added in this workspace
- `src/angle.js` — lightweight, platform-agnostic angle utilities (2D/3D)
- `tests/angle.test.js` — unit tests using Node's built-in test runner
- `package.json` — `npm test` runs the unit tests

Acceptance criteria ✅
- Deterministic angle primitives (angle at a point, roll-from-eyes)
- Lightweight head-pose heuristic returning `{pitch,yaw,roll}` in degrees
- Unit tests that validate basic geometries and heuristics

Quick VisionCamera integration (example)
```js
// pseudo-code for a VisionCamera frame-processor
import { estimateHeadPose } from './src/angle';

function frameProcessor(frame) {
  const face = frame.faces?.[0];
  if (!face || !face.landmarks) return;

  const landmarks = {
    leftEye: face.landmarks.leftEye,
    rightEye: face.landmarks.rightEye,
    nose: face.landmarks.noseBase || face.landmarks.nose,
    chin: face.landmarks.chin || { x: face.boundingBox.x + face.boundingBox.width/2, y: face.boundingBox.y + face.boundingBox.height }
  };

  const { pitch, yaw, roll } = estimateHeadPose(landmarks);
  // use angles to gate frame capture or annotate UI
}
```

Next steps
1. Wire `estimateHeadPose` into the VisionCamera frame-processor (Phase 2.3)
2. Add automated e2e frameset tests and threshold tuning
3. Replace heuristic with MediaPipe/solvePnP if precision targets are not met

---

## 🛠 **Tech Stack**

### **Frontend**
- **React Native 0.81.5** with Expo SDK 54
- **TypeScript** for type safety
- **React Native Vision Camera v4** for advanced camera features
- **React Native Worklets Core** for real-time frame processing

### **Backend & Services**
- **Expo Media Library** for photo management
- **Expo File System** for file operations
- **Supabase** for patient data management
- **EAS Build** for custom development builds

### **Development Tools**
- **EAS Build System** for iOS deployment
- **Metro Bundler** for development
- **TypeScript** for static analysis
- **Git** for version control

---

## 📱 **Features**

### **🎥 Camera & Recording**
- **5-angle capture system** (Front, Left 45°, Left 90°, Right 45°, Right 90°)
- **5-second auto-recording** with visual feedback
- **Real-time video processing** and frame extraction
- **Professional medical grid overlay** for positioning

### **🤖 AI Face Detection**
- **Real-time face detection** with confidence scoring
- **Live UI feedback** showing face detection status
- **Frame processor integration** for smooth performance
- **Worklets support** for native performance

### **📐 Angle Measurement**
- **Target angle tracking** for each capture position
- **Real-time angle feedback** as user turns
- **Smart frame extraction** at optimal angles
- **Progressive angle guidance** system

### **👥 Patient Management**
- **Patient registration** and profile management
- **Session tracking** and photo organization
- **Before/after comparison** workflow
- **Medical documentation** standards

---

## 🏗 **Architecture**

```
📱 App Structure
├── 🏠 Home Screen
│   ├── Patient management
│   ├── Session statistics
│   └── Quick actions
├── 👤 Patient Details
│   ├── Patient registration
│   ├── Session history
│   └── Medical notes
├── 📸 Capture Screen
│   ├── Real-time face detection
│   ├── 5-angle recording system
│   ├── Angle measurement UI
│   └── Progress tracking
├── 🔄 Workflow Screen
│   ├── Before/after comparison
│   ├── AI analysis results
│   └── Treatment progress
└── 📊 Comparison Screen
    ├── Side-by-side views
    ├── AI-powered analysis
    └── Export capabilities
```

---

## 🚀 **Getting Started**

### **Prerequisites**
- **Node.js** 18+ 
- **Expo CLI** latest version
- **EAS Account** for builds
- **Apple Developer Account** ($99/year)

### **Installation**
```bash
# Clone the repository
git clone https://github.com/lynetteycy-tech/-ClinicPhotoApp.git
cd -ClinicPhotoApp

# Install dependencies
npm install

# Start development server
npx expo start --dev-client
```

### **Development Build**
```bash
# Create custom build with worklets
eas build --platform ios --profile development

# Install on device and connect to Metro
npx expo start --dev-client
```

---

## 📊 **Project Statistics**

- **📁 Total Files**: 150+ files
- **📝 Lines of Code**: 15,000+ lines
- **🎯 Features Implemented**: 70% complete
- **📱 Platform Support**: iOS (Android planned)
- **🔄 Build Status**: Development build active

---

## 🔮 **Future Roadmap**

### **Phase 3: Enhanced AI Features**
- [ ] **Real face landmark detection** (eyes, nose, mouth)
- [ ] **Advanced angle calculation** (yaw, pitch, roll)
- [ ] **Smart frame quality scoring**
- [ ] **Automatic background segmentation**

### **Phase 4: Professional Features**
- [ ] **Doctor annotations** and treatment plans
- [ ] **Enhanced analytics dashboard**
- [ ] **Quick treatment tagging**
- [ ] **Export to medical systems**

### **Phase 5: Platform Expansion**
- [ ] **Android support**
- [ ] **Web dashboard**
- [ ] **API integration**
- [ ] **Multi-clinic support**

---

## 🤝 **Contributing**

This is a medical AI project focused on improving clinical photography standards.

### **Development Environment**
- Uses **EAS Build** for native features
- **Worklets** for real-time processing
- **TypeScript** for code quality
- **Git flow** for version control

### **Code Style**
- TypeScript strict mode
- React Native best practices
- Medical UI/UX standards
- Performance-optimized components

---

## 📄 **License**

Medical AI project - Private repository

---

## 🏆 **Achievements**

- ✅ **Real-time face detection** with VisionCamera v4
- ✅ **Custom development build** with worklets
- ✅ **5-angle capture system** with timer sync
- ✅ **Professional medical UI** design
- ✅ **TypeScript integration** for reliability
- ✅ **EAS deployment** pipeline

---

## 📞 **Contact**

**Developer**: Lynette Yap  
**GitHub**: @lynetteycy-tech  
**Project**: Clinic Photo AI  
**Status**: Active Development (65% complete)

---

## 🔗 **Links**

- **📱 Live Demo**: Available on request
- **📖 Documentation**: In progress
- **🐛 Issues**: GitHub Issues
- **💬 Discussion**: GitHub Discussions

---

*🏥 Built with ❤️ for medical professionals and AI innovation*

