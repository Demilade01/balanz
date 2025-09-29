import {View, StyleSheet, Text, Pressable, ScrollView, Image} from "react-native";


const TransferList = () => {
    return (
        <View style={styles.container}>

            <View style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 10
            }}>
                <Text style={styles.heading}>
                    Quick Money Transfer
                </Text>
                <Pressable>
                    <Text style={styles.btnText}>
                        View All
                    </Text>
                </Pressable>
            </View>

            <ScrollView style={{
                marginTop:20
            }} showsHorizontalScrollIndicator={false} horizontal>
                <Image source={{uri: "https://i.pravatar.cc/150?img=64"}} style={styles.avatar}/>
                <Image source={{uri: "https://i.pravatar.cc/150?img=12"}} style={styles.avatar}/>
                <Image source={{uri: "https://i.pravatar.cc/150?img=43"}} style={styles.avatar}/>
                <Image source={{uri: "https://i.pravatar.cc/150?img=23"}} style={styles.avatar}/>
                <Image source={{uri: "https://i.pravatar.cc/150?img=21"}} style={styles.avatar}/>
                <Image source={{uri: "https://i.pravatar.cc/150?img=19"}} style={styles.avatar}/>
            </ScrollView>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        backgroundColor: "#12151C",
        marginHorizontal: 10,
        marginTop: 20,
        padding: 20,
        borderRadius: 10,
    },
    heading: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "bold",
    },
    btnText: {
        color: "#BC385A",
        fontSize: 14,
        fontWeight: "500",
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 50,
        marginRight:10,
    }
})

export default TransferList