import React, { Fragment } from 'react';
import { Text, View } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { SafeAreaView } from 'react-native-safe-area-context';

const styles = EStyleSheet.create({
  headerSize: {
    height: '40rem'
  },
  title: {
    textAlign: 'center',
    fontSize: '18rem',
    fontWeight: 'bold'
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  innerContainer: {
    // height: 40,
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',

    position: 'absolute',
    top: 0,
    left: 0
  },
  buttonsContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});

export default function BaseHeader({ text, leftButton, rightButton, rightButtons, leftButtons }: any) {
  return (
    <SafeAreaView>
      <View style={[styles.headerSize, styles.container, {
        justifyContent: (!!leftButton || !!leftButtons) ? 'space-between' : 'flex-end',
      }]}>
        {!!text && (
          <View style={[styles.headerSize, styles.innerContainer]}>
            <Text style={styles.title}>{text}</Text>
          </View>
        )}
        {!!leftButton && leftButton}
        {!!leftButtons && (
          <View style={styles.buttonsContainer}>
            {leftButtons.map((btn: any, ix: number) => (
              <Fragment key={ix}>
                {btn}
              </Fragment>
            ))}
          </View>
        )}
        {!!rightButton && rightButton}
        {!!rightButtons && (
          <View style={styles.buttonsContainer}>
            {rightButtons.map((btn: any, ix: number) => (
              <Fragment key={ix}>
                {btn}
              </Fragment>
            ))}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
