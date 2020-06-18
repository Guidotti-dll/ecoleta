import React, {useState, useEffect} from 'react';
import { Feather as Icon} from '@expo/vector-icons'
import { View, Text,ImageBackground ,Image, StyleSheet, TextInput , KeyboardAvoidingView, Platform } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation} from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
import axios from 'axios';


interface IBGEUFResponse {
    sigla: string;
}

interface IBGECityResponse {
    id: number;
    nome: string;
}

interface Option {
    key: string;
    value: string;
    label: string;
}


const Home = () => {
    const [uf, setUf] = useState<Option[]>([]);
    const [city, setCity] = useState<Option[]>([]);
    const [selectedUf, setSelectedUf] = useState('0');
    const [selectedCity, setSelectedCity] = useState('0');

    const navigation = useNavigation();

    function handleNavigateToPoints() {
        navigation.navigate('Points', {
            uf: selectedUf,
            city: selectedCity,
        });
    }

    function handleSelectUf(uf : string){
        setSelectedUf(uf);
    }

    function handleSelectCity(city : string){
        setSelectedCity(city);
    }



    useEffect(() => {
        axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(response =>{
        const ufInitials = response.data.map(uf => ({
            key: uf.sigla,
            value: uf.sigla,
            label: uf.sigla
        }));

        setUf(ufInitials);
        });
    } , []);


    useEffect(() => {
        if(selectedUf === '0') {
            return;
        }

        axios
            .get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
            .then(response =>{
                const cityNames = response.data.map(city => ({
                key: String(city.id), 
                value: city.nome,
                label: city.nome
                }));

                setCity(cityNames);
        });

    },[selectedUf])

    return(

        <KeyboardAvoidingView style={{flex:1}} behavior={Platform.OS === 'ios' ? "padding" : undefined}>
        <ImageBackground 
        source={require('../../assets/home-background.png')} 
        style={styles.container}
        imageStyle={{ width: 274 , height: 368 }}
        >
            <View style={styles.main}>
            <Image source={require('../../assets/logo.png')} />
            <View>
                <Text style={styles.title}>Seu marketplace de coleta de resíduos. </Text>
                <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.</Text>
            </View>
            </View>


            <View style={styles.footer}>

            <RNPickerSelect
            useNativeAndroidPickerStyle={false}         
            onValueChange={(value) => {handleSelectUf(value)}}
            placeholder={{ value: '0', label: 'Selecione uma UF' }}
            style={{
                ...pickerSelectStyles,
                iconContainer: {
                    top: 25,
                    right: 10,
                },
            }}
            items={uf}
            Icon={() => {
                return (
                    <View 
                        style={{
                            backgroundColor: 'transparent',
                            borderTopWidth: 10,
                            borderTopColor: '#3f3f3f',
                            borderRightWidth: 10,
                            borderRightColor: 'transparent',
                            borderLeftWidth: 10,
                            borderLeftColor: 'transparent',
                            width: 0,
                            height: 0,
                        }}
                    />
                )
            }}
            />

            <RNPickerSelect
            useNativeAndroidPickerStyle={false}
            onValueChange={(value) => {handleSelectCity(value)}}
            placeholder={{ value: '0', label: 'Selecione uma cidade' }}
            style={{
                ...pickerSelectStyles,
                iconContainer: {
                    top: 25,
                    right: 10,
                },
            }}
            items={city}
            Icon={() => {
                return (
                    <View 
                        style={{
                            backgroundColor: 'transparent',
                            borderTopWidth: 10,
                            borderTopColor: '#3f3f3f',
                            borderRightWidth: 10,
                            borderRightColor: 'transparent',
                            borderLeftWidth: 10,
                            borderLeftColor: 'transparent',
                            width: 0,
                            height: 0,
                        }}
                    />
                )
            }}
            />

                

                <RectButton style={styles.button} onPress={handleNavigateToPoints}>
                    <View style={styles.buttonIcon}>
                        <Text>
                            <Icon name="arrow-right" color="#FFF" size={24} /> 
                        </Text>
                    </View>
                    <Text style={styles.buttonText}>
                        Entrar
                    </Text>
                </RectButton>
            </View>
        </ImageBackground>
        </KeyboardAvoidingView>
        );
};


const pickerSelectStyles = StyleSheet.create({
inputIOS: {
    height: 60,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
},
inputAndroid: {
    height: 60,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
},
});


const styles = StyleSheet.create({
container: {
    flex: 1,
    padding: 32,
},

main: {
    flex: 1,
    justifyContent: 'center',
},

title: {
    color: '#322153',
    fontSize: 32,
    fontFamily: 'Ubuntu_700Bold',
    maxWidth: 260,
    marginTop: 64,
},

description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 16,
    fontFamily: 'Roboto_400Regular',
    maxWidth: 260,
    lineHeight: 24,
},

footer: {},

select: {},

button: {
    backgroundColor: '#34CB79',
    height: 60,
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    marginTop: 8,
},

buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center'
},

buttonText: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    color: '#FFF',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
}
});

export default Home;