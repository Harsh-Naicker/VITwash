import React, {useState, useEffect} from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Linking } from 'react-native'
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {useSelector, useDispatch} from 'react-redux'
import { useIsFocused } from "@react-navigation/native";

const Chats = () => {
    const isFocused = useIsFocused();
    const userstore = useSelector(state => state);
    const dispatch = useDispatch();
    const [slotList, setSlotList]=useState([])
    const [namesList, setNamesList]=useState([])
    const [phonesList, setPhonesList]=useState([])
    useEffect(async () => {
        let slots=[]
        let names=[]
        let phones=[]
        await firestore()
          .collection('bookings')
          .doc(userstore.date)
          .collection('slots')
          .get()
          .then(snapshot =>{
              snapshot.forEach((doc) => {
                console.log(doc.id)
                console.log(doc.data()["user"])
                console.log(doc.data()["phone"])
                if(doc.data()["user"]!== userstore.user.displayName){
                    slots.push(doc.id)
                    names.push(doc.data()["user"])
                    phones.push(doc.data()["phone"])
                }
                
              })
          })
          .catch(e => {console.log('Bookings updating failed')})
          setSlotList(slots)
          setNamesList(names)
          setPhonesList(phones)
    },[isFocused])
    const initiateWhatsAppSMS = (number, name) => {
        // Check for perfect 10 digit length
        if (number.length != 10) {
          alert('Please insert correct contact number');
          return;
        }
        // Using 91 for India
        // You can change 91 with your country code
        let message=`Hey ${name}, this is ${userstore.user.displayName} here!`
        let url =
          'whatsapp://send?text=' + message + '&phone=91' + number;
        Linking.openURL(url)
          .then((data) => {
            console.log('WhatsApp Opened');
          })
          .catch(() => {
            alert('Make sure Whatsapp installed on your device');
          });
      };
    return (
        <View style={styles.container}>
            <Text style={styles.headerTitle}>VITWASH</Text>
            <ScrollView style={styles.scrollView}>
                {slotList.map((item, index) => (
                        
                            <TouchableOpacity onPress={() => initiateWhatsAppSMS(phonesList[index],namesList[index]) } key={index} style={styles.button}>
                                <Text style={styles.buttonText}>Chat with </Text>
                                <Text style={styles.buttonText}>{namesList[index]} </Text>
                                <Text style={styles.buttonText}>(Booked slot {item})</Text>
                            {/* <Text>{phonesList[index]}</Text> */}
                            </TouchableOpacity>
                        
                            
                ))}
            </ScrollView>
            
        </View>
    )
}

export default Chats

const styles=StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        // backgroundColor: '#323232'
    },
    headerTitle: {
        fontSize: 30,
        fontWeight: '900',
        textAlign: 'center',
        // marginTop: 60,
        color: '#53a20e',
        position: 'absolute',
        top: 60,
        bottom: 0,
        left: 0,
        right: 0,
        alignSelf: 'center'
        // fontFamily: 'SourceSerifPro-Regular'
    },
    button: {
        alignItems: "center",
        backgroundColor: "#53a20e",
        padding: 10,
        marginBottom: 8,
        width: '90%',
        borderRadius: 10,
        alignSelf: 'center',
        flexDirection: 'row'
    },
    buttonText: {
        fontSize: 13,
        color: 'white',
        fontWeight: 'bold'
    },
    scrollView: {
        top: 140,
        left: 0,
        right: 0,
        bottom: 0,
    }
})

