import React, { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import { Button, Divider, RadioButton, TouchableRipple } from "react-native-paper";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch, useSelector } from "react-redux";
import { useIsMounted } from "../../hooks/useIsMounted";
import { updateProfileInfo } from "../../services/api";
import { setProfileInfo } from "../../store/actions/profile";
import { getTokenSelector } from "../../store/selectors/auth";
import { arrayToOptions, getOptionItem, getOptionWithNoneItem, getSmokingOrDrinkingOptionItem, throwErrorIfErrorStatusCode } from "../../utils";
import BottomModal from "../BottomModal";
import EditOptions from "./EditOptions";
import ItemHeading from "./ItemHeading";

export default function Info({ info }: any) {
  const isMounted = useIsMounted();
  const dispatch = useDispatch();
  const token = useSelector(getTokenSelector);
  const { t } = useTranslation();

  const [editingHeight, setEditingHeight] = useState(false);
  const [editingBody, setEditingBody] = useState(false);
  const [editingDrinking, setEditingDrinking] = useState(false);
  const [editingSmoking, setEditingSmoking] = useState(false);
  const [editingChildren, setEditingChildren] = useState(false);
  const [editingPets, setEditingPets] = useState(false);
  const [editingPersonality, setEditingPersonality] = useState(false);
  const [editingEducation, setEditingEducation] = useState(false);
  const [editingEmployment, setEditingEmployment] = useState(false);
  const [editingIncome, setEditingIncome] = useState(false);

  const [height, setHeight] = useState('');
  const [body, setBody] = useState('');
  const [drinking, setDrinking] = useState('');
  const [smoking, setSmoking] = useState('');
  const [children, setChildren] = useState('');
  const [pets, setPets] = useState('');
  const [personality, setPersonality] = useState('');
  const [education, setEducation] = useState('');
  const [employment, setEmployment] = useState('');
  const [income, setIncome] = useState('');

  const [saving, setSaving] = useState(false);

  // console.log('info:');
  // console.log(info);

  const closeModals = () => {
    editingHeight && setEditingHeight(false);
    editingBody && setEditingBody(false);
    editingDrinking && setEditingDrinking(false);
    editingSmoking && setEditingSmoking(false);
    editingChildren && setEditingChildren(false);
    editingPets && setEditingPets(false);
    editingPersonality && setEditingPersonality(false);
    editingEducation && setEditingEducation(false);
    editingEmployment && setEditingEmployment(false);
    editingIncome && setEditingIncome(false);
  }

  const onInfoSave = (data: { [key: string]: any }) => {
    setSaving(true);

    updateProfileInfo(data, token as string)
      .then(throwErrorIfErrorStatusCode)
      .then(() => {
        dispatch(setProfileInfo(data));

        if (!isMounted.current) return;

        closeModals();
        setSaving(false);
      });
  };

  return (
    <>
      <View style={{
        marginTop: 10,
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 5
      }}>
        <ItemHeading>{t('Info')}</ItemHeading>

        <EditInfoItem title={t('Height')} value={info.height || t('I rather not say')} onPress={() => {
          setHeight(info.height);
          setEditingHeight(true);
        }} />
        <Divider />
        <EditInfoItem title={t('Body')} value={t(getOptionItem(info.body))} onPress={() => {
          setBody(info.body);
          setEditingBody(true);
        }} />
        <Divider />
        <EditInfoItem title={t('Drinking')} value={t(getSmokingOrDrinkingOptionItem(info.drinking, 'drinking'))} onPress={() => {
          setDrinking(info.drinking);
          setEditingDrinking(true);
        }} />
        <Divider />
        <EditInfoItem title={t('Smoking')} value={t(getSmokingOrDrinkingOptionItem(info.smoking, 'smoking'))} onPress={() => {
          setSmoking(info.smoking);
          setEditingSmoking(true);
        }} />
        <Divider />
        <EditInfoItem title={t('Children')} value={t(getOptionItem(info.children))} onPress={() => {
          setChildren(info.children);
          setEditingChildren(true);
        }} />
        <Divider />
        <EditInfoItem title={t('Pets')} value={t(getOptionWithNoneItem(info.pets, 'pets'))} onPress={() => {
          setPets(info.pets);
          setEditingPets(true);
        }} />
        <Divider />
        <EditInfoItem title={t('Personality')} value={t(getOptionItem(info.personality))} onPress={() => {
          setPersonality(info.personality);
          setEditingPersonality(true);
        }} />
        <Divider />
        <EditInfoItem title={t('Education')} value={t(getOptionWithNoneItem(info.education, 'education'))} onPress={() => {
          setEducation(info.education);
          setEditingEducation(true);
        }} />
        <Divider />
        <EditInfoItem title={t('Employment')} value={t(getOptionItem(info.employment))} onPress={() => {
          setEmployment(info.employment);
          setEditingEmployment(true);
        }} />
        <Divider />
        <EditInfoItem title={t('Income')} value={t(getOptionWithNoneItem(info.income, 'income'))} onPress={() => {
          setIncome(info.income);
          setEditingIncome(true);
        }} />
      </View>

      <BottomModal show={editingBody} onHide={() => {
        if (saving) return;

        setEditingBody(false)
      }}>
        <ItemHeading>{t('Body')}</ItemHeading>
        <EditOptions
          selected={body}
          setSelected={setBody}
          options={arrayToOptions([
            ['fit', 'Fit'],
            ['curvy', 'Curvy'],
            ['average', 'Average'],
            ['skinny', 'Skinny'],
          ])}
        />
        <View style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-end',
          marginTop: 5
        }}>
          <Button
            uppercase={false}
            loading={saving}
            onPress={() => onInfoSave({ body })}
          >{t('Save')}</Button>
        </View>
      </BottomModal>

      <BottomModal show={editingDrinking} onHide={() => setEditingDrinking(false)}>
        <ItemHeading>{t('Drinking')}</ItemHeading>
        <EditOptions
          selected={drinking}
          setSelected={setDrinking}
          options={arrayToOptions([
            ['regularly', 'Regularly'],
            ['sometimes', 'Socially'],
            ['never', 'I don\'t drink']
          ])}
        />
        <View style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-end',
          marginTop: 5
        }}>
          <Button
            uppercase={false}
            onPress={() => onInfoSave({ drinking })}
          >{t('Save')}</Button>
        </View>
      </BottomModal>

      <BottomModal show={editingSmoking} onHide={() => setEditingSmoking(false)}>
        <ItemHeading>{t('Smoking')}</ItemHeading>
        <EditOptions
          selected={smoking}
          setSelected={setSmoking}
          options={arrayToOptions([
            ['regularly', 'Regularly'],
            ['sometimes', 'Sometimes'],
            ['never', 'I don\'t smoke']
          ])}
        />
        <View style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-end',
          marginTop: 5
        }}>
          <Button
            uppercase={false}
            onPress={() => onInfoSave({ smoking })}
          >{t('Save')}</Button>
        </View>
      </BottomModal>

      <BottomModal show={editingChildren} onHide={() => setEditingChildren(false)}>
        <ItemHeading>{t('Children')}</ItemHeading>
        <EditOptions
          selected={children}
          setSelected={setChildren}
          options={arrayToOptions([
            ['has', 'Has children'],
            ['does_not_have', 'Doesn\'t have children'],
            ['does_not_have_and_does_not_want', 'Doesn\'t have children and doesn\'t want them'],
            ['does_not_have_but_wants', 'Doesn\'t have children but want them']
          ])}
        />
        <View style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-end',
          marginTop: 5
        }}>
          <Button
            uppercase={false}
            onPress={() => onInfoSave({ children })}
          >{t('Save')}</Button>
        </View>
      </BottomModal>

      <BottomModal show={editingPets} onHide={() => setEditingPets(false)}>
        <ItemHeading>{t('Pets')}</ItemHeading>
        <EditOptions
          selected={pets}
          setSelected={setPets}
          options={arrayToOptions([
            ['cat', 'Has cat(s)'],
            ['dog', 'Has dog(s)'],
            ['other', 'Has other(s) pets'],
            ['none', 'Doesn\'t have pets']
          ])}
        />
        <View style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-end',
          marginTop: 5
        }}>
          <Button
            uppercase={false}
            onPress={() => onInfoSave({ pets })}
          >{t('Save')}</Button>
        </View>
      </BottomModal>

      <BottomModal show={editingEducation} onHide={() => setEditingEducation(false)}>
        <ItemHeading>{t('Education')}</ItemHeading>
        <EditOptions
          selected={education}
          setSelected={setEducation}
          options={arrayToOptions([
            ['none', 'Doesn\'t have education'],
            ['entry', 'Entry level'],
            ['mid', 'High school'],
            ['higher', 'College/University']
          ])}
        />
        <View style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-end',
          marginTop: 5
        }}>
          <Button
            uppercase={false}
            onPress={() => onInfoSave({ education })}
          >{t('Save')}</Button>
        </View>
      </BottomModal>

      <BottomModal show={editingEmployment} onHide={() => setEditingEmployment(false)}>
        <ItemHeading>{t('Employment')}</ItemHeading>
        <EditOptions
          selected={employment}
          setSelected={setEmployment}
          options={arrayToOptions([
            ['full_time', 'Full-time'],
            ['part_time', 'Part-time'],
            ['freelance', 'Freelancer'],
            ['self_employed', 'Self-employed'],
            ['unemployed', 'Unemployed'],
            ['retired', 'Retired'],
          ])}
        />
        <View style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-end',
          marginTop: 5
        }}>
          <Button
            uppercase={false}
            onPress={() => onInfoSave({ employment })}
          >{t('Save')}</Button>
        </View>
      </BottomModal>

      <BottomModal show={editingPersonality} onHide={() => setEditingPersonality(false)}>
        <ItemHeading>{t('Personality')}</ItemHeading>
        <EditOptions
          selected={personality}
          setSelected={setPersonality}
          options={arrayToOptions([
            ['introvert', 'Introvert'],
            ['extrovert', 'Extrovert'],
            ['mixed', 'Somewhere in the middle']
          ])}
        />
        <View style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-end',
          marginTop: 5
        }}>
          <Button
            uppercase={false}
            onPress={() => onInfoSave({ personality })}
          >{t('Save')}</Button>
        </View>
      </BottomModal>

      <BottomModal show={editingIncome} onHide={() => setEditingIncome(false)}>
        <ItemHeading>{t('Income')}</ItemHeading>
        <EditOptions
          selected={income}
          setSelected={setIncome}
          options={arrayToOptions([
            ['none', 'No income'],
            ['low', 'Low income'],
            ['middle', 'Average income'],
            ['high', 'High income']
          ])}
        />
        <View style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-end',
          marginTop: 5
        }}>
          <Button
            uppercase={false}
            onPress={() => onInfoSave({ income })}
          >{t('Save')}</Button>
        </View>
      </BottomModal>
    </>
  );
}

function EditInfoItem({ title, value, children, onPress }: any) {
  return (
    <TouchableRipple onPress={onPress}>
      <View style={{
        padding: 5,
        paddingBottom: 10,
        paddingTop: 10
      }}>
        <View style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Text style={{ fontSize: 17 }}>{title}</Text>

          <View style={{
            display: 'flex',
            flexDirection: 'row',
          }}>
            <Text style={{ marginRight: 5 }}>{value}</Text>
            <MaterialCommunityIcons name="pencil-outline" size={20} />
          </View>
        </View>
      </View>
    </TouchableRipple>
  );
}
