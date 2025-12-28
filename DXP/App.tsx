import React from 'react';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { store } from './src/store';
import { AppNavigator } from './src/navigation';

const App = () => {
  return (
    <View style={{ flex: 1 }}>
      <SafeAreaProvider>
        <Provider store={store}>
          <AppNavigator />
        </Provider>
      </SafeAreaProvider>
    </View>
  );
};

export default App;
