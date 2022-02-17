import React, { useState } from 'react';
import { Dimensions, Image, ScrollView, Text, TouchableWithoutFeedback, View } from 'react-native';
import { Button, Colors, Divider } from 'react-native-paper';
import { isVerified } from '../utils';
import ItemHeading from './profileInfo/ItemHeading';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import Actions from './profile-actions/Actions';
import DefaultImage from './DefaultImage';
import OnlineBadge from './OnlineBadge';
import VerifiedBadge from './VerifiedBadge';
import { useTranslation } from 'react-i18next';
import PersonalityBadge from './common/personality/PersonalityBadge';
import { ICON_SIZE, MAIN_COLOR } from '../constants';
import EStyleSheet from 'react-native-extended-stylesheet';
import { LinearGradient } from 'expo-linear-gradient';

const styles = EStyleSheet.create({
  heading: {
    marginBottom: '5rem',
  },
  personalityBadge: {
    position: 'absolute',
    top: '5rem',
    left: '5rem',
  },
  userInfoContainer: {
    padding: '10rem',
    borderBottomLeftRadius: '5rem',
    borderBottomRightRadius: '5rem',
    backgroundColor: Colors.white,
  },
  descriptionContainer: {
    marginTop: '10rem'
  },
  nameText: {
    fontWeight: 'bold',
    fontSize: '30rem'
  },
  ageText: {
    fontSize: '30rem',
    marginLeft: '5rem'
  },
  questionText: {
    fontSize: '18rem',
    fontWeight: '700'
  },
  answerText: {
    fontSize: '15rem'
  },
  infoItemContainer: {
    margin: '3rem',
    padding: '5rem',
    paddingLeft: '10rem',
    paddingRight: '10rem',
    borderRadius: '15rem',

    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  infoItemIcon: {
    backgroundColor: Colors.grey300,
    borderRadius: 100,
    padding: '5rem',
    marginRight: '5rem',
  },
  sectionContainer: {
    marginTop: '10rem',
    padding: '5rem',
    borderRadius: '5rem',
    backgroundColor: Colors.white,
  },
  imageSectionContainer: {
    marginTop: '10rem',
  },
  answerDivider: {
    marginTop: '10rem',
    marginBottom: '10rem',
  },
  questionContainer: {
    marginBottom: '5rem'
  },
  interestItem: {
    margin: '3rem',
    padding: '5rem',
    paddingLeft: '15rem',
    paddingRight: '15rem',
    borderRadius: '15rem',
  },
  marginLeft: {
    marginLeft: '5rem',
  },
  container: {
    flex: 1,
  },
  userInfoTextContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  userTitleContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  userTitleText: {
    marginLeft: '5rem',
  },
  infoItemCont: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  infoItemText: {
    fontWeight: 'bold',
  },
  interestsContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  // distanceInKm: {
  //   marginTop: '5rem'
  // },
  gradientContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  gradientCont: {
    position: 'absolute',
    bottom: '35rem',
    left: '10rem',
  }
});

const { width } = Dimensions.get('screen');
export const IMAGE_SIZE = width / 2;

const getHeight = (height: number) => height ? `${height} cm` : null;

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

function Img({ ix, images }: any) {
  if (!images[ix]) return null;

  return (
    <View style={styles.imageSectionContainer}>
      <TouchableWithoutFeedback
        key={images[ix].imageId}
        style={{
          // width
          // paddingTop: 15,
          width: '100%',
          // aspectRatio: 1
          // width: galleryWidth
        }}
        onPress={() => {
          // openGallery(ix);
        }}
      >
        <Image
          style={{
            // width,

            width: '100%',
            aspectRatio: 1
            // width: galleryWidth,
            // height: galleryH
          }}
          source={{ uri: images[ix].uri_big }}
        />
      </TouchableWithoutFeedback>
    </View>
  );
}

function CImage({ user, distanceInKm, onPress, children }: any) {
  const { t } = useTranslation();

  return (
    <TouchableWithoutFeedback
      onPress={onPress}
    >
      <View>
        {children}

        <LinearGradient
          colors={['transparent', 'transparent', 'transparent', 'rgba(0, 0, 0, 0.5)']}
          style={[styles.contRadius, styles.gradientContainer]}
        >
          <View style={styles.gradientCont}>
            <View style={styles.userInfoTextContainer}>
              <Text style={[styles.nameText, { color: Colors.white }]}>{user.name}</Text>
              <Text style={[styles.ageText, { color: Colors.white }]}>{user.age}</Text>
              {user.isOnline && <OnlineBadge style={styles.marginLeft} />}
              {isVerified(user.verification_status) && <VerifiedBadge style={styles.marginLeft} />}
            </View>
            {!!distanceInKm && (
              <Text style={[styles.distanceInKm, { color: Colors.white }]}><MaterialCommunityIcons name="map-marker-outline" /> {distanceInKm} {t('km away')}</Text>
            )}
          </View>
        </LinearGradient>
      </View>
    </TouchableWithoutFeedback>
  );
}

export default function UserProfile({
  // userId,
  user,
  allInterests,
  allProfileQuestions,
  showActions,
  distanceInKm,
  // setLoadingUser
}: {
  user: any,
  allInterests: any[],
  allProfileQuestions: any[],
  // userId: string;
  showActions: boolean;
  distanceInKm?: number;
  // setLoadingUser?: (loading: boolean) => void;
}) {
  const navigation: any = useNavigation();
  const { t } = useTranslation();

  const openGallery = (selectedIndex: number) => navigation.navigate('GalleryDialog', {
    images: user.images,
    selectedIndex
  });
  const [galleryWidth, setGalleryWidth] = useState<number | undefined>();
  const [galleryH, setGalleryH] = useState<number | undefined>();

  const info = [
    { icon: 'human-male-height', title: 'Height', label: getHeight(user.info.height) },
    { icon: 'dumbbell', title: 'Body', label: getBody(user.info.body) },
    { icon: 'smoking', title: 'Smoking', label: getSmoking(user.info.smoking) },
    { icon: 'glass-cocktail', title: 'Drinking', label: getDrinking(user.info.drinking) },
    { icon: 'baby-carriage', title: 'Children', label: getChildren(user.info.children) },
    { icon: 'dog-service', title: 'Pets', label: getPet(user.info.pet) },
    { icon: 'briefcase', title: 'Work', label: getEmployment(user.info.employment) },
    { icon: 'school', title: 'Education', label: getEducation(user.info.education) },
    { icon: 'account', title: 'Personality', label: getPersonality(user.info.personality) },
    { icon: 'cash-multiple', title: 'Income', label: getIncome(user.info.income) },
  ].filter(({ label }) => !!label);

  return (
    <>
      <ScrollView style={styles.container}
        onLayout={(e) => {
          const { height } = e.nativeEvent.layout;
          console.log('height', height);
          setGalleryH(height);
        }}
      >
        {/* {user.images.length > 0 && (
          <ScrollView
            style={styles.container}
            horizontal={true}
            // snapToInterval={width}
            snapToInterval={galleryWidth}
            onLayout={(e) => {
              const { width } = e.nativeEvent.layout;
              // console.log('width', width);
              setGalleryWidth(width);
            }}
          >
            {user.images.map((image: any, ix: number) => (
              <TouchableWithoutFeedback
                key={image.imageId}
                style={{
                  // width
                  width: galleryWidth
                }}
                onPress={() => {
                  openGallery(ix);
                }}
              >
                <Image
                  style={{
                    // width,
                    // aspectRatio: 1,
                    width: galleryWidth,
                    height: galleryH
                  }}
                  source={{ uri: image.uri_big }}
                />
              </TouchableWithoutFeedback>
            ))}
          </ScrollView>
        )} */}
        {user.images.length > 0 && (
          <View>
            <ScrollView
              style={styles.container}
              horizontal={true}
              // snapToInterval={width}
              snapToInterval={galleryWidth}
              onLayout={(e) => {
                const { width } = e.nativeEvent.layout;
                // console.log('width', width);
                setGalleryWidth(width);
              }}
            >
              {user.images.map((image: any, ix: number) => (
                <CImage
                  key={image.imageId}
                  user={user}
                  distanceInKm={distanceInKm}
                  onPress={() => {
                    openGallery(ix);
                  }}
                >
                  <Image
                    style={{
                      // width,
                      // aspectRatio: 1,
                      width: galleryWidth,
                      height: galleryH
                    }}
                    source={{ uri: image.uri_big }}
                  />
                </CImage>
                // <TouchableWithoutFeedback
                //   key={image.imageId}
                //   style={{
                //     // width
                //     width: galleryWidth
                //   }}
                //   onPress={() => {
                //     console.log('-------')
                //     openGallery(ix);
                //   }}
                // >
                //   <View>
                //     <Image
                //       style={{
                //         // width,
                //         // aspectRatio: 1,
                //         width: galleryWidth,
                //         height: galleryH
                //       }}
                //       source={{ uri: image.uri_big }}
                //     />

                //     <LinearGradient
                //       colors={['transparent', 'transparent', 'transparent', 'rgba(0, 0, 0, 0.5)']}
                //       style={[styles.contRadius, styles.gradientContainer]}
                //     >
                //       <View style={styles.gradientCont}>
                //         <View style={styles.userInfoTextContainer}>
                //           <Text style={[styles.nameText, { color: Colors.white }]}>{user.name}</Text>
                //           <Text style={[styles.ageText, { color: Colors.white }]}>{user.age}</Text>
                //           {user.isOnline && <OnlineBadge style={styles.marginLeft} />}
                //           {isVerified(user.verification_status) && <VerifiedBadge style={styles.marginLeft} />}
                //         </View>
                //         {!!distanceInKm && (
                //           <Text style={[styles.distanceInKm, { color: Colors.white }]}><MaterialCommunityIcons name="map-marker-outline" /> {distanceInKm} {t('km away')}</Text>
                //         )}
                //       </View>
                //     </LinearGradient>
                //   </View>
                // </TouchableWithoutFeedback>
              ))}
            </ScrollView>

            {/* <LinearGradient
              colors={['transparent', 'transparent', 'transparent', 'rgba(0, 0, 0, 0.4)']}
              style={[styles.contRadius, styles.gradientContainer]}
            >
              <View style={{
                position: 'absolute',
                bottom: 35,
                left: 10,
              }}>
                <View style={styles.userInfoTextContainer}>
                  <Text style={[styles.nameText, { color: Colors.white }]}>{user.name}</Text>
                  <Text style={[styles.ageText, { color: Colors.white }]}>{user.age}</Text>
                  {user.isOnline && <OnlineBadge style={styles.marginLeft} />}
                  {isVerified(user.verification_status) && <VerifiedBadge style={styles.marginLeft} />}
                </View>
                {!!distanceInKm && (
                  <Text style={[styles.distanceInKm, { color: Colors.white }]}><MaterialCommunityIcons name="map-marker-outline" /> {distanceInKm} {t('km away')}</Text>
                )}
              </View>
            </LinearGradient> */}
          </View>
        )}
        {user.personality && (
          <PersonalityBadge
            personality={user.personality}
            style={styles.personalityBadge}
          />
        )}

        {/* {user.images.length <= 0 && (<DefaultImage gender={user.gender} />)} */}
        {user.images.length <= 0 && (
          <CImage user={user} distanceInKm={distanceInKm}>
            <DefaultImage gender={user.gender} />
          </CImage>
        )}

        <View>
          {user.work && user.education && user.description && (
            <View style={styles.userInfoContainer}>
              {/* <View style={styles.userInfoTextContainer}>
              <Text style={styles.nameText}>{user.name}</Text>
              <Text style={styles.ageText}>{user.age}</Text>
              {user.isOnline && <OnlineBadge style={styles.marginLeft} />}
              {isVerified(user.verification_status) && <VerifiedBadge style={styles.marginLeft} />}
            </View> */}
              {user.work && (
                <View style={styles.userTitleContainer}>
                  <MaterialCommunityIcons name="briefcase" />
                  <Text style={[styles.userTitleText, styles.marginLeft]}>{user.work}</Text>
                </View>
              )}
              {user.education && (
                <View style={styles.userTitleContainer}>
                  <MaterialCommunityIcons name="school" />
                  <Text style={[styles.userTitleText, styles.marginLeft]}>{user.education}</Text>
                </View>
              )}

              {/* {!!distanceInKm && (
              <Text style={styles.distanceInKm}><MaterialCommunityIcons name="map-marker-outline" /> {distanceInKm} {t('km away')}</Text>
            )} */}

              {user.description && (
                <View style={styles.descriptionContainer}>
                  <ProfileItemHeading>{t('About')}</ProfileItemHeading>

                  <Text>{user.description}</Text>
                </View>
              )}
            </View>
          )}

          {info.length > 0 && (
            <View style={styles.sectionContainer}>
              <ProfileItemHeading>{t('Info')}</ProfileItemHeading>

              <ScrollView
                horizontal={true}
              >
                {info.map(({ icon, label, title }: any) => (
                  <View
                    key={icon}
                    style={styles.infoItemContainer}
                  >
                    <MaterialCommunityIcons
                      name={icon}
                      size={ICON_SIZE}
                      style={styles.infoItemIcon}
                    />
                    <View style={styles.infoItemCont}>
                      <Text style={styles.infoItemText}>{t(title)}</Text>
                      <Text>{t(label)}</Text>
                    </View>
                  </View>
                ))}
              </ScrollView>
            </View>
          )}

          {/* <Img images={user.images} ix={1} /> */}

          {user.selectedInterests.length > 0 && (
            <View style={styles.sectionContainer}>
              <ProfileItemHeading>{t('Interests')}</ProfileItemHeading>
              <View style={styles.interestsContainer}>
                {allInterests
                  .filter(({ id }: any) => (user?.selectedInterests ?? []).includes(id))
                  .map((interest: any) => (
                    <View
                      key={interest.id}
                      style={[styles.interestItem, {
                        backgroundColor: interest.selected ? MAIN_COLOR : '#d9d9d9',
                      }]}
                    >
                      <Text>{t(interest.name)}</Text>
                    </View>
                  ))}
              </View>
            </View>
          )}

          {/* <Img images={user.images} ix={1} /> */}

          {user.questionAnswers.length > 0 && (
            <View style={styles.sectionContainer}>
              <ProfileItemHeading>{t('Questions')}</ProfileItemHeading>
              {user.questionAnswers.map((answer: any, ix: number) => (
                <React.Fragment key={answer.answerId}>
                  <View
                    style={styles.questionContainer}
                  >
                    <Text style={styles.questionText}>{allProfileQuestions[answer.questionId]}</Text>
                    <Text style={styles.answerText}>{answer.answer}</Text>
                  </View>
                  {(ix !== user.questionAnswers.length - 1) && (
                    <Divider style={styles.answerDivider} />
                  )}
                </React.Fragment>
              ))}
            </View>
          )}
        </View>

        <View style={{
          marginTop: 10,
          marginBottom: 35,
        }}>
          <Button
            uppercase={false}
            mode={'contained'}
            style={{
              borderRadius: 20,
            }}
            labelStyle={{
              color: Colors.white
            }}
          >Report user</Button>
        </View>
      </ScrollView>

      {showActions && <Actions user={user} />}
    </>
  );
}

function ProfileItemHeading({ children }: any) {
  return (
    <ItemHeading
      size={ICON_SIZE}
      color={'gray'}
      // marginBottom={5}
      style={styles.heading}
    // style={{
    //   fontWeight: undefined,
    //   color: MAIN_COLOR,
    // }}
    >{children}</ItemHeading>
  );
}
