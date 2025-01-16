import {ActivityIndicator, StyleSheet, Switch, Text, TextInput, View} from "react-native";
import React from "react";

const Loader: React.FC = () => {


    return <View style={styles.loader}>
        <ActivityIndicator size="large" color="#4CAF50" />
    </View>

}

const styles = StyleSheet.create({
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
});

export default Loader;