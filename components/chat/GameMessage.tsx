import React from 'react';
import GameType from './GameType';
import QuestionGameMessage from './QuestionGameMessage';
import WouldYouRatherMessage from './WouldYouRatherMessage';

export default function GameMessage({ message }: any) {
  return (
    <>
      {message.game?.gameType == GameType.WOULD_YOU_RATHER && (
        <WouldYouRatherMessage message={message} />
      )}
      {message.game?.gameType == GameType.ANSWER_QUESTIONS && (
        <QuestionGameMessage message={message} />
      )}
    </>
  );
}
