import React, { useEffect, useState } from 'react';
import { Modal, TouchableWithoutFeedback, View } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { useDispatch, useSelector } from 'react-redux';
import { getQuestionGameModalDataSelector } from '../../store/selectors/modal';
import QuestionGame from '../common/games/QuestionGame';

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
});

export default function QuestionGamePickDialog({ show, onHide, onSave, loading }: any) {
  // const [loading, setLoading] = useState(false);
  const [game, setGame] = useState<number | null>(null);

  const data: any = useSelector(getQuestionGameModalDataSelector);

  useEffect(() => {
    if (show) {
      // setChecked(onlineOnly ?? false);
      setGame(null);
      // setLoading(false);
    }
  }, [show]);

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
        <View style={styles.styles}>
          <TouchableWithoutFeedback>
            <View style={styles.dialog}>
              <QuestionGame
                selectedQuestionId={data.questionId}
                onClose={onHide}
                onSave={onSave}
                loading={loading}
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};
