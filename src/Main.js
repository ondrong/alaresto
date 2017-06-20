import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  StatusBar,
  Text,
  View
} from 'react-native';

export default class Main extends Component {
  
  static navigationOptions = {
    header:null,
  };

  render() {
    return (
        <View style={styles.container}>
            <StatusBar
                backgroundColor="white"
                barStyle="dark-content"/>
            
            <Text>Hello, Navigation!</Text>
        </View>
    )
  }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'white',
    }
})