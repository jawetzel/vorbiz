import {StyleSheet, ToastAndroid, TouchableOpacity, View, Text} from "react-native";
import React, {useRef} from "react";
import * as MediaLibrary from 'expo-media-library';
import QRCode from 'react-native-qrcode-svg';
import RNFS from "react-native-fs";
import {themeColors} from "@/constants/theme-colors";

type QRGeneratorProps = {
    upc: string;
};

const QRCodeGenerator = (props : QRGeneratorProps) => {
    const qrRef = useRef<any>();

    const saveQrToDisk = async () => {
        try {
            if (!qrRef.current) {
                ToastAndroid.show('QR Code not ready', ToastAndroid.SHORT);
                return;
            }
            // Request permission
            const { status } = await MediaLibrary.requestPermissionsAsync();
            if (status !== 'granted') {
                ToastAndroid.show('Need permission to save!', ToastAndroid.SHORT);
                return;
            }

            // Get QR code data using the ref
            const data = await new Promise<string>((resolve) => {
                qrRef.current.toDataURL(resolve);
            });

            // Save to cache first
            const filePath = `${RNFS.CachesDirectoryPath}/qr-code-${props.upc}.png`;
            await RNFS.writeFile(filePath, data, 'base64');

            // Save to media library using Expo's MediaLibrary
            await MediaLibrary.saveToLibraryAsync(filePath);

            ToastAndroid.show('Saved to gallery!', ToastAndroid.SHORT);
        } catch (error) {
            console.error(error);
            ToastAndroid.show('Failed to save QR code', ToastAndroid.SHORT);
        }
    };

    return (
        <View style={styles.container}>
            <QRCode
                value={props.upc}
                size={200}
                backgroundColor={themeColors.backgroundThree}
                color={themeColors.text}
                getRef={(c) => (qrRef.current = c)}
            />
            <TouchableOpacity
                style={styles.downloadButton}
                onPress={saveQrToDisk}
            >
                <Text style={styles.buttonText}>Download QR Code</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        gap: 16,
        margin: 20
    },
    downloadButton: {
        backgroundColor: themeColors.primary,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
        marginTop: 16,
    },
    buttonText: {
        color: themeColors.headerTitle, // Using white text as per your color scheme
        fontSize: 16,
        fontWeight: '500',
    },
});

export default QRCodeGenerator;