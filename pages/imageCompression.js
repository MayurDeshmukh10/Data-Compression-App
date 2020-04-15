/* eslint-disable react-hooks/rules-of-hooks */
import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  PermissionsAndroid,
  Image,
  ToastAndroid,
  ActivityIndicator,
} from 'react-native';
import {Button} from 'galio-framework';
import {Card} from 'galio-framework';
import DocumentPicker from 'react-native-document-picker';
import ImagePicker from 'react-native-image-picker';
import RNFetchBlob from 'rn-fetch-blob';
import * as RNFS from 'react-native-fs';
import AnimatedLoader from 'react-native-animated-loader';

const imageCompression = props => {
  const [isLoading, setIsLoading] = useState(false);
  let imageType = '';
  let imageData = '';
  let imageURI = '';
  let imageName = '';
  let imagePath = '';
  let imageSize = '';
  const {navigation} = props;

  let options = {
    title: 'Select Image',
    customButtons: [
      {name: 'customOptionKey', title: 'Choose Photo from Custom Option'},
    ],
    storageOptions: {
      skipBackup: true,
      path: 'images',
    },
  };

  /**
   * The first arg is the options object for customization (it can also be null or omitted for default options),
   * The second arg is the callback which sends object: response (more info in the API Reference)
   */
  const requestWritePermission = async () => {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        title: 'Storage Permission',
        message: 'App needs access to memory to download the file ',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log(' W PERMISSION GRANTED');
    } else {
      console.log('NOOOOO');
    }
    const granted1 = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      {
        title: 'Storage Permission',
        message: 'App needs access to memory to download the file ',
      },
    );
    if (granted1 === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('R PERMISSION GRANTED');
    } else {
      console.log('NOOOOO');
    }
  };
  const selectImage = () => {
    requestWritePermission();
    ImagePicker.showImagePicker(options, response => {
      console.log('Response = ', response);
      imageType = response.type;
      imageURI = response.uri;
      imageName = response.fileName;
      console.log(imageName);
      imageData = response.data;
      imagePath = 'file://' + response.path;
      console.log(imagePath);
      imageSize = response.fileSize;

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const source = {uri: response.uri};

        // window.location.reload(false);

        // You can also display the image using data:
        // const source = { uri: 'data:image/jpeg;base64,' + response.data };
      }
    });
  };

  useEffect(() => {
    console.log('USe');
  }, []);

  const postImage = () => {
    setIsLoading(true);

    let dirs = RNFetchBlob.fs.dirs;
    RNFetchBlob.config({
      trusty: true,
    })
      .fetch(
        'POST',
        'https://service.eu.apiconnect.ibmcloud.com/gws/apigateway/api/6680cf59d332053774ebff7968541738e498ef46b8d4df20fb25851b3dcca438/compression/image_compression_app',
        {
          'Content-Type': 'image/jpeg',
        },
        imageData,
      )
      .then(resp => {
        setIsLoading(false);
        let base64str = resp.base64();
        console.log(base64str);
        console.log(imageName);
        var path = '/storage/emulated/0/compressed_' + imageName;
        //var path = RNFS.DocumentDirectoryPath + '/compressed.jpg';
        console.log('PATH', path);
        RNFS.writeFile(path, base64str, 'base64')
          .then(success => {
            console.log('FILE WRITTEN!');
          })
          .catch(err => {
            console.log(err.message);
          });
        ToastAndroid.showWithGravity(
          'Compression Completed !!!',
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
        );
      })
      .catch(err => {
        console.log(err);
      });
  };
  const postImage1 = () => {
    console.log(imageData);
    const data = new FormData();
    data.append(imageData);
    fetch(
      'https://service.eu.apiconnect.ibmcloud.com/gws/apigateway/api/6680cf59d332053774ebff7968541738e498ef46b8d4df20fb25851b3dcca438/compression/image_compression_app',
      {
        method: 'post',
        body: data,
      },
    )
      .then(res => {
        console.log(res.blob());
        console.log(res.url);
      })
      .catch(function(error) {
        console.log('Error' + error);
      });
  };

  // async selectFile = () => {
  //   const res = await DocumentPicker.pick({type: [DocumentPicker.types.allFiles]});

  // };

  //   const res = DocumentPicker.pick({type: [DocumentPicker.types.allFiles]});
  // const res = selectFile();
  // console.log('URI : ' + res.uri);
  // console.log('URI : ' + res.type);
  // console.log('URI : ' + res.name);
  // console.log('URI : ' + res.uri);

  return (
    <ScrollView style={styles.body}>
      {isLoading ? (
        <>
          <AnimatedLoader
            visible={isLoading}
            source={require('./animation.json')}
            animationStyle={styles.lottie}
            speed={1}
          />
          <View style={styles.compress}>
            <Text>Compressing...</Text>
          </View>
        </>
      ) : (
        <>
          <View style={styles.features}>
            <Image
              style={styles.coverImage}
              source={{
                uri: imagePath,
              }}
            />
          </View>
          <View style={styles.buttonsContainer}>
            <View style={styles.button1}>
              <Button color="info" size="small" round onPress={selectImage}>
                Select Image file
              </Button>
            </View>
          </View>

          <View style={styles.buttonsContainer}>
            <View style={styles.button1}>
              <Button color="info" size="small" round onPress={postImage}>
                Compress
              </Button>
            </View>
          </View>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  body: {
    backgroundColor: '#041530',
    flex: 1,
  },
  compress: {
    flex: 1,
    marginBottom: 20,
    alignItems: 'center',
    color: 'white',
  },
  header: {
    flex: 1,
    alignItems: 'center',
    padding: 70,
  },

  heading: {
    fontSize: 40,
    color: 'white',
  },
  lottie: {
    backgroundColor: '#041530',
    width: 200,
    height: 200,
  },

  tagline: {
    marginTop: 25,
    fontSize: 18,
    color: 'white',
    padding: 5,
  },
  loaderContainer: {
    flex: 1,
    alignItems: 'center',
  },

  buttonsContainer: {
    alignItems: 'center',
    padding: 10,
  },

  button1: {
    marginBottom: 2,
  },

  features: {
    padding: 10,
    height: 200,
    alignItems: 'center',
  },

  coverImage: {
    marginTop: 20,
    width: '80%',
    height: 150,
  },

  headerImage: {
    width: 40,
    borderColor: 'white',
    borderWidth: 1,
    height: 40,
  },
});

export default imageCompression;
