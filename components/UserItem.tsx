import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Image, TouchableWithoutFeedback, View } from 'react-native';
import { Colors, IconButton, Text } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { showIntroMessageModal, showIntroModal } from '../store/actions/modal';
import { getDefaultImage } from './DefaultImages';
import OnlineBadge from './OnlineBadge';
import VerifiedBadge from './VerifiedBadge';
import { isVerified } from '../utils';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import PersonalityBadge from './common/personality/PersonalityBadge';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { ICON_SIZE } from '../constants';
import EStyleSheet from 'react-native-extended-stylesheet';

const styles = EStyleSheet.create({
  titleText: {
    fontSize: '15.5rem',
  },
  introText: {
    fontSize: '14rem',
    top: '2rem',
    right: '2rem',
    borderRadius: '10rem',
    padding: '10rem',
  },
  personalityBadge: {
    position: 'absolute',
    top: '5rem',
    left: '5rem',
  },
  distanceCont: {
    marginLeft: '5rem',
    marginBottom: '5rem'
  },
  container: {
    width: '50%',
    padding: '3rem',
    position: 'relative'
  },
  contRadius: {
    borderRadius: '3rem'
  },
  nameCont: {
    paddingLeft: '5rem'
  },
  marginLeft: {
    marginLeft: '5rem'
  },
  innerContainer: {
    width: '100%',
    position: 'relative'
  },
  imageContainer: {
    width: '100%',
    overflow: 'hidden'
  },
  image: {
    width: '100%',
    aspectRatio: 1,
  },
  gradientContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  infoContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    aspectRatio: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.33)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end'
  },
  infoInnerContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexWrap: 'nowrap',
  },
  nameText: {
    color: Colors.white,
    flexShrink: 1
  },
  ageContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'nowrap',
    // flex: 1
    flexShrink: 2
  },
  ageText: {
    color: Colors.white,
    // fontSize: 16,
  },
  intoMessage: {
    position: 'absolute',
    // top: 2,
    // right: 2,
    // borderRadius: 10,
    // padding: 10,
    backgroundColor: 'rgba(255, 122, 112, 0.6)', //'rgba(220, 110, 160, 0.6)',
    color: Colors.white
  },
  intoButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#000',
    opacity: 0.7,
    borderRadius: 100,
    borderWidth: 1,
  },
});

export default function UserItem({ user }: any) {
  const dispatch = useDispatch();
  const navigation: any = useNavigation();
  const { t } = useTranslation();

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        if (!user.id) return;

        navigation.navigate('Profile', { userId: user.id });
      }}
    >
      <View style={styles.container}>
        <View style={styles.innerContainer}>
          <View style={styles.imageContainer}>
            <Image
              style={[styles.contRadius, styles.image]}
              source={{ uri: user.profileImage ?? getDefaultImage(user.gender).uri }}
            />
          </View>
          <LinearGradient
            // Background Linear Gradient
            colors={['transparent', 'rgba(0,0,0,0.2)']}
            style={[styles.contRadius, styles.gradientContainer]}
          >
            <View style={[styles.contRadius, styles.infoContainer]}>
              <View style={styles.nameCont}>
                {user.status === 'active' && user.name && user.age && (
                  <View style={styles.infoInnerContainer}>
                    <Text
                      numberOfLines={1}
                      style={[styles.titleText, styles.nameText]}
                    >{user.name}</Text>
                    <View style={styles.ageContainer}>
                      {user.age && (
                        <Text style={[styles.titleText, styles.ageText]}>, {user.age}</Text>
                      )}
                      {user.isOnline && (
                        <OnlineBadge style={styles.marginLeft} />
                      )}
                      {isVerified(user.verification_status) && (
                        <VerifiedBadge style={styles.marginLeft} />
                      )}
                    </View>
                  </View>
                )}
                {user.status !== 'active' && (
                  <View style={styles.infoInnerContainer}>
                    <Text
                      numberOfLines={1}
                      style={[styles.titleText, styles.nameText]}
                    >{t(user.name ?? 'Deleted user')}</Text>
                  </View>
                )}
              </View>

              {!!user.distanceInKm && (
                <View style={styles.distanceCont}>
                  <Text style={{ color: Colors.white }}>
                    <MaterialCommunityIcons name="map-marker" /> {user.distanceInKm} {t('km away')}
                  </Text>
                </View>
              )}
            </View>

            {!user.canSendIntroMessage && !!user.like?.message && (
              <Text
                numberOfLines={2}
                ellipsizeMode="tail"
                style={[styles.introText, styles.intoMessage]}
                onPress={() => {
                  dispatch(showIntroMessageModal({
                    userId: user.id,
                    name: user.name,
                    fromUserId: user.like.fromUserId,
                    message: user.like.message
                  }));
                }}
              >{user.like.message}</Text>
            )}

            {user.canSendIntroMessage && (
              <IconButton
                icon="comment-text-outline"
                size={ICON_SIZE}
                color={Colors.blue300}
                onPress={() => {
                  dispatch(showIntroModal({
                    likeId: user?.like?.id,
                    userId: user.id,
                    name: user.name
                  }));
                }}
                style={styles.intoButton}
              />
            )}
          </LinearGradient>

          {user.personality && (
            <PersonalityBadge
              personality={user.personality}
              style={styles.personalityBadge}
            />
          )}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}
