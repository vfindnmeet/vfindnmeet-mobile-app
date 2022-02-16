import { TYPE_ADD_CHAT_MESSAGE, TYPE_ADD_NOT_DELIVERED_CHAT_MESSAGE, TYPE_CLEAR_CHAT, TYPE_CLEAR_CHATS, TYPE_FETCH_CHAT, TYPE_FETCH_CHATS, TYPE_FETCH_OLDER_MESSAGES, TYPE_MEDIA_REPORTED, TYPE_SEE_CHAT, TYPE_SET_CHAT, TYPE_SET_CHATS, TYPE_SET_OLDER_MESSAGES, TYPE_SET_WOULD_YOU_RATHER_GAME_QUESTIONS, TYPE_SYNC_CHAT_MESSAGES, TYPE_UPDATE_NOT_SEEN_CHATS } from "../actions/chat";

const INITIAL_STATE: any = {};

export default function chatReducer(state = INITIAL_STATE, action: { type: string, payload: any }) {
  switch (action.type) {
    case TYPE_FETCH_CHATS:
      return {
        loadingChats: true
      };
    case TYPE_SET_CHATS:
      // console.log('action.payload:', JSON.stringify(action.payload, null, 2));
      return {
        chats: action.payload,
        loadingChats: false
      };
    case TYPE_FETCH_OLDER_MESSAGES:
      return {
        ...state,
        loadingMessages: true
      };
    case TYPE_SET_OLDER_MESSAGES:
      // console.log("___________:");
      // console.log('---->action.payload', action.payload);
      // console.log(JSON.stringify(state.messages, null, 2));
      return {
        ...state,
        messages: [
          ...state.messages,
          ...(action.payload ?? []).reverse(),
          // ...action.payload,
          // ...state.messages
        ],
        loadingMessages: false
      };
    case TYPE_FETCH_CHAT:
      return {
        ...state,
        loading: true
      };
    case TYPE_SET_CHAT:
      // console.log('---->action.payload', action.payload);
      return {
        ...state,
        ...action.payload,
        chats: (state.chats ?? []).map((chat: any) => {
          if (chat.id === action.payload.user.id) {
            return {
              ...chat,
              chatId: action.payload.chatId
            };
          }

          return chat;
        }),


        messages: (action.payload.messages ?? []).reverse(),


        loading: false
      };
    case TYPE_CLEAR_CHAT:
      return {
        ...state,
        loading: true
      };
    case TYPE_CLEAR_CHATS:
      return {
        ...state,
        loadingChats: true
      };
    case TYPE_ADD_CHAT_MESSAGE: {
      let chats = state.chats ?? [];

      // console.log('NEW MSG:');
      // console.log('NEW MSG:', JSON.stringify(action.payload, null, 2));

      const isNewChat = chats.filter((chat: any) => chat.chatId === action.payload.chatId).length <= 0;
      // const isNewChat = chats.filter((chat: any) => chat.chatId === action.payload.chatId).length <= 0;

      // .map((chat: any) => ({
      //   ...chat,
      //   lastMessage: chat.chatId === action.payload.chatId ? action.payload : chat.lastMessage,
      //   // notSeen: chat.chatId === action.payload.chatId && chat.id === action.payload.id ?
      //   //   true :
      //   //   chat.notSeen
      // }));

      // console.log('IS NEW:', isNewChat);

      if (isNewChat) {
        chats = [
          {
            id: action.payload.user.id,
            name: action.payload.user.name,
            gender: action.payload.user.gender,
            chatId: action.payload.chatId,
            profileImage: action.payload.user.profileImage,
            verification_status: action.payload.user.verification_status,
            lastMessageAt: action.payload.createdAt,
            status: action.payload.user.status,
            lastMessage: {
              id: action.payload.id,
              text: action.payload.text,
              chatId: action.payload.chatId,
              userId: action.payload.userId,
              gameInfoId: action.payload.gameInfoId,
              createdAt: action.payload.createdAt,
              game: {
                gameType: action.payload?.game?.gameType,
                gameStage: action.payload?.game?.gameStage,
              }
            }
          },
          ...chats
        ];
      } else {
        chats = chats.map((chat: any) => ({
          ...chat,
          lastMessage: chat.chatId === action.payload.chatId ? action.payload : chat.lastMessage,
          // notSeen: chat.chatId === action.payload.chatId && chat.id === action.payload.id ?
          //   true :
          //   chat.notSeen
        }));
        const index = chats.findIndex((chat: any) => chat.chatId === action.payload.chatId);
        if (index > 0) {
          const el = chats.splice(index, 1)[0];
          el && chats.unshift(el);
        }
      }

      return {
        ...state,
        chats,
        messages: [action.payload, ...(state.messages ?? [])]
      };
    }
    case TYPE_MEDIA_REPORTED:
      return {
        ...state,
        messages: (state.messages ?? []).map((message: any) => {
          if (message.id !== action.payload.messageId) return message;

          return {
            ...message,
            imageReported: true
          };
        })
      };
    case TYPE_ADD_NOT_DELIVERED_CHAT_MESSAGE: {
      // let chats = state.chats ?? [];

      // console.log('NEW MSG:');
      // console.log(JSON.stringify(action.payload, null, 2));

      // chats = chats.map((chat: any) => ({
      //   ...chat,
      //   lastMessage: chat.chatId === action.payload.chatId ? action.payload : chat.lastMessage
      // }));
      // const index = chats.findIndex((chat: any) => chat.chatId === action.payload.chatId);
      // if (index > 0) {
      //   const el = chats.splice(index, 1)[0];
      //   el && chats.unshift(el);
      // }

      const messages = [...(state.messages ?? [])];
      // let ti;
      let added = false;
      const r = [];
      for (let i = messages.length - 1; i >= 0; i--) {
        // if (!added && messages[i].createdAt < action.payload.createdAt) {
        //   r.push(action.payload);
        //   added = true;
        // }
        // if (!added && messages[i].createdAt > action.payload.createdAt) {
        //   r.push(action.payload);
        //   added = true;
        // }
        r.push(messages[i]);
      }
      if (messages.length === 0) {
        // r.push(action.payload);
      }
      r.push(action.payload);

      return {
        ...state,
        messages: r.reverse()
        // messages: [...(state.messages ?? []), action.payload]
      };
    }
    case TYPE_SYNC_CHAT_MESSAGES: {
      // console.log('NEW MSG:');
      // console.log(JSON.stringify(action.payload, null, 2));

      const messages: any[] = state.messages ?? [];

      return {
        ...state,
        messages: [
          ...messages,
          ...action.payload.filter((message: any) => {
            return messages.findIndex(({ id }) => message.id === id) !== -1;
          })
        ]
      };
    }
    case TYPE_UPDATE_NOT_SEEN_CHATS:
      // console.log('NEW MSG:');
      // console.log(JSON.stringify(action.payload, null, 2));

      return {
        ...state,
        chats: state.chats.map((chat: any) => ({
          ...chat,
          notSeen: !!(action.payload[chat.chatId] ?? chat.notSeen)
        }))
      };
    case TYPE_SEE_CHAT:
      if (!action.payload?.chatId) return state;

      return {
        ...state,
        chats: (state.chats ?? []).map((chat: any) => ({
          ...chat,
          notSeen: chat.chatId === action.payload.chatId ?
            false : // !action.payload.seen :
            chat.notSeen
        }))
      };
    case TYPE_SET_WOULD_YOU_RATHER_GAME_QUESTIONS:
      return {
        ...state,
        wouldYouRatherQuestions: action.payload
      };
  }

  return state;
}
