import React from 'react';
import { TouchableWithoutFeedback, View } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { Colors, Text, TouchableRipple } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { showPersonalityInfoModal } from '../../../store/actions/modal';
import { PERSONALITY_INFO } from './PersonalityInfoData';

const styles = EStyleSheet.create({
  badgeContainer: {
    padding: '3rem',
    paddingLeft: '6rem',
    paddingRight: '6rem',
    borderRadius: '5rem',
  },
  badgeText: {
    color: Colors.white,
    fontWeight: 'bold'
  },
});

const shadowStyle = {
  shadowColor: Colors.black,
  shadowOffset: {
    width: 4,
    height: 0,
  },
  shadowOpacity: 1.0,
  shadowRadius: 4,
  elevation: 15,
};

function PBadge({ personality }: { personality: string, }) {
  return (
    <View style={[styles.badgeContainer, {
      backgroundColor: PERSONALITY_INFO[personality].color,
    }, shadowStyle]}><Text style={styles.badgeText}>{personality}</Text></View>
  );
}

export default function PersonalityBadge({ personality, style }: { personality: string, style?: any }) {
  const dispatch = useDispatch();

  return (
    <TouchableRipple
      onPress={() => {
        dispatch(showPersonalityInfoModal({ personality }));
      }}
      style={style ?? {}}
    >
      <PBadge personality={personality} />
    </TouchableRipple>
  );
}
