/**
 * @format
 */
import 'react-native-gesture-handler'; // ⚠️ MUST be at the very top
import { AppRegistry } from 'react-native';
import App from './src/App';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);