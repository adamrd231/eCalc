import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Modal, TouchableHighlight, Platform } from 'react-native';
import { requestPurchase, useIAP } from 'react-native-iap';


const TwentyOneModal = (props) => {
  
  const [ ageModalVisible, setAgeModalVisible ] = useState(true);

  const [ purchasedRemoveAds, setPurchasedRemoveAds ] = useState(false);

  const nonConsumableSkus = [
    'hideAdvertising',
  ];

  const {
    connected,
    products,
    subscriptions,
    getProducts,
    getSubscriptions,
    finishTransaction,
    currentPurchase,
    currentPurchaseError,
  } = useIAP();

  useEffect(() => {
    getProducts(nonConsumableSkus)
    console.log(getProducts(nonConsumableSkus))
    console.log(products)
  },[]);



    return (
        <Modal
        animationType="slide"
        transparent={true}
        visible={ageModalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.")
        }}>
        <View style={styles.modalContainer}>
          <View>
            <Text style={styles.modalTitle}>You must be 21 or over to use the edible calculator.</Text>
            <TouchableHighlight
              style={styles.modalButton}
              onPress={() => {
                setAgeModalVisible(false);
     
              }}>
              <Text style={{color: '#fff', paddingLeft: 15, paddingRight: 15}}>I AM 21 +</Text>
            </TouchableHighlight>
          </View>
          
          <View style={styles.adsContainer}>
            <Text style={{textAlign:'center',}}>In App Purchases</Text>
            <View>
              <Text style={styles.videoTitle}>{ (purchasedRemoveAds == true) ? "Purchase has been verified, thank you for supporting rdConcepts" : "Tired of watching videos?" }</Text>
              <TouchableHighlight
                style={ (purchasedRemoveAds == true) ? styles.modalButtonDisabled : styles.modalButton }
                onPress={() => {
                  console.log(getProducts(nonConsumableSkus))
                }}
                disabled={purchasedRemoveAds == true}>
                <Text style={{color: '#fff', paddingLeft: 15, paddingRight: 15}}>Remove Video Ads</Text>
              </TouchableHighlight>
            </View>
            <View>
              <Text style={styles.videoTitle}>{(purchasedRemoveAds == true) ? "" : "Already bought this?"}</Text>
              <TouchableHighlight
                style={ (purchasedRemoveAds == true) ? styles.modalButtonDisabled : styles.modalButton }
                onPress={() => {
                  // Request to see if there are previous purchases on the account
                  FetchPurchaseHistory()
                }}
                disabled={purchasedRemoveAds == true}>
                <Text style={{color: '#fff', paddingLeft: 15, paddingRight: 15}}>Restore Purchases</Text>
              </TouchableHighlight>
            </View>
          
            
          </View>
        </View>
        
      </Modal>
    );
};



const styles = StyleSheet.create({ 
   modalContainer: {
    backgroundColor: '#fff',
    height: '100%',
    width: '100%',
    textAlign: 'left',
    display: 'flex',
    alignItems: 'stretch',
    justifyContent: 'center',
    padding: 45,
  },

  adsContainer: {
    marginTop: 25,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#ededed",
  },

  modalButton: {
    color: '#fff',
    padding: 9,
    backgroundColor: '#00AAE5',
    borderRadius: 6,
    marginTop: 15,
    alignItems: 'center',
  },

  modalButtonDisabled: {
    color: '#fff',
    padding: 9,
    backgroundColor: '#fff',
    borderRadius: 6,
    marginTop: 15,
    alignItems: 'center',
  },

  modalTitle: {
    fontSize: 21,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  videoTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: -5,
    textAlign: 'center',
    color: "#555",
  },

});

export default TwentyOneModal;