import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { Colors } from 'react-native-paper';
import { COLORS, PERSONALITIES, PERSONALITY_INFO, PERSONALITY_MEANING, PERSONALITY_SHORT, PERSONALITY_TYPES } from './PersonalityInfoData';

export default function PersonalityInfos({
  personality
}: {
  personality: {
    personality: string;
  }
}) {
  const letters = useMemo(() => personality.personality.split(''), [personality?.personality]);
  console.log('letters', letters);

  return (
    <View>
      <Text style={{
        fontSize: 20,
        fontWeight: 'bold'
      }}>{personality.personality}: {PERSONALITY_INFO[personality.personality].title}</Text>

      <View style={{
        marginTop: 10
      }}>
        <Text style={{
          fontSize: 20,
          fontWeight: 'bold'
        }}>What does {personality.personality} mean</Text>
        <Text style={{
          marginTop: 5
        }}>{personality.personality} is one of the 16 personality types. {personality.personality} stands for {letters.map((i: string) => PERSONALITY_TYPES[i]).join(', ')}. Every character represents a personality trait:
        </Text>

        <Text style={{ marginTop: 10 }}>How we interact with our surroundings?</Text>
        <Text style={{ marginLeft: 20 }}><Text style={{ fontWeight: 'bold' }}>{PERSONALITY_TYPES[letters[0]]} ({letters[0]})</Text> - {PERSONALITY_MEANING[letters[0]]}</Text>

        <Text style={{ marginTop: 10 }}>How we see the world and process information?</Text>
        <Text style={{ marginLeft: 20 }}><Text style={{ fontWeight: 'bold' }}>{PERSONALITY_TYPES[letters[1]]} ({letters[1]})</Text> - {PERSONALITY_MEANING[letters[1]]}</Text>

        <Text style={{ marginTop: 10 }}>How we make decisions and cope with emotions?</Text>
        <Text style={{ marginLeft: 20 }}><Text style={{ fontWeight: 'bold' }}>{PERSONALITY_TYPES[letters[2]]} ({letters[2]})</Text> - {PERSONALITY_MEANING[letters[2]]}</Text>

        <Text style={{ marginTop: 10 }}>Approach to work, planning and decision-making?</Text>
        <Text style={{ marginLeft: 20 }}><Text style={{ fontWeight: 'bold' }}>{PERSONALITY_TYPES[letters[3]]} ({letters[3]})</Text> - {PERSONALITY_MEANING[letters[3]]}</Text>
      </View>

      {!!PERSONALITY_SHORT[personality.personality]?.description && (
        <View style={{
          marginTop: 10
        }}>
          <Text style={{
            fontSize: 20,
            fontWeight: 'bold'
          }}>About {personality.personality}</Text>
          <Text style={{
            marginTop: 5
          }}>{PERSONALITY_INFO[personality.personality]?.description}</Text>

          {/* <Text style={{
              marginTop: 5
            }}>{`What's the ${personality.personality} personality? ${personality.personality} personality types are`} {PERSONALITY_SHORT[personality.personality]?.description}</Text> */}
        </View>
      )}

      {/* {PERSONALITY_INFO[personality.personality]?.description?.length > 0 && (
        <View style={{
          marginTop: 10
        }}>
          <Text style={{
            fontSize: 20,
            fontWeight: 'bold'
          }}>About {personality.personality}</Text>
          {(PERSONALITY_INFO[personality.personality].description ?? []).map((i: string) => (
            <Text style={{
              marginTop: 5
            }}>{i}</Text>
          ))}
        </View>
      )} */}

      {/* {PERSONALITY_INFO[personality.personality]?.relationship?.length > 0 && (
        <View style={{
          marginTop: 10
        }}>
          <Text style={{
            fontSize: 20,
            fontWeight: 'bold'
          }}>{personality.personality} in a relationship</Text>
          {(PERSONALITY_INFO[personality.personality].relationship ?? []).map((i: string) => (
            <Text style={{
              marginTop: 5
            }}>{i}</Text>
          ))}
        </View>
      )} */}

      {/* {PERSONALITY_INFO[personality.personality]?.strengths && (
        <View style={{
          marginTop: 10
        }}>
          <Text style={{
            fontSize: 20,
            fontWeight: 'bold'
          }}>{personality.personality} strengths</Text>
          {Object.keys(PERSONALITY_INFO[personality.personality]?.strengths).map((i: string) => (
            <Text style={{
              marginTop: 5,
            }}>
              <Text style={{
                fontWeight: 'bold'
              }}>{i}</Text> {PERSONALITY_INFO[personality.personality]?.strengths[i]}
            </Text>
          ))}
        </View>
      )} */}

      {/* {PERSONALITY_INFO[personality.personality]?.weaknesses && (
        <View style={{
          marginTop: 10
        }}>
          <Text style={{
            fontSize: 20,
            fontWeight: 'bold'
          }}>{personality.personality} weaknesses</Text>
          {Object.keys(PERSONALITY_INFO[personality.personality]?.weaknesses).map((i: string) => (
            <Text style={{
              marginTop: 5,
            }}>
              <Text style={{
                fontWeight: 'bold'
              }}>{i}</Text> {PERSONALITY_INFO[personality.personality]?.weaknesses[i]}
            </Text>
          ))}
        </View>
      )} */}

      {PERSONALITY_INFO[personality.personality]?.matches?.length > 0 && (
        <View style={{
          marginTop: 10
        }}>
          <Text style={{
            fontSize: 20,
            fontWeight: 'bold'
          }}>Most compatible with {personality.personality}:</Text>
          {PERSONALITY_INFO[personality.personality].matches.map((mtype: string) => (
            <View
              key={mtype}
              style={{
                marginTop: 7,
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center'
              }}
            >
              <View style={{
                padding: 3,
                paddingLeft: 6,
                paddingRight: 6,
                borderRadius: 5,
                backgroundColor: PERSONALITY_INFO[mtype].color,

              }}><Text style={{ color: Colors.white, fontWeight: 'bold' }}>{mtype}</Text></View>
              <Text> - {PERSONALITY_INFO[mtype].title}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}
