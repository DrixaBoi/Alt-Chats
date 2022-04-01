import React from "react";
import PropTypes from "prop-types";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import * as Permissions from 'expo-permissions';
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';


export default class CustomActions extends React.Component {
  
    // options so user can pick an image to send
  pickImage = async () => {
    //asking for permission to access the users images.
    const { status } = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);
    try {
        //if access granted call launchImageLibraryAsync using ImagePicker API
      if (status === 'granted') {
        let result = await ImagePicker.launchImageLibraryAsync({
            // picks what media choice user has, image, visio, or all.
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
        }).catch((error) => {
          console.error(error);
        });
        // if cancelled will not change current state
        if (!result.cancelled) {
          const imageUrl = await this.uploadImage(result.uri);
          this.props.onSend({ image: imageUrl });
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  // allows user to take a new photo with their device camera
  takePhoto = async () => {
    // permission to access users device camera
    const { status } = await Permissions.askAsync(Permissions.CAMERA, Permissions.MEDIA_LIBRARY_WRITE_ONLY);
    try {
      if (status === 'granted') {
          // calls users camera to take a new photo to send
        let result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images
        }).catch((error) => {
          console.error(error);
        });
        if (!result.cancelled) {
          const imageUrl = await this.uploadImage(result.uri);
          this.props.onSend({ image: imageUrl });
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  // allows user to send their current location through their device
  getLocation = async () => {
    // asks user permission
    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    try {
      if (status === 'granted') {
          // calls getCurrentPositionAsync to read users current location
        let result = await Location.getCurrentPositionAsync({})
        .catch(error => {
            console.error(error);
          }
        );
        // sends a map of location with long and lat coords
        if (result) {
          this.props.onSend({
            location: {
              longitude: result.coords.longitude,
              latitude: result.coords.latitude,
            }
          });
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  // Upload an image to Firestore
  uploadImage = async (uri) => {
    const blob = await new Promise((resolve, reject) => {
    // creates a XMLHttpRequest with a response type of blob
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        console.log(e);
        reject(new TypeError('Network request failed'));
      };
      xhr.responseType = 'blob';
      xhr.open('GET', uri, true);
      xhr.send(null);
    });

    const imageNameBefore = uri.split('/');
    const imageName = imageNameBefore[imageNameBefore.length - 1];

    // ref to the firebase storage
    const ref = firebase.storage().ref().child(`images/${imageName}`);
    // stores content retrieved form the request
    const snapshot = await ref.put(blob);

    // closes connection
    blob.close();

    return await snapshot.ref.getDownloadURL();
  };

  // calls onActionPress to create/display a set of defined actions
  onActionPress = () => {
    // Options displayed to the user  
    const options = [
      'Choose from Library',
      'Take Photo',
      'Send Location',
      'Cancel',
    ];
    // position of cancel button, closing the menu
    const cancelButtonIndex = options.length - 1;
    // hands down the data to display to the ActionSheet component
    this.context.actionSheet().showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      async (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            console.log('user wants to pick an image');
            return this.pickImage();
          case 1:
            console.log('user wants to take a photo');
            return this.takePhoto();
          case 2:
            console.log('user wants to get their location');
            return this.getLocation();
        }
      }
    );
  }

  render() {
    return (
      <TouchableOpacity
        accessible={true}
        activeOpacity={0.8}
        accessibilityLabel='More Options'
        accessibilityHint="Lets you choose to send an image or your geolocation."
        style={[styles.container]}
        onPress={this.onActionPress}
      >
        <View style={[styles.wrapper, this.props.wrapperStyle]}>
          <Text style={[styles.iconText, this.props.iconTextStyle]}>+</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

CustomActions.contextTypes = {
  actionSheet: PropTypes.func,
};

const styles = StyleSheet.create({
  container: {
    width: 26,
    height: 26,
    marginLeft: 10,
    marginBottom: 10,
  },
  wrapper: {
    borderRadius: 13,
    borderColor: '#b2b2b2',
    borderWidth: 2,
    flex: 1,
  },
  iconText: {
    color: '#b2b2b2',
    fontWeight: 'bold',
    fontSize: 16,
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
});

/**
 * Before you can use this.context, you have to create an object to define this context type.
 * Gifted Chat expects actionSheet to be a function.
 * With PropTypes you can define actionSheet as a function so you can use
 * this.context.actionSheet().showActionSheetWithOptions in your onActionPress function.
 */

CustomActions.contextTypes = {
    actionSheet: PropTypes.func
};