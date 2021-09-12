import React, {Component} from 'react';
import {
  Text,
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default class CartItems extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cartItems: [],
    };
  }

  componentDidMount() {
    this.getCartItems();
  }

  getCartItems = async () => {
    const sCart = await AsyncStorage.getItem('cart');
    if (sCart != null) {
      this.setState({
        cartItems: JSON.parse(sCart),
      });
      return;
    }
    // console.log('sCart');
  };

  separator() {
    return (
      <View
        style={{height: 1, marginVertical: 5, backgroundColor: '#32899F'}}
      />
    );
  }

  deleteItem = async item => {
    const index = this.state.cartItems.indexOf(item);
    if (index > -1) {
      this.state.cartItems.splice(index, 1);

      const sStdItems = await AsyncStorage.getItem(String(item.stdId) + 'cart');
      if (sStdItems != null) {
        const stdItems = JSON.parse(sStdItems);
        const stdArray = [];
        stdItems.forEach(element => {
          if (element.cart_id != item.cart_id) {
            stdArray.push(element);
            AsyncStorage.setItem(
              String(item.stdId) + 'cart',
              JSON.stringify(stdArray),
            );
          }
        });
        AsyncStorage.setItem('cart', JSON.stringify(this.state.cartItems));
        this.setState({
          cartItems: this.state.cartItems,
        });
        Alert.alert('تم حذف الكتاب من السلة بنجاح');
      }
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <View
          style={[
            styles.newTopContainer,
            {backgroundColor: '#F9f9f9', height: 50},
          ]}>
          <View style={[styles.rowTopContainer]}>
            <View style={styles.rowTopData}>
              <Text style={styles.textTitle}> {'حذف'} </Text>
            </View>
            <View style={styles.rowTopData}>
              <Text style={styles.textTitle}> {'السعر'} </Text>
            </View>
            <View style={styles.rowTopData}>
              <Text style={styles.textTitle}> {'الكتاب'} </Text>
            </View>
            <View style={styles.rowTopData}>
              <Text style={styles.textTitle}> {'التلميذ'} </Text>
            </View>
          </View>
        </View>
        <FlatList
          data={this.state.cartItems}
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
            return (
              <>
                <View style={[styles.newContainer, {backgroundColor}]}>
                  <View style={[styles.rowContainer]}>
                    <TouchableOpacity
                      onPress={() => this.deleteItem(item.item)}
                      style={styles.rowData}>
                      <Icon
                        name="trash-can-outline"
                        color="#ef5350"
                        size={25}
                      />
                    </TouchableOpacity>
                    <View style={styles.rowData}>
                      <Text style={styles.content}> {item.item.price} </Text>
                    </View>
                    <View style={styles.rowData}>
                      <Text style={styles.content}>
                        {' '}
                        {item.item.arabic_name}{' '}
                      </Text>
                    </View>
                    <View style={styles.rowData}>
                      <Text style={styles.content}> {item.item.stdName} </Text>
                    </View>
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
    backgroundColor: '#FFF',
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
    // width: '95%',
    // backgroundColor: '#FFF',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginVertical: 5,
    marginBottom: 10,
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
    fontFamily: 'Tajawal-Regular',
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
});
