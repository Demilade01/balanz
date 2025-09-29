import {View, StyleSheet, Text, Image} from "react-native";
import {Feather, Ionicons} from "@expo/vector-icons";


const AppBar = () => {
    return (
        <View style={styles.appBar}>
            <View style={styles.leftContainer}>
                <Image
                    source={{uri: "https://avatars.githubusercontent.com/u/55942632?v=4"}}
                    style={{
                        width: 36,
                        height: 36,
                        borderRadius: 10
                    }}
                />
                <Text style={{
                    color: "#fff",
                    fontSize: 18,
                    fontWeight: 'bold'
                }}>
                    Mitchel W
                </Text>
            </View>
            <View style={styles.rightContainer}>
                <Feather name={"search"} size={24} color={"#fff"}/>
                <Feather name={"bell"} size={24} color={"#fff"}/>
                <View style={styles.btn}>
                    <Ionicons name={"scan-outline"} size={24} color={"#fff"}/>
                </View>
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    rightContainer: {
        flexDirection: 'row',
        gap: 18,
        alignItems: 'center'
    },
    leftContainer: {
        flexDirection: 'row',
        gap: 18,
        alignItems: 'center'
    },
    appBar: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 18,
        marginTop: 50,
    },
    btn: {
        backgroundColor: '#262832',
        borderRadius: 50,
        padding: 8,
        alignItems: 'center',
        justifyContent: 'center'
    },

})


export default AppBar