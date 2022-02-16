import React, { useEffect, useState } from 'react';
import { View, ScrollView } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { useIsMounted } from '../hooks/useIsMounted';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import BaseHeader from '../navigation/BaseHeader';
import { setProfileInfo } from '../store/actions/profile';
import PersonalityQuiz from '../components/common/personality/PersonalityQuiz';
import BackButton from '../navigation/BackButton';
import PersonalityInfo from '../components/common/personality/PersonalityInfo';
import EStyleSheet from 'react-native-extended-stylesheet';
import { getStorageItem } from '../utils';
import { STORAGE_SHOW_PERSONALITY_INFO_KEY } from '../constants';
import PageLoader from '../components/common/PageLoader';
import PersonalityIntroInfo from '../components/common/personality/PersonalityIntroInfo';

type CalculatedPersonality = {
  personality: string;
  calculation: {
    [key: string]: number;
  };
}

const styles = EStyleSheet.create({
  pageContainer: {
    flex: 1
  },
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  innerContainer: {
    padding: '10rem',
  },
  buttonsContainer: {
    paddingLeft: '10rem',
    paddingRight: '10rem',
  },
  button: {
    width: '100%',
    padding: '5rem',
  },
});

export default function PersonalityQuizScreen(props: any) {
  const dispatch = useDispatch();
  const navigation: any = useNavigation();
  const { t } = useTranslation();

  const [personality, setPersonality] = useState<CalculatedPersonality | undefined>();

  const [info, setInfo] = useState<boolean | null>(null);

  useEffect(() => {
    getStorageItem(STORAGE_SHOW_PERSONALITY_INFO_KEY)
      .then(result => {
        setInfo(result !== 'false');
      })
      .catch(() => {
        setInfo(false);
      })
  }, []);

  if (info === null) {
    return (
      <View style={{
        flex: 1
      }}>
        <BaseHeader
          text={t('Pick personality')}
          leftButton={<BackButton />}
        />
        <PageLoader />
      </View>
    );
  }

  if (info) {
    return (
      <View style={{
        flex: 1
      }}>
        <BaseHeader
          text={t('Pick personality')}
          leftButton={<BackButton />}
        />
        <PersonalityIntroInfo onContinue={() => setInfo(false)} />
      </View>
    );
  }

  return (
    <View style={styles.pageContainer}>
      <BaseHeader
        text={t('Personality quiz')}
        leftButton={<BackButton />}
      />
      {!!personality && (
        <View style={styles.container}>
          <ScrollView>
            <View style={styles.innerContainer}>
              <PersonalityInfo personality={personality} />
            </View>
          </ScrollView>

          <View style={styles.buttonsContainer}>
            <Button
              uppercase={false}
              mode="contained"
              style={styles.button}
              onPress={() => {
                navigation.goBack();
              }}
            >{t('Return to edit profile')}</Button>
          </View>
        </View>
      )}
      {!personality && (
        <View style={styles.innerContainer}>
          <PersonalityQuiz
            setPersonality={(calculatedPersonality: CalculatedPersonality) => {
              setPersonality(calculatedPersonality);
              dispatch(setProfileInfo({ personality_type: calculatedPersonality.personality }));
            }}
          />
        </View>
      )}
    </View>
  );
}
