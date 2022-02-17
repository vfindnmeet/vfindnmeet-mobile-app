import React, { useCallback, useContext, useState } from 'react';
import { ScrollView, View } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import {
  Colors,
  ProgressBar
} from "react-native-paper";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import ErrorDialog from '../components/modal/ErrorDialog';
import OnboardingBirthday from '../components/onboarding/OnboardingBirthday';
import OnboardingGender from '../components/onboarding/OnboardingGender';
import OnboardingImages from '../components/onboarding/OnboardingImages';
import OnboardingName from '../components/onboarding/OnboardingName';
import OnboardingOrientation from '../components/onboarding/OnboardingOrientation';
import UnauthorizedError from '../errors/UnauthorizedError';
import { useIsMounted } from '../hooks/useIsMounted';
import { completeOnboarding, getOnboardingData, setAuthInfo } from '../services/api';
import { logOutUser } from '../store/actions/auth';
import { hideErrorModal } from '../store/actions/modal';
import { setOnboardingData } from '../store/actions/onboarding';
import { getTokenSelector } from '../store/selectors/auth';
import { shouldShowErrorModalSelector } from '../store/selectors/modal';
import { getLatLng, handleError, retryHttpRequest, throwErrorIfErrorStatusCode, updateLocationAndPushToken } from '../utils';

const styles = EStyleSheet.create({
  pageContainer: {
    flex: 1
  },
  innerContainer: {
    padding: '15rem'
  },
});

const MErrorDialog = React.memo(ErrorDialog);

export default function OnboardingScreen({ curStep, navigation }: any) {
  const isMounted = useIsMounted();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<number>(curStep);
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [interestedIn, setInterestedIn] = useState('');
  const [birthday, setBirthday] = useState<string>('');
  const [images, setImages] = useState<any[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const token = useSelector(getTokenSelector);

  const showErrorModal = useSelector(shouldShowErrorModalSelector);
  const hideErrorM = useCallback(() => dispatch(hideErrorModal()), []);

  const nextStep = () => {
    console.log('step=', step);
    if (step == 4) {
      // return getOnboardingData({
      //   name,
      //   birthday,
      //   gender,
      //   interestedIn
      // }, token as string)
      return retryHttpRequest(() => {
        if (!isMounted.current) return null;

        return getOnboardingData({
          name,
          birthday,
          gender,
          interestedIn
        }, token as string);
      })
        .then((result: any) => result.json())
        .then(({ step, completed_at }: any) => {
          if (!!completed_at) {
            // setOnboardingData && setOnboardingData({ step, completed_at });

            // dispatch(setOnboardingData({ step, completed_at }));
            return updateLocationAndPushToken(token, isMounted)
              .then(() => {
                dispatch(setOnboardingData({ step, completed_at }));
              });
          }

          if (!isMounted.current) return;

          setStep(step);
        })
        .catch(err => {
          handleError(err, dispatch);
        });
    } else {
      setStep(step + 1);
    }
  };

  const complete = () => {
    return completeOnboarding(token as string)
      .then(throwErrorIfErrorStatusCode)
      .then(result => result.json())
      .then(result => {
        // setOnboardingData && setOnboardingData(json);
        // dispatch(setOnboardingData(result));
        return updateLocationAndPushToken(token, isMounted)
          .then(() => {
            dispatch(setOnboardingData(result));
          });
      })
      .catch(e => {
        if (e instanceof UnauthorizedError) {
          dispatch(logOutUser());

          return;
        }

        setErrorMessage(e.message);
      });
  };

  return (
    <>
      <View style={styles.pageContainer}>
        <SafeAreaView>
          <ProgressBar progress={0.2 * step} color={Colors.red800} />
        </SafeAreaView>
        <ScrollView>
          <View style={styles.styles}>
            {
              step === 1 ? (
                <OnboardingGender nextStep={nextStep} setGender={setGender} />
              ) : (
                step === 2 ? (
                  <OnboardingOrientation nextStep={nextStep} setInterestedIn={setInterestedIn} />
                ) : (
                  step === 3 ? (
                    <OnboardingName nextStep={nextStep} setName={setName} />
                  ) : (
                    step === 4 ? (
                      <OnboardingBirthday nextStep={nextStep} setBirthday={setBirthday} />
                    ) : (
                      <OnboardingImages complete={complete} setImages={setImages} setErrorMessage={setErrorMessage} />
                    )
                  )
                )
              )
            }
          </View>
        </ScrollView>

        <ErrorDialog message={errorMessage} show={!!errorMessage} onHide={() => setErrorMessage('')} />
      </View>

      <MErrorDialog
        show={showErrorModal}
        onHide={hideErrorM}
      />
    </>
  );
};
