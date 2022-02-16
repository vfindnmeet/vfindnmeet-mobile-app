import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { Text, TextInput, View } from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";
import { Button, Colors, Divider, HelperText, TouchableRipple } from "react-native-paper";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch, useSelector } from "react-redux";
import { ICON_SIZE, MEDIUM_ICON_SIZE } from "../../constants";
import { useIsMounted } from "../../hooks/useIsMounted";
import { updateProfileInfo } from "../../services/api";
import { setProfileInfo } from "../../store/actions/profile";
import { getTokenSelector } from "../../store/selectors/auth";
import {
  arrayToOptions,
  getOptionItem,
  getOptionWithNoneItem,
  getSmokingOrDrinkingOptionItem,
  handleError,
  throwErrorIfErrorStatusCode
} from "../../utils";
import BottomModal from "../BottomModal";
import EditOptions from "./EditOptions";
import ItemHeading from "./ItemHeading";

const styles = EStyleSheet.create({
  container: {
    marginTop: '10rem',
    padding: '10rem',
    backgroundColor: '#fff',
    borderRadius: '5rem'
  },
  modalTitle: {
    padding: '10rem',
  },
  modalButtonContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: '5rem'
  },
  heightInp: {
    borderWidth: 1,
    borderColor: Colors.black,
    width: '70rem',
    padding: '5rem',
    borderRadius: '10rem'
  },
  infoItemContainer: {
    padding: '5rem',
    paddingBottom: '10rem',
    paddingTop: '10rem'
  },
  infoItemInnerContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  infoItemTextContainer: {
    display: 'flex',
    flexDirection: 'row',
    // justifyContent: 'flex-end',
    alignItems: 'center',
    width: '50%'
  },
  infoItemIcon: {
    backgroundColor: Colors.grey300,
    borderRadius: 100,
    padding: '5rem',
    marginRight: '5rem',
  },
  infoItemText: {
    fontSize: '17rem',
    // width: '50%'
  },
  infoItemSelectedContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '50%'
  },
  infoItemSelectedText: {
    marginRight: '5rem',
    textAlign: 'center'
  }
});

