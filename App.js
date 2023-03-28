import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TextInput, View, FlatList } from 'react-native';
import * as SQLite from 'expo-sqlite';
import React, { useState, useEffect } from 'react';
import { Header } from '@rneui/themed';
import { Icon } from '@rneui/themed';
import { Input, Button } from '@rneui/themed';
import { ListItem } from '@rneui/themed';


const db = SQLite.openDatabase('ostodb.db');

export default function App() {

  const [amount, setAmount] = useState('');
  const [product, setProduct] = useState('');
  const [ostokset, setOstokset] = useState([]);

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql('create table if not exists osto (id integer primary key not null, amount text, product text);');
    }, null, updateList); 
  }, []);

  // Save osto
  const saveItem = () => {
    db.transaction(tx => {
        tx.executeSql('insert into osto (amount, product) values (?, ?);', [amount, product]);    
      }, null, updateList
    )
  }

  // Update ostolist
  const updateList = () => {
    db.transaction(tx => {
      tx.executeSql('select * from osto;', [], (_, { rows }) =>
        setOstokset(rows._array)
      ); 
    });
  }

  // Delete osto
  const deleteItem = (id) => {
    db.transaction(
      tx => {
        tx.executeSql(`delete from osto where id = ?;`, [id]);
      }, null, updateList
    )    
  }

  const listSeparator = () => {
    return (
      <View
        style={{
          height: 5,
          width: "80%",
          backgroundColor: "#fff",
          marginLeft: "10%"
        }}
      />
    );
  };

  return (
    <View style={styles.container}>
    <Header
        centerComponent={{ text: 'SHOPPING LIST', style: { color: '#fff' } }}/>

      <Input
        placeholder='Product' label='PRODUCT'
        onChangeText={(product) => setProduct(product)} 
        value={product} />

      <Input
        placeholder='Amount' label='AMOUNT'
        onChangeText={(amount) => setAmount(amount)}
        value={amount}/>


      <Button raised icon={{name: 'save', color: 'white'}} onPress={saveItem} title="SAVE" />
      <FlatList 
        keyExtractor={item => item.id.toString()} 
        data={ostokset}
        renderItem= { ({item}) => 
        <ListItem bottomDivider>
          <ListItem.Content>
            <ListItem.Title>{item.product}</ListItem.Title>
            <ListItem.Subtitle>{item.amount}</ListItem.Subtitle>
          </ListItem.Content>
            <Icon name = "delete" type= "material" color= "red" onPress={() => deleteItem(item.id)} />
          </ListItem>
          }
      />      
    </View>
  );
}

const styles = StyleSheet.create({
 container: {
  flex: 1,
  backgroundColor: '#fff',
  justifyContent: 'center',
 },
 listcontainer: {
  flexDirection: 'row',
  backgroundColor: '#fff',
  alignItems: 'center'
 },
});
