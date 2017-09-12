import { StackNavigator } from 'react-navigation';

import SplashScreen from './SplashScreen';
// import Login from './Login';
import Main from './Main';
// import Nearby from './Nearby';
import RestoDetail from './RestoDetail';
import Search from './Search';
import SearchResult from './SearchResult';
import Settings from './Settings';

export const Navigator = StackNavigator({
    SplashScreen : { screen: SplashScreen},
    // Login: { screen: Login },
    Main: { screen: Main },
    // Nearby: { screen: Nearby },
    Search: {screen: Search},
    SearchResult: {screen: SearchResult},
    RestoDetail: { screen: RestoDetail},
    Settings: {screen: Settings},
});