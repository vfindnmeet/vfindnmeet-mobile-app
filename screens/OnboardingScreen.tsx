import React, { useContext, useState } from 'react';
import { ScrollView, View } from 'react-native';
import {
  Colors,
  ProgressBar
} from "react-native-paper";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import ErrorDialog from '../components/ErrorDialog';
import OnboardingBirthday from '../components/onboarding/OnboardingBirthday';
import OnboardingGender from '../components/onboarding/OnboardingGender';
import OnboardingImages from '../components/onboarding/OnboardingImages';
import OnboardingName from '../components/onboarding/OnboardingName';
import OnboardingOrientation from '../components/onboarding/OnboardingOrientation';
import { useIsMounted } from '../hooks/useIsMounted';
import { completeOnboarding, getOnboardingData } from '../services/api';
import { setOnboardingData } from '../store/actions/onboarding';
import { getTokenSelector } from '../store/selectors/auth';
import { throwErrorIfErrorStatusCode } from '../utils';

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

  const nextStep = () => {
    if (step == 4) {
      getOnboardingData({
        name,
        birthday,
        gender,
        interestedIn
      }, token as string)
        .then(result => result.json())
        .then(({ step, completed_at }: any) => {
          // console.log('==>', step, completed_at);
          if (!!completed_at) {
            // setOnboardingData && setOnboardingData({ step, completed_at });
            dispatch(setOnboardingData({ step, completed_at }));

            return;
          }

          if (!isMounted.current) return;

          setStep(step);
        });
    } else {
      setStep(step + 1);
    }
  };

  const complete = () => {
    completeOnboarding(token as string)
      .then(throwErrorIfErrorStatusCode)
      .then(result => result.json())
      .then(result => {
        // setOnboardingData && setOnboardingData(json);
        // console.log('===>2', result)
        dispatch(setOnboardingData(result));
      })
      .catch(e => {
        setErrorMessage(e.message);
      });
  };

  return (
    <View style={{
      flex: 1
    }}>
      <SafeAreaView>
        <ProgressBar progress={0.2 * step} color={Colors.red800} />
      </SafeAreaView>
      <ScrollView>
        <View style={{
          padding: 15
        }}>
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
  );
};
