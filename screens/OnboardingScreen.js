import React from 'react'
import { View, Text, Button, StyleSheet, Image } from 'react-native'

import Onboarding from 'react-native-onboarding-swiper'

const Skip = ({...props}) =>(
    <Button 
        title='Skip'
        {...props}
    />
)
const Next = ({...props}) =>(
    <Button 
        title='Next'
        {...props}
    />
)
const Done = ({...props}) =>(
    <Button 
        title='Done'
        {...props}
    />
)

const Dots = ({selected}) => {
    let backgroundColor;
    backgroundColor = selected? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0.3)'
    return (
        <View
            style={{
                backgroundColor
            }}
        />
    )
}


export default function OnboardingScreen({navigation}) {
    return (
        <Onboarding
            // SkipButtonComponent={Skip}
            // NextButtonComponent={Next}
            // DoneButtonComponent={Done}
            // DotComponent={Dots}
            onSkip={() => navigation.replace("Login")}
            onDone={() => navigation.replace("Login")}
            pages={[
                {
                    backgroundColor: '#fff',
                    image: <Image style={{width: 300,resizeMode: 'contain' }}source={require('../assets/S1.png')} />,
                    title: '',
                    subtitle: 'Buy VITwash tokens',
                    subTitleStyles: {fontWeight: 'bold', color: 'black'}
                },
                {
                    backgroundColor: '#fff',
                    image: <Image style={{width: 300,resizeMode: 'contain' }} source={require('../assets/S2.png')} />,
                    title: '',
                    subtitle: 'Find your washing machine',
                    subTitleStyles: {fontWeight: 'bold'}
                },
                {
                    backgroundColor: '#fff',
                    image: <Image style={{width: 300,resizeMode: 'contain' }} source={require('../assets/S3.png')} />,
                    title: '',
                    subtitle: 'Book your slot',
                    subTitleStyles: {fontWeight: 'bold'}
                },
                {
                    backgroundColor: '#fff',
                    image: <Image style={{width: 300,resizeMode: 'contain' }} source={require('../assets/S4.png')} />,
                    title: '',
                    subtitle: 'Enjoy your wash!',
                    subTitleStyles: {fontWeight: 'bold'}
                }
                
            ]}
        />
    )
}

const styles=StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
})


