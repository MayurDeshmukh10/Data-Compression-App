import React from 'react';
import {StyleSheet, View, Text, ScrollView, Image} from 'react-native';
import {Button} from 'galio-framework';
import {Card} from 'galio-framework';

const listPage = props => {
  const {navigation} = props;
  return (
    <ScrollView style={styles.body}>
      <View style={styles.features}>
        <Image
          style={styles.coverImage}
          source={{
            uri: 'https://img.icons8.com/color/96/000000/full-image.png',
          }}
        />
      </View>

      <View style={styles.buttonsContainer}>
        <View style={styles.button1}>
          <Button
            color="info"
            size="small"
            round
            onPress={() => navigation.navigate('image')}>
            Image Compression
          </Button>
        </View>
      </View>

      <View style={styles.features}>
        <Image
          style={styles.coverImage}
          source={{
            uri: 'https://img.icons8.com/nolan/64/audio-wave.png',
          }}
        />
      </View>

      <View style={styles.buttonsContainer}>
        <View style={styles.button1}>
          <Button
            color="info"
            size="small"
            round
            onPress={() => navigation.navigate('audio')}>
            Audio Compression
          </Button>
        </View>
      </View>

      <View style={styles.features}>
        <Image
          style={styles.coverImage}
          source={{
            uri: 'https://img.icons8.com/color/48/000000/video.png',
          }}
        />
      </View>

      <View style={styles.buttonsContainer}>
        <View style={styles.button1}>
          <Button
            color="info"
            size="small"
            round
            onPress={() => navigation.navigate('SignUp')}>
            Video Compression
          </Button>
        </View>
      </View>

      <View style={styles.features}>
        <Image
          style={styles.coverImage}
          source={{
            uri:
              'https://img.icons8.com/color/96/000000/align-cell-content-left.png',
          }}
        />
      </View>

      <View style={styles.buttonsContainer}>
        <View style={styles.button1}>
          <Button
            color="info"
            size="small"
            round
            onPress={() => navigation.navigate('SignUp')}>
            Text Compression
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

export default listPage;
