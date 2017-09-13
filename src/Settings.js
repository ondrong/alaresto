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


export default class Settings extends Component {
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
                <Text style={{flex:1,textAlign:'center',textAlignVertical:'center',color:'#fff',fontSize:18}}>Menu</Text>
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
                        {/* <Text style={styles.sectionText}>Support</Text> */}
                        <TouchableOpacity style={styles.item}
                            onPress={()=>this.props.navigation.navigate('About')}>
                            <Text style={styles.itemText}>Tentang AlaResto</Text>
                        </TouchableOpacity>
                        {/* <TouchableOpacity style={styles.item}>
                            <Text style={styles.itemText}>Bantuan</Text>
                        </TouchableOpacity> */}
                        <TouchableOpacity style={styles.item}
                            onPress={()=>Linking.openURL('mailto:contact@pringstudio.com')}>
                            <Text style={styles.itemText}>Laporkan Masalah</Text>
                        </TouchableOpacity>
                    </View>
                        <Text style={styles.textVersion}>AlaResto v1.0</Text>
                    
                </ScrollView>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#f5f5f5',
    },
    section:{
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