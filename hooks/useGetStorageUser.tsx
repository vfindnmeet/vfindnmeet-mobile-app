import { useEffect, useState } from 'react';
import { getStorageItem, parseJson } from '../utils';
import { useDispatch } from 'react-redux';
import { logOutUser, setLoggedUser } from '../store/actions/auth';
import { STORAGE_LOGIN_DATA_KEY } from '../constants';
import { useIsMounted } from '../hooks/useIsMounted';

export default function useGetStorageUser() {
  const dispatch = useDispatch();
  const isMounted = useIsMounted();

  const [loadingToken, setLoadingToken] = useState(true);

  useEffect(() => {
    getStorageItem(STORAGE_LOGIN_DATA_KEY)
      .then(json => {
        if (!json) {
          dispatch(logOutUser());
        } else {
          dispatch(setLoggedUser(parseJson(json)));
        }
      })
      // .catch(console.error)
      .finally(() => {
        if (!isMounted.current) return;

        setLoadingToken(false)
      })
  }, []);

  return loadingToken;
}
