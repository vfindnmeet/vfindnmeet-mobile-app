import * as React from 'react';
import { Text, View } from 'react-native';
import { Appbar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

// const CustomHeader = () => {
//   const _goBack = () => console.log('Went back');

//   const _handleSearch = () => console.log('Searching');

//   const _handleMore = () => console.log('Shown more');

//   return (
//     <Appbar.Header style={{
//       backgroundColor: '#fff',
//       borderBottomColor: '#fff'
//     }}>
//       <Appbar.BackAction onPress={_goBack} />
//       <Appbar.Content title="Title" subtitle="Subtitle" />
//       <Appbar.Action icon="magnify" onPress={_handleSearch} />
//       <Appbar.Action icon="dots-vertical" onPress={_handleMore} />
//     </Appbar.Header>
//   );
// };

// export default CustomHeader;

export default function CustomHeader() {
  return (
    <SafeAreaView>
      <View style={{
        height: 40,
        display: 'flex',
        justifyContent: 'center'
      }}>
        <Text style={{ textAlign: 'center' }}>App name</Text>
      </View>
    </SafeAreaView>
  );
}
