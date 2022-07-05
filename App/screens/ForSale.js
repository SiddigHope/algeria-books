import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text,
  FlatList,
  Dimensions,
  ActivityIndicator,
  ImageBackground,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {Surface} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-community/async-storage';
import RNFetchBlob from 'rn-fetch-blob';
import jwt_decode from 'jwt-decode';
import _ from 'lodash';
import {assetsDomain, mainDomain2, mainDomain} from '../config/var';
const {width, height} = Dimensions.get('window');
// import {download} from '../config/service';

class ForSale extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      id: '',
      dataClone: [],
      sold: [],
      cartItemsCount: 0,
      activityIndicator: true,
      selectedItems: [],
    };
  }

  componentDidMount() {
    this.getCartItems();
    this.checkUser();
  }

  checkUser = async () => {
    // AsyncStorage.removeItem('parentInfo')
    const user = await AsyncStorage.getItem('parentInfo');
    if (user != null) {
      const userJson = JSON.parse(user);
      // console.log(userJson);
      this.setState({
        user: true,
        id: userJson.MatriculeParent,
        password: userJson.password,
        // activityIndicator: false,
      });
      this.getSoldBooks();
    }
  };

  getSoldBooks = async () => {
    this.setState({
      activityIndicator: true,
    });
    const student = this.props.route.params.student;
    // console.log(student);
    RNFetchBlob.fetch(
      'POST',
      mainDomain2 + 'getSoldBooks.php',
      {
        // Authorization: "Bearer access-token",
        // otherHeader: "foo",
        // 'Content-Type': 'multipart/form-data',
        'Content-Type': 'application/json',
      },
      [
        // to send data MatriculeElvFK
        {name: 'MatriculeElvFK', data: String(student.MatriculeElv)},
        {name: 'dist', data: String('12')},
      ],
    )
      .then(resp => {
        // console.log(resp.data)
        const {selectedItems} = this.state;
        const data = JSON.parse(resp.data);
        const token = data.data; //"Don't touch this shit"
        const jwt = jwt_decode(token);
        const full = JSON.parse(jwt.data.data);
        // const full = data
        // console.log('this.state.id');
        // console.log(full);
        if (full.message || full.length == 0) {
          this.setState({
            selectedItems: [],
            // setModalVisible: false,
          });
          this.getBooks();
          return;
        } else {
          full.forEach(book => {
            const book_ids = JSON.parse(book.book_list);
            book['book_list'] = book_ids;
            book_ids.forEach(element => {
              const index = selectedItems.indexOf(element.book_id);
              if (!(index > -1)) {
                selectedItems.push(element.book_id);
                // setModalVisible: false,
              }
              // console.log(selectedItems);
            });
          });
        }
        this.setState({
          selectedItems: selectedItems,
          // setModalVisible: false,
        });
        this.getBooks();
      })
      .catch(err => {
        this.getBooks();
        console.log('error response');
        console.log(err);
      });
  };

  getBooks = async () => {
    const student = this.props.route.params.student;
    console.log(student);
    RNFetchBlob.fetch(
      'POST',
      mainDomain + 'getStudentBooks.php',
      {
        // Authorization: "Bearer access-token",
        // otherHeader: "foo",
        // 'Content-Type': 'multipart/form-data',
        'Content-Type': 'application/json',
      },
      [
        // to send data
        {name: 'parentId', data: String(this.state.id)},
        {name: 'division', data: String(student.FkCdDivisionActl)},
        {name: 'dist', data: String('12')},
      ],
    )
      .then(resp => {
        // console.log(resp.data)
        const data = JSON.parse(resp.data);
        const token = data.data; //"Don't touch this shit"
        const jwt = jwt_decode(token);
        const full = JSON.parse(jwt.data.data);
        // const full = data
        // console.log('this.state.id');
        // console.log(full);
        this.setState({
          data: full.message ? [] : full,
          dataClone: full,
          // setModalVisible: false,
          activityIndicator: false,
          // dataLoaded : true
        });
      })
      .catch(err => {
        this.setState({
          activityIndicator: false,
        });
        console.log('error response');
        console.log(err);
      });
  };

  getCartItems = async () => {
    const {selectedItems} = this.state;
    const student = this.props.route.params.student;
    const cart = await AsyncStorage.getItem('cart');
    if (cart != null) {
      const jsonCart = JSON.parse(cart);
      // console.log(jsonCart);
      this.setState({
        cartItemsCount: jsonCart.length,
      });
      const studentCart = await AsyncStorage.getItem(
        student.MatriculeElv + 'cart',
      );
      if (studentCart != null) {
        const jsonStudentCart = JSON.parse(studentCart);
        jsonStudentCart.forEach(element => {
          // console.log(element);
          selectedItems.push(element.book_id);
          this.setState({selectedItems: this.state.selectedItems});
        });
      }
    }
  };

  addToCart = async item => {
    // AsyncStorage.removeItem('cart')
    const {selectedItems} = this.state;
    selectedItems.push(item.book_id);
    const student = this.props.route.params.student;
    item.stdId = student.MatriculeElv;
    item.stdName = student.PrenomArElv;
    item.cart_id = String(Date.now());

    // console.log(item.cart_id);
    // return;
    const cart = await AsyncStorage.getItem(
      String(student.MatriculeElv) + 'cart',
    );
    if (cart != null) {
      const jsonCart = JSON.parse(cart);
      // console.log('sdfsdfdsfs');
      jsonCart.push(item);
      // console.log(jsonCart);
      // this.setState({
      //   cartItemsCount: jsonCart.length,
      // });
      AsyncStorage.setItem(
        String(student.MatriculeElv) + 'cart',
        JSON.stringify(jsonCart),
      );
    } else {
      AsyncStorage.setItem(
        String(student.MatriculeElv) + 'cart',
        JSON.stringify([item]),
      );
    }

    const sTotal = await AsyncStorage.getItem('cart');
    if (sTotal != null) {
      // console.log('1111111111');
      const total = JSON.parse(sTotal);
      total.push(item);
      // console.log(item);
      // console.log(total);
      // console.log(total.length);
      this.setState({
        cartItemsCount: total.length,
        selectedItems,
      });
      AsyncStorage.setItem('cart', JSON.stringify(total));
    } else {
      AsyncStorage.setItem('cart', JSON.stringify([item]));
      this.setState({
        cartItemsCount: 1,
        selectedItems,
      });
    }
  };

  checkItem = item => {
    // console.log(item)
    const {selectedItems} = this.state;
    const index = selectedItems.indexOf(item.book_id);
    if (index > -1) {
      // this.setState(this.state);
      return true;
    } else {
      return false;
    }
  };

  render() {
    if(this.state.activityIndicator){
      return(
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size='large' color="rgba(50,137,159,1)" />
        </View>
      )
    }
    return (
      <View style={styles.container}>
        {/* cart item */}
        <TouchableOpacity
          onPress={() => {
            // console.log('cart');
            this.props.navigation.navigate('Cart');
          }}
          style={styles.cartCont}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}> {this.state.cartItemsCount} </Text>
          </View>
          <Icon name="cart-outline" size={30} color="rgba(50,137,159,1)" />
        </TouchableOpacity>
        {/* cart item end */}
        <FlatList
          data={this.state.data}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={() => <View style={{height: 20}} />}
          ListFooterComponent={() => <View style={{height: 80}} />}
          numColumns={3}
          renderItem={({item, index}) => {
            // console.log(item)
            const image =
              item.img != ''
                ? {uri: assetsDomain + item.img}
                : require('./../Assets/feed.png');

            let selected = this.checkItem(item);
            return (
              <TouchableWithoutFeedback>
                <Surface style={styles.surface}>
                  <ImageBackground source={image} style={[styles.img]}>
                    <View
                      style={{
                        justifyContent: 'space-between',
                        width: '100%',
                      }}>
                      <View
                        style={{
                          alignItems: 'center',
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}>
                        {/* {selected ? (
                          <Icon
                            name="circle-off-outline"
                            color="#ef5350"
                            size={25}
                            style={{marginRight: 5}}
                          />
                        ) : (
                          <Icon
                            name="check-circle"
                            color="rgba(50,137,159,1)"
                            size={25}
                            style={{marginRight: 5}}
                          />
                        )} */}
                        {selected ? (
                          <View
                            style={{
                              padding: 5,
                              borderRadius: 50,
                              backgroundColor: '#FFF',
                            }}>
                            <Icon
                              name="circle-off-outline"
                              color="#ef5350"
                              size={20}
                              // style={{margin: 10}}
                            />
                          </View>
                        ) : (
                          <TouchableOpacity
                            style={{
                              padding: 5,
                              borderRadius: 50,
                              backgroundColor: '#FFF',
                            }}
                            onPress={() => {
                              // console.log('adding item to the cart');
                              this.addToCart(item);
                            }}>
                            <Icon
                              name="cart-plus"
                              color="#81c784"
                              size={20}
                              // style={{margin: 10}}
                            />
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                    <Text style={styles.name}>{item.price + ' دجـ'}</Text>
                  </ImageBackground>
                </Surface>
              </TouchableWithoutFeedback>
            );
          }}
        />
      </View>
    );
  }
}

export default ForSale;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 5,
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
  title: {
    fontFamily: 'Tajawal-Regular',
    fontSize: 18,
    // fontWeight: 'bold',
    color: '#075D54',
    margin: 5,
    marginRight: 15,
  },
  surface: {
    elevation: 5,
    height: 150,
    marginTop: 5,
    width: '30%',
    borderRadius: 10,
    // marginRight: 5,
    marginBottom: 10,
    marginLeft: 8,
    overflow: 'hidden',
    backgroundColor: '#e3e3e3',
  },
  img: {
    height: 150,
    width: '100%',
    borderRadius: 10,
    // padding: 10,
    alignItems: 'flex-end',
  },
  name: {
    textAlign: 'center',
    backgroundColor: 'rgba(50,137,159,0.5)',
    width: '90%',
    fontFamily: 'Tajawal-Regular',
    position: 'absolute',
    bottom: 10,
    left: 5,
    right: 5,
    borderRadius: 5,
    color: '#FFF',
    fontSize: 16,
  },
  footerContainer: {
    marginRight: 10,
    alignSelf: 'center',
    height: 145,
    backgroundColor: '#FFF',
    elevation: 5,
    paddingHorizontal: 10,
    marginTop: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
  footerText: {color: '#e3e3e3', fontFamily: 'Tajawal-Regular', fontSize: 16},
});
