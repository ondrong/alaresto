import React, { Component } from 'react';
import {
  Alert,
  AppRegistry,
  AsyncStorage,
  FlatList,
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
            searchlog: []
        }   
    }

    static navigationOptions = {
        header:null,
    }

    componentWillMount(){
        AsyncStorage.multiGet(['searchlog']).then((data)=>{
            if(data[0][1]){
                console.log('log search:', data);
                this.setState({
                    searchlog: JSON.parse(data[0][1]).slice(0,5)
                });
            }else{
                console.log('no search log');
            }
        })
    }

    search(){
        if(this.state.search){ 
            var newlog = [this.state.search];
            var logs = newlog.concat(this.state.searchlog); //merge new with last
            AsyncStorage.multiSet([['searchlog',JSON.stringify(logs)]]);
            console.log('search log set: ',newlog,'from:',this.state.searchlog);
            this.props.navigation.navigate('SearchResult',{params:{keyword:this.state.search}})
        }
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
                        style={{flex:1,backgroundColor:'#fff',marginVertical:8,borderRadius:3,elevation:1,textAlignVertical:'center',textDecorationLine:'none',color:'#555'}}
                        onChangeText={(text)=>this.setState({search:text})}
                        value={this.state.search}
                        onSubmitEditing={()=>{this.search()}}
                        />
                </View>
                {/* <View style={{height:25,width:25,margin:17}}/> */}
                <TouchableOpacity
                    onPress={()=>{this.search()}}>
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
                <View style={styles.section}>
                    {/* <TouchableOpacity onPress={()=>AsyncStorage.multiRemove(['searchlog'])}>
                        <Text>Remove AsyncStorage</Text>
                    </TouchableOpacity> */}
                    <Text style={styles.sectionText}>Riwayat Kata Kunci</Text>
                    <FlatList
                        data={this.state.searchlog}
                        keyExtractor={(item,index)=>index}
                        renderItem={({item})=>(
                            <TouchableOpacity 
                                style={styles.item}
                                onPress={()=>{
                                    this.props.navigation.navigate('SearchResult',{params:{keyword:item}})                                    
                                }}>
                                <Text style={styles.itemText}>{item}</Text>
                            </TouchableOpacity>
                        )}
                    />
                </View>
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
        color:'#4caf50',
        marginVertical:10,
        marginLeft:15,
        fontSize:11,
        // fontWeight:'bold'
    },
    item:{
       paddingVertical:10,
       paddingLeft:15,
       backgroundColor:'#fff'
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