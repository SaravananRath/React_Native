import React, { Component } from 'react'
import { StackNavigator } from 'react-navigation'
import { Home, EditContact, Broadcast } from './components'

const RootStack = StackNavigator(
  {
    Home: {
      screen: Home
    },
    EditContact: {
      screen: EditContact
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
