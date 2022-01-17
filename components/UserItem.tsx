import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Image, TouchableWithoutFeedback, View } from 'react-native';
import { Colors, IconButton, Text } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { showIntroMessageModal, showIntroModal } from '../store/actions/modal';
import { getDefaultImage } from './DefaultImages';
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import OnlineBadge from './OnlineBadge';
import VerifiedBadge from './VerifiedBadge';
import { isVerified } from '../utils';

export default function UserItem({ user }: any) {
  const dispatch = useDispatch();
  const navigation: any = useNavigation();

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        if (!user.id) return;

        navigation.navigate('Profile', { userId: user.id });
      }}
    >
      <View
        style={{
          width: '50%',
          padding: 3
        }}
      >
        <View style={{
          width: '100%',
          overflow: 'hidden'
        }}>
          <Image
            style={{
              width: '100%',
              aspectRatio: 1,
              borderRadius: 3
            }}
            source={{ uri: user.profileImage ?? getDefaultImage(user.gender).uri }}
          // source={{ uri: 'https://static.remove.bg/remove-bg-web/54743c30904cc98f30bb79359718a5ffd69392cd/assets/start-1abfb4fe2980eabfbbaaa4365a0692539f7cd2725f324f904565a9a744f8e214.jpg' }}
          />
          <View style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            aspectRatio: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.33)',
            borderRadius: 3,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end'
          }}>
            <View style={{
              padding: 5
            }}>
              {user.name && user.age && (
                <View style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  flexWrap: 'nowrap',
                  // flexGrow: 3
                  // width: '100%'
                }}>
                  {/* <Text style={{
                    color: Colors.white,
                    fontSize: 16
                  }}>{user.name} {user.age && `, ${user.age}`}</Text> */}
                  <Text
                    numberOfLines={1}
                    style={{
                      color: Colors.white,
                      fontSize: 16,

                      // flexBasis: '70%'//'30%'
                      // flexGrow: 1

                      flexShrink: 1
                      // flex: 2
                    }}>{user.name}</Text>
                  <View style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    flexWrap: 'nowrap',
                    // flex: 1
                    flexShrink: 2
                  }}>
                    {user.age && (
                      <Text
                        style={{
                          color: Colors.white,
                          fontSize: 16,
                        }}
                      >, {user.age}</Text>
                    )}
                    {user.isOnline && (
                      <OnlineBadge style={{
                        marginLeft: 5,
                      }} />
                    )}
                    {isVerified(user.verification_status) && (
                      <VerifiedBadge style={{
                        marginLeft: 5,
                      }} />
                    )}
                  </View>
                </View>
              )}
            </View>
          </View>
          {user.canSendIntroMessage && (
            <IconButton
              icon="comment-text-outline"
              size={25}
              color={Colors.blue300}
              onPress={() => {
                dispatch(showIntroModal({
                  likeId: user?.like?.id,
                  userId: user.id,
                  name: user.name
                }));
              }}
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                backgroundColor: '#000',
                opacity: 0.7,
                borderRadius: 100,
                borderWidth: 1,
              }}
            />
          )}
          {!user.canSendIntroMessage && !!user.like?.message && (
            <Text
              numberOfLines={2}
              ellipsizeMode="tail"
              style={{
                position: 'absolute',
                top: 2,
                left: 2,
                backgroundColor: 'rgba(201, 150, 212, 0.5)',
                borderRadius: 10,
                padding: 10
              }}
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
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}
