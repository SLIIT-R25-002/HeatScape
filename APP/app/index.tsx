import { View, Text, TouchableOpacity, ScrollView, Dimensions, ViewStyle, FlexAlignType } from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { State, Pressable } from 'react-native-gesture-handler';
import WebView from "react-native-webview";
import { MaterialIcons } from "@expo/vector-icons";
// import MQTT from "@taoqf/react-native-mqtt";

const wsUrl = "ws://192.168.4.1:81"; // Change to ESP32 IP

export default function Index() {

  const [temperature, setTemperature] = useState([]);
  const [socketReady, setSocketReady] = useState(false);
  const [logMessages, setLogMessages] = useState<string[]>([]);
  const [isLandscape, setIsLandscape] = useState(Dimensions.get("window").width > Dimensions.get("window").height);
  const scrollViewRef = useRef<ScrollView>(null);
  const ws = useRef<WebSocket | null>(null);
  const [pressedButton, setPressedButton] = useState<string[]>([]);
  const [camIP, setCamIP] = useState<string>("");
  const [angle, setAngle] = useState<{x: number, y: number}>({x: 0, y: 0});
  const [showLogs, setShowLogs] = useState<boolean>(false);
  const [gpsData, setGPSData] = useState<{latitude: number;longitude: number;speed: number;altitude: number;hdop: number;satellites: number;time: string;}>({latitude: 0,longitude: 0,speed: 0,altitude: 0,hdop: 0,satellites: 0,time: ""});

  const addLogMessage = (message: string) => {
    setLogMessages((prevMessages) => [...prevMessages, message]);
  };

  const connectWebSocket = () => {
    addLogMessage("Attempting to connect to WebSocket...");
    ws.current = new WebSocket(wsUrl);

    ws.current.onopen = () => {
      setSocketReady(true);
      addLogMessage("WebSocket is open now.");
      sendCommand("GET_CAM_IP")
    };

    ws.current.onclose = (event) => {
      setSocketReady(false);
      addLogMessage(`WebSocket is closed now. Code: ${event.code}, Reason: ${event.reason}`);
      if (!event.wasClean) {
        addLogMessage("Reconnecting due to unexpected closure...");
        setTimeout(connectWebSocket, 5000); // Reconnect after 5 seconds
      }
    };

    ws.current.onerror = (e) => {
      setSocketReady(false);
      addLogMessage(`WebSocket error: ${JSON.stringify(e, null, 2)}`);
      if (e.isTrusted === false) {
        addLogMessage("Untrusted error source detected.");
      }
    };

    ws.current.onmessage = (message) => {
      if(message.data.includes("CAM_IP:")){
        setCamIP(message.data?.split(":")[1] || "");
      }
      if(message.data.includes("TEMP_DATA:")){
        setTemperature(JSON.parse(message.data?.split(":")[1]) || [])
      }
      if (message.data.includes("GPS_DATA:")) {
        const parsedData = JSON.parse(message.data?.split("GPS_DATA:")[1]) || {};
        
        setGPSData({
          latitude: parsedData.lat || 0,
          longitude: parsedData.lng || 0,
          speed: parsedData.speed || 0,
          altitude: parsedData.alt || 0,
          hdop: parsedData.hdop || 0,
          satellites: parsedData.satellites || 0,
          time: parsedData.time || "",
        });
      }
      addLogMessage(`Received message: ${message.data}`);
    };
  };

  const flipCam = async() => {
    if(camIP)
    await fetch(`http://${camIP}/control?var=vflip&val=0`)
  }

  useEffect(() => {
    flipCam();
  }, [camIP])

  useEffect(() => {
    connectWebSocket();
    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  useEffect(() => {
    const updateOrientation = () => {
      setIsLandscape(Dimensions.get("window").width > Dimensions.get("window").height);
      console.log("Orientation changed");
      
    };
    Dimensions.addEventListener("change", updateOrientation);
  }, []);

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [logMessages]);

  const sendCommand = (command: string | string[]) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      if(Array.isArray(command)){
        if(command.length == 0){
          ws.current.send("stop");
          addLogMessage(`Sent command: stop`);
        }else if(command.length == 1){
          ws.current.send(command[0]);
          addLogMessage(`Sent command: ${command[0]}`);
        } else if(command.length == 2){
          if(command.includes("forward_left") && command.includes("forward_right")){
            ws.current.send("forward");
            addLogMessage(`Sent command: forward`);
          }
          if(command.includes("backward_left") && command.includes("backward_right")){
            ws.current.send("backward");
            addLogMessage(`Sent command: backward`);
          }
          if(command.includes("forward_left") && command.includes("backward_right")){
            ws.current.send("left");
            addLogMessage(`Sent command: left`);
          }
          if(command.includes("backward_left") && command.includes("forward_right")){
            ws.current.send("right");
            addLogMessage(`Sent command: right`);
          }
        }
      } else {
        ws.current.send(command);
        addLogMessage(`Sent command: ${command}`);
      }
    }
  };

  const handleGestureEvent = (event: any, command: string) => {
    console.log(command);
    console.log(pressedButton);
    console.log(event);
    
    if (event === State.BEGAN) {
      let btns = pressedButton.includes(command) ? pressedButton : [...pressedButton, command];
      setPressedButton(btns);
      sendCommand(btns);
    } else if (
      event === State.END ||
      event === State.CANCELLED ||
      event === State.FAILED
    ) {
      let btns = pressedButton.filter((cmd) => cmd !== command);
      setPressedButton(btns);
      sendCommand(btns);
    }
  };

  const getButtonStyle = (command: string): ViewStyle => ({
    backgroundColor: pressedButton.includes(command) ? "#388E3C" : "#4CAF50",
    padding: 20,
    borderRadius: 10,
    margin: 5,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    width: "100%",
  });

  return (
    <>
      {showLogs &&
      <View style={{width: '80%', height: '100%', backgroundColor: 'white', position: 'fixed', padding: 20, zIndex: 10}}>
        <View style={{ width: "100%", marginTop: 20, flex: 1 }}>
          <View style={{flexDirection: 'row', width: '100%', justifyContent: 'space-between'}}>
            <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>Log:</Text>
            <TouchableOpacity onPressIn={() => setShowLogs(false)} style={{justifyContent: 'flex-start', alignItems: 'flex-end'}}>
              <MaterialIcons name="close" size={30}/>
            </TouchableOpacity>
          </View>
          <ScrollView style={{ flex: 1 }} ref={scrollViewRef}>
            {logMessages.map((message, index) => (
              <Text key={index} style={{ fontSize: 14, color: "#333" }}>
                {message}
              </Text>
            ))}
          </ScrollView>
        </View>
      </View>
      }
      <ScrollView>
        <View
          style={{
            flex: 1,
            justifyContent: "flex-start",
            alignItems: "center",
            backgroundColor: "#f0f0f0",
          }}
        >
          <View style={{flexDirection: 'row', width: '100%', justifyContent: 'flex-end'}}>
            <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20, height: 'auto', width: '100%', textAlign: 'center' }}>Car Remote Control</Text>
            <TouchableOpacity onPressIn={() => setShowLogs(true)} style={{justifyContent: 'flex-start', alignItems: 'flex-end'}}>
              <MaterialIcons name="menu" size={30}/>
            </TouchableOpacity>
          </View>
          <Text style={{ fontSize: 16, color: socketReady ? "green" : "red", marginBottom: 20 }}>
            {socketReady ? "Connected" : "Disconnected"}
          </Text>
          {camIP != "" ? 
            <View style={{ flex: 0.5, justifyContent: "center", alignItems: "center" }}>
            {/* UP Button */}
            <TouchableOpacity
              style={[styles.button, { width: 250 }]}
              onPressIn={() => sendCommand("V_TURN_CAM:125")}
              onPressOut={() => sendCommand("V_TURN_CAM:90")}
              // onPressIn={() => {
              //   let yaxis = angle.y + 5;
              //   if(yaxis > 180){
              //     return
              //   }
              //   sendCommand("V_TURN_CAM:" + yaxis);
              //   setAngle({x: angle.x, y: yaxis});
              // }}
            >
              <MaterialIcons name="arrow-upward" size={30} color="white" />
            </TouchableOpacity>
      
            {/* Middle Row with Left, WebView, and Right */}
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {/* LEFT Button */}
              <TouchableOpacity
                style={[styles.button, { height: '100%', justifyContent: 'center'}]}
                onPressIn={() => sendCommand("H_TURN_CAM:125")}
                onPressOut={() => sendCommand("H_TURN_CAM:90")}
                // onPressIn={() => {
                //   let xaxis = angle.x - 5;
                //   if(xaxis < 0){
                //     return
                //   }
                //   sendCommand("H_TURN_CAM:" + xaxis);
                //   setAngle({x: xaxis, y: angle.y});
                // }}
              >
                <MaterialIcons name="arrow-back" size={30} color="white" />
              </TouchableOpacity>
      
              {/* CAMERA VIEW */}
              <Pressable style={styles.webViewContainer} onLongPress={() => setCamIP("")}>
                <WebView
                  onHttpError={() => setCamIP("")}
                  onError={() => setCamIP("")}
                  source={{ uri: `http://${camIP}:81/stream` }}
                  style={styles.webView}
                />
              </Pressable>
      
              {/* RIGHT Button */}
              <TouchableOpacity
                style={[styles.button, { height: '100%', justifyContent: 'center'}]}
                onPressIn={() => sendCommand("H_TURN_CAM:65")}
                onPressOut={() => sendCommand("H_TURN_CAM:90")}
                // onPressIn={() => {
                //   let xaxis = angle.x + 5;
                //   if(xaxis > 180){
                //     return
                //   }
                //   sendCommand("H_TURN_CAM:" + xaxis);
                //   setAngle({x: xaxis, y: angle.y});
                // }}
              >
                <MaterialIcons name="arrow-forward" size={30} color="white" />
              </TouchableOpacity>
            </View>
      
            {/* DOWN Button */}
            <TouchableOpacity
              style={[styles.button, { width: 250 }]}
              onPressIn={() => sendCommand("V_TURN_CAM:65")}
              onPressOut={() => sendCommand("V_TURN_CAM:90")}
              // onPressIn={() => {
              //   let yaxis = angle.y - 5;
              //   if(yaxis < 0){
              //     return
              //   }
              //   sendCommand("V_TURN_CAM:" + yaxis);
              //   setAngle({x: angle.x, y: yaxis});
              // }}
            >
              <MaterialIcons name="arrow-downward" size={30} color="white" />
            </TouchableOpacity>
          </View>
          : 
            <>
              <Text>Waiting for Camera...</Text>
              <TouchableOpacity
                style={{
                  backgroundColor: "grey",
                  padding: 20,
                  borderRadius: 10,
                  margin: 5,
                }}
                onPressIn={() => sendCommand("GET_CAM_IP")}
              >
                <Text style={{ color: "#fff", fontSize: 18 }}>Refresh</Text>
              </TouchableOpacity>
            </>
          }
          <View style={{ flexDirection: "row", justifyContent: "space-between", width: "80%", marginBottom: 20, marginTop: 30 }}>
            <TouchableOpacity
              style={{
                backgroundColor: "#4CAF50",
                padding: 20,
                borderRadius: 10,
                margin: 5,
                flex: 1,
                alignItems: "center",
              }}
              onPressIn={() => sendCommand("forward")}
              onPressOut={() => sendCommand("stop")}
            >
              <Text style={{ color: "#fff", fontSize: 18 }}>Forward</Text>
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-between", width: "80%" }}>
            <TouchableOpacity
              style={{
                backgroundColor: "#2196F3",
                padding: 20,
                borderRadius: 10,
                margin: 5,
                flex: 1,
                alignItems: "center",
              }}
              onPressIn={() => sendCommand("left")}
              onPressOut={() => sendCommand("stop")}
            >
              <Text style={{ color: "#fff", fontSize: 18 }}>Left</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: "#f44336",
                padding: 20,
                borderRadius: 10,
                margin: 5,
                flex: 1,
                alignItems: "center",
              }}
              onPressIn={() => sendCommand("right")}
              onPressOut={() => sendCommand("stop")}
            >
              <Text style={{ color: "#fff", fontSize: 18 }}>Right</Text>
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-between", width: "80%", marginTop: 20 }}>
            <TouchableOpacity
              style={{
                backgroundColor: "#FF9800",
                padding: 20,
                borderRadius: 10,
                margin: 5,
                flex: 1,
                alignItems: "center",
              }}
              onPressIn={() => sendCommand("backward")}
              onPressOut={() => sendCommand("stop")}
            >
              <Text style={{ color: "#fff", fontSize: 18 }}>Backward</Text>
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-between", width: "80%", marginTop: 20 }}>
            <TouchableOpacity
              style={{
                backgroundColor: "#b98e34",
                padding: 20,
                borderRadius: 10,
                margin: 5,
                flex: 1,
                alignItems: "center",
              }}
              onPressIn={() => {sendCommand("get_temp"); setTemperature([])}}
            >
              <Text style={{ color: "#fff", fontSize: 18 }}>Get Temp</Text>
            </TouchableOpacity>
          </View>
          {(Array.isArray(temperature) && temperature.length > 0) && <Text>{temperature.reduce((x, y) => x + y, 0) / temperature.length}°C</Text>}
          <View style={{ marginTop: 20, padding: 10, backgroundColor: "#e0e0e0", borderRadius: 10, width: "90%" }}>
            <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>GPS Data:</Text>
            <Text>Latitude: {gpsData.latitude.toFixed(6)}</Text>
            <Text>Longitude: {gpsData.longitude.toFixed(6)}</Text>
            <Text>Speed: {gpsData.speed.toFixed(2)} km/h</Text>
            <Text>Altitude: {gpsData.altitude.toFixed(2)} meters</Text>
            <Text>HDOP: {gpsData.hdop.toFixed(2)}</Text>
            <Text>Satellites: {gpsData.satellites}</Text>
            <Text>Time: {gpsData.time}</Text>
          </View>
        </View>
      </ScrollView>
    </>
  );
}

const styles = {
  button: {
    backgroundColor: "#cfcfcf",
    borderRadius: 5,
    alignItems: "center" as FlexAlignType,
  },
  webViewContainer: {
    width: 250,
    height: 150,
  },
  webView: {
    width: 250,
    height: 150,
  },
};