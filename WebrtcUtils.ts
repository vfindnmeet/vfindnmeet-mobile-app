import { mediaDevices } from 'react-native-webrtc';

export const ConnectionState = {
  CONNECTING: 'connecting',
  CONNECTED: 'connected',
  DISCONNECTED: 'disconnected',
  FAILED: 'failed',
  CLOSED: 'closed',
};

export const webrtcConfig = {
  iceServers: [
    {
      urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
    },
  ],
  iceCandidatePoolSize: 10,
};

export const getCameraStream = async () => {
  const availableDevices = await mediaDevices.enumerateDevices();
  const { deviceId: sourceId } = availableDevices.find(
    // once we get the stream we can just call .switchCamera() on the track to switch without re-negotiating
    // ref: https://github.com/react-native-webrtc/react-native-webrtc#mediastreamtrackprototype_switchcamera
    (device: any) => device.kind === 'videoinput' && device.facing === 'front',
  );

  const streamBuffer = await mediaDevices.getUserMedia({
    audio: true,
    video: {
      mandatory: {
        // Provide your own width, height and frame rate here
        minWidth: 500,
        minHeight: 300,
        minFrameRate: 30,
      },
      facingMode: 'user',
      optional: [{ sourceId }],
    },
  });

  return streamBuffer;
};
