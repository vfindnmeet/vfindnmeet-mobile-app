import React from 'react';
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import EStyleSheet from 'react-native-extended-stylesheet';
import { Text } from "react-native-paper";
import WRQItem from "./WRQItem";

const styles = EStyleSheet.create({
  container: {
    // marginLeft: 15,

    marginTop: '10rem',
    // width: '100%',
    maxWidth: '100%',
    // width: 300,
    marginBottom: '15rem',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'nowrap',

    // borderWidth: 1,
    // borderColor: 'red',
  },
  orContainer: {
    paddingLeft: '10rem',
    paddingRight: '10rem',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',

    // borderWidth: 1,
    // borderColor: 'blue',
  },
  orText: {
    // fontSize: 23,
    fontWeight: 'bold',
    marginBottom: '5rem',
    color: '#fff',

    borderRadius: '10rem',
    padding: '5rem',
    // paddingLeft: 5,
    // paddingRight: 5,
    backgroundColor: '#000',
    flexShrink: 1
  }
});

export default function WouldYouRatherItem({ question, selected, onSelect, textStyle }: {
  question: {
    questionId: string,
    answers: [
      {
        answerId: string;
        text: string;
      },
      {
        answerId: string;
        text: string;
      }
    ]
  },
  selected?: string;
  onSelect?: (answerId: string | undefined) => void,
  textStyle?: any
}) {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <WRQItem
        answer={question.answers[0]}
        // text={q1}
        colors={['#ccc737', 'orange']}
        rotateDeg={'-5deg'}
        selected={selected}
        onSelect={onSelect}
        textStyle={textStyle}
      />

      <View style={styles.orContainer}>
        <Text style={styles.orText}>{t('or')}</Text>
      </View>

      <WRQItem
        answer={question.answers[1]}
        // text={q2}
        colors={['#53d8db', '#299396']}
        rotateDeg={'5deg'}
        selected={selected}
        onSelect={onSelect}
        textStyle={textStyle}
      />
    </View>
  );
}
