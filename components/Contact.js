import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  PixelRatio,
  Image,

}from 'react-native';

export default class Contact extends React.Component {

  render() {
    return (
    <View key={this.props.keyval} style={styles.note}>
      <View style={styles.content}>
      <View style={styles.photoview}>
    		<View style ={styles.photo}>
        <Image style= {styles.ImageContainer} source ={this.props.val.image}/>
        </View>
      </View>

      <View style={styles.textview}>
    		<Text style={styles.noteText}>{this.props.val.name}</Text>
    		<Text style={styles.noteText}>{this.props.val.number}</Text>
      </View>

    <View style={styles.buttonview}>

      <TouchableOpacity 
      onPress={this.props.editMethod}
      style={styles.noteUpdate}>
        <Text style={styles.noteUpdateText}>Edit</Text>
        </TouchableOpacity>

    	<TouchableOpacity 
    	onPress={this.props.deleteMethod}
    	style={styles.noteDelete}>
    		<Text style={styles.noteDeleteText}>Del</Text>
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
 		paddingLeft:20,
    fontSize:20,
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
 		padding:8,
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
 		padding:8,
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
      width: 100,
      height: 100,
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
   photoview:{
    width:100,
   },
   textview:{
    width:150,
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