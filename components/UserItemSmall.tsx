import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useMemo } from 'react';
import { Dimensions, Image, TouchableWithoutFeedback, View } from 'react-native';
import { Colors, Text } from 'react-native-paper';
import { getDefaultImage } from './DefaultImages';
import OnlineBadge from './OnlineBadge';
import VerifiedBadge from './VerifiedBadge';
import { isVerified } from '../utils';
import { useTranslation } from 'react-i18next';
import EStyleSheet from 'react-native-extended-stylesheet';

const styles = EStyleSheet.create({
  titleText: {
    fontSize: '15.5rem',
  },
  distanceCont: {
    marginLeft: '5rem',
    marginBottom: '5rem'
  },
  container: {
    padding: '3rem',
    position: 'relative'
  },
  contRadius: {
    borderRadius: '3rem'
  },
  image: {
    width: '100%',
    aspectRatio: 1,
  },
  innerContainer: {
    width: '100%',
    position: 'relative'
  },
  imageContainer: {
    width: '100%',
    overflow: 'hidden',
    borderRadius: 500
  },
  infoContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  nameContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexWrap: 'nowrap',
    width: '100%',
  },
  nameText: {
    color: Colors.black,
    // fontSize: 14,
    flexShrink: 1,
  },
  ageContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'nowrap',
    flexShrink: 2
  },
  ageText: {
    color: Colors.black,
    // fontSize: 14,
  },
});

const { width } = Dimensions.get('window');

const w = width / 3;

const container = {
  width: w ?? '33%',
};

export default function UserItemSmall({ user }: any) {
  const navigation: any = useNavigation();
  const { t } = useTranslation();

  const onItemPress = useCallback(() => {
    if (!user.id) return;

    navigation.navigate('Profile', { userId: user.id });
  }, [user]);

  const imageSource = useMemo(() => {
    return { uri: user.profileImage ?? getDefaultImage(user.gender).uri }
  }, [user]);

  return (
    <TouchableWithoutFeedback
      onPress={onItemPress}
    >
      <View
        style={[styles.container, container]}
      >
        <View
          style={styles.innerContainer}
        >
          <View style={styles.imageContainer}>
            <Image
              style={[styles.contRadius, styles.image]}
              source={imageSource}
            />
          </View>
          <View style={styles.infoContainer}>
            <View>
              {user.name && user.age && (
                <View style={styles.nameContainer}>
                  <Text
                    numberOfLines={1}
                    style={[styles.titleText, styles.nameText]}>{user.name}</Text>
                  <View style={styles.ageContainer}>
                    {user.age && (
                      <Text
                        style={[styles.titleText, styles.ageText]}
                      >, {user.age}</Text>
                    )}
                    {isVerified(user.verification_status) && (
                      <VerifiedBadge />
                    )}
                    {user.isOnline && (
                      <OnlineBadge />
                    )}
                  </View>
                </View>
              )}
            </View>

            {!!user.distanceInKm && (
              <View style={styles.distanceCont}>
                <Text style={{ color: Colors.black }}>{user.distanceInKm} {t('km away')}</Text>
              </View>
            )}
          </View>
          {/* </LinearGradient> */}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}
