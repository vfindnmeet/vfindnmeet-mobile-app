export const getLikeUsersSelector = ({ like }: any) => like.users ?? [];
export const getLikeUsersLoadingSelector = ({ like }: any) => like.loading ?? true;
