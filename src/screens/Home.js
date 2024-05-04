import React, { useState, useEffect, useCallback, useRef } from "react";
import { View, Animated, Text, SafeAreaView, StyleSheet, TouchableOpacity, ScrollView, RefreshControl } from "react-native";
import { useFocusEffect } from '@react-navigation/native';
import Ionicons from "react-native-vector-icons/Ionicons";
import greetingsProvider from '../utils/GreetingsProvider';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActivityIndicator, Provider } from "react-native-paper";
import themeColor from "../theme";
import LinearGradient from "react-native-linear-gradient";
import { getCurrentMemberInfo } from "../api/Member";
import { formatNumber } from "../utils/Utils";
import { getTransactions } from "../api/Account";

const Home = ({ navigation }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [memberName, setMemberName] = useState('');
  const [postsLoading, setPostsLoading] = useState(true);
  const [memberInfo, setMemberInfo] = useState({});
  const [userType, setUserType] = useState();
  const [lastTransactions, setLastTransactions] = useState([]);
  useEffect(() => {
    (async () => {
      setUserType(await AsyncStorage.getItem('userType'));
      await getIfAuthenticated();
      await getMemberInfo();
      await getAccountTransactions();
    })();
  }, []);

  const getIfAuthenticated = async () => {
    AsyncStorage.getItem('isAuthenticated').then((value) => {
      setIsAuthenticated(value === 'true');
      AsyncStorage.getItem('memberInfo').then((value) => {
        if (value !== null) {
          const memberInfo = JSON.parse(value);
          setMemberName(memberInfo.name ?? memberInfo.title);
        }
      });
    });
  };

  const getMemberInfo = async () => {
    getCurrentMemberInfo().then((response) => {
      setMemberInfo(response);
      setPostsLoading(false);
    });
  }

  const getAccountTransactions = async () => {
    getTransactions().then((response) => {
      const lastTransactions = response.slice(0, 5);
      setLastTransactions(lastTransactions);
    });
  }

  // Refresh Control
  const [refreshing, setRefreshing] = useState(false);
  const [membershipRefreshing, setMembershipRefreshing] = useState(false);
  const [postsRefreshing, setPostsRefreshing] = useState(false);
  useEffect(() => {
    (async () => {
      if (postsRefreshing) {
        setGreetingMessage(greetingsProvider());
        await getMemberInfo();
        await getAccountTransactions();
        setPostsRefreshing(false);
      }
    })();
  }, [postsRefreshing]);

  useEffect(() => {
    if (!postsRefreshing && !membershipRefreshing) {
      setRefreshing(false);
    }
  }, [membershipRefreshing, postsRefreshing]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setMembershipRefreshing(true);
    setPostsRefreshing(true);
  }, []);

  // Greeting Message
  const [greetingMessage, setGreetingMessage] = useState('');
  useFocusEffect(() => {
    setGreetingMessage(greetingsProvider());
  });

  // Animations
  const scrollY = useRef(new Animated.Value(0)).current;
  const bigGreetingHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [40, 0],
    extrapolate: 'clamp'
  });
  const headerTextOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0],
    extrapolate: 'clamp'
  });
  const headerSmallTextOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 1],
    extrapolate: 'clamp'
  });
  const headerContainerHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [100, 60],
    extrapolate: 'clamp'
  });
  return (
    <Provider>
      <SafeAreaView style={styles.mainContainer}>
        <Animated.View style={{ ...styles.headerContainer, minHeight: headerContainerHeight }}>
          <Animated.View style={{ opacity: headerSmallTextOpacity, ...styles.smallGreetingTextContainer }}>
            <Text maxFontSizeMultiplier={1} style={styles.smallGreetingText}>{greetingMessage} {memberName}</Text>
          </Animated.View>
          <Animated.View style={{ opacity: headerTextOpacity, height: bigGreetingHeight }}>
            <Text maxFontSizeMultiplier={1} style={styles.greetingText}>{greetingMessage} {memberName}</Text>
          </Animated.View>
          <View style={styles.headerButtonsContainer}>
            <View style={styles.leftHeaderButtonsContainer}>
            </View>
            <View>
              <TouchableOpacity style={styles.buttonContainer} onPress={() => navigation.navigate("Settings")}>
                <Ionicons name="cog-outline" size={22} color="#212121" style={styles.icon} />
                <Text style={styles.buttonText}>Ayarlar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
        <View style={{ position: 'relative', height: 0, zIndex: 10 }}>
          <LinearGradient start={{ x: 1, y: 0 }} end={{ x: 1, y: 1 }} colors={['rgba(0,0,0,0.1)', 'transparent']} style={{ height: 20 }} ></LinearGradient>
        </View>
        <ScrollView refreshControl={
          <RefreshControl
            refreshing={(isAuthenticated && membershipRefreshing && postsRefreshing) || (!isAuthenticated && postsRefreshing)}
            onRefresh={onRefresh}
          />
        }
          onScroll={(e) => {
            var scrolly = e.nativeEvent.contentOffset.y;
            scrollY.setValue(scrolly);
          }}
          scrollEventThrottle={16}
        >
          {postsLoading && <ActivityIndicator size="" color={themeColor} style={styles.activityIndicator} />}
          <View style={styles.card}>
            <View style={styles.cardHeaderContainer}>
              <Text style={styles.cardHeader}>Bakiye</Text>
            </View>
            <View style={styles.cardContent}>
              <View style={styles.row}>
                <View style={styles.column}>
                  {userType == 'member' &&
                    <View>
                      <Text>Kalan Bakiye</Text>
                      <Text style={styles.balanceText}>{formatNumber(memberInfo.totalBalance)} TL</Text>
                    </View>
                  }
                  {userType == 'dealer' &&
                    <View>
                      <Text>Bekleyen Bakiye</Text>
                      <Text style={styles.balanceText}>{formatNumber(memberInfo.waitingBalance)} TL</Text>
                    </View>
                  }
                </View>
                <View style={styles.column}>
                  {userType == 'dealer' &&
                    <Text style={styles.description}>Bekleyen bakiyeniz gelecek ayın ilk iş gününde hesabınıza aktarılacaktır.</Text>}
                </View>
              </View>
            </View>
          </View>
          <View style={styles.card}>
            <View style={styles.cardHeaderContainer}>
              <Text style={styles.cardHeader}>Son Hareketler</Text>
            </View>
            <View style={styles.cardContent}>
              {lastTransactions.map((transaction, index) => (
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
            </View>
            <View style={styles.cardFooter}>
              <TouchableOpacity onPress={() => navigation.navigate("AccountTransactions")}>
                <Text style={{ fontFamily: 'Poppins-Medium', padding: 10 }}>Tüm Hesap Hareketleri</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.card}>
            <View style={styles.cardHeaderContainer}>
              <Text style={styles.cardHeader}>İşletmeler</Text>
            </View>
            <View style={styles.cardContent}>
              <TouchableOpacity onPress={() => navigation.navigate("Stores")}>
                <View style={styles.row}>
                  <View style={styles.column}>
                    <Ionicons name="business-outline" size={100} color={themeColor} />
                  </View>
                  <View style={styles.column}>
                    <Text style={styles.balanceText}>İşletmelere Gözatın</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
        {isAuthenticated && userType == 'member' && <TouchableOpacity style={styles.QRButton} onPress={() => navigation.navigate("QRCode")}>
          <Text maxFontSizeMultiplier={2} style={styles.QRButtonText}>QR Okut</Text>
        </TouchableOpacity>}
        {isAuthenticated && userType == 'dealer' && <TouchableOpacity style={styles.QRButton} onPress={() => navigation.navigate("QRCollection")}>
          <Text maxFontSizeMultiplier={2} style={styles.QRButtonText}>Ödeme Al</Text>
        </TouchableOpacity>}
      </SafeAreaView >
    </Provider>
  );
}

export default Home;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerContainer: {
    padding: 10,
    backgroundColor: "#fff",
    borderBottomColor: "#ddd",
    borderBottomWidth: 1,
  },
  greetingText: {
    fontSize: 20,
    color: "#212121",
    paddingHorizontal: 10,
    paddingBottom: 10,
    fontFamily: 'Poppins-SemiBold'
  },
  smallGreetingTextContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  smallGreetingText: {
    fontSize: 14,
    color: '#212121',
    fontFamily: 'Poppins-SemiBold',
    lineHeight: 20
  },
  headerButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: "#393939",
    fontFamily: 'Poppins-Medium'
  },
  leftHeaderButtonsContainer: {
    flexDirection: "row",
  },
  icon: {
    marginRight: 5
  },
  QRButton: {
    backgroundColor: themeColor,
    borderRadius: 50,
    minWidth: 120,
    minHeight: 40,
    position: "absolute",
    bottom: 30,
    right: 20,
    paddingHorizontal: 20,
    paddingVertical: 5,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    elevation: 10
  },
  QRButtonText: {
    color: "#fff",
    fontFamily: 'Poppins-SemiBold'
  },
  createAccountButton: {
    backgroundColor: themeColor,
    borderRadius: 50,
    width: 150,
    height: 40,
    position: "absolute",
    bottom: 10,
    right: 10,
    paddingHorizontal: 20,
    paddingVertical: 5,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    elevation: 10
  },
  activityIndicator: {
    marginTop: 20
  },
  card: {
    backgroundColor: "#fff",
    margin: 10,
    borderRadius: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cardHeaderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomColor: "#ddd",
    borderBottomWidth: 1,
    marginBottom: 10,
    padding: 10
  },
  cardHeader: {
    fontSize: 18,
    color: "#212121",
    fontFamily: 'Poppins-SemiBold'
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  column: {
    flexDirection: "column",
  },
  cardContent: {
    padding: 10
  },
  balanceText: {
    fontSize: 20,
    color: "#212121",
    fontFamily: 'Poppins-SemiBold'
  },
  cardFooter: {
    padding: 10,
    borderTopColor: "#ddd",
    borderTopWidth: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 60,
    paddingVertical: 10,
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
  transactionItemPriceTextMinus: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    color: '#d32f2f',
  },
  description: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: '#202020',
    width: 200,
  },
});