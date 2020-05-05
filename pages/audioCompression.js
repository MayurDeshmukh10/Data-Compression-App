/* eslint-disable react-hooks/rules-of-hooks */
import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  PermissionsAndroid,
  Alert,
  ToastAndroid,
} from 'react-native';
import {Button} from 'galio-framework';
import {Card} from 'galio-framework';
import DocumentPicker from 'react-native-document-picker';
import ImagePicker from 'react-native-image-picker';
import RNFetchBlob from 'rn-fetch-blob';
import * as RNFS from 'react-native-fs';
import AnimatedLoader from 'react-native-animated-loader';

const audioCompression = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedfile, setSelected] = useState('No Audio file selected');
  let [audioData, setaudioData] = useState('');
  let [fileSize, setFileSize] = useState('');
  let [compressedFileSize, setCompressedFileSize] = useState('');
  let [audioName, setAudioName] = useState('');
  let [myalert, setAlert] = useState(false);
  let [msg, setMsg] = useState('');
  let audioType = '';
  //let audioData = '';
  let audioURI = '';
  let audioPath = '';
  let audioSize = '';
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

  const postAudio = () => {
    setIsLoading(true);
    console.log(audioData);
    let content_type = '';
    let ext = audioName.split('.').pop();
    console.log('ext : ', ext);
    if (ext === 'mp3') {
      content_type = 'audio/mpeg';
    } else if (ext === 'wav') {
      content_type = 'audio/wav';
    }
    let dirs = RNFetchBlob.fs.dirs;
    RNFetchBlob.config({
      trusty: true,
      timeout: 600000,
    })
      .fetch(
        'POST',
        // 'http://192.168.1.108:3000/api/v1/audio_compression_app',
        'https://data-compression-platform.eu-gb.cf.appdomain.cloud/api/v1/audio_compression_app',
        {
          'Content-Type': content_type,
        },
        audioData,
      )
      .then(resp => {
        setIsLoading(false);
        console.log('MAYUR: ', resp);
        let info = resp.respInfo;
        let status_code = info.status;
        if (status_code === 200) {
          let header = info.headers;
          let compressedsize = header['Content-Length'];
          let base64str = resp.base64();
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
          setMsg('Compressed Audio is stored in Internal Storage');
          console.log(compressedsize);

          // console.log(base64str);
          var path = '/storage/emulated/0/compressed_' + audioName;
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
          Alert.alert(
            'Status',
            'Audio successfully compressed !!!',
            [{text: 'OK', onPress: () => console.log('OK Pressed')}],
            {cancelable: false},
          );
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

  const selectAudio = async () => {
    requestWritePermission();
    const res = await DocumentPicker.pick({type: [DocumentPicker.types.audio]});
    //console.log(res);
    const exportedFileContent = await RNFS.readFile(res.uri, 'base64');
    //audioData = exportedFileContent;
    setaudioData(exportedFileContent);
    console.log(audioData);
    setAudioName(res.name);
    audioURI = res.uri;
    audioType = res.type;
    audioSize = res.size;
    let originalsize;
    let original_type = '';
    let audio_s;
    audio_s = audioSize / 1000000;
    if (audio_s > 1) {
      originalsize = audio_s;
      original_type = ' MB';
    } else {
      originalsize = audioSize / 1000;
      original_type = ' KB';
    }
    setFileSize('File Size : ' + originalsize + original_type);
    setSelected(audioName);
    ToastAndroid.showWithGravity(
      'File Selected !',
      ToastAndroid.LONG,
      ToastAndroid.BOTTOM,
    );
    //console.log(exportedFileContent);
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
        </>
      ) : (
        <>
          <View style={styles.fileTextContainer}>
            <Text style={styles.filetext}>{audioName}</Text>
          </View>
          <View style={styles.fileSizeContainer}>
            <Text style={styles.fileSizeText}>{fileSize}</Text>
          </View>
          <View style={styles.buttonsContainer}>
            <View style={styles.button1}>
              <Button color="info" size="small" round onPress={selectAudio}>
                Select Audio file
              </Button>
            </View>
          </View>
          <View style={styles.buttonsContainer}>
            <View style={styles.button1}>
              <Button color="info" size="small" round onPress={postAudio}>
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
    marginTop: 50,
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

export default audioCompression;
