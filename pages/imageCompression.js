/* eslint-disable react-hooks/rules-of-hooks */
import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  PermissionsAndroid,
  Image,
  Alert,
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
import AwesomeAlert from 'react-native-awesome-alerts';

const imageCompression = props => {
  const [isLoading, setIsLoading] = useState(false);
  let [imageDisplay, setImageDisplay] = useState(
    'https://img.icons8.com/color/96/000000/image.png',
  );
  let [fileSize, setFileSize] = useState('Select a image');
  let [compressedFileSize, setCompressedFileSize] = useState('');
  let [imageData, setimageData] = useState('');
  let [imageName, setImageName] = useState('');
  let [myalert, setAlert] = useState(false);
  let [msg, setMsg] = useState('');
  let [imageSelectCheck, setImageSelectCheck] = useState(false);

  let imageType = '';
  let imageURI = '';
  let imagePath = '';
  let imageSize = '';
  let ext = '';

  const {navigation} = props;

  let options = {
    title: 'Select Image',
    // customButtons: [
    //   {name: 'customOptionKey', title: 'Choose Photo from Custom Option'},
    // ],
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
    //setCompressedFileSize("");
    ImagePicker.showImagePicker(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
        setFileSize('Select a image');
        setImageDisplay('https://img.icons8.com/color/96/000000/image.png');
        setImageSelectCheck(false);
        return;
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
        return;
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        return;
      } else {
        const source = {uri: response.uri};
      }
      console.log('Response = ', response);
      imageType = response.type;
      imageURI = response.uri;
      setImageName(response.fileName);
      console.log(imageName);
      ext = imageName.split('.').pop();
      if (ext === 'ico') {
        alert('Please select jpeg, png, tiff and webp images only !!!');
      }
      setimageData(response.data);
      imagePath = 'file://' + response.path;
      setImageDisplay(imagePath);
      console.log(imagePath);
      let imageSize1;
      let originalsize;
      let original_type = '';
      imageSize1 = response.fileSize;
      imageSize = imageSize1 / 1000000;
      if (imageSize > 1) {
        originalsize = imageSize;
        original_type = 'MB';
      } else {
        originalsize = imageSize1 / 1000;
        original_type = 'KB';
      }
      setImageSelectCheck(true);
      // imageSize1 = parseInt(imageSize);
      // imageSize = imageSize1 / 1000000;
      // imageSize = imageSize.toString();
      setFileSize('Image Size : ' + originalsize + original_type);
    });
  };

  useEffect(() => {
    console.log('USe');
  }, []);

  const postImage = () => {
    if (imageSelectCheck === false) {
      Alert.alert(
        'Oops',
        'Please select a Image',
        [{text: 'OK', onPress: () => console.log('OK Pressed')}],
        {cancelable: false},
      );
      setAlert(true);
      return;
    }
    setIsLoading(true);
    let content_type = '';
    ext = imageName.split('.').pop();
    console.log('ext : ', ext);
    if (ext === 'jpeg' || ext === 'jpg') {
      content_type = 'image/jpeg';
    } else if (ext == 'png') {
      content_type = 'image/png';
    } else if (ext == 'tiff') {
      content_type = 'image/tiff';
    } else if (ext == 'webp') {
      content_type = 'image/webp';
    }
    const data = new FormData();
    data.append('file', imageData);

    let dirs = RNFetchBlob.fs.dirs;
    RNFetchBlob.config({
      trusty: true,
      timeout: 600000,
    })
      .fetch(
        'POST',
        // 'http://192.168.1.108:3000/api/v1/image_compression_app',
        'https://data-compression-platform-updated.eu-gb.cf.appdomain.cloud/api/v1/image_compression_app',
        // 'https://data-compression-platform.eu-gb.cf.appdomain.cloud/api/v1/image_compression_app',
        {
          'Content-Type': content_type,
        },
        imageData,
      )
      .then(resp => {
        console.log(resp);
        setIsLoading(false);
        let info = resp.respInfo;
        let status_code = info.status;
        console.log(status_code);
        if (status_code === 200) {
          let header = info.headers;
          let base64str = resp.base64();
          let compressedsize = header['Content-Length'];
          console.log('Compressed size : ', compressedsize);
          compressedsize = parseInt(compressedsize);
          compressedsize = compressedsize / 1000000;
          compressedsize = compressedsize.toString();
          let padding, inBytes, base64StringLength;
          if (base64str.endsWith('==')) {
            padding = 2;
          } else if (base64str.endsWith('=')) {
            padding = 1;
          } else {
            padding = 0;
          }
          base64StringLength = base64str.length;
          console.log(base64StringLength);
          inBytes = (base64StringLength / 4) * 3 - padding;
          console.log(inBytes);
          let size_type = '';
          let final_size;
          compressedsize = inBytes / 1000000;
          if (compressedsize > 1) {
            final_size = compressedsize;
            size_type = ' MB';
          } else {
            final_size = inBytes / 1000;
            size_type = ' KB';
          }
          setCompressedFileSize(
            'Compressed file size : ' + final_size + size_type,
          );
          setMsg('Compressed Image is stored in Internal Storage');

          // console.log('resp base64', base64str);
          //console.log(base64str);
          console.log('imageName');
          console.log(imageName);
          var path = '/storage/emulated/0/compressed_' + imageName;
          //var path = RNFS.DocumentDirectoryPath + '/compressed.jpg';
          console.log('PATH', path);
          RNFS.writeFile(path, base64str, 'base64')
            .then(success => {
              console.log('FILE WRITTEN!');
            })
            .catch(err => {
              console.log('fsdfdfsfd');
              setIsLoading(false);
              alert('Some Error has Occured !!!');
              console.log(err.message);
            });
          ToastAndroid.showWithGravity(
            'Compression Completed !!!',
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
          );
          Alert.alert(
            'Status',
            'Image successfully compressed !!!',
            [{text: 'OK', onPress: () => console.log('OK Pressed')}],
            {cancelable: false},
          );
          setAlert(true);
        } else if (status_code === 406) {
          Alert.alert(
            'Status',
            'Image is too small to compress. Please select another image',
            [{text: 'OK', onPress: () => console.log('OK Pressed')}],
            {cancelable: false},
          );
          setAlert(true);
        } else {
          Alert.alert(
            'Status',
            'Some Error has occured, Please try again !!!',
            [{text: 'OK', onPress: () => console.log('OK Pressed')}],
            {cancelable: false},
          );
          setAlert(true);
        }
      })
      .catch(err => {
        setIsLoading(false);
        console.log(err);
        Alert.alert(
          'Status',
          'Some Error has occured, Please try again !!!',
          [{text: 'OK', onPress: () => console.log('OK Pressed')}],
          {cancelable: false},
        );
        setAlert(true);
      });
  };

  return (
    <ScrollView style={styles.body}>
      {isLoading ? (
        <>
          <AnimatedLoader
            visible={isLoading}
            source={require('./infinity-loader.json')}
            animationStyle={styles.lottie}
            speed={1}
          />
          <View style={styles.compress}>
            <Text>Compressing...</Text>
          </View>
          {/* <AwesomeAlert
            show={myalert}
            showProgress={false}
            title="AwesomeAlert"
            message="I have a message for you!"
            closeOnTouchOutside={true}
            closeOnHardwareBackPress={false}
            showCancelButton={false}
            showConfirmButton={true}
            confirmText="Okay"
            confirmButtonColor="#DD6B55"
            onConfirmPressed={() => {
              setAlert(false);
            }}
          /> */}
        </>
      ) : (
        <>
          <View style={styles.features}>
            <Image
              style={styles.coverImage}
              source={{
                uri: imageDisplay,
              }}
            />
          </View>
          <View style={styles.fileSizeContainer}>
            <Text style={styles.fileSizeText}>{fileSize}</Text>
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
          <View style={styles.fileSizeContainer}>
            <Text style={styles.fileSizeText}>{compressedFileSize}</Text>
            <Text style={styles.fileSizeText}>{msg}</Text>
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
  filetext: {
    flex: 1,
    color: 'white',
    fontSize: 18,
  },
  fileTextContainer: {
    marginTop: 100,
    flex: 1,
    alignItems: 'center',
  },
  fileSizeContainer: {
    marginTop: 30,
    flex: 1,
    alignItems: 'center',
  },
  fileSizeText: {
    flex: 1,
    color: 'white',
    fontSize: 15,
  },
  loaderContainer: {
    flex: 1,
    alignItems: 'center',
  },

  buttonsContainer: {
    marginTop: 50,
    alignItems: 'center',
    padding: 10,
  },

  button1: {
    marginBottom: 2,
  },

  features: {
    marginTop: 20,
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
