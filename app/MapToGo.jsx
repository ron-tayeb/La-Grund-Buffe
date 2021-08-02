import React, { Component, useState, useEffect, useRef } from "react";
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    Image,
    TouchableOpacity,
    Alert
} from "react-native";
import MapView from 'react-native-maps';
import { Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import { LinearGradient } from 'expo-linear-gradient';
import { NavigationApps, actions, googleMapsTravelModes } from "react-native-navigation-apps";



export default function MapToGo({ navigation, route }) {
    const MapAPI = '';
    const [origin, setOrigin] = useState(null)
    const winW = Dimensions.get('window').width;
    const winH = Dimensions.get('window').height;
    const [duration, setDuration] = useState(0)
    const mapEl = useRef(null);
    const [destination, setDestination] = useState({
        latitude: 32.31606215422522,
        longitude: 34.928572081567346,
        latitudeDelta: 0.000922,
        longitudeDelta: 0.000421

    });
    const [distance, setDistance] = useState(null);

    const [loc, setloc] = useState({
        latitude: 32.31606215422522,
        longitude: 34.928572081567346,
        latitudeDelta: 0.000922,
        longitudeDelta: 0.000421

    });

    useEffect(() => {
        (async function () {
            try {
                const { status, permissions } = await Permissions.askAsync(Permissions.LOCATION);
                if (status === 'granted') {
                    let location = await Location.getCurrentPositionAsync({ enableHighAccuracy: true });
                    setOrigin({
                        latitude: location.coords.latitude,
                        longitude: location.coords.longitude,
                        latitudeDelta: 0.000922,
                        longitudeDelta: 0.000421
                    })
                } else {
                    console.log("111111111111111111111111")
                    throw new Error('Location permission not granted');
                }
            } catch (error) {
                console.log("nanananananana")
                throw new Error('Location permission not granted');
            }
           
        })();
    }, []);
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', async () => {
            if (route.params == undefined || Object.keys(route.params).length === 0 && route.params.constructor === Object) {
                console.log("123")
            }
            else {
                console.log("123")
                setDestination(route.params.order.Address)
            }
            return unsubscribe
        }); 
    })

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                initialRegion={origin}
                showsUserLocation={true}
                zoomEnabled={true}
                loadingEnabled={true}
                ref={mapEl}
            >
                {destination &&
                    <MapViewDirections
                        mode={"DRIVING"}
                        origin={origin}
                        destination={destination}
                        apikey={MapAPI}
                        strokeWidth={5}
                        strokeColor={'#9600FF'}
                        onReady={result => {
                            // console.log(`result`, result)
                            setloc(result.coordinates[result.coordinates.length-1])
                            console.log(`loc`, loc)
                            setDuration(result.duration)
                            setDistance(result.distance);
                            mapEl.current.fitToCoordinates(
                                result.coordinates, {
                                edgePadding: {
                                    top: 50,
                                    bottom: 50,
                                    left: 50,
                                    right: 50
                                }
                            }
                            );
                        }
                        }
                    />}
                <Marker
                    coordinate={loc}
                    description={"This is a marker in React Natve"}>
                    <Image source={require('../assets/logoB/p.png')} style={{ height: 35, width: 35 }} />
                </Marker>
            </MapView>
            <View
                style={{
                    position: 'absolute',
                    bottom: 50,
                    left: 0,
                    right: 0,
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <View
                    style={{
                        width: 350,
                        paddingVertical: 20,
                        paddingHorizontal: 20,
                        borderRadius: 15,
                        backgroundColor: "white"
                    }}
                >
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ flex: 1, }}>
                            {/* מרחק&זמן */}
                            <View style={{ flexDirection: 'column', justifyContent: 'space-between' }}>
                                <Text>{distance &&
                                    <View style={styles.distance}>
                                        <Text style={styles.distance__text}>מרחק: {distance.toFixed(2).replace('.', ',')} ק"מ</Text>
                                    </View>
                                }</Text>
                                <Text>{duration &&
                                    <View style={styles.distance}>
                                        <Text style={styles.distance__text}>זמן משוער: {duration.toFixed(2).replace('.', ':')} ד"ק</Text>
                                    </View>
                                }</Text>
                                <View style={{ flexDirection: 'row' }}>

                                </View>
                            </View>
                        </View>
                    </View>

                    {/* כפתורים */}
                    <View
                        style={{
                            flexDirection: 'row',
                            marginTop: 20,
                            justifyContent: 'space-between'
                        }}
                    >
                        <TouchableOpacity
                            style={{ width: '100%' }}
                            onPress={() => { navigation.navigate("HomeScreen") }}
                        >
                            <LinearGradient
                                colors={['#EECCA4', '#F7C891']}
                                style={{
                                    flex: 1,
                                    height: 50,
                                    marginRight: 10,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: 10,

                                }}
                            >
                                <Text style={styles.textlogin}>חזור לדף בית</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            <View
                style={{
                    marginRight: "55%",
                    position: 'absolute',
                    bottom: 185,
                    right: 30,
                    width: 60,
                    height: 130,
                    justifyContent: 'space-between'
                }}
            >
                {/* פתח באמצעות */}
                <View style={{
                    width: 60,
                    height: 107,
                    borderRadius: 30,
                    backgroundColor: "white",
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <NavigationApps
                        iconSize={43}
                        waze={{ address: 'אחד העם 8', action: actions.navigateByAddress }}
                        googleMaps={{ address: 'אחד העם 8', action: actions.navigateByAddress }} />
                </View>
            </View>
        </View >
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center'
    },
    map: {
        marginTop: 30,
        height: "100%"
    },
    search: {
        height: '40%',
        color: 'black',
    },


    distance: {
        justifyContent: 'center',
        alignItems: 'center',

    },
    distance__text: {
        fontSize: 15,
        fontWeight: 'bold',

    },
    textlogin: {
        fontSize: 18,
        fontWeight: "bold",
        color: "white"
    },
});