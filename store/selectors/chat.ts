export const getCurrentChatIdSelector = ({ chat }: any) => chat.chatId;
export const getChatUserSelector = ({ chat }: any) => chat.user;
export const getChatMessagesSelector = ({ chat }: any) => chat.messages ?? [];
export const getHasChatMessagesSelector = ({ chat }: any) => (chat.messages ?? []).length > 0;
export const getChatLoadingSelector = ({ chat }: any) => chat.loading ?? true;
export const getChatsSelector = ({ chat }: any) => chat.chats;
export const getChatsLoadingSelector = ({ chat }: any) => chat.loadingChats ?? true;
export const getWouldYouRatherQuestionsSelector = ({ chat }: any) => chat.wouldYouRatherQuestions ?? null;
