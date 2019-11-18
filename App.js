/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */
import renderIf from 'render-if'
import React from 'react';
import { PermissionsAndroid, ActivityIndicator } from 'react-native';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
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
      realm: null,
      receivedCurrentLocation: false
    }
  }
  componentWillMount() {
    Realm.open({
      schema: [{ name: 'UserData', properties: { timestamp: 'string', lat: 'string', lng: 'string' } }]
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
            <Text>{item.lat + ' ' + item.lng + ' ' + item.timestamp}</Text>
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
        {renderIf(!this.state.receivedCurrentLocation)(
          <View style={{
            width: '100%', backgroundColor: '#4444',
            alignItems: 'center', justifyContent: 'center',
            position: 'absolute', height: '100%'
          }}><ActivityIndicator size="large" color="#0000ff" />
            <Text style={{ color: 'black', fontSize: 24 }}>Getting Location...</Text></View>
        )}

      </View>)
  }
  _renderItemWithParallax(abc, parallaxProps) {
    console.log(abc.nativeEvent.coordinate.latitude)
    console.log(abc.nativeEvent.coordinate.longitude)
    console.log(new Date().getTime())
    const context = this
    this.state.realm.write(() => {
      this.state.realm.create('UserData', {
        timestamp: '' + new Date().getTime(),
        lat: '' + abc.nativeEvent.coordinate.latitude,
        lng: '' + abc.nativeEvent.coordinate.longitude
      }
      );
      context.setState({ realm: context.state.realm })
    });

  }
  componentDidMount() {
    this.askPermissions(this);

  }
  askPermissions(context) {
    //Checking for the permission just after component loaded
    async function requestLocationPermission() {
      console.log('requestLocationPermission');
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('granted');
          console.log('show location dialog if gps is off');
          //To Check, If Permission is granted
          RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({ interval: 10000, fastInterval: 5000 })
            .then(data => {
              console.log('enabled or already enabled gps');
              // The user has accepted to enable the location services
              // data can be :
              //  - "already-enabled" if the location services has been already enabled
              //  - "enabled" if user has clicked on OK button in the popup
              navigator.geolocation.getCurrentPosition(
                (position) => {
                  console.log("current position");
                  console.log(position);
                  if (context._isMounted) {
                    context.setState({
                      currentLocation: {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                      },
                      receivedCurrentLocation: true,

                    })
                  }
                },
                (error) => console.log(error),
                { enableHighAccuracy: true, timeout: 200000, maximumAge: 2000000 },
              );
            }).catch(err => {

              // The user has not accepted to enable the location services or something went wrong during the process
              // "err" : { "code" : "ERR00|ERR01|ERR02", "message" : "message"}
              // codes : 
              //  - ERR00 : The user has clicked on Cancel button in the popup
              //  - ERR01 : If the Settings change are unavailable
              //  - ERR02 : If the popup has failed to open
              console.log(err)
              if (err && err.code === 'ERR00') {
                BackHandler.exitApp()
              }
            });
        } else {
          console.log('permission denied');
          BackHandler.exitApp()

        }
      } catch (err) {
        console.log('error in runtime permission block');
        console.warn(err)
      }
    }
    if (Platform.OS === 'android') {
      //Calling the permission function
      requestLocationPermission();
    }
  }
  onMapTap = (coord, mapPoint) => {
    console.log(mapPoint)
  }
  onMapLayout = () => {
    this.setState({ isMapReady: true });
  }
}


