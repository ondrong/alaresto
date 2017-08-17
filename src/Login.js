import React, { Component } from 'react';
import {
  AppRegistry,
  AsyncStorage,
  Image,
  StyleSheet,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableNativeFeedback,
  View,
} from 'react-native';
import { LoginManager } from 'react-native-fbsdk';
import { NavigationActions } from 'react-navigation';

import Button from './lib/Button';

export default class Login extends Component {
  
  static navigationOptions = {
    header:null,
  };

   //facebook signin
    facebookSignIn(){
        LoginManager.logInWithReadPermissions(['public_profile','email','user_photos','user_birthday','user_hometown']).then((result)=>{
            if(result.isCancelled){
                console.log('Login was canceled');
            }
            else{
                console.log('berhasil login fb', result.grantedPermissions.toString());
                AsyncStorage.multiSet([
                    ['username', 'admin'],
                    ['usertype', 'facebook'],                    
                ]);

                this.goToMainMenu();
            }
        },(error)=>{
            console.log(error);
        })
    }

    //reset navigation to main menu
    goToMainMenu(){
        const actionToDispatch = NavigationActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({routeName: 'Main' })]
        })
        this.props.navigation.dispatch(actionToDispatch); 
    }

  render() {
    return (
        <View style={styles.container}>
            <StatusBar
                backgroundColor="white"
                barStyle="dark-content"/>
            
                <Image
                    style={{
                        height:100,
                        width:150,
                        resizeMode:'contain',
                        alignSelf:'center'
                    }}
                    source={require('./assets/logo.png')}
                />
            

            <TextInput style={styles.textInput}
                autoCorrect={false}
                underlineColorAndroid="transparent"
                placeholder="Email">
            </TextInput>

            <TextInput style={styles.textInput}
                autoCorrect={false}
                underlineColorAndroid="transparent"
                secureTextEntry={true}
                placeholder="Password">
            </TextInput>

            <Button label="MASUK"/>

            <Button label="MENDAFTAR"
                backgroundColor="#555"/>
            

            <Text style={{
                fontWeight:'bold', 
                textAlign:'center', 
                marginVertical:10 }}>Lupa password?</Text>
            <Text style={{
                /*fontWeight:'bold',*/
                color:'#aaa', 
                textAlign:'center'}}>Atau masuk dengan</Text>

            <View style={{
                flex:1,
                flexDirection:'row',
                alignSelf:'center'
            }}>
                <Button 
                    backgroundColor="#3B5998"
                    marginRight={10}
                    onPress={()=>{this.facebookSignIn()}}
                    label="FACEBOOK"/>

                <Button 
                    backgroundColor="#d34836"
                    label="GOOGLE"/>
            </View>
            
        </View>
    )
  }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        // alignContent:'center',
        // alignItems:'center',
        // justifyContent:'center',
        backgroundColor:'white',
        padding:40
    },
    btnPrimary:{
        alignItems:'center',
        backgroundColor:'#4caf50',
        borderRadius:10,
        marginVertical:10,
        padding:15,
    },
    btnPrimaryText:{
        color:'white',
        fontSize:14
    },
    textInput:{
        backgroundColor:'#eee',
        borderRadius:10,
        padding:10,
        marginTop:10,
        marginBottom:10,
        textAlign:'center',
    }
})