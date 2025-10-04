import {View, StyleSheet, Text, ActivityIndicator} from "react-native";
import {AntDesign, Entypo} from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { syncService } from "../../lib/mono";


interface Account {
  id: string;
  bank_name: string;
  account_name: string;
  balance: number;
  currency: string;
}

const UserFinance = () => {
    const { user } = useAuth();
    const [totalBalance, setTotalBalance] = useState<number>(0);
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadFinancialData();
    }, [user]);

    const loadFinancialData = async () => {
        if (!user?.id) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);

            // Get user's accounts from Supabase
            const accountsResult = await syncService.getUserAccounts(user.id);

            if (accountsResult.success && accountsResult.data) {
                const userAccounts = accountsResult.data as Account[];
                setAccounts(userAccounts);

                // Calculate total balance across all accounts
                const total = userAccounts.reduce((sum, account) => sum + account.balance, 0);
                setTotalBalance(total);
            }
        } catch (error) {
            console.error('Error loading financial data:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amountMinor: number, currency = 'NGN') => {
        const amount = amountMinor / 100; // Convert from minor units (kobo) to major units

        switch (currency) {
            case 'NGN':
                return `₦${amount.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
            case 'USD':
                return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
            default:
                return `${currency} ${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        }
    };

    if (loading) {
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
                    <View style={{ marginVertical: 8, alignItems: 'center' }}>
                        <ActivityIndicator color="#fff" size="small" />
                    </View>
                </View>
            </View>
        );
    }

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
                    {formatCurrency(totalBalance)}
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
                            {accounts.length} Account{accounts.length !== 1 ? 's' : ''}
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
                            Connected
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