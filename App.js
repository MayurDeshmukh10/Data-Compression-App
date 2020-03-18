import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import React from 'react';

import IntroPage from './pages/IntroPage';
import listPage from './pages/listPage';

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
  initialRouteName: 'intro',
});

const AppContainer = createAppContainer(RootStack);

const App = () => {
  const prefix = 'app://DataCompression/';

  return <AppContainer uriPrefix={prefix} />;
};

export default App;
