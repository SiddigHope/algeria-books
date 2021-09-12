import React, {Component} from 'react';
import {View, Text} from 'react-native';

export default class AddStudent extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
          width: '100%',
          height: '100%',
          backgroundColor: '#FFF',
        }}
      />
    );
  }
}
