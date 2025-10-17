import React from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, Image, Modal, Platform, Alert, ScrollView } from 'react-native';
import { useSignals } from '@preact/signals-react/runtime';
import { normalize } from '../../utils/responsive';
import { Camera, X, Calendar, ArrowLeft } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { AppText, Icon, Button } from '../../components';
import { StackNavigationProp } from '@react-navigation/stack';
import { userStore } from '../login/store/login.store';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  profileFormData,
  showDatePicker,
  isLoading,
  error,
  isImageLoading,
  permissions,
  selectedImage,
  showImageRemoved,
  setProfileFormData,
  setPermissions,
  initializeFormData,
  checkPermissions,
  handleSelectImage,
  handleRemovePicture,
  handleDateChange,
  handleSaveChanges,
  resetProfileSignals,
} from './store/profile.store';

type EditProfileScreenNavigationProp = StackNavigationProp<any, 'EditProfile'>;

const EditProfileScreen: React.FC = () => {
  useSignals();
  const navigation = useNavigation<EditProfileScreenNavigationProp>();

  // Check permissions on component mount
  React.useEffect(() => {
    checkPermissions().then(setPermissions);
  }, []);

  // Update form data when userStore changes
  React.useEffect(() => {
    initializeFormData();
  }, [userStore.value]);

  // Reset signals when component unmounts
  React.useEffect(() => {
    return () => {
      resetProfileSignals();
    };
  }, []);

  const formatBirthday = (date: Date | undefined) => {
    if (!date) return '';
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).replace(/\//g, '.');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <AppText style={styles.headerTitle}>Edit profile</AppText>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Picture Section */}
        <View style={styles.profilePictureSection}>
          <View style={styles.profilePictureContainer}>
            {selectedImage.value ? (
              <View style={styles.selectedImageContainer}>
                <Image source={{ uri: selectedImage.value.uri }} style={styles.profilePicture} />
                <View style={styles.newImageIndicator}>
                  <Text style={styles.newImageText}>NEW</Text>
                </View>
                {/* Change image overlay */}
                <TouchableOpacity 
                  style={styles.changeImageOverlay} 
                  onPress={handleSelectImage}
                  disabled={isImageLoading.value}
                >
                  {isImageLoading.value ? (
                    <View style={styles.loadingOverlay}>
                      <AppText style={styles.loadingText}>Loading...</AppText>
                    </View>
                  ) : (
                    <Camera color="#FFFFFF" size={normalize(20)} />
                  )}
                </TouchableOpacity>
              </View>
            ) : showImageRemoved.value ? (
              <View style={styles.profilePicturePlaceholder}>
                <AppText style={styles.profilePictureText}>
                  {userStore.value.firstName?.[0] || userStore.value.lastName?.[0] || 'U'}
                </AppText>
                {/* Change image overlay on placeholder */}
                <TouchableOpacity 
                  style={styles.changeImageOverlay} 
                  onPress={handleSelectImage}
                  disabled={isImageLoading.value}
                >
                  {isImageLoading.value ? (
                    <View style={styles.loadingOverlay}>
                      <AppText style={styles.loadingText}>Loading...</AppText>
                    </View>
                  ) : (
                    <Camera color="#FFFFFF" size={normalize(20)} />
                  )}
                </TouchableOpacity>
              </View>
            ) : userStore.value.image ? (
              <View style={styles.existingImageContainer}>
                <Image source={{ uri: userStore.value.image }} style={styles.profilePicture} />
                {/* Change image overlay */}
                <TouchableOpacity 
                  style={styles.changeImageOverlay} 
                  onPress={handleSelectImage}
                  disabled={isImageLoading.value}
                >
                  {isImageLoading.value ? (
                    <View style={styles.loadingOverlay}>
                      <AppText style={styles.loadingText}>Loading...</AppText>
                    </View>
                  ) : (
                    <Camera color="#FFFFFF" size={normalize(20)} />
                  )}
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.profilePicturePlaceholder}>
                <Text style={styles.profilePictureText}>
                  {userStore.value.firstName?.[0] || userStore.value.lastName?.[0] || 'U'}
                </Text>
                {/* Change image overlay on placeholder */}
                <TouchableOpacity 
                  style={styles.changeImageOverlay} 
                  onPress={handleSelectImage}
                  disabled={isImageLoading.value}
                >
                  {isImageLoading.value ? (
                    <View style={styles.loadingOverlay}>
                      <Text style={styles.loadingText}>Loading...</Text>
                    </View>
                  ) : (
                    <Camera color="#FFFFFF" size={normalize(20)} />
                  )}
                </TouchableOpacity>
              </View>
            )}
          </View>
          
          
          {/* Action buttons */}
          <View style={styles.profilePictureActions}>
            {(userStore.value.image || selectedImage.value) && !showImageRemoved.value && (
              <TouchableOpacity 
                style={[styles.actionButton, isImageLoading.value && styles.actionButtonDisabled]} 
                onPress={handleRemovePicture}
                disabled={isImageLoading.value}
              >
                <X color="#D73A49" size={normalize(16)} />
                <AppText style={[styles.actionButtonText, { color: '#D73A49' }]}>Remove picture</AppText>
              </TouchableOpacity>
            )}
            
            {showImageRemoved.value && (
              <TouchableOpacity 
                style={[styles.actionButton, isImageLoading.value && styles.actionButtonDisabled]} 
                onPress={() => {
                  showImageRemoved.value = false;
                  selectedImage.value = null;
                }}
                disabled={isImageLoading.value}
              >
                <AppText style={[styles.actionButtonText, { color: '#0C0453' }]}>Undo</AppText>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Form Fields */}
        <View style={styles.formContainer}>
          {/* Error Display */}
          {error.value && (
            <View style={styles.errorContainer}>
              <AppText style={styles.errorText}>{error.value}</AppText>
            </View>
          )}

          {/* First Name */}
          <View style={styles.inputGroup}>
            <AppText style={styles.inputLabel}>First name</AppText>
            <TextInput
              style={styles.input}
              value={profileFormData.value.firstName}
              onChangeText={(text) => setProfileFormData({ ...profileFormData.value, firstName: text })}
              placeholder="Enter first name"
              placeholderTextColor="#999"
            />
          </View>

          {/* Last Name */}
          <View style={styles.inputGroup}>
            <AppText style={styles.inputLabel}>Last name</AppText>
            <TextInput
              style={styles.input}
              value={profileFormData.value.lastName}
              onChangeText={(text) => setProfileFormData({ ...profileFormData.value, lastName: text })}
              placeholder="Enter last name"
              placeholderTextColor="#999"
            />
          </View>

          {/* Email */}
          <View style={styles.inputGroup}>
            <AppText style={styles.inputLabel}>Email</AppText>
            <TextInput
              style={[styles.input, styles.disabledInput]}
              value={userStore.value.email || ''}
              editable={false}
              placeholder="Enter email"
              placeholderTextColor="#999"
            />
          </View>

          {/* Phone Number */}
          <View style={styles.inputGroup}>
            <AppText style={styles.inputLabel}>Phone number</AppText>
            <TextInput
              style={styles.input}
              value={profileFormData.value.contactNumber}
              onChangeText={(text) => setProfileFormData({ ...profileFormData.value, contactNumber: text })}
              placeholder="Enter phone number"
              placeholderTextColor="#999"
              keyboardType="phone-pad"
            />
          </View>

          {/* Birthday */}
          <View style={styles.inputGroup}>
            <AppText style={styles.inputLabel}>Birthday (Optional)</AppText>
            <TouchableOpacity 
              style={styles.birthdayInputContainer}
              onPress={() => showDatePicker.value = true}
            >
              <TextInput
                style={[styles.input, styles.birthdayInput]}
                value={formatBirthday(profileFormData.value.birthday)}
                placeholder="DD.MM.YYYY"
                placeholderTextColor="#999"
                editable={false}
              />
              <TouchableOpacity style={styles.calendarButton}>
                <Calendar color="#666" size={normalize(20)} />
              </TouchableOpacity>
            </TouchableOpacity>
          </View>

          {/* Address */}
          <View style={styles.inputGroup}>
            <AppText style={styles.inputLabel}>Address (Optional)</AppText>
            <TextInput
              style={[styles.input, styles.addressInput]}
              value={profileFormData.value.address}
              onChangeText={(text) => setProfileFormData({ ...profileFormData.value, address: text })}
              placeholder="Enter address"
              placeholderTextColor="#999"
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>
        </View>
        {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
          <AppText style={styles.closeButtonText}>Close</AppText>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.saveButton, isLoading.value && styles.saveButtonDisabled]} 
          onPress={() => handleSaveChanges(navigation)} 
          disabled={isLoading.value}
        >
          <AppText style={styles.saveButtonText}>
            {isLoading.value ? 'Saving...' : 'Save changes'}
          </AppText>
        </TouchableOpacity>
      </View>
      <View style={{height: normalize(100)}}></View>
      </ScrollView>

      

      {/* Date Picker Modal */}
      {showDatePicker.value && (
        <Modal
          visible={showDatePicker.value}
          transparent
          animationType="fade"
          onRequestClose={() => showDatePicker.value = false}
        >
          <TouchableOpacity
            style={StyleSheet.absoluteFillObject}
            onPress={() => showDatePicker.value = false}
          >
            <View style={styles.modalContent}>
              <DateTimePicker
                value={profileFormData.value.birthday || new Date()}
                mode="date"
                display="default"
                onChange={handleDateChange}
              />
            </View>
          </TouchableOpacity>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: normalize(60),
    paddingHorizontal: normalize(20),
    paddingBottom: normalize(20),
  },
  backButton: {
    marginRight: normalize(10),
  },
  headerTitle: {
    fontSize: normalize(24),
    fontWeight: '700',
    color: '#000000',
  },
  content: {
    flex: 1,
    paddingHorizontal: normalize(20),
  },
  profilePictureSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: normalize(20),
    marginBottom: normalize(30),
  },
  profilePictureContainer: {
    position: 'relative',
    marginRight: normalize(20),
  },
  profilePicture: {
    width: normalize(80),
    height: normalize(80),
    borderRadius: normalize(40),
  },
  profilePicturePlaceholder: {
    width: normalize(80),
    height: normalize(80),
    borderRadius: normalize(40),
    backgroundColor: '#E5E5E5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profilePictureText: {
    fontSize: normalize(24),
    fontWeight: '600',
    color: '#666',
  },
  formContainer: {
    gap: normalize(20),
  },
  inputGroup: {
    gap: normalize(8),
  },
  inputLabel: {
    fontSize: normalize(16),
    fontWeight: '600',
    color: '#000000',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: normalize(8),
    paddingHorizontal: normalize(16),
    paddingVertical: normalize(12),
    fontSize: normalize(16),
    color: '#000000',
    backgroundColor: '#FFFFFF',
  },
  disabledInput: {
    backgroundColor: '#F5F5F5',
    color: '#666666',
  },
  addressInput: {
    height: normalize(80),
    paddingTop: normalize(12),
  },
  birthdayInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  birthdayInput: {
    flex: 1,
  },
  calendarButton: {
    position: 'absolute',
    right: normalize(16),
    padding: normalize(4),
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: normalize(20),
    paddingVertical: normalize(20),
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  closeButton: {
    paddingVertical: normalize(12),
    paddingHorizontal: normalize(24),
  },
  closeButtonText: {
    fontSize: normalize(16),
    fontWeight: '600',
    color: '#000000',
  },
  saveButton: {
    backgroundColor: '#0C0453',
    paddingVertical: normalize(12),
    paddingHorizontal: normalize(24),
    borderRadius: normalize(8),
  },
  saveButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  saveButtonText: {
    fontSize: normalize(16),
    fontWeight: '600',
    color: '#FFFFFF',
  },
  modalContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  errorContainer: {
    backgroundColor: '#FFEBEB',
    borderWidth: 1,
    borderColor: '#D73A49',
    borderRadius: normalize(8),
    paddingVertical: normalize(12),
    paddingHorizontal: normalize(16),
    alignItems: 'center',
  },
  errorText: {
    color: '#D73A49',
    fontSize: normalize(14),
    fontWeight: '600',
  },
  profilePictureActions: {
    flexDirection: 'row',
    gap: normalize(10),
    marginTop: normalize(10),
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: normalize(4),
    paddingVertical: normalize(8),
    paddingHorizontal: normalize(12),
    borderRadius: normalize(6),
    borderColor: '#D21B23',
    borderWidth: 1,
  },
  actionButtonDisabled: {
    opacity: 0.7,
  },
  actionButtonText: {
    fontSize: normalize(14),
    fontWeight: '600',
    color: '#0C0453',
  },
  noteText: {
    fontSize: normalize(12),
    color: '#666',
    marginTop: normalize(10),
    textAlign: 'center',
    fontStyle: 'italic',
  },
  permissionNote: {
    fontSize: normalize(12),
    color: '#666',
    marginTop: normalize(10),
    textAlign: 'center',
    fontStyle: 'italic',
  },
  selectedImageContainer: {
    position: 'relative',
  },
  newImageIndicator: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#0C0453',
    borderRadius: normalize(10),
    paddingVertical: normalize(4),
    paddingHorizontal: normalize(8),
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  newImageText: {
    color: '#FFFFFF',
    fontSize: normalize(12),
    fontWeight: '600',
  },
  permissionButton: {
    backgroundColor: '#0C0453',
    paddingVertical: normalize(12),
    paddingHorizontal: normalize(24),
    borderRadius: normalize(8),
    marginTop: normalize(10),
    alignSelf: 'center',
  },
  permissionButtonText: {
    fontSize: normalize(16),
    fontWeight: '600',
    color: '#FFFFFF',
  },
  changeImageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: normalize(40),
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  existingImageContainer: {
    position: 'relative',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: normalize(40),
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: normalize(16),
    fontWeight: '600',
  },
});

export default EditProfileScreen; 