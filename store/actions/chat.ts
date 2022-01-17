export const TYPE_FETCH_CHATS = 'fetch_chats';
export const TYPE_SET_CHATS = 'set_chats';
export const TYPE_FETCH_OLDER_MESSAGES = 'fetch_older_messages';
export const TYPE_SET_OLDER_MESSAGES = 'set_older_messages';
export const TYPE_FETCH_CHAT = 'fetch_chat';
export const TYPE_SET_CHAT = 'set_chat';
export const TYPE_CLEAR_CHAT = 'clear_chat';
export const TYPE_CLEAR_CHATS = 'clear_chats';
export const TYPE_ADD_CHAT_MESSAGE = 'add_chat_message';
export const TYPE_ADD_NOT_DELIVERED_CHAT_MESSAGE = 'add_not_delivered_chat_message';
export const TYPE_SEE_CHAT = 'see_chat';
export const TYPE_SYNC_CHAT_MESSAGES = 'sync_chat_messages';
export const TYPE_UPDATE_NOT_SEEN_CHATS = 'update_not_seen_chats';

export function fetchOlderMessages() {
  return {
    type: TYPE_FETCH_OLDER_MESSAGES,
    payload: {}
  };
}

export function setOlderMessages(messages: any[]) {
  return {
    type: TYPE_SET_OLDER_MESSAGES,
    payload: messages
  };
}

export function fetchChats() {
  return {
    type: TYPE_FETCH_CHATS,
    payload: {}
  };
}

export function setChats(chats: any[]) {
  return {
    type: TYPE_SET_CHATS,
    payload: chats
  };
}

export function clearChat() {
  return {
    type: TYPE_CLEAR_CHAT,
    payload: {}
  };
}

export function clearChats() {
  return {
    type: TYPE_CLEAR_CHATS,
    payload: {}
  };
}

export function setChat(chat: any) {
  return {
    type: TYPE_SET_CHAT,
    payload: chat
  };
}

export function addChatMessage(message: any) {
  return {
    type: TYPE_ADD_CHAT_MESSAGE,
    payload: message
  };
}

export function setChatSeen(chatId: string, seen: boolean) {
  return {
    type: TYPE_SEE_CHAT,
    payload: { chatId, seen }
  };
}

export function syncChatMessages(messages: any[]) {
  return {
    type: TYPE_SYNC_CHAT_MESSAGES,
    payload: messages
  };
}

export function updateNotSeenChatsMap(notSeenMap: { [key: string]: number }) {
  return {
    type: TYPE_UPDATE_NOT_SEEN_CHATS,
    payload: notSeenMap
  };
}

export const addNotDeliveredChatMessage = (message: any) => ({
  type: TYPE_ADD_NOT_DELIVERED_CHAT_MESSAGE,
  payload: message
});
