import React, { useCallback, useEffect, useState } from 'react';
import { View, ScrollView, FlatList } from 'react-native';
import { useIsMounted } from '../hooks/useIsMounted';
import { ActivityIndicator, Text } from 'react-native-paper';
import { LOADER_SIZE } from '../constants';

export default function InfiniteList({
  renderItem,
  onFetchItems,
  items,
  setItems,
  page,
  setPage,
  loading,
  startLoading
}: any) {
  const isMounted = useIsMounted();

  const shouldLoadMore = useCallback(({ layoutMeasurement, contentOffset, contentSize }: any) => {
    const paddingToBottom = 20;

    const h = contentSize.height - paddingToBottom;
    const y = layoutMeasurement.height + contentOffset.y;

    return h - (h * .2) < y;
  }, []);

  const loadItems = (page: number) => {
    if (!startLoading()) return;

    onFetchItems(page)
      .then((result: any[]) => {
        if (!isMounted.current) return;

        setItems([
          ...items,
          ...result.filter(item => !items.includes(item.id))
        ]);
        setPage && setPage(page);
      });
  };

  const loadMore = () => loadItems(page + 1);

  const renderDataItem = useCallback((data: any) => renderItem(data.item), [renderItem]);

  const onScroll = useCallback(({ nativeEvent }) => {
    if (loading) return;

    if (shouldLoadMore(nativeEvent)) {
      loadMore();
    }
  }, [loadMore, shouldLoadMore]);

  return (
    <>
      {loading && (
        <View style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 15
        }}>
          <ActivityIndicator size={LOADER_SIZE} />
        </View>
      )}
      <FlatList
        style={{
          flex: 1
        }}
        numColumns={2}
        renderItem={renderDataItem}
        data={items}
        onScroll={onScroll}
      />
    </>
  );
}
