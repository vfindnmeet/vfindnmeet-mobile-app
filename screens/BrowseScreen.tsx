import React, { useCallback, useEffect, useState } from 'react';
import { Dimensions, FlatList, ScrollView, View } from 'react-native';
import CBottomTabs from '../navigation/CBottomTabs';
import { getNearbyUsers } from '../services/api';
import { useDispatch, useSelector } from 'react-redux';
import { getTokenSelector } from '../store/selectors/auth';
import { getStorageItem, parseJson, retryHttpRequest, setStorageItem, throwErrorIfErrorStatusCode } from '../utils';
import { useIsMounted } from '../hooks/useIsMounted';
import { shouldShowBrowseOptionModalSelector } from '../store/selectors/modal';
import { hideBrowseOptionModal } from '../store/actions/modal';
import BrowseHeader from '../navigation/BrowseHeader';
import { ActivityIndicator, Text } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { LOADER_SIZE, STORAGE_BROWSE_OPTIONS_KEY } from '../constants';
import UserItemSmall from '../components/UserItemSmall';
import BrowseOptionBottomModal from '../components/modal/BrowseOptionBottomModal';
import PageLoader from '../components/common/PageLoader';
import { SafeAreaView } from 'react-native-safe-area-context';

function useGetPopularUsers() {
  const [users, setUsers] = useState<any[] | null>([]);

  // const token = useSelector(getTokenSelector);

  // useEffect(() => {
  //   retryHttpRequest(() => {
  //     // if (!isMounted.current) return null;

  //     return getNearbyUsers(token, false);
  //   })
  //     .then((result: any) => result.json())
  //     .then((items: any[]) => {
  //       const r: any[] = [];
  //       for (let i = 0; i < 15 && i < items.length; i++) {
  //         r.push(items[i]);
  //       }

  //       console.log(r.length);

  //       setUsers(r.map(i => {
  //         const ti = { ...i };
  //         delete ti.distanceInKm;

  //         return ti;
  //       }));
  //     })

  //   setUsers([]);
  // }, []);

  return users;
}

// const MBrowseOptionDialog = React.memo(BrowseOptionDialog);
const MBrowseOptionDialog = React.memo(BrowseOptionBottomModal);

function UsersList({ users }: { users: any[] }) {
  console.log('users list.. render');

  return (
    <FlatList
      style={{
        flex: 1,
      }}
      numColumns={3}
      data={users}
      renderItem={(user: any) => <UserItemSmall user={user.item} />}
      keyExtractor={item => item.id}
    />
  );
}

const MUsersList = React.memo(UsersList);

// const cache: any = {};

// const { width } = Dimensions.get('window');

let n: number;

