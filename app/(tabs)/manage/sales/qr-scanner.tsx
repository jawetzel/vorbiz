import {useEffect, useState} from 'react';
import { Camera,
    useCameraDevice,
    useCodeScanner } from 'react-native-vision-camera';
import { StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import {Ionicons} from "@expo/vector-icons";

type QRScannerProps = {
    onRead: (data: string | null | undefined) => void;
};

const QRScanner = (props: QRScannerProps) => {
    const [hasPermission, setHasPermission] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const device = useCameraDevice("back");
    const codeScanner = useCodeScanner({
        codeTypes: ["qr"],
        onCodeScanned: (codes) => {
            props.onRead(codes[0].value);
        },
    });

    useEffect(() => {
        // exception case
        setRefresh(!refresh);
    }, [device, hasPermission]);

    useEffect(() => {
        const requestCameraPermission = async () => {
            const permission = await Camera.requestCameraPermission();
            setHasPermission(permission === "granted");
        };

        requestCameraPermission();

        //if it is idle for 15 secs, it will be closed
        setTimeout(() => {
            props.onRead(null);
        }, 15 * 1000);
    }, []);

    if (device == null || !hasPermission) {
        return (
            <View style={styles.cameraContainer}>
                <Text style={{ backgroundColor: "white" }}>
                    Camera not available or not permitted
                </Text>
            </View>
        );
    }

    return (
        <View
            style={styles.cameraContainer}
        >
            <Camera
                style={styles.camera}
                device={device}
                isActive={true}
                codeScanner={codeScanner}
            />
        </View>


    );
};

export default QRScanner;

const styles = StyleSheet.create({
    cameraContainer:{
        height: 200,
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
    },
    camera: {
        width: "100%",
        height: "100%",
    }
});
