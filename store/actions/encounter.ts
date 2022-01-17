export const TYPE_FETCH_RECOMMENDATIONS = 'fetch_recommendations';
export const TYPE_SET_RECOMMENDATIONS = 'set_recommendations';
export const TYPE_CLEAR_RECOMMENDATIONS = 'clear_recommendations';

export function fetchRecommendations() {
  return {
    type: TYPE_FETCH_RECOMMENDATIONS,
    payload: {}
  };
}

export function setRecommendations(recommendations: string[]) {
  return {
    type: TYPE_SET_RECOMMENDATIONS,
    payload: recommendations
  };
}

export function clearRecommendations() {
  return {
    type: TYPE_CLEAR_RECOMMENDATIONS,
    payload: { }
  };
}
