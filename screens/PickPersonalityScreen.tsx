import React, { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { View, ScrollView, TouchableWithoutFeedback } from 'react-native';
import { Button, TouchableRipple, Colors, Text, Badge, Checkbox, Divider } from 'react-native-paper';
import { setPersonality } from '../services/api';
import { getStorageItem, handleError, removeStorageItem, setStorageItem, throwErrorIfErrorStatusCode } from '../utils';
import { useDispatch, useSelector } from 'react-redux';
import { getLoggedUserIdSelector, getTokenSelector } from '../store/selectors/auth';
import { useIsMounted } from '../hooks/useIsMounted';
import { useNavigation } from '@react-navigation/native';
import { showPersonalityInfoModal } from '../store/actions/modal';
import { useTranslation } from 'react-i18next';
import { PERSONALITY_INFO, PERSONALITY_MEANING, PERSONALITY_SHORT, PERSONALITY_TYPES } from '../components/common/personality/PersonalityInfoData';
import BaseHeader from '../navigation/BaseHeader';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { setProfileInfo } from '../store/actions/profile';
import BackButton from '../navigation/BackButton';
import EStyleSheet from 'react-native-extended-stylesheet';
import { STORAGE_SHOW_PERSONALITY_INFO_KEY } from '../constants';
import PageLoader from '../components/common/PageLoader';
import PersonalityIntroInfo from '../components/common/personality/PersonalityIntroInfo';

const styles = EStyleSheet.create({
  itemContainer: {
    padding: '15rem',
    paddingLeft: '30rem',
    paddingRight: '30rem',
    marginLeft: '10rem',
    marginRight: '10rem',

    borderRadius: '5rem',
    marginTop: '5rem',
    // marginTop: '20rem',
  },
  itemText: {
    fontSize: '25rem',
    color: Colors.white,
  },
  itemBadge: {
    position: 'absolute',
    top: '-5rem',
    right: '-5rem'
  },
  pageContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  buttonsContainer: {
    padding: '10rem'
  },
  infoButton: {
    marginBottom: '10rem',
  },
  button: {
    width: '100%',
    padding: '5rem',
    borderRadius: 1000,
  },
  sectionTitle: {
    marginTop: '10rem',
    marginBottom: '5rem',
    fontSize: '25rem',
    marginLeft: '10rem',
    fontWeight: 'bold'
  },
  divider: {
    borderBottomColor: Colors.grey600,
    borderBottomWidth: 1,

    marginTop: '25rem',
    marginLeft: '5rem',
    marginRight: '5rem'
  }
});

const PERSONALITIES_BY_CATEGORY: string[][] = [
  ['INTJ', 'INTP', 'ENTJ', 'ENTP',],
  ['INFJ', 'INFP', 'ENFJ', 'ENFP',],
  ['ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',],
  ['ISTP', 'ISFP', 'ESTP', 'ESFP',],
];

const PERSONALITY_CATEGORIES = [
  'Analysts', 'Diplomats', 'Sentinels', 'Explorers'
];

function PersonalitiesByCategory({
  category,
  selectedPersonality,
  setSelectedPersonality
}: {
  category: number;
  setSelectedPersonality: (personality: string) => void;
  selectedPersonality?: string;
}) {
  return (
    <View>
      <Text style={styles.sectionTitle}>{PERSONALITY_CATEGORIES[category]}</Text>

      <ScrollView
        horizontal={true}
      >
        {PERSONALITIES_BY_CATEGORY[category].map(personality => (
          <TouchableRipple
            key={personality}
            onPress={() => {
              setSelectedPersonality(personality)
            }}
          >
            <View
              style={[styles.itemContainer, {
                backgroundColor: PERSONALITY_INFO[personality].color,
              }]}
            >
              <Text style={styles.itemText}>{personality}</Text>
              {personality === selectedPersonality && (
                <View style={[styles.itemBadge, {
                  padding: 3,
                  borderRadius: 100,
                  backgroundColor: Colors.red400,
                }]}>
                  <MaterialCommunityIcons name="check" color={Colors.white} />
                </View>
                // <Badge style={styles.itemBadge}>
                //   <MaterialCommunityIcons name="check" />
                // </Badge>
              )}
            </View>
          </TouchableRipple>
        ))}
      </ScrollView>
    </View>
  );
}

function CDivider() {
  return (
    <View style={styles.divider} />
  );
}

export default function PickPersonalityScreen(props: any) {
  const isMounted = useIsMounted();
  const dispatch = useDispatch();
  const navigation: any = useNavigation();
  const { t } = useTranslation();

  const token = useSelector(getTokenSelector);

  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState<boolean | null>(null);
  const currentPersonality = props.route.params.personality;
  const [selectedPersonality, setSelectedPersonality] = useState(props.route.params.personality);

  const onPersonalitySelected = useCallback((personality: string) => {
    if (loading) return;

    setSelectedPersonality(personality);
  }, [setSelectedPersonality]);

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
    <View style={{
      flex: 1
    }}>
      <BaseHeader
        text={t('Pick personality')}
        leftButton={<BackButton />}
      />
      <View style={styles.pageContainer}>
        <View>
          <PersonalitiesByCategory
            category={0}
            selectedPersonality={selectedPersonality}
            setSelectedPersonality={onPersonalitySelected}
          />
          <CDivider />
          <PersonalitiesByCategory
            category={1}
            selectedPersonality={selectedPersonality}
            setSelectedPersonality={onPersonalitySelected}
          />
          <CDivider />
          <PersonalitiesByCategory
            category={2}
            selectedPersonality={selectedPersonality}
            setSelectedPersonality={onPersonalitySelected}
          />
          <CDivider />
          <PersonalitiesByCategory
            category={3}
            selectedPersonality={selectedPersonality}
            setSelectedPersonality={onPersonalitySelected}
          />
        </View>
        <View style={styles.buttonsContainer}>
          {!!selectedPersonality && (
            <Button
              uppercase={false}
              mode="contained"
              labelStyle={{
                color: Colors.white
              }}
              style={[styles.infoButton, styles.button]}
              onPress={() => {
                dispatch(showPersonalityInfoModal({
                  personality: selectedPersonality
                }));
              }}
            >{t('More about')} {selectedPersonality} <MaterialCommunityIcons name="information-outline" /></Button>
          )}
          <Button
            uppercase={false}
            mode="contained"
            labelStyle={{
              color: (!selectedPersonality || selectedPersonality === currentPersonality || loading) ? Colors.grey800 : Colors.white
            }}
            disabled={!selectedPersonality || selectedPersonality === currentPersonality || loading}
            loading={loading}
            style={styles.button}
            onPress={() => {
              if (!selectedPersonality || selectedPersonality === currentPersonality || loading) return;

              setLoading(true);

              // updateProfileInfo({ personality_type: selectedPersonality }, token as string)
              setPersonality(selectedPersonality, token)
                .then(throwErrorIfErrorStatusCode)
                .then(() => {
                  dispatch(setProfileInfo({ personality_type: selectedPersonality }));

                  if (!isMounted.current) return;

                  navigation.goBack();
                  // setLoading(false);
                })
                .catch(err => {
                  handleError(err, dispatch);
                })
                .finally(() => {
                  if (!isMounted.current) return;

                  setLoading(false);
                });
            }}
          >{t('Save')}</Button>
        </View>
      </View>
    </View>
  );
}
