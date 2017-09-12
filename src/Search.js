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
  TextInput,
  TouchableOpacity,
  TouchableNativeFeedback,
  ListView,
  View
} from 'react-native';
import { LoginManager } from 'react-native-fbsdk';
import { NavigationActions } from 'react-navigation';
import CachedImage from 'react-native-cached-image';

import Button from './lib/Button';
import { randomfood } from './lib/RandomFood';


export default class Search extends Component {
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
                <View style={{flex:1}}>
                    <TextInput 
                        underlineColorAndroid="transparent"
                        autoFocus={true}
                        autoCapitalize="none"
                        autoCorrect={false}
                        placeholder={"Cari, misal: "+randomfood}
                        onTouchCancel={()=>this.props.navigation.goBack()}
                        style={{flex:1,backgroundColor:'#fff',marginVertical:10,borderRadius:3,elevation:1,textAlignVertical:'center',textDecorationLine:'none',color:'#555'}}
                        onChangeText={(text)=>this.setState({search:text})}
                        value={this.state.search}
                        onSubmitEditing={()=>this.props.navigation.navigate('SearchResult',{params:{keyword:this.state.search}})}
                        />
                </View>
                {/* <View style={{height:25,width:25,margin:17}}/> */}
                <TouchableOpacity
                    onPress={()=>{
                            if(this.state.search) this.props.navigation.navigate('SearchResult',{params:{keyword:this.state.search}})}
                        }>
                    <Image style={{flex:1, height:25, width:25, margin:17, resizeMode:'contain'}} source={require('./assets/ic_search.png')}/>
                </TouchableOpacity>
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