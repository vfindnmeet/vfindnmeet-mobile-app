import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, Text, TouchableWithoutFeedback, View } from "react-native";
import { ActivityIndicator, Colors } from 'react-native-paper';
import { useSelector } from "react-redux";
import { getLoggedUserIdSelector } from "../../store/selectors/auth";

export default function ChatMessage({ chat }: any) {
  const navigation: any = useNavigation();
  const { t } = useTranslation();
  const loggedUserId = useSelector(getLoggedUserIdSelector);

  const [size, setSize] = useState<any>(null);

  const isLoggedUser = loggedUserId === chat.userId;
  const hasImage = !!chat.image;

  const [loadingImage, setLoadingImage] = useState(false);

  useEffect(() => {
    if (!hasImage) return;

    Image.getSize(chat.image.uri_big, (width, height) => {
      setSize({ width, height });
    });
  }, []);

  // console.log('SIZE:', size);
  size && console.log(size.height / size.width, (size.height / size.width).toFixed(2));

  const aspectRatio: number = size ? +(size.width / size.height).toFixed(2) : 1

  return (
    <>
      <View
        style={{
          display: 'flex',
          flexDirection: isLoggedUser ? 'row-reverse' : 'row',
          // flexDirection: 'column',
          marginBottom: !chat.notDelivered ? 5 : undefined
        }}
      >
        <View style={{
          display: 'flex',
          flexWrap: 'wrap',
          flexDirection: isLoggedUser ? 'row-reverse' : 'row',
          maxWidth: '80%',
          position: 'relative'
        }}>
          <View style={{
            padding: 7,
            borderRadius: 5,
            backgroundColor: isLoggedUser ? '#a8edc6' : '#eda8a8',
            width: hasImage ? '100%' : undefined
          }}>
            <View>
              {loadingImage && (
                <View style={{
                  width: '100%',
                  padding: 15,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  <ActivityIndicator size={40} />
                </View>
              )}
              {!!chat.image && (
                <TouchableWithoutFeedback
                  onPress={() => {
                    navigation.navigate('GalleryDialog', {
                      images: [chat.image]
                    });
                  }}
                >
                  <Image
                    style={{
                      width: '100%',
                      aspectRatio
                    }}
                    resizeMethod="resize"
                    resizeMode="contain"
                    source={{ uri: chat.image.uri_big }}
                    onLoadStart={() => setLoadingImage(true)}
                    onLoadEnd={() => setLoadingImage(false)}
                  />
                </TouchableWithoutFeedback>
              )}
              {!!chat.text && <Text>{chat.text}</Text>}
            </View>
          </View>
        </View>
      </View>
      {chat.notDelivered && (
        <View style={{
          marginBottom: 5
        }}>
          <Text style={{
            textAlign: 'right',
            color: Colors.red400,
            fontWeight: 'bold',
            // padding: 5
          }}>{t('Not delivered')}</Text>
        </View>
      )}
    </>
  );
}
