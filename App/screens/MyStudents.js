import React, {Component} from 'react';
import {
  Alert,
  TextInput,
  Text,
  StyleSheet,
  View,
  FlatList,
  BackHandler,
  TouchableOpacity,
  Pressable,
  StatusBar,
  Image,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import RNFetchBlob from 'rn-fetch-blob';
import jwt_decode from 'jwt-decode';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import _ from 'lodash';
import {mainDomain} from '../config/var';
import {Body, Header, Left, Right} from 'native-base';
import SideBar from './../config/SideBar';

const {width, height} = Dimensions.get('window');
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
      loadingData: false,
    };
  }

  componentDidMount() {
    // AsyncStorage.clear()
    this.checkUser();
    // this.getStudents();
    const navigation = this.props.navigation;
    // navigation.addListener('focus', () => {
    //   this.getStudents();
    // });
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
  }

  componentWillUnmount() {
    // const navigation = this.props.navigation;
    // navigation.removeListener('focus');
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
          {text: 'نعم', onPress: () => BackHandler.exitApp()},
        ],
        {cancelable: false},
      );
      return true;
    }

    // return true;  // Do nothing when back button is pressed
  };

  checkUser = async () => {
    this.setState({
      loadingData: true,
    });
    const date = new Date(Date.now());
    // console.log(date.getHours());
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
      this.getStudents();
    }
  };

  separator() {
    return (
      <View
        style={{height: 1, marginVertical: 5, backgroundColor: '#32899F'}}
      />
    );
  }

  getStudents = async () => {
    this.setState({
      loadingData: true,
    });
    // const userDist = await AsyncStorage.getItem('teacherDist');
    RNFetchBlob.fetch(
      'POST',
      mainDomain + 'getMyChildren.php',
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
        // console.log(this.state.id)
        // console.log(full);
        AsyncStorage.setItem("students", jwt.data.data)
        this.setState({
          students: full,
          studentsClone: full,
          loadingData: false,
        });
      })
      .catch(err => {
        this.setState({
          setModalVisible: false,
          loadingData: false,
        });
        console.log('error response');
        console.log(err);
      });
  };

  cancel = () => {
    this.setState({
      setDatePickerVisibility: false,
      setTimePickerVisibility: false,
      setModalVisible: false,
      noteModal: false,
      absenceModal: false,
      item: '',
      time: '',
      date: '',
      note: '',
    });
  };

  async handleSearch(text) {
    if (text == '') {
      this.setState({students: this.state.studentsClone});
    }
    const formatedQuery = text;
    let string = '[]';
    let filtered = JSON.parse(string);
    const data = _.filter(this.state.studentsClone, item => {
      const name = item.NomArElv;
      const name1 = item.PrenomArElv;
      if (name.includes(formatedQuery) || name1.includes(formatedQuery)) {
        filtered.push(item);
        return true;
      }
      return false;
    });
    if (text == '') {
      this.setState({students: this.state.studentsClone});
    }
    this.setState({students: filtered, query: text});
  }

  render() {
    let searchBar = this.state.search ? (
      <View
        style={{
          borderWidth: 1,
          borderColor: '#e3e3e3',
          width: '95%',
          borderRadius: 30,
          paddingHorizontal: 20,
          marginTop: 5,
        }}>
        <TextInput
          style={styles.inputText}
          placeholder="إبحث بالإسم او اللقب ..."
          placeholderTextColor="#444"
          onChangeText={text => this.handleSearch(text.toLowerCase())}
        />
        <TouchableOpacity
          onPress={() => this.setState({search: false})}
          style={{position: 'absolute', top: 15, left: 20}}>
          <Icon name="close-circle-outline" size={20} color="#444" />
        </TouchableOpacity>
      </View>
    ) : null;

    let searchBtn = this.state.search ? null : (
      <TouchableOpacity
        onPress={() => this.setState({search: true})}
        style={styles.btnsearch}>
        <Icon name="account-search" color="#e3e3e3" size={25} />
      </TouchableOpacity>
    );
    return (
      <>
        <View style={styles.container}>
          <StatusBar backgroundColor="#32899F" />
          <Header
            style={{backgroundColor: '#32899F'}}
            androidStatusBarColor="#32899F">
            <Left style={{flexDirection: 'row', flex: 1, marginLeft: 15}}>
              <Image
                source={require('./../Assets/bookStoreCircle.png')}
                style={{height: 40, width: 40, borderRadius: 20}}
              />
            </Left>
            <Body>
              <Text style={styles.title}>{'كتبي'}</Text>
            </Body>
            <Right style={{marginRights: 15}}>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate('Home')}
                style={{
                  height: '100%',
                  marginRight: 10,
                  padding: 8,
                  borderRadius: 40,
                  backgroundColor: '#fff',
                }}>
                <Icon name="home-outline" size={25} color="#32899F" />
              </TouchableOpacity>
            </Right>
          </Header>
          {searchBar}
          <View
            style={[
              styles.newTopContainer,
              {backgroundColor: '#e3e3e3', height: 50},
            ]}>
            <View style={[styles.rowTopContainer]}>
              <View style={styles.rowTopData}>
                <Text style={styles.textTitle}> {'الكتب'} </Text>
              </View>
              <View style={styles.rowTopData}>
                <Text style={styles.textTitle}> {'اللقب'} </Text>
              </View>
              <View style={styles.rowTopData}>
                <Text style={styles.textTitle}> {'الاسم'} </Text>
              </View>
            </View>
          </View>
          {/* the loading spinner */}
          {this.state.loadingData ? (
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
              <ActivityIndicator size="large" color="#32899F" />
            </View>
          ) : null}

          <FlatList
            data={this.state.students}
            keyExtractor={(item, index) => index.toString()}
            // ItemSeparatorComponent={() => this.separator()}
            renderItem={(item, index) => {
              // console.log(item.index)
              let backgroundColor = '#FFF';
              let elevation = 3;
              if (item.index % 2 == 1) {
                backgroundColor = '#FFF';
                elevation = 0;
              }
              // console.log('item.item.LivreGratuitElv')
              // console.log(item.item.LivreGratuitElv)
              return (
                <>
                  <View style={[styles.newContainer, {backgroundColor}]}>
                    <View style={[styles.rowContainer]}>
                      <TouchableOpacity
                        onPress={() =>
                          this.props.navigation.navigate('ForSale', {
                            student: item.item,
                          })
                        }
                        style={styles.rowData}>
                        <Icon
                          name="bookshelf"
                          color={
                            item.item.LivreGratuitElv == '1'
                              ? '#81c784'
                              : '#444'
                          }
                          size={25}
                        />
                      </TouchableOpacity>
                      <Pressable style={styles.rowData}>
                        <Text style={styles.content}>
                          {' '}
                          {item.item.NomArElv}{' '}
                        </Text>
                      </Pressable>
                      <Pressable style={styles.rowData}>
                        <Text style={styles.content}>
                          {' '}
                          {item.item.PrenomArElv}{' '}
                        </Text>
                      </Pressable>
                    </View>
                  </View>
                </>
              );
            }}
          />
          {searchBtn}
        </View>
        <SideBar navigator={this.props.navigation} />
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
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
