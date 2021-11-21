import React, {Component} from 'react';
import {Text, StyleSheet, View, FlatList, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {checkFile, getPermission, mainDomain, openPdf} from '../config/var';
import RNFetchBlob from 'rn-fetch-blob';
import {now} from 'moment';

export default class FreeComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
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
            <View style={styles.rowData}>
              {item.item.receipe != '0' ? (
                <Icon name="check-bold" color="#81c784" size={25} />
              ) : (
                <Icon name="close-thick" color="#ef5350" size={25} />
              )}
            </View>
            <View style={styles.rowData}>
              <Text style={styles.content}>
                {' '}
                {item.item.date.slice(0, 10)}{' '}
              </Text>
            </View>
            <View style={styles.rowData}>
              <Text style={styles.content}> {item.item.price} </Text>
            </View>
            <View style={styles.rowData}>
              <TouchableOpacity onPress={() => this.checkFile(item.item)}>
                <Icon
                  name="file-pdf"
                  size={25}
                  color={exists ? '#81c784' : '#e80242'}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </>
    );
  }
}
