import React, {Component} from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  TouchableOpacity,
  Linking,
} from 'react-native';

import RNCamera from 'react-native-camera';

import QRCodeScanner from 'react-native-qrcode-scanner';

export default class ScanScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
        qrcode: ''
    }
}
  onSuccess = (e) => {
    this.setState({qrcode: e.data})
    let info = JSON.parse(e.data)
    // console.log(info)
    this.props.pendingPayment(info)
    // Linking
    //   this.setState({qrcode: e.data})
    //   .catch(err => console.error('An error occured', err));
  }

  render() {
    return (
      <QRCodeScanner
        onRead={this.onSuccess}
        topContent={
          <Text style={styles.centerText}>
          </Text>
        }
        bottomContent={
          <TouchableOpacity style={styles.buttonTouchable}>
            <Text style={styles.buttonText}>{this.state.qrcode}</Text>
          </TouchableOpacity>
        }
      />
    );
  }
}

const styles = StyleSheet.create({
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: '#777',
  },
  textBold: {
    fontWeight: '500',
    color: '#000',
  },
  buttonText: {
    fontSize: 21,
    color: 'rgb(0,122,255)',
  },
  buttonTouchable: {
    padding: 16,
  },
});

// AppRegistry.registerComponent('default', () => ScanScreen);
