import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, ScrollView } from 'react-native';
import CBottomTabs from '../navigation/CBottomTabs';
import CustomProfileInfoHeader from '../navigation/CustomProfileInfoHeader';
import { ActivityIndicator, Button, Colors, Divider, Switch, Text, TextInput } from 'react-native-paper';
import { getSettingsInfo, logout, setPushNotifSettings, updateProfile } from '../services/api';
import { arrayToOptions, DEFAULT_LANG, getInterestedInOption, getLang, getOptionItem, getStorageItem, handleError, LANGUAGE_OPTIONS, retryHttpRequest, setStorageItem, throwErrorIfErrorStatusCode } from '../utils';
import { useDispatch, useSelector } from 'react-redux';
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
import { MAIN_COLOR, STORAGE_LANG_KEY } from '../constants';
import { showDeactivateModal } from '../store/actions/modal';
import { logOutUser } from '../store/actions/auth';
import PageLoader from '../components/common/PageLoader';

export default function SettingsScreen(props: any) {
  const isMounted = useIsMounted();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [pnMessages, setPnMessages] = useState(false);
  const [pnLikes, setPnLikes] = useState(false);
  const [pnMatches, setPnMatches] = useState(false);

  const [loadingMessages, setLoadingMessages] = useState(false);
  const [loadingLikes, setLoadingLikes] = useState(false);
  const [loadingMatches, setLoadingMatches] = useState(false);

  // const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);

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

  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    getStorageItem(STORAGE_LANG_KEY)
      .then((lang: string | null) => {
        console.log('LANG:', lang);
        setLang(getLang(lang));
      })
  }, []);

  useEffect(() => {
    setLoading(true);

    retryHttpRequest(() => {
      if (!isMounted.current) return null;

      return getSettingsInfo(token as string);
    })
      // .then(throwErrorIfErrorStatusCode)
      .then((result: any) => result.json())
      .then(json => {
        if (!isMounted.current) return;

        console.log(json.notif);

        setProfile(json.user);
        setPnMessages(json.notif?.messages ?? true);
        setPnLikes(json.notif?.received_likes ?? true);
        setPnMatches(json.notif?.matches ?? true);
        setLoading(false);
      })
      .catch(e => {
        handleError(e, dispatch);
      });
  }, []);

  if (loading || !profile || !lang) {
    return (
      <View style={{
        flex: 1
      }}>
        <SettingsHeader />
        <PageLoader />
        {/* <CBottomTabs /> */}
      </View>
    )
  }

  return (
    <View style={{
      flex: 1
    }}>
      <SettingsHeader />
      <ScrollView style={{
        flex: 1,
        padding: 10,
      }}>
        <Text style={{
          fontWeight: 'bold',
          fontSize: 20,
        }}>{t('Profile')}</Text>
        <Name name={profile.name} setProfile={setProfile} />
        <Birthday birthday={profile.birthday} age={profile.age} setProfile={setProfile} />
        <Gender gender={profile.gender} setProfile={setProfile} />
        <InterestedIn interestedIn={profile.interested_in} setProfile={setProfile} />
        <Language lang={lang} setLang={setLang} />

        <Divider style={{
          marginTop: 30,
          marginBottom: 30,
        }} />

        <Text style={{
          fontWeight: 'bold',
          fontSize: 20,
        }}>{t('Push notifications')}</Text>

        <View style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between'
        }}>
          <View>
            <Text style={{
              fontSize: 20,
              fontWeight: 'bold'
            }}>Messages</Text>
            <Text>When someone messages you</Text>
          </View>
          <Switch
            disabled={loadingMessages}
            value={pnMessages}
            onValueChange={() => {
              if (loadingMessages) return;

              setLoadingMessages(true);

              const v = !pnMessages;
              setPnMessages(v);

              setPushNotifSettings({ messages: v }, token)
                .finally(() => {
                  setLoadingMessages(false);
                });
            }}
          />
        </View>

        <View style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: 10
        }}>
          <View>
            <Text style={{
              fontSize: 20,
              fontWeight: 'bold'
            }}>Received likes</Text>
            <Text>When someone likes you</Text>
          </View>
          <Switch
            disabled={loadingLikes}
            value={pnLikes}
            onValueChange={() => {
              if (loadingLikes) return;

              setLoadingLikes(true);

              const v = !pnLikes;
              setPnLikes(v);

              setPushNotifSettings({ likes: v }, token)
                .finally(() => {
                  setLoadingLikes(false);
                });
            }}
          />
        </View>

        <View style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: 10
        }}>
          <View>
            <Text style={{
              fontSize: 20,
              fontWeight: 'bold'
            }}>Matches</Text>
            <Text>When you match with someone</Text>
          </View>
          <Switch
            disabled={loadingMatches}
            value={pnMatches}
            onValueChange={() => {
              if (loadingMatches) return;

              setLoadingMatches(true);

              const v = !pnMatches;
              setPnMatches(v);

              setPushNotifSettings({ matches: v }, token)
                .finally(() => {
                  setLoadingMatches(false);
                });
            }}
          />
        </View>
        {/*
        message
        received likes
        matches
        */}

        <Divider style={{
          marginTop: 30,
          marginBottom: 30,
        }} />

        <View>
          <Button
            mode="contained"
            uppercase={false}
            disabled={loggingOut}
            loading={loggingOut}
            // color={MAIN_COLOR}
            labelStyle={{
              color: Colors.white
            }}
            style={{
              borderRadius: 500,
            }}
            onPress={() => {
              if (loggingOut) return;

              setLoggingOut(true);

              logout(token as string)
                .then(throwErrorIfErrorStatusCode)
                .then(() => {
                  dispatch(logOutUser());
                })
                .catch(err => {
                  handleError(err, dispatch);
                })
                .finally(() => {
                  if (!isMounted.current) return;

                  setLoggingOut(false);
                });
            }}
          >{t('Logout')}</Button>
        </View>
        <View>
          <Button
            color={Colors.grey800}
            uppercase={false}
            disabled={loggingOut}
            // loading={loggingOut}
            onPress={() => {
              dispatch(showDeactivateModal());
            }}
          >{t('Deactivate')}</Button>
        </View>
      </ScrollView>

      {/* <CBottomTabs /> */}
    </View >
  );
}

