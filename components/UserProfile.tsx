import React, { useEffect, useState } from 'react';
import { Dimensions, FlatList, Image, ScrollView, Text, TouchableWithoutFeedback, View } from 'react-native';
import { ActivityIndicator, Button, Chip, Colors, Divider } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { getInterests, getProfileQuestions, getUserProfile } from '../services/api';
import { setAllInterests, setAllProfileQuestions } from '../store/actions/common';
import { clearUser, fetchUser, setUser } from '../store/actions/user';
import { getLoggedUserIdSelector, getTokenSelector } from '../store/selectors/auth';
import { getUserLoadingSelector, getUserSelector } from '../store/selectors/user';
import { isVerified, retryHttpRequest, throwErrorIfErrorStatusCode } from '../utils';
import EditItem from './profileInfo/EditItem';
import ItemHeading from './profileInfo/ItemHeading';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { useIsMounted } from '../hooks/useIsMounted';
import UnmatchButton from './profile-actions/UnmatchButton';
import MessageButton from './profile-actions/MessageButton';
import Actions from './profile-actions/Actions';
import { getDefaultImage } from './DefaultImages';
import DefaultImage from './DefaultImage';
import OnlineBadge from './OnlineBadge';
import VerifiedBadge from './VerifiedBadge';
import { useTranslation } from 'react-i18next';

const { width, height } = Dimensions.get('window');

const getBody = (value: string) => {
  switch (value) {
    case 'fit': return 'Fit';
    case 'average': return 'Average';
    case 'curvy': return 'Curvy';
    case 'skinny': return 'Skinny';
    default: return null;
  }
};

const getDrinking = (value: string) => {
  switch (value) {
    case 'regularly': return 'Regularly';
    case 'sometimes': return 'Socially';
    case 'never': return 'I don\'t drink';
    default: return null;
  }
};

const getSmoking = (value: string) => {
  switch (value) {
    case 'regularly': return 'Regularly';
    case 'sometimes': return 'Sometimes';
    case 'never': return 'I don\'t smoke';
    default: return null;
  }
};

const getChildren = (value: string) => {
  switch (value) {
    case 'has': return 'Has children';
    case 'does_not_have': return 'Doesn\'t have children';
    case 'does_not_have_and_does_not_want': return 'Doesn\'t have children and doesn\'t want';
    case 'does_not_have_but_wants': return 'Doesn\'t have children but might want them';
    default: return null;
  }
};

const getPet = (value: string) => {
  switch (value) {
    case 'cat': return 'Has cat(s)';
    case 'dog': return 'Has dog(s)';
    case 'other': return 'Has other pet(s)';
    case 'none': return 'Doesn\'t have pets';
    default: return null;
  }
};

const getEmployment = (value: string) => {
  switch (value) {
    case 'full_time': return 'Full-time';
    case 'part_time': return 'Part-time';
    case 'freelance': return 'Freelancer';
    case 'self_employed': return 'Self-employed';
    case 'retired': return 'Retired';
    case 'unemployed': return 'Unemployed';
    default: return null;
  }
};

const getEducation = (value: string) => {
  switch (value) {
    case 'entry': return '';
    case 'mid': return 'Highschool';
    case 'higher': return 'University degree';
    case 'none': return 'I don\'t have';
    default: return null;
  }
};

const getPersonality = (value: string) => {
  switch (value) {
    case 'introvert': return 'Introvert';
    case 'extrovert': return 'Extrovert';
    case 'mixed': return 'Somewhere in the middle';
    default: return null;
  }
};

const getIncome = (value: string) => {
  switch (value) {
    case 'high': return 'High income';
    case 'middle': return 'Average income';
    case 'low': return 'Low income';
    case 'none': return 'No income';
    default: return null;
  }
};

