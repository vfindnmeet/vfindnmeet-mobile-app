export const TYPE_SET_ROUTE = 'set_route';
export const TYPE_CLEAR_ROUTE = 'clear_route';

export function setRoute(data: {
  routeName: string;
  params?: { [key: string]: any }
}) {
  return {
    type: TYPE_SET_ROUTE,
    payload: data
  };
}

export function clearRoute() {
  return {
    type: TYPE_CLEAR_ROUTE,
    payload: {}
  };
}
