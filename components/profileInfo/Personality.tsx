import React, { useState } from "react";
import { Text, View } from "react-native";
import { Button, TouchableRipple } from "react-native-paper";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import BottomModal from "../BottomModal";
import ItemHeading from "./ItemHeading";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import PersonalityBadge from "../common/personality/PersonalityBadge";
import { MEDIUM_ICON_SIZE } from "../../constants";
import EStyleSheet from "react-native-extended-stylesheet";

const styles = EStyleSheet.create({
  container: {
    marginTop: '10rem',
    padding: '10rem',
    backgroundColor: '#fff',
    borderRadius: '5rem'
  },
  container2: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    marginBottom: '15rem'
  },
  personalityText: {
    marginRight: '5rem',
  },
  modalButton: {
    padding: '5rem'
  },
});

export default function Personality({ personality }: { personality: string; }) {
  const { t } = useTranslation();
  const navigation: any = useNavigation();

  const [editingPersonality, setEditingPersonality] = useState(false);

  return (
    <>
      <TouchableRipple
        onPress={() => {
          setEditingPersonality(true);
        }}
        style={styles.container}
      >
        {/* <View> */}
        <View style={styles.container2}>
          <View>
            <ItemHeading
              style={styles.title}
            >{t('Personality type')}</ItemHeading>
            {personality && (
              <View style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
              }}>
                <Text style={styles.personalityText}>{t('Your personality type is')}</Text>
                <PersonalityBadge personality={personality} />
              </View>
            )}
            {!personality && (
              <Text>{t('No personality type selected')}</Text>
            )}
          </View>
          <MaterialCommunityIcons name="pencil-outline" size={MEDIUM_ICON_SIZE} />
        </View>
        {/* </View> */}
      </TouchableRipple>

      <BottomModal show={editingPersonality} onHide={() => {
        setEditingPersonality(false);
      }}>
        <Button
          style={styles.modalButton}
          uppercase={false}
          onPress={() => {
            navigation.navigate('PickPersonality', { personality });
            setEditingPersonality(false);
          }}
        >{!personality ? t('Already know your personality type?') : t('Select personality type from list')}</Button>
        <Button
          style={styles.modalButton}
          uppercase={false}
          onPress={() => {
            navigation.navigate('PersonalityQuiz', { personality });
            setEditingPersonality(false);
          }}
        >{t('Take test to determine personality')}</Button>
      </BottomModal>
    </>
  );
}
