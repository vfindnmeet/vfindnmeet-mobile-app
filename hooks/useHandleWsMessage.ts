import { useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getLoggedUserIdSelector } from '../store/selectors/auth';
import { WsContext } from '../store/WsContext';
import { getRouteSelector } from '../store/selectors/route';
import { incrNotSeenMessagesCount, seeChat } from '../store/actions/notification';
import useOnMessage from './useOnMessage';

export default function useHandleWsMessage() {
  const dispatch = useDispatch();

  const route: any = useSelector(getRouteSelector);
  const loggedUserId = useSelector(getLoggedUserIdSelector);

  const { sendMessage } = useContext(WsContext);

  useOnMessage((msg: any) => {
    !['ping', 'pong'].includes(msg.type) && console.log('===2', msg.type);

    if (msg.type === 'msg') {
      const isFromLoggedUser = msg.payload.userId === loggedUserId;
      if (isFromLoggedUser) return;

      // console.log('isFromLoggedUser', isFromLoggedUser);
      // console.log('isOnUserChatScreen', isOnUserChatScreen);

      const isOnUserChatScreen = route?.route === 'UserChat' && route?.params?.userId === msg.payload.userId;
      if (isOnUserChatScreen) {
        // see chat message
        sendMessage('see_msg');
      } else {
        // notification..
        dispatch(incrNotSeenMessagesCount());
      }
    } else if (msg.type === 'see_msg') {
      // console.log('====>NOT SEENS MSGS', msg.payload);
      // dispatch(setNotSeenMessagesCount(msg.payload.notSeenMessagesCount));
      dispatch(seeChat(msg.payload));
    }
  }, [route?.route, route?.params?.userId, loggedUserId]);
}
