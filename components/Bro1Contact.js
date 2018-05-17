import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  PixelRatio,
  Image,
  TextInput,

}from 'react-native';

export default class Bro1Contact extends React.Component {
  render() {
    return (
    <View key={this.props.keyval} style={styles.note}>
      <View style={styles.content}>

      <View style={styles.textview}>
    		<Text style={styles.noteText}>{this.props.val.name}</Text>
    		<Text style={styles.noteText}>{this.props.val.number}</Text>
      </View>

    <View style={styles.buttonview}>

      <TouchableOpacity 
      onPress={this.props.textMethod}
      style={styles.noteUpdate}>
        <Text style={styles.noteUpdateText}>Send Text</Text>
      </TouchableOpacity>



      </View>
    	
      </View>
    </View>

   );
  }
}
 
 const styles = StyleSheet.create({

 	note:{
 		position:'relative',
 		padding:10,
 		paddingRight:100,
 		borderBottomWidth:1,
 		borderBottomColor:'#3fdbac',
 	},
 	noteText:{
 		// paddingLeft:20,
    fontSize:15,
    marginLeft:10,
 		// borderLeftWidth:10,
 		// borderLeftColor:'#E91E63'
    // backgroundColor:'green',
 	},
 	noteDelete:{
 		// position:'absolute',
 		justifyContent:'center',
 		alignItems:'center',
 		backgroundColor:'#2980B9',
 		padding:2,
    marginLeft:10,
    marginRight:10,
 		// top:10,
 		// bottom:10,
 		// right:10,
 	},
 	 noteUpdate:{
    marginBottom:20,
 		// position:'absolute',
 		justifyContent:'center',
 		alignItems:'center',
 		backgroundColor:'#2980B9',
 		padding:5,
    marginLeft:10,
    marginRight:10,
 		// top:10,
 		// bottom:10,
 		// right:60,
 	},
 	noteDeleteText:{
 		color:'white',
 	},
 	noteUpdateText:{
 		color:'white',
 	},
  ImageContainer: {
      borderRadius: 50,
      width: 50,
      height: 50,
      borderColor: '#9B9B9B',
      borderWidth: 1 / PixelRatio.get(),
      justifyContent: 'center',
      alignItems: 'center',
      // backgroundColor: '#3fdbdb',
},
   content:{
    flex:1,
    flexDirection:'row',
   },
   textview:{
    width:210,
   },
   buttonview:{
    width:100
   }
  //    photo:{
  //     flex: 1,
  //     justifyContent: 'center',
  //     alignItems: 'center',
  //     backgroundColor: '#FFF8E1'
  // },


 });

  // <Text style={styles.noteText}>{this.props.val.date}</Text>