import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import CBottomTabs from '../navigation/CBottomTabs';
import { getLikesFrom, getLikesTo } from '../services/api';
import { useDispatch, useSelector } from 'react-redux';
import { getTokenSelector } from '../store/selectors/auth';
import { handleError, maxNumber, retryHttpRequest } from '../utils';
import { useIsMounted } from '../hooks/useIsMounted';
import UserItem from '../components/UserItem';
import { ActivityIndicator, Badge, Button, IconButton } from 'react-native-paper';
import { fetchLikeUsers, setLikeUsers } from '../store/actions/like';
import { getLikeUsersSelector } from '../store/selectors/like';
import InfiniteList from '../components/InfiniteList';
import { getLikesCountSelector } from '../store/selectors/notification';
import BaseHeader from '../navigation/BaseHeader';
import { useTranslation } from 'react-i18next';
import FeedbackButton from '../navigation/FeedbackButton';
import { BADGE_SIZE, ICON_SIZE, LOADER_SIZE, MEDIUM_ICON_SIZE } from '../constants';

type SelectedType = 'from' | 'to';

const LOADER_LIST_ITEM = { id: 'loader', loader: true };

const shouldLoadMore = ({ layoutMeasurement, contentOffset, contentSize }: any) => {
  const paddingToBottom = 20;

  const h = contentSize.height - paddingToBottom;
  const y = layoutMeasurement.height + contentOffset.y;

  return h - (h * .2) < y;
};

function ActionButton({ children, selected, onSelected }: any) {
  return (
    <Button
      // mode={selected ? 'contained' : 'outlined'}
      mode="text"
      uppercase={false}
      disabled={selected}
      // mode={selected ? 'contained' : undefined}
      // style={{
      //   width: '100%'
      //   // width: '50%',
      //   // position: 'relative'
      // }}
      onPress={onSelected}
    >{children}</Button>
  );
}

function LikeUsers({ selected }: { selected: SelectedType }) {
  const dispatch = useDispatch();

  const users = useSelector(getLikeUsersSelector);
  // const loading = useSelector(getLikeUsersLoadingSelector);

  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);

  const isMounted = useIsMounted();
  const token = useSelector(getTokenSelector);
  const { t } = useTranslation();

  useEffect(() => {
    // console.log('SELECTED CHANGED!', selected);
    // dispatch(setLikeUsers([]));
    dispatch(fetchLikeUsers(true));

    fetchItems(1)
      .then((items: any[]) => {
        // console.log('set likes', selected, items.length, 1);
        dispatch(setLikeUsers(items));
        setLoading(false);
      });
    setPage(1);
  }, [selected]);

  const fetchItems = (page: number) => {
    setLoading(true);

    return (
      selected === 'from' ?
        retryHttpRequest(() => {
          if (!isMounted.current) return null;

          return getLikesFrom(page, token);
        }) :
        retryHttpRequest(() => {
          if (!isMounted.current) return null;

          return getLikesTo(page, token);
        })
    )
      // .then(throwErrorIfErrorStatusCode)
      .then((result: any) => result.json())
      .then(result => {
        // console.log('RESULT LEN:', result.length);
        if (result.length <= 0) {
          setHasMore(false);
        }

        return result;
      })
      .catch(e => {
        handleError(e, dispatch);
      });;
  };






  const startLoading = useCallback(() => {
    if (!hasMore) return false;

    dispatch(fetchLikeUsers());

    return true;
  }, [hasMore])

  const loadItems = (page: number) => {
    if (!startLoading()) return;

    fetchItems(page)
      .then((result: any[]) => {
        if (!isMounted.current) return;

        dispatch(setLikeUsers([
          ...users,
          ...result.filter(item => !users.includes(item.id))
        ]));
        setLoading(false);
        // setUsers([
        //   ...items,
        //   ...result.filter(item => !items.includes(item.id))
        // ]);
        setPage && setPage(page);
      });
  };

  const renderItem = useCallback((data: any) => {
    if (data.item.loader) {
      return (
        <View style={{
          width: '100%',
          flex: 1,
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 15,
        }}>
          <ActivityIndicator size={LOADER_SIZE} />
        </View>
      );
    }
    if (!data.item) return null;

    return <UserItem user={data.item} />;
  }, []);

  const loadMore = () => loadItems(page + 1);

  // const renderDataItem = useCallback((data: any) => renderItem(data.item), [renderItem]);

  const onScroll = useCallback(({ nativeEvent }) => {
    if (loading) return;

    if (shouldLoadMore(nativeEvent)) {
      loadMore();
    }
  }, [loadMore, shouldLoadMore]);

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
      <FlatList
        columnWrapperStyle={{
          flex: 1,
          justifyContent: 'flex-start',
          // borderWidth: 1,
          // borderColor: 'red',
        }}
        numColumns={2}
        renderItem={renderItem}
        keyExtractor={(item, ix) => item?.id ?? ix}
        data={!loading ? users : [
          ...users,
          ...(users.length % 2 !== 0 ? [null, LOADER_LIST_ITEM] : [LOADER_LIST_ITEM])
        ]}
        onScroll={onScroll}
      />
      {/* {users.length > 0 && (
        <FlatList
          numColumns={2}
          renderItem={renderItem}
          data={users}
          onScroll={onScroll}
        />
      )} */}
      {/* {loading && (
        <View style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 15,
        }}>
          <ActivityIndicator size={LOADER_SIZE} />
        </View>
      )} */}
    </View>
  );

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

  // const likesCount: number = useSelector(getLikesCountSelector);

  // useEffect(() => {
  //   // console.log('LIKES!!');

  //   return () => {
  //     dispatch(clearLikeUsers());
  //   };
  // }, []);

  const { t } = useTranslation();

  // useEffect(() => {
  //   console.log('SELECTED CHANGED', selected);
  // }, [selected]);

  return (
    <View style={{
      flex: 1
    }}>
      <LikesHeader selected={selected} setSelected={setSelected} />
      {/* <NavButtons selected={selected} setSelected={setSelected} /> */}
      {/* {selected === 'from' && (
        <Text style={{
          fontSize: 20,
          fontWeight: 'bold',
          textAlign: 'center',
        }}>{t('Sent likes')}</Text>
      )} */}
      <LikeUsers selected={selected} />
      {/* {selected === 'from' && <LikeUsers selected={selected} />}
      {selected === 'to' && <LikeUsers selected={selected} />} */}
      <CBottomTabs />
    </View >
  );
}

