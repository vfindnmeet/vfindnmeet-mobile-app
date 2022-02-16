import React, { useEffect, useState } from 'react';
import { Image, Modal, Text, TouchableWithoutFeedback, View } from 'react-native';
import { Button, Colors } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { getMatchModalDataSelector } from '../../store/selectors/modal';
import { useNavigation } from '@react-navigation/native';
import { getDefaultImage } from '../DefaultImages';
import * as Font from 'expo-font';
import { useTranslation } from 'react-i18next';
import PageLoader from '../common/PageLoader';
import EStyleSheet from 'react-native-extended-stylesheet';

const styles = EStyleSheet.create({
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    position: 'relative',
    padding: '15rem'
  },
  title: {
    color: Colors.white,
    textAlign: 'center',
    fontSize: '50rem',
    fontFamily: 'astralsisters',
    marginBottom: '25rem'
  },
  image: {
    width: '50%',
    borderRadius: 400,
    aspectRatio: 1
  },
  secondImage: {
    marginLeft: '-40rem',
  },
  button: {
    marginTop: '15rem',
    borderColor: Colors.white
  }
});

export default function MatchedDialog({ show, onHide }: any) {
  const navigation: any = useNavigation();
  const { t } = useTranslation();

  const data = useSelector(getMatchModalDataSelector);
  const [loading, setLoading] = useState(true);

  const hide = () => {
    onHide();
  };

  useEffect(() => {
    (async () => {
      await Font.loadAsync({
        astralsisters: require('../../assets/fonts/Astral-Sisters.ttf')
      });

      setLoading(false);
    })();
  }, []);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={show}
      onDismiss={() => {
        console.log('ON DISMISS');
      }}
    >
      <TouchableWithoutFeedback
        style={{ flex: 1 }}
        onPress={() => {
          hide();
        }}
      >
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback>
            <View style={{
              padding: 10,
              borderRadius: 5
            }}>
              {loading && (
                <PageLoader fullScreen={false} />
              )}
              {!loading && data?.me && data?.user && (
                <View>
                  <Text
                    style={styles.title}>{t('It\'s a Match')}</Text>
                  <View style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center'
                  }}>
                    <Image
                      style={styles.image}
                      resizeMethod="resize"
                      resizeMode="contain"
                      source={{
                        uri: data.me.profileImage || getDefaultImage(data.me.gender).uri
                      }}
                    />
                    <Image
                      style={[styles.image, styles.secondImage]}
                      resizeMethod="resize"
                      resizeMode="contain"
                      source={{ uri: data.user.profileImage || getDefaultImage(data.user.gender).uri }}
                    />
                  </View>
                  <Button
                    uppercase={false}
                    mode="outlined"
                    color={Colors.white}
                    style={styles.button}
                    onPress={() => {
                      navigation.navigate('UserChat', { userId: data.user.id });
                    }}
                  >{t('Send a message')}</Button>
                  <Button
                    uppercase={false}
                    mode="outlined"
                    color={Colors.white}
                    style={styles.button}
                    onPress={() => {
                      onHide();
                    }}
                  >{t('Continue browsing')}</Button>
                </View>
              )}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback >
    </Modal >
  );
};
