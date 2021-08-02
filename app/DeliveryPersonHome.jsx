import React, { Component, useRef, useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    ImageBackground,
    Dimensions,
} from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';



export default function DeliveryPersonHome({ navigation, route }) {
    const winW = Dimensions.get('window').width;
    const winH = Dimensions.get('window').height;
    const [user, setUser] = useState()//אם יש משתמש מחובר היא מציגה אותו


    const [modalVisible, setModalVisible] = useState(false);//בשביל המודל
    const [hasPermission, setHasPermission] = useState(null);
    // const [type, setType] = useState(Camera.Constants.Type.back);

    const storeData = async (key, value) => {//פונציקה לאחסנת מידע באסיינסטורג
        console.log(`value`, value)
        try {
            const jsonValue = JSON.stringify(value)
            await AsyncStorage.setItem(key, jsonValue)
            console.log("ok")
        } catch (e) {
            console.log(`e`, e)
        }
    }
    const getData = async (key) => {//פונקציה לקבלת מידע מהאסיינסטורג
        try {
            const jsonValue = await AsyncStorage.getItem(key)
            return jsonValue != null ? JSON.parse(jsonValue) : null
        } catch (e) {
            // read error
        }
    }
    const removeValue = async (key) => {//פונקציה למחיקת מידע מהאסיינסטורג
        try {
            await AsyncStorage.removeItem(key)
            console.log(`true`)
        } catch (e) {
            console.log(`e`, e)
        }
        console.log('Done.')
    }
    function ServerApi() {// הלוקל הוסט
        const api = `http://ruppinmobile.tempdomain.co.il/site23`
        return api
    }
    useEffect(() => {//רינדור הדף והאזנה לכניסה מחדש לאותו מסך
        const unsubscribe = navigation.addListener('focus', () => {//מאזין כל פעם שהוא נכנס לדף ומפעיל את הפונקציות הנבחרות
            async function renderPage() {//כיוון שבעת מעבר העגלה נמחקת מהסטייט ..אז כאן היא מתרנדרת לפי האסיינסטורג
                let v = await getData("user") //המשתמש שמחובר באסיינסטורג
                if (v === undefined) {
                    await setUser(null)
                }
                else { await setUser(v) }
            }
            renderPage()
        });

        return unsubscribe
    }, [])

    const logOut = async () => {
        await removeValue("user")
        navigation.goBack()
    }



    return (
        <View style={{ backgroundColor: "#FFF", height: '100%', }}>
            <ImageBackground source={require('../assets/BG/two.png')} resizeMode="cover" style={{
                flex: 1,
                resizeMode: "cover",
            }} >
                <View style={[styles.header]}>
                    <TouchableOpacity onPress={() => navigation.openDrawer()}>
                        <Feather
                            name="menu"
                            size={30}
                            style={styles.menu}
                        />
                    </TouchableOpacity>
                    <Image
                        source={require('../assets/logoS2/d.png')}
                        resizeMode='contain'
                        style={{
                            marginTop: 50,
                            width: '55%',
                            height: 90,
                        }}
                    />
                    <TouchableOpacity onPress={() => logOut()}>
                        <Ionicons
                            name="arrow-back"
                            size={30}
                            style={styles.shoppingCart}
                        />
                    </TouchableOpacity>
                </View>
                <View>
                    {user == null ? null : <Text style={{
                        fontWeight: 'bold', fontSize: 22, color: "#9A7759",
                        marginLeft: 20,
                    }}> שלום {user.Name}</Text>}
                </View>
                <View style={[styles.catgor]}>
                    <TouchableOpacity onPress={() => navigation.navigate("DeliveryPersonOrdersScreen")}>
                        <Image
                            source={require('../assets/logoB/n.png')}
                            resizeMode='contain'
                            style={{
                                width: 105,
                                height: 120,
                                marginTop: 20,
                                padding: 15,
                            }}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate("HomeScreen")}>
                        <Image
                            source={require('../assets/logoB/o.png')}
                            resizeMode="contain"
                            style={{
                                width: 105,
                                height: 120,
                                marginTop: 20,
                                padding: 15,
                            }}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate("MapToResturantScreen")}>
                        <Image
                            source={require('../assets/logoS2/c.png')}
                            resizeMode="contain"
                            style={{
                                width: 105,
                                height: 120,
                                marginTop: 20,
                                padding: 15,
                            }}
                        />
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        </View >

    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,

    },
    action: {
        flexDirection: 'row',
        marginTop: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#949494',
        paddingBottom: 0,
        marginLeft: 30,
        marginRight: 30,
    },
    text_footer: {
        color: 'black',
        fontSize: 16,
        marginLeft: 25,
        fontWeight: "bold",
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: '5%'

    },
    menu: {
        marginTop: 50,
        color: 'black',
        backgroundColor: "#fff"
    },
    shoppingCart: {
        marginTop: 50,
        color: 'black'
    },
    cotert: {
        marginLeft: 45,
        fontSize: 30,
    },
    textPM: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    button: {
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    logina: {
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 18,

    },
    logina1: {
        padding: 10,
        marginRight: '55%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 18,
        marginLeft: '5%'
    },

    textlogin: {
        fontWeight: 'bold', fontSize: 15, color: "#9A7759",
    },
    modalView: {
        justifyContent: 'space-between',
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        marginTop: '50%',
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    openButton: {
        backgroundColor: '#F194FF',
        borderRadius: 10,
        padding: 10,
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        flexDirection: 'column',
        justifyContent: 'space-between',
        fontWeight: 'bold', fontSize: 17, color: "#9A7759"
    },
    catgor: {
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap'

    },

})


