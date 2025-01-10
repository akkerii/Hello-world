import React, {useState} from 'react';
import {View, Text, TextInput, Button, StyleSheet} from 'react-native';

const CurrencyConverterScreen = () => {
  const [amount, setAmount] = useState('');
  const [convertedAmount, setConvertedAmount] = useState('');

  const convertCurrency = async () => {
    try {
      const response = await fetch(
        `https://api.exchangerate-api.com/v4/latest/USD`,
      );
      const data = await response.json();
      const rate = data.rates.EUR; // Example: Convert to EUR
      setConvertedAmount((amount * rate).toFixed(2));
    } catch (error) {
      alert('Error fetching exchange rates.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Currency Converter</Text>
      <TextInput
        placeholder="Enter amount in USD"
        value={amount}
        onChangeText={setAmount}
        style={styles.input}
        keyboardType="numeric"
      />
      <Button title="Convert to EUR" onPress={convertCurrency} />
      {convertedAmount !== '' && (
        <Text style={styles.result}>Converted Amount: €{convertedAmount}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center', padding: 20},
  title: {fontSize: 24, fontWeight: 'bold', marginBottom: 20},
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  result: {fontSize: 18, marginTop: 20},
});

export default CurrencyConverterScreen;
