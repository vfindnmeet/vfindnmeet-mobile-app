import React from "react";
import { TouchableWithoutFeedback, View } from "react-native";
import { RadioButton, Text } from "react-native-paper";

const CRadioButton = React.memo(({ value, label, checked, onCheck }: { value: string, label: string, checked: boolean, onCheck: () => void }) => {
  return (
    <TouchableWithoutFeedback
      onPress={onCheck}
    >
      <View style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
      }}>
        <RadioButton
          value={value}
          status={checked ? 'checked' : 'unchecked'}
          onPress={onCheck}
        />
        <Text>{label}</Text>
      </View>
    </TouchableWithoutFeedback>
  );
});

export default CRadioButton;
