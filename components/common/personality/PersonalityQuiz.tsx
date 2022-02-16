import { t } from 'i18next';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TouchableWithoutFeedback, View } from "react-native";
import { ActivityIndicator, Button, Colors, HelperText, IconButton, Text } from "react-native-paper";
import { useDispatch, useSelector } from 'react-redux';
import { BIG2_ICON_SIZE, LOADER_SIZE } from '../../../constants';
import UnauthorizedError from '../../../errors/UnauthorizedError';
import { useIsMounted } from '../../../hooks/useIsMounted';
import { calculatePersonality, getPersonalityQuestions } from '../../../services/api';
import { logOutUser } from '../../../store/actions/auth';
import { getTokenSelector } from '../../../store/selectors/auth';
import { getErrorMessage, handleError, retryHttpRequest, throwErrorIfErrorStatusCode } from '../../../utils';
import PageLoader from '../PageLoader';

enum Category {
  MIND = 1,
  ENERGY = 2,
  NATURE = 3,
  TACTICS = 4,
}

enum Answer {
  VERY_STRONGLY_DISAGREE = -3,
  STRONGLY_DISAGREE = -2,
  DISAGREE = -1,
  NEUTRAL = 0,
  AGREE = 1,
  STRONGLY_AGREE = 2,
  VERY_STRONGLY_AGREE = 3,
}

// const Personalities = {
//   [Category.MIND]: ['E', 'I'],
//   [Category.ENERGY]: ['S', 'N'],
//   [Category.NATURE]: ['T', 'F'],
//   [Category.TACTICS]: ['J', 'P'],
// };

// const modifiedAnswer = (questionId: string, answer: number) => {
//   return answer;
// };

// const calculatePersonality = (
//   questions: { id: string; text: string; category?: number }[],
//   answers: { [key: string]: number },
// ) => {
//   const personalities: string[] = [];

//   for (const category of [
//     Category.MIND,
//     Category.ENERGY,
//     Category.NATURE,
//     Category.TACTICS,
//   ]) {
//     const result = questions.filter(question => question.category == category)
//       .map(question => modifiedAnswer(question.id, answers[question.id]))
//       .reduce((pre, cur) => (pre ?? 0) + cur);

//     const calculatedPersonality = Personalities[category][result < 0 ? 0 : 1];
//     personalities.push(calculatedPersonality);
//   }

//   return personalities.join('');
// };

const shuffle = (array: any[]) => {
  let currentIndex = array.length, randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

function AnswerButton({
  selected,
  children,
  onSelect,
  color
}: {
  children: any;
  selected?: boolean;
  onSelect?: () => void;
  color?: string
}) {
  return (
    <TouchableWithoutFeedback
      onPress={onSelect}
    >
      <Text style={{
        textAlign: 'center',
        padding: 10,
        borderRadius: 10,
        backgroundColor: selected ? color : Colors.grey200,
        color: selected ? Colors.white : color,
        marginBottom: 5
      }}>{children}</Text>
    </TouchableWithoutFeedback>
    // <Button
    //   color={color}
    //   mode={selected ? 'contained' : 'text'}
    //   uppercase={false}
    //   onPress={onSelect}
    //   style={{
    //     elevation: 0,
    //   }}
    // >{children}</Button>
  );
}

function CCheckbox({ value, setValue, size }: any) {
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        // console.log('-----');
        setValue(!value);
      }}
      style={{
        marginLeft: 5,
        marginRight: 5
      }}
    >
      <View style={{
        width: size ?? 25,
        height: size ?? 25,
        borderWidth: 2,
        borderColor: Colors.black,
        borderRadius: 100,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
        // backgroundColor: value ? Colors.black : undefined
      }}>
        <View style={{
          width: (size ?? 25) - 7,
          height: (size ?? 25) - 7,
          // borderWidth: 2,
          // borderColor: Colors.black,
          borderRadius: 100,
          backgroundColor: value ? Colors.black : undefined
        }}></View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const DISAGREE_COLOR = Colors.red300;
const NEUTRAL_COLOR = Colors.blueGrey300;
const AGREE_COLOR = Colors.green300;

function PersonalityQuestion({
  question,
  selected,
  onSelect
}: {
  question: string;
  selected: number;
  onSelect: (selected: number) => void;
}) {
  const { t } = useTranslation();

  const [value, setValue] = useState(false);

  return (
    <View>
      <Text style={{
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 15
        // fontWeight: 'bold'
      }}>{t(question)}</Text>

      <AnswerButton
        color={AGREE_COLOR}
        selected={selected === Answer.VERY_STRONGLY_AGREE}
        onSelect={() => onSelect(Answer.VERY_STRONGLY_AGREE)}
      >{t('Very strongly agree')}</AnswerButton>
      <AnswerButton
        color={AGREE_COLOR}
        selected={selected === Answer.STRONGLY_AGREE}
        onSelect={() => onSelect(Answer.STRONGLY_AGREE)}
      >{t('Strongly agree')}</AnswerButton>
      <AnswerButton
        color={AGREE_COLOR}
        selected={selected === Answer.AGREE}
        onSelect={() => onSelect(Answer.AGREE)}
      >{t('Agree')}</AnswerButton>
      <AnswerButton
        color={NEUTRAL_COLOR}
        selected={selected === Answer.NEUTRAL}
        onSelect={() => onSelect(Answer.NEUTRAL)}
      >{t('Neutral')}</AnswerButton>
      <AnswerButton
        color={DISAGREE_COLOR}
        selected={selected === Answer.DISAGREE}
        onSelect={() => onSelect(Answer.DISAGREE)}
      >{t('Disagree')}</AnswerButton>
      <AnswerButton
        color={DISAGREE_COLOR}
        selected={selected === Answer.STRONGLY_DISAGREE}
        onSelect={() => onSelect(Answer.STRONGLY_DISAGREE)}
      >{t('Strongly disagree')}</AnswerButton>
      <AnswerButton
        color={DISAGREE_COLOR}
        selected={selected === Answer.VERY_STRONGLY_DISAGREE}
        onSelect={() => onSelect(Answer.VERY_STRONGLY_DISAGREE)}
      >{t('Very strongly disagree')}</AnswerButton>
    </View>
  );
}

