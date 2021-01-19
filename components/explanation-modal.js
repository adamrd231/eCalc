import React from 'react';
import { StyleSheet, View, Text, Modal, TouchableHighlight } from 'react-native';


const ExplanationModal = (props) => {

    const isModalVisible = props.modalVisible

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => { Alert.alert("Modal has been closed.") }}>
            <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>Notes</Text>
                <Text style={styles.modalText}>Calculator does not factor in decarboxylation loss. The advertised % of flower sold in recreational sales usually already takes into consideration a loss factor.</Text>
                <Text style={styles.modalText}>What is not accounted for is the loss when making edibles from flower, and why we added a "conversion factor", current research shows only about 70% of thca will convert.</Text>
                <Text style={styles.modalText}>Additionally when infusing into coconut oil, butter, etc a percentage of the thc will be left behind no matter how thorough the process. Using the conversion factor you can learn more about your techniques loss factors to more accurately predict potency.</Text>
                <Text style={styles.modalText}>Please feel free to email with any advice, suggestions, questions, or haiku's. Thank you for downloading and using our calculator</Text>
                <Text style={styles.modalTitle}>Equation:</Text>
                <Text style={styles.modalText}>(THC% * Weight * conversionFactor) / THC Per Unit</Text>
                <TouchableHighlight
                    style={styles.modalButton}
                    onPress={() => {
                    props.setModalVisible(false);}}>
                    <Text style={{color: '#fff', paddingLeft: 15, paddingRight: 15}}>DONE</Text>
                </TouchableHighlight>
            </View>
        </Modal>
    );2
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

export default ExplanationModal;