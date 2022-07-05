import React, { Component } from 'react';
import {
  StatusBar,
  Alert,
  View,
  StyleSheet,
  BackHandler,
  Text,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
  Platform,
} from 'react-native';
import {
  Container,
  Body,
  Header,
  Left,
  Right,
  Drawer,
  Tab,
  DefaultTabBar,
  Tabs,
} from 'native-base';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import SideBar from './../config/SideBar';
import Feeds from './../Components/Feeds';
import Protocol from './../Components/Protocol';
import NetInfo from '@react-native-community/netinfo';
import _ from 'lodash';
import { mainDomain } from '../config/var';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';

const { width, height } = Dimensions.get('window');

console.disableYellowBox = true;

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      connected: null,
      item: null,
      tab: 3,
      commig: null,
    };
  }

  componentDidMount() {
    this.tryOnlinePayment()
    this.connect();
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
  }

  tryOnlinePayment = async () => {
    const userString = await AsyncStorage.getItem('parentInfo');
    const user = JSON.parse(userString);

    const orderNumber = "21" + "2030" + user.MatriculeParent + Date.now();

    const data = {
      "orderNumber": orderNumber,
      "returnUrl": mainDomain + "bookOrder.php",
      "currency": "012",
      "language": "ar"
    }
    try {
      const options = {
        method: "POST",
        url: "https://webmerchant.poste.dz/payment/rest/register.do",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        data,
      };

      const request = await axios(options)
        .then((response) => response)
        .catch((error) => console.log("error axios:",error));
      console.log(request)
      return
      return request.success ? request.data : false;
    } catch (error) {
      console.log("error try",error);
      return false;
    }
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }

  handleBackPress = () => {
    if (this.props.navigation.isFocused()) {
      Alert.alert(
        'إنهاء التطبيق',
        'هل حقاً تريد إنهاء التطبيق',
        [
          {
            text: 'لا',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          { text: 'نعم', onPress: () => BackHandler.exitApp() },
        ],
        { cancelable: false },
      );
      return true;
    }

    // return true;  // Do nothing when back button is pressed
  };

  closeDrawer() {
    this.drawer._root.close();
  }

  renderTabBar = props => {
    props.tabStyle = Object.create(props.tabStyle);
    return <DefaultTabBar {...props} />;
  };

  openDrawer() {
    this.drawer._root.open();
  }
  async connect() {
    NetInfo.addEventListener(state => {
      if (!state.isConnected) {
        this.setState({
          connected: (
            <SafeAreaView style={{ backgroundColor: 'red' }}>
              <Text
                style={{
                  color: '#fff',
                  padding: 10,
                  textAlign: 'center',
                  fontFamily: 'Tajawal-Regular',
                  fontSize: Platform.OS == 'android' ? 12 : 16,
                }}>
                {' '}
                {'عفوا, لايوجد إتصال بالانترنت'}{' '}
              </Text>
            </SafeAreaView>
          ),
        });
      } else {
        this.setState({ connected: null });
      }
    });
  }

  container() {
    return (
      <Container style={{ backgroundColor: '#FFF' }}>
        <StatusBar backgroundColor="#32899F" />
        <Header
          style={{ backgroundColor: '#32899F' }}
          androidStatusBarColor="#32899F">
          <Left style={{ flexDirection: 'row', flex: 1, marginLeft: 15 }}></Left>
          <Body>
            <Text style={styles.title}>{'الرئيسية'}</Text>
          </Body>
          <Right style={{ marginRights: 15 }}>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('MyStudents')}
              style={{
                height: '100%',
                marginRight: 10,
                padding: 8,
                borderRadius: 40,
                backgroundColor: '#fff',
              }}>
              <Icon name="account-outline" size={25} color="#32899F" />
            </TouchableOpacity>
          </Right>
        </Header>
        <Tabs
          renderTabBar={this.renderTabBar}
          initialPage={1}
          tabBarUnderlineStyle={{ height: 2, backgroundColor: '#fff' }}
          tabBarPosition="overlayTop">
          <Tab
            tabStyle={styles.tabStyle}
            textStyle={styles.text}
            activeTextStyle={{ color: '#FFF', fontFamily: 'Tajawal-Regular' }}
            activeTabStyle={styles.active}
            heading="الأخبار">
            <Feeds navigation={this.props.navigation} />
          </Tab>
          <Tab
            tabStyle={styles.tabStyle}
            textStyle={styles.text}
            activeTextStyle={{ color: '#FFF', fontFamily: 'Tajawal-Regular' }}
            activeTabStyle={styles.active}
            heading="كتب شبه مدرسية">
            <Protocol navigation={this.props.navigation} />
          </Tab>
        </Tabs>
        {this.state.connected}
      </Container>
    );
  }
  render() {
    return (
      <Drawer
        side="right"
        ref={ref => {
          this.drawer = ref;
        }}
        content={<SideBar navigator={this.props.navigation} />}
        onClose={() => this.closeDrawer()}>
        <View style={styles.container}>
          {this.state.item}
          {this.container()}
        </View>
      </Drawer>
    );
  }
}

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    // height: height
  },
  text: {
    fontFamily: 'Tajawal-Regular',
    color: '#FFF',
  },
  title: {
    fontSize: 20,
    fontFamily: 'Tajawal-Regular',
    alignSelf: 'center',
    color: '#FFF',
    marginRight: 15,
  },
  tabStyle: {
    backgroundColor: '#32899F',
  },
  active: {
    fontFamily: 'Tajawal-Regular',
    // backgroundColor: '#8f5ba6',
    backgroundColor: '#32899F',
  },
  text: {
    fontFamily: 'Tajawal-Regular',
    color: '#FFF',
  },
  imgBack: {
    height: 30,
    width: 30,
    borderRadius: 25,
    marginHorizontal: 5,
  },
  iconBack: {
    height: 30,
    width: 30,
    borderRadius: 25,
    marginLeft: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  img: {
    height: 30,
    width: 30,
    borderRadius: 25,
  },
  dataContainer: {
    paddingHorizontal: 10,
    width: width - 160,
    // backgroundColor: 'red',
    justifyContent: 'center',
  },
  songtitle: {
    fontFamily: 'Tajawal-Regular',
    fontSize: 20,
    color: '#FFF',
    marginTop: 5,
  },
});
