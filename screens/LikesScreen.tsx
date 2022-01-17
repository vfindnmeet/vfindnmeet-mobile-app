import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Image, TouchableWithoutFeedback } from 'react-native';
import CustomHeader from '../navigation/CustomHeader';
import CBottomTabs from '../navigation/CBottomTabs';
import { getLikesFrom, getLikesTo, getMatchedUsers, getNearbyUsers } from '../services/api';
import { useDispatch, useSelector } from 'react-redux';
import { getTokenSelector } from '../store/selectors/auth';
import { maxNumber, retryHttpRequest, throwErrorIfErrorStatusCode } from '../utils';
import { useIsMounted } from '../hooks/useIsMounted';
import UserItem from '../components/UserItem';
import { Button, Colors } from 'react-native-paper';
import { clearLikeUsers, fetchLikeUsers, setLikeUsers } from '../store/actions/like';
import { getLikeUsersLoadingSelector, getLikeUsersSelector } from '../store/selectors/like';
import InfiniteList from '../components/InfiniteList';
import { getLikesCountSelector } from '../store/selectors/notification';
import BaseHeader from '../navigation/BaseHeader';
import { useTranslation } from 'react-i18next';

type SelectedType = 'from' | 'to';

function ActionButton({ children, selected, onSelected }: any) {
  return (
    <Button
      mode={selected ? 'contained' : undefined}
      style={{
        width: '50%',
      }}
      onPress={onSelected}
    >{children}</Button>
  );
}

// function LikeUsers({ selected }: { selected: SelectedType }) {
//   const dispatch = useDispatch();

//   const users = useSelector(getLikeUsersSelector);
//   const loading = useSelector(getLikeUsersLoadingSelector);

//   const [page, setPage] = useState(1);

//   const isMounted = useIsMounted();
//   const token = useSelector(getTokenSelector);

//   // console.log('LIKES:', users.length);
//   // const a: any = {};
//   // (users ?? []).forEach((u: any) => {
//   //   if (!a[u.id]) a[u.id] = 0;

//   //   a[u.id]++;
//   // });

//   // console.log(a);

//   const fetchItems = (page: number) => {
//     return (
//       selected === 'from' ?
//         getLikesFrom(page, token) :
//         getLikesTo(page, token)
//     )
//       .then(throwErrorIfErrorStatusCode)
//       .then((result: any) => result.json());
//   };

//   useEffect(() => {
//     console.log('INIT!!!', selected);

//     // dispatch(fetchLikeUsers());
//     // fetchItems(1)
//     //   .then((items: any[]) => {
//     //     dispatch(setLikeUsers(items));
//     //   });

//     return () => {
//       console.log('EXITED ', selected);
//       dispatch(setLikeUsers([]));
//     };
//   }, []);

//   // console.log('users:');
//   // console.log(JSON.stringify(users, null, 2));

//   return (
//     <View style={{
//       flex: 1
//     }}>
//       {!loading && users.length === 0 && (
//         <Text
//           style={{
//             width: '100%',
//             padding: 10,
//             textAlign: 'center'
//           }}
//         >No likes yet.</Text>
//       )}

//       <InfiniteList
//         items={users}
//         onFetchItems={fetchItems}
//         setItems={(items: any[]) => {
//           dispatch(setLikeUsers(items));
//         }}
//         renderItem={(user: any) => (
//           <UserItem key={user.id} user={user} />
//         )}
//         page={page}
//         setPage={setPage}
//         loading={loading}
//         startLoading={() => dispatch(fetchLikeUsers())}
//       />
//     </View>
//   );
// }

function LikeUsers({ selected }: { selected: SelectedType }) {
  const dispatch = useDispatch();

  const users = useSelector(getLikeUsersSelector);
  const loading = useSelector(getLikeUsersLoadingSelector);

  const [page, setPage] = useState<number | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const isMounted = useIsMounted();
  const token = useSelector(getTokenSelector);
  const { t } = useTranslation();

  useEffect(() => {
    console.log('..init likes', selected);
    // console.log('SELECTED CHANGED!', selected);
    // dispatch(setLikeUsers([]));
    dispatch(fetchLikeUsers());

    fetchItems(1)
      .then((items: any[]) => {
        console.log('set likes', selected, items.length, 1);
        dispatch(setLikeUsers(items));
      });
    setPage(1);
  }, [selected]);

  const fetchItems = (page: number) => {
    return (
      selected === 'from' ?
        retryHttpRequest(getLikesFrom.bind(null, page, token)) :
        retryHttpRequest(getLikesTo.bind(null, page, token))
    )
      // .then(throwErrorIfErrorStatusCode)
      .then((result: any) => result.json())
      .then(result => {
        console.log('RESULT LEN:', result.length);
        if (result.length <= 0) {
          setHasMore(false);
        }

        return result;
      });
  };

  return (
    <View style={{
      flex: 1
    }}>
      {!loading && users.length === 0 && (
        <Text
          style={{
            width: '100%',
            padding: 10,
            textAlign: 'center'
          }}
        >{t('No likes yet.')}</Text>
      )}

      <InfiniteList
        items={users}
        onFetchItems={fetchItems}
        setItems={(items: any[]) => {
          dispatch(setLikeUsers(items));
        }}
        renderItem={(user: any, ix: number) => (
          <UserItem key={user.id ?? ix} user={user} />
        )}
        page={page}
        setPage={setPage}
        loading={loading}
        startLoading={() => {
          if (!hasMore) return false;

          dispatch(fetchLikeUsers());

          return true;
        }}
      />
    </View>
  );
}

export default function LikesScreen(props: any) {
  const dispatch = useDispatch();
  const [selected, setSelected] = useState<SelectedType>('from');
  // const [showModal, setShowModal] = useState(false);

  const likesCount: number = useSelector(getLikesCountSelector);

  useEffect(() => {
    return () => {
      dispatch(clearLikeUsers());
    };
  }, []);

  const { t } = useTranslation();

  // useEffect(() => {
  //   console.log('SELECTED CHANGED', selected);
  // }, [selected]);

  return (
    <View style={{
      flex: 1
    }}>
      <BaseHeader text={t('Likes')} />
      <View style={{
        display: 'flex',
        flexDirection: 'row'
      }}>
        <ActionButton
          selected={selected === 'from'}
          onSelected={() => setSelected('from')}
        >{t('From me')}</ActionButton>
        <ActionButton
          selected={selected !== 'from'}
          onSelected={() => setSelected('to')}
        >
          {!!likesCount && (
            <Text style={{
              color: Colors.red300,
              marginRight: '5px'
            }}>{maxNumber(likesCount, 99)}</Text>
          )}{t('To me')}</ActionButton>
      </View>
      <LikeUsers selected={selected} />
      {/* {selected === 'from' && <LikeUsers selected={selected} />}
      {selected === 'to' && <LikeUsers selected={selected} />} */}
      <CBottomTabs />
    </View>
  );
}
