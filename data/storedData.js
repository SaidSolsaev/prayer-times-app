import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";

// Oppretter en context
const LocationContext = createContext();

// Provider-komponent
export const LocationProvider = ({ children }) => {
    const [location, setLocation] = useState('Oslo');

    useEffect(() => {
        const loadLocation = async () => {
            const savedLocation = await AsyncStorage.getItem('location');
            
            if (savedLocation !== null) {
                setLocation(savedLocation);
            }
        };
        loadLocation();
    }, []);

    useEffect(() => {
        const saveLocation = async () => {
            await AsyncStorage.setItem('location', location);
        };
        saveLocation();
    }, [location]);

    return (
        <LocationContext.Provider value={{ location, setLocation }}>
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
