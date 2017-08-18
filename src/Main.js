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
  ListView,
  View
} from 'react-native';
import { LoginManager } from 'react-native-fbsdk';
import { NavigationActions } from 'react-navigation';

import Button from './lib/Button';

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

export default class Main extends Component {
  constructor(props){
    super(props);
    this.state = {
        isLoading:false,
        dataSource: ds.cloneWithRows([]),
    }

    //get current position
        navigator.geolocation.getCurrentPosition(
            (position) => {
                console.log(position);
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
      return fetch('https://maps.googleapis.com/maps/api/place/nearbysearch/json?location='+this.state.latitude+','+this.state.longitude+'&radius=500&type=restaurant&key=AIzaSyAAlaQYRh76IHjDOl88x9TQO1DGnlEyCI8',{
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
                    this.setState({
                        dataSource: this.state.dataSource.cloneWithRows(data.results),
                        isLoading: false,                                                                        
                    });
                    console.log(this.state.dataSource);
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
                <TouchableOpacity style={{marginVertical:10,padding:7}}
                    onPress={()=>{}}>
                    <Image style={{flex:1, resizeMode:'contain'}} source={require('./assets/ic_menu.png')}/>
                </TouchableOpacity>
                <View style={{flex:1, marginVertical:15}}>
                    {/* <Text style={{fontWeight:'bold', fontSize:16, textAlign:'center',color:'white'}}>alaResto</Text> */}
                    <Image style={{flex:1, resizeMode:'contain', alignSelf:'center'}} source={require('./assets/logo-white.png')}/>
                </View>
                <TouchableOpacity style={{marginVertical:10,padding:5}}
                    onPress={()=>{}}>
                    <Image style={{flex:1, resizeMode:'contain'}} source={require('./assets/ic_search.png')}/>
                </TouchableOpacity>
            </View>
        )
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

                <View
                    style={{
                        flex:1,
                        backgroundColor:'white'}}>
                    
                    <ListView
                            enableEmptySections={true}
                            dataSource={this.state.dataSource}
                            renderRow={(data) => <Row {...data} navigation={this.props.navigation} />}
                            
                        />

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

class Row extends Component{
    constructor(){
    super();
  }


  
  render(){
    return(
          <TouchableOpacity>
              <View style={{flex:1,padding:10, flexDirection:'column'}}>
                  <Text style={{fontWeight:'bold'}}>{this.props.name}</Text>   
                  <Text>{this.props.vicinity}</Text>   
              </View>      
          </TouchableOpacity>
    ) 
  }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'white',
    }
})