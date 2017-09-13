import React, { Component } from 'react';
import {
  Alert,
  AppRegistry,
  AsyncStorage,
  Image,
  StyleSheet,
  StatusBar,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableNativeFeedback,
  Linking,
  ListView,
  View
} from 'react-native';
import { LoginManager } from 'react-native-fbsdk';
import { NavigationActions } from 'react-navigation';
import CachedImage from 'react-native-cached-image';

import Button from './lib/Button';


export default class About extends Component {
    constructor(props){
        super(props);
        this.state = {
        }   
    }


    static navigationOptions = {
        header:null,
    }

    _renderHeader(){
        return(
            <View style={{height:55,flexDirection:'row', backgroundColor:'#4caf50',marginTop:20}}>
                <TouchableOpacity
                    onPress={()=>{this.props.navigation.goBack()}}>
                    <Image style={{flex:1, height:25, width:25, margin:17, resizeMode:'contain'}} source={require('./assets/ic_left_arrow.png')}/>
                </TouchableOpacity>
                <Text style={{flex:1,textAlign:'center',textAlignVertical:'center',color:'#fff',fontSize:18}}>Tentang Aplikasi</Text>
                {/* <Image style={{flex:1, height:25, marginVertical:15, resizeMode:'contain'}} source={require('./assets/logo-white.png')}/> */}
                <View style={{height:25,width:25,margin:17}}/>
            </View>
        )
    }


    render() {
        return (
            <View style={styles.container}>
                <StatusBar
                    translucent={true}
                    backgroundColor="#4caf50"
                    barStyle="light-content"/>
                {this._renderHeader()}
                <ScrollView>
                    <View style={styles.section}>
                        <Image source={require('./assets/logo.png')} style={{width:150,height:100,resizeMode:'contain',alignSelf:'center',margin:10}}/>
                        <Text>AlaResto adalah aplikasi kuliner lokal terbaik di Indonesia.</Text>
                        <Text style={{marginTop:10}}>
                            Jelajahi tempat kuliner dan berbagai macam makanan lezat di sekitar anda.
                        </Text>
                    </View>                    
                </ScrollView>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#fff',
    },
    section:{
        flex:1,
        padding:20,
        backgroundColor:'#fff',
    },
    sectionText:{
        color:'green',
        margin:15,
        fontSize:12,
        fontWeight:'bold'
    },
    item:{
       paddingVertical:15,paddingLeft:15,backgroundColor:'#fff',borderBottomWidth:1,borderBottomColor:'#e5e5e5'
    },
    itemText:{
        color:'#333',
    },
    textVersion:{
        textAlign:'center',
        paddingVertical:10,
        color:'#999'
    }
})