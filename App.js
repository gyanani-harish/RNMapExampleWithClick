/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import MapView, { PROVIDER_GOOGLE, PROVIDER_DEFAULT } from 'react-native-maps';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  FlatList
} from 'react-native';
const Realm = require('realm');

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this._renderItemWithParallax = this._renderItemWithParallax.bind(this);
    this.state = {
      isMapReady: false,
      realm: null
    }
  }
  componentWillMount() {
    Realm.open({
      schema: [{name: 'UserData', properties: {timestamp: 'string',lat:'string',lng:'string'}}]
    }).then(realm => {
      this.setState({ realm });
    });
  }
  render() {
    const info = this.state.realm
      ? this.state.realm.objects('UserData')
      : [];
    return (
      
      <View style={{ flex: 1, backgroundColor: 'yellow' }}>
        <FlatList 
          data={info}
          renderItem={({ item }) => (
            <Text>{item.lat+' '+item.lng+' '+item.timestamp}</Text>
          )}
        />
        <MapView
          provider={PROVIDER_GOOGLE}
          style={{ height: '50%', width: '100%' }}
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
    const context =this
    this.state.realm.write(() => {
      this.state.realm.create('UserData', {timestamp: ''+new Date().getTime(),
      lat:''+abc.nativeEvent.coordinate.latitude,
        lng:''+abc.nativeEvent.coordinate.longitude}
        );
        context.setState({realm:context.state.realm})
    });

  }
  onMapTap = (coord, mapPoint) => {
    console.log(mapPoint)
  }
  onMapLayout = () => {
    this.setState({ isMapReady: true });
  }
}


