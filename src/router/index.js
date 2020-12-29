import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {Splash, MainMenu} from '../pages';
import {MyColors} from '../utils/colors';

const Stack = createStackNavigator();

const Router = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Splash"
        component={Splash}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="MainMenu"
        component={MainMenu}
        options={{
          title: 'To Do App',
          headerTitleAlign: 'center',
          headerTitleStyle: {fontWeight: 'bold', color: MyColors.White},
          headerStyle: {backgroundColor: MyColors.Blue},
        }}
      />
    </Stack.Navigator>
  );
};

export default Router;
