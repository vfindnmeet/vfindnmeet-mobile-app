import React, { Fragment, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, Text, View } from 'react-native';
import { Button, Divider } from 'react-native-paper';
import { useDispatch, useSelector } from "react-redux";
import { useIsMounted } from '../../hooks/useIsMounted';
import { getOlderMessages } from '../../services/api';
import { fetchOlderMessages, setOlderMessages } from '../../store/actions/chat';
import { getLoggedUserIdSelector, getTokenSelector } from '../../store/selectors/auth';
import { getChatMessagesSelector, getChatUserSelector } from "../../store/selectors/chat";
import { retryHttpRequest, throwErrorIfErrorStatusCode } from '../../utils';
import ChatMessage from './ChatMessage';

export default function ChatMessages() {
  const dispatch = useDispatch();
  const isMounted = useIsMounted();
  const { t } = useTranslation();

  const user = useSelector(getChatUserSelector);
  const messages = useSelector(getChatMessagesSelector);
  const token = useSelector(getTokenSelector);

  // console.log('CHAT USER:', user);

  const [scrolledAtBottom, setScrolledAtBottom] = useState(true);
  const [hasOlderMessages, setHasOlderMessages] = useState(!!messages && messages.length > 0);

  const scrollView = useRef<any>();

  useEffect(() => {
    if (scrolledAtBottom) {
      scrollView.current.scrollToEnd();
    }
  }, [messages]);

  useEffect(() => {
    if (isNaN(messages?.length)) return;

    if (messages.length < 40) {
      setHasOlderMessages(false);
    }
  }, [messages?.length]);


  // console.log('scrolledAtBottom:', scrolledAtBottom);

  const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }: any) => {
    const paddingToBottom = 20;

    return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
  };

  return (
    <ScrollView
      ref={scrollView}
      style={{ flex: 1, padding: 5 }}
      onScroll={({ nativeEvent }) => {
        setScrolledAtBottom(isCloseToBottom(nativeEvent));
      }}
    >
      {hasOlderMessages && (
        <View style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center'
        }}>
          <Button
            uppercase={false}
            mode="text"
            onPress={() => {
              if (!hasOlderMessages) return;

              dispatch(fetchOlderMessages());

              // getOlderMessages(user.id, token)
              retryHttpRequest(getOlderMessages.bind(null, user.id, token))
                // .then(throwErrorIfErrorStatusCode)
                .then((result: any) => result.json())
                .then((result: any) => {
                  dispatch(setOlderMessages(result.messages));

                  if (isMounted.current && result.messages.length < 40) {
                    setHasOlderMessages(false);
                  }
                });
            }}
          >{t('Load older')}</Button>
        </View>
      )}
      {messages.length === 0 && (
        <Text style={{ textAlign: 'center' }}>{t('No chat history found.')}</Text>
      )}
      <Messages messages={messages} />
      {/* {messages.map((message: any) => (
        <Fragment>

          <ChatMessage key={message.id} chat={message} />
        </Fragment>
      ))} */}
    </ScrollView>
  );
}

const tsToDate = (ts: number) => {
  const date = new Date(+ts);
  const now = new Date();
  const isDiffYear = now.getFullYear() !== date.getFullYear();

  const f = (n: number) => n < 10 ? `0${n}` : n;

  return `${f(date.getDate())}/${f(date.getMonth() + 1)}` + (isDiffYear ? `/${date.getFullYear()}` : '');
};

const tsToHourAndMin = (ts: number) => {
  const date = new Date(+ts);

  const f = (n: number) => n < 10 ? `0${n}` : n;

  return `${f(date.getHours())}:${f(date.getMinutes())}`;
};

function Messages({ messages }: any) {
  const loggedUserId = useSelector(getLoggedUserIdSelector);

  let preDate: string | null = null;

  return (
    <>
      {messages.map((message: any) => {
        const cDate = tsToDate(message.createdAt);

        const diffDate = preDate !== cDate;
        preDate = cDate;

        return (
          <Fragment key={message.id}>
            {diffDate && (
              <View style={{
                marginBottom: 10
              }}>
                <Text>{cDate}</Text>
                <Divider />
              </View>
            )}
            <ChatMessage key={message.id} chat={message} />
          </Fragment>
        );
      })}
      {messages.length > 0 && (
        <View
          style={{
            display: 'flex',
            flexDirection: loggedUserId === messages[messages.length - 1].userId ? 'row-reverse' : 'row',
            marginBottom: 5
          }}
        >
          <Text style={{
            fontSize: 13,
            color: 'gray'
          }}>{tsToHourAndMin(messages[messages.length - 1].createdAt)}</Text>
        </View>
      )}
    </>
  );
}
