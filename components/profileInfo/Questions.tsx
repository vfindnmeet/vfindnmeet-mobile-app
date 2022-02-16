import React, { useCallback, useContext, useEffect, useState } from "react";
import { Text, View } from "react-native";
import { Button, Colors, Divider, IconButton, TextInput, TouchableRipple } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import BottomModal from "../BottomModal";
import { handleError, throwErrorIfErrorStatusCode } from "../../utils";
import { addProfileQuestions, deleteProfileQuestions } from "../../services/api";
import QuestionPickerDialog from "../QuestionPickerDialog";
import { setProfile } from "../../store/actions/profile";
import EditItem from "./EditItem";
import ItemHeading from "./ItemHeading";
import { getProfileSelector } from "../../store/selectors/profile";
import { getTokenSelector } from "../../store/selectors/auth";
import { useIsMounted } from "../../hooks/useIsMounted";
import { useTranslation } from "react-i18next";
import { BIG2_ICON_SIZE, MEDIUM_ICON_SIZE } from "../../constants";
import EStyleSheet from "react-native-extended-stylesheet";

const styles = EStyleSheet.create({
  container: {
    marginTop: '10rem',
    padding: '10rem',
    backgroundColor: '#fff',
    borderRadius: '5rem'
  },
  questionText: {
    fontSize: '18rem',
    fontWeight: '700'
  },
  answerText: {
    fontSize: '15rem'
  },
  questionItem: {
    marginBottom: '5rem'
  },
  divider: {
    marginTop: '10rem',
    marginBottom: '10rem',
  },
  addContainer: {
    marginTop: '10rem',
    padding: '5rem',
    borderWidth: 1,
    borderRadius: '5rem',
    borderColor: Colors.black,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  addText: {
    marginLeft: '5rem',
    fontWeight: 'bold',
  },
  modalButtonsContainer: {
    display: 'flex',
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    marginTop: '5rem'
  },
  selectQuestionText: {
    padding: '5rem',
    fontWeight: 'bold',
  }
});

export default function Questions(props: { questionAnswers: any[] }) {
  const isMounted = useIsMounted();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const token = useSelector(getTokenSelector);
  const profile: any = useSelector(getProfileSelector);
  const allProfileQuestions: any = useSelector(({ common }: any) => common.profileQuestions);

  const [editingProfileQuestion, setEditingProfileQuestion] = useState(false);
  const [pickingQuestion, setPickingQuestion] = useState(false);
  const [savingQuestion, setSavingQuestion] = useState(false);
  const [deletingQuestion, setDeletingQuestion] = useState(false);

  const [currentQuestion, setCurrentQuestion] = useState<{
    questionId?: string,
    question?: string,
    answerId?: string,
    answer?: string
  }>({});

  const onHide = useCallback(() => {
    if (savingQuestion || deletingQuestion) return;

    setEditingProfileQuestion(false);
  }, [savingQuestion, deletingQuestion]);

  return (
    <>
      <View style={styles.container}>
        <ItemHeading>{t('Profile questions')}</ItemHeading>

        {props.questionAnswers.map((answer: any, ix: number) => (
          <React.Fragment key={answer.answerId}>
            <EditItem
              style={{
                marginTop: undefined
              }}
              onPress={() => {
                setCurrentQuestion({
                  ...answer,
                  question: allProfileQuestions[answer.questionId]
                });
                setEditingProfileQuestion(true);
              }}
            >
              <View style={styles.questionItem}>
                <Text style={styles.questionText}>{allProfileQuestions[answer.questionId]}</Text>
                <Text style={styles.answerText}>{answer.answer}</Text>
              </View>
            </EditItem>
            {(ix !== props.questionAnswers.length - 1) && (
              <Divider style={styles.divider} />
            )}
          </React.Fragment>
        ))}

        <TouchableRipple
          onPress={() => {
            setCurrentQuestion({
              answer: ''
            });
            setEditingProfileQuestion(true);
          }}
        >
          <View style={styles.addContainer}>
            <MaterialCommunityIcons name="plus-circle" size={BIG2_ICON_SIZE} />
            <Text style={styles.addText}>{t('Add')}</Text>
          </View>
        </TouchableRipple>
      </View>

      <QuestionPickerDialog
        show={pickingQuestion}
        onHide={() => setPickingQuestion(false)}
        onSelected={(question: any) => {
          setCurrentQuestion({
            ...currentQuestion,
            questionId: question.questionId,
            question: question.text,
            answer: currentQuestion.questionId !== question.questionId ? '' : currentQuestion.answer
          })
        }}
        questions={Object.keys(allProfileQuestions)
          .filter((questionId: string) => !props.questionAnswers.find((answer: any) => answer.questionId == questionId))
          .map((questionId: string) => ({
            questionId,
            text: allProfileQuestions[questionId],
          }))}
      />

      <BottomModal style={{ padding: 0 }} show={editingProfileQuestion} onHide={onHide}>
        {currentQuestion.answerId ? (
          <ItemHeading style={{ padding: 5, }} size={14} onHide={onHide}>{currentQuestion.question}</ItemHeading>
        ) : (
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%'
            }}
          >
            <TouchableRipple
              onPress={() => setPickingQuestion(true)}
              style={{
                flex: 1,
                // width: '100%'
              }}
            >
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  // justifyContent: 'spa',
                  alignItems: 'center',
                  // flex: 1,
                  // width: '100%'
                }}
              >
                <MaterialCommunityIcons name="pencil-outline" size={MEDIUM_ICON_SIZE} />
                <Text
                  style={[styles.selectQuestionText, {
                    color: currentQuestion.question ? Colors.black : 'gray'
                  }]}
                >
                  {currentQuestion.question ?? t('Select question')}
                </Text>
              </View>
            </TouchableRipple>
            <IconButton
              icon="close"
              style={{
                backgroundColor: Colors.grey300,
                // marginTop: -15,
                // marginRight: 0,
              }}
              // disabled={disabled}
              onPress={onHide}
            />
          </View>
        )}

        <TextInput
          mode='flat'
          disabled={!currentQuestion.question}
          value={currentQuestion.answer}
          placeholder={t('Enter your answer...')}
          onChangeText={(answer) => setCurrentQuestion({ ...currentQuestion, answer })}
        />

        <View style={styles.modalButtonsContainer}>
          <Button
            uppercase={false}
            disabled={savingQuestion || deletingQuestion}
            loading={savingQuestion}
            onPress={() => {
              if (savingQuestion || deletingQuestion) {
                return;
              }
              if (
                !currentQuestion.questionId ||
                currentQuestion.answer?.constructor !== String ||
                currentQuestion.answer.trim() === ''
              ) {
                return;
              }

              setSavingQuestion(true);

              addProfileQuestions({
                answerId: currentQuestion.answerId,
                questionId: currentQuestion.questionId,
                answer: currentQuestion.answer
              }, token as string)
                .then(throwErrorIfErrorStatusCode)
                .then(result => result.json())
                .then(result => {
                  let questionAnswers;
                  const isNew = !currentQuestion.answerId;
                  if (isNew) {
                    questionAnswers = [...props.questionAnswers, result];
                  } else {
                    questionAnswers = props.questionAnswers.map((answerItem: any) => {
                      if (currentQuestion.answerId === answerItem.answerId) {
                        return {
                          ...answerItem,
                          answer: currentQuestion.answer
                        };
                      }

                      return answerItem;
                    });
                  }

                  dispatch(setProfile({
                    ...profile,
                    questionAnswers
                  }));

                  if (!isMounted.current) return;

                  // setSavingQuestion(false);
                  setEditingProfileQuestion(false);
                })
                .catch(err => {
                  handleError(err, dispatch);
                })
                .finally(() => {
                  if (!isMounted.current) return;

                  setSavingQuestion(false);
                });
            }}>{t('Save')}</Button>

          {currentQuestion.answerId && (
            <Button
              uppercase={false}
              disabled={savingQuestion || deletingQuestion}
              loading={deletingQuestion}
              icon="delete"
              onPress={() => {
                if (savingQuestion || deletingQuestion) {
                  return;
                }
                const isNew = !currentQuestion.answerId;
                if (isNew) {
                  return;
                }

                setDeletingQuestion(true);

                deleteProfileQuestions(currentQuestion.answerId as string, token as string)
                  .then(throwErrorIfErrorStatusCode)
                  .then(() => {
                    const questionAnswers = props.questionAnswers.filter(({ answerId }: any) => answerId !== currentQuestion.answerId);

                    dispatch(setProfile({
                      ...profile,
                      questionAnswers
                    }));

                    if (!isMounted.current) return;

                    // setDeletingQuestion(false);
                    setEditingProfileQuestion(false);
                  })
                  .catch(err => {
                    handleError(err, dispatch);
                  })
                  .finally(() => {
                    if (!isMounted.current) return;

                    setDeletingQuestion(false);
                  });
              }}>{t('Delete')}</Button>
          )}
        </View>
      </BottomModal>
    </>
  );
}
