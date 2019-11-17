/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import MapView,{ PROVIDER_GOOGLE, PROVIDER_DEFAULT } from 'react-native-maps';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar
} from 'react-native';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this._renderItemWithParallax = this._renderItemWithParallax.bind(this);
    this.state = {
        isMapReady: false,
    }
}
  render() {
    return (
      <View style={{ flex: 1, backgroundColor: 'yellow' }}>

        <MapView
          provider={PROVIDER_GOOGLE}
          style={{height:'100%',width:'100%'}}
          initialRegion={{
            //mohali lat long
            latitude: 30.7046,
            longitude: 76.7179,
            latitudeDelta: 0.5,
            longitudeDelta: 0.1,
          }}
          onPress={this._renderItemWithParallax}
          onLayout={this.onMapLayout}
        />
      </View>)
  }
  _renderItemWithParallax(abc, parallaxProps) {
    console.log(abc.nativeEvent.coordinate.latitude)
    console.log(abc.nativeEvent.coordinate.longitude)
    console.log(new Date().getTime())
       
}
  onMapTap = (coord,mapPoint) => {
    console.log(mapPoint)
  }
  onMapLayout = () => {
    this.setState({ isMapReady: true });
  }
}


