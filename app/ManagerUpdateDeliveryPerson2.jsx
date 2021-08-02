import React, { Component, useRef, useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    Alert,
    ImageBackground,
    Dimensions,
    TextInput
} from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function ManagerUpdateDeliveryPerson2({ navigation, route }) {
    const winW = Dimensions.get('window').width;
    const winH = Dimensions.get('window').height;

    const [renderScreen, setrenderScreen] = useState(false);


    const [modalVisible, setModalVisible] = useState(false);//בשביל המודל
    const [hasPermission, setHasPermission] = useState(null);
    // const [type, setType] = useState(Camera.Constants.Type.back);

    const [name, setName] = useState(null);
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const [conPass, setConPass] = useState(null);
    const [id,setID]=useState()


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
    useEffect(() => { 
        const unsubscribe = navigation.addListener('focus',async () => {//מאזין כל פעם שהוא נכנס לדף ומפעיל את הפונקציות הנבחרות
            let user = route.params.item
            setID(user.DeliveryPersonCode)
            setName(user.Name)
            setEmail(user.Email)
            setPassword(user.Password)
            setConPass(user.Password)
   
        });
        return unsubscribe
    })

    useEffect(() => {
        setrenderScreen(false)
    }, [renderScreen])



    const UpdateCustomer = async () => {
        let user = {
                Name: name,
                Email: email,
                Password: password,
                DeliveryPersonCode:id
            }
        await fetch(`${ServerApi()}/api/UpdateDeliveryPerson`, {
            method: 'POST',
            body: JSON.stringify(user),
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
                console.log("fetch POST", JSON.stringify(result))
                    Alert.alert("כל הכבוד", "עדכון שליח בוצע בהצלחה")
                    navigation.navigate("loginScreen")
            },
                (error) => {
                    console.log("err POST=", error)
                })
            setName("")
            setEmail("")
            setPassword("")
            setConPass("")
            setrenderScreen(true)
    }
    const userVal = () => {//וולידציה להרשמה שמפעילה את המטודה שמבצעת הרשמה
        var emailregex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/; // שימוש בריגיקס
        var pasRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,}$/;
        if (!(emailregex.test(email))) {
            Alert.alert("אופס", "האימל שהוכנס לא תואם לפורמט אנא נסה בפורמט הבא: name@example.com")
            setEmail("")
            return
        }
        if (!(pasRegex.test(password))) {
            Alert.alert("אופס", "הסיסמה צריכה להכיל לפחות: 8 תווים , אות גדולה , אות קטנה ,תו , ומספר")
            setPassword("")
            setConPass("")
            return
        }
        if (password !== conPass) {
            Alert.alert("אופס", "הסיסמאות לא זהות , אנא נסה שוב")
            setPassword("")
            setConPass("")
            return
        }
        else {
            UpdateCustomer();
        }

    }
    

    return (
        <View style={{ backgroundColor: "#FFF", height: '100%' }}>
            <ImageBackground source={require('../assets/BG/rr.png')} resizeMode="cover" style={{
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
                    source={require('../assets/logoS2/i.png')}
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

            <View>
                <View style={{}}>
                    <Text style={styles.text_footer}>שם</Text>
                    <View style={styles.action}>
                        <FontAwesome
                            name="user-o"
                            color="black"
                            size={20}
                            style={{ paddingLeft: 10 }}
                        />
                        <TextInput
                            placeholder="הכנס שם..."
                            style={styles.textInput}
                            onChangeText={setName}
                            value={name}
                        />
                    </View>
                </View>

                <View style={{ marginTop: 20, marginBottom: 20 }}>
                    <Text style={styles.text_footer}>אימייל</Text>
                    <View style={styles.action}>
                        <FontAwesome
                            name="user-o"
                            color="black"
                            size={20}
                            style={{ paddingLeft: 10 }}
                        />
                        <TextInput
                            placeholder="הכנס אימייל..."
                            keyboardType='email-address'
                            style={[styles.textInput, { textAlign: 'right' }]}
                            onChangeText={setEmail}
                            value={email}

                        />
                    </View>
                </View>

                <View style={{ marginTop: 20, marginBottom: 20 }}>
                    <Text style={styles.text_footer}>סיסמא</Text>
                    <View style={styles.action}>
                        <Feather
                            name="lock"
                            color="black"
                            size={20}
                             style={{ paddingLeft: 10 }}
                        />
                        <TextInput
                            placeholder="הכנס סיסמא..."
                            style={[styles.textInput, { textAlign: 'right' }]}
                            onChangeText={setPassword}
                            value={password}
                            secureTextEntry={true}

                        />
                    </View>
                </View>
                <View style={{ marginTop: 20, marginBottom: 20 }}>
                    <Text style={styles.text_footer}>אמת סיסמא</Text>
                    <View style={styles.action}>
                        <Feather
                            name="lock"
                            color="black"
                            size={20}
                             style={{ paddingLeft: 10 }}
                        />
                        <TextInput
                            placeholder="הכנס סיסמא שוב..."
                            style={[styles.textInput, { textAlign: 'right' }]}
                            onChangeText={setConPass}
                            value={conPass}
                            secureTextEntry={true}

                        />
                    </View>
                </View>
                <TouchableOpacity onPress={() => { userVal() }}>
                    <View style={[styles.button, { marginTop: 30, }]} >
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
                            <Text style={styles.textlogin}>          ערוך שליח          </Text>
                        </LinearGradient >
                    </View>
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

})


