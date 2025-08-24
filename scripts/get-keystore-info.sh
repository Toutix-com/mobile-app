#!/bin/bash

# Script to get keystore information
# This will help you find the key alias and other details

echo "🔑 Keystore Information Extractor"
echo "=================================="

if [ ! -f "android/app/toutix-mobile.keystore" ]; then
    echo "❌ Error: toutix-mobile.keystore not found in android/app/"
    echo "Please make sure the keystore file is in the correct location."
    exit 1
fi

echo "📁 Keystore file found: android/app/toutix-mobile.keystore"
echo ""
echo "🔍 To get your keystore information, run this command:"
echo ""
echo "keytool -list -v -keystore android/app/toutix-mobile.keystore"
echo ""
echo "📝 You'll be prompted for the keystore password."
echo "   Look for 'Alias name:' in the output to find your KEY_ALIAS"
echo ""
echo "💡 After running the command, update these files:"
echo "   1. android/gradle.properties - Replace placeholder values"
echo "   2. GitHub Secrets - Add KEYSTORE_PASSWORD, KEY_ALIAS, KEY_PASSWORD"
echo ""
echo "🔐 Example gradle.properties values:"
echo "   KEYSTORE_PASSWORD=your_actual_password"
echo "   KEY_ALIAS=your_actual_alias"
echo "   KEY_PASSWORD=your_actual_key_password" 