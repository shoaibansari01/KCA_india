import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import ExcelViewer from '../../components/ExcelViewer';

const ExcelViewerScreen = ({navigation, route}: any) => {
  const {fileUrl, fileName} = route.params;

  const handleClose = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <ExcelViewer
        fileUrl={fileUrl}
        fileName={fileName}
        onClose={handleClose}
      />
    </SafeAreaView>
  );
};

export default ExcelViewerScreen;