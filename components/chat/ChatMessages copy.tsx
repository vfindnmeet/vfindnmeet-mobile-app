// import React, { Fragment, useCallback, useEffect, useRef, useState } from 'react';
// import { useTranslation } from 'react-i18next';
// import { FlatList, ScrollView, Text, View } from 'react-native';
// import { Button, Divider } from 'react-native-paper';
// import { useDispatch, useSelector } from "react-redux";
// import { useIsMounted } from '../../hooks/useIsMounted';
// import { getOlderMessages } from '../../services/api';
// import { fetchOlderMessages, setOlderMessages } from '../../store/actions/chat';
// import { getLoggedUserIdSelector, getTokenSelector } from '../../store/selectors/auth';
// import { getChatMessagesSelector, getChatUserSelector } from "../../store/selectors/chat";
// import { retryHttpRequest, throwErrorIfErrorStatusCode } from '../../utils';
// import ChatMessage from './ChatMessage';

// const MESSAGES_PER_PAGE = 40;

// export default function ChatMessages() {
//   const dispatch = useDispatch();
//   const isMounted = useIsMounted();
//   const { t } = useTranslation();

//   const user = useSelector(getChatUserSelector);
//   const messages = useSelector(getChatMessagesSelector);
//   const token = useSelector(getTokenSelector);

//   // console.log('CHAT USER:', user);

//   const [scrolledAtBottom, setScrolledAtBottom] = useState(true);
//   const [hasOlderMessages, setHasOlderMessages] = useState(!!messages && messages.length > 0);
//   const [loadingOlder, setLoadingOlder] = useState(false);

//   const scrollView = useRef<any>();

//   useEffect(() => {
//     console.log('--!')
//     if (scrolledAtBottom) {
//       console.log('sroll to end!');
//       // scrollView.current.scrollToEnd();
//     }
//   }, [messages]);

//   useEffect(() => {
//     if (isNaN(messages?.length)) return;

//     if (messages.length < MESSAGES_PER_PAGE) {
//       setHasOlderMessages(false);
//     }
//   }, [messages?.length]);

//   // console.log('scrolledAtBottom:', scrolledAtBottom);

//   const isCloseToBottom = useCallback(({ layoutMeasurement, contentOffset, contentSize }: any) => {
//     const paddingToBottom = 20;

//     return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
//   }, []);

//   const onLoadOlder = useCallback(() => {
//     if (!hasOlderMessages) return;

//     setLoadingOlder(true);
//     dispatch(fetchOlderMessages());

//     // getOlderMessages(user.id, token)
//     retryHttpRequest(() => {
//       if (!isMounted.current) return null;

//       // return getOlderMessages(user.id, messages[0]?.createdAt, token);
//       return getOlderMessages(user.id, messages[messages.length - 1]?.createdAt, token);
//     })
//       // .then(throwErrorIfErrorStatusCode)
//       .then((result: any) => result.json())
//       .then((result: any) => {
//         // console.log(result.messages);
//         dispatch(setOlderMessages(result.messages));

//         if (!isMounted.current) return;

//         if (result.messages.length < MESSAGES_PER_PAGE) {
//           setHasOlderMessages(false);
//         }

//         setLoadingOlder(false);
//       })
//       .catch(() => {
//         if (!isMounted.current) return;

//         setLoadingOlder(false);
//       });
//   }, [user, hasOlderMessages, messages]);

//   const loggedUserId = useSelector(getLoggedUserIdSelector);

//   let preDate: string | null = null;

//   return (
//     // <ScrollView
//     //   ref={scrollView}
//     //   style={{ flex: 1, padding: 5 }}
//     //   onScroll={({ nativeEvent }) => {
//     //     setScrolledAtBottom(isCloseToBottom(nativeEvent));
//     //   }}
//     // >
//     <View
//       // ref={scrollView}
//       style={{
//         flex: 1,
//         // padding: 5
//       }}
//     // onScroll={({ nativeEvent }) => {
//     //   setScrolledAtBottom(isCloseToBottom(nativeEvent));
//     // }}
//     >
//       {/* {hasOlderMessages && (
//         <View style={{
//           display: 'flex',
//           flexDirection: 'row',
//           justifyContent: 'center'
//         }}>
//           <Button
//             disabled={loadingOlder}
//             loading={loadingOlder}
//             uppercase={false}
//             mode="text"
//             onPress={onLoadOlder}
//           >{t('Load older')}</Button>
//         </View>
//       )} */}
//       {messages.length === 0 && (
//         <Text style={{ textAlign: 'center' }}>{t('No chat history found.')}</Text>
//       )}
//       {/* <Messages messages={messages} /> */}

