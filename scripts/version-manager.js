#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Version configuration
const VERSION_CONFIG = {
  major: 1,
  minor: 0,
  patch: 0,
  buildOffset: 0 // Starting build number
};

// File paths
const ANDROID_BUILD_GRADLE = 'android/app/build.gradle';
const IOS_PROJECT_PBXPROJ = 'ios/toutixApp.xcodeproj/project.pbxproj';

// Get current timestamp for build number
function getBuildNumber() {
  const now = new Date();
  const year = now.getFullYear() - 2000; // 25 for 2025
  const month = now.getMonth() + 1; // 1-12
  const day = now.getDate(); // 1-31
  const hour = now.getHours(); // 0-23
  const minute = Math.floor(now.getMinutes() / 10); // 0-5 (10-minute intervals)
  
  return parseInt(`${year}${month.toString().padStart(2, '0')}${day.toString().padStart(2, '0')}${hour.toString().padStart(2, '0')}${minute}`);
}

// Update Android version
function updateAndroidVersion(buildNumber) {
  if (!fs.existsSync(ANDROID_BUILD_GRADLE)) {
    console.log('⚠️  Android build.gradle not found');
    return;
  }

  let content = fs.readFileSync(ANDROID_BUILD_GRADLE, 'utf8');
  
  // Update versionCode
  content = content.replace(
    /versionCode\s+\d+/,
    `versionCode ${buildNumber}`
  );
  
  // Update versionName
  const versionName = `${VERSION_CONFIG.major}.${VERSION_CONFIG.minor}.${VERSION_CONFIG.patch}`;
  content = content.replace(
    /versionName\s+["'][^"']*["']/,
    `versionName "${versionName}"`
  );
  
  fs.writeFileSync(ANDROID_BUILD_GRADLE, content);
  console.log(`✅ Android: versionName ${versionName}, versionCode ${buildNumber}`);
}

// Update iOS version
function updateIOSVersion(buildNumber) {
  if (!fs.existsSync(IOS_PROJECT_PBXPROJ)) {
    console.log('⚠️  iOS project.pbxproj not found');
    return;
  }

  let content = fs.readFileSync(IOS_PROJECT_PBXPROJ, 'utf8');
  
  // Update CURRENT_PROJECT_VERSION
  content = content.replace(
    /CURRENT_PROJECT_VERSION\s*=\s*\d+;/g,
    `CURRENT_PROJECT_VERSION = ${buildNumber};`
  );
  
  // Update MARKETING_VERSION
  const versionName = `${VERSION_CONFIG.major}.${VERSION_CONFIG.minor}.${VERSION_CONFIG.patch}`;
  content = content.replace(
    /MARKETING_VERSION\s*=\s*[^;]+;/g,
    `MARKETING_VERSION = ${versionName};`
  );
  
  fs.writeFileSync(IOS_PROJECT_PBXPROJ, content);
  console.log(`✅ iOS: versionName ${versionName}, buildNumber ${buildNumber}`);
}

// Main function
function main() {
  console.log('🚀 Version Manager for Toutix App');
  console.log('==================================');
  
  const buildNumber = getBuildNumber();
  console.log(`📅 Generated build number: ${buildNumber}`);
  console.log('');
  
  updateAndroidVersion(buildNumber);
  updateIOSVersion(buildNumber);
  
  console.log('');
  console.log('🎉 Version update complete!');
  console.log(`📱 Next build will use version ${VERSION_CONFIG.major}.${VERSION_CONFIG.minor}.${VERSION_CONFIG.patch} (${buildNumber})`);
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { main, getBuildNumber }; 