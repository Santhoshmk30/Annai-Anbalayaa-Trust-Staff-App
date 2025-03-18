import React, { useState, useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {
  Camera,
  useCameraDevice,
  useCodeScanner,
} from "react-native-vision-camera";
import Ionicons from "react-native-vector-icons/Ionicons";

const QRScanner = (props) => {
  const [hasPermission, setHasPermission] = useState(false);
  const [scannedValue, setScannedValue] = useState(null); // State to hold the scanned value
  const device = useCameraDevice("back");
  const codeScanner = useCodeScanner({
    codeTypes: ["qr"],
    onCodeScanned: (codes) => {
      if (codes.length > 0) {
        const value = codes[0].value;
        console.log("Scanned Value: ", value);
        setScannedValue(value); // Save the scanned value
        if (props.onRead) {
          props.onRead(value);
        }
      }
    },
  });

  useEffect(() => {
    const requestCameraPermission = async () => {
      const permission = await Camera.requestCameraPermission();
      console.log("Camera Permission: ", permission);
      setHasPermission(permission === "granted");
    };

    requestCameraPermission();

    // Close the scanner if idle for 15 seconds
    const timeout = setTimeout(() => {
      if (props.onRead) {
        props.onRead(null);
      }
    }, 15 * 1000);

    return () => clearTimeout(timeout);
  }, [props]);

  if (device == null || !hasPermission) {
    return (
      <View style={styles.page2}>
        <Text style={{ backgroundColor: "white" }}>
          Camera not available or not permitted
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.page2}>
      <Camera
        codeScanner={codeScanner}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={!scannedValue} 
      />
      <View style={styles.backHeader}>
        <TouchableOpacity
          style={{ padding: 10 }}
          onPress={() => {
            if (props.onRead) {
              props.onRead(null);
            }
          }}
        >
          <Ionicons name={"arrow-back-outline"} size={25} color={"snow"} />
        </TouchableOpacity>
      </View>
      {scannedValue ? (
        // Display scanned result
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>Scanned Value:</Text>
          <Text style={styles.resultValue}>{scannedValue}</Text>
        </View>
      ) : (
        <View style={styles.footer}>
          <TouchableOpacity
            style={{
              paddingVertical: 8,
              paddingHorizontal: 10,
              borderWidth: 1,
              borderRadius: 5,
              borderColor: "snow",
              alignItems: "center",
            }}
            onPress={() => {
              if (props.onRead) {
                props.onRead(null);
              }
            }}
          >
            <Text style={{ color: "snow", fontSize: 14 }}>Close</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

QRScanner.defaultProps = {
  onRead: () => console.warn("onRead function is not provided"),
};

export default QRScanner;

const styles = StyleSheet.create({
  page2: {
    flex: 1,
    position: "absolute",
    top: 0,
    height: "100%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  backHeader: {
    backgroundColor: "#00000090",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    padding: "2%",
    height: "5%",
    width: "100%",
    alignItems: "flex-start",
    justifyContent: "center",
  },
  footer: {
    backgroundColor: "#00000090",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: "10%",
    height: "20%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  resultContainer: {
    position: "absolute",
    bottom: "20%",
    backgroundColor: "#00000090",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  resultText: {
    color: "white",
    fontSize: 18,
    marginBottom: 5,
  },
  resultValue: {
    color: "yellow",
    fontSize: 16,
  },
});
