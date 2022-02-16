import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import {
  Button as MatButton,
  HelperText,
  ActivityIndicator
} from "react-native-paper";
import OnboardingImagePicker from '../OnboardingImagePicker';
import { getOnboardingImages } from '../../services/api';
import { handleError, retryHttpRequest } from '../../utils';
import { getTokenSelector } from '../../store/selectors/auth';
import { useSelector } from 'react-redux';
import { useIsMounted } from '../../hooks/useIsMounted';
import { useTranslation } from 'react-i18next';

export default function OnboardingImages(props: any) {
  const isMounted = useIsMounted();
  const { t } = useTranslation();

  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);
  const [error, setError] = useState('');
  const token = useSelector(getTokenSelector);

  const onNextStep = () => {
    setCompleting(true);

    props.setImages(images);
    props.complete()
      .finally(() => {
        if (!isMounted.current) return;

        setCompleting(false);
      });
  };

  useEffect(() => {
    retryHttpRequest(() => {
      if (!isMounted.current) return null;

      return getOnboardingImages(token as string);
    })
      .then((result: any) => result.json())
      .then(json => {
        if (!isMounted.current) return;

        setImages(json?.images ?? []);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (images.length === 0) {
      setError('You must upload at least one image.')
    } else {
      setError('');
    }
  }, [images]);

  if (loading) {
    return (
      <View>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View>
      <Text style={{ textAlign: 'center', fontSize: 20 }}>{t('Upload images')}</Text>
      <OnboardingImagePicker
        images={images}
        setImages={setImages}
        setErrorMessage={props.setErrorMessage}
        setError={setError}
        allowImageChaning={!completing}
      />

      <HelperText type="error" visible={!!error} >
        {t(error)}
      </HelperText>

      <MatButton
        disabled={completing || images.length === 0}
        style={{ width: '100%', marginTop: 15 }}
        uppercase={false}
        mode="contained"
        onPress={onNextStep}
      >{t('Complete')}</MatButton>
    </View>
  );
}
