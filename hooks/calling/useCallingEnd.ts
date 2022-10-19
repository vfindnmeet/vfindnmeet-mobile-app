import { useEffect } from 'react';

export default function useCallingEnd(talking: boolean, endTime: number, onCallEnd: () => void) {
  useEffect(() => {
    if (!endTime || Date.now() >= endTime || talking) return;

    const timeout = setTimeout(() => {
      onCallEnd();
    }, endTime - Date.now());

    return () => {
      clearTimeout(timeout);
    }
  }, [talking, endTime]);
}
