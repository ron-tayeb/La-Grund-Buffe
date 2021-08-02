import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    Image,
    TouchableOpacity,
    ScrollView,
    Alert,ImageBackground ,Platform 

} from "react-native";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';


class SingUp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            check_textInputChange: false,
            check_textEmailInputChange: false,
            password: '',
            secureTextEntry: true,

            name: '',
            email: '',
            conpassword: '',
            CustomersCode: 0,
        }
    }

    ServerApi() {// הלוקל הוסט
        const api = `http://ruppinmobile.tempdomain.co.il/site23`
        return api
    }
    textInputChange(value) {//מפעילה סמן ירוק כשהמשתמש הכניס תו אחד לשם
        if (value.length !== 0) {
            this.setState({
                check_textInputChange: true
            })
        }
        else {
            this.setState({
                check_textInputChange: false
            })
        }
        this.setState({

        })
    }
    textEmailInputChange(value) {// מטודה שמפעילה סמן ירוק בעת הכנסת איימל נכון
        var emailregex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/; // שימוש בריגיקס
        if (emailregex.test(value)) {
            this.setState({
                check_textEmailInputChange: true
            })
        }
        else {
            this.setState({
                check_textEmailInputChange: false
            })
        }
        this.setState({

        })
    }
    secureTextEntry = () => {// מטודה שגורמת לסיסמה להיראות או לא בעזרת לחצן
        this.setState({
            secureTextEntry: !this.state.secureTextEntry
        })
    }
    CreateUser = async () => {// ביצוע הרשמה לטבלת נתונים
        let token = await this.registerForPushNotificationsAsync()
        console.log("token",token)
        const user = {
            Name: this.state.name,
            Email: this.state.email,
            Password: this.state.password,
            token: token
        }

        fetch(`${this.ServerApi()}/api/createNewuser`, {
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
                if (JSON.stringify(result) == 1) {
                    Alert.alert("כל הכבוד", "נרשמת בהצלחה, כעת נשאר רק להתחבר")
                    this.textInputName.clear();
                    this.textInputEmail.clear();
                    this.props.navigation.navigate("loginScreen")
                    this.textInputPass.clear();
                    this.textInputPass1.clear();
                    this.textInputPass2.clear();
                    this.textInputPass3.clear();
                    
                }
                else {
                    Alert.alert("אופס", "אימייל זה קיים במערכת אנא נסה שוב")
                    this.textInputName.clear();
                    this.textInputEmail.clear();
                    this.textInputPass.clear();
                    this.textInputPass1.clear();
                    this.textInputPass2.clear();
                    this.textInputPass3.clear();
                }



            },
                (error) => {
                    console.log("err POST=", error)
                })

    }
    userVal = () => {//וולידציה להרשמה שמפעילה את המטודה שמבצעת הרשמה
        var emailregex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/; // שימוש בריגיקס
        var pasRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,}$/;
        if (!(emailregex.test(this.state.email))) {
            Alert.alert("אופס", "האימל שהוכנס לא תואם לפורמט אנא נסה בפורמט הבא: name@example.com")
            this.textInputEmail.clear();
            return
        }
        if (!(pasRegex.test(this.state.password))) {
            Alert.alert("אופס", "הסיסמה צריכה להכיל לפחות: 8 תווים , אות גדולה , אות קטנה ,תו , ומספר")
            this.textInputPass.clear();
            this.textInputPass1.clear();
            this.textInputPass2.clear();
            this.textInputPass3.clear();
            return
        }
        if (this.state.password !== this.state.conpassword) {
            Alert.alert("אופס", "הסיסמאות לא זהות , אנא נסה שוב")
            this.textInputPass.clear();
            this.textInputPass1.clear();
            this.textInputPass2.clear();
            this.textInputPass3.clear();
            return
        }
        else {
            this.CreateUser();
        }

    }
    componentDidMount() {//דואג לרנדור מחדש של הדף במקרה של חזרה אליו
        this._unsubscribeFocus = this.props.navigation.addListener('focus', (payload) => {
            console.log('will focus', payload);
            this.setState({ stam: 'will focus ' + new Date().getSeconds() });
        });
    }
    componentWillUnmount() {//דואג לרנדור מחדש של הדף במקרה של חזרה אליו
        this._unsubscribeFocus();
    }
    async registerForPushNotificationsAsync() {
        let token;
        if (Constants.isDevice) {
          const { status: existingStatus } = await Notifications.getPermissionsAsync();
          let finalStatus = existingStatus;
          if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
          }
          if (finalStatus !== 'granted') {
            alert('Failed to get push token for push notification!');
            return;
          }
          token = (await Notifications.getExpoPushTokenAsync()).data;
          console.log(token);
        } else {
          alert('Must use physical device for Push Notifications');
        }
      
        if (Platform.OS === 'android') {
          Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
          });
        }
        return token;
      }

    render() {
        return (
            <View style={[styles.container]}>
                <ImageBackground source={require('../assets/BG/rr.png')} resizeMode="cover" style={styles.image} >
                <View style={styles.header1}>
                    <TouchableOpacity onPress={() => this.props.navigation.openDrawer()}>
                        <Feather
                            name="menu"
                            size={30}
                            style={[styles.menu, { marginLeft: 15 }]}
                        />
                    </TouchableOpacity>
                    <Image
                        source={require('../assets/logos/17.png')}
                        resizeMode='contain'
                        style={{
                            marginTop: 95,
                            width: '60%',
                            height: 90,
                            marginRight: 25
                        }}
                    />
                    <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                        <Ionicons
                            name="arrow-back"
                            size={30}
                            style={styles.shoppingCart}
                        />
                    </TouchableOpacity>
                </View>
                <View style={styles.footer}>
                    <ScrollView>


                        <Text style={styles.text_footer}>שם פרטי</Text>
                        <View style={styles.action}>
                            <FontAwesome
                                name="user-o"
                                color="#EECCA4"
                                size={20}
                            />
                            <TextInput
                                ref={input => { this.textInputName = input }}
                                placeholder="הכנס שם..."
                                style={styles.textInput}
                                onChange={(text) => this.textInputChange(text)}
                                onChangeText={(text) => this.setState({ name: text })}

                            />
                            {this.state.check_textInputChange ?
                                <Feather
                                    name="check-circle"
                                    color="green"
                                    size={20}
                                />
                                : null}
                        </View>

                        <Text style={[styles.text_footer, { marginTop: 35 }]}>אימייל</Text>
                        <View style={styles.action}>
                            <FontAwesome
                                name="user-o"
                                color="#EECCA4"
                                size={20}
                            />
                            <TextInput
                                ref={input => { this.textInputEmail = input }}
                                placeholder="הכנס אימייל..."
                                keyboardType="email-address"
                                style={styles.textInput}
                                onChange={(text) => this.textEmailInputChange(this.state.email)}
                                onChangeText={(text) => this.setState({ email: text })}
                            />
                            {this.state.check_textEmailInputChange ?
                                <Feather
                                    name="check-circle"
                                    color="green"
                                    size={20}
                                />
                                : null}
                        </View>
                        <Text style={[styles.text_footer, {
                            marginTop: 35
                        }]}>סיסמא</Text>
                        <View style={styles.action}>
                            <Feather
                                name="lock"
                                color="#EECCA4"
                                size={20}
                            />
                            {this.state.secureTextEntry ?

                                <TextInput
                                    ref={input => { this.textInputPass = input }}
                                    placeholder="...הכנס סיסמא"
                                    secureTextEntry={true}
                                    style={styles.textInput}
                                    value={this.state.password}
                                    onChangeText={(text) => this.setState({
                                        password: text
                                    })}
                                /> :
                                <TextInput
                                    ref={input => { this.textInputPass1 = input }}
                                    placeholder="...הכנס סיסמא"
                                    style={styles.textInput}
                                    value={this.state.password}
                                    onChangeText={(text) => this.setState({
                                        password: text
                                    })}
                                />

                            }
                            <TouchableOpacity
                                onPress={() => this.secureTextEntry()}>
                                {this.state.secureTextEntry ?
                                    <Feather
                                        name="eye-off"
                                        color="gray"
                                        size={20}
                                    /> :
                                    <Feather
                                        name="eye"
                                        color="gray"
                                        size={20}
                                    />
                                }
                            </TouchableOpacity>
                        </View>


                        <Text style={[styles.text_footer, {
                            marginTop: 35
                        }]}>אימות סיסמא </Text>
                        <View style={styles.action}>
                            <Feather
                                name="lock"
                                color="#EECCA4"
                                size={20}
                            />
                            {this.state.secureTextEntry ?
                                <TextInput
                                    ref={input => { this.textInputPass2 = input }}
                                    placeholder="...אמת סיסמא"
                                    secureTextEntry={true}
                                    style={styles.textInput}
                                    value={this.state.conpassword}
                                    onChangeText={(text) => this.setState({
                                        conpassword: text
                                    })}
                                /> :
                                <TextInput
                                    ref={input => { this.textInputPass3 = input }}
                                    placeholder="...אמת סיסמא"
                                    style={styles.textInput}
                                    value={this.state.conpassword}
                                    onChangeText={(text) => this.setState({
                                        conpassword: text
                                    })}
                                />

                            }
                            <TouchableOpacity
                                onPress={() => this.secureTextEntry()}>
                                {this.state.secureTextEntry ?
                                    <Feather
                                        name="eye-off"
                                        color="gray"
                                        size={20}
                                    /> :
                                    <Feather
                                        name="eye"
                                        color="gray"
                                        size={20}
                                    />
                                }
                            </TouchableOpacity>

                        </View>



                        <TouchableOpacity onPress={this.userVal}>
                            <View style={styles.button}>
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
                                        marginBottom: 30,
                                    }]}>
                                    <Text style={styles.textlogin}>הירשם</Text>
                                </LinearGradient >
                            </View>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
                </ImageBackground>
            </View >
        );
    }

}
export default SingUp;

const styles = StyleSheet.create({
    container: {
        flex: 1,

    },
    shoppingCart: {
        marginTop: 50,
        color: 'black',
        marginRight: 15
    },
    header1: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#FFF',
        marginTop: 5

    },
    menu: {
        marginTop: 50,
        color: 'black',
        backgroundColor: "#fff"
    },
    header: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        paddingBottom: 50
    },
    footer: {
        flex: 2.5,
        backgroundColor: 'white',
        paddingHorizontal: 20,
        paddingVertical: 30,
    },
    text_header: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 30,
    },
    text_footer: {
        color: "#EECCA4",
        fontSize: 18
    },
    action: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        paddingBottom: 5,
    },
    textInput: {
        textAlign: 'right',
        flex: 1,
        paddingLeft: 10,
        color: "#56493C",
    },
    button: {
        alignItems: 'center',
        marginTop: 50,
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
    image: {
        flex: 1,
        resizeMode: "cover",
        // justifyContent: "flex-start"
    },


});