export default function BrowseScreen(props: any) {
  const dispatch = useDispatch();

  // useRouteTrack();

  const isMounted = useIsMounted();
  const { t } = useTranslation();

  const token = useSelector(getTokenSelector);
  const showBrowseOptionModal = useSelector(shouldShowBrowseOptionModalSelector);
  const popularUsers = useGetPopularUsers();

  // const [page, setPage] = useState<number>(1);
  // const [lastTs, setLastTs] = useState<number>();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  // const [hasMore, setHasMore] = useState<boolean>(true);
  const [onlineOnly, setOnlineOnly] = useState<boolean | null>(null);

  const onDialogHide = useCallback(() => dispatch(hideBrowseOptionModal()), []);
  const f1 = useCallback((checked: boolean) => {
    setStorageItem(STORAGE_BROWSE_OPTIONS_KEY, JSON.stringify({ onlineOnly: checked }))
      .then(() => {
        if (!isMounted.current) return;

        setOnlineOnly(checked);
      });
  }, [setOnlineOnly]);

  useEffect(() => {
    getStorageItem(STORAGE_BROWSE_OPTIONS_KEY)
      .then(data => parseJson(data as string))
      .then(data => {
        if (!isMounted.current) return;

        setOnlineOnly(data?.onlineOnly ?? false);
      });
  }, []);

  useEffect(() => {
    if (onlineOnly === null) return;

    setLoading(true);

    // if (cache['k1']) {
    //   console.log('FROM CACHE!')
    //   setUsers(cache['k1']);
    //   setLoading(false);

    //   return;
    // }

    fetchItems(1)
      .then((items: any[]) => {
        if (!isMounted.current) return;

        // const r: any[] = [];
        // for (let i = 0; i < 15 || i < items.length; i++) {
        //   r.push(items[i]);
        // }

        // console.log('fetched items. Took:', Date.now() - n);
        // console.log('set items ..');
        // setUsers(r);
        setUsers(items);

        // cache['k1'] = items;
        // if (items.length > 0) {
        //   setLastTs(items[items.length - 1].addedAt);
        // } else {
        //   setHasMore(false);
        // }
        if (items.length <= 0) {
          // setHasMore(false);
        }
        setLoading(false);
      });
    // setPage(1);
  }, [onlineOnly]);

  const fetchItems = (_page: number) => {
    console.log('fetchItems');
    return retryHttpRequest(() => {
      if (!isMounted.current) return null;

      return getNearbyUsers(token, onlineOnly as boolean, users[users.length - 1]?.addedAt);
    })
      // return getNearbyUsers(token, onlineOnly as boolean, users[users.length - 1]?.addedAt)
      // return retryHttpRequest(getNearbyUsers.bind(null, token, onlineOnly as boolean, users[users.length - 1]?.addedAt))
      // .then(throwErrorIfErrorStatusCode)
      .then((r) => {
        console.log('fetched items');

        // n = Date.now();

        return r;
      })
      .then((result: any) => result.json())
    // .then(result => {
    //   if (result.length <= 0) {
    //     setHasMore(false);
    //   }

    //   return result;
    // });
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

  if (loading) {
    return (
      <SafeAreaView style={{
        flex: 1
      }}>
        <BrowseHeader />
        <PageLoader />
        <CBottomTabs />
      </SafeAreaView>
    )
  }

  return (
    <>
      <View style={{
        flex: 1
      }}>
        <BrowseHeader />
        <View
          style={{
            flex: 1,
            //   display: 'flex',
            //   flexDirection: 'row',
            //   flexWrap: 'wrap',
          }}
        >
          {/* {(loading || !popularUsers) && (
            <ActivityIndicator size={LOADER_SIZE} />
          )} */}
          {!loading && !!popularUsers && users.length > 0 && (
            <>
              {popularUsers.length > 0 && (
                <View>
                  <Text style={{
                    fontSize: 23,
                    fontWeight: 'bold',
                    padding: 5,
                    textAlign: 'center'
                  }}>Popular people</Text>
                  <ScrollView
                    horizontal={true}
                    style={{
                      // height: 60,
                      // flex: 2
                      // flexShrink: 1
                    }}
                  >
                    {popularUsers.map(user => <UserItemSmall key={user.id} user={user} />)}
                  </ScrollView>
                </View>
              )}
              <View style={{
                flex: 1
              }}>
                {/* <Text style={{
                  fontSize: 23,
                  fontWeight: 'bold',
                  padding: 5,
                  textAlign: 'center'
                }}>People nearby</Text> */}
                {users.length <= 0 && (
                  <Text style={{
                    padding: 10,
                    textAlign: 'center'
                  }}>{t('No users found.')}</Text>
                )}
                <MUsersList users={users} />
              </View>
            </>
          )}

        </View>
        {/* <InfiniteList
          onFetchItems={fetchItems}
          renderItem={(user: any) => (
            <UserItemSmall key={user.id} user={user} />
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
        /> */}
        <CBottomTabs />
      </View>

      <MBrowseOptionDialog
        show={showBrowseOptionModal}
        onHide={onDialogHide}
        onlineOnly={onlineOnly}
        setOnlineOnly={f1}
      />
    </>
  );
}
