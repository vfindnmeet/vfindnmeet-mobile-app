// import React, { createContext, useEffect, useState } from "react";
// import { w3cwebsocket } from "websocket";
// import { useDispatch, useSelector } from "react-redux";
// import { getLoggedUserIdSelector, getTokenSelector } from "./selectors/auth";
// import config from "../config";
// import { addChatMessage, setChatSeen, syncChatMessages, updateNotSeenChatsMap } from "./actions/chat";
// import { getChatMessagesSelector, getCurrentChatIdSelector } from "./selectors/chat";
// import { setChatNotSeen, setLikesCount, setNotifsCount } from "./actions/notification";
// import { parseJson, retryHttpRequest, throwErrorIfErrorStatusCode } from "../utils";
// import { getRouteSelector } from "./selectors/route";
// import { getMessagesAfterTs, getNotSeenMessagesPerChat } from "../services/api";

// const RECONNECT_AFTER_TIME = 5000; // 5 seconds
// const PING_INTERVAL_TIME = 15000; // 15 seconds
// const PONG_WAIT_TIME = 5000; // 5 seconds

// const buildMessage = (type: string, payload: any) => JSON.stringify({ type, payload });

// const sendWsMessage = (ws: any, type: string, msg: any = {}) => {
//   if (!ws) return;

//   ws.send(buildMessage(type, msg));
// };

// const createWS = ({
//   token,
//   onMessage,
//   reopenWs
// }: {
//   token: string,
//   onMessage: (msg: { type: string, payload: any }) => void,
//   reopenWs: () => void
// }) => {
//   console.log('CREATING WS...');
//   const ws = new w3cwebsocket(`${config.WS_ENDPOINT}?token=${token}`);

//   let pingInterval: any;
//   let pongWaitTimeout: any;

//   const scheduleWsReopen = () => {
//     setTimeout(() => {
//       // initWS();
//       reopenWs();
//     }, RECONNECT_AFTER_TIME);
//   }

//   const scheduleWsClose = () => {
//     pongWaitTimeout = setTimeout(() => {
//       if (!ws) return;

//       ws.close();
//     }, PONG_WAIT_TIME);
//   };

//   ws.onopen = () => {
//     pingInterval = setInterval(() => {
//       sendWsMessage(ws, 'ping');
//       scheduleWsClose();
//     }, PING_INTERVAL_TIME);
//   };

//   ws.onclose = () => {
//     console.log('WS CLOSE');
//     clearInterval(pingInterval);
//   };

//   ws.onerror = () => {
//     console.log('WS ERROR');
//     scheduleWsReopen();
//   };

//   ws.onmessage = (message: any) => {
//     const msg: { type: string, payload: any } = parseJson(message.data as string);

//     if (msg.type === 'pong') {
//       clearTimeout(pongWaitTimeout);
//       return;
//     }

//     onMessage(msg);
//   };

//   return ws;
// };

// export const WsContext = createContext({
//   ws: null,
// } as any);

// export default function WsContextProvider(props: any) {
//   const dispatch = useDispatch();

//   const route = useSelector(getRouteSelector);
//   const chatMessages = useSelector(getChatMessagesSelector);
//   // const currentChatId = useSelector(getCurrentChatIdSelector);
//   const token = useSelector(getTokenSelector);

//   const [socket, setSocket] = useState<any>(null);
//   const [lastMessage, setLastMessage] = useState<any | null>(null);

//   const [wsReopen, setWsReopen] = useState<any | null>(null);
//   // const [wsReopen2, setWsReopen2] = useState<any | null>(null);

//   useEffect(() => {
//     if (!socket || socket.readyState !== WebSocket.OPEN) return;

//     console.log("\n==================1\n\nWS REOPEN!!\n\n=====================2\n");

//     setWsReopen(socket);
//   }, [socket?.readyState]);

//   // useEffect(() => {
//   //   // if (!socket || socket.readyState !== WebSocket.OPEN) return;

//   //   console.log("\n==================1\n\nWS REOPEN2!!\n\n=====================2\n", !!socket);

//   //   setWsReopen2(socket);
//   // }, [socket]);

//   useEffect(() => {
//     if (!wsReopen) return;

