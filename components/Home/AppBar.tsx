import {View, StyleSheet, Text, Image, TouchableOpacity, Alert} from "react-native";
import {Feather, Ionicons} from "@expo/vector-icons";
import { useAuth } from "../../contexts/AuthContext";


const AppBar = () => {
    const { user, signOut } = useAuth();

    const handleSignOut = () => {
        Alert.alert(
            'Sign Out',
            'Are you sure you want to sign out?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Sign Out',
                    style: 'destructive',
                    onPress: async () => {
                        await signOut();
                    }
                }
            ]
        );
    };

    const getUserDisplayName = () => {
        if (user?.email) {
            return user.email.split('@')[0];
        }
        return 'User';
    };

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
                    {getUserDisplayName()}
                </Text>
            </View>
            <View style={styles.rightContainer}>
                <Feather name={"search"} size={24} color={"#fff"}/>
                <Feather name={"bell"} size={24} color={"#fff"}/>
                <TouchableOpacity style={styles.btn} onPress={handleSignOut}>
                    <Ionicons name={"log-out-outline"} size={24} color={"#fff"}/>
                </TouchableOpacity>
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