import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, Modal, Text, TouchableWithoutFeedback, View } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { ActivityIndicator, Button } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { LOADER_SIZE, MAIN_COLOR } from '../../constants';
import { useIsMounted } from '../../hooks/useIsMounted';
import { getSearchPreferences, updateSearchPreferences } from '../../services/api';
import { setSearchPref } from '../../store/actions/searchPref';
import { getTokenSelector } from '../../store/selectors/auth';
import { handleError, retryHttpRequest, throwErrorIfErrorStatusCode } from '../../utils';
import BottomModal from '../BottomModal';
import ItemHeading from '../profileInfo/ItemHeading';
import MultiSlider from '@ptomasroos/react-native-multi-slider';

const { width } = Dimensions.get('screen');
// export const SLIDER_MARGIN_SIZE = width / 12; // 32
export const SLIDER_MARGIN_SIZE = width / 19; // ~20
// alert(SLIDER_MARGIN_SIZE)
const styles = EStyleSheet.create({
  loadingContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '15rem'
  },
  container: {
    padding: '10rem'
  },
  labelContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  label: {
    // fontSize: 20,
    fontSize: '15rem',
    fontWeight: 'bold'
  },
  unitText: {
    fontWeight: 'bold'
  },
  sectionContainer: {
    marginBottom: '10rem'
  },
  sliderSelected: {
    backgroundColor: MAIN_COLOR,
    padding: 2,
    marginTop: -1
  },
  sliderMarker: {
    backgroundColor: MAIN_COLOR,
    width: '20rem',
    height: '20rem',
    borderRadius: 200,
  }
});

function CustomSliderMarker() {
  return (
    <View style={styles.sliderMarker} />
  );
}

export default function SearchPrefBottomModal({ show, onHide }: any) {
  // const [fromAge, setFromAge] = useState('');
  // const [toAge, setToAge] = useState('');
  // const [distance, setDistance] = useState('');
  const [fromAge, setFromAge] = useState(18);
  const [toAge, setToAge] = useState(70);
  const [distance, setDistance] = useState(0);
  const [income, setIncome] = useState('high');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  // const [searchPrefereces, setSearchPrefereces] = useState('');

  const dispatch = useDispatch();
  const isMounted = useIsMounted();
  const { t } = useTranslation();

  // const data = useSelector(shouldIntroModalData);
  const token = useSelector(getTokenSelector);

  useEffect(() => {
    if (show) {
      // setFromAge('');
      // setToAge('');
      // setDistance('');
      // setDistance();
      setIncome('');

      setLoading(true);

      retryHttpRequest(() => {
        if (!isMounted.current) return null;

        return getSearchPreferences(token);
      })
        // .then(throwErrorIfErrorStatusCode)
        .then((result: any) => result.json())
        .then(result => {
          // console.log('SEARCH PREF:');
          // console.log(JSON.stringify(result, null, 2));
          // setFromAge(result.fromAge.toString());
          // setToAge(result.toAge.toString());
          setFromAge(result.fromAge);
          setToAge(result.toAge);
          // setFromAge(21);
          // setToAge(52);
          // setDistance(result.distance.toString());
          setDistance(result.distance);
          setIncome(result.income);

          // dispatch(setSearchPref(result));

          setLoading(false);
        });
    }
  }, [show]);

  const hide = () => {
    if (saving) return;

    onHide();
  };

  return (
    <BottomModal show={show} onHide={onHide} style={{ padding: 0, }}>
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size={LOADER_SIZE} />
        </View>
      )}
      {!loading && (
        <View style={styles.container}>
          <ItemHeading style={{ padding: 0 }} onHide={onHide}>{t('Search preference')}</ItemHeading>
          <View style={styles.sectionContainer}>
            <View style={styles.labelContainer}>
              <Text style={styles.label}>{t('Radius')}:</Text>
              <Text style={styles.unitText}>{distance}</Text>
            </View>
            <MultiSlider
              selectedStyle={styles.sliderSelected}
              sliderLength={width - SLIDER_MARGIN_SIZE}
              max={200}
              values={[distance]}
              onValuesChange={(values: number[]) => {
                console.log(values);
                setDistance(values[0]);
              }}
              customMarker={() => <CustomSliderMarker />}
            />
          </View>
          <View style={styles.sectionContainer}>
            <View style={styles.labelContainer}>
              <Text style={styles.label}>{t('Age preference')}:</Text>
              <Text style={styles.unitText}>{fromAge} - {toAge}</Text>
            </View>
            <MultiSlider
              selectedStyle={styles.sliderSelected}
              sliderLength={width - SLIDER_MARGIN_SIZE}
              min={18}
              max={70}
              values={[+fromAge, +toAge]}
              enabledTwo={true}
              onValuesChange={(values: number[]) => {
                console.log(values);
                setFromAge(values[0]);
                setToAge(values[1]);
              }}
              isMarkersSeparated={true}
              customMarkerLeft={(e) => {
                return (<CustomSliderMarker />)
              }}
              customMarkerRight={(e) => {
                return (<CustomSliderMarker />)
              }}
            />
          </View>
          {/* <View style={{
                  marginBottom: 10
                }}>
                  <Text style={{
                    fontSize: 20,
                    fontWeight: 'bold'
                  }}>{t('Income preference:')}</Text>
                  <EditOptions
                    selected={income}
                    setSelected={setIncome}
                    options={arrayToOptions([
                      ['none', 'No income'],
                      ['low', 'Low income'],
                      ['middle', 'Average income'],
                      ['high', 'High income']
                    ])}></EditOptions>
                </View> */}
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-end',
              marginTop: 5
            }}
          >
            {/* <Button
            style={{ margin: 2 }}
            mode="outlined"
            disabled={saving}
            onPress={hide}
          >{t('Cancel')}</Button> */}
            <Button
              style={{ margin: 2 }}
              uppercase={false}
              mode="text"
              disabled={saving}
              loading={saving}
              onPress={() => {
                if (saving) return;

                setSaving(true);

                updateSearchPreferences({
                  fromAge,
                  toAge,
                  distance,
                  income
                }, token)
                  .then(throwErrorIfErrorStatusCode)
                  .then(() => {
                    // dispatch(userIntoUpdated(data.userId));
                    if (!isMounted.current) return;

                    dispatch(setSearchPref({
                      fromAge,
                      toAge,
                      distance,
                      income
                    }));

                    // setSaving(false);
                    hide();
                  })
                  .catch(err => {
                    handleError(err, dispatch);
                  })
                  .finally(() => {
                    if (!isMounted.current) return;

                    setSaving(false);
                  });
              }}
            >{t('Save')}</Button>
          </View>
        </View>)}
    </BottomModal>
  )

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={show}
      onDismiss={() => {
        console.log('ON DISMISS');
      }}
    >
      <TouchableWithoutFeedback
        style={{ flex: 1 }}
      >
        <View style={{
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          position: 'relative',
          padding: 15
        }}>
          <TouchableWithoutFeedback>
            <View style={{
              backgroundColor: '#fff',
              padding: 10,
              borderRadius: 5
            }}>

            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};
