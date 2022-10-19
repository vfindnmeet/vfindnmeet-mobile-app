import { useEffect } from 'react';
import { ConnectionState } from '../../WebrtcUtils';

const ACCEPT_TIMEOUT = 15000; // 15 sec

export default function useConnectionTimeout(
  peerConnectionState: string | null,
  acceptedAt: number | null,
  onCallEnd: () => void
) {
  useEffect(() => {
    if (!acceptedAt || (acceptedAt + ACCEPT_TIMEOUT) <= Date.now()) return;

    const invalidConnectionState = (
      !!peerConnectionState &&
      ![ConnectionState.CONNECTING, ConnectionState.CONNECTED].includes(peerConnectionState)
    );

    let timeout: NodeJS.Timeout | undefined;
    if (invalidConnectionState) {
      timeout = setTimeout(() => {
        onCallEnd();
      }, (acceptedAt + ACCEPT_TIMEOUT) - Date.now());
    }

    return () => {
      if (!timeout) return;

      clearTimeout(timeout);
    };
  }, [peerConnectionState, acceptedAt]);
}
