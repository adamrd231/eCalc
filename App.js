import React, { useState, useEffect } from 'react';
import Slider from '@react-native-community/slider';
// import admob from '@react-native-firebase/app';
import admob, { BannerAd, BannerAdSize, InterstitialAd, AdEventType, TestIds, firebase } from '@react-native-firebase/admob';

import { StyleSheet, View, Text, Keyboard, Button, TextInput } from 'react-native';
import TwentyOneModal from './components/twenty-one-modal';
import ExplanationModal from './components/explanation-modal';



// Google AdMob Setup
const adMobInterstitialID = 'ca-app-pub-4186253562269967/6422682781'
const adMobBannerID = 'ca-app-pub-4186253562269967/2356688537'


const App = () => {
    firebase.initializeApp()

    // Inputs for the user
    const [ thc, SetTHC ] = useState();
    const [ cbd, SetCBD ] = useState();
    const [ weight, Setweight ] = useState();
    const [ dosage, SetDosage ] = useState();
    const [ conversionFactor, setConversionFactor ] = useState(70);

  // Placeholder variables to reset the calculator
  const [ calculationForTHCDosage, setcalculationForTHCDosage ] = useState();
  const [ calculationForCBDDosage, setcalculationForCBDDosage ] = useState();
  const [ calculationForTotalTHC, setcalculationForTotalTHC ] = useState();
  const [ calculationForTotalCBD, setcalculationForTotalCBD ] = useState();
  
  // const [ageVerification, setAgeVerification ] = useState(true);

  const [modalVisible, setModalVisible] = useState(false);

  // Variable controlling purchased ads
  const [ purchasedRemoveAds, setPurchasedRemoveAds ] = useState(false);

  const CalculateDosage = () => {
    const numberOfSplitsforTHC = ((((thc * 0.01) * (weight * 1000)) * (0.01 * conversionFactor)) / dosage).toFixed()
    const numberOfSplitsforCBD = ((((cbd * 0.01) * (weight * 1000)) * (0.01 * conversionFactor)) / dosage).toFixed()
    const totalTHCinBatch = ((thc * 0.01) * (weight * 1000) * (0.01 * conversionFactor)).toFixed()
    const totalCBDinBatch = ((cbd * 0.01) * (weight * 1000) * (0.01 * conversionFactor)).toFixed()
    setcalculationForTotalTHC(totalTHCinBatch)
    setcalculationForTotalCBD(totalCBDinBatch)
    setcalculationForTHCDosage(numberOfSplitsforTHC)
    setcalculationForCBDDosage(numberOfSplitsforCBD)
    
    SetInterstitialCount(interstitialCount + 1)
  }

  // Keep track for when to play interstitial videos
  const [ interstitialCount, SetInterstitialCount ] = useState(0);
 
  // Interstitial setup
  const interstitial = InterstitialAd.createForAdRequest("ca-app-pub-3940256099942544/1033173712");

  interstitial.onAdEvent((type) => {
    if (type === AdEventType.LOADED) {
      interstitial.show();
    }
  });

  useEffect(() => {
  console.log("Home Screen Purchased Remove Ads:", purchasedRemoveAds)

    if (purchasedRemoveAds == false) {
      if (interstitialCount == 2) {
        SetInterstitialCount(0)
        interstitial.load()
      }
    }
  }, [interstitialCount, SetInterstitialCount]);

  
  return (
    
    <View style={styles.container}>
      <ExplanationModal modalVisible={modalVisible} setModalVisible={setModalVisible} />
      <TwentyOneModal purchasedRemoveAds={purchasedRemoveAds} setPurchasedRemoveAds={setPurchasedRemoveAds} />
      
      <View style={styles.topContainer} >
        <Text 
          style={styles.questions}
          onPress={() => {
            setModalVisible(!modalVisible)
          }}>
            ?
        </Text>

          <View style={styles.cannaContainer}>
            <View style={styles.thcContainer}>
              <Text style={styles.title}>THC%</Text>
                <TextInput 
                    style={styles.inputField}
                    value={thc ? String(thc) : ""} 
                    placeholder='THC%'
                    onChangeText={thc => SetTHC(thc)}
                    keyboardType='numeric' 
                    returnKeyLabel='Done'
                    returnKeyType='done'
                    onSubmitEditing={Keyboard.dismiss}/>
            </View>
            <View style={styles.cbdContainer}>
              <Text style={styles.title}>CBD%</Text>
                <TextInput 
                    style={styles.inputField}
                    value={cbd ? String(cbd) : ""} 
                    placeholder='CBD%'
                    onChangeText={cbd => SetCBD(cbd)}
                    keyboardType='numeric' 
                    returnKeyLabel='Done'
                    returnKeyType='done'
                    onSubmitEditing={Keyboard.dismiss}/>
            </View>
          </View>
      
          <View>
            <Text style={styles.title}>Weight (grams)</Text>
            <TextInput 
                placeholder="Weight"
                style={styles.inputField}
                value={weight ? String(weight) : ""} 
                onChangeText={weight => Setweight(weight)}
                keyboardType='numeric'
                keyboardType='numeric' 
                returnKeyLabel='Done'
                returnKeyType='done'
                onSubmitEditing={Keyboard.dismiss}/>
          </View>
          <View>
            <Text style={styles.title}t>Number of Units in the Batch</Text>
            <TextInput 
                style={styles.inputField}
                value={dosage ? String(dosage) : ""} 
                placeholder='# of Doses'
                onChangeText={dosage => SetDosage(dosage)}
                keyboardType='numeric'
                keyboardType='numeric' 
                returnKeyLabel='Done'
                returnKeyType='done'
                onSubmitEditing={Keyboard.dismiss}/>
          </View>
       
        <Text style={styles.title}>Conversion Factor: {conversionFactor}</Text>
        <View>
          <Slider 
            value={conversionFactor}
            onSlidingComplete={(conversionFactor) => setConversionFactor(conversionFactor)}
            style={styles.slider}
            minimumValue={0}
            maximumValue={100}
            step={1}
            minimumTrackTintColor="#444"
            maximumTrackTintColor="#111"
            thumbTintColor="#00AAE5"/>
          <Button
            title="Calculate"
            onPress={ () => {
              CalculateDosage()
              
            } }
            disabled={thc == "" || weight == "" || dosage == "" || isNaN(dosage) || isNaN(weight) || isNaN(thc)}
            color="#00AAE5"
            padding={11}/>
        </View>
        
        
        <View style={styles.cannaAnswers}>
          <View style={styles.cannaAnswerTHC}>
            <Text style={styles.answers}>THC in batch</Text>
            <Text style={styles.bold}>{calculationForTotalTHC ? (calculationForTotalTHC + "mg") : ""}</Text>
          </View>

          <View style={styles.cannaAnswerCBD}>
            <Text style={styles.answers}>CBD in batch</Text>
            <Text style={styles.bold}>{calculationForTotalCBD ? (calculationForTotalCBD + "mg") : ""}</Text>
          </View>
        </View>
          
          <Text style={styles.answers}>Total cannabinoids per serving</Text>
          <View>
            <Text style={styles.bold}>{calculationForTHCDosage ? (calculationForTHCDosage + "mg THC") : ""}</Text>
            <Text style={styles.bold}>{calculationForCBDDosage ? (calculationForCBDDosage + "mg CBD") : ""}</Text>
          </View>
          
        
        
      </View>
      <View style={styles.adConatainer}>
        <BannerAd
            unitId={"ca-app-pub-3940256099942544/6300978111"}
            size={BannerAdSize.LARGE_BANNER}/>
            
      </View>
    </View>
  );
};

