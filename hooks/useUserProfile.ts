import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useIsMounted } from '../hooks/useIsMounted';
import { getInterests, getProfileQuestions, getUserProfile } from '../services/api';
import { setAllInterests, setAllProfileQuestions } from '../store/actions/common';
import { clearUser, fetchUser, setUser } from '../store/actions/user';
import { getTokenSelector } from '../store/selectors/auth';
import { getUserLoadingSelector, getUserSelector } from '../store/selectors/user';
import { retryHttpRequest } from '../utils';

export default function useUserProfile(userId: string) {
  const dispatch = useDispatch();
  const isMounted = useIsMounted();

  const user: any = useSelector(getUserSelector);
  const loading: boolean = useSelector(getUserLoadingSelector);
  const token = useSelector(getTokenSelector);

  const allInterests: any = useSelector(({ common }: any) => common.interests);
  const allProfileQuestions: any = useSelector(({ common }: any) => common.profileQuestions);

  useEffect(() => {
    if (allInterests) {
      return;
    }

    retryHttpRequest(() => {
      if (!isMounted.current) return null;

      return getInterests(token as string);
    })
      .then((result: any) => result.json())
      .then((interests: any) => {
        dispatch(setAllInterests(interests));
      })
  }, []);

  useEffect(() => {
    if (allProfileQuestions) {
      return;
    }

    retryHttpRequest(() => {
      if (!isMounted.current) return null;

      return getProfileQuestions(token as string);
    })
      .then((result: any) => result.json())
      .then(allProfileQuestions => {
        dispatch(setAllProfileQuestions(allProfileQuestions));
      })
  }, []);

  useEffect(() => {
    dispatch(fetchUser());

    retryHttpRequest(() => {
      if (!isMounted.current) return null;

      return getUserProfile(userId, token);
    })
      .then((result: any) => result.json())
      .then(result => {
        if (!isMounted.current) return;

        dispatch(setUser(result));
      });

    return () => {
      dispatch(clearUser());
    };
  }, [userId]);

  return [user, allInterests, allProfileQuestions, loading || !allInterests || !allProfileQuestions];
};
