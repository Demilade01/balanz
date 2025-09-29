import {View, StyleSheet, Text} from "react-native";
import {AntDesign, Entypo} from "@expo/vector-icons";


const UserFinance = () => {
    return (
        <View style={styles.container}>
            <View style={styles.leftContainer}>
                <Text style={{
                    fontSize: 16,
                    fontWeight: "600",
                    color: "#303339"
                }}>
                    Total Balance
                </Text>
                <Text style={{
                    fontSize: 28,
                    fontWeight: "bold",
                    color: "#fff",
                    marginVertical:8
                }}>
                    $53,240.24
                </Text>
                <View style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10
                }}>
                    <View style={{
                        flexDirection: "row",
                        alignItems: "center",
                        backgroundColor: "#262832",
                        paddingHorizontal:16,
                        paddingVertical: 8,
                        borderRadius: 10,
                    }}>
                        <Text style={{
                            color: "#fff",
                            fontSize: 16,
                            fontWeight: "bold",

                        }}>
                            $520.23
                        </Text>
                    </View>
                    <View style={{
                        flexDirection:'row',
                        alignItems:'center'
                    }}>
                        <Text style={{
                            color: "#999",
                            fontSize: 12,
                            marginRight:2
                        }}>
                            Cashback Saved
                        </Text>
                        <Entypo name={"chevron-small-right"} size={28} color={"#999"}/>
                    </View>
                </View>
            </View>
            <View style={{
                position:'absolute',
                right:0,
                width:92,
                height:108,
                backgroundColor:"#E8434C",
                borderTopLeftRadius: 18,
                borderBottomLeftRadius:18
            }}/>
            <View style={{
                position:'absolute',
                top:20,
                right:15,
                width:92,
                height:72,
                backgroundColor:"#3283D4",
                borderTopLeftRadius: 10,
                zIndex:-10,
                borderBottomLeftRadius:10
            }}/>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        marginTop: 20
    },
    leftContainer: {
        padding: 10
    }
})


export default UserFinance