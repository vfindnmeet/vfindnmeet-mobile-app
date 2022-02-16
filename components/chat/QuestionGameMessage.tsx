import React from 'react';
import { View } from "react-native";
import EStyleSheet from 'react-native-extended-stylesheet';
import { useSelector } from "react-redux";
import { getLoggedUserIdSelector } from "../../store/selectors/auth";
import GameType from './GameType';

import QuestionGameStage1 from './QuestionGame/QuestionGameStage1';
import QuestionGameStage2 from './QuestionGame/QuestionGameStage2';
import QuestionGameStage3 from './QuestionGame/QuestionGameStage3';

const styles = EStyleSheet.create({
  questionGameStage3: {
    width: '80%',
    marginTop: '20rem',
  },
});

export default function QuestionGameMessage({ message }: any) {
  // const dispatch = useDispatch();
  // const { t } = useTranslation();

  // const token = useSelector(getTokenSelector);
  const loggedUserId = useSelector(getLoggedUserIdSelector);

  // const shouldQuestionGameModal = useSelector(shouldQuestionGameModalSelector)
  const isLoggedUser = loggedUserId === message.userId;

  // console.log(JSON.stringify(message, null, 2));

  const questionGameStage3 = message?.game?.gameType == GameType.ANSWER_QUESTIONS && message?.game?.gameStage == 3;

  return (
    <View style={{
      // borderWidth: 1,
      // borderColor: 'red',

      // width: '80%',
      width: questionGameStage3 ? '100%' : undefined,
      flexDirection: isLoggedUser ? 'row-reverse' : 'row',
      justifyContent: questionGameStage3 ? 'center' : 'flex-start',
      maxWidth: questionGameStage3 ? '100%' : '80%',

      display: 'flex',
      // flexDirection: 'column',
      alignItems: isLoggedUser ? 'flex-end' : 'flex-start',
      // justifyContent: 'flex-start',
      // marginBottom: 20
    }}>
      {message?.game?.gameStage == 1 && (
        <QuestionGameStage1 message={message} />
      )}

      {message?.game?.gameStage == 2 && (
        <QuestionGameStage2 message={message} />
      )}

      {message?.game?.gameStage == 3 && (
        <View style={styles.questionGameStage3}>
          <QuestionGameStage3 message={message} />
        </View>
      )}
    </View>
  );
}
