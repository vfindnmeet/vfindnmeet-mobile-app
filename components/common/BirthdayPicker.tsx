import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, View } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { HelperText, Text, TextInput } from 'react-native-paper';
import { WheelPicker } from 'react-native-wheel-picker-android';

const styles = EStyleSheet.create({
  pickerItemContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: '30%'
  },
  pickerText: {
    textAlign: 'center',
    fontSize: '20rem'
  },
  pickerWheel: {
    width: '100%',
    height: '150rem',
  }
});

const monthOptions = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const yearOptions: number[] = [];
const curYear = new Date().getFullYear();
// alert(curYear)
for (let i = curYear - 18, j = 0; j <= 100; i--, j++) {
  yearOptions.push(i);
}

const daysFor = (month: number | null, year: number | null) => {
  if (!month || !year) return [];
  const date = new Date();
  date.setFullYear(year);
  date.setMonth(month);
  date.setDate(0)
  const days = date.getDate();

  const r = [];
  for (let i = 1; i <= days; i++) {
    r.push(i);
  }

  return r;
};

const { width } = Dimensions.get('screen');
export const PICKER_TEXT_SIZE = width / 15; // ~25

const isValidDate = (date: any) => {
  return date instanceof Date && !isNaN(date as any);
}

export default function BirthdayPicker({ birthday, setBirthday, onError }: any) {
  const d = new Date(birthday);
  const validDate = isValidDate(d);

  const [day, setDay] = useState<number | null>(validDate ? d.getDate() : 0);
  const [month, setMonth] = useState<number | null>(validDate ? d.getMonth() + 1 : 0);
  const [year, setYear] = useState<number | null>(validDate ? d.getFullYear() : 0);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

  const dayRef = useRef(null);
  const monthRef = useRef(null);
  const yearRef = useRef(null);

  const allFieldsSet = () => day !== null && month !== null && year !== null;

  const calculateAge = (birthday: Date) => {
    const ageDifMs = Date.now() - +birthday;
    const ageDate = new Date(ageDifMs);

    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }

  const getError = (): string | null => {
    if (day === null || month === null || year === null) {
      return 'Invalid date.';
    }

    const d = new Date();
    d.setFullYear(year);
    d.setMonth(month - 1);
    d.setDate(day);

    if (
      d.getDate() !== day ||
      d.getMonth() + 1 !== month ||
      d.getFullYear() !== year
    ) {
      return 'Invalid date.';
    }

    const age = calculateAge(d);
    if (age < 18) {
      return 'Must be 18 years or older.'
    } else if (age >= 70) {
      return 'Must be 70 years or younger.'
    }

    return null;
  }

  useEffect(() => {
    const error = getError();
    setError(error);
    onError && onError(error);

    if (day === null || month === null || year === null) {
      return;
    }

    const bd = `${day < 10 ? `0${day}` : day}-${month < 10 ? `0${month}` : month}-${year}`;
    // const bd = `${year}-${month < 10 ? `0${month}` : month}-${day < 10 ? `0${day}` : day}`;
    setBirthday(bd);

    console.log(bd)
  }, [day, month, year]);

  // const onNextStep = () => {
  //   if (day === null || month === null || year === null) {
  //     return;
  //   }

  //   // console.log('====>!', `${day < 10 ? `0${day}` : day}-${month < 10 ? `0${month}` : month}-${year}`);
  //   // console.log('!!!', day, month, year);

  //   // props.setBirthday(`${day < 10 ? `0${day}` : day}-${month < 10 ? `0${month}` : month}-${year}`);
  //   props.nextStep();
  // };

  const [selectedDay, setSelectedDay] = useState<any>(day);
  const [selectedMonth, setSelectedMonth] = useState<any>(month);
  const [selectedYear, setSelectedYear] = useState<any>(yearOptions.indexOf(year as number));

  return (
    <View style={{
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between'
    }}>
      <View style={styles.pickerItemContainer}>
        <Text style={styles.pickerText}>{t('Day')}</Text>
        <WheelPicker
          style={styles.pickerWheel}
          selectedItem={selectedDay}
          data={['-', ...daysFor(month, year)].map(i => i.toString())}
          onItemSelected={(selected: number) => {
            setSelectedDay(selected);
            setDay(selected);
            // console.log('d:', selected);
          }}
          selectedItemTextFontFamily=""
          itemTextFontFamily=""
          itemTextSize={PICKER_TEXT_SIZE}
          selectedItemTextSize={PICKER_TEXT_SIZE}
        />
      </View>

      <View style={styles.pickerItemContainer}>
        <Text style={styles.pickerText}>{t('Month')}</Text>
        <WheelPicker
          style={styles.pickerWheel}
          selectedItem={selectedMonth}
          data={['-', ...monthOptions].map(i => t(i))}
          onItemSelected={(selected: number) => {
            setSelectedMonth(selected);
            setMonth(selected);
            // console.log('m:', selected);
          }}
          selectedItemTextFontFamily=""
          itemTextFontFamily=""
          itemTextSize={PICKER_TEXT_SIZE}
          selectedItemTextSize={PICKER_TEXT_SIZE}
        />
      </View>

      <View style={styles.pickerItemContainer}>
        <Text style={styles.pickerText}>{t('Year')}</Text>
        <WheelPicker
          style={styles.pickerWheel}
          selectedItem={selectedYear}
          data={['-', ...yearOptions].map(i => i.toString())}
          onItemSelected={(selected: number) => {
            setSelectedYear(selected);
            setYear(yearOptions[selected - 1]);
            // console.log('y:', yearOptions[selected - 1]);
          }}
          selectedItemTextFontFamily=""
          itemTextFontFamily=""
          itemTextSize={PICKER_TEXT_SIZE}
          selectedItemTextSize={PICKER_TEXT_SIZE}
        />
      </View>
    </View>
  );

  return (
    <>
      {/* <View style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        // marginTop: 15
      }}> */}
      <View style={{
        // width: '70%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
      }}>
        <TextInput
          mode="outlined"
          style={{
            // borderColor: "gray",
            // borderWidth: 1,
            // borderRadius: 10,
            // padding: 10,
            flex: 1
          }} ref={dayRef} placeholder={t('Day')} keyboardType="numeric" maxLength={2}
          value={day?.toString()}
          onChangeText={(text) => {
            // console.log(`DAY CHANGED: |${text}| ${typeof text}`);
            setDay(parseInt(text, 10));
            if (text.length === 2) {
              monthRef?.current && (monthRef.current as any).focus();
            }
          }}></TextInput>
        <Text style={{ marginLeft: 5, marginRight: 5 }}>-</Text>
        <TextInput
          mode="outlined"
          style={{
            // borderColor: "gray",
            // borderWidth: 1,
            // borderRadius: 10,
            // padding: 10,
            flex: 1
          }}
          ref={monthRef}
          placeholder={t('Month')}
          keyboardType="numeric" maxLength={2}
          value={month?.toString()}
          onChangeText={(text) => {
            setMonth(parseInt(text, 10));

            if (text.length === 2) {
              yearRef?.current && (yearRef.current as any).focus();
            }
          }}></TextInput>
        <Text style={{ marginLeft: 5, marginRight: 5 }}>-</Text>
        <TextInput
          mode="outlined"
          style={{
            // borderColor: "gray",
            // borderWidth: 1,
            // borderRadius: 10,
            // padding: 10,
            flex: 1
          }}
          ref={yearRef}
          placeholder={t('Year')}
          keyboardType="numeric"
          maxLength={4}
          value={year?.toString()}
          onChangeText={(text) => {
            setYear(parseInt(text, 10));
          }}></TextInput>
      </View>
      {/* </View> */}

      {
        allFieldsSet() && (<HelperText type="error" visible={error !== null} >
          {t(error as string)}
        </HelperText>)
      }
    </>
  );
}
