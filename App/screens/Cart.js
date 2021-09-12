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
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import RNFetchBlob from 'rn-fetch-blob';
import jwt_decode from 'jwt-decode';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import _ from 'lodash';
import {mainDomain} from '../config/var';

export default class MyStudents extends Component {
  constructor(props) {
    super(props);
    this.state = {
      days: ['السبت', 'الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'],
      day: '',
      class: 'إختر الفوج',
      setModalVisible: false,
      classes: [],
      students: [],
      studentsClone: [],
      search: false,
      id: '',
      total: 0,
    };
  }

  componentDidMount() {
    this.checkUser();
    const navigation = this.props.navigation;
    navigation.addListener('focus', () => {
      this.checkUser();
    });
  }

  componentWillUnmount() {
    const navigation = this.props.navigation;
    navigation.removeListener('focus');
  }

  getStudents = async () => {
    // const userDist = await AsyncStorage.getItem('teacherDist');
    RNFetchBlob.fetch(
      'POST',
      mainDomain + 'getMyChildren.php',
      {
        'Content-Type': 'application/json',
      },
      [
        // to send data
        {name: 'parentId', data: String(this.state.id)},
      ],
    )
      .then(resp => {
        // console.log(resp.data)
        const data = JSON.parse(resp.data);
        const token = data.data; //"Don't touch this shit"
        const jwt = jwt_decode(token);
        const full = JSON.parse(jwt.data.data);
        console.log('11111');
        this.getStudentBooks(full);
        this.setState({
          // students: full,
          studentsClone: full,
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

  checkUser = async () => {
    const date = new Date(Date.now());
    console.log(date.getHours());
    // AsyncStorage.removeItem('parentInfo')
    const user = await AsyncStorage.getItem('parentInfo');
    const userId = await AsyncStorage.getItem('parentId');
    if (user != null) {
      const userJson = JSON.parse(user);
      //   console.log(userJson);
      this.setState({
        user: true,
        id: userJson.MatriculeParent,
        password: userJson.password,
        ActivityIndicator: false,
      });
    }
    this.getStudents();
  };

  separator() {
    return (
      <View
        style={{height: 1, marginVertical: 5, backgroundColor: '#075D54'}}
      />
    );
  }

  getStudentBooks = async data => {
    console.log('getStudentBooks');
    // console.log(data);
    const sCart = await AsyncStorage.getItem('cart');
    if (sCart != null) {
      const cards = [];
      const cart = JSON.parse(sCart);
      let count = 0;
      let whole = 0;
      const students = [];
      data.forEach(async student => {
        const studentCart = await AsyncStorage.getItem(
          String(student.MatriculeElv + 'cart'),
        );
        if (studentCart != null) {
          const jsonCart = JSON.parse(studentCart);
          let total = 0;
          jsonCart.forEach(element => {
            total += Number(element.price);
          });
          student.total = total;
          whole += total;
          students.push(student);
          // if (cards.length != 0) {
          // }
        }
        count += 1;
        console.log(data);
        this.setState({
          students,
          total: whole,
        });
      });
    }
  };

  _listFooter = (item, index) => {
    console.log('footer');
    // console.log(index);
    const string = 'الدفع الاجمالي : للمشتريات:';
    const totalPay = 'تأكيد عملية الشراء';
    return (
      <View style={styles.footer}>
        <Text style={styles.payAsWhole}>
          {string + this.state.total + ' دجـ'}
        </Text>
        <Pressable
          onPress={() =>
            this.props.navigation.navigate('Payment', {
              item: 'cart',
              type: '0',
              total: this.state.total,
              students: this.state.students,
            })
          }
          style={styles.btn}>
          <Icon name="account-cash-outline" size={20} color="#81c784" />
          <Text style={[styles.payAsWhole, {color: '#81c784'}]}>
            {totalPay}
          </Text>
        </Pressable>
      </View>
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => {
            console.log('cartItems');
            this.props.navigation.navigate('CartItems');
          }}
          style={styles.cartCont}>
          <Icon name="cart-outline" size={30} color="rgba(50,137,159,1)" />
        </TouchableOpacity>

        <View
          style={[
            styles.newTopContainer,
            {backgroundColor: '#e3e3e3', height: 50},
          ]}>
          <View style={[styles.rowTopContainer]}>
            <View style={styles.rowTopData}>
              <Text style={styles.textTitle}> {'دفع فردي'} </Text>
            </View>
            <View style={styles.rowTopData}>
              <Text style={styles.textTitle}> {'مبلغ الكتب'} </Text>
            </View>
            <View style={styles.rowTopData}>
              <Text style={styles.textTitle}> {'الاسم'} </Text>
            </View>
          </View>
        </View>
        <FlatList
          data={this.state.students}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={this._listFooter}
          renderItem={(item, index) => {
            let backgroundColor = '#FFF';
            let elevation = 3;
            if (item.index % 2 == 1) {
              backgroundColor = '#FFF';
              elevation = 0;
            }
            return (
              <>
                <View style={[styles.newContainer, {backgroundColor}]}>
                  <View style={[styles.rowContainer]}>
                    <TouchableOpacity
                      onPress={() =>
                        this.props.navigation.navigate('Payment', {
                          item: item.item,
                          type: '1',
                          total: item.item.total,
                          students: item.item,
                        })
                      }
                      style={styles.rowData}>
                      <Icon
                        name="account-cash-outline"
                        color="#81c784"
                        size={25}
                      />
                    </TouchableOpacity>
                    <Pressable style={styles.rowData}>
                      <Text style={styles.content}>
                        {' '}
                        {item.item.total + ' دجـ'}{' '}
                      </Text>
                    </Pressable>
                    <Pressable style={styles.rowData}>
                      <Text style={styles.content}>
                        {item.item.PrenomArElv}
                      </Text>
                    </Pressable>
                  </View>
                </View>
              </>
            );
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e3e3e3',
  },
  footer: {
    // backgroundColor: 'red',
    marginTop: 20,
    width: '90%',
    alignSelf: 'center',
  },
  btn: {
    // width: '90%',
    height: 60,
    flexDirection: 'row',
    // backgroundColor: '#FFF',
    alignSelf: 'flex-end',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderRadius: 20,
  },
  payAsWhole: {
    fontFamily: 'Tajawal-Regular',
    fontSize: 18,
    marginLeft: 10,
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
    color: '#075D54',
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
    backgroundColor: 'rgba(7,93,84,1)',
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
  cartCont: {
    backgroundColor: '#FFF',
    width: 60,
    height: 60,
    borderRadius: 30,
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    zIndex: 10000000,
    bottom: 20,
    left: 20,
  },
  badge: {
    backgroundColor: '#388e3c',
    width: 15,
    height: 15,
    borderRadius: 7.5,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 12,
    zIndex: 10000000,
    right: 12,
  },
  badgeText: {
    fontFamily: 'Tajawal-Regular',
    fontSize: 10,
    color: '#FFF',
  },
});
