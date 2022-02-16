export const shouldShowIntroModal = ({ modal }: any) => modal.showIntroModal ?? false;
export const getIntroModalDataSelector = ({ modal }: any) => modal;
export const shouldShowSearchPrefModal = ({ modal }: any) => modal.showSearchPrefModal ?? false;
export const shouldShowIntroMessageModal = ({ modal }: any) => modal.showIntroMessageModal ?? false;
export const getIntroMessageModalDataSelector = ({ modal }: any) => modal;
export const shouldShowDeactivateModal = ({ modal }: any) => modal.showDeactivateModal ?? false;
export const shouldShowBrowseOptionModalSelector = ({ modal }: any) => modal.showBrowseOptionModal ?? false;
export const getBrowseOptionModalDataSelector = ({ modal }: any) => modal;
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
export const shouldShowErrorModalSelector = ({ modal }: any) => modal.showErrorModal ?? false;
export const getMatchErrorDataSelector = ({ modal }: any): {
  message: string
} => modal;
export const shouldShowIcebreakerModalSelector = ({ modal }: any) => modal.showIcebreakerModal ?? false;
export const shouldShowFeedbackModalSelector = ({ modal }: any) => modal.showFeedbackModal ?? false;
export const shouldQuestionGameModalSelector = ({ modal }: any) => modal.showQuestionGameModal ?? false;
export const shouldShowGameInfoModalSelector = ({ modal }: any) => modal.showGameInfoModal ?? false;
export const getQuestionGameModalDataSelector = ({ modal }: any) => modal;
export const getModalDataSelector = ({ modal }: any) => modal;
export const shouldShowPersonalityModalSelector = ({ modal }: any) => modal.showPersonalityModal ?? false;
export const shouldShowPersonalityInfoModalSelector = ({ modal }: any) => modal.showPersonalityInfoModal ?? false;
