import React from 'react';
import { StyleSheet, 
          Text, 
          View
        } from 'react-native';
import { StackNavigator } from 'react-navigation';
import Home from './components/Home.js';
import About from './components/About.js';
import ImagePickerProject from './components/Photo.js';
import Broadcast from './components/Broadcast.js'



const RootStack = StackNavigator(
{
  
    Home:{
    screen:Home,
         },
    About:{
    screen:About,
          },
    Broadcast:{
      screen:Broadcast,
    }
},
{
  initialRouteName:'Home',
}

);


export default class App extends React.Component{
  render(){
    return <RootStack />;
    
  }
}
// import React from 'react';
// import { StyleSheet, 
//           Text, 
//           View
//         } from 'react-native';
// import { StackNavigator } from 'react-navigation';
// import Home from './components/Home.js';
// import About from './components/About.js';



// const RootStack = StackNavigator(
// {
  
//     Home:{
//     screen:Home,
//          },
//     About:{
//     screen:About,
//           },
// },
// {
//   initialRouteName:'Home',
// }

// );


// export default class App extends React.Component{
//   render(){
//     return <RootStack />;
    
//   }
// }