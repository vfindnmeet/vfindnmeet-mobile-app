export const getSearchPrefLoadingSelector = ({ searchPref }: any) => searchPref.loading ?? true;
export const getSearchPrefSelector = ({ searchPref }: any) => ((searchPref.fromAge && searchPref.toAge && searchPref.distance) ? {
  fromAge: searchPref.fromAge,
  toAge: searchPref.toAge,
  distance: searchPref.distance
} : undefined);
