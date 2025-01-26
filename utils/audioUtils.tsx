import * as DocumentPicker from 'expo-document-picker';

export const importAudioFile = async () => {
  try {
    const file = await DocumentPicker.getDocumentAsync({
      type: 'audio/*',
      copyToCacheDirectory: true,
    });

    if (file.canceled) {
      console.log('User canceled document picker');
      return;
    }

    const audioFile = file.assets[0].uri;

    return audioFile;
  } catch (error) {
    console.error('Error during audio upload:', error);
  }
};

export const uploadAudioFile = async (uri: string, session: string) => {
  try {
    let uriParts = uri.split('.');
    let fileType = uriParts[uriParts.length - 1];
    const formData = new FormData();

    formData.append('file', {
      uri,
      name: `recording.${fileType}`,
      type: `audio/x-${fileType}`,
    } as any);

    formData.append('payload', JSON.stringify({ title: 'Nouvel audio' }));

    const response = await fetch('https://api.floway.edgar-lecomte.fr/api/audio', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${session}`,
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    });

    const jsonResponse = await response.json();
    if (response.ok) {
      return jsonResponse;
    } else {
      console.error('Failed to upload audio:', jsonResponse);
    }
  } catch (error) {
    console.error('Error uploading audio:', error);
  }
};
