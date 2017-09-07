import React, { Component } from 'react';
import {
  Alert,
  AppRegistry,
  AsyncStorage,
  Dimensions,
  Image,
  StyleSheet,
  StatusBar,
  Text,
  TouchableOpacity,
  ToastAndroid,
  TouchableNativeFeedback,
  ListView,
  View
} from 'react-native';
import { NavigationActions } from 'react-navigation';
import CachedImage from 'react-native-cached-image';

import Button from './lib/Button';

const {height, width} = Dimensions.get('screen');
const apikey = 'AIzaSyAAlaQYRh76IHjDOl88x9TQO1DGnlEyCI8';
const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

export default class Nearby extends Component {

    constructor(props){
        super(props);
        this.state = {
            dataSource: ds.cloneWithRows([]),
        }

        //get current position
        navigator.geolocation.getCurrentPosition(
            (position) => {
                // console.log(position);
                this.setState({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    // posReady: true,
                    error: null,
                });
                this.getPlaces();                
            },
            (error) => this.setState({ error: error.message }),
            { enableHighAccuracy: false, timeout: 20000, maximumAge: 1000 },
        );
    }


    static navigationOptions = {
        header:null,
    };

    componentDidMount(){
    }

    getPlaces(){
        return fetch('https://maps.googleapis.com/maps/api/place/nearbysearch/json?location='+this.state.latitude+','+this.state.longitude+'&radius=500&type=restaurant&key='+apikey,{
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            })
            .then((response) => {
                // console.log(response);
                if(response.ok){
                    response.json().then((data)=>{
                        console.log(data);
                        var datas = data.results.map(async (item)=>{
                            if(item.photos){
                                var photo = await this.getPhoto(item.photos[0].photo_reference);
                                // console.log(item.photos[0].photo_reference);
                            }
                            return item;                     
                        });
                        
                        this.setState({dataSource: ds.cloneWithRows(data.results)});
                        console.log(data.results);                    

                        //resolve promise
                        // Promise.all(datas).then((x)=>{
                        //     console.log(x)
                        //     this.setState({dataSource: ds.cloneWithRows(x)});                            
                        // })

                    })
                }
                else{
                    response.json().then((error)=>{
                        console.log(error);                    
                    })
                    Alert.alert(
                        'Gagal',
                        'Silahkan ulangi',
                        [{text:'OK'},]
                    )
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }

    //get photo when get places
   getPhoto(ref){
        return fetch('https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference='+ref+'&key='+apikey,{
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }).then(async (res)=>{
            return await Promise.resolve(res.url);
            //   console.log(res.url);
        }).catch((err)=>{console.log(err)});
    }

    _renderHeader(){
        return(
            <View style={{height:55,flexDirection:'row', backgroundColor:'#4caf50'}}>
                <TouchableOpacity
                    onPress={()=>{this.props.navigation.goBack()}}>
                    <Image style={{flex:1, height:25, width:25, margin:15, resizeMode:'contain'}} source={require('./assets/ic_left_arrow.png')}/>
                </TouchableOpacity>
                <Image style={{flex:1, height:25, marginVertical:15, resizeMode:'contain'}} source={require('./assets/logo-white.png')}/>
                <TouchableOpacity
                    onPress={()=>{}}>
                    <Image style={{flex:1, height:25, width:25, margin:15, resizeMode:'contain'}} source={require('./assets/ic_search.png')}/>
                </TouchableOpacity>
            </View>
        )
    }

    render() {
            return (
                <View style={styles.container}>
                    <StatusBar
                        backgroundColor="#4caf50"
                        barStyle="light-content"/>
                    {this._renderHeader()}

                    <View
                        style={{
                            flex:1,
                            backgroundColor:'white',}}>
                        
                        <ListView
                            enableEmptySections={true}
                            paddingTop={5}
                            dataSource={this.state.dataSource}
                            renderRow={(data) => <Row {...data} navigation={this.props.navigation} />}  
                            onEndReached={() => console.log('mencapai batas bawah listview')}
                            />
                    </View>
                </View>
            )
    }
        
}


class Row extends Component{
    constructor(props){
        super(props);
        this.state = {
            deviceWidth : Dimensions.get('screen').width - 10,
        }

        Dimensions.addEventListener('change', () => {
            this.setState({
                deviceWidth : Dimensions.get('screen').width - 10
            })
        }); 
    }

    _renderCachedImage(){
        var open_now;        
        if(this.props.opening_hours){
            if(this.props.opening_hours.open_now){
                open_now = (
                    <View style={{flexDirection:'row',justifyContent:'flex-end'}}>
                        <View style={[styles.statusOpen,{backgroundColor:'#5fd867', paddingHorizontal:10}]}>
                            <Text style={{fontSize:10,color:'#000'}}>BUKA</Text>
                        </View>
                    </View>
                )
            }else{
                open_now = (
                    <View style={{flexDirection:'row',justifyContent:'flex-end'}}>
                        <View style={styles.statusOpen}>
                            <Text style={{fontSize:10,color:'#000'}}>TUTUP</Text>
                        </View>
                    </View>
                )
            }
        }

        
        return(
            <CachedImage
                source={{
                    uri: this.props.photo
                }}
                borderRadius={5}
                style={{flex:1, height:120,borderRadius:5}}>
                <View style={styles.rowListTint}>
                    <Text style={{fontWeight:'bold', color:'#fff', textShadowColor:'#333', textShadowOffset:{width:1,height:1}}}>{this.props.name.toString()}</Text>   
                    <Text style={{color:'#fff'}}>{this.props.vicinity.toString()}</Text> 
                    {open_now}
                </View>
            </CachedImage>
        )
        
    }
  
    render(){
        return(
            <View >
                <TouchableNativeFeedback
                    onPress={()=>{}}
                    background={TouchableNativeFeedback.Ripple('#ffffffff',true)}
                    useForeground={true}>
                    <View style={{flex:1, flexDirection:'column', borderRadius:5, marginBottom:5, marginHorizontal:5, elevation:2}}>
                        { this._renderCachedImage() }
                    </View>      
                </TouchableNativeFeedback>
            </View>
        ) 
    }
}

Row.defaultProps ={
    photo: 'https://preview.ibb.co/hVJ8jF/bg_resto.png',
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'white',
    },
    rowListTint:{
        flex:1, borderRadius:5, backgroundColor:'rgba(0,0,0,0.4)',padding:10, justifyContent:'flex-end'
    },
    statusOpen:{
        backgroundColor:'#bbb',
        paddingHorizontal:5,
        justifyContent:'space-between',
        borderRadius:3
    }
})
