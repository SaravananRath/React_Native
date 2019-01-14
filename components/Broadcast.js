import React from 'react'
import {
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  AsyncStorage,
  Image,
  PixelRatio,
  TouchableOpacity,
  ScrollView
} from 'react-native'
import BroContact from './BroContact.js'
import Bro1Contact from './Bro1Contact.js'
var SmsAndroid = require('react-native-sms-android')

var obj10 = []
var obj11 = []
var obj12 = []
var obj13 = []
var numarr = []
var namarr = []
var grparr = []
var num = []
var nam = []

export default class Broadcast extends React.Component {
  static navigationOptions = {
    title: 'Groups'
  }

  constructor(props) {
    super(props)
    this.state = {
      contactArray: [this.getData()],
      screen: true,
      name: '',
      numbers: [],
      groupNames: [this.getNumbers()],
      id: this.getIdIndex(),
      text: ''
    }
  }

  handleCreate = () => {
    numarr = []
    this.setState({ contactArray: [this.getData()] })
    this.setState({ screen: false })
  }

  render() {
    let names = this.state.groupNames.map((val, key) => {
      return (
        <Bro1Contact
          key={key}
          keyval={key}
          val={val}
          textMethod={() => this.sendText(key)}
          textInput={() => this.handleText()}
          // edit={this.state.edit}
          // saveMethod={()=>this.saveContact(key)}
        />
      )
    })
    let contact = this.state.contactArray.map((val, key) => {
      return (
        <BroContact
          key={key}
          keyval={key}
          val={val}
          addMethod={() => this.addContact(key)}
          // edit={this.state.edit}
          // saveMethod={()=>this.saveContact(key)}
        />
      )
    })

    return (
      <View>
        <View style={this.state.screen ? styles.showList : styles.hideList}>
          <View style={styles.button}>
            <Button title=" + Create Group" onPress={this.handleCreate} />
            <TextInput
              style={styles.textInput}
              onChangeText={text => this.setState({ text })}
              // value={this.state.name}
              placeholder="Message"
              placeholderTextColor="black"
              underlineColorAndroid="transparent"
            />
          </View>
          <ScrollView keyboardShouldPersistTaps="always">{names}</ScrollView>
        </View>

        <View style={this.state.screen ? styles.hideList : styles.showList}>
          <TextInput
            style={styles.textInput}
            onChangeText={name => this.setState({ name })}
            value={this.state.name}
            placeholder="Group Name"
            placeholderTextColor="black"
            underlineColorAndroid="transparent"
          />

          <ScrollView keyboardShouldPersistTaps="always">{contact}</ScrollView>

          <Button title="Click" onPress={this.handleClick} />
        </View>
      </View>
    )
  }

  getData = async () => {
    try {
      AsyncStorage.getAllKeys((err, keys) => {
        obj10 = []
        AsyncStorage.multiGet(keys, (err, stores) => {
          stores.map((result, i, store) => {
            let key = store[i][0]
            let value = store[i][1]
            var str = key
            var result = str.match(/user/g)
            if (result) {
              obj10.push(JSON.parse(store[i][1]))
            }
          })

          this.setState({ contactArray: obj10 })
        })
      })
    } catch (error) {
      alert(error)
    }
  }

  getNumbers = async () => {
    try {
      AsyncStorage.getAllKeys((err, keys) => {
        obj13 = []
        AsyncStorage.multiGet(keys, (err, stores) => {
          stores.map((result, i, store) => {
            let key = store[i][0]
            let value = store[i][1]
            var str = key
            var result = str.match(/Group/g)
            if (result) {
              obj13.push(JSON.parse(store[i][1]))
            }
          })

          this.setState({ groupNames: obj13 })
        })
      })
    } catch (error) {
      alert(error)
    }
  }

  getIdIndex = async () => {
    try {
      AsyncStorage.getAllKeys((err, keys) => {
        obj12 = []
        AsyncStorage.multiGet(keys, (err, stores) => {
          stores.map((result, i, store) => {
            let key = store[i][0]
            let value = store[i][1]
            var str = key
            var result = str.match(/Group/g)
            if (result) {
              obj12.push(JSON.parse(store[i][1]))
            }
          })
          if (obj12.length != 0) {
            this.setState({ id: obj12[obj12.length - 1].id + 1 })
          } else {
            this.setState({ id: 0 })
          }
        })
      })
    } catch (error) {
      alert(error)
    }
  }
  sendText(key) {
    var array = this.state.groupNames[key].numbers
    // alert(array);
    for (var i = 0; i < array.length; i++) {
      SmsAndroid.sms(
        array[i], // phone number to send sms to
        this.state.text, // sms body
        'sendDirect', // sendDirect or sendIndirect
        (err, message) => {
          if (err) {
            console.log('error')
          } else {
            console.log(message) // callback message
          }
        }
      )
    }
  }
  addContact = key => {
    if (this.state.name && /^[A-Za-z\s]+$/.test(this.state.name)) {
      var arr = this.state.contactArray
      num = arr[key].number
      // nam = arr[key].name;
      numarr.push(num)
      this.setState({ numbers: numarr })
      arr.splice(key, 1)
      this.setState({ contactArray: arr })
    }
  }

  handleClick = () => {
    nam = this.state.name
    // grparr.push(nam);
    var key = 'Group' + this.state.id
    var obj = {
      name: nam,
      key: key,
      id: this.state.id,
      numbers: this.state.numbers
    }
    grparr.push(obj)
    this.setState({ groupNames: grparr })
    alert(obj.numbers)
    AsyncStorage.setItem(key, JSON.stringify(obj))
    numarr = []
    this.setState({ screen: true })
    this.setState({ id: this.state.id + 1 })
  }

  printContact() {
    return this.state.contactArray.map(function(contact, i) {
      return (
        <TouchableOpacity key={i} style={styles.contact}>
          <View key={i}>
            <View>
              <Text style={styles.contactText}>{contact.name}</Text>
              <Text style={styles.contactText}>{contact.number}</Text>
            </View>
          </View>
        </TouchableOpacity>
      )
    })
  }
}

const styles = StyleSheet.create({
  header: {
    // flex:1,
    // justifyContent:'center',
    backgroundColor: 'green',
    padding: 5
  },
  textInput: {
    alignSelf: 'stretch',
    color: 'black',
    padding: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 2,
    borderBottomColor: '#ededed'
  },
  contact: {
    position: 'relative',
    padding: 10,
    paddingRight: 100,
    borderBottomWidth: 1,
    borderBottomColor: '#3fdbac'
  },
  contactText: {
    paddingLeft: 20,
    fontSize: 15,
    marginLeft: 10
    // borderLeftWidth:10,
    // borderLeftColor:'#E91E63'
    // backgroundColor:'green',
  },
  button: {
    marginLeft: 50,
    marginRight: 50,
    marginTop: 20,
    marginBottom: 10
  },
  hideList: {
    display: 'none'
  },
  showList: {}

  //   scrollContainer:{
  //   flex:1,
  //   marginTop:240,
  //   borderTopWidth:10,
  //   borderTopColor:'lightgrey',
  // }
})
