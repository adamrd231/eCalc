import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Keyboard, Button, TextInput, Modal, TouchableHighlight, Platform } from 'react-native';


const TwentyOneModal = () => {

    const [ageModalVisible, setAgeModalVisible] = useState(true);

    return (
        <Modal
        animationType="slide"
        transparent={true}
        visible={ageModalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.")
        }}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>You must be 21 or over to use this app.</Text>
          <TouchableHighlight
            style={styles.modalButton}
            onPress={() => {
              setAgeModalVisible(false);
            }}>
            <Text style={{color: '#fff', paddingLeft: 15, paddingRight: 15}}>I AM 21 +</Text>
          </TouchableHighlight>
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

  modalTitle: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 9,
  },

  modalText: {
 
  },
});

export default TwentyOneModal;