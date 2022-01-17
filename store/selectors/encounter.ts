export const getRecommendationsLoadingSelector = ({ encounter }: any) => encounter.loading ?? true;
export const getRecommendationsSelector = ({ encounter }: any) => encounter.recommendations ?? [];
