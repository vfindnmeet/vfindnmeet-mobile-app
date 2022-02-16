import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { ProgressBar } from 'react-native-paper';
import { COLORS, PERSONALITIES, PERSONALITY_TYPES } from './PersonalityInfoData';

export default function PersonalityPercentage({ ix, type, percentage }: {
  ix: number;
  type: string;
  percentage: number;
}) {
  return (
    <View style={{
      marginBottom: 20
    }}>
      <View style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
      }}>
        <Text style={{
          marginRight: 15,
          fontSize: 18
        }}>{PERSONALITIES[ix][0] === type ? (percentage) : (100 - percentage)}%</Text>

        <View style={{
          // width: '100%',
          flex: 1
        }}>
          <ProgressBar
            progress={percentage * .01}
            // color={Colors.red800}
            color={COLORS[ix]}
            style={{
              height: 15,
              borderRadius: 15,
              transform: (type === PERSONALITIES[ix][1]) ? [
                { scaleX: -1 }
              ] : undefined
              // width: 100,
              // flex: 1
            }} />
        </View>

        <Text style={{
          marginLeft: 15,
          fontSize: 18
        }}>{PERSONALITIES[ix][1] === type ? (percentage) : (100 - percentage)}%</Text>
      </View>

      <View style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
      }}>
        {(PERSONALITIES[ix] ?? []).map((itype, ixx) => (
          <Text style={{
            fontSize: 18,
            // fontWeight: 'bold'
          }}>{PERSONALITY_TYPES[itype]}</Text>
        ))}
      </View>
    </View>
  );
}