const isValidHeight = (height: number) => 50 <= height && height <= 300;

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
  const [pet, setPet] = useState('');
  // const [personality, setPersonality] = useState('');
  const [education, setEducation] = useState('');
  const [employment, setEmployment] = useState('');
  const [income, setIncome] = useState('');

  const [saving, setSaving] = useState(false);

  const [heightTouched, setHeightTouched] = useState(false);
  const [heightError, setHeightError] = useState('');

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
    if (saving) return;

    setSaving(true);

    updateProfileInfo(data, token as string)
      .then(throwErrorIfErrorStatusCode)
      .then(() => {
        dispatch(setProfileInfo(data));

        if (!isMounted.current) return;

        closeModals();
        // setSaving(false);
      })
      .catch(err => {
        handleError(err, dispatch);
      })
      .finally(() => {
        if (!isMounted.current) return;

        setSaving(false);
      });
  };

  const onModalHide = useCallback(() => {
    if (saving) return;

    setEditingHeight(false);
    setEditingBody(false);
    setEditingDrinking(false);
    setEditingSmoking(false);
    setEditingChildren(false);
    setEditingPets(false);
    setEditingPersonality(false);
    setEditingEducation(false);
    setEditingEmployment(false);
    setEditingIncome(false);
  }, [saving]);

  // const info = [
  //   { icon: 'human-male-height', label: getHeight(user.info.height) },
  //   { icon: 'dumbbell', label: getBody(user.info.body) },
  //   { icon: 'smoking', label: getSmoking(user.info.smoking) },
  //   { icon: 'glass-cocktail', label: getDrinking(user.info.drinking) },
  //   { icon: 'baby-carriage', label: getChildren(user.info.children) },
  //   { icon: 'dog-service', label: getPet(user.info.pet) },
  //   { icon: 'briefcase', label: getEmployment(user.info.employment) },
  //   { icon: 'school', label: getEducation(user.info.education) },
  //   { icon: 'account', label: getPersonality(user.info.personality) },
  //   { icon: 'cash-multiple', label: getIncome(user.info.income) },
  // ].filter(({ label }) => !!label);

  return (
    <>
      <View style={styles.container}>
        <ItemHeading>{t('Info')}</ItemHeading>

        <EditInfoItem title={t('Height')} icon='human-male-height' value={info.height ? `${info.height} cm` : t('I rather not say')} onPress={() => {
          setHeight(info.height ? info.height.toString() : '');
          setHeightTouched(false);
          setHeightError('');
          setEditingHeight(true);
        }} />
        <Divider />
        <EditInfoItem title={t('Body')} icon='dumbbell' value={t(getOptionItem(info.body))} onPress={() => {
          setBody(info.body);
          setEditingBody(true);
        }} />
        <Divider />
        <EditInfoItem title={t('Drinking')} icon='glass-cocktail' value={t(getSmokingOrDrinkingOptionItem(info.drinking, 'drinking'))} onPress={() => {
          setDrinking(info.drinking);
          setEditingDrinking(true);
        }} />
        <Divider />
        <EditInfoItem title={t('Smoking')} icon='smoking' value={t(getSmokingOrDrinkingOptionItem(info.smoking, 'smoking'))} onPress={() => {
          setSmoking(info.smoking);
          setEditingSmoking(true);
        }} />
        <Divider />
        <EditInfoItem title={t('Children')} icon='baby-carriage' value={t(getOptionItem(info.children))} onPress={() => {
          setChildren(info.children);
          setEditingChildren(true);
        }} />
        <Divider />
        <EditInfoItem title={t('Pets')} icon='dog-service' value={t(getOptionWithNoneItem(info.pet, 'pet'))} onPress={() => {
          setPet(info.pet);
          setEditingPets(true);
        }} />
        {/* <Divider />
        <EditInfoItem title={t('Personality')} value={t(getOptionItem(info.personality))} onPress={() => {
          setPersonality(info.personality);
          setEditingPersonality(true);
        }} /> */}
        {/* <Divider />
        <EditInfoItem title={t('Education')} value={t(getOptionWithNoneItem(info.education, 'education'))} onPress={() => {
          setEducation(info.education);
          setEditingEducation(true);
        }} />
        <Divider />
        <EditInfoItem title={t('Employment')} value={t(getOptionItem(info.employment))} onPress={() => {
          setEmployment(info.employment);
          setEditingEmployment(true);
        }} /> */}
        <Divider />
        <EditInfoItem title={t('Income')} icon='cash-multiple' value={t(getOptionWithNoneItem(info.income, 'income'))} onPress={() => {
          setIncome(info.income);
          setEditingIncome(true);
        }} />
      </View>

      <BottomModal show={editingHeight} onHide={onModalHide}>
        <ItemHeading style={styles.modalTitle} onHide={onModalHide} disabled={saving}>{t('Height')}</ItemHeading>
        <View style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <TextInput
            multiline={false}
            maxLength={3}
            keyboardType="numeric"
            placeholder={t('Height')}
            onFocus={() => setHeightTouched(true)}
            value={height}
            onChangeText={(text: string) => {
              const n = +text;
              // console.log('n=>', n,);
              if (!isValidHeight(n)) {
                setHeightError('Please enter a valid height');
              } else {
                setHeightError('');
              }
              setHeight(text);
            }}
            style={styles.heightInp}
          ></TextInput>
          <Text style={{ marginLeft: 5 }}>cm</Text>
        </View>
        <View>
          {heightTouched && !!heightError && <HelperText type="error">{t(heightError)}</HelperText>}
        </View>
        <View style={styles.modalButtonContainer}>
          <Button
            uppercase={false}
            loading={saving}
            disabled={!heightTouched || !isValidHeight(+height)}
            onPress={() => onInfoSave({ height })}
          >{t('Save')}</Button>
        </View>
      </BottomModal>

      <BottomModal show={editingBody} onHide={() => {
        if (saving) return;

        setEditingBody(false)
      }}>
        <ItemHeading style={styles.modalTitle} onHide={onModalHide} disabled={saving}>{t('Body')}</ItemHeading>
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
        <View style={styles.modalButtonContainer}>
          <Button
            uppercase={false}
            loading={saving}
            onPress={() => onInfoSave({ body })}
          >{t('Save')}</Button>
        </View>
      </BottomModal>

      <BottomModal show={editingDrinking} onHide={() => setEditingDrinking(false)}>
        <ItemHeading style={styles.modalTitle} onHide={onModalHide} disabled={saving}>{t('Drinking')}</ItemHeading>
        <EditOptions
          selected={drinking}
          setSelected={setDrinking}
          options={arrayToOptions([
            ['regularly', 'Regularly'],
            ['sometimes', 'Socially'],
            ['never', 'I don\'t drink']
          ])}
        />
        <View style={styles.modalButtonContainer}>
          <Button
            uppercase={false}
            onPress={() => onInfoSave({ drinking })}
          >{t('Save')}</Button>
        </View>
      </BottomModal>

      <BottomModal show={editingSmoking} onHide={() => setEditingSmoking(false)}>
        <ItemHeading style={styles.modalTitle} onHide={onModalHide} disabled={saving}>{t('Smoking')}</ItemHeading>
        <EditOptions
          selected={smoking}
          setSelected={setSmoking}
          options={arrayToOptions([
            ['regularly', 'Regularly'],
            ['sometimes', 'Sometimes'],
            ['never', 'I don\'t smoke']
          ])}
        />
        <View style={styles.modalButtonContainer}>
          <Button
            uppercase={false}
            onPress={() => onInfoSave({ smoking })}
          >{t('Save')}</Button>
        </View>
      </BottomModal>

      <BottomModal show={editingChildren} onHide={() => setEditingChildren(false)}>
        <ItemHeading style={styles.modalTitle} onHide={onModalHide} disabled={saving}>{t('Children')}</ItemHeading>
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
        <View style={styles.modalButtonContainer}>
          <Button
            uppercase={false}
            onPress={() => onInfoSave({ children })}
          >{t('Save')}</Button>
        </View>
      </BottomModal>

      <BottomModal show={editingPets} onHide={() => setEditingPets(false)}>
        <ItemHeading style={styles.modalTitle} onHide={onModalHide} disabled={saving}>{t('Pets')}</ItemHeading>
        <EditOptions
          selected={pet}
          setSelected={setPet}
          options={arrayToOptions([
            ['cat', 'Has cat(s)'],
            ['dog', 'Has dog(s)'],
            ['other', 'Has other(s) pets'],
            ['none', 'Doesn\'t have pets']
          ])}
        />
        <View style={styles.modalButtonContainer}>
          <Button
            uppercase={false}
            onPress={() => onInfoSave({ pet })}
          >{t('Save')}</Button>
        </View>
      </BottomModal>

      <BottomModal show={editingEducation} onHide={() => setEditingEducation(false)}>
        <ItemHeading style={styles.modalTitle} onHide={onModalHide} disabled={saving}>{t('Education')}</ItemHeading>
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
        <View style={styles.modalButtonContainer}>
          <Button
            uppercase={false}
            onPress={() => onInfoSave({ education })}
          >{t('Save')}</Button>
        </View>
      </BottomModal>

      <BottomModal show={editingEmployment} onHide={() => setEditingEmployment(false)}>
        <ItemHeading style={styles.modalTitle} onHide={onModalHide} disabled={saving}>{t('Employment')}</ItemHeading>
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
        <View style={styles.modalButtonContainer}>
          <Button
            uppercase={false}
            onPress={() => onInfoSave({ employment })}
          >{t('Save')}</Button>
        </View>
      </BottomModal>

      {/* <BottomModal show={editingPersonality} onHide={() => setEditingPersonality(false)}>
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
      </BottomModal> */}

      <BottomModal show={editingIncome} onHide={() => setEditingIncome(false)}>
        <ItemHeading style={styles.modalTitle} onHide={onModalHide} disabled={saving}>{t('Income')}</ItemHeading>
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
        <View style={styles.modalButtonContainer}>
          <Button
            uppercase={false}
            onPress={() => onInfoSave({ income })}
          >{t('Save')}</Button>
        </View>
      </BottomModal>
    </>
  );
}

function EditInfoItem({ title, value, icon, children, onPress }: any) {
  return (
    <TouchableRipple onPress={onPress}>
      <View style={styles.infoItemContainer}>
        <View style={styles.infoItemInnerContainer}>
          <View style={styles.infoItemTextContainer}>
            {!!icon && <MaterialCommunityIcons
              name={icon}
              size={ICON_SIZE}
              style={styles.infoItemIcon} />}
            <Text style={styles.infoItemText}>{title}</Text>
          </View>

          <View style={styles.infoItemSelectedContainer}>
            <Text style={styles.infoItemSelectedText}>{value}</Text>
            <MaterialCommunityIcons name="pencil-outline" size={MEDIUM_ICON_SIZE} />
          </View>
        </View>
      </View>
    </TouchableRipple>
  );
}
