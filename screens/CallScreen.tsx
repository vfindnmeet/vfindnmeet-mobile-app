import {
  View,
  Text,
  Button,
} from 'react-native';
import React, { useState, useEffect, useContext } from 'react';
import { RTCView } from 'react-native-webrtc';
import { WsContext } from '../store/WsContext';
import { ConnectionState } from '../WebrtcUtils';
import InCallManager from "react-native-incall-manager";
import useVideoChat from '../hooks/useVideoChat';
import useOnMessage from '../hooks/useOnMessage';
import { useSelector } from 'react-redux';
import { getLoggedUserIdSelector } from '../store/selectors/auth';
import EStyleSheet from 'react-native-extended-stylesheet';
import { Colors } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black
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
  actionsContainer: {
    position: 'absolute',
    bottom: '15rem',
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center'
  }
});

export default function CallScreen(props: any) {
  const calledId = props.route.params.calledId;
  const callerId = props.route.params.callerId;
  const remoteScreenDimension = props.route.params.remoteScreenDimension;

  const navigation: any = useNavigation();

  const loggedUserId = useSelector(getLoggedUserIdSelector);

  const {
    peerConnectionState,
    beginOfferExchange,
    localStream,
    remoteStream,
    localScreenSize,
    acceptCall
  } = useVideoChat({
    calledId,
    callerId,
    remoteScreenDimension
  });

  const [talking, setTalking] = useState(false);
  const { sendMessage } = useContext(WsContext);

  const onCallEnd = () => {
    console.log('ON CALL END!');
    // setCalledId(null);
    // setCallerId(null);
    // setIncommingCall(null);
    navigation.goBack();
  };

  useEffect(() => {
    if (peerConnectionState === ConnectionState.CONNECTED) {
      setTalking(true);
    } else if ([ConnectionState.CLOSED, ConnectionState.FAILED].includes(peerConnectionState as any)) {
      onCallEnd();
    }
  }, [peerConnectionState]);

  useOnMessage((msg: { type: string; payload: any; }) => {
    switch (msg.type) {
      case 'call-declined':
        onCallEnd();

        break;
      // case 'call-cancelled':
      //   onCallEnd();

      //   break;
      case 'call-ended':
        onCallEnd();

        break;
      case 'call-cancelled':
        onCallEnd();

        break;
    }
  }, []);

  useEffect(() => {
    if (!talking && callerId === loggedUserId) {
      InCallManager.startRingback();
    }

    return () => {
      InCallManager.stopRingback();
    };
  }, [talking, callerId]);

  if (!talking && callerId === loggedUserId) {
    return (
      <View style={styles.container}>
        <View style={styles.callContainer}>
          <Text style={{ color: Colors.white }}>Calling {calledId}</Text>
        </View>

        <View style={styles.actionsContainer}>
          <Button
            title="Cancel"
            onPress={() => {
              sendMessage('call-cancel', { calledId });
              onCallEnd();
            }}
          />
        </View>
      </View>
    );
  }

  if (!talking && callerId !== loggedUserId) {
    return (
      <View style={styles.container}>
        <View style={styles.callContainer}>
          <Text style={{ color: Colors.white }}>Incomming call from {callerId}</Text>
        </View>

        <View style={styles.actionsContainer}>
          <Button
            title="Accept"
            color="green"
            onPress={() => {
              // setRemoteScreenDimension({
              //   width: incommingCall?.width,
              //   height: incommingCall?.height,
              // });
              // setCallerId(incommingCall?.callerId);
              // setCalledId(loggedUserId);

              acceptCall();
            }}
          />
          <Button
            title="Decline"
            color="red"
            onPress={() => {
              sendMessage('call-decline', { callerId });
              onCallEnd();
              // sendMessage('call-decline', { callerId: incommingCall?.callerId });
              // setIncommingCall(null);
            }}
          />
        </View>
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
          width: localScreenSize ? 200 / (localScreenSize.height / localScreenSize.width) : 150,
          height: 200,
        }}
      />

      <View style={styles.actionsContainer}>
        <Button
          title="End call"
          onPress={() => {
            sendMessage('call-end', {});
            onCallEnd();
          }}
        />

        <Button
          title="-test-"
          onPress={() => {
            (async () => {
              await beginOfferExchange(true);
            })();
          }}
        />
      </View>
    </View>
  );

  // return (
  //   <View style={styles.container}>
  //     {!talking && callerId === loggedUserId && (
  //       <View style={styles.callContainer}>
  //         <Text style={{ color: Colors.white }}>Calling {calledId}</Text>
  //       </View>
  //     )}
  //     {talking && (
  //       <>
  //         <RTCView
  //           objectFit="cover"
  //           streamURL={remoteStream?.toURL() as any}
  //           style={styles.viewer}
  //         />
  //         <RTCView
  //           objectFit="cover"
  //           streamURL={localStream?.toURL() as any}
  //           style={{
  //             position: 'absolute',
  //             top: 0,
  //             right: 0,
  //             width: localScreenSize ? 200 / (localScreenSize.height / localScreenSize.width) : 150,
  //             height: 200,
  //           }}
  //         />
  //       </>
  //     )}

  //     <View style={styles.actionsContainer}>
  //       {talking && (
  //         <Button
  //           title="End call"
  //           onPress={() => {
  //             sendMessage('call-end', {});
  //             onCallEnd();
  //           }}
  //         />
  //       )}

  //       {talking && (
  //         <Button
  //           title="-test-"
  //           onPress={() => {
  //             (async () => {
  //               await beginOfferExchange(true);
  //             })();
  //           }}
  //         />
  //       )}

  //       {!talking && callerId === loggedUserId && (
  //         <Button
  //           title="Cancel"
  //           onPress={() => {
  //             sendMessage('call-cancel', { calledId });
  //             onCallEnd();
  //           }}
  //         />
  //       )}
  //     </View>
  //   </View>
  // );
};
