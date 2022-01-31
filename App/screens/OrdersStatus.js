import React, {Component} from 'react';
import {
  Text,
  StyleSheet,
  View,
  FlatList,
  ActivityIndicator,
  ToastAndroid,
  Platform,
  PermissionsAndroid,
  Dimensions,
} from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
import {getPermission, mainDomain, openPdf} from '../config/var';
import {data} from '../config/data';
import AsyncStorage from '@react-native-community/async-storage';
import StatusComponent from '../Components/StatusComponent';
import jwt_decode from 'jwt-decode';

const {width, height} = Dimensions.get('window');

export default class OrdersStatus extends Component {
  constructor(props) {
    super(props);
    this.state = {
      day: '',
      class: 'إختر الفوج',
      setModalVisible: false,
      classes: [],
      students: [],
      studentsClone: [],
      search: false,
      check: false,
      id: '',
      orders: [],
    };
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
        mainDomain + 'getOrdersStatus.php',
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
            orders: full,
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

  separator() {
    return (
      <View
        style={{height: 1, marginVertical: 5, backgroundColor: '#32899F'}}
      />
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <View
          style={[
            styles.newTopContainer,
            {backgroundColor: '#e3e3e3', height: 50},
          ]}>
          <View style={[styles.rowTopContainer]}>
            <View style={styles.rowTopData}>
              <Text style={styles.textTitle}> {'حالة الطلب'} </Text>
            </View>
            <View style={styles.rowTopData}>
              <Text style={styles.textTitle}> {'التاريخ'} </Text>
            </View>
            <View style={styles.rowTopData}>
              <Text style={styles.textTitle}> {'الاجمالي'} </Text>
            </View>
          </View>
        </View>
        {this.props.loading ? (
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <ActivityIndicator color="rgba(50,137,159,1)" size="large" />
          </View>
        ) : (
          <FlatList
            data={this.state.orders}
            keyExtractor={(item, index) => index.toString()}
            // ItemSeparatorComponent={() => this.separator()}
            renderItem={(item, index) => (
              <StatusComponent item={item} index={index} />
            )}
          />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e3e3e3',
  },
  rowTopContainer: {
    // height: 70,
    // backgroundColor: 'red',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginVertical: 5,
    marginBottom: 10,
  },
  rowTopData: {
    height: '100%',
    flex: 1,
  },
  textTitle: {
    fontFamily: 'Tajawal-Regular',
    textAlign: 'center',
    fontSize: 16,
    color: '#444',
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
  firstContainer: {
    // backgroundColor: '#FFF',
    alignItems: 'flex-end',
    width: 25,
    marginRight: 54,
    marginVertical: 25,
    marginBottom: 35,
  },
  secondContainer: {
    // backgroundColor: '#FFF',
    alignItems: 'flex-end',
    width: 25,
    marginRight: 54,
    marginVertical: 30,
    justifyContent: 'center',
  },
  walkthroughCont: {
    // backgroundColor: 'rgba(0,0,0,0.5)',
    position: 'absolute',
    width: '100%',
    top: (height * 8.8) / 100,
    alignItems: 'flex-end',
  },
});
