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
    props.navigator.navigate('Login', {navigation: props.navigator});
  };

  return (
    <ScrollView style={{backgroundColor: '#e3e3e3'}}>
      <View
        style={{
          paddingVertical: 16,
          paddingTop: 20,
          backgroundColor: '#32899F',
          height: height - (65 * height) / 100,
        }}>
        <Text style={styles.name}>
          {'الجمهورية الجزائرية الديمقراطية الشعبية'}
        </Text>
        <Image
          source={require('./../Assets/hilal.png')}
          style={styles.profile}
        />
        <Text style={styles.uname}>{'وزارة التربية الوطنية'}</Text>
      </View>

      <View style={styles.container}>
        <List>
          <ListItem>
            <Body>
              <TouchableOpacity
                style={styles.item}
                onPress={() =>
                  props.navigator.navigate('Cart', {
                    navigation: props.navigator,
                  })
                }>
                <Text style={{fontFamily: 'Tajawal-Regular'}}>
                  {'  سلة المستريات '}
                </Text>
                <Icon
                  style={styles.icon}
                  name="cart-outline"
                  color="#000"
                  size={20}
                />
              </TouchableOpacity>
            </Body>
          </ListItem>

          <ListItem>
            <Body>
              <TouchableOpacity
                style={styles.item}
                onPress={() =>
                  props.navigator.navigate('Sales', {
                    navigation: props.navigator,
                  })
                }>
                <Text style={{fontFamily: 'Tajawal-Regular'}}>
                  {'  المشتريات '}
                </Text>
                <Icon style={styles.icon} name="sale" color="#000" size={20} />
              </TouchableOpacity>
            </Body>
          </ListItem>

          <ListItem>
            <Body>
              <TouchableOpacity onPress={() => signout()} style={styles.item}>
                <Text style={{fontFamily: 'Tajawal-Regular'}}>
                  {' '}
                  {'تسجيل خروج'}{' '}
                </Text>
                <Icon
                  style={styles.icon}
                  name="logout"
                  color="#000"
                  size={20}
                />
              </TouchableOpacity>
            </Body>
          </ListItem>
        </List>
      </View>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e3e3e3',
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
    flexDirection: 'row',
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  badge: {
    fontFamily: 'Tajawal-Regular',
    backgroundColor: '#81c784',
    height: 25,
    width: 25,
    borderRadius: 13,
    textAlign: 'center',
    marginRight: 10,
    textAlignVertical: 'center',
  },
});
