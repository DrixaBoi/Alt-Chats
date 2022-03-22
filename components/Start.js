import React from 'react';
import { View, Text, Button, TextInput, StyleSheet, ImageBackground, Pressable, TouchableOpacity } from 'react-native';

import BackgroundImage from '../assets/Background.png';

export default class Start extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = { 
            // sets the name default to blank waiting for user input, uses the onChangeText from the TextInput element
            name: '',
            // sets the chat background default to white, will change to user choice using the changeBG function
            bgColor: this.colors.white,
        };
    }

    changeBG = (newColor) => {
        this.setState({ bgColor: newColor });
    };

    colors = {
        dark: '#090C08',
        darkViolet: '#474056',
        lightBlue: '#8A95A5',
        lightGreen: '#B9C6AE',
    };

    render() {
        return (
            <View style={styles.container}>
                <ImageBackground
                    source={BackgroundImage}
                    resizeMode='cover'
                    style={styles.backgroundImage}
                >
                
                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>Alt Chats</Text>
                    </View>     
                    
                    <View style={styles.inputContainer}>
                        {/* text input area for user to choose their name */}
                        <TextInput
                            style={styles.textInput}
                            onChangeText={(name) => this.setState({ name })}
                            value={this.state.name}
                            placeholder='Your Name'
                        />
                        
                        {/* start of chat background color choices */}    
                        <View style={styles.colorContainer}>
                            <View>
                                <Text style={styles.colorTitle}>Choose Background Color:</Text>
                            </View>                        
                            {/* individual color selections, linked to their color codes above with this.colors, style adds the example color to the background */}
                            <View style={styles.colorInput}>
                                <TouchableOpacity
                                    accessible={true}
                                    accessibilityLabel="Dark"
                                    accessibilityHint="Changes your chat background to Dark"
                                    accessibilityRole="button"
                                    style={styles.dark}
                                    onPress={() => this.changeBG(this.colors.dark)}
                                >  
                                </TouchableOpacity>
                                <TouchableOpacity
                                    accessible={true}
                                    accessibilityLabel="Dark Violet"
                                    accessibilityHint="Changes your chat background to Dark Violet"
                                    accessibilityRole="button"
                                    style={styles.darkViolet}
                                    onPress={() => this.changeBG(this.colors.darkViolet)}
                                >  
                                </TouchableOpacity>
                                <TouchableOpacity
                                    accessible={true}
                                    accessibilityLabel="Light Blue"
                                    accessibilityHint="Changes your chat background to Light Blue"
                                    accessibilityRole="button"
                                    style={styles.lightBlue}
                                    onPress={() => this.changeBG(this.colors.lightBlue)}
                                >  
                                </TouchableOpacity>
                                <TouchableOpacity
                                    accessible={true}
                                    accessibilityLabel="Light Green"
                                    accessibilityHint="Changes your chat background to Light Green"
                                    accessibilityRole="button"
                                    style={styles.lightGreen}
                                    onPress={() => this.changeBG(this.colors.lightGreen)}
                                >  
                                </TouchableOpacity>
                            </View>
                        </View>    
                        
                        {/* button to enter chat */}
                        <Pressable 
                            style={styles.chatButton}
                            accessible={true}
                            accessibilityLabel="Enter Chat"
                            accessibilityHint=" Continue to chat"
                            accessibilityRole="button"
                        // the onPress method needs to match the name prop defined in App.js  
                            onPress={() => this.props.navigation.navigate('Chat', {
                                name: this.state.name,
                                bgColor: this.state.bgColor
                                })
                            }
                        >
                            <Text style={styles.buttonText}>Start Chatting</Text>    
                        </Pressable>
                    </View>
                </ImageBackground>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    
    backgroundImage: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },

    titleContainer: {
        height: '50%',
        width: '88%',
        alignItems: 'center',
        paddingTop: 100,
    },

    title: {
        fontSize: 45,
        fontWeight: '600',
        color: '#FFFFFF',
        textShadowColor: 'black',
        textShadowRadius: 4,
    },

    inputContainer: {
        height: '46%',
        width: '88%',
        alignItems: 'center',
        justifyContent: 'space-around',
        backgroundColor: '#FFFFFF',
    },

    textInput: {
        height: 60,
        width: '88%',
        backgroundColor: '#FFFFFF',
        borderColor: '#757083',
        borderWidth: 1,
        paddingLeft: 15,
        marginTop: 20,
    },

    colorContainer: {
        flex: 1,
        flexDirection: 'column',
        margin: 10,
    },

    colorTitle: {
        fontSize: 16,
        fontWeight: '300',
        margin: 10,
        color: '#757083',
    },

    colorInput: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        width: '80%',
        marginBottom: 30,
    },

    dark: {
        backgroundColor: "#090C08",
        width: 50,
        height: 50,
        borderRadius: 25,      
    },
    
    darkViolet: {
        backgroundColor: "#474056",
        width: 50,
        height: 50,
        borderRadius: 25,
      },
    
    lightBlue: {
        backgroundColor: "#8A95A5",
        width: 50,
        height: 50,
        borderRadius: 25,
      },
    
    lightGreen: {
        backgroundColor: "#B9C6AE",
        width: 50,
        height: 50,
        borderRadius: 25,
      },

    chatButton: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '88%',
        height: 60,
        backgroundColor: '#757083',
        marginBottom: 20,
    },

    buttonText: {
        color: '#FFFFFF',
        fontWeight: '600',
        fontSize: 16,
    }
});