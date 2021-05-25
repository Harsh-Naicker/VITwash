import React, {useState, useEffect} from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native'
import firestore from '@react-native-firebase/firestore';
import {useSelector, useDispatch} from 'react-redux'
import {addBookedSlot, setSlot} from '../store/action'
import { useIsFocused } from "@react-navigation/native";

const CurrentWashes = () => {
    const [scheduled, setScheduled]=useState([])
    const userstore = useSelector(state => state);
    const dispatch = useDispatch();
    const isFocused = useIsFocused();

    useEffect(async () => {
        let times=[]
        await firestore()
          .collection('users')
          .doc(userstore.user.uid)
          .collection('bookings')
          .doc(userstore.date)
          .get()
          .then(snapshot =>{
            console.log('User slot updated in Current Washes')
            console.log(snapshot.data()["slot"])
            // dispatch(setSlot(snapshot.data()["slot"]))
            // setScheduled(snapshot.data()["slot"])
            times=snapshot.data()["slot"]
            times.sort(function (a, b) {
                return new Date('1970/01/01 ' + a) - new Date('1970/01/01 ' + b);
            });
            setScheduled(times)
            dispatch(setSlot(times))
          })
          .catch(e => dispatch(setSlot([])))
        
        // setScheduled(userstore.slot)
    }, [isFocused]);

    return (
        <View style={styles.container}>
            <Text style={styles.headerTitle}>VITWASH</Text>
            <Text style={styles.heading}>SCHEDULED WASHES</Text>
            <Text style={styles.heading2}>DATE: {userstore.date}</Text>
            <ScrollView style={styles.scrollView}>
                {scheduled.map((item, index) => (
                    <Text style={styles.slotText} key={index}>{item}</Text>
                ))}
            </ScrollView>
        </View>
    )
}

export default CurrentWashes

const styles=StyleSheet.create({
    container: {
        flex: 1,
        // alignItems: 'center',
        // justifyContent: 'center'
    },
    heading: {
        fontWeight: '800',
        fontSize: 22,
        textAlign: 'center',
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        top: 130,
        left: 0,
        right: 0,
        bottom: 0,
    },
    heading2: {
        fontWeight: '800',
        fontSize: 20,
        color: 'black',
        textAlign: 'center',
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        top: 160,
        left: 0,
        right: 0,
        bottom: 0,
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
    scrollView: {
        top: 200,
        left: 0,
        right: 0,
        bottom: 0,
    },
    slotText: {
        color: '#53a20e',
        textAlign: 'center',
        fontSize: 20
    }
})
