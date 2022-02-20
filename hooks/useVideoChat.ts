import { Dimensions } from 'react-native';
import { useRef, useState, useEffect, useContext } from 'react';
import {
  RTCPeerConnection,
  RTCIceCandidate,
  RTCSessionDescription,
  MediaStream,
} from 'react-native-webrtc';
import { WsContext } from '../store/WsContext';
import { ConnectionState, getCameraStream, webrtcConfig } from '../WebrtcUtils';
import InCallManager from 'react-native-incall-manager';
import useOnMessage from './useOnMessage';

const { width, height } = Dimensions.get('screen');

export default function useVideoChat({
  calledId,
  callerId,
  remoteScreenDimension
}: {
  calledId: string;
  callerId: string;
  remoteScreenDimension: {
    width: number;
    height: number;
  }
}) {
  const [peerConnectionState, setPeerConnectionState] = useState(null);

  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);

  const [localScreenSize, setLocalScreenSize] = useState(remoteScreenDimension);

  const peerConnection = useRef<RTCPeerConnection>();
  const localStreamR = useRef<MediaStream | null>(null);
  const remoteStreamR = useRef<MediaStream | null>(null);

  const { loggedUserId, subj, sendMessage } = useContext(WsContext);

  const initLocalStream = async () => {
    const streamBuffer = await getCameraStream();

    localStreamR.current = streamBuffer;
    setLocalStream(streamBuffer);
  };

  const cleanConnection = () => {
    if (remoteStreamR.current) {
      remoteStreamR.current.getTracks().forEach(t => t.stop());
      remoteStreamR.current.release();
    }
    setRemoteStream(null);
    remoteStreamR.current = null;

    if (localStreamR.current) {
      localStreamR.current.getTracks().forEach(t => t.stop());
      localStreamR.current.release();
    }

    if (peerConnection.current) {
      peerConnection.current.close();
    }
  };

  const refreshLocalStream = async () => {
    if (localStreamR.current) {
      localStreamR.current.getTracks().forEach(t => t.stop());
      localStreamR.current.release();
    }
    await initLocalStream();

    if (!peerConnection.current || !localStreamR.current) return;

    peerConnection.current.addStream(localStreamR.current);
  };

  const beginOfferExchange = async (shouldRefreshLocalStream = false) => {
    if (shouldRefreshLocalStream) {
      await refreshLocalStream();
    }

    const targetId = calledId === loggedUserId ? callerId : calledId;

    if (!peerConnection.current) return;

    peerConnection.current.onicecandidate = (event) => {
      event.candidate && sendMessage('p2p-candidate-offer', {
        calledId: targetId,
        candidate: (event.candidate as any).toJSON()
      });
    };

    const offer = await peerConnection.current.createOffer();
    await peerConnection.current.setLocalDescription(offer);

    sendMessage('p2p-offer', {
      calledId: targetId,
      offer
    });
  };

  const initPeerConnection = () => {
    peerConnection.current = new RTCPeerConnection(webrtcConfig);

    peerConnection.current.onconnectionstatechange = (e: any) => {
      console.log('state:', e.target.connectionState);
      setPeerConnectionState(e.target.connectionState);
    };
    peerConnection.current.oniceconnectionstatechange = (e: any) => {
      console.log('ice state:', e.target.iceConnectionState);
      // setPeerConnectionState(e.target.connectionState);

      if ([ConnectionState.CLOSED, ConnectionState.FAILED].includes(e.target.iceConnectionState)) {
        setPeerConnectionState(e.target.iceConnectionState);
      }
    };
    peerConnection.current.onaddstream = event => {
      setRemoteStream(event.stream);
      remoteStreamR.current = event.stream;

      remoteStreamR.current.getTracks().forEach((track) => {
        if (track.kind !== 'video') return;

        // Listening for frozen streams
        track.onmute = () => {
          sendMessage('video-frozen', { calledId, callerId });
          // alert('remote stream freeze');
        };
      });
    };

    if (localStreamR.current) {
      peerConnection.current.addStream(localStreamR.current);
    }

    // setTimeout(() => {
    //   // console.log(peerConnection.current?.connectionState);
    //   if (![ConnectionState.CONNECTING, ConnectionState.CONNECTED].includes(peerConnection.current?.connectionState)) {
    //     clear();
    //   }
    // }, 10000);
  };

  useEffect(() => {
    (async () => {
      await initLocalStream();

      // if (!!callerId && callerId !== loggedUserId) {
      //   setLocalScreenSize(remoteScreenDimension);
      //   sendMessage('call-accept', { callerId, width, height });
      // }
    })();

    InCallManager.start();
    InCallManager.setKeepScreenOn(true);
    InCallManager.setForceSpeakerphoneOn(true);

    return () => {
      cleanConnection();
      InCallManager.stop();

      console.log('CLEAR CALL SCREEN');
    };
  }, []);

  // useEffect(() => {
  //   const f = ({ type, payload }: {
  //     type: string; payload: any;
  //   }) => {
  //     // console.log('===>!', type);

  useOnMessage(({ type, payload }: { type: string; payload: any; }) => {
    (async () => {
      switch (type) {
        case 'video-frozen':
          console.log('VIEDEO FROZEN!!!');
          await beginOfferExchange(true);

          break;
        case 'p2p-candidate-offered':
          peerConnection.current && peerConnection.current.addIceCandidate(new RTCIceCandidate(payload));

          break;
        case 'p2p-candidate-answered':
          peerConnection.current && peerConnection.current.addIceCandidate(new RTCIceCandidate(payload));

          break;
        case 'p2p-offered':

          if (peerConnection.current) {
            peerConnection.current.onicecandidate = (event) => {
              event.candidate && sendMessage('p2p-candidate-answer', {
                callerId: payload.callerId,
                candidate: (event.candidate as any).toJSON()
              });
            };

            await peerConnection.current.setRemoteDescription(new RTCSessionDescription(payload.offer));
            const answer = await peerConnection.current.createAnswer();
            await peerConnection.current.setLocalDescription(answer);

            sendMessage('p2p-answer', {
              callerId: payload.callerId,
              answer
            });
          }

          break;
        case 'p2p-answered':
          peerConnection.current && await peerConnection.current.setRemoteDescription(new RTCSessionDescription(payload));

          break;
        case 'call-accepted': {
          initPeerConnection();

          if (payload.calledId === loggedUserId) return;

          setLocalScreenSize({ width: payload?.width, height: payload?.height });

          await beginOfferExchange();

          break;
        }
      }
    })();
    // };

    // subj.subscribe(f);

    // return () => {
    //   subj.unsubscribe(f);
    // };
  }, []);

  const acceptCall = () => {
    // if (!!callerId && callerId !== loggedUserId) {
    setLocalScreenSize(remoteScreenDimension);
    sendMessage('call-accept', { callerId, width, height });
    // }
  };

  return {
    peerConnectionState,
    beginOfferExchange,
    localStream,
    remoteStream,
    localScreenSize,
    acceptCall
  };
};
