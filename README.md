# VapeVerse - React Native Expo App

## 🎉 Your VapeVerse app is now React Native!

This is a complete React Native version of your VapeVerse app built with Expo, featuring:
- **Native iOS & Android apps**
- **Web support** (runs in browser too!)
- **Expo Snack** compatible for easy sharing
- Beautiful native UI with smooth animations

## ✨ Features

### Screens Implemented:
- ✅ **Dashboard** - Welcome screen with stats, loyalty points, and announcements
- ✅ **Products** - Browse vape products with categories and cart functionality
- ✅ **History** - View order history and purchase tracking
- ✅ **Support** - Real-time chat interface with customer support

### Technologies:
- **Expo** - React Native framework
- **React Navigation** - Native navigation with bottom tabs
- **React Query** - Data fetching and caching
- **Lucide React Native** - Beautiful icons
- **NativeWind** - Tailwind CSS for React Native
- **TypeScript** - Type-safe development

## 🚀 Getting Started

### Prerequisites:
- Node.js 18+
- Expo Go app on your phone (for testing)

### Installation:

```bash
# Navigate to project
cd VapeVerse-Native

# Install dependencies (already done)
npm install

# Start the development server
npm start
```

### Running the App:

#### Option 1: Expo Go App (Easiest)
1. Install **Expo Go** on your phone:
   - iOS: App Store
   - Android: Google Play Store
2. Scan the QR code from terminal with:
   - iOS: Camera app
   - Android: Expo Go app

#### Option 2: Emulator/Simulator
```bash
# Android (requires Android Studio)
npm run android

# iOS (requires macOS + Xcode)
npm run ios

# Web browser
npm run web
```

## 📱 Platform Support

| Platform | Status | Notes |
|----------|--------|-------|
| **Android** | ✅ Ready | Build with `npm run android` or EAS Build |
| **iOS** | ✅ Ready | Requires macOS for local builds |
| **Web** | ✅ Ready | Run with `npm run web` |

## 🎯 Connecting to Backend

Update your backend URL in `src/services/api.ts`:

```typescript
const API_URL = 'https://your-backend-url.com/api';
```

The app uses the same backend API as your web version!

## 📦 Building for Production

### Using Expo Application Services (EAS):

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure EAS
eas build:configure

# Build for Android
eas build --platform android

# Build for iOS
eas build --platform ios

# Build for both
eas build --platform all
```

### Local Build (Android):

```bash
# Generate APK
npm run android -- --variant=release
```

## 🔄 Share on Expo Snack

1. Create account at https://snack.expo.dev
2. Copy your code to Snack
3. Share the Snack URL with anyone!
4. They can run it instantly in Expo Go

## 📂 Project Structure

```
VapeVerse-Native/
├── App.tsx                    # Main app with navigation
├── src/
│   ├── screens/              # All screen components
│   │   ├── DashboardScreen.tsx
│   │   ├── ProductsScreen.tsx
│   │   ├── HistoryScreen.tsx
│   │   └── SupportScreen.tsx
│   ├── components/           # Reusable components
│   ├── services/             # API and services
│   │   └── api.ts           # Backend API client
│   ├── types/               # TypeScript types
│   └── navigation/          # Navigation configuration
├── assets/                  # Images, fonts, etc.
└── package.json
```

## 🎨 Customization

### Colors:
Edit `tailwind.config.js`:
```javascript
theme: {
  extend: {
    colors: {
      primary: '#3b82f6',
      secondary: '#8b5cf6',
      accent: '#ec4899',
    },
  },
}
```

### Screens:
All screens are in `src/screens/` - modify them to match your design!

## 🆚 Differences from Web Version

| Feature | Web Version | React Native Version |
|---------|-------------|---------------------|
| **Framework** | React + Vite | React Native + Expo |
| **Styling** | Tailwind CSS | NativeWind + StyleSheet |
| **Navigation** | Wouter | React Navigation |
| **Components** | HTML elements | React Native components |
| **Backend** | Same API ✅ | Same API ✅ |

## 📱 Publishing

### Google Play Store:
```bash
eas build --platform android --profile production
# Submit to Play Store
eas submit --platform android
```

### Apple App Store:
```bash
eas build --platform ios --profile production
# Submit to App Store
eas submit --platform ios
```

### Web Deploy:
```bash
# Build for web
npx expo export --platform web

# Deploy to Vercel/Netlify
# (Upload the web-build folder)
```

## 🐛 Troubleshooting

### App won't start:
```bash
# Clear cache
npm start -- --clear

# Reset Metro bundler
npx expo start --clear
```

### Navigation errors:
```bash
# Rebuild dependencies
rm -rf node_modules
npm install
```

### Icons not showing:
```bash
# Rebuild
npx expo start --clear
```

## 🎯 Next Steps

1. **Test on device** - Install Expo Go and scan QR code
2. **Connect to backend** - Update API URL in `api.ts`
3. **Customize UI** - Edit screens to match your brand
4. **Add features** - Implement authentication, payments, etc.
5. **Build & publish** - Use EAS Build for app stores

## 📚 Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [React Native](https://reactnative.dev/)
- [Expo Snack](https://snack.expo.dev/)

## 🎉 Success!

Your VapeVerse app is now available as:
- ✅ Web app (original)
- ✅ Android app via Capacitor (web wrapper)
- ✅ **Native iOS/Android/Web app via React Native Expo** ⭐ NEW!

Ready to test? Run `npm start` and scan the QR code!
