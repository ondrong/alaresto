import React, { Component } from 'react';
import {
  AppRegistry,
  AsyncStorage,
  StyleSheet,
  StatusBar,
  Text,
  View
} from 'react-native';
import { LoginManager } from 'react-native-fbsdk';
import { NavigationActions } from 'react-navigation';

import Button from './lib/Button';

export default class Main extends Component {
  
  static navigationOptions = {
    header:null,
  };

    logout(){
        console.log('logout pressed..');

        //logout fb
        LoginManager.logOut();

        //logout google
        // GoogleSignin.signOut();
        // GoogleSignin.revokeAccess().then(() => GoogleSignin.signOut());

        AsyncStorage.multiRemove(['username','usertype']);

        //reset and go to login
        const actionToDispatch = NavigationActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({routeName: 'Login' })]
        })
        this.props.navigation.dispatch(actionToDispatch);
    }

  render() {
    return (
        <View style={styles.container}>
            <StatusBar
                backgroundColor="white"
                barStyle="dark-content"/>
            
            <View
                style={{
                    alignItems:'center',
                    justifyContent:'center'}}>
                
                <Button
                    onPress={()=>{this.logout()}}
                    backgroundColor="#333"
                    label="KELUAR"/>
            </View>
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