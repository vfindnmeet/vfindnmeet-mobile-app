import React, { useEffect, useState } from 'react';
import { View, ScrollView } from 'react-native';
import { useIsMounted } from '../hooks/useIsMounted';
import { ActivityIndicator, Text } from 'react-native-paper';


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

  const loadMore = () => loadItems(page + 1);

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

  const shouldLoadMore = ({ layoutMeasurement, contentOffset, contentSize }: any) => {
    const paddingToBottom = 20;

    const h = contentSize.height - paddingToBottom;
    const y = layoutMeasurement.height + contentOffset.y;

    return h - (h * .2) < y;
  };

  return (
    <ScrollView
      style={{
        flex: 1
      }}
      onScroll={({ nativeEvent }) => {
        if (loading) return;

        if (shouldLoadMore(nativeEvent)) {
          loadMore();
        }
      }}
    >
      <View style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
      }}>
        {items.map((user: any, ix: number) => renderItem(user, ix))}
      </View>

      {loading && (
        <View style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 15
        }}>
          <ActivityIndicator size={70} />
        </View>
      )}
    </ScrollView>
  );
}

// export default function InfiniteList({
//   renderItem,
//   onFetchItems,
//   items,
//   setItems,
//   page,
//   setPage,
//   loading,
//   startLoading
// }: any) {
//   // const [items, setItems] = useState<any>([]);
//   // const [loading, setLoading] = useState(true);
//   // const [page, setPage] = useState(1);
//   // const [hasMore, setHasMore] = useState(true);
//   // const [idsMap, setIdsMap] = useState<any>({});

//   const isMounted = useIsMounted();

//   // useEffect(() => {
//   //   console.log('===============INITIAL LOAD')
//   //   setHasMore(true);
//   //   loadItems(page);
//   // }, []);

//   // useEffect(() => {
//   //   if (!hasMore) return;

//   //   startLoading();
//   //   onFetchItems(page)
//   //     .then((result: any[]) => {
//   //       // console.log('_1');
//   //       if (!isMounted.current) return;
//   //       // console.log('_2');

//   //       setItems([
//   //         ...items,
//   //         ...result.filter((user: any) => !idsMap[user.id])
//   //       ]);
//   //       updateUsersList(result);
//   //       if (result.length <= 0) {
//   //         setHasMore(false);
//   //       }
//   //       // setLoading(false);
//   //     });
//   // }, [page, hasMore]);

//   // const updateUsersList = (users: any[]) => {
//   //   const newUsersList = { ...idsMap };
//   //   users.forEach((user: any) => {
//   //     if (!newUsersList[user.id]) {
//   //       newUsersList[user.id] = 0;
//   //     }

//   //     newUsersList[user.id]++;
//   //   });
//   //   setIdsMap(newUsersList);
//   // };

//   // const loadMore = () => setPage(page + 1);
//   const loadMore = () => {
//     const newPage = page + 1;
//     loadItems(newPage);
//   }

//   const loadItems = (page: number) => {
//     // console.log('xxx1', page);
//     // // if (!hasMore) return;
//     // console.log('xxx2', page);

//     startLoading();
//     onFetchItems(page)
//       .then((result: any[]) => {
//         if (!isMounted.current) return;

//         setItems([
//           ...items,
//           ...result
//           // ...result.filter((user: any) => !idsMap[user.id])
//         ]);
//         setPage(page);
//         // updateUsersList(result);
//         // if (result.length <= 0) {
//         //   setHasMore(false);
//         // }
//         // setLoading(false);
//       });
//   };

//   const shouldLoadMore = ({ layoutMeasurement, contentOffset, contentSize }: any) => {
//     const paddingToBottom = 20;

//     const h = contentSize.height - paddingToBottom;
//     const y = layoutMeasurement.height + contentOffset.y;

//     return h - (h * .2) < y;
//   };

//   return (
//     <ScrollView
//       style={{
//         flex: 1
//       }}
//       onScroll={({ nativeEvent }) => {
//         if (loading) return;

//         if (shouldLoadMore(nativeEvent)) {
//           loadMore();
//         }
//       }}
//     >
//       <View style={{
//         flex: 1,
//         display: 'flex',
//         flexDirection: 'row',
//         flexWrap: 'wrap',
//       }}>
//         {items.map((user: any) => renderItem(user))}
//       </View>

//       {loading && (
//         <View style={{
//           display: 'flex',
//           flexDirection: 'row',
//           justifyContent: 'center',
//           alignItems: 'center',
//           padding: 15
//         }}>
//           <ActivityIndicator size={70} />
//         </View>
//       )}
//     </ScrollView>
//   );
// }
