import React, {PureComponent} from 'react';
import {
  PermissionsAndroid,
  Alert,
  KeyboardAvoidingView,
  BackHandler,
  StatusBar,
  Image,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Platform,
  Modal,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import IMEI from 'react-native-imei';
import RNFetchBlob from 'rn-fetch-blob';
import NetInfo from '@react-native-community/netinfo';
import jwt_decode from 'jwt-decode';
import DeviceInfo from 'react-native-device-info';
import {CustomTabs} from 'react-native-custom-tabs';
import {mainDomain} from '../config/var';

const {width, height} = Dimensions.get('window');

export default class Login extends PureComponent {
  state = {
    userData: '',
    connected: true,
    imei: '',
    id: '',
    // id: 'abdes25021@gmail.com',
    setModalVisible: false,
    user: false,
    prev: '',
    userDist: '',
    biometryType: null,
    ActivityIndicator: false,
    password: '',
    // password: '123456',
    OsVer: '',
  };

  async connect() {
    NetInfo.addEventListener(state => {
      if (!state.isConnected) {
        this.setState({
          connected: false,
        });
      } else {
        this.setState({connected: true});
      }
    });
  }

  getPermision = async () => {
    this.setState({
      ActivityIndicator: true,
    });
    if (Platform.OS == 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
      );

      if (granted === true || granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('granted');
        this.signup();
      } else {
        console.log('not granted');
        Alert.alert(
          'تنبيه',
          'يجب السماح للتطبيق بالوصول لبيانات الهاتف',
          [{text: 'حسناً', onPress: () => BackHandler.exitApp()}],
          {cancelable: false},
        );
      }
    }
  };

  componentDidMount() {
    this.connect();
    this.checkUser();
    // AsyncStorage.removeItem('parentInfo')
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    const navigation = this.props.navigation;
    navigation.addListener('focus', () => {
      this.checkUser();
    });
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
    const navigation = this.props.navigation;
    navigation.removeListener('focus');
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
          {text: 'نعم', onPress: () => BackHandler.exitApp()},
        ],
        {cancelable: false},
      );
      return true;
    }

    // return true;  // Do nothing when back button is pressed
  };

  checkUser = async () => {
    const date = new Date(Date.now());
    console.log(date.getHours());
    // AsyncStorage.removeItem('parentInfo')
    const user = await AsyncStorage.getItem('parentInfo');
    const userId = await AsyncStorage.getItem('parentId');
    if (user != null) {
      const userJson = JSON.parse(user);
      console.log(userJson);
      this.setState({
        user: true,
        id: userId,
        password: userJson.password,
        ActivityIndicator: false,
      });
    }
  };

  goHome = async () => {
    this.setState({
      user: true,
    });
    this.props.navigation.navigate('MyStudents', {
      navigation: this.props.navigation,
    });
    // const user = await AsyncStorage.getItem('parentInfo');
    // if (user != null) {
    //   this.setState({
    //     ActivityIndicator: true,
    //   });
    //   setTimeout(() => {
    //     this.props.navigation.navigate('Tabs', {
    //       navigation: this.props.navigation,
    //     });
    //   }, 1000);
    // } else {
    //   Alert.alert('لم تتم العملية', 'تأكد من الاتصال بالانترنت و حاول مجددا');
    // }
  };

  signup = async () => {
    if (this.state.id != '' && this.state.password != '') {
      try {
        RNFetchBlob.fetch(
          'POST',
          mainDomain + 'getParentData.php',
          {
            // Authorization: "Bearer access-token",
            // otherHeader: "foo",
            'Content-Type': 'multipart/form-data',
          },
          [
            // to send data
            {name: 'parentId', data: this.state.id},
            {name: 'password', data: this.state.password},
          ],
        )
          .then(resp => {
            console.log('*************************');
            console.log(resp.data);
            const data = JSON.parse(resp.data);
            console.log('*************************\\\\\\\\\\\\\\');
            console.log('works here');
            const token = data.data; //"Don't touch this shit"
            const jwt = jwt_decode(token);
            const full = JSON.parse(jwt.data.data);
            console.log(full);
            console.log(full.serial_parent);
            if (this.state.user) {
              this.setState({
                userData: full,
                prev: full.serial_parent,
              });
              this.confirmSignin();
            } else {
              if (full.status == '1') {
                this.setState({
                  // userData: JSON.parse(full),
                  userData: full,
                  setModalVisible: true,
                  prev: full.serial_parent,
                  ActivityIndicator: false,
                });
              } else {
                Alert.alert('يجب التقرب من الإدارة لتفعيل حسابك');
                this.setState({
                  ActivityIndicator: false,
                });
              }
            }
          })
          .catch(err => {
            console.log('error response');
            console.log(err);
            this.setState({
              ActivityIndicator: false,
            });
          });
      } catch (error) {
        this.setState({
          ActivityIndicator: false,
        });
        console.log(error);
      }
    } else {
      Alert.alert('يجب ادخال البريد الالكتروني ');
      this.setState({
        ActivityIndicator: false,
      });
    }
  };

  cancelSignin = () => {
    this.setState({
      id: '',
      password: '',
      setModalVisible: false,
      ActivityIndicator: false,
    });
  };

  confirmSignin = async () => {
    if (this.state.userData != '') {
      const id = await DeviceInfo.getUniqueId();
      console.log(id);
      ///////////////////////////////////////
      if (this.state.prev == '' || this.state.prev == id) {
        RNFetchBlob.fetch(
          'POST',
          mainDomain + 'insertParentImei.php',
          {
            // Authorization: "Bearer access-token",
            // otherHeader: "foo",
            'Content-Type': 'multipart/form-data',
          },
          [
            // to send data
            {name: 'imei', data: String(id)},
            {name: 'parentId', data: this.state.id.toString()},
          ],
        )
          .then(res => {
            console.log(res.data);
            const data = JSON.parse(res.data);
            const token = data.data; //"Don't touch this shit"
            const jwt = jwt_decode(token);
            const full = JSON.parse(jwt.data.data);
            // console.log(full)
            if (
              full.message == 'inserted' ||
              this.state.user ||
              this.state.prev == id
            ) {
              this.state.userData.password = this.state.password;
              AsyncStorage.setItem(
                'parentInfo',
                JSON.stringify(this.state.userData),
              ).then(() => {
                this.setState({
                  setModalVisible: false,
                  ActivityIndicator: false,
                });
              });
              this.goHome();
              AsyncStorage.setItem('parentId', this.state.id);
            } else {
              this.setState({
                ActivityIndicator: false,
                setModalVisible: false,
                id: '',
                password: '',
              });
              Alert.alert(' ', 'لايمكنك تسجيل الدخول من هاتف اخر');
            }
          })
          .catch(err => {
            this.setState({
              ActivityIndicator: false,
            });
            console.log('error response111');
            console.log(err);
          });
      } else {
        this.setState({
          ActivityIndicator: false,
        });
        Alert.alert(' ', 'عدم تطابق الهاتف');
      }
      ///////////////////////////////////////
    } else {
      this.setState({
        ActivityIndicator: false,
      });
      Alert.alert('لايوجد مستخدم لتسجيل الدخول');
    }
  };

  openBrowser = () => {
    CustomTabs.openURL('https://tharwa.education.gov.dz')
      .then(launched => {
        console.log(`Launched custom tabs: ${launched}`);
      })
      .catch(err => {
        console.error(err);
      });
  };

  render() {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
        style={styles.container}>
        <Modal
          transparent={true}
          onBackdropPress={() => this.setState({setModalVisible: false})}
          onSwipeComplete={() => this.setState({setModalVisible: false})}
          onRequestClose={() => this.setState({setModalVisible: false})}
          visible={this.state.setModalVisible}
          animationType="fade">
          <View style={styles.modalContainer}>
            <View style={styles.modal}>
              <Text
                style={{
                  color: '#32899F',
                  fontSize: 20,
                  alignSelf: 'center',
                  fontFamily: 'Tajawal-Bold',
                  marginBottom: 10,
                }}>
                {'تأكيد هوية الولي'}
              </Text>
              <View style={styles.rowContainer}>
                <View style={styles.rowData}>
                  <Text style={styles.textTitle}> {'الايميل'} </Text>
                  <Text style={styles.content}> {this.state.id} </Text>
                </View>
              </View>

              <View style={styles.rowContainer}>
                <View style={styles.rowData}>
                  <Text style={styles.textTitle}> {'الإسم واللقب'} </Text>
                  <Text style={styles.content}>
                    {this.state.userData.NomArParent +
                      ' ' +
                      this.state.userData.PrenomArParent}
                  </Text>
                </View>
              </View>

              <View style={styles.rowContainer}>
                <View style={styles.rowData}>
                  <Text style={styles.textTitle}> {'رقم الهاتف المحمول'} </Text>
                  <Text style={styles.content}>
                    {'0'}
                    {this.state.userData.TelMobileTutr}{' '}
                  </Text>
                </View>
              </View>

              <View style={[styles.rowContainer1, {marginTop: 20}]}>
                <TouchableOpacity
                  onPress={() => this.cancelSignin()}
                  style={[
                    styles.rowData,
                    {
                      elevation: 5,
                      backgroundColor: '#e57373',
                      borderRadius: 20,
                      justifyContent: 'center',
                    },
                  ]}>
                  <Text
                    style={[
                      styles.textTitle,
                      {
                        color: '#e3e3e3',
                        fontFamily: 'Tajawal-Bold',
                        alignSelf: 'center',
                      },
                    ]}>
                    {' '}
                    {'تراجع'}{' '}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => this.confirmSignin()}
                  style={[
                    styles.rowData,
                    {
                      elevation: 5,
                      backgroundColor: '#66bb6a',
                      borderRadius: 20,
                      justifyContent: 'center',
                    },
                  ]}>
                  <Text
                    style={[
                      styles.textTitle,
                      {
                        color: '#e3e3e3',
                        fontFamily: 'Tajawal-Bold',
                        alignSelf: 'center',
                      },
                    ]}>
                    {' '}
                    {'تسجيل الدخول'}{' '}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <View style={styles.container}>
          <StatusBar backgroundColor="#32899F" />
          <View style={{width: '100%', height: '30%'}}>
            <Image
              source={require('./../Assets/bookSplashTop.png')}
              style={styles.loginBanner}
            />
            <Image
              source={require('./../Assets/abdes.png')}
              style={styles.loginCircle}
            />
          </View>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              // backgroundColor: 'red',
              marginTop: '70%',
            }}>
            {!this.state.user ? (
              <>
                <View style={styles.inputView}>
                  <TextInput
                    textAlign="right"
                    style={styles.inputText}
                    value={this.state.id}
                    placeholder="البريد الاكتروني"
                    placeholderTextColor="#32899F"
                    onChangeText={text => this.setState({id: text})}
                  />
                </View>
                <View style={styles.inputView}>
                  <TextInput
                    textAlign="right"
                    style={[styles.inputText]}
                    secureTextEntry
                    value={this.state.password}
                    placeholder="كلمة المرور"
                    placeholderTextColor="#32899F"
                    onChangeText={text => this.setState({password: text})}
                  />
                </View>
              </>
            ) : null}
            <TouchableOpacity
              style={[styles.loginBtn, this.state.user ? {marginTop: 70} : {}]}
              onPress={() => {
                this.getPermision();
              }}>
              {this.state.ActivityIndicator ? (
                <ActivityIndicator
                  animating={this.state.ActivityIndicator}
                  color="#e3e3e3"
                  size="small"
                />
              ) : (
                <Text style={styles.loginText}>
                  {' '}
                  {this.state.user ? 'تسجيل دخول' : 'تأكيد الهوية'}{' '}
                </Text>
              )}
            </TouchableOpacity>
          </View>
          {this.state.user ? null : (
            <Text style={styles.signin} onPress={() => this.openBrowser()}>
              {' '}
              {'ليس لديك حساب ؟'}{' '}
            </Text>
          )}
        </View>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    // justifyContent: "center",
    // alignItems: 'center'
  },
  logo: {
    marginBottom: 10,
  },
  loginBanner: {
    width: width,
    height: height - (60 * height) / 100,
  },
  loginCircle: {
    width: width - (30 * width) / 100,
    alignSelf: 'center',
    position: 'absolute',
    top: height - (75 * height) / 100,
    height: height - (65 * height) / 100,
    // backgroundColor: 'red'
  },
  id: {
    fontSize: 18,
    marginVertical: 10,
    fontFamily: 'Tajawal-Regular',
    color: '#4444',
  },
  inputView: {
    width: '80%',
    backgroundColor: '#32899F',
    borderRadius: 10,
    height: 60,
    marginBottom: 10,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  inputText: {
    height: 45,
    backgroundColor: '#FFF',
    color: '#32899F',
    fontSize: 18,
    paddingHorizontal: 20,
    borderRadius: 20,
    fontFamily: 'Tajawal-Regular',
  },
  loginBtn: {
    width: '80%',
    backgroundColor: '#32899F',
    borderRadius: 25,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 10,
    elevation: 5,
  },
  loginText: {
    color: 'white',
    fontFamily: 'Tajawal-Regular',
    fontSize: 15,
  },
  signText: {
    color: '#e3e3e3',
    fontSize: 13,
  },
  signin: {
    color: '#32899F',
    fontFamily: 'Tajawal-Regular',
    alignSelf: 'center',
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
    height: '48%',
    width: '90%',
    borderRadius: 30,
    padding: 20,
  },
  rowContainer: {
    height: 50,
    backgroundColor: '#FFF',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginVertical: 5,
    elevation: 3,
  },
  rowContainer1: {
    height: 50,
    backgroundColor: '#FFF',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginVertical: 5,
    // elevation: 3
  },
  rowData: {
    flex: 1,
    height: '100%',
    // backgroundColor: '#e3e3e3',
    marginHorizontal: 3,
    // borderRadius: 20
  },
  textTitle: {
    fontFamily: 'Tajawal-Regular',
    fontSize: 16,
    color: '#444',
  },
  content: {
    fontFamily: 'Tajawal-Bold',
    fontSize: 14,
    color: '#444',
    textAlign: 'right',
  },
});
