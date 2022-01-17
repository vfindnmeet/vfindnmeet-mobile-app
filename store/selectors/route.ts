export const getRouteSelector = ({ route }: any) => ({
  route: route.routeName,
  params: route.params,
});
