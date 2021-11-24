import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  StatusBar,
  Dimensions,
  Text,
  Modal,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import RNFetchBlob from 'rn-fetch-blob';
import jwt_decode from 'jwt-decode';
import {mainDomain} from '../config/var';
import {Tab, Tabs, DefaultTabBar} from 'native-base';
import SideBar from './../config/SideBar';
import OnlineSalesComponent from '../Components/OnlineSalesComponent';
import CashSalesComponent from '../Components/CashSalesComponent';
import FreeSalesComponent from '../Components/FreeSalesComponent';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const {width, height} = Dimensions.get('window');

export default class Sales extends Component {
  constructor(props) {
    super(props);
    this.state = {
      day: '',
      class: 'إختر الفوج',
      setModalVisible: false,
      classes: [],
      onlineOrders: [],
      cashOrders: [],
      freeOrders: [],
      search: false,
      id: '',
      userInfo: [],
      students: [],
      downloadModal: false,
      downloadStatus: 0,
      first: false,
      loading: false,
    };

    this.download = this.download.bind(this);
    this.setState = this.setState.bind(this);
  }

  componentDidMount() {
    this.checkUser();
  }

  checkUser = async () => {
    const user = await AsyncStorage.getItem('parentInfo');
    const students = await AsyncStorage.getItem('students');
    if (user != null) {
      const userJson = JSON.parse(user);
      const studentsJson = JSON.parse(students);
      // console.log(userJson);
      this.setState({
        user: true,
        userInfo: userJson,
        students: studentsJson,
        id: userJson.MatriculeParent,
        ActivityIndicator: false,
      });
      this.getOrders();
    }
  };

  getOrders = async () => {
    // const userDist = await AsyncStorage.getItem('teacherDist');
    this.setState({
      loading: true,
    });
    try {
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
          // console.log(resp.data);
          const data = JSON.parse(resp.data);
          const token = data.data; //"Don't touch this shit"
          const jwt = jwt_decode(token);
          const full = JSON.parse(jwt.data.data);
          // const full = data
  
          if (full.message) {
            return;
          }
          this.setState({
            onlineOrders: full.filter(order => order.online_paid == '1'),
            cashOrders: full.filter(order => order.online_paid == '0'),
            freeOrders: full.filter(order => order.online_paid == '2'),
            loading: false,
          });
        })
        .catch(err => {
          this.setState({
            setModalVisible: false,
          });
          console.log('error response');
          console.log(err);
          this.setState({
            loading: false,
          });
        });
    } catch (error) {
      this.setState({
        setModalVisible: false,
      });
      console.log('error response');
      console.log(error);
      this.setState({
        loading: false,
      });
    }
  };

  download = (modal, status) => {
    this.setState({
      downloadModal: modal,
      downloadStatus: status,
    });
  };

  renderTabBar = props => {
    props.tabStyle = Object.create(props.tabStyle);
    return <DefaultTabBar {...props} />;
  };

  render() {
    let color =
      this.state.downloadStatus == 0
        ? '#32899F'
        : this.state.downloadStatus == 1
        ? '#81c784'
        : '#e80242';
    return (
      <>
        <View style={styles.container}>
          <StatusBar backgroundColor="#32899F" />
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
              heading="الكتب المجانية">
              <FreeSalesComponent
                data={this.state.freeOrders}
                navigation={this.props.navigation}
                students={this.state.students}
                parent={this.state.userInfo}
                download={this.download}
                loading={this.state.loading}
              />
            </Tab>
            <Tab
              tabStyle={styles.tabStyle}
              textStyle={styles.text}
              activeTextStyle={{color: '#FFF', fontFamily: 'Tajawal-Regular'}}
              activeTabStyle={styles.active}
              heading="دفع بريدي">
              <CashSalesComponent
                data={this.state.cashOrders}
                navigation={this.props.navigation}
                students={this.state.students}
                parent={this.state.userInfo}
                download={this.download}
                loading={this.state.loading}
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
                students={this.state.students}
                parent={this.state.userInfo}
                download={this.download}
                loading={this.state.loading}
              />
            </Tab>
          </Tabs>
          <Modal
            transparent={true}
            onBackdropPress={() => this.setState({downloadModal: false})}
            onSwipeComplete={() => this.setState({downloadModal: false})}
            onRequestClose={() => this.setState({downloadModal: false})}
            visible={this.state.downloadModal}
            animationType="slide">
            <View style={styles.downloadContainer}>
              <View style={[styles.downloadModal, {backgroundColor: color}]}>
                <View style={styles.downloadStatus}>
                  {this.state.downloadStatus == 0 ? (
                    <>
                      <ActivityIndicator size="small" color="#FFF" />
                      <Text style={[styles.downloadText]}>
                        {'جار تحميل الوصل...'}
                      </Text>
                    </>
                  ) : this.state.downloadStatus == 1 ? (
                    <>
                      <Icon name="check-circle" size={25} color="#FFF" />
                      <Text style={[styles.downloadText]}>
                        {'تم تحميل الوصل بنجاح'}
                      </Text>
                    </>
                  ) : (
                    <>
                      <Icon name="close-circle" size={25} color="#FFF" />
                      <Text style={[styles.downloadText]}>
                        {'لم تتم العملية حاول مرة اخرى'}
                      </Text>
                    </>
                  )}
                </View>
              </View>
            </View>
          </Modal>
        </View>
        {/* <SideBar navigator={this.props.navigation} /> */}
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
  downloadContainer: {
    height: 70,
    width: '100%',
    height: '100%',
    // backgroundColor: 'red',
    alignItems: 'center',
  },
  downloadModal: {
    position: 'absolute',
    bottom: 50,
    width: '90%',
    borderRadius: 20,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e3e3e3',
    elevation:3,
  },
  downloadStatus: {
    flex: 1,
    width: '95%',
    flexDirection: 'row',
    elevation: 4,
    justifyContent: 'space-around',
    alignItems: 'center',
    // backgroundColor: 'red'
  },
  downloadText: {
    fontFamily: 'Tajawal-Regular',
    fontSize: 16,
    color: '#FFF',
  },
  tooltipStyle: {
    bottom: 0,
  },
});
