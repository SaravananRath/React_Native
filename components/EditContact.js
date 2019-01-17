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
  TouchableOpacity
} from 'react-native'
import ImagePicker from 'react-native-image-picker'

export default class EditContact extends React.Component {
  static navigationOptions = {
    title: 'Edit Contact'
  }

  constructor(props) {
    super(props)
    this.state = {
      name: '',
      number: '',
      ImageSource: null
    }
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
      console.log('Response = ', response)

      if (response.didCancel) {
        console.log('User cancelled photo picker')
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error)
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton)
      } else {
        let source = { uri: response.uri }

        this.setState({
          ImageSource: source
        })
      }
    })
  }

  render() {
    const { params } = this.props.navigation.state
    const name0 = params ? params.name : null
    const number0 = params ? params.number : null
    const image0 = params ? params.image : null
    const index = params ? params.index : null
    const { name, number, ImageSource } = this.state

    // this.state(name0,number0);

    return (
      <View style={styles.container}>
        <View style={styles.footer}>
          <TextInput
            style={styles.textInput}
            onChangeText={name => this.setState({ name })}
            defaultValue={name0}
            // value={this.state.name}
            placeholder={'name'}
            placeholderTextColor="black"
            underlineColorAndroid="transparent"
          />

          <TextInput
            keyboardType="numeric"
            style={styles.textInput}
            onChangeText={number => this.setState({ number })}
            defaultValue={number0}
            // value={this.state.number}
            placeholder={'number'}
            placeholderTextColor="black"
            underlineColorAndroid="transparent"
          />

          <View style={styles.photo}>
            <TouchableOpacity onPress={this.selectPhotoTapped.bind(this)}>
              <View style={styles.ImageContainer}>
                {ImageSource === null ? (
                  <Image style={styles.ImageContainer} source={image0} />
                ) : (
                  <Image style={styles.ImageContainer} source={ImageSource} />
                )}
              </View>
            </TouchableOpacity>
            <Text>Choose Photo</Text>
          </View>
        </View>
        <View style={styles.button1}>
          <Button
            color="lightgreen"
            title="Save"
            onPress={() => {
              params.returnData(
                name === '' ? name0 : name,
                number === '' ? number0 : number,
                this.state.ImageSource === null ? image0 : ImageSource,
                index
              )
              this.props.navigation.goBack()
            }}
          />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center'
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
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 2,
    borderBottomColor: '#ededed'
  },
  ImageContainer: {
    borderRadius: 50,
    // marginTop:10,
    // marginLeft:10,
    width: 100,
    height: 100,
    borderColor: 'black',
    // borderWidth: 1 / PixelRatio.get(),
    justifyContent: 'center',
    alignItems: 'center'
    // backgroundColor: '#3fdbdb',
  },
  button1: {
    marginTop: 300
  },
  button2: {
    marginTop: 60
  },
  photo: {
    marginTop: 10,
    marginLeft: 10
  }
})
