import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, Alert, Button, ScrollView } from 'react-native';

// Screens to navigate to
import Start from './components/Start';
import Chat from './components/Chat';

import 'react-native-gesture-handler';

// Navigation containers for screen changes
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

/* create the navigator */
const Stack = createStackNavigator();

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { text: '' };
  }

/* React Native's Alert component method */
  // alertMyText (input = []) {
  //   Alert.alert(input.text);
  // }
  
  render() {
    return (
     /* The NavigationContainer is responsible for managing your app state and 
      linking your top-level navigator to the app environment. https://reactnavigation.org/docs/navigation-container/ */
     <NavigationContainer>
{/* below will set Screen1 as the default loaded screen when loading the app */}
        <Stack.Navigator
          initialRouteName='Start'
        >
{/* below defines each navigation screens name and component, to be used for other
methods, such as a onPress Button for Start to Chat */}          
          <Stack.Screen
            name='Start'
            component={Start}
          />
          <Stack.Screen
            name='Chat'
            component={Chat}
          />
        </Stack.Navigator>  
     </NavigationContainer>  
    );  
  }
}


/* sets styles much like css that can be applied where you choose with 'style={styles.object}' */
const styles = StyleSheet.create({

});
