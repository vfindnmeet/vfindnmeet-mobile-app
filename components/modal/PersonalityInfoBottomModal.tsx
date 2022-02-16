import React from 'react';
import { View } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { Text } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { getModalDataSelector } from '../../store/selectors/modal';
import { PERSONALITY_SHORT } from '../common/personality/PersonalityInfoData';
import ItemHeading from '../profileInfo/ItemHeading';

const styles = EStyleSheet.create({
  container: {
    padding: '5rem',
  },
  title: {
    fontSize: '25rem',
    fontWeight: 'bold',
    marginBottom: '15rem',
  },
  description: {
    fontSize: '20rem',
  },
});

export default function PersonalityInfoBottomModal({ onHide }: any) {
  const data = useSelector(getModalDataSelector);

  return (
    <View style={styles.container}>
      <ItemHeading style={styles.title} onHide={onHide}>{data.personality}</ItemHeading>
      {/* <Text style={{
        fontSize: 25,
        fontWeight: 'bold',
        marginBottom: 15,
      }}>{data.personality}</Text> */}
      <Text style={styles.description}>{PERSONALITY_SHORT[data.personality].description}</Text>

    </View>
  );
}
