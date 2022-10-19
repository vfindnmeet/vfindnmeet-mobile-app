import React, { useContext, useEffect, useState } from 'react';
import { WsContext } from '../store/WsContext';
import { Subject } from 'rxjs';

export default function useOnMessage(callback: (msg: any) => any, dependencies: any[] = []) {
  const { wsMessageSubject }: { wsMessageSubject: Subject<any> } = useContext(WsContext);

  useEffect(() => {
    const subscr = wsMessageSubject.subscribe(callback);

    return () => {
      subscr.unsubscribe();
    };
  }, [...dependencies]);
}
