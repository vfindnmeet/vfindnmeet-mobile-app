import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, ScrollView, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { Button } from 'react-native-paper';

export default function QuestionPickerDialog({ show, onHide, onSelected, questions }: any) {
  // const [visible, setVisible] = useState(false);

  // useEffect(() => {
  //   setVisible(show);
  // }, [show]);

  const { t } = useTranslation();

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={show}
      onDismiss={() => {
        console.log('ON DISMISS');
      }}
    >
      <View style={{
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        // position: 'relative',
        padding: 10
      }}>
        <View style={{
          display: 'flex',
          flex: 1,
          flexDirection: 'column',
          backgroundColor: '#fff'
        }}>
          <ScrollView style={{
            flex: 1
          }}>
            {questions.map((question: any) => (
              <Text
                key={question.questionId}
                style={{
                  padding: 5,
                  marginBottom: 15,
                  fontSize: 18
                }}
                onPress={() => {
                  onSelected(question);
                  onHide();
                }}
              >{question.text}</Text>
            ))}
          </ScrollView>
          <View style={{
            padding: 5
          }}>
            <Button onPress={onHide}>{t('Cancel')}</Button>
          </View>
        </View>
      </View>
    </Modal>
  );
};
