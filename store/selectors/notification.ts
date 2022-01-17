export const getHasChatNotificationsSelector = ({ notification }: any) => notification.chat ?? false;
export const getNotSeenChatMessagesCountSelector = ({ notification }: any) => notification.notSeenMessagesCount ?? 0;
export const getLikesCountSelector = ({ notification }: any) => notification.likesCount ?? 0;
