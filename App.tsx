import React from 'react';
import { StatusBar } from 'react-native';
import SimpleApp from './SimpleApp';

// Toggle between simple and full app
const USE_FULL_APP = false; // Set to true to enable all advanced features

const App: React.FC = () => {
  if (USE_FULL_APP) {
    // Full app with all features (requires dependencies)
    try {
      const { Provider } = require('react-redux');
      const { store } = require('./src/store');
      const { AppNavigator } = require('./src/navigation/AppNavigator');
      
      return (
        <Provider store={store}>
          <StatusBar barStyle="light-content" backgroundColor="#10B981" />
          <AppNavigator />
        </Provider>
      );
    } catch (error) {
      console.log('Full app dependencies not available, using SimpleApp');
      return <SimpleApp />;
    }
  }
  
  // Simple app (works without additional dependencies)
  return <SimpleApp />;
};

export default App;


