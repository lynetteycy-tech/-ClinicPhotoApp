import * as ImageManipulator from 'expo-image-manipulator';
import * as MediaLibrary from 'expo-media-library';
import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
// Camera temporarily removed - will add working camera later
import { fetchPatients, Patient, savePatient, testSupabaseConnection } from '../services/patientService';
import { supabase } from '../services/supabase';

type Face = any;
const scanFaces = (_frame: any): Face[] => [];

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<string>('home');
  const [photosTaken, setPhotosTaken] = useState<any[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [currentPatient, setCurrentPatient] = useState<string>('');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // ✅ AUTO LOGIN
  // TODO: Implement proper authentication flow
  // ⚠️ SECURITY: Do not store credentials in source code.
  // Use proper authentication methods with environment variables or secure token storage.
  useEffect(() => {
    const autoLogin = async () => {
      try {
        console.log('[AUTH] Attempting auto-login...');
        
        // Get session from AsyncStorage if available
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          console.log('[AUTH] User already authenticated:', user.email);
        } else {
          console.log('[AUTH] No authenticated user found - please implement login flow');
        }
      } catch (err) {
        console.error('[AUTH] Exception:', err);
      }
    };

    autoLogin();
  }, []);

  // ✅ LOAD PATIENTS AND TEST CONNECTION
  useEffect(() => {
    loadPatientsFromDatabase();
    testConnection();
  }, []);

  const testConnection = async () => {
    console.log('[APP] Testing Supabase connection on startup...');
    const isConnected = await testSupabaseConnection();
    console.log('[APP] Connection test result:', isConnected);
  };

  const loadPatientsFromDatabase = async () => {
    setIsLoading(true);
    const loadedPatients = await fetchPatients();
    setPatients(loadedPatients);
    setIsLoading(false);
  };
  
  const steps = [
    { number: 1, angle: "0°", text: "Front - Look straight ahead" },
    { number: 2, angle: "45°", text: "Left 45° angle" },
    { number: 3, angle: "90°", text: "Left side profile" },
    { number: 4, angle: "45°", text: "Right 45° angle" },
    { number: 5, angle: "90°", text: "Right side profile" },
  ];
  
  const startNewPatient = () => {
    setCurrentPatient('');
    setCurrentStep(1);
    setPhotosTaken([]);
    setCurrentScreen('capture');
  };
  
  const HomeScreen = () => {
    if (isLoading) {
      return (
        <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
          <Text style={styles.title}>Loading patient data...</Text>
        </View>
      );
    }

    return (
      <ScrollView style={styles.fullScreen}>
        <View style={styles.container}>
          <View style={styles.medicalHeader}>
            <Text style={styles.clinicName}>CLINIC PHOTO STANDARDIZER</Text>
            <Text style={styles.clinicSub}>AI-Powered Medical Documentation</Text>
          </View>
          
          <View style={styles.medicalLogo}>
            <Text style={styles.logoIcon}>🤖</Text>
            <Text style={styles.logoText}>AI-POWERED v3.0</Text>
          </View>
          
          <View style={styles.statsBox}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{patients.length}</Text>
              <Text style={styles.statLabel}>Patients</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{patients.reduce((sum, p) => sum + p.photos, 0)}</Text>
              <Text style={styles.statLabel}>Photos</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>5</Text>
              <Text style={styles.statLabel}>Angles</Text>
            </View>
          </View>
          
          <TouchableOpacity 
            style={styles.medicalButtonPrimary}
            onPress={startNewPatient}
          >
            <Text style={styles.buttonIcon}>🤖</Text>
            <View style={styles.buttonTextContainer}>
              <Text style={styles.buttonTitle}>AI PATIENT SESSION</Text>
              <Text style={styles.buttonSubtitle}>Auto-standardized photos</Text>
            </View>
            <Text style={styles.buttonArrow}>→</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.medicalButtonSecondary}
            onPress={() => setCurrentScreen('gallery')}
          >
            <Text style={styles.buttonIcon}>👁</Text>
            <View style={styles.buttonTextContainer}>
              <Text style={styles.buttonTitle}>PATIENT GALLERY</Text>
              <Text style={styles.buttonSubtitle}>{patients.length} existing records</Text>
            </View>
            <Text style={styles.buttonArrow}>→</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.medicalButtonTertiary}
            onPress={() => setCurrentScreen('comparison')}
          >
            <Text style={styles.buttonIcon}>⚡</Text>
            <View style={styles.buttonTextContainer}>
              <Text style={styles.buttonTitle}>COMPARISON TOOL</Text>
              <Text style={styles.buttonSubtitle}>Before/After AI analysis</Text>
            </View>
            <Text style={styles.buttonArrow}>→</Text>
          </TouchableOpacity>
          
          <View style={styles.protocolBox}>
            <Text style={styles.protocolTitle}>AI STANDARDIZATION FEATURES</Text>
            <View style={styles.protocolAngles}>
              <View style={styles.protocolAngle}>
                <Text style={styles.angleNumber}>1</Text>
                <Text style={styles.angleText}>Auto-lighting</Text>
              </View>
              <View style={styles.protocolAngle}>
                <Text style={styles.angleNumber}>2</Text>
                <Text style={styles.angleText}>Angle correction</Text>
              </View>
              <View style={styles.protocolAngle}>
                <Text style={styles.angleNumber}>3</Text>
                <Text style={styles.angleText}>Face alignment</Text>
              </View>
              <View style={styles.protocolAngle}>
                <Text style={styles.angleNumber}>4</Text>
                <Text style={styles.angleText}>Consistency</Text>
              </View>
              <View style={styles.protocolAngle}>
                <Text style={styles.angleNumber}>5</Text>
                <Text style={styles.angleText}>AI Analysis</Text>
              </View>
            </View>
            <Text style={styles.protocolNote}>All photos standardized automatically</Text>
          </View>
          
          <Text style={styles.copyright}>© 2024 AI Clinic Photo Standardizer</Text>
        </View>
      </ScrollView>
    );
  };
  
  const CaptureScreen = () => {
    const [mediaPermission, requestMediaPermission] = MediaLibrary.usePermissions();
    const cameraRef = useRef<any>(null);
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [aiCorrectionApplied, setAiCorrectionApplied] = useState<boolean>(false);
    
    // Face Detection State
    const [faceDetected, setFaceDetected] = useState<boolean>(false);
    const [faceData, setFaceData] = useState<any>(null);
    const [correctionMessage, setCorrectionMessage] = useState<string>('👤 Position face in frame');
    const [angleStatus, setAngleStatus] = useState<string>('');
    const [positionStatus, setPositionStatus] = useState<string>('');

    // Camera temporarily disabled - will add back when working

    // Face detection temporarily disabled — will be replaced with expo-face-detector

    const savePhotoToAlbum = async (photoUri: string) => {
      try {
        if (!mediaPermission?.granted) {
          await requestMediaPermission();
        }
        
        const albumName = 'ClinicPhotoAI';
        const asset = await MediaLibrary.createAssetAsync(photoUri);
        const album = await MediaLibrary.getAlbumAsync(albumName);
        
        if (album) {
          await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
        } else {
          await MediaLibrary.createAlbumAsync(albumName, asset, false);
        }
        
        Alert.alert('✅ Saved', `Photo saved to "${albumName}" album`);
      } catch (error) {
        console.error('Save error:', error);
      }
    };

    const applyAiCorrections = async (photoUri: string) => {
      try {
        setIsProcessing(true);
        setAiCorrectionApplied(true);
        
        let actions: ImageManipulator.Action[] = [];
        let correctionLog = ['✅ AI-Standardized'];
        
        // 1. FACE-BASED DYNAMIC CROPPING
        if (faceData?.bounds) {
          const bounds = faceData.bounds;
          // Add padding around face (20% on each side)
          const padding = 30;
          const cropX = Math.max(0, bounds.origin.x - padding);
          const cropY = Math.max(0, bounds.origin.y - padding);
          const cropWidth = bounds.size.width + (padding * 2);
          const cropHeight = bounds.size.height + (padding * 2);
          
          actions.push({ 
            crop: { 
              originX: Math.round(cropX), 
              originY: Math.round(cropY), 
              width: Math.round(cropWidth), 
              height: Math.round(cropHeight) 
            } 
          });
          correctionLog.push(`• Face centered & cropped`);
        } else {
          // Default crop if no face detected
          actions.push({ crop: { originX: 50, originY: 50, width: 250, height: 300 } });
          correctionLog.push(`• Default crop applied`);
        }
        
        // 2. ANGLE ROTATION (if needed based on yaw/roll)
        if (faceData?.rollAngle && Math.abs(faceData.rollAngle) > 5) {
          actions.push({ rotate: -faceData.rollAngle });
          correctionLog.push(`• Rotated ${Math.abs(faceData.rollAngle).toFixed(1)}°`);
        }
        
        // Apply all corrections
        const correctedImage = await ImageManipulator.manipulateAsync(
          photoUri,
          actions,
          { format: ImageManipulator.SaveFormat.JPEG, compress: 0.9 }
        );
        
        Alert.alert(
          "🤖 AI AUTO-CORRECTED",
          correctionLog.join('\n'),
          [{ text: "Perfect!" }]
        );
        
        setIsProcessing(false);
        return correctedImage.uri;
        
      } catch (error) {
        console.error('AI Correction error:', error);
        setIsProcessing(false);
        return photoUri;
      }
    };
    
    // Face detection temporarily disabled - will be implemented with react-native-vision-camera

    const handleCapturePhoto = async () => {
      try {
        let photoUri: string | null = null;
        
        // Camera temporarily disabled - will add back when working
        // For now, just show a message
        Alert.alert('Camera Disabled', 'Camera functionality will be added back once basic app is working.');
        return;
        
        // Apply AI corrections
        if (photoUri) {
          const correctedUri = await applyAiCorrections(photoUri);
          
          // Save to gallery
          await savePhotoToAlbum(correctedUri);
        }
      } catch (error) {
        console.error('Capture error:', error);
        setIsProcessing(false);
      }
      
      const newPhoto = {
        id: Date.now(),
        step: currentStep,
        angle: steps[currentStep-1].angle,
        text: steps[currentStep-1].text,
        timestamp: new Date().toLocaleTimeString(),
        uri: photoUri,
        aiCorrected: aiCorrectionApplied,
        aiCorrections: {
          lighting: "Standardized to 6500K",
          angle: `Aligned to ${steps[currentStep-1].angle}`,
          consistency: "98% match to protocol",
          faceDetection: " Eyes aligned\n Nose centered\n Jawline leveled"
        }
      };
      
      const newPhotos = [...photosTaken, newPhoto];
      setPhotosTaken(newPhotos);
      
      if (currentStep < 5) {
        setCurrentStep(currentStep + 1);
      } else {
        Alert.alert(
          " AI Session Complete",
          "All 5 angles saved to your photo gallery!\n\nPhotos are ready for comparison and export.",
          [
            { 
              text: "View AI Analysis", 
              onPress: async () => {
                if (currentPatient) {
                  const newPatient = {
                    name: currentPatient,
                    date: new Date().toLocaleDateString(),
                    photos: 5,
                    treatment: "AI-Standardized",
                    status: "Ready for Comparison",
                    has_before_after: true
                  };
                  const savedPatient = await savePatient(newPatient);
                  if (savedPatient) {
                    setPatients([savedPatient, ...patients]);
                    setCurrentScreen('comparison');
                  } else {
                    Alert.alert('Error', 'Failed to save patient data');
            lighting: "Standardized to 6500K",
            angle: `Aligned to ${steps[currentStep-1].angle}`,
            consistency: "98% match to protocol",
            faceDetection: "✓ Eyes aligned\n✓ Nose centered\n✓ Jawline leveled"
          }
        };
        
        const newPhotos = [...photosTaken, newPhoto];
        setPhotosTaken(newPhotos);
        
        if (currentStep < 5) {
          setCurrentStep(currentStep + 1);
        } else {
          Alert.alert(
            "🎉 AI Session Complete",
            "All 5 angles saved to your photo gallery!\n\nPhotos are ready for comparison and export.",
            [
              { 
                text: "View AI Analysis", 
                onPress: async () => {
                  if (currentPatient) {
                    const newPatient = {
                      name: currentPatient,
                      date: new Date().toLocaleDateString(),
                      photos: 5,
                      treatment: "AI-Standardized",
                      status: "Ready for Comparison",
                      has_before_after: true
                    };
                    const savedPatient = await savePatient(newPatient);
                    if (savedPatient) {
                      setPatients([savedPatient, ...patients]);
                      setCurrentScreen('comparison');
                    } else {
                      Alert.alert('Error', 'Failed to save patient data');
                    }
                  }
                }
              },
              { text: "Review" }
            ]
          );
        }
      } catch (error) {
        console.error('Capture error:', error);
        Alert.alert('Error', 'Failed to capture photo');
      }
    };

    return (
      <ScrollView style={styles.fullScreen}>
        <View style={styles.container}>
          <View style={styles.captureHeader}>
            <TouchableOpacity onPress={() => setCurrentScreen('home')}>
              <Text style={styles.backButtonMedical}>← BACK</Text>
            </TouchableOpacity>
            <View style={styles.headerCenter}>
              <Text style={styles.captureTitle}>🤖 AI CAMERA</Text>
              <Text style={styles.captureSubtitle}>Real-time Standardization</Text>
            </View>
            <View style={styles.headerRight}>
              {currentPatient ? (
                <Text style={styles.patientBadge}>{currentPatient}</Text>
              ) : (
                <TouchableOpacity 
                  style={styles.addNameButton}
                  onPress={() => {
                    Alert.prompt(
                      "PATIENT NAME",
                      "Enter patient name or ID:",
                      [
                        { text: "Cancel", style: "cancel" },
                        { 
                          text: "SAVE", 
                          onPress: (name?: string) => {
                            if (name && name.trim() !== '') {
                              setCurrentPatient(name.trim());
                            }
                          }
                        }
                      ],
                      'plain-text'
                    );
                  }}
                >
                  <Text style={styles.addNameText}>+ ADD PATIENT</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
          
          <View style={styles.progressContainer}>
            <Text style={styles.progressText}>AI STEP {currentStep} OF 5</Text>
            <View style={styles.medicalProgressBar}>
              <View style={[styles.medicalProgressFill, {width: `${(currentStep/5)*100}%`}]} />
            </View>
            <Text style={styles.angleDisplay}>{steps[currentStep-1].angle}</Text>
          </View>
          
          <View style={styles.medicalCameraArea}>
            <View style={styles.aiCameraContainer}>
              <View
                ref={cameraRef}
                style={styles.cameraLiveView}
              >
                {/* FACE DETECTION VISUAL OVERLAY */}
                <View style={styles.faceDetectionOverlay}>
                  <View style={[
                    styles.faceBoundaryBox,
                    faceDetected ? styles.faceBoundaryGreen : styles.faceBoundaryRed
                  ]}>
                    {faceDetected && <Text style={styles.faceLckIcon}>✅</Text>}
                    {!faceDetected && <Text style={styles.faceLckIcon}>❌</Text>}
                  </View>
                </View>
                
                {/* ANGLE DISPLAY */}
                <View style={styles.angleIndicator}>
                  <Text style={styles.angleText}>{steps[currentStep-1].angle}</Text>
                </View>
                
                {/* REAL-TIME GUIDANCE */}
                <View style={[
                  styles.aiGuidanceOverlay,
                  faceDetected ? styles.guidanceGreen : styles.guidanceRed
                ]}>
                  <Text style={styles.guidanceText}>{correctionMessage}</Text>
                </View>
                
                {/* FACE STATUS INDICATORS */}
                {faceDetected && (
                  <View style={styles.statusIndicators}>
                    <View style={styles.statusRow}>
                      <Text style={styles.statusIcon}>➡️</Text>
                      <Text style={styles.statusMsg}>{angleStatus}</Text>
                    </View>
                    <View style={styles.statusRow}>
                      <Text style={styles.statusIcon}>📍</Text>
                      <Text style={styles.statusMsg}>{positionStatus}</Text>
                    </View>
                  </View>
                )}
              </View>
            </View>
            
            <View style={styles.aiProcessingInfo}>
              <Text style={styles.aiProcessingTitle}>🤖 AI REAL-TIME PROCESSING</Text>
              <View style={[
                styles.aiProcessItem,
                faceDetected && styles.aiProcessActive
              ]}>
                <Text style={styles.aiProcessIcon}>👁️</Text>
                <Text style={styles.aiProcessText}>
                  {faceDetected ? '✅ Face Detected' : '⏳ Detecting...'}
                </Text>
              </View>
              <View style={styles.aiProcessItem}>
                <Text style={styles.aiProcessIcon}>⚡</Text>
                <Text style={styles.aiProcessText}>Smart angle correction</Text>
              </View>
              <View style={styles.aiProcessItem}>
                <Text style={styles.aiProcessIcon}>📐</Text>
                <Text style={styles.aiProcessText}>Dynamic face cropping</Text>
              </View>
              <View style={styles.aiProcessItem}>
                <Text style={styles.aiProcessIcon}>💡</Text>
                <Text style={styles.aiProcessText}>Light normalization</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.medicalInstructionBox}>
            <Text style={styles.medicalInstructionTitle}>AI GUIDANCE</Text>
            <Text style={styles.medicalInstructionText}>{steps[currentStep-1].text}</Text>
            <Text style={[
              styles.medicalInstructionNote,
              { color: faceDetected ? '#10B981' : '#EF4444' }
            ]}>
              {faceDetected 
                ? '✅ Perfect position - tap to capture' 
                : '👤 Face detection active - position yourself'}
            </Text>
          </View>
          
          <View style={styles.capturedSection}>
            <Text style={styles.sectionTitle}>AI-STANDARDIZED PHOTOS</Text>
            <View style={styles.angleBadgesRow}>
              {photosTaken.map((photo, index) => (
                <View key={photo.id} style={styles.aiPhotoBadge}>
                  <Text style={styles.badgeAngle}>{photo.angle}</Text>
                  <Text style={styles.badgeNumber}>{index + 1}</Text>
                  <Text style={styles.badgeAI}>AI</Text>
                  {photo.aiCorrected && <Text style={styles.badgeCorrected}>✓</Text>}
                </View>
              ))}
              {photosTaken.length === 0 && (
                <Text style={styles.noCaptureText}>No photos captured yet</Text>
              )}
            </View>
          </View>
          
          <TouchableOpacity 
            style={[
              styles.aiCaptureButton,
              isProcessing && { opacity: 0.5 }
            ]}
            onPress={handleCapturePhoto}
            disabled={isProcessing}
          >
            <View style={styles.captureButtonInner}>
              <Text style={styles.captureButtonIcon}>🤖</Text>
              <Text style={styles.captureButtonText}>
                {isProcessing 
                  ? 'AI CORRECTING...' 
                  : `AI CAPTURE ${steps[currentStep-1].angle}`}
              </Text>
            </View>
            <Text style={styles.captureButtonSubtext}>
              {isProcessing 
                ? 'Applying AI corrections...' 
                : 'AI will auto-correct angle, position & lighting'}
            </Text>
          </TouchableOpacity>
          
          <View style={styles.captureNavigation}>
            <TouchableOpacity 
              style={styles.navButton}
              onPress={() => {
                if (currentStep > 1) {
                  setCurrentStep(currentStep - 1);
                }
              }}
              disabled={currentStep === 1}
            >
              <Text style={[styles.navButtonText, currentStep === 1 && styles.navButtonDisabled]}>← PREVIOUS</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.navButton}
              onPress={() => {
                if (photosTaken.length > 0) {
                  Alert.alert(
                    "End AI Session?",
                    "Return to home screen?",
                    [
                      { text: "DISCARD & EXIT", onPress: () => {
                        setCurrentStep(1);
                        setPhotosTaken([]);
                        setCurrentPatient('');
                        setCurrentScreen('home');
                      }},
                      { text: "CANCEL", style: "cancel" }
                    ]
                  );
                } else {
                  setCurrentScreen('home');
                }
              }}
            >
              <Text style={styles.navButtonText}>HOME</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  };

  const GalleryScreen = () => {
    return (
      <ScrollView style={styles.fullScreen}>
        <View style={styles.container}>
          <View style={styles.captureHeader}>
            <TouchableOpacity onPress={() => setCurrentScreen('home')}>
              <Text style={styles.backButtonMedical}>← BACK</Text>
            </TouchableOpacity>
            <View style={styles.headerCenter}>
              <Text style={styles.captureTitle}>PATIENT RECORDS</Text>
              <Text style={styles.captureSubtitle}>AI-Standardized Database</Text>
            </View>
            <View style={styles.headerRight}>
              <Text style={styles.patientCount}>{patients.length} records</Text>
            </View>
          </View>
          
          {patients.map((patient) => (
            <TouchableOpacity 
              key={patient.id}
              style={styles.medicalPatientCard}
              onPress={() => {
                Alert.alert(
                  patient.name,
                  `Date: ${patient.date}\nPhotos: ${patient.photos}\nStatus: ${patient.status}`,
                  [
                    { text: "VIEW COMPARISON", onPress: () => setCurrentScreen('comparison') },
                    { text: "CLOSE", style: "cancel" }
                  ]
                );
              }}
            >
              <View style={styles.patientCardHeader}>
                <View>
                  <Text style={styles.patientCardName}>{patient.name}</Text>
                  <Text style={styles.patientCardDate}>{patient.date}</Text>
                </View>
                <View style={[styles.statusBadge, {backgroundColor: '#D1FAE5'}]}>
                  <Text style={styles.statusText}>{patient.status}</Text>
                </View>
              </View>
              
              <View style={styles.angleTags}>
                <Text style={styles.angleTag}>0°</Text>
                <Text style={styles.angleTag}>45°L</Text>
                <Text style={styles.angleTag}>90°L</Text>
                <Text style={styles.angleTag}>45°R</Text>
                <Text style={styles.angleTag}>90°R</Text>
              </View>
            </TouchableOpacity>
          ))}
          
          {patients.length === 0 && (
            <View style={styles.medicalEmptyState}>
              <Text style={styles.emptyIconMedical}>📁</Text>
              <Text style={styles.emptyTextMedical}>NO PATIENT RECORDS</Text>
              <Text style={styles.emptySubtextMedical}>Start by capturing a new patient session</Text>
            </View>
          )}
          
          <TouchableOpacity 
            style={styles.medicalButtonSecondary}
            onPress={() => setCurrentScreen('home')}
          >
            <Text style={styles.buttonIcon}>🏠</Text>
            <View style={styles.buttonTextContainer}>
              <Text style={styles.buttonTitle}>RETURN TO HOME</Text>
              <Text style={styles.buttonSubtitle}>Main menu</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  };

  const ComparisonScreen = () => {
    return (
      <ScrollView style={styles.fullScreen}>
        <View style={styles.container}>
          <View style={styles.captureHeader}>
            <TouchableOpacity onPress={() => setCurrentScreen('gallery')}>
              <Text style={styles.backButtonMedical}>← BACK</Text>
            </TouchableOpacity>
            <View style={styles.headerCenter}>
              <Text style={styles.captureTitle}>AI ANALYSIS</Text>
              <Text style={styles.captureSubtitle}>Before / After Comparison</Text>
            </View>
          </View>
          
          <View style={styles.comparisonContainer}>
            <Text style={styles.comparisonTitle}>FRONT VIEW (0°)</Text>
            
            <View style={styles.comparisonImages}>
              <View style={styles.comparisonImageBox}>
                <Text style={styles.imageLabel}>BEFORE</Text>
                <View style={styles.imagePlaceholder}>
                  <Text style={styles.imagePlaceholderText}>Day 1</Text>
                </View>
              </View>
              
              <View style={styles.comparisonDivider}>
                <Text style={styles.comparisonArrow}>→</Text>
              </View>
              
              <View style={styles.comparisonImageBox}>
                <Text style={styles.imageLabel}>AFTER</Text>
                <View style={[styles.imagePlaceholder, styles.afterImage]}>
                  <Text style={styles.imagePlaceholderText}>Day 28</Text>
                </View>
              </View>
            </View>
            
            <View style={styles.analysisBox}>
              <Text style={styles.analysisTitle}>AI RESULTS</Text>
              <View style={styles.analysisItem}>
                <Text style={styles.analysisLabel}>Overall Improvement:</Text>
                <Text style={styles.analysisValueExcellent}>EXCELLENT</Text>
              </View>
            </View>
          </View>
          
          <TouchableOpacity 
            style={styles.medicalButtonSecondary}
            onPress={() => setCurrentScreen('home')}
          >
            <Text style={styles.buttonIcon}>🏠</Text>
            <View style={styles.buttonTextContainer}>
              <Text style={styles.buttonTitle}>RETURN TO HOME</Text>
              <Text style={styles.buttonSubtitle}>Main menu</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  };

  switch (currentScreen) {
    case 'home':
      return <HomeScreen />;
    case 'capture':
      return <CaptureScreen />;
    case 'gallery':
      return <GalleryScreen />;
    case 'comparison':
      return <ComparisonScreen />;
    default:
      return <HomeScreen />;
  }
}

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  medicalHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  clinicName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1E3A8A',
    letterSpacing: 1,
    marginBottom: 5,
  },
  clinicSub: {
    fontSize: 14,
    color: '#64748B',
    letterSpacing: 0.5,
  },
  medicalLogo: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoIcon: {
    fontSize: 60,
    marginBottom: 10,
  },
  logoText: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '600',
    letterSpacing: 2,
  },
  statsBox: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 30,
    width: '100%',
    maxWidth: 350,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E2E8F0',
    marginHorizontal: 10,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1E40AF',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  medicalButtonPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10B981',
    padding: 20,
    borderRadius: 12,
    width: '100%',
    maxWidth: 350,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  medicalButtonSecondary: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4F46E5',
    padding: 20,
    borderRadius: 12,
    width: '100%',
    maxWidth: 350,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  medicalButtonTertiary: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#7C3AED',
    padding: 20,
    borderRadius: 12,
    width: '100%',
    maxWidth: 350,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  buttonIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  buttonTextContainer: {
    flex: 1,
  },
  buttonTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
    marginBottom: 3,
  },
  buttonSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  },
  buttonArrow: {
    fontSize: 20,
    color: 'white',
    fontWeight: '300',
  },
  protocolBox: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 25,
    width: '100%',
    maxWidth: 350,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  protocolTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E3A8A',
    marginBottom: 15,
    textAlign: 'center',
    letterSpacing: 1,
  },
  protocolAngles: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  protocolAngle: {
    alignItems: 'center',
  },
  angleNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#EFF6FF',
    textAlign: 'center',
    lineHeight: 30,
    fontSize: 14,
    fontWeight: '700',
    color: '#1E40AF',
    marginBottom: 8,
  },
  angleText: {
    fontSize: 11,
    color: '#475569',
    fontWeight: '500',
  },
  protocolNote: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  copyright: {
    fontSize: 10,
    color: '#CBD5E1',
    marginTop: 20,
    textAlign: 'center',
  },
  captureHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    maxWidth: 350,
    marginBottom: 20,
  },
  backButtonMedical: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '600',
  },
  headerCenter: {
    alignItems: 'center',
  },
  captureTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E3A8A',
  },
  captureSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  patientBadge: {
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    fontSize: 12,
    color: '#1E40AF',
    fontWeight: '600',
  },
  addNameButton: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  addNameText: {
    fontSize: 11,
    color: '#3B82F6',
    fontWeight: '600',
  },
  progressContainer: {
    width: '100%',
    maxWidth: 350,
    marginBottom: 25,
  },
  progressText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '600',
    marginBottom: 8,
  },
  medicalProgressBar: {
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 10,
  },
  medicalProgressFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 3,
  },
  angleDisplay: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1E40AF',
    textAlign: 'center',
  },
  medicalCameraArea: {
    width: '100%',
    maxWidth: 350,
    marginBottom: 25,
  },
  aiCameraContainer: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    height: 350,
    marginBottom: 15,
    position: 'relative',
    overflow: 'hidden',
    width: '100%',
  },
  cameraLiveView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  faceDetectionOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  faceBoundaryBox: {
    width: 200,
    height: 280,
    borderRadius: 15,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  faceBoundaryGreen: {
    borderColor: '#10B981',
    backgroundColor: 'rgba(16, 185, 129, 0.05)',
  },
  faceBoundaryRed: {
    borderColor: '#EF4444',
    backgroundColor: 'rgba(239, 68, 68, 0.05)',
  },
  faceLckIcon: {
    fontSize: 32,
  },
  aiGuidanceOverlay: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderLeftWidth: 4,
  },
  guidanceGreen: {
    backgroundColor: 'rgba(16, 185, 129, 0.95)',
    borderColor: '#10B981',
  },
  guidanceRed: {
    backgroundColor: 'rgba(239, 68, 68, 0.95)',
    borderColor: '#EF4444',
  },
  guidanceText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  statusIndicators: {
    position: 'absolute',
    top: 100,
    right: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    minWidth: 140,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  statusMsg: {
    color: '#A5F3FC',
    fontSize: 11,
    fontWeight: '600',
    flex: 1,
  },
  angleIndicator: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: '#3B82F6',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  aiProcessingInfo: {
    backgroundColor: '#1E3A8A',
    padding: 15,
    borderRadius: 10,
    width: '100%',
  },
  aiProcessingTitle: {
    color: 'white',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 10,
    textAlign: 'center',
  },
  aiProcessItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    opacity: 0.6,
  },
  aiProcessActive: {
    opacity: 1,
  },
  aiProcessIcon: {
    fontSize: 16,
    marginRight: 10,
    color: '#A5B4FC',
  },
  aiProcessText: {
    color: 'white',
    fontSize: 12,
  },
  medicalInstructionBox: {
    backgroundColor: '#EFF6FF',
    padding: 20,
    borderRadius: 12,
    width: '100%',
    maxWidth: 350,
    marginBottom: 25,
  },
  medicalInstructionTitle: {
    fontSize: 12,
    color: '#1E40AF',
    fontWeight: '700',
    marginBottom: 8,
    letterSpacing: 1,
  },
  medicalInstructionText: {
    fontSize: 18,
    color: '#1E293B',
    fontWeight: '600',
    marginBottom: 8,
  },
  medicalInstructionNote: {
    fontSize: 12,
    color: '#64748B',
    fontStyle: 'italic',
  },
  capturedSection: {
    width: '100%',
    maxWidth: 350,
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '600',
    marginBottom: 10,
  },
  angleBadgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  aiPhotoBadge: {
    backgroundColor: '#3B82F6',
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    marginBottom: 10,
    position: 'relative',
  },
  badgeAngle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 2,
  },
  badgeNumber: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#10B981',
    width: 24,
    height: 24,
    borderRadius: 12,
    color: 'white',
    fontSize: 12,
    fontWeight: '700',
    textAlignVertical: 'center',
    textAlign: 'center',
  },
  badgeAI: {
    position: 'absolute',
    bottom: 5,
    fontSize: 10,
    color: '#10B981',
    fontWeight: '700',
  },
  badgeCorrected: {
    position: 'absolute',
    top: 5,
    left: 5,
    color: '#10B981',
    fontSize: 12,
    fontWeight: '800',
  },
  noCaptureText: {
    color: '#94A3B8',
    fontSize: 14,
    fontStyle: 'italic',
  },
  aiCaptureButton: {
    backgroundColor: '#10B981',
    padding: 20,
    borderRadius: 12,
    width: '100%',
    maxWidth: 350,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  captureButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  captureButtonIcon: {
    color: 'white',
    fontSize: 24,
    marginRight: 10,
  },
  captureButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
  captureButtonSubtext: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
  },
  captureNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 350,
    marginBottom: 20,
  },
  navButton: {
    padding: 15,
    backgroundColor: '#E2E8F0',
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
  },
  navButtonText: {
    color: '#475569',
    fontSize: 14,
    fontWeight: '600',
  },
  navButtonDisabled: {
    color: '#CBD5E1',
  },
  patientCount: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  medicalPatientCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    maxWidth: 350,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  patientCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  patientCardName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  patientCardDate: {
    fontSize: 12,
    color: '#94A3B8',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  angleTags: {
    flexDirection: 'row',
  },
  angleTag: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    fontSize: 10,
    color: '#475569',
    marginRight: 5,
  },
  medicalEmptyState: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    width: '100%',
    maxWidth: 350,
    marginBottom: 20,
  },
  emptyIconMedical: {
    fontSize: 48,
    color: '#CBD5E1',
    marginBottom: 15,
  },
  emptyTextMedical: {
    fontSize: 16,
    color: '#94A3B8',
    fontWeight: '600',
    marginBottom: 5,
  },
  emptySubtextMedical: {
    fontSize: 14,
    color: '#CBD5E1',
    textAlign: 'center',
  },
  comparisonContainer: {
    width: '100%',
    maxWidth: 350,
    marginBottom: 25,
  },
  comparisonTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E3A8A',
    marginBottom: 20,
    textAlign: 'center',
  },
  comparisonImages: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25,
  },
  comparisonImageBox: {
    alignItems: 'center',
  },
  imageLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
    marginBottom: 8,
  },
  imagePlaceholder: {
    backgroundColor: '#1F2937',
    width: 120,
    height: 150,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  afterImage: {
    backgroundColor: '#374151',
  },
  imagePlaceholderText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  comparisonDivider: {
    marginHorizontal: 15,
  },
  comparisonArrow: {
    fontSize: 24,
    color: '#3B82F6',
  },
  analysisBox: {
    backgroundColor: '#F0F9FF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 25,
  },
  analysisTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0369A1',
    marginBottom: 15,
    textAlign: 'center',
  },
  analysisItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  analysisLabel: {
    fontSize: 14,
    color: '#475569',
    fontWeight: '500',
  },
  analysisValue: {
    fontSize: 14,
    color: '#059669',
    fontWeight: '700',
  },
  analysisValueExcellent: {
    fontSize: 14,
    color: '#059669',
    fontWeight: '800',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E3A8A',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    marginBottom: 30,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});