export default function PersonalityQuiz({
  setCalculating,
  setPersonality
}: {
  setCalculating?: (c: boolean) => void;
  setPersonality: (personality: any) => void;
}) {
  const isMounted = useIsMounted();
  const dispatch = useDispatch();

  const token = useSelector(getTokenSelector);

  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [questions, setQuestions] = useState<{ id: number; text: string; category: number; }[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  // const [complete, setComplete] = useState(false);
  const [maxIndex, setMaxIndex] = useState(0);

  const [error, setError] = useState('');

  useEffect(() => {
    retryHttpRequest(() => {
      if (!isMounted.current) return null;

      return getPersonalityQuestions();
    })
      .then((result: any) => result.json())
      .then(result => {
        if (!isMounted.current) return;

        // const r: any[] = [];
        // for (let i = 0; i < 10; i++) {
        //   r.push(result[i]);
        // }
        // setQuestions(r);
        setQuestions(shuffle(result));
        // setLoading(false);
        setSaving(false);
        setCalculating && setCalculating(false);
      })
      .catch(err => {
        handleError(err, dispatch);
      })
      .finally(() => {
        if (!isMounted.current) return;

        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <PageLoader fullScreen={false} />
    );
  }

  if (saving) {
    return (
      <View style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <Text style={{
          fontSize: 18,
          marginBottom: 25
        }}>{t('Calculating personality...')}</Text>
        <ActivityIndicator size={LOADER_SIZE} />
      </View>
    );
  }

  if (index >= questions.length) {
    return (
      <View style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 15,
      }}>
        {/* <Text>{index + 1}/{questions.length}</Text> */}

        {!!error && (<HelperText type="error">{t(error)}</HelperText>)}

        <Button
          style={{
            width: '100%',
            padding: 5,
            marginBottom: 10
          }}
          mode='contained'
          onPress={() => {
            setIndex(questions.length - 1);
          }}
        >Review answers</Button>

        <Button
          style={{
            padding: 5,
            width: '100%'
          }}
          mode='contained'
          onPress={() => {
            setSaving(true);

            // setTimeout(() => {
            //   setPersonality({
            //     personality: 'ESTP',
            //     calculation: {
            //       E: 13,
            //       'S': 14,
            //       T: 15,
            //       P: 16,
            //     }
            //   });
            //   setSaving(false);
            // }, 2000);

            calculatePersonality(answers, token)
              .then(throwErrorIfErrorStatusCode)
              .then(result => result.json())
              .then(result => {
                console.log('result');
                console.log(JSON.stringify(result, null, 2));

                if (!isMounted.current) return;

                setPersonality(result);
                // setPersonality({ personality: result });
              })
              .catch(err => {
                if (err instanceof UnauthorizedError) {
                  dispatch(logOutUser());

                  return;
                }

                setError(getErrorMessage(err.message));
              })
              .finally(() => {
                if (!isMounted.current) return;

                setSaving(false);
                // setCalculating(false);
              });
          }}
        >Submit</Button>
      </View>
    );
  }

  return (
    <>
      <View style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <IconButton
          size={BIG2_ICON_SIZE}
          icon="chevron-left"
          disabled={index <= 0}
          onPress={() => {
            if (index === 0) return;

            setIndex(index - 1);
          }}
        />
        <Text style={{
          fontSize: 18,
          fontWeight: 'bold'
        }}>{index + 1}/{questions.length}</Text>
        <IconButton
          size={BIG2_ICON_SIZE}
          icon="chevron-right"
          // disabled={!complete || index >= questions.length - 1}
          disabled={index >= maxIndex || index >= questions.length}
          onPress={() => {
            // if (index === 0) return;

            setIndex(index + 1);
          }}
        />
        {/* {index > 0 && (
          <Button
            onPress={() => {
              if (index === 0) return;

              setIndex(index - 1);
            }}
          >Back</Button>
        )} */}
      </View>
      <PersonalityQuestion
        question={questions[index]?.text}
        selected={answers[questions[index]?.id]}
        onSelect={(seleted: number) => {
          setAnswers({
            ...answers,
            [questions[index]?.id]: seleted
          });

          setIndex(index + 1);
          setMaxIndex(index + 1);
        }}
      />
    </>
  );
}
