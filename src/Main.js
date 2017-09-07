import React, { Component } from 'react';
import {
  Alert,
  AppRegistry,
  AsyncStorage,
  Image,
  StyleSheet,
  StatusBar,
  Text,
  TouchableOpacity,
  TouchableNativeFeedback,
  ListView,
  View
} from 'react-native';
import { LoginManager } from 'react-native-fbsdk';
import { NavigationActions } from 'react-navigation';

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
        <View style={{height:55,flexDirection:'row', backgroundColor:'#4caf50', elevation:2}}>
            <TouchableOpacity
                onPress={()=>{}}>
                <Image style={{flex:1, height:25, width:25, margin:15, resizeMode:'contain'}} source={require('./assets/ic_menu.png')}/>
            </TouchableOpacity>
            <Image style={{flex:1, height:25, marginVertical:15, resizeMode:'contain'}} source={require('./assets/logo-white.png')}/>
            <TouchableOpacity
                onPress={()=>{}}>
                <Image style={{flex:1, height:25, width:25, margin:15, resizeMode:'contain'}} source={require('./assets/ic_search.png')}/>
            </TouchableOpacity>
        </View>
        )
    }

    _renderLoc(){
        if(this.state.currentCity){           
            return(
                <View style={{flexDirection:'row',height:33}}>
                    <View style={{padding:5,marginLeft:5}}>
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
                        backgroundColor="#4caf50"
                        barStyle="light-content"/>
                    {this._renderHeader()}
                    <View style={{flex:1,backgroundColor:'#efefef'}}>
                        {this._renderLoc()}

                        <View style={{flexDirection:'row',padding:5}}>
                            
                            <View style={styles.card}>
                                <TouchableNativeFeedback
                                        onPress={()=>{this.props.navigation.navigate('Nearby')}}
                                        background={TouchableNativeFeedback.Ripple('#4caf5055', true)}>
                                    <View style={{alignItems:'center'}}>
                                            <Image style={styles.cardImage} source={require('./assets/main_nearby.png')}/>                                
                                            <Text style={styles.cardText}>Terdekat</Text>
                                    </View>
                                </TouchableNativeFeedback>
                            </View>

                            <View style={styles.card}>
                                <Image style={styles.cardImage} source={require('./assets/main_save.png')}/>                                
                                <Text style={styles.cardText}>Hemat</Text> 
                            </View>
                            <View style={styles.card}>
                                <Image style={styles.cardImage} source={require('./assets/main_fav.png')}/>                                
                                <Text style={styles.cardText}>Favorit</Text> 
                            </View>
                            <View style={styles.card}>
                                <Image style={styles.cardImage} source={require('./assets/main_open.png')}/>                                
                                <Text style={styles.cardText}>Buka</Text> 
                            </View>                            
                        </View>
                            {/* <Button
                            onPress={()=>{this.logout()}}
                            backgroundColor="#333"
                            label="KELUAR"/>   */}
                    </View>
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
    }
})