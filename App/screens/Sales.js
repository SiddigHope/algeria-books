import React, {Component} from 'react';
import {
  Alert,
  TextInput,
  Text,
  StyleSheet,
  View,
  FlatList,
  Modal,
  TouchableOpacity,
  Pressable,
  StatusBar,
  Dimensions,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import RNFetchBlob from 'rn-fetch-blob';
import jwt_decode from 'jwt-decode';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import _ from 'lodash';
import {mainDomain} from '../config/var';
import {
  Container,
  Body,
  Header,
  Left,
  Right,
  Drawer,
  Tab,
  Tabs,
  DefaultTabBar,
} from 'native-base';
import SideBar from './../config/SideBar';
import OnlineSalesComponent from '../Components/OnlineSalesComponent';
import CashSalesComponent from '../Components/CashSalesComponent';

const {width, height} = Dimensions.get('window');
export default class Sales extends Component {
  constructor(props) {
    super(props);
    this.state = {
      days: ['السبت', 'الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'],
      day: '',
      class: 'إختر الفوج',
      setModalVisible: false,
      classes: [],
      onlineOrders: [],
      cashOrders: [],
      search: false,
      id: '',
    };
  }

  componentDidMount() {
    this.checkUser();
    // this.getStudents();
  }

  checkUser = async () => {
    // const date = new Date(Date.now());
    // console.log(date.getHours());
    // AsyncStorage.removeItem('parentInfo')
    const user = await AsyncStorage.getItem('parentInfo');
    const userId = await AsyncStorage.getItem('parentId');
    if (user != null) {
      const userJson = JSON.parse(user);
      // console.log(userJson);
      this.setState({
        user: true,
        id: userJson.MatriculeParent,
        ActivityIndicator: false,
      });
      this.getOrders();
    }
  };

  getOrders = async () => {
    // const userDist = await AsyncStorage.getItem('teacherDist');
    RNFetchBlob.fetch(
      'POST',
      mainDomain + 'getOrders.php',
      {
        // Authorization: "Bearer access-token",
        // otherHeader: "foo",
        // 'Content-Type': 'multipart/form-data',
        'Content-Type': 'application/json',
      },
      [
        // to send data
        {name: 'parentId', data: String(this.state.id)},
        // { name: 'div', data: String('1100001') },
        // {name: 'dist', data: String('12')},
      ],
    )
      .then(resp => {
        console.log(resp.data);
        const data = JSON.parse(resp.data);
        const token = data.data; //"Don't touch this shit"
        const jwt = jwt_decode(token);
        const full = JSON.parse(jwt.data.data);
        // const full = data
        // console.log(this.state.id)
        this.setState({
          onlineOrders: full.filter(order => order.online_paid == '1'),
          cashOrders: full.filter(order => order.online_paid == '0'),
        });
      })
      .catch(err => {
        this.setState({
          setModalVisible: false,
        });
        console.log('error response');
        console.log(err);
      });
  };

  renderTabBar = props => {
    props.tabStyle = Object.create(props.tabStyle);
    return <DefaultTabBar {...props} />;
  };

  render() {
    return (
      <>
        <View style={styles.container}>
          <StatusBar backgroundColor="#32899F" />
          <Header
            style={{backgroundColor: '#32899F'}}
            androidStatusBarColor="#32899F">
            <Left
              style={{flexDirection: 'row', flex: 1, marginLeft: 15}}></Left>
            <Body>
              <Text style={styles.title}>{'المشتريات'}</Text>
            </Body>
            <Right style={{marginRights: 15}}></Right>
          </Header>
          <Tabs
            renderTabBar={this.renderTabBar}
            initialPage={1}
            tabBarUnderlineStyle={{height: 2, backgroundColor: '#fff'}}
            tabBarPosition="overlayTop">
            <Tab
              tabStyle={styles.tabStyle}
              textStyle={styles.text}
              activeTextStyle={{color: '#FFF', fontFamily: 'Tajawal-Regular'}}
              activeTabStyle={styles.active}
              heading="دفع نقدي">
              <CashSalesComponent
                data={this.state.cashOrders}
                navigation={this.props.navigation}
              />
            </Tab>
            <Tab
              tabStyle={styles.tabStyle}
              textStyle={styles.text}
              activeTextStyle={{color: '#FFF', fontFamily: 'Tajawal-Regular'}}
              activeTabStyle={styles.active}
              heading="البطاقة الذهبية">
              <OnlineSalesComponent
                data={this.state.onlineOrders}
                navigation={this.props.navigation}
              />
            </Tab>
          </Tabs>
        </View>
        <SideBar navigator={this.props.navigation} />
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width,
    height: (height * 90) / 100,
    backgroundColor: '#e3e3e3',
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
    // backgroundColor: '#8f5ba6',
  },
  textInput: {
    marginVertical: 5,
    alignSelf: 'center',
    height: 50,
    width: '95%',
    justifyContent: 'center',
    borderRadius: 10,
    fontFamily: 'Tajawal-Regular',
    fontSize: 18,
    alignItems: 'center',
    // color: '#9e9e9e',
    backgroundColor: 'rgba(7,93,84,.5)',
  },
  select: {
    fontFamily: 'Tajawal-Regular',
    fontSize: 18,
    color: '#e3e3e3',
    // letterSpacing: 5
  },
  rowContainer: {
    // height: 70,
    width: '95%',
    // backgroundColor: '#FFF',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginVertical: 5,
    marginBottom: 10,
  },
  rowTopContainer: {
    // height: 70,
    width: '95%',
    // backgroundColor: '#FFF',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginVertical: 5,
    marginBottom: 10,
  },
  rowData: {
    height: '100%',
    flex: 1,
    // backgroundColor:'red',
    alignItems: 'center',
  },
  rowTopData: {
    height: '100%',
    flex: 1,
  },
  textTitle: {
    fontFamily: 'Tajawal-Bold',
    textAlign: 'center',
    fontSize: 16,
    color: '#444',
  },
  content: {
    fontFamily: 'Tajawal-Regular',
    textAlign: 'center',
    fontSize: 16,
    color: '#444',
    // textAlign: 'right'
  },
  newContainer: {
    paddingVertical: 20,
    // backgroundColor: '#e3e3e3',
    // alignItems: "center",
    // justifyContent: "center",
    width: '95%',
    marginVertical: 5,
    // elevation: 3,
    alignSelf: 'center',
    borderRadius: 10,
    elevation: 3,
  },
  modalContainer: {
    height: '100%',
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modal: {
    backgroundColor: '#FFF',
    // height: '50%',
    width: '90%',
    borderRadius: 30,
    paddingTop: 20,
  },
  rowContainer1: {
    height: 60,
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    marginVertical: 5,
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  newTopContainer: {
    // paddingVertical: 20,
    // backgroundColor: '#e3e3e3',
    alignItems: 'center',
    justifyContent: 'center',
    width: '95%',
    marginVertical: 5,
    elevation: 3,
    flexDirection: 'row',
    alignSelf: 'center',
    borderRadius: 10,
    // elevation: 3,
  },
  notes: {
    color: '#32899F',
    fontSize: 16,
    fontFamily: 'Tajawal-Regular',
  },
  noteContainer: {
    marginBottom: 10,
    borderRadius: 10,
    height: 200,
    width: '95%',
    alignSelf: 'center',
    backgroundColor: '#e3e3e3',
  },
  rowContainer2: {
    height: 50,
    backgroundColor: '#FFF',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginBottom: 30,
    // elevation: 3
  },
  rowData1: {
    flex: 1,
    height: '100%',
    // backgroundColor: '#e3e3e3',
    marginHorizontal: 3,
    // borderRadius: 20
  },
  btnsearch: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#32899F',
    position: 'absolute',
    bottom: 30,
    right: 30,
    elevation: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputText: {
    height: 50,
    color: '#444',
    // fontSize: 18
    textAlign: 'right',
    fontFamily: 'Tajawal-Regular',
  },
});
