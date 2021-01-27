import { firebase } from '@react-native-firebase/admob';
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Keyboard, Button, TextInput, Modal, TouchableHighlight, Platform } from 'react-native';
import * as RNIap from 'react-native-iap';
import {
  purchaseErrorListener,
  purchaseUpdatedListener,
  type ProductPurchase,
  type PurchaseError,
} from 'react-native-iap';

const TwentyOneModal = (props) => {

  const [ productReceipt, SetProductReceipt ] = useState(null);
  const [ ageModalVisible, setAgeModalVisible ] = useState(true);

  const itemSkus = Platform.select({
    ios: ['hideAdvertising'],
    android: ['remove_ads'],
  });



  useEffect(() => {
    console.log("Console Log product receipt", productReceipt)
    CetAvailableInAppPurchases()
    
  }, []);


  async function requestPurchase() {
    console.log("Requesting Purchase")
    // Start the purchase by requesting the item from the google play store
    const purchase = await RNIap.requestPurchase('remove_ads').then( inAppPurchase => {

      const receipt = inAppPurchase.transactionReceipt

      if (receipt) {
        // Save the product product reciept to a state variable
        SetProductReceipt(receipt)
        console.log("Receipt:" + receipt)
        console.log("State Receipt" + productReceipt)

        // If the product receipt is saved from the transaction then...
        if (receipt) {
          // Make sure we are using android then...
          if (Platform.OS === 'android') {
            // This is a one time purchase
            console.log("Attempting to acknowledge purchase")
            RNIap.acknowledgePurchaseAndroid(inAppPurchase.purchaseToken)
          }

          RNIap.finishTransaction(inAppPurchase, false)
        } 
      }
    });
  };

  const CetAvailableInAppPurchases = async () => {

      // Check for any pending purchases and flush them?
      RNIap.initConnection().then(() => {
        RNIap.flushFailedPurchasesCachedAsPendingAndroid().catch( (error) => {
          console.log(error)
        })
      })
      

      // Get all available products for purchase
      const products = await RNIap.getProducts(itemSkus)
      console.log(products)

      // Check purchase history, if already bought, set state.
      const purchaseHistory = await RNIap.getPurchaseHistory()
      console.log("Purchase History", purchaseHistory)
      if (purchaseHistory) {
        SetProductReceipt(purchaseHistory)
      }
  }

   

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
                props.SetHomeProductReceipt(productReceipt)
              }}>
              <Text style={{color: '#fff', paddingLeft: 15, paddingRight: 15}}>I AM 21 +</Text>
            </TouchableHighlight>
          </View>
          
          <View>
            
            <Text style={styles.videoTitle}>{productReceipt ? "Thanks for supporting rdConcepts" : "Would you like to remove video ads?" }</Text>
            <TouchableHighlight
              style={ productReceipt ? styles.modalButtonDisabled : styles.modalButton }
              onPress={() => {
                requestPurchase()
              }}
              disabled={productReceipt}>
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