import React, { useEffect, useState } from 'react';
import { View, ScrollView } from 'react-native';
import CBottomTabs from '../navigation/CBottomTabs';
import CustomProfileInfoHeader from '../navigation/CustomProfileInfoHeader';
import { ActivityIndicator, Button, Text, TextInput } from 'react-native-paper';
import { getSettingsInfo, updateProfile } from '../services/api';
import { arrayToOptions, getOptionItem, getStorageItem, retryHttpRequest, setStorageItem, throwErrorIfErrorStatusCode } from '../utils';
import { useSelector } from 'react-redux';
import ItemHeading from '../components/profileInfo/ItemHeading';
import EditItem from '../components/profileInfo/EditItem';
import { getProfileSelector } from '../store/selectors/profile';
import { getTokenSelector } from '../store/selectors/auth';
import { useIsMounted } from '../hooks/useIsMounted';
import BottomModal from '../components/BottomModal';
import BirthdayPicker from '../components/common/BirthdayPicker';
import moment from 'moment';
import EditOptions from '../components/profileInfo/EditOptions';
import SettingsHeader from '../navigation/SettingsHeader';
import { useTranslation } from 'react-i18next';
import { STORAGE_LANG_KEY } from '../constants';

export default function SettingsScreen(props: any) {
  const isMounted = useIsMounted();

  const token = useSelector(getTokenSelector);
  const [profile, setProfile] = useState<{
    id: string;
    name: string;
    birthday: string;
    age: number;
    gender: string;
    interested_in: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState<string | null>(null);

  useEffect(() => {
    getStorageItem(STORAGE_LANG_KEY)
      .then((lang: string | null) => {
        setLang(lang || 'en');
      })
  }, []);

  useEffect(() => {
    setLoading(true);

    retryHttpRequest(getSettingsInfo.bind(null, token as string))
      // .then(throwErrorIfErrorStatusCode)
      .then((result: any) => result.json())
      .then(json => {
        if (!isMounted.current) return;

        setProfile(json);
        setLoading(false);
      });
  }, []);

  if (loading || !profile || !lang) {
    return (
      <View style={{
        flex: 1
      }}>
        <SettingsHeader />
        <View style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <ActivityIndicator size={70} />
        </View>
        <CBottomTabs />
      </View>
    )
  }

  return (
    <View style={{
      flex: 1
    }}>
      <SettingsHeader />
      <ScrollView style={{
        flex: 1
      }}>
        <Name name={profile.name} setProfile={setProfile} />
        <Birthday birthday={profile.birthday} age={profile.age} setProfile={setProfile} />
        <Gender gender={profile.gender} setProfile={setProfile} />
        <InterestedIn interestedIn={profile.interested_in} setProfile={setProfile} />
        <Language lang={lang} setLang={setLang} />
      </ScrollView>

      <CBottomTabs />
    </View >
  );
}

function Name({ name, setProfile }: any) {
  const isMounted = useIsMounted();
  const { t } = useTranslation();

  const token = useSelector(getTokenSelector);
  const profile: any = useSelector(getProfileSelector);

  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState('');

  const [saving, setSaving] = useState(false);

  return (
    <>
      <EditItem onPress={() => {
        setEditName(name);
        setEditing(true);
      }}>
        <ItemHeading>
          {t('Name')}: <Text style={{ fontWeight: 'normal' }}>{name}</Text>
        </ItemHeading>
      </EditItem>

      <BottomModal show={editing} onHide={() => setEditing(false)}>
        <View style={{
          marginBottom: 15
        }}>
          <ItemHeading>{t('What\'s your name?')}</ItemHeading>
          <TextInput
            mode="outlined"
            placeholder={t('Your name...')}
            value={editName}
            onChangeText={setEditName}
          />
        </View>
        <View style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-end',
          marginTop: 5
        }}>
          <Button
            uppercase={false}
            disabled={saving}
            loading={saving}
            onPress={() => {
              setSaving(true);

              updateProfile({ name: editName }, token as string)
                .then(throwErrorIfErrorStatusCode)
                .then(() => {
                  if (!isMounted.current) return;

                  setProfile({
                    ...profile,
                    name: editName
                  });
                  setSaving(false);
                  setEditing(false);
                });
            }}>{t('Save')}</Button>
        </View>
      </BottomModal>
    </>
  );
}

function Birthday({ age, birthday, setProfile }: any) {
  const isMounted = useIsMounted();
  const { t } = useTranslation();

  const token = useSelector(getTokenSelector);
  const profile: any = useSelector(getProfileSelector);

  const [editing, setEditing] = useState(false);
  const [editBirthday, setEditBirthday] = useState('');

  const [saving, setSaving] = useState(false);

  return (
    <>
      <EditItem onPress={() => {
        setEditing(true);
      }}>
        <ItemHeading>
          {t('Birthday')}: <Text style={{ fontWeight: 'normal' }}>{moment(birthday).format('YYYY-MM-DD')}, {age}</Text>
        </ItemHeading>
      </EditItem>

      <BottomModal show={editing} onHide={() => setEditing(false)}>
        <View>
          <ItemHeading>{t('What\'s your birthday?')}</ItemHeading>
          <BirthdayPicker
            birthday={birthday}
            setBirthday={(newBirthday: string) => {
              console.log(`newBirthday:${newBirthday}`);
              setEditBirthday(newBirthday);
            }}
          />
        </View>
        <View style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-end',
          marginTop: 5
        }}>
          <Button
            uppercase={false}
            disabled={saving}
            loading={saving}
            onPress={() => {
              setSaving(true);

              updateProfile({ birthday: editBirthday }, token as string)
                .then(throwErrorIfErrorStatusCode)
                .then(() => {
                  if (!isMounted.current) return;

                  setProfile({
                    ...profile,
                    birthday: editBirthday
                  });
                  setSaving(false);
                  setEditing(false);
                });
            }}>{t('Save')}</Button>
        </View>
      </BottomModal>
    </>
  );
}

