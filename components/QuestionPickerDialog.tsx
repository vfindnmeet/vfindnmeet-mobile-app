import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, ScrollView, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { Button } from 'react-native-paper';

const styles = EStyleSheet.create({
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    padding: '10rem'
  },
  questionText: {
    padding: '5rem',
    marginBottom: '15rem',
    fontSize: '18rem'
  },
  buttonsContainer: {
    padding: '5rem'
  }
});

export default function QuestionPickerDialog({ show, onHide, onSelected, questions }: any) {
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
      <View style={styles.backdrop}>
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
                style={styles.questionText}
                onPress={() => {
                  onSelected(question);
                  onHide();
                }}
              >{question.text}</Text>
            ))}
          </ScrollView>
          <View style={styles.buttonsContainer}>
            <Button onPress={onHide}>{t('Close')}</Button>
          </View>
        </View>
      </View>
    </Modal>
  );
};
