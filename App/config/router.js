import React, {useState, useEffect} from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Dimensions,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon1 from 'react-native-vector-icons/Ionicons';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Home from '../screens/Home';
import Profile from '../screens/Profile';
import Contact from '../screens/Contact';
import _ from 'lodash';

const {width, height} = Dimensions.get('window');

const Tab = createBottomTabNavigator();

function Tabs({navigation}) {
  return (
    <>
      <Tab.Navigator
        initialRouteName="Home"
        tabBarOptions={{
          inactiveTintColor: 'gray',
          activeTintColor: '#32899F',
          showLabel: false,
          tabStyle: {
            backgroundColor: '#fff',
            height: 60,
            paddingBottom: 12,
            elevation: 15,
          },
        }}>
        <Tab.Screen
          name="Home"
          component={Home}
          options={{
            tabBarIcon: ({focused, color}) => (
              <>
                <Icon
                  name={focused ? 'home' : 'home-outline'}
                  size={28}
                  color={color}
                />
                <Text
                  style={{
                    color: focused ? '#32899F' : 'grey',
                    fontFamily: 'Tajawal-Regular',
                  }}>
                  {' '}
                  {'الرئيسية'}{' '}
                </Text>
              </>
            ),
          }}
        />
        <Tab.Screen
          name="Contact"
          component={Contact}
          options={{
            tabBarIcon: ({focused, color}) => (
              <>
                <Icon1
                  name={
                    focused
                      ? 'md-chatbubble-ellipses'
                      : 'md-chatbubble-ellipses-outline'
                  }
                  size={28}
                  color={color}
                />
                <Text
                  style={{
                    color: focused ? '#32899F' : 'grey',
                    fontFamily: 'Tajawal-Regular',
                  }}>
                  {' '}
                  {'التواصل'}{' '}
                </Text>
              </>
            ),
          }}
        />
      </Tab.Navigator>
    </>
  );
}

export default Tabs;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    // height: height
  },
  title: {
    fontSize: 24,
    fontFamily: 'Tajawal-Regular',
    // fontWeight: 'bold',
    color: '#e3e3e3',
    marginLeft: 15,
  },
  tabStyle: {
    backgroundColor: '#32899F',
  },
  active: {
    fontFamily: 'Tajawal-Regular',
    // backgroundColor: '#32899F',
    backgroundColor: '#32899F',
  },
  text: {
    fontFamily: 'Tajawal-Regular',
    color: '#e3e3e3',
  },
  imgBack: {
    height: 40,
    width: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  iconBack: {
    marginHorizontal: 5,
    height: 20,
    width: 20,
    borderRadius: 10,
    marginLeft: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  img: {
    height: 40,
    width: 40,
    borderRadius: 20,
  },
  dataContainer: {
    paddingHorizontal: 10,
    width: width - 160,
    // backgroundColor: 'red',
    justifyContent: 'center',
  },
  songtitle: {
    // backgroundColor: 'red',
    maxHeight: 20,
    fontFamily: 'Tajawal-Regular',
    fontSize: 16,
    color: '#444',
    marginBottom: 3,
  },
});
