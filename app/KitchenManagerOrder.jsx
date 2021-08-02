import React, { Component, useEffect, useState ,useRef} from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    Alert,
    ScrollView,
    Dimensions,
    Modal,
    ImageBackground
} from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';


Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});




export default function KitchenManagerOrder({ navigation, route }) {
    const [modalVisible, setModalVisible] = useState(false);
    const winW = Dimensions.get('window').width;
    const winH = Dimensions.get('window').height;


    const [orders, setorders] = useState([{}]);
    const [Products, setProducts] = useState([]);

    const [expoPushToken, setExpoPushToken] = useState('');
    const [notification, setNotification] = useState(false);
    const notificationListener = useRef();
    const responseListener = useRef();


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
    const getProductsDetiles = (item) => {// שליפת כל המוצרים שהלקוח הזמין
        console.log(`item`, item)
        setModalVisible(true);
        fetch(`${ServerApi()}/api/ordersD`, {
            method: 'POST',
            body: JSON.stringify(item),
            headers: new Headers({
                'Content-type': 'application/json; charset=UTF-8',
                'Accept': 'application/json; charset=UTF-8'
            })
        })
            .then(res => {
                return res.json()
            })
            .then((result) => {
                console.log(`result`, result)
                setProducts(result)
            },
                (error) => {
                    console.log("err POST=", error)
                    Alert.alert("אופס", "ישנה בעיה בעת שליפת הנתונים אנא נסה שוב מאוחר יותר")
                })


    }
    useEffect(() => {//רינדור הדף והאזנה לכניסה מחדש לאותו מסך
        const unsubscribe = navigation.addListener('focus', () => {//מאזין כל פעם שהוא נכנס לדף ומפעיל את הפונקציות הנבחרות 
            console.log(`start`)
            GetOrder()
        });
        return unsubscribe
    })
    const GetOrder = async () => { // משיכת הזמנות
        fetch(`${ServerApi()}/api/orders`, {
            method: 'GET',
            headers: new Headers({
                'Content-type': 'application/json; charset=UTF-8',
                'Accept': 'application/json; charset=UTF-8'
            })
        })
            .then(res => {
                return res.json()
            })
            .then((result) => {
                setorders(result)
            },
                (error) => {
                    console.log("err POST=", error)
                    Alert.alert("אופס", "ישנה בעיה בעת שליפת הנתונים אנא נסה שוב מאוחר יותר")
                })


    }
    const updateD=(order)=>{ // משנה את הססטטוס הכנה של אותה הזמנה כדי שהשליח יראה את ההזמנה
        fetch(`${ServerApi()}/api/sendToDelivery`,{
            method: 'POST',
            body: JSON.stringify(order),
            headers: new Headers({
                'Content-type': 'application/json; charset=UTF-8',
                'Accept': 'application/json; charset=UTF-8'
            })
        })
            .then(res => {
                return res.json()
            })
            .then((result) => {
                console.log(`result`, result)
                Alert.alert("ברכות", "המנה הועברה לשליח, אנא החל בהכנות המנה הבאה")
                GetOrder()
            },
                (error) => {
                    console.log("err POST=", error)
                    Alert.alert("אופס", "ישנה בעיה בעת שליפת הנתונים אנא נסה שוב מאוחר יותר")
            })
        
    }
    const deleteOrder=async(order)=>{ // מוחק את ההזמנה הכל הטבלאות הקשורות לה לאחר סיום ההכנה
        console.log(`order.id`, order.id)
        if (order.id == 0) {
            console.log(`0`)
        }
        else {
            await fetch(`${ServerApi()}/api/getToken`, {
                method: 'POST',
                body: JSON.stringify(order.id),
                headers: new Headers({
                    'Content-type': 'application/json; charset=UTF-8',
                    'Accept': 'application/json; charset=UTF-8'
                })
            })
                .then(res => {
                    return res.json()
                })
                .then((result) => {
                    console.log(`result.token====`, result.token)
                    setExpoPushToken(result.token)
                },
                    (error) => {
                        console.log("err POST=", error)
                        Alert.alert("אופס", "ישנה בעיה בעת שליפת הנתונים אנא נסה שוב מאוחר יותר")
                    })
            await sendPush()
        }
        
        fetch(`${ServerApi()}/api/deleteorder`,{
            method: 'POST',
            body: JSON.stringify(order),
            headers: new Headers({
                'Content-type': 'application/json; charset=UTF-8',
                'Accept': 'application/json; charset=UTF-8'
            })
        })
            .then(res => {
                return res.json()
            })
            .then((result) => {
                console.log(`result`, result)
                GetOrder()
                Alert.alert("ברכות", "המנה הועברה ללקוח, אנא החל בהכנות המנה הבאה")
                
                
            },
                (error) => {
                    console.log("err POST=", error)
                    Alert.alert("אופס", "ישנה בעיה בעת שליפת הנתונים אנא נסה שוב מאוחר יותר")
            })
    }
     const del = (order) => {//מוחקת מוצר מהעגלת קניות 
        if (order.Delivery==false) {
            deleteOrder(order)
        }
        else{updateD(order)}
        
        
    }
    async function sendPush() {
        console.log(`expoPushToken`, expoPushToken)
        await fetch(`https://exp.host/--/api/v2/push/send`, {
            method: 'POST',
            body: JSON.stringify({
                to: expoPushToken,
                title: "ברכות 💯",
                body: 'המנה שלך מוכנה',
                data: { data: 'goes here' },
            }),
            headers: new Headers({
                'Content-type': 'application/json; charset=UTF-8',
                'Accept': 'application/json; charset=UTF-8'
            })
        })
            .then(res => {
                return res.json()
            })
            .then((result) => {
                console.log(`result`, result)
            },
                (error) => {
                    console.log("err POST=", error)
                })
    }


    return (
        <View style={{height:'100%'}}>
             <ImageBackground source={require('../assets/BG/ff.png')} resizeMode="cover" style={{
                flex: 1,
                resizeMode: "cover",
            }} >
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.openDrawer()}>
                    <Feather
                        name="menu"
                        size={30}
                        style={styles.menu}
                    />
                </TouchableOpacity>
                <Image
                    source={require('../assets/logos/15.png')}
                    resizeMode='contain'
                    style={{
                        marginTop: 50,
                        width: '55%',
                        height: 90,
                    }}
                />
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons
                        name="arrow-back"
                        size={30}
                        style={styles.shoppingCart}
                    />
                </TouchableOpacity>
            </View>

            <ScrollView style={{ marginBottom: 20 }}>
                {orders.map((order, index) => (
                    <View key={index}>
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center', margin: 10
                        }}>
                            <TouchableOpacity onPress={() => { del(order) }}>
                                <MaterialCommunityIcons
                                    name="send-check"
                                    size={30}
                                    style={styles.menu1}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => { getProductsDetiles(order) }}>
                                <View style={{
                                    width: winW - 100,
                                    height: 90,
                                    marginRight: 15,
                                    marginLeft: 15,
                                    borderRadius: 18,
                                    margin: 15,

                                }}>
                                    <LinearGradient
                                        colors={['#EECCA4', '#F7C891']}
                                        style={[styles.logina, {
                                            shadowColor: "#000",
                                            shadowOffset: {
                                                width: 0,
                                                height: 2,
                                            },
                                            shadowOpacity: 0.23,
                                            shadowRadius: 2.62,
                                            elevation: 4,
                                        }]}>
                                        <Text style={{ fontWeight: 'bold', fontSize: 16, color: "#9A7759", textAlign: 'center' }}>מנה מספר: {index + 1}</Text>
                                        <Text style={{ fontWeight: 'bold', fontSize: 16, color: "#9A7759", textAlign: 'center' }}>שם המזמין: {order.Name}</Text>
                                        <Text style={{ fontWeight: 'bold', fontSize: 16, color: "#9A7759", textAlign: 'center' }}>פאלפון: {order.Phone}</Text>
                                    </LinearGradient >
                                </View>
                            </TouchableOpacity>


                        </View>
                    </View>
                ))}</ScrollView>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    Alert.alert('Modal has been closed.');
                }}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={{ fontWeight: 'bold', fontSize: 29, color: "#9A7759", marginBottom: 20 }}>פרטי הזמנה:</Text>
                        {Products.map((Product,index) => (
                            <Text key={index} style={styles.modalText}>{'\u2b24'} {Product.Name}</Text>
                        ))}
                        < TouchableOpacity onPress={() => {
                            setModalVisible(!modalVisible);
                        }}>
                            <View>
                                <LinearGradient
                                    colors={['#EECCA4', '#F7C891']}
                                    style={[styles.logina]}>
                                    <Text style={styles.textlogin}>הסתר הזמנה</Text>
                                </LinearGradient >
                            </View>
                        </TouchableOpacity >

                    </View>

                </View>
            </Modal>
            </ImageBackground>
        </View >

    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-around',
     

    },
    menu: {
        marginTop: 50,
        color: 'black',
        backgroundColor: "#fff"
    },
    menu1: {
        color: 'green',
        marginLeft: 20,
        
    },
    menu2: {
        color: 'black',
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

    textlogin: {
        fontWeight: 'bold', fontSize: 15, color: "#9A7759",
    },

    //modal styel
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

})


