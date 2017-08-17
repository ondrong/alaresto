import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TouchableNativeFeedback,
  View,
} from 'react-native';

export default class Button extends Component {
  
  render(){
    return(
      <View 
        borderRadius={10}
        marginVertical={10}
        marginLeft={this.props.marginLeft}
        marginRight={this.props.marginRight}
        >
        <TouchableNativeFeedback
            onPress={this.props.onPress}
            background={TouchableNativeFeedback.Ripple('#ffffff77', true)}>
            <View 
                style={styles.btnPrimary}
                backgroundColor={this.props.backgroundColor ? this.props.backgroundColor : '#4caf50'}
                >
                <Text style={styles.btnPrimaryText}>{this.props.label}</Text>                                    
            </View>
        </TouchableNativeFeedback>
      </View>
    )
  }

 }

 const styles = StyleSheet.create({
    btnContainer:{
        borderRadius:10,
        marginVertical:10
    },
    btnPrimary:{
        alignItems:'center',
        backgroundColor:'#4caf50',
        borderRadius:10,
        padding:15,
    },
    btnPrimaryText:{
        color:'white',
        fontSize:14
    },
})