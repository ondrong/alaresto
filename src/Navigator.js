import { StackNavigator } from 'react-navigation';

import Login from './Login';
import Main from './Main';

export const alaResto = StackNavigator({
    Login: { screen: Login },
    Main: { screen: Main },
});