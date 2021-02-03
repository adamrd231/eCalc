import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Modal, TouchableHighlight, Platform } from 'react-native';
import * as RNIap from 'react-native-iap';
import {
  purchaseErrorListener,
  purchaseUpdatedListener,
  ProductPurchase,
  PurchaseError,
} from 'react-native-iap';

const TwentyOneModal = (props) => {

  const [ purchasedRemoveAds, setPurchasedRemoveAds ] = useState(false);

  const [ ageModalVisible, setAgeModalVisible ] = useState(true);

  const itemSkus = Platform.select({
    ios: ['hideAdvertising'],
    android: ['remove_ads'],
  });


  useEffect(() => {
    CetAvailableInAppPurchases()
  }, []);


  const CetAvailableInAppPurchases = async () => {
    // Check for any pending purchases and flush them?
    // RNIap.initConnection().then(() => {
    //   RNIap.flushFailedPurchasesCachedAsPendingAndroid().catch( (error) => {
    //     console.log("error", error)
    //   })
    // })

    // Get all available products for purchase
    const products = await RNIap.getProducts(itemSkus)
    console.log(products)
    // Check purchase history, if already bought, set state.
    const purchaseHistory = await RNIap.getAvailablePurchases()

    console.log("Available Purchases", purchaseHistory)

    if (purchaseHistory) {
      console.log("Purchase History", purchaseHistory)

      if (Platform.OS == "android") {
          // Check if there is an android purchase
        const androidPurchaseHisotry = purchaseHistory[0]
        console.log("Inside android OS", androidPurchaseHisotry)
        if (androidPurchaseHisotry) {
          console.log("Setting ads removed to true")
          setPurchasedRemoveAds(true);
          props.setPurchasedRemoveAds(true);
        } else {
          setPurchasedRemoveAds(false);
          props.setPurchasedRemoveAds(false);
        }
      } else {
        // Check if there is an iOS Purchase
        const iosPurchaseHistory = purchaseHistory[0]
        console.log("inside ios purchase history")
        if (iosPurchaseHistory) {
          setPurchasedRemoveAds(true);
          props.setPurchasedRemoveAds(true);
        } else {
          setPurchasedRemoveAds(false);
          props.setPurchasedRemoveAds(false);
        }
      }
    }
};

  async function requestPurchase() {

    // Start the purchase by requesting the item 
    const purchase = await RNIap.requestPurchase(itemSkus[0])
      .then( inAppPurchase => {
        const receipt = inAppPurchase.transactionReceipt

        if (receipt) {
          try {
            // Depending on platform, acknowledge purchase differently
            if (Platform.OS === 'android') {
              RNIap.acknowledgePurchaseAndroid(inAppPurchase.purchaseToken)
            } else if (Platform.OS === 'ios') {
              RNIap.finishTransactionIOS(inAppPurchase.transactionId)
            }
            RNIap.finishTransaction(inAppPurchase, false)
            // Update variable to stop video ads in app
            setPurchasedRemoveAds(true);
            props.setPurchasedRemoveAds(true);

          } catch (error) {
            console.log()
            // If no receipt then play ads
            setPurchasedRemoveAds(false);
            props.setPurchasedRemoveAds(false);
          }
        }
    });
  };

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
            <Text style={styles.modalTitle}>You must be 21 or over to use this app.</Text>
            <TouchableHighlight
              style={styles.modalButton}
              onPress={() => {
                setAgeModalVisible(false);
     
              }}>
              <Text style={{color: '#fff', paddingLeft: 15, paddingRight: 15}}>I AM 21 +</Text>
            </TouchableHighlight>
          </View>
          
          <View>
            
            <Text style={styles.videoTitle}>{purchasedRemoveAds == true ? "Thanks for supporting rdConcepts" : "Would you like to remove video ads?" }</Text>
            <TouchableHighlight
              style={ (purchasedRemoveAds == true) ? styles.modalButtonDisabled : styles.modalButton }
              onPress={() => {
                requestPurchase()
              }}
              disabled={purchasedRemoveAds == true}>
              <Text style={{color: '#fff', paddingLeft: 15, paddingRight: 15}}>Remove Video Ads</Text>
            </TouchableHighlight>
            
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
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  videoTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 12,
    textAlign: 'center',
    color: "#555",
  },

});

export default TwentyOneModal;