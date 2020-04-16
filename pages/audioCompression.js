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
    let dirs = RNFetchBlob.fs.dirs;
    RNFetchBlob.config({
      trusty: true,
    })
      .fetch(
        'POST',
        'https://service.eu.apiconnect.ibmcloud.com/gws/apigateway/api/6680cf59d332053774ebff7968541738e498ef46b8d4df20fb25851b3dcca438/compression/audio_compression_app',
        {
          'Content-Type': 'audio/mpeg',
        },
        audioData,
      )
      .then(resp => {
        setIsLoading(false);
        console.log('MAYUR: ', resp);
        let info = resp.respInfo;
        let header = info.headers;
        let compressedsize = header['Content-Length'];
        compressedsize = parseInt(compressedsize);
        compressedsize = compressedsize / 1000000;
        compressedsize = compressedsize.toString();
        setCompressedFileSize(
          'Compressed file size : ' + compressedsize + ' MB',
        );
        console.log(compressedsize);
        let base64str = resp.base64();
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
        alert('Compression Completed !!!');
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
    audioSize = parseInt(audioSize);
    audioSize = audioSize / 1000000;
    audioSize = audioSize.toString();
    setFileSize('File Size : ' + audioSize + ' MB');
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
          <View style={styles.fileTextContainer}>
            <Text style={styles.filetext}>{selectedfile}</Text>
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