//     (async () => {
//       if (route?.route === 'UserChat') {
//         // const { messages } = await getMessagesAfterTs(
//         //   route?.params?.userId,
//         //   chatMessages[chatMessages.length - 1]?.createdAt,
//         //   token
//         // )
//         const { messages } = await retryHttpRequest(getMessagesAfterTs.bind(
//           null,
//           route?.params?.userId,
//           chatMessages[chatMessages.length - 1]?.createdAt,
//           token
//         ))
//           // .then(throwErrorIfErrorStatusCode)
//           .then((response: any) => response.json());

//         dispatch(syncChatMessages(messages));
//       } else if (route?.route === 'Chats') {
//         const notSeenMap = await retryHttpRequest(getNotSeenMessagesPerChat.bind(null, token))
//           // .then(throwErrorIfErrorStatusCode)
//           .then((response: any) => response.json());

//         dispatch(updateNotSeenChatsMap(notSeenMap));
//       }

//       setWsReopen(null);
//     })();
//   }, [
//     wsReopen,
//     route?.route,
//     route?.params?.userId,
//     chatMessages,
//     token
//   ]);

//   const initWS = () => {
//     console.log('INIT WS');
//     if (socket) {
//       console.log('closing existing ws...');
//       socket.close();
//     }
//     // setSocket(createWS());
//     setSocket(createWS({
//       token,
//       onMessage: (msg) => {
//         if (msg.type === 'msg') {
//           console.log('MSG:', JSON.stringify(msg.payload, null, 2))
//           dispatch(addChatMessage(msg.payload));
//         } else if (msg.type === 'notifs_count') {
//           dispatch(setNotifsCount(msg.payload));
//         } else if (msg.type === 'liked') {
//           dispatch(setLikesCount(msg.payload?.likesCount));
//         }

//         setLastMessage(msg);
//       },
//       reopenWs: () => initWS()
//     }));
//   };

//   // const createWS = () => {
//   //   console.log('CREATING WS...');
//   //   const ws = new w3cwebsocket(`${config.WS_ENDPOINT}?token=${token}`);

//   //   let pingInterval: any;
//   //   let pongWaitTimeout: any;

//   //   const scheduleWsReopen = () => {
//   //     setTimeout(() => {
//   //       initWS();
//   //     }, RECONNECT_AFTER_TIME);
//   //   }

//   //   const scheduleWsClose = () => {
//   //     pongWaitTimeout = setTimeout(() => {
//   //       if (!ws) return;

//   //       ws.close();
//   //     }, PONG_WAIT_TIME);
//   //   };

//   //   ws.onopen = () => {
//   //     pingInterval = setInterval(() => {
//   //       sendWsMessage(ws, 'ping');
//   //       scheduleWsClose();
//   //     }, PING_INTERVAL_TIME);
//   //   };

//   //   ws.onclose = () => {
//   //     console.log('WS CLOSE');
//   //     clearInterval(pingInterval);
//   //   };

//   //   ws.onerror = () => {
//   //     console.log('WS ERROR');
//   //     scheduleWsReopen();
//   //   };

//   //   ws.onmessage = (message: any) => {
//   //     const msg: { type: string, payload: any } = parseJson(message.data as string);

//   //     if (msg.type === 'msg') {
//   //       dispatch(addChatMessage(msg.payload));
//   //     } else if (msg.type === 'notifs_count') {
//   //       dispatch(setNotifsCount(msg.payload));
//   //     } else if (msg.type === 'liked') {
//   //       dispatch(setLikesCount(msg.payload?.likesCount));
//   //     } else if (msg.type === 'pong') {
//   //       clearTimeout(pongWaitTimeout);
//   //     }

//   //     setLastMessage(msg);
//   //   };

//   //   return ws;
//   // };

//   useEffect(() => {
//     if (!token) {
//       console.log('WS LOGOUT..');
//       if (socket) {
//         console.log('WS CLOSING..', socket.readyState);
//         socket.close();
//       }
//       return;
//     }

//     initWS();

//     return () => {
//       if (!socket) return;
//       // if (![WebSocket.CLOSED, WebSocket.CLOSING].includes(socket.readyState)) {
//       // }
//       console.log('token unload ws close...')
//       socket.close();
//     };
//   }, [token]);

//   const sendMessage = (type: string, msg: any = {}) => {
//     sendWsMessage(socket, type, msg);
//   };

//   return (
//     <WsContext.Provider value={{
//       sendMessage,
//       lastMessage
//     }}>
//       {props.children}
//     </WsContext.Provider>
//   );
// };