function NavButtons({
  selected,
  setSelected
}: any) {
  const { t } = useTranslation();

  const likesCount: number = useSelector(getLikesCountSelector);

  return (
    <View style={{
      display: 'flex',
      flexDirection: 'row'
    }}>
      <View
        style={{
          width: '50%',
          position: 'relative',
          padding: 5
        }}
      >
        <ActionButton
          selected={selected === 'from'}
          onSelected={() => setSelected('from')}
        >{t('Sent')}</ActionButton>
      </View>
      <View
        style={{
          width: '50%',
          position: 'relative',
          padding: 5
        }}
      >
        <ActionButton
          selected={selected !== 'from'}
          onSelected={() => setSelected('to')}
        >{t('Received')}</ActionButton>
        <Badge
          visible={!!likesCount}
          size={MEDIUM_ICON_SIZE}
          style={{
            position: 'absolute',
            right: 0,
            zIndex: 10
          }}
        >{maxNumber(likesCount, 99)}</Badge>
      </View>
    </View>
  );
}

function LikesHeader({ selected, setSelected }: { selected: string, setSelected: (selected: SelectedType) => void; }) {
  // const dispatch = useDispatch();
  const { t } = useTranslation();

  const likesCount: number = useSelector(getLikesCountSelector);

  return (
    <BaseHeader
      // text={t('Likes')}
      text={selected === 'from' ? t('Sent likes') : t('Received likes')}
      leftButtons={[
        <IconButton
          disabled={selected === 'from'}
          icon="account-arrow-right-outline"
          onPress={() => setSelected('from')}
          size={ICON_SIZE}
          style={{
            // borderWidth: 1,
            // borderColor: 'red',
            marginRight: -5
          }}
        />,
        <View
          style={{
            position: 'relative',
          }}
        >
          <IconButton
            disabled={selected !== 'from'}
            icon="account-arrow-left-outline"
            onPress={() => setSelected('to')}
            size={ICON_SIZE}
          // style={{
          //   borderWidth: 1,
          //   borderColor: 'red',
          // }}
          />
          <Badge
            visible={!!likesCount}
            size={BADGE_SIZE}
            style={{
              position: 'absolute',
              right: 5,
              top: 5,
              // zIndex: 10
            }}
          >{maxNumber(likesCount, 99)}</Badge>
        </View>
      ]}
      rightButton={<FeedbackButton />}
    />
  );
}