//       <FlatList
//         ref={scrollView}
//         // initialScrollIndex={messages.length - 1}
//         onScroll={({ nativeEvent }) => {
//           setScrolledAtBottom(isCloseToBottom(nativeEvent));
//         }}
//         inverted={true}
//         data={messages}
//         keyExtractor={item => item.id}
//         renderItem={(data: any) => {
//           const message = data.item;
//           // console.log(data);
//           const cDate = tsToDate(message.createdAt);

//           const diffDate = preDate !== cDate;
//           preDate = cDate;

//           return (
//             // <Fragment key={message.id}>
//             <>
              
//               {diffDate && (
//                 <View style={{
//                   marginBottom: 10
//                 }}>
//                   <Text>{cDate}</Text>
//                   <Divider />
//                 </View>
//               )}
//               <ChatMessage chat={message} />
//               {/* <ChatMessage key={message.id} chat={message} /> */}
//               {data.index === 0 && (
//                 <View
//                   style={{
//                     display: 'flex',
//                     flexDirection: loggedUserId === message.userId ? 'row-reverse' : 'row',
//                     marginBottom: 5
//                   }}
//                 >
//                   <Text style={{
//                     fontSize: 13,
//                     color: 'gray'
//                   }}>{tsToHourAndMin(message.createdAt)}</Text>
//                 </View>
//               )}
//               {data.index === messages.length - 1 && hasOlderMessages && (
//                 <View style={{
//                   display: 'flex',
//                   flexDirection: 'row',
//                   justifyContent: 'center'
//                 }}>
//                   <Button
//                     disabled={loadingOlder}
//                     loading={loadingOlder}
//                     uppercase={false}
//                     mode="text"
//                     onPress={onLoadOlder}
//                   >{t('Load older')}</Button>
//                 </View>
//               )}
//             </>
//             // </Fragment>
//           );
//         }}
//       />
//     </View>
//   );
// }

// const tsToDate = (ts: number) => {
//   const date = new Date(+ts);
//   const now = new Date();
//   const isDiffYear = now.getFullYear() !== date.getFullYear();

//   const f = (n: number) => n < 10 ? `0${n}` : n;

//   return `${f(date.getDate())}/${f(date.getMonth() + 1)}` + (isDiffYear ? `/${date.getFullYear()}` : '');
// };

// const tsToHourAndMin = (ts: number) => {
//   const date = new Date(+ts);

//   const f = (n: number) => n < 10 ? `0${n}` : n;

//   return `${f(date.getHours())}:${f(date.getMinutes())}`;
// };

// function Messages({ messages }: any) {
//   const loggedUserId = useSelector(getLoggedUserIdSelector);

//   let preDate: string | null = null;

//   return (
//     <>
//       <FlatList
//         data={messages}
//         renderItem={(data: any) => {
//           const message = data.item;
//           console.log(data);
//           const cDate = tsToDate(message.createdAt);

//           const diffDate = preDate !== cDate;
//           preDate = cDate;

//           return (
//             // <Fragment key={message.id}>
//             <>
//               {diffDate && (
//                 <View style={{
//                   marginBottom: 10
//                 }}>
//                   <Text>{cDate}</Text>
//                   <Divider />
//                 </View>
//               )}
//               <ChatMessage key={message.id} chat={message} />
//               {data.index === messages.length - 1 && (
//                 <View
//                   style={{
//                     display: 'flex',
//                     flexDirection: loggedUserId === message.userId ? 'row-reverse' : 'row',
//                     marginBottom: 5
//                   }}
//                 >
//                   <Text style={{
//                     fontSize: 13,
//                     color: 'gray'
//                   }}>{tsToHourAndMin(message.createdAt)}</Text>
//                 </View>
//               )}
//             </>
//             // </Fragment>
//           );
//         }}
//         keyExtractor={item => item.id}
//       />
//       {/* {messages.map((message: any) => {
//         const cDate = tsToDate(message.createdAt);

//         const diffDate = preDate !== cDate;
//         preDate = cDate;

//         return (
//           <Fragment key={message.id}>
//             {diffDate && (
//               <View style={{
//                 marginBottom: 10
//               }}>
//                 <Text>{cDate}</Text>
//                 <Divider />
//               </View>
//             )}
//             <ChatMessage key={message.id} chat={message} />
//           </Fragment>
//         );
//       })} */}
//       {/* {messages.length > 0 && (
//         <View
//           style={{
//             display: 'flex',
//             flexDirection: loggedUserId === messages[messages.length - 1].userId ? 'row-reverse' : 'row',
//             marginBottom: 5
//           }}
//         >
//           <Text style={{
//             fontSize: 13,
//             color: 'gray'
//           }}>{tsToHourAndMin(messages[messages.length - 1].createdAt)}</Text>
//         </View>
//       )} */}
//     </>
//   );
// }