function Gender({ gender, setProfile }: any) {
  const isMounted = useIsMounted();
  const { t } = useTranslation();

  const token = useSelector(getTokenSelector);
  const profile: any = useSelector(getProfileSelector);

  const [editing, setEditing] = useState(false);
  const [editGender, setEditGender] = useState('');

  const [saving, setSaving] = useState(false);

  return (
    <>
      <EditItem onPress={() => {
        setEditGender(gender);
        setEditing(true);
      }}>
        <ItemHeading>
          {t('Gender')}: <Text style={{ fontWeight: 'normal' }}>{t(getOptionItem(gender))}</Text>
        </ItemHeading>
      </EditItem>

      <BottomModal show={editing} onHide={() => setEditing(false)}>
        <View style={{
          marginBottom: 15
        }}>
          <ItemHeading>{t('What\'s your gender?')}</ItemHeading>
          <EditOptions
            selected={editGender}
            setSelected={setEditGender}
            showDefault={false}
            options={arrayToOptions([
              ['male', 'Male'],
              ['female', 'Female']
            ])}
          />
        </View>
        <View style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-end',
          marginTop: 5
        }}>
          <Button
            uppercase={false}
            disabled={saving}
            loading={saving}
            onPress={() => {
              setSaving(true);

              updateProfile({ gender: editGender }, token as string)
                .then(throwErrorIfErrorStatusCode)
                .then(() => {
                  if (!isMounted.current) return;

                  setProfile({
                    ...profile,
                    name: editGender
                  });
                  setSaving(false);
                  setEditing(false);
                });
            }}>{t('Save')}</Button>
        </View>
      </BottomModal>
    </>
  );
}

function InterestedIn({ interestedIn, setProfile }: any) {
  const isMounted = useIsMounted();
  const { t } = useTranslation();

  const token = useSelector(getTokenSelector);
  const profile: any = useSelector(getProfileSelector);

  const [editing, setEditing] = useState(false);
  const [editInterestedIn, setEditInterestedIn] = useState('');

  const [saving, setSaving] = useState(false);

  return (
    <>
      <EditItem onPress={() => {
        setEditInterestedIn(interestedIn);
        setEditing(true);
      }}>
        <ItemHeading>
          {t('Interested in')}: <Text style={{ fontWeight: 'normal' }}>{t(getOptionItem(interestedIn))}</Text>
        </ItemHeading>
      </EditItem>

      <BottomModal show={editing} onHide={() => setEditing(false)}>
        <View style={{
          marginBottom: 15
        }}>
          <ItemHeading>{t('What are you interested in?')}</ItemHeading>
          <EditOptions
            selected={editInterestedIn}
            setSelected={setEditInterestedIn}
            showDefault={false}
            options={arrayToOptions([
              ['male', 'Male'],
              ['female', 'Female']
            ])}
          />
        </View>
        <View style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-end',
          marginTop: 5
        }}>
          <Button
            uppercase={false}
            disabled={saving}
            loading={saving}
            onPress={() => {
              setSaving(true);

              updateProfile({ interested_in: editInterestedIn }, token as string)
                .then(throwErrorIfErrorStatusCode)
                .then(() => {
                  if (!isMounted.current) return;

                  setProfile({
                    ...profile,
                    interested_in: editInterestedIn
                  });
                  setSaving(false);
                  setEditing(false);
                });
            }}>{t('Save')}</Button>
        </View>
      </BottomModal>
    </>
  );
}

function Language({ lang, setLang }: any) {
  const { i18n, t } = useTranslation();

  const [editing, setEditing] = useState(false);
  const [edit, setEdit] = useState('');

  const [saving, setSaving] = useState(false);

  return (
    <>
      <EditItem onPress={() => {
        setEdit(lang);
        setEditing(true);
      }}>
        <ItemHeading>
          {t('Language')}: <Text style={{ fontWeight: 'normal' }}>{lang}</Text>
        </ItemHeading>
      </EditItem>

      <BottomModal show={editing} onHide={() => setEditing(false)}>
        <View style={{
          marginBottom: 15
        }}>
          <ItemHeading>{t('Change your language')}</ItemHeading>
          <EditOptions
            selected={edit}
            setSelected={setEdit}
            showDefault={false}
            options={arrayToOptions([
              ['bg', 'Bulgarian'],
              ['en', 'English']
            ])}
          />
        </View>
        <View style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-end',
          marginTop: 5
        }}>
          <Button
            uppercase={false}
            disabled={saving}
            loading={saving}
            onPress={() => {
              i18n.changeLanguage(edit)
                .then(() => setStorageItem(STORAGE_LANG_KEY, edit))
                .then(() => {
                  setLang && setLang(edit);
                  setSaving(false);
                  setEditing(false);
                });
            }}>{t('Save')}</Button>
        </View>
      </BottomModal>
    </>
  );
}
