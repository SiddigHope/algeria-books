import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text,
  FlatList,
  Dimensions,
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
import {assetsDomain, mainDomain} from '../config/var';
const {width, height} = Dimensions.get('window');
// import {download} from '../config/service';

class ForSale extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      id: '',
      dataClone: [],
      cartItemsCount: 0,
    };
  }

  componentDidMount() {
    this.getCartItems();
    this.checkUser();
    // AsyncStorage.clear()
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
        ActivityIndicator: false,
      });
      this.getBooks();
    }
  };

  getBooks = async () => {
    const student = this.props.route.params.student;
    // console.log(student);
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
        {name: 'division', data: String(student.FkCdDivisionActl.slice(0, 5))},
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
        // console.log(this.state.id)
        // console.log(full);
        this.setState({
          data: full.message ? [] : full,
          dataClone: full,
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

  getCartItems = async () => {
    const cart = await AsyncStorage.getItem('cart');
    if (cart != null) {
      const jsonCart = JSON.parse(cart);
      // console.log(jsonCart);
      this.setState({
        cartItemsCount: jsonCart.length,
      });
    }
  };

  addToCart = async item => {
    // AsyncStorage.removeItem('cart')
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
      console.log('sdfsdfdsfs');
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
      console.log('1111111111');
      const total = JSON.parse(sTotal);
      total.push(item);
      // console.log(item);
      // console.log(total);
      // console.log(total.length);
      this.setState({
        cartItemsCount: total.length,
      });
      AsyncStorage.setItem('cart', JSON.stringify(total));
    } else {
      AsyncStorage.setItem('cart', JSON.stringify([item]));
      this.setState({
        cartItemsCount: 1,
      });
    }
  };

  render() {
    return (
      <View style={styles.container}>
        {/* cart item */}
        <TouchableOpacity
          onPress={() => {
            console.log('cart');
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
          numColumns={2}
          renderItem={({item, index}) => {
            // console.log(item)
            let name = 'files';
            const image =
              item.img != ''
                ? {uri: assetsDomain + item.img}
                : require('./../Assets/feed.png');
            return (
              <TouchableWithoutFeedback>
                <Surface style={styles.surface}>
                  <ImageBackground source={image} style={styles.img}>
                    <View style={{justifyContent: 'space-evenly'}}>
                      <View style={{alignItems: 'flex-start'}}>
                        <TouchableOpacity
                          onPress={() => {
                            console.log('adding item to the cart');
                            this.addToCart(item);
                          }}>
                          <Icon
                            name="cart-plus"
                            color="rgba(50,137,159,1)"
                            size={25}
                            style={{marginRight: 5}}
                          />
                        </TouchableOpacity>
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
    width: 150,
    borderRadius: 10,
    marginRight: 10,
    marginBottom: 10,
    marginLeft: 15,
    overflow: 'hidden',
    backgroundColor: '#e3e3e3',
  },
  img: {
    height: 150,
    width: 150,
    borderRadius: 10,
    padding: 10,
    alignItems: 'flex-end',
  },
  name: {
    textAlign: 'center',
    backgroundColor: 'rgba(50,137,159,0.5)',
    width: (width * 40) / 100,
    fontFamily: 'Tajawal-Regular',
    position: 'absolute',
    bottom: 10,
    left: 7,
    borderRadius: 5,
    color: '#e3e3e3',
    // fontWeight: 'bold',
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
