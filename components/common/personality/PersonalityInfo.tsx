import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import { PERSONALITY_TYPES } from './PersonalityInfoData';
import PersonalityInfos from './PersonalityInfos';
import PersonalityPercentage from './PersonalityPercentage';

export default function PersonalityInfo({
  personality
}: {
  personality: {
    personality: string;
    calculation: { [key: string]: number };
  }
}) {
  return (
    <View>
      <Text style={{
        textAlign: 'center',
        marginBottom: 20
      }}>Your personality type is <Text style={{ fontWeight: 'bold' }}>{personality.personality}</Text> ({personality.personality.split('').map((i: string) => PERSONALITY_TYPES[i]).join(', ')})</Text>
      {personality.personality.split('').map((i, ix) => (
        <PersonalityPercentage
          key={i}
          ix={ix}
          type={i}
          percentage={personality.calculation[i]}
        />
      ))}

      <PersonalityInfos personality={personality} />
      {/* <PersonalityInfos personality={{
        personality: 'INTJ', //'ENTJ'
      }} /> */}
    </View>
  );
}
