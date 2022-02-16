import React, { useMemo } from 'react';
import { Text, View } from "react-native";
import EStyleSheet from 'react-native-extended-stylesheet';
import { getDefaultImage } from '../../DefaultImages';
import ImageColumnItem from './ImageColumnItem';
import ItemTitle from './ItemTitle';
import QuestionCont from './QuestionCont';

const styles = EStyleSheet.create({
  container: {
    padding: '5rem',
    borderRadius: '5rem',
  },
  titleContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    // borderWidth: 1,
    // borderColor: 'red',
  },
  titleText: {
    fontSize: '16rem',
    // borderWidth: 1,
    // borderColor: 'red',
  },
  itemContainer: {
    marginLeft: '30rem',
    marginTop: '2rem',
    marginBottom: '5rem'
  },
  itemText: {
    padding: '5rem',
  },
});

export default function QuestionGameStage3({ message }: any) {
  const messageUserProfileImage = useMemo(() => {
    return message?.mupi ?? getDefaultImage(message?.mug).uri;
  }, []);

  const otherUserProfileImage = useMemo(() => {
    return message?.oupi ?? getDefaultImage(message?.oug).uri;
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <ItemTitle
          textStyle={styles.titleText}
          text="Answer questions ... Completed"
        />
        {/* <Text style={{ padding: 5, fontSize: 16 }}>Completed</Text> */}
      </View>

      <ImageColumnItem uri={messageUserProfileImage}>
        <QuestionCont>
          {message?.game?.gameInfo?.questions[message?.game?.gameData?.fromQuestionId]}
        </QuestionCont>
      </ImageColumnItem>

      <View style={styles.itemContainer}>
        <ImageColumnItem uri={otherUserProfileImage}>
          <Text style={styles.itemText}>{message?.game?.gameData?.answerTo}</Text>
        </ImageColumnItem>
      </View>

      <ImageColumnItem uri={otherUserProfileImage}>
        <QuestionCont>
          {message?.game?.gameInfo?.questions[message?.game?.gameData?.toQuestionId]}
        </QuestionCont>
      </ImageColumnItem>

      <View style={styles.itemContainer}>
        <ImageColumnItem uri={messageUserProfileImage}>
          <Text style={styles.itemText}>{message?.game?.gameData?.answerFrom}</Text>
        </ImageColumnItem>
      </View>
    </View>
  );
}
