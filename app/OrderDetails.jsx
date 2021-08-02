import React, { Component, useEffect, useState, useRef } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    ScrollView,
    TouchableOpacity,
    Alert,
    TextInput,
    Dimensions,
    Alert,

} from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { LinearGradient } from 'expo-linear-gradient';
import { Video, AVPlaybackStatus } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

export default function OrderDetails({ navigation, route }) {
    const video = React.useRef(null);//הצגת הוידיאו
    const [Adress, setAdress] = React.useState(""); //שמירת כתובת 
    const [Price, setPrice] = React.useState(0);//שמירת מחיר
    const [amount, setamount] = React.useState('');//שמירת כמות מוצרים
    const [name, setname] = React.useState("");//שמירת שם
    const [phone, setphone] = React.useState("");//שמירת פאלפון
    const [order, setOrder] = React.useState('');//מערך המוצרים
    const [showAdress, setshowAdress] = React.useState(false);//שינוי כפרור הרדיו
    const [PickFrom, setPickFrom] = React.useState(false);//שינוי כפרור הרדיו
    const [checkDetielsState, setcheckDetielsState] = React.useState(100);//בדיקה אם פרטים נכונים - במידה ולא יעודכן ל0
    const [destination, setDestination] = useState(null);//מאתר מיקום 
    const [rrr, setrrr] = React.useState('');//מערך המוצרים
    const winW = Dimensions.get('window').width;
    const winH = Dimensions.get('window').height;
    const MapAPI = '';// השלמה אוטומטית לכתובת

    const storeData = async (key, value) => {//פעולה המאחסנת מידע באסיינסטורג
        try {
            const jsonValue = JSON.stringify(value)
            await AsyncStorage.setItem(key, jsonValue)
        } catch (e) {
            console.log(`e`, e)
        }
    }
    const getData = async (key) => {//פעולה המקבלת מידע מהאסיינסטורג
        try {
            const jsonValue = await AsyncStorage.getItem(key)
            return jsonValue != null ? JSON.parse(jsonValue) : null
        } catch (e) {
            // read error
        }
    }
    const removeValue = async (key) => {//פעולה המוחקת מידע מהאסייסנסטורג
        try {
            await AsyncStorage.removeItem(key)
            console.log(`ok`)
        } catch (e) {
            console.log(`error remove`, e)
        }

        console.log('Done.')
    }
    function ServerApi() {// הלוקל הוסט
        const api = `http://ruppinmobile.tempdomain.co.il/site23`
        return api
    }
    useEffect(() => {//בדיקה אם יש מוצרים בעגלה במידה וכן מושכת אותם למשתנים ומעדכנת אותם בסטייט 
        const unsubscribe = navigation.addListener('focus', async () => {
            backpress()
            if (route.params == undefined || Object.keys(route.params).length === 0 && route.params.constructor === Object) {
                console.log(`route`, route)
                Alert.alert("אופס", "עגלת הקניות ריקה לכן לא קיימים פרטי הזמנה ")
                removeDetiels()
                navigation.navigate("HomeScreen")
            }
            else {
                console.log(`route.params.total`, route.params.total)
                // let order = route.params.endOrder;
                // let Price = route.params.total;
                let order = await getData("cart");
                let Price = await getData("price");
                let amount = order.length;
                setOrder(order)
                setPrice(Price)
                setamount(amount)
                console.log(Price)
            }
            return unsubscribe
        });
    }, [])
    useEffect(() => {//בדיקה אם יש מוצרים בעגלה במידה וכן מושכת אותם למשתנים ומעדכנת אותם בסטייט 
        console.log(11111111111111)
        let order = route.params.endOrder;
        let Price = route.params.total;
        let amount = order.length;
        setOrder(order)
        setPrice(Price)
        setamount(amount)
    }, [Price])
    const IPick = () => {//בחרית הכתפור רדיו
        if (PickFrom) {
            setPickFrom(false)

        }
        else
            setPickFrom(true)
        setshowAdress(false)
    }
    const showAdresso = () => { //בחרית הכתפור רדיו
        if (showAdress) {
            setshowAdress(false)
        }
        else
            setshowAdress(true)
        setPickFrom(false)
    }
    const delCart = async () => {//בעת שליחת הזמנה הפונקציה תמחוק את המוצרים מהעגלת קניות
        await removeValue("cart");
        await removeValue("sum")
        await removeValue("amount")
        await removeValue("price")
        setOrder('')
        setPrice('')
        setamount('')

    }
    const sendOrder = async () => {//שליחת ההזמנה להכנה
        let userid=0;
        let productNum = [];
        let userLogged = await getData("user")
        if (userLogged==null) {
             userid=0;
        }
        else{userid = userLogged.CustomersCode}                
        for (let i = 0; i < order.length; i++) {
            productNum.push(order[i].ProductCode)
        }
        setcheckDetielsState(100)
        let check = await checkDetiels()
        console.log(`check`, check)
        if (check === false) {
            return
        }
        else {

            const CustomerOrder = {
                Name: name,
                Phone: phone,
                Address: Adress,
                ProductsCode: productNum,
                OrderingProcess: "sendToPreparation",
                delivery: showAdress,
                id: userid
            }
            console.log(`CustomerOrder`, CustomerOrder)

            await fetch(`${ServerApi()}/api/createNewOrder`, {
                method: 'POST',
                body: JSON.stringify(CustomerOrder),
                headers: new Headers({
                    'Content-type': 'application/json; charset=UTF-8',
                    'Accept': 'application/json; charset=UTF-8'
                })
            })
                .then(res => {
                    console.log('res=', JSON.stringify(res))
                    return res.json()
                })
                .then((result) => {
                    delCart()
                    console.log("fetch POST", JSON.stringify(result))
                    if (showAdress) {
                        Alert.alert("ברכות", "ההזמנה שלך יצאה לדרך")
                        navigation.navigate("HomeScreen")
                    }
                    else {
                        Alert.alert("ברכות", "מייד תקבל מיקום למסעדה")
                        navigation.navigate("MapToResturantScreen")
                    }
                },
                    (error) => {
                        console.log("err POST=", error)
                    })
            removeDetiels()
        }
    }
    const checkDetiels = () => {//וולידציה לפרטי שליחת הזמנה להכנה
        if (name == "") {
            setcheckDetielsState(0)
            Alert.alert("אופס", "חסרים פרטים אנא השלם אותם ונסה שנית")
            console.log(`nameeem`)
            setname('')
            return false

        }
        if (phone == "" || phone.length < 10) {
            setcheckDetielsState(0)
            Alert.alert("אופס", "פאלפון לתיאום לא תקין אנא נסה שנית")
            console.log(`phonnnnnnnnnnn0`)
            setphone('')
            return false

        }
        if (phone[0] != 0) {
            setcheckDetielsState(0)
            Alert.alert("אופס", "מספר קידומת פאלפון לא תקין נסה שנית")
            console.log(`phonnnnnnnnnnn1`)
            setphone('')
            return false

        }
        if (phone[1] != 5) {
            setcheckDetielsState(0)
            Alert.alert("אופס", "מספר קידומת פאלפון לא תקין נסה שנית")
            console.log(`phonnnnnnnnnnn2`)
            setphone('')
            return false
        }
        if (phone[2] > 8 || phone[2] < 2) {
            setcheckDetielsState(0)
            Alert.alert("אופס", "מספר קידומת פאלפון לא תקין נסה שנית")
            console.log(`phonnnnnnnnnnn3`)
            setphone('')
            return false
        }
        if (showAdress == false && PickFrom == false) {
            setcheckDetielsState(0)
            Alert.alert("אופס", "אנא בחר דרכי איסוף")
            console.log(`esof`)
            return false
        }
        if (showAdress) {
            if (Adress === '' || Adress.length < 2) {
                setcheckDetielsState(0)
                Alert.alert("אופס", "כתובת לא תקינה")
                setAdress('')
                return false
            }
        }
        else { console.log() }
    }
    const removeDetiels = () => { //מוחקת את כל הפרטים של שמורים בסטייט 
        setOrder("");
        setshowAdress(false);
        setPickFrom(false);
        setphone("");
        setname("");
        setamount("");
        setPrice(0);
        setAdress("");
    }
    const backpress = async () => { // אם ההזמנה כבר יצאה והוא במסך מפות וחוזר אחרורה זה יעביר אותו לדף בית כדי שלא ישלח הזמנה נוספת
        const checkBack = await getData('cart')
        if (checkBack == null) {
            navigation.navigate("HomeScreen")
            Alert.alert("אופס", "ההזמנה כבר בוצעה ועגלת הקניות ריקה, להזמנה נוספת אנא הוסף מוצרים לעגלה ")

        }
        else return
    }

    return (
        <View>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.openDrawer()}>
                    <Feather
                        name="menu"
                        size={30}
                        style={styles.menu}
                    />
                </TouchableOpacity>
                <Image
                    source={require('../assets/logoS2/g.png')}
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
            <Video
                ref={video}
                style={{
                    width: winW,
                    height: 225,
                    position: 'absolute',
                    marginTop: '32%',
                }}
                source={{
                    uri: 'http://ruppinmobile.tempdomain.co.il/site23/Vadd/add.mp4',
                }}
                resizeMode="contain"
                isLooping
                onPlaybackStatusUpdate={() => { video.current.playAsync() }}
            />

            <ScrollView
                keyboardShouldPersistTaps='always'
                listViewDisplayed={false}
                style={{ marginBottom: 50 }}>
                <View style={{
                    flex: 2.5,
                    backgroundColor: 'white',
                    borderTopLeftRadius: 50,
                    borderTopRightRadius: 50,
                    paddingHorizontal: 20,
                    paddingVertical: 30,
                    marginTop: "65%"

                }}>
                    <View style={{ marginTop: 20, marginBottom: 20 }}>
                        <Text style={[styles.title, { marginBottom: 20 }]}>לפרטי הזמנה גלול למעלה:</Text>
                        <Text style={[styles.text_footer, {
                            marginBottom: 15
                        }]}>סה''כ לתשלום: {Price}₪</Text>
                        <Text style={styles.text_footer}>כמות מוצרים: {amount}</Text>
                        <Text style={[styles.title, {
                            marginTop: 20
                        }]}>פרטי לקוח:</Text>
                    </View>

                    <View style={{}}>
                        <Text style={styles.text_footer}>שם</Text>
                        <View style={styles.action}>
                            <FontAwesome
                                name="user-o"
                                color="black"
                                size={20}
                            />
                            <TextInput
                                placeholder="הכנס שם..."
                                keyboardType="email-address"
                                style={styles.textInput}
                                onChangeText={setname}
                                value={name}

                            />
                        </View>
                    </View>

                    <View style={{ marginTop: 20, marginBottom: 20 }}>
                        <Text style={styles.text_footer}>פאלפון</Text>
                        <View style={styles.action}>
                            <FontAwesome
                                name="mobile-phone"
                                color="black"
                                size={30}
                            />
                            <TextInput
                                placeholder="...הכנס פאלפון"
                                keyboardType='phone-pad'
                                style={styles.textInput}
                                onChangeText={setphone}
                                value={phone}

                            />
                        </View>
                    </View>
                    <View style={{ flexDirection: "row" }}>
                        <Text style={styles.text_footer}>שליח עד הבית</Text>
                        <Text style={styles.text_footer1}>מעדיף לאסוף מהמסעדה</Text>
                    </View>
                    <View style={{ flexDirection: "row" }}>
                        <View style={{}}>
                            <TouchableOpacity onPress={() => showAdresso()}>
                                {showAdress ?
                                    <Ionicons
                                        name="radio-button-on"
                                        color="black"
                                        size={30}
                                        style={{ marginLeft: "20%" }}
                                    /> :
                                    <Ionicons
                                        name="radio-button-off-sharp"
                                        color="black"
                                        size={30}
                                        style={{ marginLeft: "20%" }}
                                    />
                                }
                            </TouchableOpacity>
                        </View>
                        <View style={{}}>
                            <TouchableOpacity onPress={() => IPick()}>
                                {PickFrom ?
                                    <Ionicons
                                        name="radio-button-on"
                                        color="black"
                                        size={30}
                                        style={{ marginLeft: "40%" }}
                                    /> :
                                    <Ionicons
                                        name="radio-button-off-sharp"
                                        color="black"
                                        size={30}
                                        style={{ marginLeft: "40%" }}
                                    />
                                }
                            </TouchableOpacity>
                        </View>
                    </View>
                    {showAdress ?
                        <View style={{ marginTop: 20, marginBottom: 20 }}>
                            <Text style={styles.text_footer}>כתובת למשלוח</Text>
                            <View style={styles.action1}>
                                <Ionicons
                                    name="location-outline"
                                    color="black"
                                    size={26}
                                    style={{ marginTop: 10 }}
                                />
                                <GooglePlacesAutocomplete
                                    placeholder='הקלד כתובת'
                                    onPress={(data, details = null) => {
                                        let adress = data.description
                                        setAdress(adress)
                                        setDestination({
                                            latitude: details.geometry.location.lat,
                                            longitude: details.geometry.location.lng,
                                            latitudeDelta: 0.000922,
                                            longitudeDelta: 0.000421
                                        });
                                    }}
                                    query={{
                                        key: MapAPI,
                                        language: 'iw',
                                    }}
                                    enablePoweredByContainer={false}
                                    fetchDetails={true}
                                />
                            </View>
                        </View> : null}
                    <TouchableOpacity onPress={() => { sendOrder() }}>
                        <View style={[styles.button, { marginTop: 30, marginBottom: 100 }]} >
                            <LinearGradient
                                colors={['#EECCA4', '#F7C891']}
                                style={[styles.logina, {
                                    shadowColor: "#000",
                                    shadowOffset: {
                                        width: 0,
                                        height: 2,
                                    },
                                    shadowOpacity: 0.25,
                                    shadowRadius: 3.84,
                                    elevation: 5,

                                }]}>
                                <Text style={styles.textlogin}>המשך הזמנה</Text>
                            </LinearGradient >
                        </View>
                    </TouchableOpacity>
                </View>
            </ScrollView>

        </View >

    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    image: {
        backgroundColor: 'red',
        resizeMode: "cover",
        justifyContent: "flex-start"
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#FFF',

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
    radio: {
        marginRight: "80%",
        color: 'black',
        marginTop: 10
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
        marginTop: 0,
    },
    logina: {
        width: '80%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 18,
    },

    textlogin: {
        fontSize: 18,
        fontWeight: "bold",
        color: "white"
    },
    text_footer: {
        color: 'black',
        fontSize: 16,
        marginLeft: 25,
        fontWeight: "bold",


    },
    text_footer1: {
        color: 'black',
        fontSize: 16,
        direction: 'ltr',
        marginLeft: "12%",
        fontWeight: "bold",
    },
    title: {
        color: 'black',
        fontSize: 23,
        marginLeft: 25,
        fontWeight: "bold",

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
    textInput: {
        textAlign: 'right',
        flex: 1,
        paddingLeft: 10,
        color: "#56493C",
    },
    action1: {
        flexDirection: 'row',
        marginTop: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#949494',
        paddingBottom: 0,
        marginLeft: 30,
        marginRight: 30,
    },




})

