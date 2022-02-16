import React, { Fragment, useCallback, useMemo, useState } from 'react';
import { View, ScrollView, TouchableWithoutFeedback } from 'react-native';
import { Button, Colors, Text, Checkbox } from 'react-native-paper';
import { setStorageItem } from '../../../utils';
import { PERSONALITY_MEANING, PERSONALITY_SHORT, PERSONALITY_TYPES } from './PersonalityInfoData';
import EStyleSheet from 'react-native-extended-stylesheet';
import { t } from 'i18next';
import { STORAGE_SHOW_PERSONALITY_INFO_KEY } from '../../../constants';

const styles = EStyleSheet.create({
  pageContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  container: {
    paddingLeft: '15rem',
    paddingRight: '15rem',
  },
  sectionTitleText: {
    fontSize: '20rem',
    fontWeight: 'bold'
  },
  textDivider: {
    marginTop: '5rem'
  },
  traitText: {
    fontWeight: 'bold'
  },
  aspectSection: {
    marginLeft: '20rem',
    fontSize: '13.5rem'
  },
  buttonsContainer: {
    padding: '10rem'
  },
  checkboxContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: '10rem',
  },
  button: {
    width: '100%',
    padding: '5rem',
    borderRadius: 1000,
  },
});

const PERSONALITY_ASPECTS = [
  {
    name: 'Mind',
    descr: 'How we interact with our surroundings?',
  },
  {
    name: 'Energy',
    descr: 'How we see the world and process information?',
  },
  {
    name: 'Nature',
    descr: 'How we make decisions and cope with emotions?',
  },
  {
    name: 'Tactics',
    descr: 'Approach to work, planning and decision-making?',
  },
]

export default function PersonalityIntroInfo({ onContinue }: { onContinue: () => void }) {
  const [checked, setChecked] = useState(false);

  const onCheck = useCallback(() => {
    setChecked(!checked);
  }, [checked]);

  const personalities = useMemo(() => Object.keys(PERSONALITY_SHORT), []);

  return (
    <View style={styles.pageContainer}>
      <ScrollView style={styles.container}>
        <Text style={styles.sectionTitleText}>{t('About the personality types')}</Text>
        <Text style={styles.textDivider}>
          The theory of psychological type was introduced in the 1920s by Carl G. Jung.
          Katharine Cook Briggs and her daughter Isabel Briggs Myers made the theory of psychological types
          described by Jung understandable and useful in people's lives by creating the Myers–Briggs Type Indicator (MBTI).
        </Text>

        <Text style={styles.textDivider}>
          The MBTI indicates differing psychological preferences in how people perceive the world and make decisions.
        </Text>

        <Text style={[styles.sectionTitleText, styles.textDivider]}>{t('The 16 personalities')}</Text>

        <Text style={styles.textDivider}>
          MBTI contains 4 personality aspectes
          (<Text style={styles.traitText}>Mind</Text>, <Text style={styles.traitText}>Energy</Text>, <Text style={styles.traitText}>Nature</Text> and <Text style={styles.traitText}>Tactics</Text>
          ) each with 2 traits:
        </Text>

        {[
          ['E', 'I'],
          ['S', 'N'],
          ['T', 'F'],
          ['J', 'P'],
        ].map((j, ix) => (
          <Fragment key={ix}>
            <Text style={styles.textDivider}>
              <Text style={styles.traitText}>{PERSONALITY_ASPECTS[ix].name}</Text> - {t(PERSONALITY_ASPECTS[ix].descr)}
            </Text>
            {j.map(i => (
              <Text key={i} style={styles.aspectSection}>
                <Text style={styles.traitText}>{PERSONALITY_TYPES[i]} ({i})</Text> - {PERSONALITY_MEANING[i]}
              </Text>
            ))}
          </Fragment>
        ))}

        <Text style={styles.textDivider}>
          Each person has a dominant trait of all the 4 aspects. All the variations of the 4 aspects and traits makes up
          the 16 personalities: {personalities.map((type, ix) => (
            <Fragment key={type}>
              <Text style={styles.traitText}>{type}</Text>
              {ix < personalities.length - 2 && <Text>, </Text>}
              {ix === personalities.length - 2 && <Text>and </Text>}
            </Fragment>
          ))}
        </Text>

        {/* <Text style={styles.textDivider}>
          In personality typology, the Myers–Briggs Type Indicator (MBTI) is an introspective self-report questionnaire indicating differing psychological preferences in how people perceive the world and make decisions
        </Text> */}
        {/* 
        The theory of psychological type was introduced in the 1920s by Carl G. Jung.
        Katharine Cook Briggs and her daughter Isabel Briggs Myers made the theory of psychological types
        described by Jung understandable and useful in people's lives by creating the Myers–Briggs Type Indicator (MBTI).
        MBTI 
        */}
        {/* 
        how you observe the world and make decisions
        4 letter. 2 options for each letter. 2x2x2x2 = 16. All the different combinations of the letters is 16.
        
        The personality type is not set in stone and can change over time.
        If you have more traits of specific letter that doesn't mean you don't have traits of the opposite - it's just that in the majority of the time

        The theory of psychological type was introduced in the 1920s by Carl G. Jung.
        The MBTI tool was developed in the 1940s by Isabel Briggs Myers and the original research was done in the 1940s and '50s.
        This research is ongoing, providing users with updated and new information about psychological type and its applications.
        Millions of people worldwide have taken the Indicator each year since its first publication in 1962.

        */}
      </ScrollView>

      <View style={styles.buttonsContainer}>
        <TouchableWithoutFeedback onPress={onCheck}>
          <View style={styles.checkboxContainer}>
            <Checkbox
              status={checked ? 'checked' : 'unchecked'}
              onPress={onCheck}
            />
            <Text>{t('Don\'t show again')}</Text>
          </View>
        </TouchableWithoutFeedback>

        <Button
          uppercase={false}
          mode="contained"
          labelStyle={{
            color: Colors.white
          }}
          style={styles.button}
          onPress={() => {
            if (checked) {
              setStorageItem(STORAGE_SHOW_PERSONALITY_INFO_KEY, 'false')
                .finally(() => {
                  onContinue();
                });
            } else {
              onContinue();
            }
          }}
        >{t('Continue')}</Button>
      </View>
    </View>
  );
}
