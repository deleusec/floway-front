import { Audio } from 'expo-av';

const useAudioPermissions = () => {
  const [permissionResponse, requestPermission] = Audio.usePermissions();

  const ensurePermissions = async () => {
    if (!permissionResponse || permissionResponse.status !== 'granted') {
      await requestPermission();
    }
  };

  return { ensurePermissions };
};

export default useAudioPermissions;
