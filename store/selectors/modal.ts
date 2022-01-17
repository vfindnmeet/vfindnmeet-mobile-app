export const shouldShowIntroModal = ({ modal }: any) => modal.showIntroModal ?? false;
export const getIntroModalDataSelector = ({ modal }: any) => ({
  likeId: modal.likeId,
  userId: modal.userId,
  name: modal.name
});
export const shouldShowSearchPrefModal = ({ modal }: any) => modal.showSearchPrefModal ?? false;
export const shouldShowIntroMessageModal = ({ modal }: any) => modal.showIntroMessageModal ?? false;
export const getIntroMessageModalDataSelector = ({ modal }: any) => ({
  userId: modal.userId,
  name: modal.name,
  fromUserId: modal.fromUserId,
  message: modal.message
});
export const shouldShowDeactivateModal = ({ modal }: any) => modal.showDeactivateModal ?? false;
export const shouldShowBrowseOptionModalSelector = ({ modal }: any) => modal.showBrowseOptionModal ?? false;
export const getBrowseOptionModalDataSelector = ({ modal }: any) => ({
  onlineOnly: modal.onlineOnly
});
export const shouldShowMatchModalSelector = ({ modal }: any) => modal.showMatchModal ?? false;
export const getMatchModalDataSelector = ({ modal }: any): {
  me: {
    id: string;
    profileImage: string,
    name: string;
    gender: string;
  },
  user: {
    id: string;
    profileImage: string,
    name: string;
    gender: string;
  },
} => ({
  me: modal.me,
  user: modal.user
});
export const shouldShowVerifyModalSelector = ({ modal }: any) => modal.showVerifyModal ?? false;
