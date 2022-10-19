import { useEffect } from 'react';
import InCallManager from "react-native-incall-manager";

export default function useCallRingtone(talking: boolean, calledId: string, callerId: string) {
  useEffect(() => {
    if (!talking && !callerId && !calledId) {
      InCallManager.startRingtone('DEFAULT');
    } else {
      InCallManager.stopRingtone();
    }

    return () => {
      InCallManager.stopRingtone();
    };
  }, [talking, calledId, callerId]);
}
