import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getTransactions } from "../api/Account";
import themeColor from "../theme";

const AccountTransactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        (async () => {
            await getTransactionsData();
        })();
    }, []);

    const getTransactionsData = async () => {
        const data = await getTransactions();
        setTransactions(data);
        setLoading(false);
    }
    return (
        <ScrollView style={styles.mainContainer} contentContainerStyle={styles.scrollViewContent}>
            {loading && <ActivityIndicator size="large" color={themeColor} />}
            {(!loading && transactions.length === 0) && <Text maxFontSizeMultiplier={2} style={styles.noTransactionText}>Görüntelenecek hesap hareketi yok.</Text>}
            {transactions.map((transaction, index) => (
                <View key={index} style={styles.transactionItem}>
                    <View style={styles.leftContainer}>
                        {transaction.type == 1 ?
                            <Ionicons size={20} color={themeColor} name='add' style={styles.forwardIcon} />
                            :
                            <Ionicons size={20} color={'#d32f2f'} name='remove' style={styles.forwardIcon} />
                        }
                        <View>
                            <Text maxFontSizeMultiplier={1.2} style={styles.transactionItemTitleText}>{transaction.description}</Text>
                            {transaction.store && <Text maxFontSizeMultiplier={1.2} style={styles.transactionItemSubtitleText}>{transaction.store}</Text>}
                        </View>
                    </View>
                    <View style={styles.rightContainer}>
                        {transaction.type == 1 && <Text maxFontSizeMultiplier={1.2} style={styles.transactionItemPriceGreenText}>₺{transaction.credit && parseFloat(transaction.credit).toFixed(2)}</Text>}
                        {transaction.type == 2 && <Text maxFontSizeMultiplier={1.2} style={styles.transactionItemPriceRedText}>₺{transaction.debit && parseFloat(transaction.debit).toFixed(2)}</Text>}
                        {transaction.type == 3 && <Text maxFontSizeMultiplier={1.2} style={styles.transactionItemPriceRedText}>₺{transaction.debit && transaction.debit}</Text>}
                        <Text maxFontSizeMultiplier={1.2} style={styles.transactionItemSubtitleText}>{new Date(transaction.date).toLocaleString()}</Text>
                    </View>
                </View>
            ))}
        </ScrollView>
    );
};

export default AccountTransactions;

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: "#fff",
    },
    scrollViewContent: {
        padding: 25
    },
    categoryTitleText: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 18,
        color: '#202020',
        marginBottom: 10,
        marginTop: 10,
    },
    transactionItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 60,
        padding: 10,
    },
    leftContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rightContainer: {
        flexDirection: 'column',
        alignItems: 'flex-end',
    },
    transactionItemTitleText: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 14,
        color: '#202020',
        marginLeft: 10,
    },
    transactionItemSubtitleText: {
        fontFamily: 'Poppins-Regular',
        fontSize: 12,
        color: '#202020',
        marginLeft: 10,
    },
    transactionItemPriceGreenText: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 14,
        color: 'green',
    },
    transactionItemPriceRedText: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 14,
        color: '#d32f2f',
    },
    noTransactionText: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 18,
        color: '#202020',
        textAlign: 'center',
        marginTop: 20,
    },
});