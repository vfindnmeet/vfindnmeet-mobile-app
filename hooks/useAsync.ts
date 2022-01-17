import { useEffect } from "react";

export default function useAsync(doSomething: any, onSuccess: any, onError?: any) {
  useEffect(() => {
    let active = true;

    doSomething
      .then((result: any) => {
        if (!active) return;

        return onSuccess(result);
      })
      .catch(onError ?? console.error);

    return () => {
      active = false;
    };
  }, []);
}
