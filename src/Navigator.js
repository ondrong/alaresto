import { StackNavigator } from 'react-navigation';

import SplashScreen from './SplashScreen';
import Login from './Login';
import Main from './Main';
import Nearby from './Nearby';

export const alaResto = StackNavigator({
    SplashScreen : { screen: SplashScreen},
    Login: { screen: Login },
    Main: { screen: Main },
    Nearby: { screen: Nearby },
});