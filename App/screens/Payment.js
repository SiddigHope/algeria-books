import React, {Component} from 'react';
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  ToastAndroid,
  Alert,
  Modal,
} from 'react-native';
import RadioButtonRN from 'radio-buttons-react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon1 from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-community/async-storage';
import RNFetchBlob from 'rn-fetch-blob';
import jwt_decode from 'jwt-decode';
import {mainDomain} from '../config/var';

const {width, height} = Dimensions.get('window');

const payment = [
  {
    label: 'بطاقة ذهبية',
    value: '1',
  },
  {
    label: 'دفع نقدي',
    value: '2',
  },
];

export default class Payment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      total: this.props.route.params.total,
      user: [],
      payment: '1',
      activityIndicator: false,
      items: [],
      count: '',
      comment: '',
      bookLists: [],
      bookCounts: 0,
      showSuccessModal: false,
      asyncKey: [],
      studentsList: [],
    };
  }

  componentDidMount() {
    this.getUser();
    this.setItemsAsArrayOfIds();
    // console.log(defBranch)
  }

  setItemsAsArrayOfIds = async () => {
    let bookCounts = 0;
    let bookLists = [];
    let studentsList = [];
    let asyncKey = [];
    if (this.props.route.params.item == 'cart') {
      const cart = await AsyncStorage.getItem('cart');
      if (cart != null) {
        // console.log(this.props.route.params.students);
        const stds = this.props.route.params.students;
        const jsonCart = JSON.parse(cart);
        bookCounts = jsonCart.length;
        jsonCart.forEach(element => {
          bookLists.push({book_id: element.book_id, price: element.price});
        });
        stds.forEach(element => {
          studentsList.push({MatriculeElv: element.MatriculeElv});
          asyncKey.push({key: element.MatriculeElv + 'cart'});
        });
        this.setState({
          bookLists,
          bookCounts,
          studentsList,
          asyncKey,
        });
      }
    } else {
      const student = this.props.route.params.item;
      this.setState({
        asyncKey: [{key: student.MatriculeElv + 'cart'}],
      });
      const cart = await AsyncStorage.getItem(student.MatriculeElv + 'cart');
      if (cart != null) {
        // console.log(this.props.route.params.students);
        const stds = this.props.route.params.students;
        const jsonCart = JSON.parse(cart);
        bookCounts = jsonCart.length;
        jsonCart.forEach(element => {
          bookLists.push({book_id: element.book_id, price: element.price});
        });
        // stds.forEach(element => {
        studentsList.push({MatriculeElv: student.MatriculeElv});
        // });
        this.setState({
          bookLists,
          bookCounts,
          studentsList,
        });
      }
    }
  };

  onPressPay = async type => {
    // online payment
    this.setState({
      activityIndicator: true,
    });
    // console.log(this.state.studentsList)
    const formData = new FormData();
    formData.append('parentId', String(this.state.user.MatriculeParent));
    formData.append('books', JSON.stringify(this.state.bookLists));
    formData.append('paymentType', type);
    formData.append('total', this.state.total);
    formData.append('MatriculeElvFK', this.state.studentsList[0].MatriculeElv);
    formData.append('count', this.state.bookCounts);
    const requestOptions = {
      method: 'POST',
      header: {
        'Content-Type': 'multipart/form-data',
        // 'Content-Type': 'application/json',
      },
      body: formData,
    };
    try {
      fetch(mainDomain + 'bookOrder.php', requestOptions)
        .then(response => response.json())
        .then(data => {
          console.log(data);
          const token = data.data; //"Don't touch this shit"
          const jwt = jwt_decode(token);
          const full = JSON.parse(jwt.data.data);
          if (full.message == 'inserted') {
            // this.setState({
            //   showSuccessModal: true,
            //   activityIndicator: false,
            // });
            this.state.asyncKey.forEach(element => {
              AsyncStorage.removeItem(element.key);
            });
            // AsyncStorage.removeItem('cart');
            // setTimeout(() => {
            //   this.props.navigation.navigate('MyStudents');
            // }, 3000);
            this.insertIntoOrder('0');
          } else {
            this.setState({
              activityIndicator: false,
            });
            ToastAndroid.show(
              'اعد المحاولة مرة اخري! حدث خطأ ما ...',
              ToastAndroid.LONG,
            );
          }
        })
        .catch(error => {
          console.log(error);
          ToastAndroid.show('حدث خطأ ما, اعد المحاولة', ToastAndroid.LONG);
          this.setState({activityIndicator: false});
        });
    } catch (error) {
      this.setState({
        activityIndicator: false,
      });
      console.log(error);
    }
  };

  completePayment = async type => {
    // cash payment
    // console.log('cash')
    this.setState({
      activityIndicator: true,
    });

    const students = this.props.route.params.students;
    students.forEach((iterated, index) => {
      console.log(iterated);
      ////////////////////////////////////////////////////////////////

      const formData = new FormData();
      formData.append('parentId', String(this.state.user.MatriculeParent));
      formData.append('books', JSON.stringify(iterated.books));
      formData.append('paymentType', type);
      formData.append('total', iterated.total);
      formData.append('MatriculeElvFK', iterated.MatriculeElv);
      formData.append('count', iterated.books.length);
      const requestOptions = {
        method: 'POST',
        header: {
          'Content-Type': 'multipart/form-data',
          // 'Content-Type': 'application/json',
        },
        body: formData,
      };
      try {
        fetch(mainDomain + 'bookOrder.php', requestOptions)
          .then(response => response.json())
          .then(data => {
            console.log(data);
            const token = data.data; //"Don't touch this shit"
            const jwt = jwt_decode(token);
            const full = JSON.parse(jwt.data.data);
            if (full.message == 'inserted') {
              this.state.asyncKey.forEach(element => {
                AsyncStorage.removeItem(element.key);
              });
              if (index == this.state.studentsList.length - 1) {
                // this.setState({
                //   showSuccessModal: true,
                //   activityIndicator: false,
                // });
                AsyncStorage.removeItem('cart');
                // setTimeout(() => {
                //   this.props.navigation.navigate('MyStudents');
                // }, 3000);
                this.insertIntoOrder('1');
              }
            } else {
              this.setState({
                activityIndicator: false,
              });
              ToastAndroid.show(
                'اعد المحاولة مرة اخري! حدث خطأ ما ...',
                ToastAndroid.LONG,
              );
            }
          })
          .catch(error => {
            console.log(error);
            ToastAndroid.show('حدث خطأ ما, اعد المحاولة', ToastAndroid.LONG);
            this.setState({activityIndicator: false});
          });
      } catch (error) {
        this.setState({
          activityIndicator: false,
        });
        console.log(error);
      }

      ////////////////////////////////////////////////////////////////
    });
  };

  insertIntoOrder = type => {
    const formData = new FormData();
    formData.append('parentId', String(this.state.user.MatriculeParent));
    formData.append('status', type);
    formData.append('total', this.state.total);
    const requestOptions = {
      method: 'POST',
      header: {
        'Content-Type': 'multipart/form-data',
        // 'Content-Type': 'application/json',
      },
      body: formData,
    };
    try {
      fetch(mainDomain + 'insertIntoOrder.php', requestOptions)
        .then(response => response.json())
        .then(data => {
          console.log('data');
          console.log(data);
          const token = data.data; //"Don't touch this shit"
          const jwt = jwt_decode(token);
          const full = JSON.parse(jwt.data.data);
          if (full.message == 'inserted') {
            this.setState({
              showSuccessModal: true,
              activityIndicator: false,
            });
            setTimeout(() => {
              this.props.navigation.navigate('MyStudents');
            }, 3000);
          } else {
            this.setState({
              activityIndicator: false,
            });
            ToastAndroid.show(
              'اعد المحاولة مرة اخري! حدث خطأ ما ...',
              ToastAndroid.LONG,
            );
          }
        })
        .catch(error => {
          console.log(error);
          ToastAndroid.show('حدث خطأ ما, اعد المحاولة', ToastAndroid.LONG);
          this.setState({activityIndicator: false});
        });
    } catch (error) {
      this.setState({
        activityIndicator: false,
      });
      console.log(error);
    }
  };

  setArray = async items => {
    const branches = [];
    items.forEach(element => {
      // console.log(element)
      branches.push({label: element.name, value: element.id});
      this.setState({branches});
    });
  };

  getUser = async () => {
    const user = await AsyncStorage.getItem('parentInfo');
    const userId = await AsyncStorage.getItem('parentId');
    if (user != null) {
      const userJson = JSON.parse(user);
      //   console.log(userJson);
      this.setState({
        user: userJson,
        id: userId,
      });
      // console.log(userJson);
      // console.log(userId);
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="#32899F" />
        <Modal
          transparent={true}
          onBackdropPress={() => this.setState({showSuccessModal: false})}
          onSwipeComplete={() => this.setState({showSuccessModal: false})}
          onRequestClose={() => this.setState({showSuccessModal: false})}
          visible={this.state.showSuccessModal}
          animationType="fade">
          <View style={styles.modalContainer}>
            <View style={[styles.modal, {borderRadius: 50, padding: 10}]}>
              <Pressable
                onPress={() => this.setState({showSuccessModal: false})}
                style={[styles.rowContainer1, {marginTop: 5}]}>
                <Icon1 name="check-circle-outline" size={200} color="#81c784" />
                <Text
                  style={{
                    fontSize: 20,
                    color: '#e3e3e3',
                    fontFamily: 'Tajawal-Regular',
                  }}>
                  {' '}
                  {'تمت العملية بنحاح'}{' '}
                </Text>
              </Pressable>
            </View>
          </View>
        </Modal>

        <ScrollView
          style={{flex: 1}}
          contentContainerStyle={styles.itemsContainer}>
          <View style={styles.topContainer}>
            <View style={styles.rowData}>
              <Text style={[styles.rowDataKey, {fontSize: 16}]}>
                {this.state.total + ' دجـ'}
              </Text>
              <Text style={[styles.rowDataValue]}>{'المجموع الكلي'}</Text>
            </View>

            {/* <View style={styles.rowData}>
              <Text style={[styles.rowDataKey, {fontSize: 18}]}>
                {''}
              </Text>
              <Text style={[styles.rowDataValue]}>{''}</Text>
            </View> */}

            <View style={styles.rowData}>
              <Text style={[styles.rowDataKey]}>
                {this.props.route.params.type != '0' ? 'دفع فردي' : 'دفع جماعي'}
              </Text>
              <Text style={[styles.rowDataValue]}>{'نوع العملية'}</Text>
            </View>
          </View>
          <View style={styles.inputCont}>
            <TextInput
              keyboardType="default"
              style={styles.textInput}
              editable={false}
              blurOnSubmit={false}
              value={
                this.state.user.length != 0
                  ? this.state.user.NomArParent + this.state.user.PrenomArParent
                  : ''
              }
              placeholder={'الاسم كاملا'}
              onSubmitEditing={() => this.password.focus()}
              onChangeText={fullname => this.setState({fullname})}
            />
            <TextInput
              textAlign={'32323' == 'Hommies' ? 'left' : 'right'}
              keyboardType="phone-pad"
              editable={false}
              style={styles.textInput}
              blurOnSubmit={false}
              value={this.state.user.length != 0 ? this.state.id : ''}
              placeholder={'الايميل'}
              onSubmitEditing={() => this.password.focus()}
              onChangeText={phone => this.setState({phone})}
            />
            <Text style={styles.rowDataValue}>{'طريقة الدفع'}</Text>
            <RadioButtonRN
              selectedBtn={payment => {
                this.setState({
                  payment: payment.value,
                });
                console.log(payment.value);
              }}
              style={{flexDirection: 'row'}}
              boxStyle={styles.boxStyle}
              textStyle={{marginHorizontal: 3, fontFamily: 'Tajawal-Regular'}}
              initial={Number(this.state.payment)}
              data={payment}
              icon={<Icon name="check-circle" size={25} color="#32899F" />}
            />
          </View>
        </ScrollView>
        <Pressable
          onPress={() =>
            this.state.studentsList.length == 1
              ? this.onPressPay(this.state.payment == '1' ? '1' : '0')
              : this.completePayment(this.state.payment == '1' ? '1' : '0')
          }
          style={styles.btn}>
          {this.state.activityIndicator ? (
            <ActivityIndicator color="#FFF" size="large" />
          ) : (
            <Text style={styles.btnText}> {'تأكيد العملية'} </Text>
          )}
        </Pressable>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9f9f9',
  },
  itemsContainer: {
    width: '100%',
    // backgroundColor: '#FF3',
    // justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    height: '100%',
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modal: {
    // height: '50%',
    // width: '90%',
    // borderRadius: 30,
    // paddingTop: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 100,
  },
  rowContainer1: {
    // backgroundColor: '#FFF',
    marginHorizontal: 20,
    marginVertical: 5,
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  topContainer: {
    height: 120,
    width: '90%',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    backgroundColor: '#e3e3e3',
    paddingBottom: 20,
    marginBottom: 50,
  },
  rowData: {
    flex: 1,
    // backgroundColor: 'red',
    width: '95%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowDataKey: {
    fontFamily: 'Tajawal-Bold',
  },
  rowDataValue: {
    fontFamily: 'Tajawal-Bold',
    color: 'grey',
  },
  btn: {
    width: '90%',
    height: 60,
    flexDirection: 'row',
    backgroundColor: '#32899F',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  btnText: {
    fontFamily: 'Tajawal-Bold',
    fontSize: 16,
    color: '#e3e3e3',
  },
  inputCont: {
    // backgroundColor: 'red',
    flex: 1,
    width: '90%',
    marginVertical: 30,
  },
  textInput: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    fontSize: 14,
    elevation: 1,
    fontFamily: 'Tajawal-Regular',
    marginBottom: 5,
    borderColor: '#4444',
    borderBottomWidth: 0.5,
    paddingHorizontal: 20,
    height: 50,
  },
  boxStyle: {
    flex: 1,
    height: 50,
    margin: 0,
    borderColor: '#FFF',
    backgroundColor: '#FFF',
    borderBottomWidth: 0.5,
    borderRadius: 10,
    marginBottom: 5,
    elevation: 1,
    borderBottomColor: '#4444',
    marginHorizontal: 5,
  },
});
