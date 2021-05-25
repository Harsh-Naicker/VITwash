import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, Button, TextInput} from 'react-native'
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
// import { TextInput, Button } from 'react-native-paper';
import {useSelector, useDispatch} from 'react-redux'
import {setUser} from '../store/action'

const Login = ({navigation}) => {
    const [email, setEmail]=useState(null)
    const [password, setPassword]=useState(null)
    const [confirmPassword, setConfirmPassword]=useState(null)
    const [alreadyAUser, setAlreadyAUser]=useState(true)
    const [emailFocus, setEmailFocus]=useState(false)
    const [passwordFocus, setPasswordFocus]=useState(false)
    const [confirmPasswordFocus,setConfirmPasswordFocus]=useState(false)
    const [nameFocus, setNameFocus]=useState(false)
    const [numberFocus, setNumberFocus]=useState(false)
    const [name, setName]=useState(null)
    const [number, setNumber]=useState(null)

    const userstore = useSelector(state => state);
    const dispatch = useDispatch();

    
    const loginUser = async () => {
        try {
            await auth()
            .signInWithEmailAndPassword(email,password)
            .then(auth => {
                setEmail(null)
                setPassword(null)
                setConfirmPassword(null)
                alert('Logged in')
                
                
            })
           
            const user=auth().currentUser
            dispatch(setUser(user))
            // navigation.navigate('Home')
            navigation.replace('TabStack',{screen:'HOME'})
        } catch(e) {
           alert(e.message)
        }
        
    }

    const registerUser= async () => {
        try {
            if(password === confirmPassword && password !== null && email!==null){
                await auth()
                    .createUserWithEmailAndPassword(email, password)
                    .then(() => {
                        setEmail(null)
                        setPassword(null)
                        setConfirmPassword(null)
                        alert('User account created & signed in!');
                        
                    })
                
                const update = {
                    displayName: name,
                    // photoURL: 'https://my-cdn.com/assets/user/123.png',
                };
                      
                await auth().currentUser.updateProfile(update);
                const user=auth().currentUser
                await firestore().collection('users').doc(user.uid).set({
                    contact: number
                })

                dispatch(setUser(user))
                // navigation.navigate("Home")
                navigation.replace('TabStack',{screen:'HOME'})
            } else if(email!==null && password!==confirmPassword){
                alert('Both the passwords must match')
            }
        } catch(e) {
            alert(e.message)
        }
        
    }

    const loginClean=() => {
        setAlreadyAUser(false)
        setEmailFocus(false)
        setPasswordFocus(false)
        setConfirmPasswordFocus(false)
        setEmail(null)
        setPassword(null)
        setConfirmPasswordFocus(null)
    }
    const signUpClean=() => {
        setAlreadyAUser(true)
        setEmailFocus(false)
        setPasswordFocus(false)
        setConfirmPasswordFocus(false)
        setEmail(null)
        setPassword(null)
        setConfirmPasswordFocus(null)
    }

    return (
        <View style={styles.container}>
            <Text style={styles.headerTitle}>VITWASH</Text>
            { alreadyAUser? 
            (
            <View>
                
                <View style={styles.loginform}>
                    <Text style={{color: '#53a20e',padding: 5}}>{emailFocus? 'Email':''}</Text>
                    <TextInput 
                        onChangeText={email => setEmail(email)}
                        style={emailFocus? styles.focussedTextInput:styles.textinput}
                        value={email}
                        placeholder={emailFocus? '':'Email'}
                        autoCapitalize="none"
                        placeholderTextColor="grey"
                        onFocus={()=> setEmailFocus(true)}
                        onBlur={()=>setEmailFocus(false)}
                        selectionColor='#53a20e'
                    />
                    <Text style={{color: '#53a20e'}}>{passwordFocus? 'Password':''}</Text>
                    <TextInput 
                        onChangeText={password => setPassword(password)}
                        style={passwordFocus? styles.focussedTextInput:styles.textinput}
                        value={password}
                        placeholder={passwordFocus? '':'Password'}
                        secureTextEntry={true}
                        autoCapitalize="none"
                        placeholderTextColor="grey"
                        onFocus={()=> setPasswordFocus(true)}
                        onBlur={()=>setPasswordFocus(false)}
                        selectionColor='#53a20e'
                    />
                    <Button mode="contained" onPress={loginUser} style={{marginBottom: 10}} title='LOG IN' color="#53a20e">
                        LOG IN
                    </Button>
                    <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                        <Text style={{paddingTop: 10, paddingRight: 6, color: 'grey', fontSize: 17}}>New user?</Text>
                        <Button mode="contained" onPress={() => loginClean()} title='SIGN UP' color="#53a20e">
                            Sign up
                        </Button>
                    </View>
                    
                </View>
                
            </View>
        ):
        (
                <View>
                    
                    
                    <View style={styles.loginform}>
                        <Text style={{color: '#53a20e',paddingBottom:2}}>{emailFocus? 'Email':''}</Text>
                        <TextInput 
                            onChangeText={email => setEmail(email)}
                            style={emailFocus? styles.focussedTextInput:styles.textinput}
                            value={email}
                            placeholder={emailFocus? '':'Email'}
                            autoCapitalize="none"
                            placeholderTextColor="grey"
                            onFocus={()=> setEmailFocus(true)}
                            onBlur={()=>setEmailFocus(false)}
                            selectionColor='#53a20e'
                        />
                        <Text style={{color: '#53a20e',paddingBottom:2}}>{nameFocus? 'Name':''}</Text>
                        <TextInput 
                            onChangeText={name => setName(name)}
                            style={nameFocus? styles.focussedTextInput:styles.textinput}
                            value={name}
                            placeholder={nameFocus? '':'Name'}
                            autoCapitalize="none"
                            placeholderTextColor="grey"
                            onFocus={()=> setNameFocus(true)}
                            onBlur={()=>setNameFocus(false)}
                            selectionColor='#53a20e'
                        />
                        <Text style={{color: '#53a20e',paddingBottom:2}}>{numberFocus? 'WhatsApp Number':''}</Text>
                        <TextInput 
                            onChangeText={number => setNumber(number)}
                            style={numberFocus? styles.focussedTextInput:styles.textinput}
                            value={number}
                            placeholder={numberFocus? '':'WhatsApp Number'}
                            autoCapitalize="none"
                            placeholderTextColor="grey"
                            onFocus={()=> setNumberFocus(true)}
                            onBlur={()=>setNumberFocus(false)}
                            selectionColor='#53a20e'
                        />
                        <Text style={{color: '#53a20e'}}>{passwordFocus? 'Password':''}</Text>
                        <TextInput 
                            onChangeText={password => setPassword(password)}
                            style={passwordFocus? styles.focussedTextInput:styles.textinput}
                            value={password}
                            placeholder={passwordFocus? '':'Password'}
                            secureTextEntry={true}
                            autoCapitalize="none"
                            placeholderTextColor="grey"
                            onFocus={()=> setPasswordFocus(true)}
                            onBlur={()=>setPasswordFocus(false)}
                            selectionColor='#53a20e'
                        />
                        <Text style={{color: '#53a20e'}}>{confirmPasswordFocus? 'Confirm Password':''}</Text>
                        <TextInput 
                            onChangeText={password => setConfirmPassword(password)}
                            style={confirmPasswordFocus? styles.focussedTextInput:styles.textinput}
                            value={confirmPassword}
                            placeholder={confirmPasswordFocus? '':'Confirm Password'}
                            secureTextEntry={true}
                            autoCapitalize="none"
                            placeholderTextColor="grey"
                            onFocus={()=> setConfirmPasswordFocus(true)}
                            onBlur={()=>setConfirmPasswordFocus(false)}
                            selectionColor='#53a20e'
                        />

                        <Button mode="contained" onPress={registerUser} style={{marginBottom: 10}} title='SIGN UP' color="#53a20e">
                            Sign up
                        </Button>
                        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                            <Text style={{paddingTop: 10, paddingRight: 6, color: 'grey', fontSize: 17}}>Already a user?</Text>
                            <Button mode="contained" onPress={() => signUpClean()} title='LOG IN' color="#53a20e">
                                Log in
                            </Button>
                        </View>
                        
                    </View>
                    
                </View>
            )
        }
        

        </View>
    )

    
}


export default Login;

const styles=StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        // backgroundColor: '#323232'
    },
    loginform: {
        alignSelf: 'center',
        width: '90%',
    },
    textinput: {
        // borderRadius: 10,
        // color: 'white',
        marginBottom: 30, 
        color: 'grey',
        fontSize: 17, 
        padding: 5,
        // paddingBottom: 20,
        borderBottomWidth: 1.2, 
        borderColor: 'grey',
        height: 30
    },
    focussedTextInput: {
        marginBottom: 20, 
        color: 'grey',
        fontSize: 17, 
        padding: 5, 
        borderBottomWidth: 1.2,
        borderColor: '#53a20e'
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
})
