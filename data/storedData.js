import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";

// Oppretter en context
const LocationContext = createContext();

// Provider-komponent
export const LocationProvider = ({ children }) => {
    const [location, setLocation] = useState('Oslo');
    const [calculationMethodId, setCalculationMethodId] = useState(3);

    useEffect(() => {
        const loadSettings = async () => {
            const savedLocation = await AsyncStorage.getItem('location');
            const savedMethod = await AsyncStorage.getItem('selectedCalculationMethodId');

            
            if (savedLocation !== null) setLocation(savedLocation);
            if (savedMethod !== null) setCalculationMethodId(savedMethod)

        };
        loadSettings();
    }, []);

    useEffect(() => {
        const saveSettings = async () => {
            await AsyncStorage.setItem('location', location);
            await AsyncStorage.setItem('selectedCalculationMethodId', JSON.stringify(calculationMethodId));
        };
        saveSettings();
    }, [location, calculationMethodId]);

    return (
        <LocationContext.Provider value={{ 
            location, setLocation,
            calculationMethodId, setCalculationMethodId,
        }}>
            {children}
        </LocationContext.Provider>
    );
};

export const useStoredLocation = () => {
    const context = useContext(LocationContext);
    if (context === undefined) {
        throw new Error('useStoredLocation must be used within a LocationProvider');
    }

    return context;
};
