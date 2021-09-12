import React, {Component} from 'react';
import {StatusBar, BackHandler, Alert, PermissionsAndroid} from 'react-native';
import {Box, Text} from 'react-native-design-utility';
import OnboardingLogo from '../commons/OnboardingLogo';

class SplashScreen extends Component {
  state = {};

  componentDidMount() {
    // this.props.navigation.navigate('Tabs', { navigation: this.props.navigation })
    this.checkApp();
    // app.initializeApp(firebaseConfig);
  }

  checkApp = async () => {
    const formData = new FormData();
    formData.append('appName', 'HommiesApp');
    const requestOptions = {
      method: 'POST',
      header: {'Content-Type': 'application/json'},
      body: formData,
    };

    try {
      fetch('https://code200.sd/checkAppValidity.php', requestOptions)
        .then(response => response.json())
        .then(data => {
          console.log(data);
          if (data.isValid == 'true') {
            this.checkAuth();
          } else {
            alert('Something went Wrong');
            setTimeout(() => BackHandler.exitApp(), 3000);
          }
        })
        .catch(error => {
          console.log(error);
          Alert.alert('يجب الاتصال بالانترنت');
        });
    } catch (error) {
      console.log(error);
      Alert.alert('يجب الاتصال بالانترنت');
    }
  };

  checkAuth = () => {
    setTimeout(() => {
      this.props.navigation.navigate('Login', {
        navigation: this.props.navigation,
      });
    }, 3000);
  };
  render() {
    return (
      <Box style={{width: '100%'}} bg="#FFF" f={1} center>
        <StatusBar backgroundColor="#32899F" />
        <OnboardingLogo />
      </Box>
    );
  }
}

export default SplashScreen;
