import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { STORAGE_LOGIN_DATA_KEY } from "../constants";
import UnauthorizedError from "../errors/UnauthorizedError";
import { getOnboardingStep } from "../services/api";
import { logOutUser } from "../store/actions/auth";
import { fetchOnboardingData, setOnboardingData } from "../store/actions/onboarding";
import { removeStorageItem, retryHttpRequest } from "../utils";
import { useIsMounted } from "./useIsMounted";

export default function useFetchOnboardingState(token: string) {
  const dispatch = useDispatch();
  const isMounted = useIsMounted();

  useEffect(() => {
    if (!token) {
      return;
    }

    dispatch(fetchOnboardingData());

    retryHttpRequest(() => {
      if (!isMounted.current) return null;

      return getOnboardingStep(token);
    })
      .then((result: any) => result.json())
      .then((result: {
        step: number;
        completed_at: number;
      }) => {
        dispatch(setOnboardingData(result));
      })
      .catch(e => {
        // console.log(e);
        if (e instanceof UnauthorizedError) {
          removeStorageItem(STORAGE_LOGIN_DATA_KEY).then(() => dispatch(logOutUser()))
        }
      });
  }, [token]);
}
