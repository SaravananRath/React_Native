import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  AsyncStorage,
  PixelRatio,
  Image
} from 'react-native'

import Contact from './Contact.js'
import ImagePicker from 'react-native-image-picker'
var SmsAndroid = require('react-native-sms-android')
var obj = []

export default class Main extends React.Component {
  static navigationOptions = {
    title: 'Contacts App'
  }
  componentDidMount() {
    this.getContacts()
    this.getIdIndex()
  }
  constructor(props) {
    super(props)
    ;(this.state = {
      name: '',
      number: '',
      id: 0,
      valid: true,
      image: {
        uri:
          'file:///storage/emulated/0/Android/data/com.people/files/Pictures/image-eccb6297-7314-449f-8249-91b4969df833.jpg'
      },
      users: []
    }),
      (this.baseState = this.state)
  }

  update = async (
    key,
    value,
    consoleMsg = `${key} value updated`,
    color = `color:green;font-weight:bold;`
  ) => {
    console.log(
      `%c ----- Previous State -----`,
      `color:orange;font-weight:bold`
    )
    console.log(this.state[key])
    await this.setState({ [key]: value }, () => {
      console.log(`%c ----- ${consoleMsg} -----`, color)
      console.log(this.state[key])
    })
    console.log('\n')
  }

  selectPhotoTapped() {
    const options = {
      quality: 1.0,
      maxWidth: 100,
      maxHeight: 100,
      storageOptions: {
        skipBackup: true
      }
    }
    ImagePicker.showImagePicker(options, response => {
      // console.log('Response = ', response)

      if (response.didCancel) {
        // console.log('User cancelled photo picker')
      } else if (response.error) {
        // console.log('ImagePicker Error: ', response.error)
      } else if (response.customButton) {
        // console.log('User tapped custom button: ', response.customButton)
      } else {
        let source = { uri: response.uri }
        console.log({ source })
        this.setState({
          image: source
        })
      }
    })
  }
  validate(name, number, image) {
    if (
      name &&
      /^[A-Za-z\s]+$/.test(name) &&
      (number && /^[0-9]+$/.test(number)) &&
      image
    )
      return true
    return false
  }

  getUserIds = async () => {
    try {
      let userIds = await AsyncStorage.getAllKeys((err, key) => {
        if (err) console.log(err)
        return key
      })
      return userIds
    } catch (error) {
      console.error
    }
  }

