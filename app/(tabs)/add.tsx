import AlertDialog from '@/components/ui/Alert';
import { useToast } from '@/providers/toastProvider';
import React, { useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';


export default function ExampleScreen() {
  const [alertVisible, setAlertVisible] = useState(false);
  const [destructiveAlertVisible, setDestructiveAlertVisible] = useState(false);
  const { toast, success, error, warning } = useToast();

  // AlertDialog Examples
  const handleDeleteConfirm = () => {
    success('Deleted', 'Item has been deleted successfully');
  };

  const handleSaveConfirm = () => {
    success('Saved', 'Your changes have been saved');
  };

  // Toast Examples
  const showDefaultToast = () => {
    toast({
      title: 'Notification',
      description: 'This is a default toast message',
    });
  };

  const showSuccessToast = () => {
    success('Success!', 'Your operation completed successfully');
  };

  const showErrorToast = () => {
    error('Error!', 'Something went wrong. Please try again.');
  };

  const showWarningToast = () => {
    warning('Warning', 'This action cannot be undone');
  };

  const showCustomDurationToast = () => {
    toast({
      title: 'Quick message',
      description: 'This will disappear in 2 seconds',
      duration: 2000,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>AlertDialog Examples</Text>
      
      <Button
        title="Show Confirmation Dialog"
        onPress={() => setAlertVisible(true)}
      />
      
      <Button
        title="Show Destructive Dialog"
        onPress={() => setDestructiveAlertVisible(true)}
        color="#EF4444"
      />

      <Text style={styles.heading}>Toast Examples</Text>
      
      <Button title="Show Default Toast" onPress={showDefaultToast} />
      <Button title="Show Success Toast" onPress={showSuccessToast} />
      <Button title="Show Error Toast" onPress={showErrorToast} />
      <Button title="Show Warning Toast" onPress={showWarningToast} />
      <Button title="Custom Duration (2s)" onPress={showCustomDurationToast} />

      {/* AlertDialogs */}
      <AlertDialog
        visible={alertVisible}
        onClose={() => setAlertVisible(false)}
        title="Are you sure?"
        description="This action will save your changes. Do you want to continue?"
        cancelText="Cancel"
        confirmText="Save"
        onConfirm={handleSaveConfirm}
      />

      <AlertDialog
        visible={destructiveAlertVisible}
        onClose={() => setDestructiveAlertVisible(false)}
        title="Delete Item"
        description="This action cannot be undone. This will permanently delete your item."
        cancelText="Cancel"
        confirmText='delete'
        variant="destructive"
        onConfirm={handleDeleteConfirm}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    gap: 12,
    backgroundColor: '#F8FAFC',
  },
  heading: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 20,
    marginBottom: 10,
    color: '#0F172A',
  },
});