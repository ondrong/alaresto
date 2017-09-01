import React, { Component } from 'react';
import { AppRegistry } from 'react-native';
import { StackNavigator } from 'react-navigation';

import { Navigator } from './src/Navigator';

class App extends React.Component {
    render() {
      return (
        <Navigator onNavigationStateChange={null} />
      );
    }
  }  

AppRegistry.registerComponent('alaResto', () => App);
