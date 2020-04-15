import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import React from 'react';

import IntroPage from './pages/IntroPage';
import listPage from './pages/listPage';
import audioCompression from './pages/audioCompression';
import imageCompression from './pages/imageCompression';

const RootStack = createStackNavigator({
  Intro: {
    screen: IntroPage,
    navigationOptions: {
      headerShown: false,
    },
    path: 'intro',
  },
  list: {
    screen: listPage,
    navigationOptions: {
      headerTitle: 'Select Compression Type',
    },
    path: 'list',
  },
  image: {
    screen: imageCompression,
    navigationOptions: {
      headerTitle: 'Image Compression',
    },
    path: 'image',
  },
  audio: {
    screen: audioCompression,
    navigationOptions: {
      headerTitle: 'Audio Compression',
    },
    path: 'audio',
  },
  initialRouteName: 'intro',
});

const AppContainer = createAppContainer(RootStack);

const App = () => {
  const prefix = 'app://DataCompression/';

  return <AppContainer uriPrefix={prefix} />;
};

export default App;
