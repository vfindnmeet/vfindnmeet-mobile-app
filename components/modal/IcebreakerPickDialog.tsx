import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, Text, TouchableWithoutFeedback, View } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { Button, Colors, IconButton } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { showGameInfoModal } from '../../store/actions/modal';
import GameType from '../chat/GameType';
import QuestionGame from '../common/games/QuestionGame';
import WouldYouRatherGame from '../common/games/WouldYouRatherGame';

/*
Show me... game

what you're doing
something people normally wouldn’t see
something that no one knows about you
your mad face
your goofy face
the last thing you ate



show_me_games:
id
user_from_id
user_to_id
user_from_image_id
user_to_image_id
chat_message_id



question_games:
id
user_from_id
user_to_id
question_from_id
answer_from
question_to_id
answer_to
chat_message_id

*/

const styles = EStyleSheet.create({
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    position: 'relative',
    padding: '15rem'
  },
  dialog: {
    // backgroundColor: '#fff',
    padding: '10rem',
    borderRadius: '5rem'
  },
  title: {
    fontSize: '23rem',
    fontWeight: 'bold',
    marginBottom: '5rem',
    textAlign: 'center',
    color: Colors.white
  },
  itemText: {
    padding: '10rem',
    fontSize: '18rem',
    color: Colors.white
  },
  buttonsContainer: {
    // display: 'flex',
    // flexDirection: 'row',
    // justifyContent: 'flex-end',
    marginTop: '5rem'
  },
});

export default function IcebreakerPickDialog({ show, onHide, onGameSelected }: any) {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [game, setGame] = useState<number | null>(null);

  const { t } = useTranslation();

  useEffect(() => {
    if (show) {
      // setChecked(onlineOnly ?? false);
      setGame(null);
      setLoading(false);
    }
  }, [show]);

  const hide = () => {
    if (loading) return;

    setGame(null);
    onHide();
  };

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
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback>
            <View style={styles.dialog}>
              <View>
                {!game && (
                  <>
                    <Text style={styles.title}>{t('Pick an icebreaker game to play')}</Text>
                    <View style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      justifyContent: 'flex-start'
                    }}>
                      <View style={{
                        display: 'flex',
                        flexDirection: 'row',
                        width: '100%',
                        justifyContent: 'space-between'
                      }}>
                        <Text
                          style={styles.itemText}
                          onPress={() => {
                            if (!onGameSelected) return;

                            setGame(1);
                          }}
                        >{t('Would you rather ...?')}</Text>
                        <IconButton
                          icon="information-outline"
                          color={Colors.white}
                          onPress={() => {
                            dispatch(showGameInfoModal({ gameType: GameType.WOULD_YOU_RATHER }));
                          }}
                        />
                      </View>
                      <View style={{
                        display: 'flex',
                        flexDirection: 'row',
                        width: '100%',
                        justifyContent: 'space-between'
                      }}>
                        <Text
                          style={styles.itemText}
                          onPress={() => {
                            if (!onGameSelected) return;

                            setGame(2);
                          }}
                        >{t('Answer questions ...')}</Text>
                        <IconButton
                          icon="information-outline"
                          color={Colors.white}
                          onPress={() => {
                            dispatch(showGameInfoModal({ gameType: GameType.ANSWER_QUESTIONS }));
                          }}
                        />
                      </View>
                    </View>

                    <View
                      style={styles.buttonsContainer}
                    >
                      <Button
                        style={{ margin: 2 }}
                        mode="text"
                        disabled={loading}
                        uppercase={false}
                        // color={Colors.white}
                        onPress={hide}
                      >{t('Close')}</Button>

                    </View>
                  </>
                )}
                {game === 1 && (
                  <WouldYouRatherGame
                    onClose={onHide}
                  />
                )}
                {game === 2 && (
                  <QuestionGame
                    onClose={onHide}
                  />
                )}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};
