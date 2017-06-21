import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default class Login extends Component {
  
  static navigationOptions = {
    header:null,
  };

  _onLogin() {
      this.props.navigation.navigate('Main')
  }

  render() {
    return (
        <View style={styles.container}>
            <StatusBar
                backgroundColor="white"
                barStyle="dark-content"/>
            
            <Text style={{
                color:'#4caf50',
                textAlign:'center',
                fontWeight:'bold',
                fontStyle:'italic',
                fontSize:34,
                marginBottom:30, }}>
                Ala Resto</Text>

            <TextInput style={styles.textInput}
                autoCorrect={false}
                underlineColorAndroid="transparent">
            </TextInput>

            <TextInput style={styles.textInput}
                autoCorrect={false}
                underlineColorAndroid="transparent">
            </TextInput>

            <TouchableOpacity style={styles.btnPrimary} onPress={this._onLogin.bind(this)}>
                <Text style={styles.btnPrimaryText}>LOG IN</Text>                
            </TouchableOpacity>

            <Text style={{fontWeight:'bold', textAlign:'center', marginBottom:30 }}>Forget Password?</Text>

            <TouchableOpacity style={styles.btnPrimary}>
                <Text style={styles.btnPrimaryText}>CONNECT WITH FACEBOOK</Text>                
            </TouchableOpacity>
            
        </View>
    )
  }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        // alignContent:'center',
        // alignItems:'center',
        justifyContent:'center',
        backgroundColor:'white',
        padding:60
    },
    btnPrimary:{
        alignItems:'center',
        backgroundColor:'#4caf50',
        borderRadius:30,
        marginTop:10,
        marginBottom:10,
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