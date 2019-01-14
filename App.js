import React, { Component } from 'react'
import { StackNavigator } from 'react-navigation'
import { Home, About, Broadcast } from './components'

const RootStack = StackNavigator(
  {
    Home: {
      screen: Home
    },
    About: {
      screen: About
    },
    Broadcast: {
      screen: Broadcast
    }
  },
  {
    initialRouteName: 'Home'
  }
)

export default class App extends Component {
  render() {
    return <RootStack />
  }
}