  getContacts = async () => {
    try {
      let keys = await this.getUserIds()
      obj2 = []
      AsyncStorage.multiGet(keys, (err, cb) => {
        if (err) console.error
        let arr = cb.map((result, i, user) => {
          let userId = user[i][0]
          let userData = JSON.parse(user[i][1])
          return {
            userId,
            userData
          }
        })
        this.update('users', arr, `User details Fetched`)
      })
    } catch (error) {
      alert(error)
    }
  }
  sendSms() {
    const { number } = this.state
    SmsAndroid.sms(
      number, // phone number to send sms to
      'Your Contact Added By Saravanan', // sms body
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
  addContact = () => {
    const { name, number, image, id } = this.state
    if (this.validate(name, number, image)) {
      obj = {
        id,
        name,
        number,
        image
      }
      var newUser = 'user' + this.state.id
      let numbers = this.state.users.reduce((a, c) => {
        a[c.userId] = c.userData.number
        return a
      }, {})
      if (Object.values(numbers).includes(number)) alert('Contact Exists')
      else {
        AsyncStorage.setItem(newUser, JSON.stringify(obj))
        // this.sendSms()
        let users = [...this.state.users, { userId: newUser, userData: obj }]
        this.update('users', users, `User added`)
        this.setState({ name: '', number: '', id: this.state.id + 1 })
      }
    } else {
      alert('Invalid inputs')
    }
  }
  getIdIndex = async () => {
    try {
      let consoleMsg = `Next Id Value Fetched`
      let ids = await this.getUserIds()
      let index = ids.length
        ? parseInt(ids[ids.length - 1].toString().substring(4))
        : 0
      this.update('id', index + 1, consoleMsg)
    } catch (error) {
      console.log(error)
    }
  }

  deleteContact(index) {
    const { users } = this.state
    var userId = this.state.users[index].userId
    users.splice(index, 1)
    AsyncStorage.removeItem(userId)
    this.update('users', users)
  }

  updateContact(index) {
    const { name, number, image } = this.state.users[index].userData
    this.props.navigation.navigate('EditContact', {
      name,
      number,
      image,
      index,
      updateData: this.updateData
    })
  }

  updateData = (name, number, image, index) => {
    console.log(index)
    const { userId, userData } = this.state.users[index]
    userData.name = name
    userData.number = number
    userData.image = image
    AsyncStorage.mergeItem(
      userId,
      JSON.stringify({
        name,
        number,
        image
      }),
      () => {
        this.setState({ userData })
      }
    )
  }

  clearStorage = () => {
    const { image } = this.baseState
    let consoleMsg = `All users deleted`,
      color = `color:red;font-weight:bold`
    AsyncStorage.clear()
    this.update('users', [], consoleMsg, color)
    this.update('state', this.baseState, `state value reset`)
    this.update('image', image)
  }

  render() {
    let contact = this.state.users.map(({ userData }, key) => {
      return (
        <Contact
          key={key}
          keyval={key}
          val={userData}
          deleteMethod={() => this.deleteContact(key)}
          editMethod={() => this.updateContact(key)}
          edit={this.state.edit}
          saveMethod={() => this.saveContact(key)}
        />
      )
    })

    return (
      <View style={styles.container}>
        <View style={styles.input}>
          <View style={styles.input_text}>
            <TextInput
              style={styles.input_textStyle}
              onChangeText={name => this.setState({ name })}
              value={this.state.name}
              placeholder="Contact Name"
              placeholderTextColor="black"
              underlineColorAndroid="transparent"
            />

            <TextInput
              keyboardType="numeric"
              style={styles.input_textStyle}
              onChangeText={number => this.setState({ number })}
              value={this.state.number}
              placeholder="Contact Number"
              placeholderTextColor="black"
              underlineColorAndroid="transparent"
              onSubmitEditing={this.addContact}
            />
          </View>

          <View style={styles.input_photo}>
            <TouchableOpacity onPress={this.selectPhotoTapped.bind(this)}>
              {this.state.image === null ? (
                <Text>Select a Photo</Text>
              ) : (
                <Image
                  style={styles.input_imageStyle}
                  source={this.state.image}
                />
              )}
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.button}>
          <TouchableOpacity
            style={styles.button_del}
            onPress={this.clearStorage}
          >
            <Text style={styles.delButtonText}>Del</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button_bdcast}
            onPress={() => this.props.navigation.navigate('Broadcast')}
          >
            <Text style={styles.broadButtonText}>Broadcast</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button_add} onPress={this.addContact}>
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.scrollView}>
          <ScrollView keyboardShouldPersistTaps="always">
            <Text style={{ fontSize: 100 }}>Scroll me plz</Text>
            <Text style={{ fontSize: 100 }}>Scroll me plz</Text>
          </ScrollView>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'lightgrey',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  input: {
    backgroundColor: 'green',
    flex: 0.3,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  button: {
    backgroundColor: 'yellow',
    flex: 0.15,
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  scrollView: {
    backgroundColor: 'orange',
    flex: 0.45
    // borderTopWidth: 10,
    // borderTopColor: 'grey'
    // marginBottom:50
  },
  input_text: {
    flex: 0.6,
    backgroundColor: 'green'
  },
  input_photo: {
    flex: 0.3,
    justifyContent: 'center'
  },
  input_textStyle: {
    color: 'black',
    backgroundColor: '#fff'
  },
  input_imageStyle: {
    maxWidth: 100,
    height: 80,
    borderColor: 'black',
    borderWidth: 1 / PixelRatio.get(),
    backgroundColor: '#fff'
  },
  button_add: {
    zIndex: 11,
    right: 10,
    backgroundColor: '#3fdbac',
    width: 50,
    height: 50,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8
  },
  button_del: {
    zIndex: 11,
    left: 10,
    backgroundColor: 'red',
    width: 50,
    height: 50,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8
  },
  button_bdcast: {
    zIndex: 11,
    backgroundColor: 'skyblue',
    // width:60,
    height: 50,
    // borderRadius:50,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8
  },
  button_bdcastText: {
    color: '#fff',
    fontSize: 15,
    padding: 5
  },
  addButtonText: {
    color: '#fff',
    fontSize: 30
  },

  addPhotoText: {
    color: '#fff',
    fontSize: 10
  },
  delButtonText: {
    color: '#fff',
    fontSize: 15
  }
})
