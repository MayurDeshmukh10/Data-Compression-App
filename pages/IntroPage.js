import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  NetInfo,
  Dimensions,
} from 'react-native';
import {Button} from 'galio-framework';
import AnimatedLoader from 'react-native-animated-loader';
import {Animation, LottieView} from 'lottie-react-native';
import MiniOfflineSign from './OfflineNotice';

const {width} = Dimensions.get('window');
const IntroPage = props => {
  const [image, setIsLoading] = useState();
  const {navigation} = props;
  return (
    <ScrollView style={styles.body}>
      {/* <View style={styles.offlineContainer}>
      <Text style={styles.offlineText}>No Internet Connection</Text>
    </View> */}
      <View style={styles.header}>
        <Text style={styles.heading}>Data Compression</Text>

        <Text style={styles.tagline}>Compress all your files...</Text>
      </View>
      {/* <LottieView source={require('./animation.json')} autoPlay loop />; */}
      <View style={styles.features}>
        <Image
          style={styles.coverImage}
          source={{
            uri: 'https://img.icons8.com/cute-clipart/100/000000/compress.png',
          }}
        />
      </View>
      <View style={styles.buttonsContainer}>
        <View style={styles.button}>
          <Button
            color="info"
            size="small"
            round
            onPress={() => navigation.navigate('list')}>
            Let's Compress :)
          </Button>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  body: {
    backgroundColor: '#041530',
    flex: 1,
  },
  lottie: {
    width: 200,
    height: 200,
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

  tagline: {
    marginTop: 25,
    fontSize: 18,
    color: 'white',
    padding: 5,
  },

  buttonsContainer: {
    alignItems: 'center',
    padding: 10,
  },

  button: {
    marginTop: 200,
  },

  features: {
    padding: 10,
    height: 200,
    alignItems: 'center',
  },

  coverImage: {
    width: '60%',
    height: 300,
  },

  headerImage: {
    width: 40,
    borderColor: 'white',
    borderWidth: 1,
    height: 40,
  },
  offlineContainer: {
    backgroundColor: '#b52424',
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    width,
    position: 'absolute',
    top: 30,
  },
  offlineText: {
    color: '#fff',
  },
});

export default IntroPage;
