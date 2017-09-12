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
  ListView,
  View
} from 'react-native';
import { LoginManager } from 'react-native-fbsdk';
import { NavigationActions } from 'react-navigation';
import CachedImage from 'react-native-cached-image';

import Button from './lib/Button';


export default class Main extends Component {
    constructor(props){
        super(props);
        this.state = {
            // isLoading:true,
            currentCity:'',
        }

        // get current position
        navigator.geolocation.getCurrentPosition(
            (position) => {
                // console.log(position);
                this.setState({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                });
                this.getCurrentCity();                
            },
            (error) => this.setState({ error: error.message }),
            { enableHighAccuracy: false, timeout: 20000, maximumAge: 1000 },
        );    
    }


    static navigationOptions = {
        header:null,
    }

    getCurrentCity(){
        return fetch('https://maps.googleapis.com/maps/api/geocode/json?latlng='+this.state.latitude+','+this.state.longitude+'&key=AIzaSyDO5xCbAvSGh-ObrO2_PSOjY4Xb3UJPbNA',{
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
                    // console.log(data);
                    var city = data.results.map((item,index)=>{
                        if(item.types[0]=='locality'){
                            this.setState({
                                currentCity:item.address_components[0].long_name,
                            });
                            // console.log(item);
                        }
                    });
                })
            }
            else{
                response.json().then((error)=>{
                    console.log(error);                    
                })
                Alert.alert(
                    'Lokasi Error',
                    'Tidak dapat memuat lokasi saat ini',
                    [{text:'OK'},]
                )
            }
        })
        .catch((error) => {
            console.log(error);
        });
    }


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


    _renderHeader(){
        return(
            <View style={{height:55,flexDirection:'row', backgroundColor:'#4caf50', marginTop:20}}>
                <TouchableOpacity
                    onPress={()=>{this.props.navigation.navigate('Settings')}}>
                    <Image style={{flex:1, height:25, width:25, margin:15, resizeMode:'contain'}} source={require('./assets/ic_menu.png')}/>
                </TouchableOpacity>
                <Image style={{flex:1, height:25, marginVertical:15, resizeMode:'contain'}} source={require('./assets/logo-white.png')}/>
                <TouchableOpacity
                    onPress={()=>{this.props.navigation.navigate('Search')}}>
                    <Image style={{flex:1, height:25, width:25, margin:17, resizeMode:'contain'}} source={require('./assets/ic_search.png')}/>
                </TouchableOpacity>
            </View>
        )
    }

    _renderLoc(){
        if(this.state.currentCity){           
            return(
                <View style={{flexDirection:'row',height:33}}>
                    <View style={{padding:5}}>
                        <Image style={{flex:1,width:33, resizeMode:'contain'}} source={require('./assets/ic_loc.png')}/>
                    </View>
                    <Text style={{marginVertical:5,color:'#777'}}>{this.state.currentCity}</Text>                        
                </View>
            )
        }
    }

    render() {
        if(this.state.isLoading){
            return(
                <Text>Loading</Text>
            )
        }else{
            return (
                <View style={styles.container}>
                    <StatusBar
                        translucent={true}
                        backgroundColor="#4caf50"
                        barStyle="light-content"/>
                    {this._renderHeader()}
                    <ScrollView>
                        <CachedImage style={{height:180}} source={{uri:'https://preview.ibb.co/esRHmv/Banner_Ala_Resto.jpg'}}/>                    
                        <View style={{flex:1,backgroundColor:'#f5f5f5',padding:5}}>
                            {this._renderLoc()}

                            <View style={{flexDirection:'row',height:100}}>
                                
                                <View style={styles.card}>
                                    <TouchableNativeFeedback
                                            onPress={()=>{this.props.navigation.navigate('SearchResult',{params:{}})}}
                                            background={TouchableNativeFeedback.Ripple('#4caf5055', true)}>
                                        <View style={{alignItems:'center'}}>
                                                <Image style={styles.cardImage} source={require('./assets/main_nearby.png')}/>                                
                                                <Text style={styles.cardText}>Disekitar</Text>
                                        </View>
                                    </TouchableNativeFeedback>
                                </View>

                                {/* <View style={styles.card}>
                                    <Image style={styles.cardImage} source={require('./assets/main_save.png')}/>                                
                                    <Text style={styles.cardText}>Hemat</Text> 
                                </View>
                                <View style={styles.card}>
                                    <Image style={styles.cardImage} source={require('./assets/main_fav.png')}/>                                
                                    <Text style={styles.cardText}>Favorit</Text> 
                                </View> */}

                                <View style={styles.card}>
                                    <TouchableNativeFeedback
                                            onPress={()=>{
                                                this.props.navigation.navigate('SearchResult',{
                                                        params:{
                                                            opennow:'opennow',
                                                        }
                                                    })
                                            }}
                                            background={TouchableNativeFeedback.Ripple('#4caf5055', true)}>
                                        <View style={{alignItems:'center'}}>
                                                <Image style={styles.cardImage} source={require('./assets/main_open.png')}/>                                
                                                <Text style={styles.cardText}>Sedang Buka</Text>
                                        </View>
                                    </TouchableNativeFeedback>
                                </View>                            
                            </View>
                            
                            <Text style={styles.textSectionTitle}>Kategori</Text>
                            
                            <View style={styles.kategoriRow}>
                                <View style={styles.card2}>
                                    <TouchableNativeFeedback
                                    onPress={()=>{
                                                this.props.navigation.navigate('SearchResult',{
                                                        params:{
                                                            keyword:'lesehan'
                                                        }
                                                    })
                                            }}
                                            background={TouchableNativeFeedback.Ripple('#ffffffaa', true)}
                                            useForeground={true}>
                                        <View style={{flex:1}}>
                                                <CachedImage style={{borderRadius:5,flex:1}} source={{uri:'https://image.ibb.co/hqh9Ya/foody_mobile_bh_1200x800_jpg_693_636041028475399863.jpg'}}>
                                                    <View style={styles.rowListTint}>
                                                        <Text style={{flex:1,fontWeight:'bold', color:'#fff',textAlignVertical:'center',textAlign:'center'}}>Lesehan & Pecel Lele</Text>   
                                                    </View>
                                                </CachedImage>                                
                                        </View>
                                    </TouchableNativeFeedback>
                                </View>
                                <View style={styles.card2}>
                                    <TouchableNativeFeedback
                                            onPress={()=>{
                                                this.props.navigation.navigate('SearchResult',{
                                                        params:{
                                                            keyword:'bakso+mie+ayam',
                                                        }
                                                    })
                                            }}
                                            background={TouchableNativeFeedback.Ripple('#ffffffaa', true)}
                                            useForeground={true}>
                                        <View style={{flex:1}}>
                                                <CachedImage style={{borderRadius:5,flex:1}} source={{uri:'https://preview.ibb.co/bPPdRv/bakso.jpg'}}>
                                                    <View style={styles.rowListTint}>
                                                        <Text style={{flex:1,fontWeight:'bold', color:'#fff',textAlignVertical:'center',textAlign:'center'}}>Bakso & Mie Ayam</Text>   
                                                    </View>
                                                </CachedImage>                                
                                        </View>
                                    </TouchableNativeFeedback>
                                </View>       
                            </View>

                            <View style={styles.kategoriRow}>
                                <View style={styles.card2}>
                                    <TouchableNativeFeedback
                                            onPress={()=>{
                                                this.props.navigation.navigate('SearchResult',{
                                                        params:{
                                                            keyword:'angkringan',
                                                        }
                                                    })
                                            }}
                                            background={TouchableNativeFeedback.Ripple('#ffffffaa', true)}
                                            useForeground={true}>
                                        <View style={{flex:1}}>
                                                <CachedImage style={{borderRadius:5,flex:1}} source={{uri:'https://preview.ibb.co/bACF6v/angkringan_lek_man.jpg'}}>
                                                    <View style={styles.rowListTint}>
                                                        <Text style={{flex:1,fontWeight:'bold', color:'#fff',textAlignVertical:'center',textAlign:'center'}}>Angkringan</Text>   
                                                    </View>
                                                </CachedImage>                                
                                        </View>
                                    </TouchableNativeFeedback>
                                </View>
                                <View style={styles.card2}>
                                    <TouchableNativeFeedback
                                            onPress={()=>{
                                                this.props.navigation.navigate('SearchResult',{
                                                        params:{
                                                            keyword:'nasi',
                                                        }
                                                    })
                                            }}
                                            background={TouchableNativeFeedback.Ripple('#ffffffaa', true)}
                                            useForeground={true}>
                                        <View style={{flex:1}}>
                                                <CachedImage style={{borderRadius:5,flex:1}} source={{uri:'https://preview.ibb.co/mAq2mv/nasi_lemak.jpg'}}>
                                                    <View style={styles.rowListTint}>
                                                        <Text style={{flex:1,fontWeight:'bold', color:'#fff',textAlignVertical:'center',textAlign:'center'}}>Aneka Nasi</Text>   
                                                    </View>
                                                </CachedImage>                                
                                        </View>
                                    </TouchableNativeFeedback>
                                </View>       
                            </View>

                            <View style={styles.kategoriRow}>
                                <View style={styles.card2}>
                                    <TouchableNativeFeedback
                                            onPress={()=>{
                                                this.props.navigation.navigate('SearchResult',{
                                                        params:{
                                                            keyword:'Pizza',
                                                        }
                                                    })
                                            }}
                                            background={TouchableNativeFeedback.Ripple('#ffffffaa', true)}
                                            useForeground={true}>
                                        <View style={{flex:1}}>
                                                <CachedImage style={{borderRadius:5,flex:1}} source={{uri:'https://preview.ibb.co/icUHKF/pep_pizza.jpg'}}>
                                                    <View style={styles.rowListTint}>
                                                        <Text style={{flex:1,fontWeight:'bold', color:'#fff',textAlignVertical:'center',textAlign:'center'}}>Pizza & Steak</Text>   
                                                    </View>
                                                </CachedImage>                                
                                        </View>
                                    </TouchableNativeFeedback>
                                </View>
                                <View style={styles.card2}>
                                    <TouchableNativeFeedback
                                            onPress={()=>{
                                                this.props.navigation.navigate('SearchResult',{
                                                        params:{
                                                            keyword:'cafe',
                                                        }
                                                    })
                                            }}
                                            background={TouchableNativeFeedback.Ripple('#ffffffaa', true)}
                                            useForeground={true}>
                                        <View style={{flex:1}}>
                                                <CachedImage style={{borderRadius:5,flex:1}} source={{uri:'https://preview.ibb.co/kBkeYa/main_course_brick_cafe_jogja.jpg'}}>
                                                    <View style={styles.rowListTint}>
                                                        <Text style={{flex:1,fontWeight:'bold', color:'#fff',textAlignVertical:'center',textAlign:'center'}}>Kafe</Text>   
                                                    </View>
                                                </CachedImage>                                
                                        </View>
                                    </TouchableNativeFeedback>
                                </View>       
                            </View>
                        

                        </View>
                    </ScrollView>
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
        // height:90,
        borderRadius:5,
        flexDirection:'column',
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'white',
        elevation:1.5,
        borderRadius:3,
        margin:5,
        padding:5,
    },
    card2:{
        flex:1,
        borderRadius:5,
        backgroundColor:'white',
        elevation:1.5,
        borderRadius:5,
        margin:5,
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
    rowListTint:{
        flex:1, borderRadius:0, backgroundColor:'rgba(0,0,0,0.4)'
    },
    textSectionTitle:{
        marginTop:10,
        marginLeft:5,
        fontSize:16,
        color:'black'
    },
    kategoriRow:{flexDirection:'row',height:80},
})