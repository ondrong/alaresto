import React, { Component } from 'react';
import {
  AppRegistry,
  AsyncStorage,
  Image,
  StyleSheet,
  StatusBar,
  Text,
  View
} from 'react-native';
import { NavigationActions } from 'react-navigation';

export default class Splashscreen extends Component {
    constructor(props){
        super(props);
        this.state = {
            appReady:false,
            isLoggedIn:false,
        }

        //timeout for splashscreen
        setTimeout(() => {
            this.setState({
                appReady:true,
            });
        }, 2000);
    }
  
    static navigationOptions = {
        header:null,
    };

    //check current logged user AsyncStorage
    componentWillMount(){
        AsyncStorage.multiGet(['username','usertype']).then((data)=>{
            if(data[0][1]){
                console.log('sudah ada data :', data);
                this.setState({
                    isLoggedIn: true,
                });
            }else{
                console.log('harus login..');
            }
        })
    }

    componentDidUpdate(){
        if(this.state.appReady){
            if(this.state.isLoggedIn){
                //go to Main menu
                const actionToDispatch = NavigationActions.reset({
                    index: 0,
                    actions: [NavigationActions.navigate({routeName: 'Main' })]
                })
                this.props.navigation.dispatch(actionToDispatch);
            }else{
                //go to login
                const actionToDispatch = NavigationActions.reset({
                    index: 0,
                    actions: [NavigationActions.navigate({routeName: 'Login' })]
                })
                this.props.navigation.dispatch(actionToDispatch);
            }
        }
    }
    
  render() {
    return (
        <View style={styles.container}>
            <StatusBar
                backgroundColor="#4caf50"
                barStyle="light-content"/>
            
            <Image
                style={{
                    height:150,
                    resizeMode:'contain',
                    alignSelf:'center'
                }}
                source={require('./assets/alaresto-splash.png')}
            />
        </View>
    )
  }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#4caf50',
        justifyContent:'center',
    }
})