import React from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, Text, TouchableWithoutFeedback, View } from 'react-native';
import { Button } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { getIntroMessageModalDataSelector } from '../../store/selectors/modal';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import GameType from '../chat/GameType';

function WouldYourRatherGameInfo() {
  const { t } = useTranslation();

  return (
    <View>
      <View style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <Text style={{
          fontSize: 25
        }}>{t('Would you rather ...?')}</Text>
      </View>
      <Text style={{
        padding: 10,
        textAlign: 'center',
        color: 'gray',
        fontSize: 15
      }}>{t('How does it work?')}</Text>

      <Text style={{
        padding: 5,
        textAlign: 'center',
        color: 'gray',
        fontSize: 15
      }}>{t('1) First user prompts the game and picks a question to ask')}</Text>
      <Text style={{
        padding: 5,
        textAlign: 'center',
        color: 'gray',
        fontSize: 15
      }}>{t('2) The other user selects one of the two options')}</Text>
    </View>
  );
}

function QuestionGameInfo() {
  const { t } = useTranslation();

  return (
    <View>
      <View style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <Text style={{
          fontSize: 25
        }}>{t('Answer questions ...')}</Text>
      </View>
      <Text style={{
        padding: 10,
        textAlign: 'center',
        color: 'gray',
        fontSize: 15
      }}>{t('How does it work?')}</Text>

      <Text style={{
        padding: 5,
        textAlign: 'center',
        color: 'gray',
        fontSize: 15
      }}>{t('1) First user prompts the game and picks a question to ask')}</Text>
      <Text style={{
        padding: 5,
        textAlign: 'center',
        color: 'gray',
        fontSize: 15
      }}>{t('2) The other user answers the question and picks a question to ask in return. The answer is not revealed to the first user')}</Text>
      <Text style={{
        padding: 5,
        textAlign: 'center',
        color: 'gray',
        fontSize: 15
      }}>{t('3) The first user answers the question')}</Text>
      <Text style={{
        padding: 5,
        textAlign: 'center',
        color: 'gray',
        fontSize: 15
      }}>{t('4) When both users have answered the questions - reveal the answers to them')}</Text>
    </View>
  );
}

export default function GameInfoDialog({ show, onHide }: any) {
  const { t } = useTranslation();

  const data = useSelector(getIntroMessageModalDataSelector);

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
      >
        <View style={{
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          position: 'relative',
          padding: 15
        }}>
          <TouchableWithoutFeedback>
            <View style={{
              backgroundColor: '#fff',
              padding: 10,
              borderRadius: 5
            }}>
              {data.gameType === GameType.WOULD_YOU_RATHER && <WouldYourRatherGameInfo />}
              {data.gameType === GameType.ANSWER_QUESTIONS && <QuestionGameInfo />}

              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  marginTop: 5
                }}
              >
                <Button
                  style={{ margin: 2 }}
                  mode="text"
                  uppercase={false}
                  onPress={onHide}
                >{t('Close')}</Button>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback >
    </Modal >
  );
};
