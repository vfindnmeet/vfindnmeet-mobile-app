import { useEffect } from 'react';
import InCallManager from "react-native-incall-manager";
import { useSelector } from 'react-redux';
import { getLoggedUserIdSelector } from '../../store/selectors/auth';

export default function useCallRingback(talking: boolean, callerId: string) {
  const loggedUserId = useSelector(getLoggedUserIdSelector);

  useEffect(() => {
    if (!talking && callerId === loggedUserId) {
      InCallManager.startRingback();
    }

    return () => {
      InCallManager.stopRingback();
    };
  }, [talking, callerId, loggedUserId]);
}
