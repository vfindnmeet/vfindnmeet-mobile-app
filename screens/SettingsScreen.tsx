import React, { useCallback, useEffect, useState } from 'react';
import { View, ScrollView } from 'react-native';
import { Button, Colors, Divider, Switch, Text, TextInput } from 'react-native-paper';
import { getSettingsInfo, logout, setPushNotifSettings, updateProfile } from '../services/api';
import { arrayToOptions, getInterestedInOption, getLang, getOptionItem, getStorageItem, handleError, LANGUAGE_OPTIONS, retryHttpRequest, setStorageItem, throwErrorIfErrorStatusCode } from '../utils';
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
import { STORAGE_LANG_KEY, STORAGE_SHOW_INTRO_MODAL } from '../constants';
import { showDeactivateModal } from '../store/actions/modal';
import { logOutUser } from '../store/actions/auth';
import PageLoader from '../components/common/PageLoader';
import EStyleSheet from 'react-native-extended-stylesheet';

const styles = EStyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    padding: '10rem',
  },
  divider: {
    marginTop: '30rem',
    marginBottom: '20rem',
  },
  radioItemContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'nowrap'
  },
  radioTextContainer: {
    flexShrink: 1
  },
  radioItemTitle: {
    fontSize: '18rem',
    fontWeight: 'bold'
  },
  radioItemMargin: {
    marginTop: '10rem'
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: '20rem',
  },
  actionButtonsContainer: {
    marginBottom: '35rem'
  },
  modalTitle: {
    padding: '10rem'
  },
  modalButtonsContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: '5rem'
  }
});

export default function SettingsScreen(props: any) {
  const isMounted = useIsMounted();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [pnMessages, setPnMessages] = useState(false);
  const [pnLikes, setPnLikes] = useState(false);
  const [pnMatches, setPnMatches] = useState(false);
  const [videoCalls, setVideoCalls] = useState(false);

  const [loadingMessages, setLoadingMessages] = useState(false);
  const [loadingLikes, setLoadingLikes] = useState(false);
  const [loadingMatches, setLoadingMatches] = useState(false);
  const [loadingVideoCalls, setLoadingVideoCalls] = useState(false);

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

  const [showIntroModal, setShowIntroModal] = useState<null | boolean>(null);

  const onCheck = () => {
    const nc = !showIntroModal;

    setStorageItem(STORAGE_SHOW_INTRO_MODAL, nc ? 'true' : 'false')
      .then(() => {
        if (!isMounted.current) return;

        setShowIntroModal(nc);
      });
  };

  useEffect(() => {
    getStorageItem(STORAGE_SHOW_INTRO_MODAL)
      .then((checked) => {
        if (!isMounted.current) return;

        setShowIntroModal(checked !== 'false');
      });
  }, []);

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
        setVideoCalls(json.notif?.video_calls ?? true);

        setLoading(false);
      })
      .catch(e => {
        handleError(e, dispatch);
      });
  }, []);

  if (loading || !profile || !lang) {
    return (
      <View style={styles.container}>
        <SettingsHeader />
        <PageLoader />
        {/* <CBottomTabs /> */}
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <SettingsHeader />
      <ScrollView style={styles.innerContainer}>
        <Text style={styles.sectionTitle}>{t('Profile')}</Text>
        <Name name={profile.name} setProfile={setProfile} />
        <Birthday birthday={profile.birthday} age={profile.age} setProfile={setProfile} />
        <Gender gender={profile.gender} setProfile={setProfile} />
        <InterestedIn interestedIn={profile.interested_in} setProfile={setProfile} />
        <Language lang={lang} setLang={setLang} />

        <Divider style={styles.divider} />

        <Text style={styles.sectionTitle}>{t('Push notifications')}</Text>

        <View style={[styles.radioItemContainer, styles.radioItemMargin]}>
          <View style={styles.radioTextContainer}>
            <Text style={styles.radioItemTitle}>{t('Messages')}</Text>
            <Text>{t('When someone messages you')}</Text>
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

        <View style={[styles.radioItemContainer, styles.radioItemMargin]}>
          <View style={styles.radioTextContainer}>
            <Text style={styles.radioItemTitle}>{t('Received likes')}</Text>
            <Text>{t('When someone likes you')}</Text>
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

        <View style={[styles.radioItemContainer, styles.radioItemMargin]}>
          <View style={styles.radioTextContainer}>
            <Text style={styles.radioItemTitle}>{t('Matches')}</Text>
            <Text>{t('When you match with someone')}</Text>
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

        <Divider style={styles.divider} />

        <View style={styles.radioItemContainer}>
          <View style={styles.radioTextContainer}>
            <Text style={styles.radioItemTitle}>{t('Show message modal')}</Text>
            <Text>{t('When you likes someone - show intro message modal')}</Text>
          </View>
          <Switch
            disabled={showIntroModal === null}
            value={showIntroModal as boolean}
            onValueChange={onCheck}
          />
        </View>

        <View style={[styles.radioItemContainer, styles.radioItemMargin]}>
          <View style={styles.radioTextContainer}>
            <Text style={styles.radioItemTitle}>{t('Receive video calls')}</Text>
            <Text>{t('Your matches can video call you')}</Text>
          </View>
          <Switch
            disabled={loadingVideoCalls}
            value={videoCalls}
            onValueChange={() => {
              if (loadingVideoCalls) return;

              setLoadingVideoCalls(true);

              const v = !videoCalls;
              setVideoCalls(v);

              setPushNotifSettings({ videoCalls: v }, token)
                .finally(() => {
                  setLoadingVideoCalls(false);
                });
            }}
          />
        </View>

        <Divider style={styles.divider} />

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
        <View style={styles.actionButtonsContainer}>
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
        <View>
          <ItemHeading style={styles.modalTitle} onHide={onHide} disabled={saving}>{t('What\'s your name?')}</ItemHeading>
          <TextInput
            mode="flat"
            placeholder={t('Your name...')}
            value={editName}
            onChangeText={setEditName}
          />
        </View>
        <View style={styles.modalButtonsContainer}>
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
          <ItemHeading style={styles.modalTitle} onHide={onHide} disabled={saving}>{t('What\'s your birthday?')}</ItemHeading>
          <BirthdayPicker
            birthday={birthday}
            setBirthday={(newBirthday: string) => {
              console.log(`newBirthday:${newBirthday}`);
              setEditBirthday(newBirthday);
            }}
          />
        </View>
        <View style={styles.modalButtonsContainer}>
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
        <View>
          <ItemHeading style={styles.modalTitle} onHide={onHide} disabled={saving}>{t('What\'s your gender?')}</ItemHeading>
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
        <View style={styles.modalButtonsContainer}>
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
        <View>
          <ItemHeading style={styles.modalTitle} onHide={onHide} disabled={saving}>{t('What are you interested in?')}</ItemHeading>
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
        <View style={styles.modalButtonsContainer}>
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
        <View>
          <ItemHeading style={styles.modalTitle} onHide={onHide} disabled={saving}>{t('Change your language')}</ItemHeading>
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
        <View style={styles.modalButtonsContainer}>
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
