import React, { useContext, useEffect, useState } from "react";
import { Text, View } from "react-native";
import { Button, Colors, Divider, TextInput, TouchableRipple } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import BottomModal from "../BottomModal";
import { throwErrorIfErrorStatusCode } from "../../utils";
import { addProfileQuestions, deleteProfileQuestions } from "../../services/api";
import QuestionPickerDialog from "../QuestionPickerDialog";
import { setProfile } from "../../store/actions/profile";
import EditItem from "./EditItem";
import ItemHeading from "./ItemHeading";
import { getProfileSelector } from "../../store/selectors/profile";
import { getTokenSelector } from "../../store/selectors/auth";
import { useIsMounted } from "../../hooks/useIsMounted";
import { useTranslation } from "react-i18next";

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

  return (
    <>
      <View style={{
        marginTop: 10,
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 5
      }}>
        <ItemHeading
          style={{
            marginBottom: 15
          }}
        >{t('Profile questions')}</ItemHeading>

        {props.questionAnswers.map((answer: any) => (
          <React.Fragment key={answer.answerId}>
            <EditItem
              onPress={() => {
                setCurrentQuestion({
                  ...answer,
                  question: allProfileQuestions[answer.questionId]
                });
                setEditingProfileQuestion(true);
              }}
            >
              <View
                style={{
                  marginBottom: 5
                }}
              >
                <Text style={{ fontSize: 18, fontWeight: '700' }}>{allProfileQuestions[answer.questionId]}</Text>
                <Text style={{ fontSize: 15 }}>{answer.answer}</Text>
              </View>
            </EditItem>
            <Divider />
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
          <View style={{
            padding: 5,
            borderWidth: 1,
            borderRadius: 5,
            borderColor: Colors.black,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <MaterialCommunityIcons name="plus" size={30} />
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

      <BottomModal show={editingProfileQuestion} onHide={() => {
        if (savingQuestion || deletingQuestion) return;

        setEditingProfileQuestion(false);
      }}>
        {
          currentQuestion.answerId ? (
            <Text
              style={{
                padding: 5,
                fontWeight: 'bold',
                color: currentQuestion.question ? Colors.black : 'gray'
              }}
            >
              {currentQuestion.question}
            </Text>
          ) : (
            <TouchableRipple
              onPress={() => setPickingQuestion(true)}
            >
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  width: '100%'
                }}
              >
                <Text
                  style={{
                    padding: 5,
                    fontWeight: 'bold',
                    color: currentQuestion.question ? Colors.black : 'gray'
                  }}
                >
                  {currentQuestion.question ?? t('Not selected')}
                </Text>
                <MaterialCommunityIcons name="pencil-outline" size={20} />
              </View>
            </TouchableRipple>
          )
        }

        <TextInput
          mode='outlined'
          disabled={!currentQuestion.question}
          value={currentQuestion.answer}
          placeholder={t('Enter your answer...')}
          onChangeText={(answer) => setCurrentQuestion({ ...currentQuestion, answer })}
        />

        <View style={{
          display: 'flex',
          flexDirection: 'row-reverse',
          justifyContent: 'space-between',
          marginTop: 5
        }}>
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

                  setSavingQuestion(false);
                  setEditingProfileQuestion(false);
                });
            }}>{t('Save')}</Button>

          {currentQuestion.answerId && (
            <Button
              uppercase={false}
              disabled={savingQuestion || deletingQuestion}
              loading={deletingQuestion}
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

                    setDeletingQuestion(false);
                    setEditingProfileQuestion(false);
                  });
              }}>{t('Delete')}</Button>
          )}
        </View>
      </BottomModal>
    </>
  );
}
