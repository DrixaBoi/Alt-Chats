import React from 'react';
import { View, Text, Button, TextInput, StyleSheet } from 'react-native';

export default class Chat extends React.Component {

    render() {
        /* passes the name defined on Start to Chat */
        let name = this.props.route.params.name;
        /* sets the title of Chat to the name input from Start */
        this.props.navigation.setOptions({ title: name });

        return (
            <View style={{ flex:1, justifyContent:'center', alignItems:'center' }}>
                <Text>Hello Screen2!</Text>
                {/* This screen doesn't necessarily need a Button for Screen1 since the user could use their back arrow */}
                <Button
                    title='Back to Start'
                    onPress={() => this.props.navigation.navigate('Start')}
                />    
            </View>
        )
    }
}

const styles = StyleSheet.create({

});