export default function UserProfile({ userId, showActions, distanceInKm, setLoadingUser }: {
  userId: string;
  showActions: boolean;
  distanceInKm?: number;
  setLoadingUser?: (loading: boolean) => void;
}) {
  const dispatch = useDispatch();
  const isMounted = useIsMounted();
  const navigation: any = useNavigation();
  const { t } = useTranslation();

  const user: any = useSelector(getUserSelector);
  const loading: boolean = useSelector(getUserLoadingSelector);
  const token = useSelector(getTokenSelector);
  const loggedUserId = useSelector(getLoggedUserIdSelector);

  const allInterests: any = useSelector(({ common }: any) => common.interests);
  const allProfileQuestions: any = useSelector(({ common }: any) => common.profileQuestions);

  useEffect(() => {
    setLoadingUser && setLoadingUser(loading);
  }, [loading]);

  useEffect(() => {
    if (allInterests) {
      return;
    }

    retryHttpRequest(getInterests.bind(null, token as string))
      // .then(throwErrorIfErrorStatusCode)
      .then((result: any) => result.json())
      .then(interests => {
        dispatch(setAllInterests(interests));
      })
  }, []);

  useEffect(() => {
    if (allProfileQuestions) {
      return;
    }

    retryHttpRequest(getProfileQuestions.bind(null, token as string))
      // .then(throwErrorIfErrorStatusCode)
      .then((result: any) => result.json())
      .then(allProfileQuestions => {
        dispatch(setAllProfileQuestions(allProfileQuestions));
      })
  }, []);

  useEffect(() => {
    dispatch(fetchUser());

    retryHttpRequest(getUserProfile.bind(null, userId, token))
      // .then(throwErrorIfErrorStatusCode)
      .then((result: any) => result.json())
      .then(result => {
        if (!isMounted.current) return;

        dispatch(setUser(result));
        // setTimeout(() => {
        // }, 1500);
      });

    return () => {
      dispatch(clearUser());
    };
  }, [userId]);

  if (loading || !allInterests || !allProfileQuestions) {
    return (
      <View style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <ActivityIndicator size={70} />
      </View>
    );
  }

  const openGallery = (selectedIndex: number) => navigation.navigate('GalleryDialog', {
    images: user.images,
    selectedIndex
  });

  const info = [
    { icon: 'human-male-height', label: user.info.height },
    { icon: 'dumbbell', label: getBody(user.info.body) },
    { icon: 'smoking', label: getSmoking(user.info.smoking) },
    { icon: 'glass-cocktail', label: getDrinking(user.info.drinking) },
    { icon: 'baby-carriage', label: getChildren(user.info.children) },
    { icon: 'dog-service', label: getPet(user.info.pet) },
    { icon: 'briefcase', label: getEmployment(user.info.employment) },
    { icon: 'school', label: getEducation(user.info.education) },
    { icon: 'account', label: getPersonality(user.info.personality) },
    { icon: 'cash-multiple', label: getIncome(user.info.income) },
  ].filter(({ label }) => !!label);

  return (
    <>
      <ScrollView style={{
        flex: 1,
        backgroundColor: '#fff',
      }}>
        {user.images.length > 0 && (
          <ScrollView
            style={{ flex: 1 }}
            horizontal={true}
            snapToInterval={width}
          >
            {user.images.map((image: any, ix: number) => (
              <TouchableWithoutFeedback
                key={image.imageId}
                style={{ width }}
                onPress={() => {
                  openGallery(ix);
                }}
              >
                <Image
                  style={{ width, aspectRatio: 1 }}
                  // resizeMode="contain"
                  source={{ uri: image.uri_big }}
                />
              </TouchableWithoutFeedback>
            ))}
          </ScrollView>
        )}

        {user.images.length <= 0 && (<DefaultImage gender={user.gender} />)}

        <View
          style={{
            padding: 10
          }}
        >
          <View style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center'
          }}>
            <Text style={{ fontWeight: 'bold', fontSize: 30, }}>{user.name}</Text>
            <Text style={{ fontSize: 30, marginLeft: 5 }}>{user.age}</Text>
            {user.isOnline && <OnlineBadge style={{ marginLeft: 5 }} />}
            {isVerified(user.verification_status) && <VerifiedBadge style={{ marginLeft: 5 }} />}
          </View>
          {!!distanceInKm && (<Text>{distanceInKm} {t('km away')}</Text>)}
          {user.title && <Text>{user.title}</Text>}

          {user.description && (
            <View style={{
              marginTop: 10
            }}>
              <ProfileItemHeading>{t('About')}</ProfileItemHeading>

              <Text>{user.description}</Text>
            </View>
          )}

          {info.length > 0 && (
            <View style={{
              marginTop: 10
            }}>
              <ProfileItemHeading>{t('Info')}</ProfileItemHeading>

              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  flexWrap: 'wrap'
                }}
              >
                {info.map(({ icon, label }) => (
                  <View
                    key={icon}
                    style={{
                      margin: 3,
                      padding: 5,
                      paddingLeft: 10,
                      paddingRight: 10,
                      backgroundColor: '#d9d9d9',
                      borderRadius: 15,

                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'flex-start',
                      alignItems: 'center'
                    }}
                  >
                    <MaterialCommunityIcons name={icon} size={26} />
                    <Text style={{ marginLeft: 5 }}>{t(label)}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {user.selectedInterests.length > 0 && (
            <View style={{
              marginTop: 10
            }}>
              <ProfileItemHeading>{t('Interests')}</ProfileItemHeading>
              <View style={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap'
              }}>
                {allInterests
                  .filter(({ id }: any) => (user?.selectedInterests ?? []).includes(id))
                  .map((interest: any) => (
                    <View
                      key={interest.id}
                      style={{
                        margin: 3,
                        padding: 5,
                        paddingLeft: 15,
                        paddingRight: 15,
                        backgroundColor: interest.selected ? 'pink' : '#d9d9d9',
                        borderRadius: 15,
                      }}
                    >
                      <Text>{t(interest.name)}</Text>
                    </View>
                  ))}
              </View>
            </View>
          )}

          {user.questionAnswers.length > 0 && (
            <View style={{
              marginTop: 10
            }}>
              <ProfileItemHeading>{t('Questions')}</ProfileItemHeading>
              {user.questionAnswers.map((answer: any) => (
                <React.Fragment key={answer.answerId}>
                  <View
                    style={{
                      marginBottom: 5
                    }}
                  >
                    <Text style={{ fontSize: 18, fontWeight: '700' }}>{allProfileQuestions[answer.questionId]}</Text>
                    <Text style={{ fontSize: 15 }}>{answer.answer}</Text>
                  </View>
                  <Divider />
                </React.Fragment>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {showActions && <Actions user={user} />}
    </>
  );
}

function ProfileItemHeading({ children }: any) {
  return (
    <ItemHeading size={23} color={'gray'} marginBottom={5}>{children}</ItemHeading>
  );
}