const styles = StyleSheet.create({



  container: {
    flex: 1,
    flexWrap: 'nowrap',
    // alignContent: 'stretch',
    backgroundColor: '#efefef',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 30,
    paddingRight: 30,
    
  },

  adConatainer: {
    alignItems: 'center',
  },

  cannaContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'stretch',
    textAlign: 'center',
},

thcContainer: {
    flexGrow: 1,
    
},

cbdContainer: {
    flexGrow: 1,
},

inputField: {
    fontSize: 15,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#dddddd',
    borderRadius: 5,
    padding: 5,
    margin: 5,
    marginBottom: 12,
    minHeight: 50,
    textAlign: 'center',
},

  slider: {
    height: 50,
    width: '100%',
  },

  bold: {
    fontWeight: 'bold',
    fontSize: 17,
    padding: 1,
    display: 'flex',
    justifyContent: 'center',
    textAlign: 'center',
  },

  ageVerfication: {
    flex: 1,
    flexWrap: 'nowrap',
    // alignContent: 'stretch',
    backgroundColor: '#dddddd',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 7,
    
  },

  topContainer: {
    alignItems: 'stretch',
    textAlign: 'center',
    padding: 35,
  },

  

  title: {
    fontWeight: "bold",
    textAlign: 'center',
  },

  headingOne: {
    fontWeight: "bold",
    fontSize: 17,
    padding: 12,
  },

  

  answerContainer: {
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10,
  },

  answers: {
    fontSize: 13,
    padding: 5,
    textAlign: "center",
    display: 'flex',
    justifyContent: 'center',
    textAlign: 'center',
  },

  questions: {
    fontSize: 35,
    color: "#00AAE5",
    fontWeight: "bold",
    paddingBottom: 5,
    paddingTop: 0,
    textAlign: 'center',
  },

  cannaAnswers: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    textAlign: 'center',
    paddingTop: 7,
  },

  cannaAnswerTHC: {
    display: 'flex',
    justifyContent: 'center',
    textAlign: 'center',
    
  },



});

export default App;