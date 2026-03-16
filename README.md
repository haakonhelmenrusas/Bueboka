# Bueboka

![Bueboka Logo](./github_assets/logo.png)

[![Get it on Google Play](./github_assets/PlayStore.png)](https://play.google.com/store/apps/details?id=com.aaronshade.bueboka&hl=no_nb)
[![Download on the App Store](./github_assets/AppStore.png)](https://apps.apple.com/no/app/bueboka/id6448108838?l=nb)

## About

**Bueboka** is a comprehensive archery tracking application designed for archers of all levels to monitor their progress, manage equipment, and improve their skills. Whether you're practicing at the range or competing, Bueboka helps you keep detailed records of your archery journey.

### Features

- **Practice Tracking**: Log detailed practice sessions including scores, distances, weather conditions, and notes
- **Equipment Management**: Keep track of your bows and arrow sets with detailed specifications
- **Profile Management**: Customize your profile with club information and profile images
- **Offline Support**: Continue using the app even without internet connection - data syncs automatically when back online
- **Authentication**: Secure login with email/password, Google, or Apple sign-in
- **Email Verification**: Secure account verification system
- **Data Visualization**: View your progress with charts and statistics
- **Round Types**: Support for various competition and practice round formats
- **Weather Tracking**: Record environmental conditions for each practice session
- **Ballistics Calculator**: Advanced sight mark calculations for precision shooting

### Platform Availability

- **Mobile Apps**: Available for iOS and Android
- **Web Application**: Access Bueboka from your browser at [bueboka.no](https://bueboka.no)
- **Cross-Platform**: Seamless experience across all devices

## Related Projects

- **Web Version**: [Bueboka Web Repository](https://github.com/Aaronshades/bueboka-web) - The companion web application
- **API Backend**: The backend API powering both mobile and web applications

## Community

- **Discussions**: Join the [forum](https://github.com/Aaronshades/Bueboka/discussions) to share ideas and get help
- **Contributing**: Check out the [contribution guide](./CONTRIBUTING.md) to get involved
- **Code of Conduct**: Read our [Code of Conduct](./CODE_OF_CONDUCT.md) to understand our community values

## Technology Stack

### Core Technologies

- **React Native**: Cross-platform mobile development
- **Expo SDK 55**: Development platform and build system
- **TypeScript**: Type-safe development
- **Expo Router**: File-based navigation system

### Authentication & Security

- **Better Auth**: Modern authentication library with multi-provider support
- **@better-auth/expo**: Expo-specific authentication client
- **Expo Secure Store**: Secure token storage
- **Sentry**: Error tracking and monitoring

### UI & Styling

- **React Native Gesture Handler**: Advanced gesture recognition
- **React Native Reanimated**: Smooth animations
- **React Native SVG**: SVG rendering support
- **FontAwesome Icons**: Comprehensive icon library
- **React Native Gifted Charts**: Data visualization
- **Expo Linear Gradient**: Beautiful gradient effects

### Data Management

- **Axios**: HTTP client for API communication
- **AsyncStorage**: Local data persistence
- **NetInfo**: Network connectivity monitoring
- **Date-fns**: Date manipulation and formatting

### Development Tools

- **ESLint**: Code linting with Expo config
- **Prettier**: Code formatting
- **Husky**: Git hooks for quality checks
- **Jest**: Unit testing framework
- **TypeScript**: Static type checking

### Native Features

- **Expo Image Picker**: Access device photo library
- **Expo File System**: File management
- **Expo Network**: Network state detection
- **Expo Device**: Device information
- **@react-native-community/datetimepicker**: Native date/time selection
- **@react-native-picker/picker**: Native picker component

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or later) - [Download](https://nodejs.org/en/)
- **npm** or **yarn** - Comes with Node.js
- **Expo CLI** - [Installation Guide](https://docs.expo.dev/get-started/installation/)

### For Native Development

- **Android Studio** - [Download](https://developer.android.com/studio)
  - Android SDK (API level 36 "Baklava")
  - Java Development Kit (JDK)
- **Xcode** (macOS only, for iOS) - [Download](https://developer.apple.com/xcode/)
  - iOS 15.1 or later deployment target

### Optional

- **Android Emulator** or physical Android device
- **iOS Simulator** (macOS only) or physical iOS device
- **EAS CLI** for building and deploying - `npm install -g eas-cli`

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Aaronshades/Bueboka-app.git
cd Bueboka-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```env
API_URL=your_api_url_here
```

### 4. Start Development Server

```bash
npm start
# or
expo start
```

### 5. Run on Platform

Choose one of the following:

```bash
# Run on iOS
npm run ios
# or
expo run:ios

# Run on Android
npm run android
# or
expo run:android

# Run on Web
npm run web
```

## Available Scripts

- `npm start` - Start the Expo development server
- `npm run android` - Run on Android device/emulator
- `npm run ios` - Run on iOS device/simulator
- `npm run web` - Run in web browser
- `npm test` - Run test suite
- `npm run test:watch` - Run tests in watch mode
- `npm run lint` - Lint code with ESLint
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

## Project Structure

```
Buboka-app/
├── app/                    # App screens (Expo Router)
│   ├── (tabs)/            # Tab-based navigation
│   │   ├── practice/      # Practice tracking screens
│   │   ├── profile/       # User profile & equipment
│   │   ├── settings/      # App settings
│   │   └── sightMarks/    # Ballistics calculator
│   ├── auth.tsx           # Authentication screen
│   └── _layout.tsx        # Root layout
├── components/            # Reusable UI components
│   ├── common/           # Common components (Button, Input, etc.)
│   ├── practice/         # Practice-specific components
│   ├── profile/          # Profile-specific components
│   └── settings/         # Settings components
├── contexts/             # React Context providers
├── hooks/               # Custom React hooks
├── services/            # API services & business logic
│   ├── api/            # API client configuration
│   ├── auth/           # Authentication services
│   ├── offline/        # Offline sync management
│   └── repositories/   # Data access layer
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── styles/             # Global styles and theme

```

## Architecture

### Repository Pattern

The app uses a repository pattern for data access, providing a clean abstraction over API calls. See [services/repositories/README.md](./services/repositories/README.md) for detailed documentation.

### Offline Support

Bueboka includes robust offline functionality:
- Automatic request queueing when offline
- Background sync when connection is restored
- Optimistic UI updates for better user experience
- Conflict resolution strategies

### Authentication Flow

The app implements a comprehensive authentication system:
- Email/password authentication
- Social login (Google, Apple)
- Email verification
- Secure token storage
- Automatic session management
- Account deletion

## Future Features

### Cross-Platform Sync 🔄

We're working on seamless synchronization between the mobile app and web application:

- **Real-time Sync**: Automatic data synchronization across all your devices
- **Conflict Resolution**: Smart merging of changes made on different devices
- **Offline-First**: Changes made offline will sync automatically when you're back online
- **Session Continuity**: Start on mobile, continue on web, and vice versa
- **Backup & Restore**: Automatic cloud backup of all your archery data

### Coming Soon

- **Competition Tracking**: Dedicated competition mode with advanced scoring
- **Achievement System**: Unlock achievements as you progress
- **Social Features**: Connect with other archers, share progress
- **Advanced Analytics**: Deeper insights into your performance trends
- **Equipment Recommendations**: AI-powered equipment suggestions
- **Training Programs**: Structured practice plans and goals
- **Video Analysis**: Record and analyze your shooting form

## Building for Production

### EAS Build

```bash
# Install EAS CLI
npm install -g eas-cli

# Configure EAS
eas build:configure

# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android
```

### Local Builds

```bash
# iOS (requires macOS)
npm run ios --configuration Release

# Android
npm run android --variant release
```

## Troubleshooting

### Common Issues

**iOS Build Errors:**
```bash
# Clean iOS build
cd ios && rm -rf build Pods Podfile.lock
pod install
cd ..
```

**Android Build Errors:**
```bash
# Clean Android build
cd android
./gradlew clean
cd ..
```

**Metro Bundler Cache:**
```bash
# Clear cache
expo start -c
# or
npm start -- --reset-cache
```

**Node Modules:**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed contribution guidelines.

## License

This project is licensed under the terms specified in [LICENSE](./LICENSE).

## Authors

**Rusås Design**
- Email: kontakt@rusåsdesign.no
- Website: [rusasdesign.no](https://rusasdesign.no)

## Support

- **Issues**: Report bugs or request features via [GitHub Issues](https://github.com/Aaronshades/Bueboka/issues)
- **Discussions**: Ask questions and share ideas in [GitHub Discussions](https://github.com/Aaronshades/Bueboka/discussions)
- **Email**: kontakt@rusåsdesign.no

---

Made with ❤️ for the archery community
