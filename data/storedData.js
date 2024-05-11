import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const useStoredLocation = () => {
    const [location, setLocation] = useState('Oslo'); // Standardverdi
  
    // Hent lagret verdi når appen lastes
    useEffect(() => {

        const loadLocation = async () => {
            const savedLocation = await AsyncStorage.getItem('location');
            
            if (savedLocation) {
                setLocation(savedLocation);
            }
        };
    
        loadLocation();
    }, []);
    
    useEffect(() => {
        const saveLocation = async () => {
            await AsyncStorage.setItem('location', location);
        };
    
        if (location !== 'Oslo') {
            saveLocation();
        }
    }, [location]);
    
    return [location, setLocation];
};
    
export default useStoredLocation;