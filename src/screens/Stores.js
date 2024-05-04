import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { getStores } from "../api/Store";
import { ActivityIndicator } from "react-native-paper";
import themeColor from "../theme";

const Stores = ({ navigation }) => {
    const [laoding, setLoading] = useState(true);
    const [stores, setStores] = useState([]);
    const scrollViewRef = useRef(null);

    useEffect(() => {
        (async () => {
            await getStoresData();
        })();
    }, []);

    const getStoresData = async () => {
        await getStores().then((value) => {
            setStores(value);
            setLoading(false);
        }, (error) => {
            console.log(error);
        });
    };

    return (
        <ScrollView style={styles.mainContainer} ref={scrollViewRef}>
            <View style={styles.nearContainer}>
                <Text style={styles.nearText}>Tüm İşletmeler</Text>
                {laoding && <ActivityIndicator size="large" color={themeColor} />}
                {stores.map(store => (
                    <View style={styles.storeItem} key={store.id}>
                        <View style={styles.leftStoreContainer}>
                            <View style={styles.storeTitleContainer}>
                                <Text style={styles.storeName}>{store.title}</Text>
                                <Text style={styles.distance}>{store.distance ? store.distance + ' km' : ''}</Text>
                            </View>
                            <Text style={styles.storeDescriptionText}>{store.address}</Text>
                            <TouchableOpacity style={styles.listItemContainer} onPress={() => Linking.openURL('tel:' + store.phone)}>
                                <View style={styles.iconContainer}>
                                    <Ionicons name="call-outline" size={24} color={themeColor} />
                                </View>
                                <View style={styles.textContainer}>
                                    <Text style={styles.listItemText}>{store.phone}</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.listItemContainer} onPress={() => Linking.openURL('mailto:' + store.email)}>
                                <View style={styles.iconContainer}>
                                    <Ionicons name="mail-outline" size={24} color={themeColor} />
                                </View>
                                <View style={styles.textContainer}>
                                    <Text style={styles.listItemText}>{store.email}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}
            </View>
        </ScrollView>
    );
}

export default Stores;

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: "#fff"
    },
    map: {
        height: 250,
        width: "100%",
    },
    nearText: {
        fontSize: 12,
        color: "#202020",
        fontFamily: 'Poppins-SemiBold'
    },
    nearContainer: {
        padding: 25,
    },
    storeItem: {
    },
    leftStoreContainer: {
        width: "100%",
        paddingBottom: 15,
        paddingTop: 10,
    },
    rightStoreContainer: {
        flexDirection: "row",
        alignItems: "center"
    },
    storeTitleContainer: {
        flexDirection: "row",
        alignItems: "center"
    },
    storeName: {
        fontSize: 16,
        color: "#202020",
        fontFamily: 'Poppins-SemiBold'
    },
    distance: {
        fontSize: 12,
        color: "#202020",
        fontFamily: 'Poppins-Regular',
        marginLeft: 10
    },
    storeDescriptionText: {
        fontSize: 12,
        color: "#202020",
        fontFamily: 'Poppins-Regular'
    },
    marker: {
        height: 50,
        width: 50,
    },
    listItemContainer: {
        flexDirection: "row",
        alignItems: "center"
    },
    iconContainer: {
        justifyContent: "center",
        alignItems: "center",
        marginRight: 10
    },
})