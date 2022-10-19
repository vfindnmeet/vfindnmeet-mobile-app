import {
  View,
  Text,
  Button,
  Image,
  Dimensions,
} from 'react-native';
import React, { useState, useEffect, useContext, useRef } from 'react';
import { RTCView } from 'react-native-webrtc';
import { WsContext } from '../store/WsContext';
import { ConnectionState } from '../WebrtcUtils';
import useVideoChat from '../hooks/useVideoChat';
import useOnMessage from '../hooks/useOnMessage';
import { useSelector } from 'react-redux';
import { getLoggedUserIdSelector } from '../store/selectors/auth';
import EStyleSheet from 'react-native-extended-stylesheet';
import { Colors, IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { getDefaultImage } from '../components/DefaultImages';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';
import { BIG_ICON_SIZE } from '../constants';
import { useIsMounted } from '../hooks/useIsMounted';
import useConnectionTimeout from '../hooks/calling/useConnectionTimeout';
import useCallingEnd from '../hooks/calling/useCallingEnd';
import useCallRingback from '../hooks/calling/useCallRingback';
import useCallRingtone from '../hooks/calling/useCallRingtone';

const styles = EStyleSheet.create({
  container: {
    flex: 1
  },
  viewer: {
    flex: 1,
    display: 'flex',
    width: '100%'
  },
  callContainer: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  infoContainer: {
    position: 'absolute',
    bottom: '15rem',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  },
  actionsContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  calledActionsContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  gradientContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  callingText: {
    color: Colors.white,
    padding: '15rem',
    textAlign: 'center',
    fontSize: '20rem'
  }
});

const { width, height } = Dimensions.get('screen');
export const H_SIZE = width / 2; // ~200;
export const W_SIZE = width / 2.6; // ~150;

export default function CallScreen(props: any) {
  const callId = props.route.params.callId;
  const calledId = props.route.params.calledId;
  const callerId = props.route.params.callerId;
  const called = props.route.params.called;
  const caller = props.route.params.caller;
  const endTime = props.route.params.endTime;
  const remoteScreenDimension = props.route.params.remoteScreenDimension;

  const { t } = useTranslation();
  const isMounted = useIsMounted();

  const loggedUserId = useSelector(getLoggedUserIdSelector);

  const {
    accepting,
    acceptedAt,
    peerConnectionState,
    beginOfferExchange,
    localStream,
    remoteStream,
    localScreenSize,
    acceptCall
  } = useVideoChat({
    callId,
    calledId,
    callerId,
    remoteScreenDimension
  });

  const { sendMessage } = useContext(WsContext);

  const [talking, setTalking] = useState(false);

  const navigation: any = useNavigation();
  const endingRef = useRef(false);

  const onCallEnd = () => {
    if (endingRef.current) return;

    endingRef.current = true;
    navigation.goBack(null);
  };

  useOnMessage((msg: { type: string; payload: any; }) => {
    if (!isMounted.current) return;

    switch (msg.type) {
      case 'call-declined':
        onCallEnd();

        break;
      case 'call-ended':
        onCallEnd();

        break;
      case 'call-cancelled':
        onCallEnd();

        break;
    }
  }, []);

  useEffect(() => {
    if (peerConnectionState === ConnectionState.CONNECTED) {
      setTalking(true);
    } else if ([ConnectionState.CLOSED, ConnectionState.FAILED].includes(peerConnectionState as any)) {
      onCallEnd();
    }
  }, [peerConnectionState]);

  useConnectionTimeout(peerConnectionState, acceptedAt, onCallEnd);
  useCallingEnd(talking, endTime, onCallEnd);
  useCallRingback(talking, callerId);
  useCallRingtone(talking, calledId, callerId);

  if (!talking && callerId === loggedUserId) {
    return (
      <View style={styles.container}>
        <Image
          style={{
            width,
            height
          }}
          source={{
            uri: called?.profileImage ?? getDefaultImage(called?.gender).uri
          }}
        />

        <LinearGradient
          colors={['transparent', 'transparent', 'rgba(0, 0, 0, 0.3)', 'rgba(0, 0, 0, 0.7)']}
          style={styles.gradientContainer}
        >
          <View style={styles.infoContainer}>
            <View>
              <Text style={styles.callingText}>{t('Calling')} {called?.name}</Text>
            </View>
            <View style={styles.actionsContainer}>
              <IconButton
                icon="phone-hangup"
                size={BIG_ICON_SIZE}
                color={Colors.white}
                style={{
                  backgroundColor: Colors.red500
                }}
                disabled={accepting}
                onPress={() => {
                  sendMessage('call-cancel', { callId, calledId });
                  onCallEnd();
                }}
              />
            </View>
          </View>
        </LinearGradient>
      </View>
    );
  }

  if (!talking && callerId !== loggedUserId) {
    return (
      <View style={styles.container}>
        <Image
          style={{
            width,
            height
          }}
          source={{
            uri: caller?.profileImage ?? getDefaultImage(caller?.gender).uri
          }}
        />

        <LinearGradient
          colors={['transparent', 'transparent', 'rgba(0, 0, 0, 0.3)', 'rgba(0, 0, 0, 0.7)']}
          style={styles.gradientContainer}
        >
          <View style={styles.infoContainer}>
            <View>
              <Text style={styles.callingText}>{t('Incomming video call from')} {caller?.name}</Text>
            </View>
            <View style={styles.calledActionsContainer}>
              <IconButton
                icon="phone"
                size={BIG_ICON_SIZE}
                color={Colors.white}
                style={{
                  backgroundColor: Colors.green500
                }}
                disabled={accepting}
                onPress={() => {
                  acceptCall();
                }}
              />
              <IconButton
                icon="phone-hangup"
                size={BIG_ICON_SIZE}
                color={Colors.white}
                style={{
                  backgroundColor: Colors.red500
                }}
                disabled={accepting}
                onPress={() => {
                  sendMessage('call-decline', { callId, callerId });
                  onCallEnd();
                }}
              />
            </View>
          </View>
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <RTCView
        objectFit="cover"
        streamURL={remoteStream?.toURL() as any}
        style={styles.viewer}
      />
      <RTCView
        objectFit="cover"
        streamURL={localStream?.toURL() as any}
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: localScreenSize ? H_SIZE / (localScreenSize.height / localScreenSize.width) : W_SIZE,
          height: H_SIZE,
        }}
      />

      <View style={styles.actionsContainer}>
        <Button
          title="End call"
          onPress={() => {
            sendMessage('call-end', { callId });
            onCallEnd();
          }}
        />

        {/* <Button
          title="-test-"
          onPress={() => {
            (async () => {
              await beginOfferExchange(true);
            })();
          }}
        /> */}
      </View>
    </View>
  );
};
