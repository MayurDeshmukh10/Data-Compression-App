import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import React from 'react';

import IntroPage from './pages/IntroPage';

const RootStack = createStackNavigator({
  Intro: {
    screen: IntroPage,
    navigationOptions: {
      headerShown: false,
    },
    path: 'intro',
  },
  initialRouteName: 'Intro',
});

const AppContainer = createAppContainer(RootStack);

const App = () => {
  const prefix = 'app://DataCompression/';

  return <AppContainer uriPrefix={prefix} />;
};

export default App;
