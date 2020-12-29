import React, {useEffect} from 'react';
import {View, Text} from 'react-native';
import {MyColors} from '../../utils/colors';

const Splash = ({navigation}) => {
  useEffect(() => {
    setTimeout(() => {
      navigation.replace('MainMenu');
    }, 2000);
  });
  return (
    <View style={styles.wrapper.main}>
      <Text style={styles.text.title}>To Do App</Text>
    </View>
  );
};

export default Splash;

const styles = {
  wrapper: {
    main: {
      display: 'flex',
      backgroundColor: MyColors.White,
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  },
  text: {
    title: {color: MyColors.Blue, fontSize: 30, fontWeight: 'bold'},
  },
};
