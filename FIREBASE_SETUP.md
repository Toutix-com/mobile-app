# Firebase App Distribution Setup

This guide explains how to set up Firebase App Distribution for your React Native app using GitHub Actions.

## Prerequisites

1. **Firebase Project**: You need a Firebase project with App Distribution enabled
2. **GitHub Repository**: Your code should be in a GitHub repository
3. **Firebase CLI**: Install Firebase CLI locally to get the required credentials

## Setup Steps

### 1. Enable Firebase App Distribution

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (`mobilepipe-ba83f`)
3. Go to **App Distribution** in the left sidebar
4. Click **Get started**
5. Add your Android and iOS apps

### 2. Get Firebase App IDs

After adding your apps, you'll get App IDs like:
- Android: `1:912281763788:android:xxxxxxxxxxxx`
- iOS: `1:912281763788:ios:xxxxxxxxxxxx`

### 3. Generate Service Account Key

1. Go to **Project Settings** > **Service accounts**
2. Click **Generate new private key**
3. Download the JSON file
4. Copy the entire content of the JSON file

### 4. Set GitHub Secrets

Go to your GitHub repository > **Settings** > **Secrets and variables** > **Actions** and add these secrets:

#### Required Secrets:

- `FIREBASE_APP_ID_ANDROID`: Your Android app ID from Firebase
- `FIREBASE_APP_ID_IOS`: Your iOS app ID from Firebase
- `FIREBASE_SERVICE_ACCOUNT_ANDROID`: Content of the service account JSON file
- `FIREBASE_SERVICE_ACCOUNT_IOS`: Content of the service account JSON file
- `KEYSTORE_PASSWORD`: Your Android keystore password
- `KEY_ALIAS`: Your Android keystore key alias
- `KEY_PASSWORD`: Your Android keystore key password

#### Optional Secrets (for iOS):

- `MATCH_PASSWORD`: Password for your code signing certificates
- `FASTLANE_APPLE_APPLICATION_SPECIFIC_PASSWORD`: App-specific password for Apple ID

### 5. Configure Test Groups

1. In Firebase App Distribution, go to **Testers and groups**
2. Create a group called `testers`
3. Add your testers' email addresses

### 6. Configure Android Release Keystore

1. **Place your keystore file**: Put `toutix-mobile.keystore` in `android/app/`
2. **Keystore details** (already configured):
   - **Keystore password**: `toutix`
   - **Key alias**: `my-key-alias`
   - **Key password**: `toutix`
3. **Add keystore secrets** to GitHub:
   - `KEYSTORE_PASSWORD`: `toutix`
   - `KEY_ALIAS`: `my-key-alias`
   - `KEY_PASSWORD`: `toutix`

### 7. Test the Workflow

1. Create a `test` branch
2. Make some changes
3. Push to the `test` branch
4. Check the **Actions** tab in GitHub to see the workflow running

## Workflow Details

The GitHub Actions workflow will:

1. **Trigger**: When code is pushed to or merged into the `test` branch
2. **Update Versions**: Automatically increment build numbers for both platforms
3. **Build**: Create APK (Android) and IPA (iOS) files with unique versions
4. **Distribute**: Upload to Firebase App Distribution with the `testers` group
5. **Release Notes**: Include commit hash, branch name, and commit message

## Version Management

### **Automatic Version Incrementing**
- **Build numbers** are automatically generated based on timestamp
- **Format**: `YYMMDDHHMM` (e.g., `2508231430` for Aug 23, 2025, 14:30)
- **Version names** remain consistent (e.g., `1.0.0`)
- **No manual version updates** required

### **Version Strategy**
- **Major.Minor.Patch**: `1.0.0` (manual updates for significant changes)
- **Build Number**: Auto-generated timestamp-based number
- **Firebase Compatibility**: Each build gets a unique version
- **No Duplicate Version Conflicts**: Automatic resolution

## Troubleshooting

### Common Issues:

1. **Build Failures**: Check the build logs in GitHub Actions
2. **Firebase Upload Failures**: Verify your service account credentials
3. **iOS Build Issues**: Ensure your provisioning profiles are set up correctly

### Manual Testing:

You can test the Firebase distribution manually:

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Distribute manually
firebase appdistribution:distribute "path/to/app.apk" \
  --app YOUR_APP_ID \
  --groups testers \
  --release-notes "Manual test"
```

## Security Notes

- Never commit service account keys to your repository
- Use GitHub Secrets for all sensitive information
- Regularly rotate your Firebase service account keys
- Limit the scope of your service account to only what's needed 