import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import CustomHeader from '../navigation/CustomHeader';
import CBottomTabs from '../navigation/CBottomTabs';
import { getNearbyUsers } from '../services/api';
import { useDispatch, useSelector } from 'react-redux';
import { getTokenSelector } from '../store/selectors/auth';
import { getStorageItem, parseJson, retryHttpRequest, setStorageItem, throwErrorIfErrorStatusCode } from '../utils';
import UserItem from '../components/UserItem';
import InfiniteList from '../components/InfiniteList';
import { useIsMounted } from '../hooks/useIsMounted';
import { shouldShowBrowseOptionModalSelector } from '../store/selectors/modal';
import { hideBrowseOptionModal, showMatchModal } from '../store/actions/modal';
import BrowseOptionDialog from '../components/modal/BrowseOptionDialog';
import BrowseHeader from '../navigation/BrowseHeader';
import { Text } from 'react-native-paper';
import { useRoute } from '@react-navigation/native';
import { clearRoute, setRoute } from '../store/actions/route';
import { useTranslation } from 'react-i18next';
import useRouteTrack from '../hooks/useRouteTrack';

export default function BrowseScreen(props: any) {
  // const route = useRoute();
  const dispatch = useDispatch();

  useRouteTrack();
  // useEffect(() => {
  //   dispatch(setRoute({
  //     routeName: route.name,
  //     params: route.params
  //   }));

  //   return () => {
  //     dispatch(clearRoute());
  //   };
  // }, []);

  // console.log('======>1');
  // console.log(route.name);
  // console.log(route.params);
  // console.log(route.path);

  const isMounted = useIsMounted();
  const { t } = useTranslation();

  const token = useSelector(getTokenSelector);
  const showBrowseOptionModal = useSelector(shouldShowBrowseOptionModalSelector);

  const [page, setPage] = useState<number>(1);
  // const [lastTs, setLastTs] = useState<number>();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [onlineOnly, setOnlineOnly] = useState<boolean | null>(null);

  // useEffect(() => {
  //   dispatch(showMatchModal({
  //     me: {
  //       id: '',
  //       name: '',
  //       gender: '',
  //       profileImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnvqNCzxkY_N3gC2scn1q6K7ec7y-xWZQV34oeIe9QfXiagJrzm2UEd3lKyX7ejjljHJg&usqp=CAU'
  //     },
  //     user: {
  //       id: '',
  //       name: '',
  //       gender: '',
  //       profileImage: ''
  //     }
  //   }));
  // }, []);

  useEffect(() => {
    getStorageItem('vi-browse-options')
      .then(data => parseJson(data as string))
      .then(data => {
        if (!isMounted.current) return;

        setOnlineOnly(data?.onlineOnly ?? false);
      });
  }, []);

  useEffect(() => {
    if (onlineOnly === null) return;

    setLoading(true);

    fetchItems(1)
      .then((items: any[]) => {
        if (!isMounted.current) return;

        setUsers(items);
        // if (items.length > 0) {
        //   setLastTs(items[items.length - 1].addedAt);
        // } else {
        //   setHasMore(false);
        // }
        if (items.length <= 0) {
          setHasMore(false);
        }
        setLoading(false);
      });
    // setPage(1);
  }, [onlineOnly]);

  const fetchItems = (_page: number) => {
    // return getNearbyUsers(
    //   token,
    //   onlineOnly as boolean,
    //   users[users.length - 1]?.addedAt
    // )
    return retryHttpRequest(getNearbyUsers.bind(null, token, onlineOnly as boolean, users[users.length - 1]?.addedAt))
      // .then(throwErrorIfErrorStatusCode)
      .then((result: any) => result.json())
      // .then(result => result.users)
      .then(result => {
        console.log('result:', result);
        if (result.length <= 0) {
          setHasMore(false);
        }

        return result;
      });
  };

  // const fetchItems = (page: number) => {
  //   return getNearbyUsers(token, page)
  //     .then(throwErrorIfErrorStatusCode)
  //     .then(result => result.json())
  //     .then(result => result.users)
  //     .then(result => {
  //       if (result.length <= 0) {
  //         setHasMore(false);
  //       }

  //       return result;
  //     });
  // };

  // useEffect(() => {
  //   fetchItems(1)
  //     .then((items: any[]) => {
  //       if (!isMounted.current) return;

  //       setUsers(items);
  //       setLoading(false);
  //     });
  //   setPage(1);
  // }, []);

  return (
    <>
      <View style={{
        flex: 1
      }}>
        <BrowseHeader />
        {!loading && users.length <= 0 && (
          <Text style={{
            padding: 10,
            textAlign: 'center'
          }}>{t('No users found.')}</Text>
        )}
        <InfiniteList
          onFetchItems={fetchItems}
          renderItem={(user: any) => (
            <UserItem key={user.id} user={user} />
          )}
          items={users}
          setItems={(items: any[]) => {
            const toRemove: string[] = [];
            const a: any = {};
            items.forEach(i => {
              if (!a[i.id]) a[i.id] = 0;
              a[i.id]++;
              if (a[i.id] > 1) toRemove.push(i.id);
            });
            setUsers(items.filter(item => !toRemove.includes(item.id)));
            setLoading(false);
          }}
          page={page}
          setPage={setPage}
          loading={loading}
          startLoading={() => {
            if (!hasMore) return false;

            setLoading(true)

            return true;
          }}
        />
        <CBottomTabs />
      </View>

      <BrowseOptionDialog
        show={showBrowseOptionModal}
        onHide={() => dispatch(hideBrowseOptionModal())}
        onlineOnly={onlineOnly}
        setOnlineOnly={(checked: boolean) => {
          setStorageItem('vi-browse-options', JSON.stringify({ onlineOnly: checked }))
            .then(() => {
              if (!isMounted.current) return;

              setOnlineOnly(checked);
            });
        }}
      />
    </>
  );
}
