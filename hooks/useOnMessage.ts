import React, { useContext, useEffect, useState } from 'react';
import { WsContext } from '../store/WsContext';

export default function useOnMessage(callback: (msg: any) => any, dependencies: any[]) {
  const [msg, setMsg] = useState<any>(null);
  const { lastMessage } = useContext(WsContext);

  useEffect(() => {
    if (!lastMessage) return;

    setMsg(lastMessage);
  }, [lastMessage]);

  useEffect(() => {
    if (!msg) return;

    callback(msg);

    setMsg(null);
  }, [msg, ...dependencies]);
}