function Name({ name, setProfile }: any) {
  const isMounted = useIsMounted();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const token = useSelector(getTokenSelector);
  const profile: any = useSelector(getProfileSelector);

  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState('');

  const [saving, setSaving] = useState(false);

  const onHide = useCallback(() => {
    if (saving) return;

    setEditing(false);
  }, [saving, setEditing]);

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

      <BottomModal show={editing} onHide={onHide} style={{ padding: 0 }}>
        <View style={{
          // marginBottom: 15
        }}>
          <ItemHeading style={{ padding: 10 }} onHide={onHide} disabled={saving}>{t('What\'s your name?')}</ItemHeading>
          <TextInput
            mode="flat"
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
              if (saving) return;

              setSaving(true);

              updateProfile({ name: editName }, token as string)
                .then(throwErrorIfErrorStatusCode)
                .then(() => {
                  if (!isMounted.current) return;

                  setProfile({
                    ...profile,
                    name: editName
                  });
                  setEditing(false);
                })
                .catch(err => {
                  handleError(err, dispatch);
                })
                .finally(() => {
                  if (!isMounted.current) return;

                  setSaving(false);
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
  const dispatch = useDispatch();

  const token = useSelector(getTokenSelector);
  const profile: any = useSelector(getProfileSelector);

  const [editing, setEditing] = useState(false);
  const [editBirthday, setEditBirthday] = useState('');

  const [saving, setSaving] = useState(false);

  const onHide = useCallback(() => {
    if (saving) return;

    setEditing(false);
  }, [saving, setEditing]);

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
          <ItemHeading style={{ padding: 10 }} onHide={onHide} disabled={saving}>{t('What\'s your birthday?')}</ItemHeading>
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
              if (saving) return;

              setSaving(true);

              updateProfile({ birthday: editBirthday }, token as string)
                .then(throwErrorIfErrorStatusCode)
                .then(() => {
                  if (!isMounted.current) return;

                  setProfile({
                    ...profile,
                    birthday: editBirthday
                  });
                  setEditing(false);
                })
                .catch(err => {
                  handleError(err, dispatch);
                })
                .finally(() => {
                  if (!isMounted.current) return;

                  setSaving(false);
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
  const dispatch = useDispatch();

  const token = useSelector(getTokenSelector);
  const profile: any = useSelector(getProfileSelector);

  const [editing, setEditing] = useState(false);
  const [editGender, setEditGender] = useState('');

  const [saving, setSaving] = useState(false);

  const onHide = useCallback(() => {
    if (saving) return;

    setEditing(false);
  }, [saving, setEditing]);

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
          <ItemHeading style={{ padding: 10 }} onHide={onHide} disabled={saving}>{t('What\'s your gender?')}</ItemHeading>
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
              if (saving) return;

              setSaving(true);

              updateProfile({ gender: editGender }, token as string)
                .then(throwErrorIfErrorStatusCode)
                .then(() => {
                  if (!isMounted.current) return;

                  setProfile({
                    ...profile,
                    name: editGender
                  });
                  setEditing(false);
                })
                .catch(err => {
                  handleError(err, dispatch);
                })
                .finally(() => {
                  if (!isMounted.current) return;

                  setSaving(false);
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
  const dispatch = useDispatch();

  const token = useSelector(getTokenSelector);
  const profile: any = useSelector(getProfileSelector);

  const [editing, setEditing] = useState(false);
  const [editInterestedIn, setEditInterestedIn] = useState('');

  const [saving, setSaving] = useState(false);

  const onHide = useCallback(() => {
    if (saving) return;

    setEditing(false);
  }, [saving, setEditing]);

  return (
    <>
      <EditItem onPress={() => {
        setEditInterestedIn(interestedIn);
        setEditing(true);
      }}>
        <ItemHeading>
          {t('Interested in')}: <Text style={{ fontWeight: 'normal' }}>{t(getInterestedInOption(interestedIn))}</Text>
        </ItemHeading>
      </EditItem>

      <BottomModal show={editing} onHide={() => setEditing(false)}>
        <View style={{
          marginBottom: 15
        }}>
          <ItemHeading style={{ padding: 10 }} onHide={onHide} disabled={saving}>{t('What are you interested in?')}</ItemHeading>
          <EditOptions
            selected={editInterestedIn}
            setSelected={setEditInterestedIn}
            showDefault={false}
            options={arrayToOptions([
              ['male', 'Males'],
              ['female', 'Females']
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
              if (saving) return;

              setSaving(true);

              updateProfile({ interested_in: editInterestedIn }, token as string)
                .then(throwErrorIfErrorStatusCode)
                .then(() => {
                  if (!isMounted.current) return;

                  setProfile({
                    ...profile,
                    interested_in: editInterestedIn
                  });
                  setEditing(false);
                })
                .catch(err => {
                  handleError(err, dispatch);
                })
                .finally(() => {
                  if (!isMounted.current) return;

                  setSaving(false);
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

  const onHide = useCallback(() => {
    if (saving) return;

    setEditing(false);
  }, [saving, setEditing]);

  return (
    <>
      <EditItem onPress={() => {
        setEdit(lang);
        setEditing(true);
      }}>
        <ItemHeading>
          {t('Language')}: <Text style={{ fontWeight: 'normal' }}>{t(LANGUAGE_OPTIONS[lang])}</Text>
        </ItemHeading>
      </EditItem>

      <BottomModal show={editing} onHide={() => setEditing(false)}>
        <View style={{
          marginBottom: 15
        }}>
          <ItemHeading style={{ padding: 10 }} onHide={onHide} disabled={saving}>{t('Change your language')}</ItemHeading>
          <EditOptions
            selected={edit}
            setSelected={setEdit}
            showDefault={false}
            options={arrayToOptions([
              ['bg', LANGUAGE_OPTIONS['bg']],
              ['en', LANGUAGE_OPTIONS['en']]
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
