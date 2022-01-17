import React, { useEffect } from 'react';
import { useRoute } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { clearRoute, setRoute } from '../store/actions/route';

export default function useRouteTrack() {
  const route = useRoute();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setRoute({
      routeName: route.name,
      params: route.params
    }));

    return () => {
      dispatch(clearRoute());
    };
  }, []);
}