import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import React, { useCallback, useMemo, useRef } from 'react';
import { Button, Text, View } from 'react-native';

const Add = () => {
  const snapPoints = useMemo(() => ["25%", "50%", "90%"], []);
  const ref = useRef<BottomSheet>(null);

  const handleSheetChange = useCallback((index: number) => {
    console.log("handleSheetChange", index);
  }, []);

  const handleSnapPress = useCallback((index: number) => {
    ref.current?.snapToIndex(index);
  }, []);

  const handleClosePress = useCallback(() => {
    ref.current?.close();
  }, []);

  return (
       <View className='flex-1' >
      <Text>Add</Text>
      <Button title="Snap To 90%" onPress={() => handleSnapPress(2)} />
      <Button title="Snap To 50%" onPress={() => handleSnapPress(1)} />
      <Button title="Snap To 25%" onPress={() => handleSnapPress(0)} />
      <Button title="Close" onPress={handleClosePress} />

      <BottomSheet
        ref={ref}
        snapPoints={snapPoints}
        onChange={handleSheetChange}
      >
        <BottomSheetView className='flex flex-1 bg-black justify-center items-center'>
          <Text>Bottom Sheet ✅</Text>
        
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
};

export default Add;
