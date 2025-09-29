import {View, StyleSheet,Text} from "react-native";
import {Entypo, Feather} from "@expo/vector-icons";


const BalanceStats = () => {
    return (
        <View style={{
            flexDirection: 'row',
            alignItems:'center',
            justifyContent:'space-between',
            paddingHorizontal:10,
            marginTop:10
        }}>
            <View style={styles.card}>
                <View style={styles.iconBackground}>
                    <Entypo name={"wallet"} size={24} color={"#fff"}/>
                </View>
                <Text style={styles.cardHeading}>
                    All Operations
                </Text>

                <View style={styles.bottomSection}>
                    <Text style={{
                        fontSize:10,
                        fontWeight:'500',
                        color:'#666B74',
                    }}>
                        Expires in Feb 2024
                    </Text>
                    <Text style={{
                        fontSize:16,
                        fontWeight:'500',
                        color:'#fff',
                        marginTop:2
                    }}>
                        $ 12,000
                    </Text>
                </View>
            </View>
            <View style={styles.card}>
                <View style={styles.iconBackground}>
                    <Feather name={"shopping-cart"} size={24} color={'#fff'}/>
                </View>
                <Text style={styles.cardHeading}>
                    Consumer Loan
                </Text>
                <View style={styles.bottomSection}>
                    <Text style={{
                        fontSize:16,
                        fontWeight:'500',
                        color:'#fff',
                        marginTop:2
                    }}>
                        - $2,240.00
                    </Text>
                    <View style={{
                        backgroundColor:"#112022",
                        paddingHorizontal:6,
                        paddingVertical:3,
                    }}>
                        <Text style={{
                            color:"#01BA59",
                            fontSize:10,
                            fontWeight:'600'
                        }}>
                            Next Payment in 13 days
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    card: {
        width: '48%',
        height: 150,
        borderRadius: 20,
        padding:20,
        backgroundColor: '#12151c'
    },
    iconBackground:{
        backgroundColor: '#262832',
        width:40,
        height:40,
        alignItems:'center',
        borderRadius:8,
        justifyContent:'center'
    },
    cardHeading:{
        fontSize:12,
        fontWeight:'500',
        color:'#fff',
        marginTop:8
    },
    bottomSection:{
        marginTop:15,
    }
})

export default BalanceStats