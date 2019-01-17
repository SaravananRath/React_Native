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
  Image,
  ToastAndroid
} from 'react-native'

// import { Form, FormItem } from 'react-native-form-validation';
// import SendSMS from 'react-native-send-sms';

import Contact from './Contact.js'
import ImagePicker from 'react-native-image-picker'
var SmsAndroid = require('react-native-sms-android')
var obj = []
var obj7 = []
var flag = 1

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

  update = (
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
    this.setState({ [key]: value }, () => {
      console.log(`%c ----- ${consoleMsg} -----`, color)
      console.log(this.state[key])
    })
    console.log('\n')
  }

  // sendSMSFunction() {
  //   SendSMS.send(this.state.number, "Your contact has been added by Saravanan",
  //     (msg)=>{
  //       ToastAndroid.show(msg, ToastAndroid.SHORT);
  //     }
  //   );
  // }

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
        this.update('users', arr)
      })
    } catch (error) {
      alert(error)
    }
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
      this.checkData()

      for (var i = 0; i < obj7.length; i++) {
        if (obj7[i].name === obj.name && obj7[i].number === obj.number) {
          alert('Contact Exists')
          flag = 0
          break
        } else {
          flag = 1
        }
      }
      if (flag === 1) {
        AsyncStorage.setItem(newUser, JSON.stringify(obj))
        this.getContacts()
        // SmsAndroid.sms(
        //   this.state.number, // phone number to send sms to
        //   'Your Contact Added By Saravanan', // sms body
        //   'sendDirect', // sendDirect or sendIndirect
        //   (err, message) => {
        //     if (err){
        //       console.log("error");
        //     } else {
        //       console.log(message); // callback message
        //     }
        //   }
        // );
        this.setState({ name: '' })
        this.setState({ number: '' })
        this.setState({ image: null })
        this.setState({ id: this.state.id + 1 })

        // this.sendSMSFunction();
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
      returnData: this.returnData
    })
  }

  returnData = (name, number, image, index) => {
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

  checkData = async () => {
    try {
      AsyncStorage.getAllKeys((err, keys) => {
        obj7 = []
        AsyncStorage.multiGet(keys, (err, stores) => {
          stores.map((result, i, store) => {
            let key = store[i][0]
            let value = store[i][1]
            obj7.push(JSON.parse(store[i][1]))
          })
        })
      })
    } catch (error) {
      alert(error)
    }
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
        <ScrollView
          style={styles.scrollContainer}
          keyboardShouldPersistTaps="always"
        >
          {contact}
        </ScrollView>

        <View style={styles.footer}>
          <View style={styles.inphoto}>
            <View style={styles.ipbox}>
              <TextInput
                style={styles.textInput}
                onChangeText={name => this.setState({ name })}
                value={this.state.name}
                placeholder="Contact Name"
                placeholderTextColor="black"
                underlineColorAndroid="transparent"
              />

              <TextInput
                keyboardType="numeric"
                style={styles.textInput}
                onChangeText={number => this.setState({ number })}
                value={this.state.number}
                placeholder="Contact Number"
                placeholderTextColor="black"
                underlineColorAndroid="transparent"
                onSubmitEditing={this.addContact}
              />
            </View>

            <View style={styles.photo}>
              <TouchableOpacity onPress={this.selectPhotoTapped.bind(this)}>
                <View style={styles.ImageContainer}>
                  {this.state.image === null ? (
                    <Text>Select a Photo</Text>
                  ) : (
                    <Image
                      style={styles.ImageContainer}
                      source={this.state.image}
                    />
                  )}
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.addButton} onPress={this.addContact}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.broadButton}
          onPress={() => this.props.navigation.navigate('Broadcast')}
        >
          <Text style={styles.broadButtonText}>Broadcast</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.delButton} onPress={this.clearStorage}>
          <Text style={styles.delButtonText}>Del</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    // marginTop:40,
    backgroundColor: '#3fdbac',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 5,
    borderBottomColor: '#ddd'
  },
  headerText: {
    color: 'white',
    fontSize: 18,
    padding: 26
  },
  scrollContainer: {
    flex: 1,
    marginTop: 240,
    borderTopWidth: 10,
    borderTopColor: 'lightgrey'
    // marginBottom:50
  },
  footer: {
    position: 'absolute',
    top: 10,
    left: 0,
    right: 0,
    zIndex: 10
  },
  textInput: {
    alignSelf: 'stretch',
    color: 'black',
    padding: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 2,
    borderBottomColor: '#ededed'
  },
  addButton: {
    position: 'absolute',
    zIndex: 11,
    right: 10,
    bottom: 290,
    backgroundColor: '#3fdbac',
    width: 60,
    height: 60,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8
  },
  delButton: {
    position: 'absolute',
    zIndex: 11,
    left: 10,
    bottom: 290,
    backgroundColor: 'red',
    width: 60,
    height: 60,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8
  },
  broadButton: {
    position: 'absolute',
    zIndex: 11,
    left: 130,
    bottom: 290,
    backgroundColor: 'skyblue',
    // width:60,
    height: 60,
    // borderRadius:50,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8
  },
  broadButtonText: {
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
  },
  // photo:{
  //     flex: 1,
  //     justifyContent: 'center',
  //     alignItems: 'center',
  //     backgroundColor: '#FFF8E1',
  // },
  ImageContainer: {
    // borderRadius: 50,
    width: 100,
    height: 100,
    borderColor: 'black',
    borderWidth: 1 / PixelRatio.get(),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  inphoto: {
    flex: 1,
    flexDirection: 'row'
  },
  ipbox: {
    width: 230,
    marginLeft: 10,
    marginRight: 10
  }
})
