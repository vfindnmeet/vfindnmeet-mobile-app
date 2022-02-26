export const TYPE_FETCH_RECOMMENDATIONS = 'fetch_recommendations';
export const TYPE_SET_RECOMMENDATIONS = 'set_recommendations';
export const TYPE_CLEAR_RECOMMENDATIONS = 'clear_recommendations';
// export const TYPE_REMOVE_RECOMMENDATION_USER = 'remove_recommendation_user';

export const fetchRecommendations = () => ({
  type: TYPE_FETCH_RECOMMENDATIONS,
  payload: {}
});

export const setRecommendations = (recommendations: string[]) => ({
  type: TYPE_SET_RECOMMENDATIONS,
  payload: recommendations
});

export const clearRecommendations = () => ({
  type: TYPE_CLEAR_RECOMMENDATIONS,
  payload: {}
});

// export const removeRecommendationUser = (userId: string) => ({
//   type: TYPE_REMOVE_RECOMMENDATION_USER,
//   payload: { userId }
// });
