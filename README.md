# Expense Tracker App

A comprehensive React Native expense tracking application with filtering, charts, and real-time updates.

## Features

- ✅ Add, edit, and delete expenses
- 📊 Visual charts showing expense breakdown by category
- 🔍 Filter expenses by date range and category
- 💰 Real-time total calculations
- 📱 Beautiful blue-themed UI
- 💾 Local storage with AsyncStorage


## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [React Native CLI](https://reactnative.dev/docs/environment-setup)
- [Android Studio](https://developer.android.com/studio) (for Android development)
- [Xcode](https://developer.apple.com/xcode/) (for iOS development - macOS only)

## Installation

### 1. Clone the repository
```bash
git clone https://github.com/your-username/expense-tracker-app.git
cd expense-tracker-app
```

### 2. Install dependencies
```bash
npm install
```

### 3. Install iOS dependencies (iOS only)
```bash
cd ios && pod install && cd ..
```

## Development

### Start Metro Bundler
```bash
npx react-native start
```

### Run on Android
```bash
npx react-native run-android
```

### Run on iOS
```bash
npx react-native run-ios
```

## Building APK for Testing

### Debug APK (for testing)

1. **Generate Debug APK:**
```bash
cd android
./gradlew assembleDebug
```

2. **Locate the APK:**
The debug APK will be generated at:
```
android/app/build/outputs/apk/debug/app-debug.apk
```

### Release APK (for production)

1. **Generate a signing key:**
```bash
keytool -genkeypair -v -storetype PKCS12 -keystore my-upload-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

2. **Add signing config to `android/app/build.gradle`:**
```gradle
android {
    ...
    signingConfigs {
        release {
            if (project.hasProperty('MYAPP_UPLOAD_STORE_FILE')) {
                storeFile file(MYAPP_UPLOAD_STORE_FILE)
                storePassword MYAPP_UPLOAD_STORE_PASSWORD
                keyAlias MYAPP_UPLOAD_KEY_ALIAS
                keyPassword MYAPP_UPLOAD_KEY_PASSWORD
            }
        }
    }
    buildTypes {
        release {
            ...
            signingConfig signingConfigs.release
        }
    }
}
```

3. **Create `android/gradle.properties`:**
```properties
MYAPP_UPLOAD_STORE_FILE=my-upload-key.keystore
MYAPP_UPLOAD_KEY_ALIAS=my-key-alias
MYAPP_UPLOAD_STORE_PASSWORD=*****
MYAPP_UPLOAD_KEY_PASSWORD=*****
```

4. **Generate Release APK:**
```bash
cd android
./gradlew assembleRelease
```

5. **Locate the Release APK:**
```
android/app/build/outputs/apk/release/app-release.apk
```

## Installing APK on Device

### Method 1: Using ADB (Android Debug Bridge)

1. **Enable Developer Options on your Android device:**
   - Go to Settings → About Phone
   - Tap "Build Number" 7 times
   - Go back to Settings → Developer Options
   - Enable "USB Debugging"

2. **Connect your device via USB**

3. **Install APK using ADB:**
```bash
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

### Method 2: Direct Installation

1. **Copy APK to device:**
   - Transfer the APK file to your device via USB, email, or cloud storage

2. **Install on device:**
   - Open file manager on your device
   - Navigate to the APK file
   - Tap the APK file
   - Allow installation from unknown sources if prompted
   - Follow the installation prompts

### Method 3: Using Android Studio

1. **Open Android Studio**
2. **Select "Profile or Debug APK"**
3. **Choose your APK file**
4. **Deploy to connected device**

## Testing

### Manual Testing Checklist

- [ ] **Add Expense:**
  - Can add expense with title, amount, and category
  - Validation works for empty fields
  - Navigation works correctly

- [ ] **View Expenses:**
  - Home screen shows all expenses
  - Total calculation is correct
  - Chart displays properly

- [ ] **Edit Expense:**
  - Can edit existing expenses
  - Changes are saved correctly
  - UI updates in real-time

- [ ] **Delete Expense:**
  - Can delete expenses
  - Confirmation dialog appears
  - Data updates correctly

- [ ] **Filter Functionality:**
  - Date range filtering works
  - Category filtering works
  - Clear filters works
  - Filter summary displays correctly

- [ ] **Chart Functionality:**
  - Pie chart displays correctly
  - Categories are color-coded
  - Chart updates with filters

### Device Testing

Test on different devices and screen sizes:
- **Small screens:** 5" phones
- **Medium screens:** 6" phones
- **Large screens:** Tablets
- **Different Android versions:** 8.0+

### Performance Testing

- Test with large datasets (100+ expenses)
- Test memory usage
- Test app startup time
- Test navigation performance

## Troubleshooting

### Common Issues

1. **Metro bundler issues:**
```bash
npx react-native start --reset-cache
```

2. **Android build issues:**
```bash
cd android && ./gradlew clean && cd ..
```

3. **iOS build issues:**
```bash
cd ios && pod install && cd ..
```

4. **App crashes on startup:**
   - Check device logs using `adb logcat`
   - Verify all dependencies are installed
   - Check for permission issues

### Debug Commands

```bash
# View device logs
adb logcat

# View React Native logs
npx react-native log-android  # Android
npx react-native log-ios      # iOS

# Clear app data
adb shell pm clear com.expenseapp

# Uninstall app
adb uninstall com.expenseapp
```

## APK Distribution

### Internal Testing

1. **Upload to Google Play Console (Internal Testing)**
2. **Share APK via Firebase App Distribution**
3. **Use TestFlight for iOS**

### External Testing

1. **Google Play Console (Alpha/Beta testing)**
2. **Direct APK distribution**
3. **Enterprise distribution**

## Dependencies

Key dependencies used in this project:

- `react-native`: Core framework
- `@react-navigation/native`: Navigation
- `react-native-chart-kit`: Charts
- `@react-native-picker/picker`: Dropdown picker
- `@react-native-community/datetimepicker`: Date picker
- `@react-native-async-storage/async-storage`: Local storage
- `react-native-svg`: SVG support for charts

## App Architecture

```
src/
├── screens/
│   ├── HomeScreen.tsx          # Main dashboard
│   ├── AddExpenses.tsx         # Add expense form
│   ├── ExpenseDetailScreen.tsx # View/edit expense
│   └── ChartScreen.tsx         # Charts view
├── utils/
│   └── expenseUtils.ts         # Data management
└── components/
    └── [Reusable components]
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For issues and questions:
- Create an issue on GitHub
- Email: your-email@example.com

---

**Happy Expense Tracking! 💰📊**
