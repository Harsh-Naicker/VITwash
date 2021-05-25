import React,{useState, useEffect} from 'react'
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native'
import { Divider,Button , Menu, Provider } from 'react-native-paper'
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSelector, useDispatch} from 'react-redux'
import {setUser} from '../store/action'

const Home = ({navigation}) => {
    const [visible, setVisible]=React.useState()
    const openMenu = ()=> setVisible(true)
    const closeMenu = () => setVisible(false)
    const userstore = useSelector(state => state);
    const dispatch = useDispatch();
    const [username, setUsername]=useState('guest')
    const [toks, setToks]=useState(0)
    useEffect(() => {
        setUsername(userstore.user.email)
        setToks(userstore.tokens)
     }, []);
    
    return (
        <Provider>
            <Text style={styles.headerTitle}>VITWASH</Text>
            
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                
                <TouchableOpacity 
                    style={styles.rectangle2}
                    onPress={() => navigation.dangerouslyGetParent().navigate('SlotBooking')}
                >
                    <MaterialCommunityIcons name="clock" color='white' size={120} />
                    <Text style={styles.rectangleText}>BOOK A SLOT</Text>
                </TouchableOpacity>
                
                <Text style={{fontSize: 20, fontWeight: '900', margin: 30, color: '#102002'}}>AVAILABLE TOKENS: {userstore.tokens}</Text>
                
                <TouchableOpacity 
                    style={styles.rectangle}
                    onPress={() => navigation.dangerouslyGetParent().navigate('AddTokens')}
                >
                    <MaterialCommunityIcons name="currency-inr" color='white' size={120} />
                    <Text style={styles.rectangleText}>BUY TOKEN</Text>
                </TouchableOpacity>
                
            </View>

            
           
        </Provider>
    )
}

export default Home

const styles = StyleSheet.create({
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
    rectangle: {
        width: 300,
        height: 200,
        backgroundColor: "#53a20e",
        alignItems: 'center',
        justifyContent: 'center',
        margin: 3,
        borderWidth: 1,
        borderColor: '#53a20e',
        // borderBottomEndRadius: 10,
        // borderBottomStartRadius: 10
        borderRadius: 20
    },
    rectangleText: {
        color: 'white',
        fontWeight: '800',
        fontSize: 20
    },
    rectangle2: {
        width: 300,
        height: 200,
        backgroundColor: "#53a20e",
        alignItems: 'center',
        justifyContent: 'center',
        margin: 3,
        borderWidth: 1,
        borderColor: '#53a20e',
        // borderTopEndRadius: 10,
        // borderTopStartRadius: 10,
        borderRadius: 20,
        marginTop: 40
    },
})