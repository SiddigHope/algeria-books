import React, {useState, useEffect} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {List, ListItem, Right, Body} from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import _ from 'lodash';
import moment from 'moment';
//import FastImage from 'react-native-fast-image'

const {width, height} = Dimensions.get('window');

export default SideBar = props => {
  const signout = async () => {
    // AsyncStorage.clear();
    props.navigator.navigate('Login', {
      navigation: props.navigator,
      login: true,
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.item}
        onPress={() =>
          props.navigator.navigate('Cart', {
            navigation: props.navigator,
          })
        }>
        <Icon style={styles.icon} name="cart-outline" color="#000" size={20} />
        <Text style={{fontFamily: 'Tajawal-Regular', textAlign: 'center'}}>
          {'السلة '}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.item}
        onPress={() =>
          props.navigator.navigate('Sales', {
            navigation: props.navigator,
          })
        }>
        <Icon style={styles.icon} name="sale" color="#000" size={20} />
        <Text style={{fontFamily: 'Tajawal-Regular', textAlign: 'center'}}>{'  المشتريات '}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.item}
        onPress={() =>
          props.navigator.navigate('OrdersStatus', {
            navigation: props.navigator,
          })
        }>
        <Icon style={styles.icon} name="bookmark-check-outline" color="#000" size={20} />
        <Text style={{fontFamily: 'Tajawal-Regular', textAlign: 'center'}}>{'  حالة الطلبات '}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => signout()} style={styles.item}>
        <Icon style={styles.icon} name="logout" color="#000" size={20} />
        <Text style={{fontFamily: 'Tajawal-Regular', textAlign: 'center'}}> {'تسجيل خروج'} </Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    width,
    height: (height * 10) / 100,
    backgroundColor: '#FFF',
    // position: 'absolute',
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  icon: {
    marginRight: 5,
  },
  profile: {
    width: '80%',
    height: '60%',
    alignSelf: 'center',
  },
  name: {
    fontFamily: 'Tajawal-Regular',
    color: '#fff',
    // backgroundColor: 'red',
    fontSize: 16,
    marginVertical: 10,
    textAlign: 'center',
  },
  uname: {
    fontFamily: 'Tajawal-Regular',
    color: 'rgba(255,255,255,0.8)',
    marginLeft: 4,
    textAlign: 'center',
    marginTop: 10,
  },
  item: {
    flex: 1,
    // paddingHorizontal: 10,
    alignItems: 'center',
  },
});
