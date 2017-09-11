import React, { Component } from 'react';
import {
  Alert,
  AppRegistry,
  AsyncStorage,
  FlatList,
  Image,
  Modal,
  StyleSheet,
  StatusBar,
  Text,
  TouchableOpacity,
  TouchableNativeFeedback,
  ListView,
  Linking,
  View
} from 'react-native';
import { LoginManager } from 'react-native-fbsdk';
import { NavigationActions } from 'react-navigation';
import * as axios from 'axios';
import CachedImage from 'react-native-cached-image';
import HeaderImageScrollView, { TriggeringView } from 'react-native-image-header-scroll-view';
//momentjs
const moment = require('moment');
const idLocale = require('moment/locale/id'); //for Indonesia locale
moment.locale('id', idLocale);

import Button from './lib/Button';
import { apikey } from './Config';

export default class RestoDetail extends Component {
    constructor(props){
        super(props);
        this.state = {
            isLoading:true,
            statusbarTransparent:true,
            photos:[],
            modalViewPhoto:false,
            currentPhoto:'',
        }
    
    }

    static navigationOptions = {
        header:null,
    }

    componentWillMount(){
        console.log(this.props.navigation.state.params.allprops)
        this.getDetail(this.props.navigation.state.params.placeid);
    }

    getDetail(placeid){
        return axios.get('https://maps.googleapis.com/maps/api/place/details/json',{
            params:{
                key:apikey,
                placeid:placeid,
                language:'id'
            }
        })
        .then((res)=>{
            this.setState({
                place: res.data.result,
                isLoading:false,
            })

            //ambil foto
            var photos = res.data.result.photos.map(async (item)=>{
                   item.url = await this.getPhoto(item.photo_reference);
                return item;
            });
            console.log(res);
            
            
            //perbaharui fotonya
            Promise.all(photos).then((x)=>{
                this.setState({
                    photos : x,
                });                            
            });
        })
        .catch((err)=>{console.log(err)});
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


    _renderHeader(){
        if(!this.state.statusbarTransparent){
            return(
                <View style={{height:55,flexDirection:'row', backgroundColor:'#4caf50'}}>
                    <TouchableOpacity
                        onPress={()=>{this.props.navigation.goBack()}}>
                        <Image style={{flex:1, height:25, width:25, margin:15, resizeMode:'contain'}} source={require('./assets/ic_left_arrow.png')}/>
                    </TouchableOpacity>
                    <Image style={{flex:1, height:25, marginVertical:15, resizeMode:'contain'}} source={require('./assets/logo-white.png')}/>
                    <View style={{height:25,width:25,margin:15}}/>
                </View>
            )
        }
    }


    render() {
        if(this.state.isLoading){
            return(
                <Text></Text>
            )
        }else{
            const data = this.props.navigation.state.params.allprops
            var open_now;
            var opening_hours;
            var phone_number;
            var reviews;
            
            if(this.state.place && this.state.place.opening_hours){
                opening_hours = this.state.place.opening_hours.weekday_text[new Date().getDay()-1];
                opening_hours = (
                    <View style={styles.placeDetailItem}>
                        <Image style={{width:20,height:20,marginRight:15}} source={require('./assets/ic_clock.png')}/>
                        <Text>{opening_hours}</Text>                                        
                    </View>
                )

                if(this.state.place.opening_hours.open_now){
                    open_now = (
                                <Text style={{color:'#3cce2f',textAlign:'center'}}>Buka</Text>
                    )
                }else{
                    open_now = (
                                <Text style={{color:'#ff3838', textAlign:'center'}}>Tutup</Text>
                    )
                }
            }

            if(this.state.place && this.state.place.formatted_phone_number){
                phone_number = (
                    <View style={styles.placeDetailItem}>
                        <Image style={{width:20,height:20,marginRight:15}} source={require('./assets/ic_phone.png')}/>
                        <Text selectable={true}>{this.state.place.formatted_phone_number || '---'}</Text>
                    </View>
                )
            }

            if(this.state.place && this.state.place.reviews){
                reviews = this.state.place.reviews.map((item,key)=> { 
                    return(
                    <View key={key}
                        style={{marginVertical:12}}>
                        <View style={{flexDirection:'row'}}>
                            <CachedImage style={{width:30,height:30, marginRight:10}} source={{uri:item.profile_photo_url}}/>
                            <Text style={{fontWeight:'bold',textAlignVertical:'center'}}>{item.author_name}</Text>
                            <Text style={{color:'#aaa', fontSize:12, flex:1,textAlign:'right', textAlignVertical:'center'}}>{moment(new Date(item.time * 1000)).format("ll")}</Text>
                        </View>
                        <Text style={{fontSize:12,marginVertical:3}}>{'⭐️'.repeat(item.rating)}</Text>
                        <Text style={{fontSize:14,color:'#000'}}>{item.text}</Text>
                    </View>
                )})
            }
            

            return(
                <View style={{flex:1}}>
                    <StatusBar 
                        translucent={ true }
                        backgroundColor={ this.state.statusbarTransparent ? 'rgba(0,0,0,0)' : '#4caf50'}/>

                    {/* { this._renderHeader() } */}

                    <HeaderImageScrollView
                        maxHeight={200}
                        minHeight={70}
                        maxOverlayOpacity={0}
                        renderHeader={() => {
                            if(!this.state.statusbarTransparent){
                                return(<View style={{backgroundColor:'#4caf50', flex:1}}/>)
                            }else{
                                return(<CachedImage source={{uri: data.photo}} style={{flex:1}} />
                                )
                            }
                        }}
                        renderFixedForeground={()=>{
                            var title = this.state.statusbarTransparent ? '' : this.state.place.name ;
                            if(title.length > 24) title = title.substring(0,23)+'..';
                                return(
                                    <Text style={{flex:1, color:'#fff', textAlign:'center', fontWeight:'bold',fontSize:18, marginTop:35}}>{title}</Text>                            
                                )
                        }}
                        renderTouchableFixedForeground={()=>(
                            <TouchableOpacity style={{marginTop:20}}
                                onPress={()=>{this.props.navigation.goBack()}}>
                                <Image style={{height:20, width:20, margin:17, resizeMode:'contain'}} source={require('./assets/ic_left_arrow.png')}/>
                            </TouchableOpacity>
                        )}
                        fadeOutForeground={true}
                        >

                        <TriggeringView 
                                onBeginHidden={() => this.setState({statusbarTransparent:false})} 
                                onBeginDisplayed={() => this.setState({statusbarTransparent:true})}/>

                        <View style={{minHeight:450}}>
                                <View style={{paddingVertical:8}}>
                                    <Text style={{color:'black', textAlign:'center', fontWeight:'bold',fontSize:18, marginBottom:5}}>{this.state.place.name || data.name}</Text>
                                    <Text style={{textAlign:'center', marginBottom:5}}>{'⭐️'.repeat(this.state.place.rating||0)}</Text>
                                    {/* <Text style={{textAlign:'center', fontSize:12, marginBottom:10}}>{this.state.place.formatted_address}</Text> */}

                                    {open_now}
                                    <TouchableOpacity style={styles.placeDetailItem}
                                        onPress={()=>Linking.openURL(this.state.place.url)}>
                                        <Image style={{width:20,height:20,marginRight:15}} source={require('./assets/ic_loc.png')}/>
                                        <Text>{this.state.place.formatted_address}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={()=>Linking.openURL('tel:'+this.state.place.formatted_phone_number)}>
                                        {phone_number}
                                    </TouchableOpacity>
                                    {opening_hours}
                                    
                                </View>

                                <View style={{padding:15,borderTopWidth:1,borderTopColor:'#ddd'}}>
                                    <Text style={{fontWeight:'bold',marginVertical:10,color:'black',fontSize:18}}>Foto</Text>
                                    <FlatList
                                        horizontal={true}
                                        data={this.state.photos}
                                        keyExtractor={(item,index) => index}
                                        renderItem={({item}) => (
                                            <TouchableOpacity onPress={()=>this.setState({currentPhoto:item.url,modalViewPhoto:true,statusbarTransparent:false})}>
                                                <CachedImage 
                                                    style={{width:100,height:100,marginRight:5}} 
                                                    source={{uri:item.url}}/>
                                            </TouchableOpacity>
                                            ) }
                                        />
                                    <Modal
                                        animationType="fade"
                                        transparent={true}
                                        visible={this.state.modalViewPhoto}
                                        onRequestClose={() => this.setState({modalViewPhoto:false})}
                                        >
                                        <View style={{flex:1,backgroundColor:'rgba(0,0,0,0.9)',justifyContent:'center'}}>
                                            <CachedImage
                                                style={{height:400}}
                                                source={{uri:this.state.currentPhoto}}
                                            />
                                        </View>
                                    </Modal>
                                </View>

                                <View style={{padding:15}}>
                                    <Text style={{fontWeight:'bold',marginVertical:10,color:'black',fontSize:18}}>Ulasan</Text>
                                    {reviews}
                                </View>
                        </View>
                    </HeaderImageScrollView>
                </View>
            )
        }
    }
}


const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'white',
    },
    card:{
        flex:1,
        height:90,
        flexDirection:'column',
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'white',
        elevation:1.5,
        borderRadius:3,
        margin:3,
        padding:5,
    },
    cardImage:{
        flex:1, 
        margin:5, 
        resizeMode:'contain'
    },
    cardText: {
        color:'#555',
        marginVertical:3,
    },
    statusOpen:{
        backgroundColor:'#bbb',
        paddingHorizontal:5,
        justifyContent:'space-between',
        borderRadius:3
    },
    placeDetailItem:{
        flexDirection:'row',
        paddingVertical:15,
        paddingHorizontal:15,
        // marginVertical:5,
        // borderTopWidth:1,
        //borderBottomWidth:1,
        // borderColor:'#ddd',
    },
})