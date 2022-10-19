import { useSelector } from 'react-redux';
import { getLoggedUserIdSelector } from '../../store/selectors/auth';
import useOnMessage from '../useOnMessage';
import { useNavigation } from '@react-navigation/native';

export default function useVideoCallHandle() {
  const navigation: any = useNavigation();
  const loggedUserId = useSelector(getLoggedUserIdSelector);

  useOnMessage(({ type, payload }: { type: string; payload: any; }) => {
    switch (type) {
      // logged user has accepted the call but from
      // other WebSocket connection (another tab or app)
      // case 'call-accepted-oc':
      //   break;
      case 'called':
        navigation.navigate('Call', {
          callId: payload.callId,
          calledId: loggedUserId,
          callerId: payload.callerId,
          remoteScreenDimension: {
            width: payload.width,
            height: payload.height,
          },
          caller: payload.caller
        });

        break;
    }
  }, [loggedUserId]);
}
