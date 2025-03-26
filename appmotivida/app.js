import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity, Share } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';

const frases = [
    "Acredite em você!",
    "Cada dia é uma nova oportunidade.",
    "O sucesso vem para quem persiste.",
    "Nunca desista dos seus sonhos.",
    "O impossível é apenas uma opinião."
];

const HomeScreen = ({ navigation }) => {
    const [frase, setFrase] = useState('');
    const [favoritas, setFavoritas] = useState([]);

    useEffect(() => {
        exibirFraseDiaria();
        carregarFavoritas();
    }, []);

    const gerarNovaFrase = () => {
        const novaFrase = frases[Math.floor(Math.random() * frases.length)];
        setFrase(novaFrase);
    };

    const salvarFavorita = async () => {
        if (!favoritas.includes(frase)) {
            const novasFavoritas = [...favoritas, frase];
            setFavoritas(novasFavoritas);
            await AsyncStorage.setItem('favoritas', JSON.stringify(novasFavoritas));
        }
    };

    const compartilharFrase = async () => {
        try {
            await Share.share({ message: frase });
        } catch (error) {
            console.error(error);
        }
    };

    const carregarFavoritas = async () => {
        const data = await AsyncStorage.getItem('favoritas');
        if (data) {
            setFavoritas(JSON.parse(data));
        }
    };

    const exibirFraseDiaria = () => {
        const indice = new Date().getDate() % frases.length;
        setFrase(frases[indice]);
    };

    return (
        <View>
            <Text>{frase}</Text>
            <Button title="Nova Frase" onPress={gerarNovaFrase} />
            <Button title="Salvar" onPress={salvarFavorita} />
            <Button title="Compartilhar" onPress={compartilharFrase} />
        </View>
    );
};

const FavoritasScreen = () => {
    const [favoritas, setFavoritas] = useState([]);

    useEffect(() => {
        carregarFavoritas();
    }, []);

    const carregarFavoritas = async () => {
        const data = await AsyncStorage.getItem('favoritas');
        if (data) {
            setFavoritas(JSON.parse(data));
        }
    };

    return (
        <FlatList
            data={favoritas}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => <Text>{item}</Text>}
        />
    );
};

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const TabNavigator = () => (
    <Tab.Navigator>
        <Tab.Screen name="Nova Frase" component={HomeScreen} />
        <Tab.Screen name="Minhas Frases" component={FavoritasScreen} />
    </Tab.Navigator>
);

const StackNavigator = () => (
    <Stack.Navigator>
        <Stack.Screen name="Home" component={TabNavigator} />
    </Stack.Navigator>
);

const DrawerNavigator = () => (
    <Drawer.Navigator>
        <Drawer.Screen name="App" component={StackNavigator} />
        <Drawer.Screen name="Configurações" component={() => <Text>Configurações</Text>} />
        <Drawer.Screen name="Sobre" component={() => <Text>Sobre o App</Text>} />
    </Drawer.Navigator>
);

export default function App() {
    return (
        <NavigationContainer>
            <DrawerNavigator />
        </NavigationContainer>
    );
}