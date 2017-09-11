import React, { Component } from 'react';
import {
  ActivityIndicator,
  Alert,
  AppRegistry,
  AsyncStorage,
  Dimensions,
  FlatList,
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
import * as axios from 'axios';

import Button from './lib/Button';

const {height, width} = Dimensions.get('screen');
import { apikey } from './Config';

export default class SearchResult extends Component {

    constructor(props){
        super(props);
        this.state = {
            isLoadData:true,
            data: [],
            nextPageToken:''
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
                this.getPlaces(this.props.navigation.state.params.params);                
            },
            (error) => this.setState({ error: error.message }),
            { enableHighAccuracy: false, timeout: 20000, maximumAge: 1000 },
        );
    }


    static navigationOptions = {
        header:null,
    };

    getPlaces(params){
        return fetch('https://maps.googleapis.com/maps/api/place/nearbysearch/json?location='+this.state.latitude+','+this.state.longitude+
                        '&radius=1000&'+params.opennow+
                        '&type=restaurant&language=id&key='+apikey,{
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

                        //isi list view dulu                        
                        this.setState({
                            data: data.results,
                            nextPageToken: data.next_page_token,
                            isLoadData:false,
                        });

                        //ambil foto
                        var datas = data.results.map(async (item)=>{
                            if(item.photos){
                               item.photo = await this.getPhoto(item.photos[0].photo_reference);
                            }
                            return item;
                        })
                        console.log(data);

                        //perbaharui listview dengan fotonya
                        Promise.all(datas).then((x)=>{
                            this.setState({
                                data : x,
                                // dataSource: ds.cloneWithRows(x)
                            });                            
                        });
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
            // console.log(ref);
            return axios.get('https://maps.googleapis.com/maps/api/place/photo',{
                params:{
                    key:apikey,
                    photoreference:ref,
                    maxwidth:400,
                }
            })
            .then((res)=>{
                // return await Promise.resolve(res.url);
                // res.json().then((data)=>{
                    // console.log(res)
                // })
                // console.log(res.request.responseURL);
                return res.request.responseURL;
                //   return Promise.resolve(res.url);
            })
            .catch((err)=>{console.log(err)});
    }

    loadMorePlaces(token){
        if(token){
            return fetch('https://maps.googleapis.com/maps/api/place/nearbysearch/json?pagetoken='+token+'&key='+apikey,{
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

                        // //isi list view dulu                        
                        // this.setState({
                        //     data: [...this.state.data, ...data.results],
                        //     nextPageToken: data.next_page_token
                        // });

                        // //ambil foto
                        var datas = data.results.map(async (item)=>{
                            if(item.photos){
                               item.photo = await this.getPhoto(item.photos[0].photo_reference);
                            }
                            return item;
                        })
                        // console.log(data);

                        // perbaharui listview dengan fotonya
                        Promise.all(datas).then((x)=>{
                            this.setState({
                                data : [...this.state.data,...x],
                                nextPageToken: data.next_page_token
                            });                            
                        });
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
    }

    _renderHeader(){
        return(
            <View style={{height:55,flexDirection:'row', backgroundColor:'#4caf50', marginTop:20}}>
                <TouchableOpacity
                    onPress={()=>{this.props.navigation.goBack()}}>
                    <Image style={{flex:1, height:25, width:25, margin:17, resizeMode:'contain'}} source={require('./assets/ic_left_arrow.png')}/>
                </TouchableOpacity>
                <Image style={{flex:1, height:25, marginVertical:15, resizeMode:'contain'}} source={require('./assets/logo-white.png')}/>
                <TouchableOpacity
                    onPress={()=>{}}>
                    <Image style={{flex:1, height:25, width:25, margin:17, resizeMode:'contain'}} source={require('./assets/ic_search.png')}/>
                </TouchableOpacity>
            </View>
        )
    }

    _renderLoadData(){
        if(this.state.isLoadData){
            return(
                <ActivityIndicator/>
            )
        }
    }

    render(){

            return (
                <View style={styles.container}>
                    <StatusBar
                        translucent={true}
                        backgroundColor="#4caf50"
                        barStyle="light-content"/>

                    {this._renderHeader()}

                    <View
                        style={{
                            flex:1,
                            backgroundColor:'white',
                            }}>

                            <FlatList
                                style={{flex:1,paddingVertical:5}}
                                data={this.state.data}
                                keyExtractor={(item) => item.id}
                                renderItem={({item})=>(
                                    <Row {...item} navigation={this.props.navigation}/>
                                )}
                                onEndReached={()=>{this.loadMorePlaces(this.state.nextPageToken)}}
                                onEndReachedThreshold={5}
                                refreshing={this.state.isLoadData}
                                onRefresh={()=>console.log('refreshing..')}
                                />
                            {/* {this._renderLoadData()} */}
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
                    <Text style={{fontWeight:'bold', color:'#fff', textShadowColor:'#333', textShadowOffset:{width:1,height:1}}}>{this.props.name}</Text>   
                    <Text style={{color:'#fff'}}>{this.props.vicinity}</Text> 
                    {open_now}
                </View>
            </CachedImage>
        )
        
    }
  
    render(){
        return(
            <View >
                <TouchableNativeFeedback
                    onPress={()=>{this.props.navigation.navigate('RestoDetail',{placeid:this.props.place_id, allprops:this.props})}}
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
