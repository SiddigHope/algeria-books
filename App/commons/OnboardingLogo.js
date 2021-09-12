import React from 'react';
import {Text, Image, StyleSheet, View, Dimensions} from 'react-native';
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const {width, height} = Dimensions.get('window');

const zoomIn = {
  0: {
    scale: 0,
  },
  0.5: {
    scale: 0.5,
  },
  1: {
    scale: 1,
  },
};

const OnboardingLogo = () => (
  <View center style={{width, height}}>
    <Image
      source={require('./../Assets/bookSplashTop.png')}
      style={styles.header}
    />

    <Image
      source={require('./../Assets/headerSplash.png')}
      style={styles.footer}
    />

    <View
      style={{
        paddingVertical: 16,
        marginTop: '30%',
        // paddingTop: 10,
        height: height - (50 * height) / 100,
      }}>
      <Text style={styles.name}>
        {'الجمهورية الجزائرية الديمقراطية الشعبية'}
      </Text>
      <Text style={styles.uname}>{'وزارة التربية الوطبية'}</Text>
      <Animatable.Image
        animation={zoomIn}
        source={require('./../Assets/splashCenter.png')}
        style={styles.profile}
      />
    </View>
    <View style={styles.imageContainer}>
      <Text style={styles.appname}> {'كتبي'} </Text>
      <Text style={styles.version}> {'النسخة 1.00'} </Text>
    </View>
    <View style={styles.vesionContainer} />
    <View style={{flexDirection: 'row', alignSelf: 'center', marginBottom: 20}}>
      <Text
        style={{fontFamily: 'Tajawal-Bold', fontSize: 14, color: '#FFF'}}>
        {' جميع الحقوق محفوظة '}
        {' لوزارة التربية الوطنية 2021 '}
      </Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  appname: {
    // backgroundColor: 'red',
    color: '#32899F',
    fontFamily: 'Tajawal-Bold',
    fontSize: 70,
    // zIndex: 100000000,
  },
  header: {
    // backgroundColor: 'red',
    width: '100%',
    height: '40%',
    position: 'absolute',
  },
  footer: {
    // backgroundColor: 'red',
    width: '100%',
    height: '25%',
    bottom: 0,
    transform: [{rotate: '180deg'}],
    position: 'absolute',
  },
  image: {
    width: width - (25 * width) / 100,
    height: height - (70 * height) / 100,
    // backgroundColor: 'red'
  },
  imageContainer: {
    alignSelf: 'center',
    marginTop: 10,
  },
  profile: {
    marginTop: 10,
    width: '95%',
    height: '75%',
    alignSelf: 'center',
  },
  icon: {
    marginRight: 5,
  },
  name: {
    fontFamily: 'Tajawal-Bold',
    color: '#32899F',
    maxWidth: width - 30,
    alignSelf: 'flex-end',
    marginRight: 10,
    fontSize: 18,
    marginVertical: 10,
    textAlign: 'center',
  },
  uname: {
    fontFamily: 'Tajawal-Regular',
    // color: "rgba(255,255,255,0.8)",
    marginLeft: 4,
    color: '#32899F',
    textAlign: 'center',
    fontSize: 17,
    // marginTop: 10,
  },
  version: {
    fontFamily: 'Tajawal-Bold',
    // color: "rgba(255,255,255,0.8)",
    color: '#32899F',
    textAlign: 'center',
    fontSize: 12,
    position: 'absolute',
    // backgroundColor: 'red',
    top: '78%',
    left: '23%',
    zIndex: 100000000,
  },
  vesionContainer: {
    flex: 1,
    // backgroundColor: 'red',
    justifyContent: 'flex-end',
    // backgroundColor:'red'
  },
});

export default OnboardingLogo;
