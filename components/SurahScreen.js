import { ScrollView, StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { fetchQuranSurah, fetchQuranSurahRecitation, fetchQuranSurahTranslation } from '../data/fetchData'
import LoadingSircle from './LoadingSircle';
import {Audio} from "expo-av";
import Slider from '@react-native-community/slider';
import { AntDesign } from '@expo/vector-icons';
import { debounce } from 'lodash';

const SurahScreen = ({route, navigation}) => {
    const {surahNum} = route.params;
    const [surah, setSurah] = useState(null);
    const [surahTranslation, setSurahTranslation] = useState(null);
    const [surahRecitation, setSurahRecitation] = useState(null);
    const [showTranslation, setShowTranslation] = useState(false);
    
    useEffect(() => {
        fetchQuranSurah(surahNum).then(data => 
            setSurah(data.data.ayahs));
        
        fetchQuranSurahTranslation(surahNum).then(data => 
            setSurahTranslation(data.data.ayahs));

        fetchQuranSurahRecitation(surahNum).then(data => 
            setSurahRecitation(data.audio_file.audio_url));
    }, [surahNum]);


    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity
                    onPress={() => setShowTranslation(!showTranslation)}
                    style={{marginEnd: 10}}
                >
                    <Text style={{fontSize: 14, color: "#007AFF", textAlign: "center"}}>
                        {showTranslation ? "Vis Arabisk" : "Vis Oversettelse"}
                    </Text>
            </TouchableOpacity>
            )
        });
    }, [navigation, showTranslation])

    //Audio
    const [sound, setSound] = useState();
    const [isPlaying, setIsPlaying] = useState(false);
    const [playbackPosition, setPlaybackPosition] = useState(null);
    const [playbackDuration, setPlaybackDuration] = useState(null);

    const playPauseAudio = async () => {
        if (!sound){
            console.log("Loading new sound from URL:", surahRecitation);

            const {sound: newSound, status} = await Audio.Sound.createAsync(
                {uri: surahRecitation},
                {shouldPlay: false},
            );
            setSound(newSound);
            newSound.setOnPlaybackStatusUpdate(updateStatus);

            if (status.isLoaded && !status.isPlaying){
                await newSound.playAsync();
                setIsPlaying(true);
            }
        }else{
            if (isPlaying){
                await sound.pauseAsync();
                setIsPlaying(false);
            }else{
                await sound.playAsync();
                setIsPlaying(true);
            }
        }
    };

    const updateStatus = async(status) => {
        if (status.isLoaded) {
            setPlaybackPosition(status.positionMillis);
            setPlaybackDuration(status.durationMillis);
            
            if (status.didJustFinish && !status.isLooping) {
                console.log("Playback finished, resetting...");
                setIsPlaying(false);
                await sound.setPositionAsync(0);
                
            }
        } else if (status.error) {
            console.error(`Playback error: ${status.error}`);
        }
    }

    useEffect(() => {
        return () => {
            if (sound) {
                console.log('Stopping and unloading sound');
                sound.stopAsync().then(() => {
                    sound.unloadAsync();
                });
            }
        };
    }, [sound]);

    function formatTime(ms){
        const totalSeconds = Math.floor(ms / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        const formatNumber = (num) => (num < 10 ? `0${num}` : num.toString());

        if (hours > 0) {
            return `${formatNumber(hours)}:${formatNumber(minutes)}:${formatNumber(seconds)}`;
        } else {
            return `${formatNumber(minutes)}:${formatNumber(seconds)}`;
        }
    }


    if (!surah || !surahTranslation || !surahRecitation){
        return <LoadingSircle />
    }

    const debouncedSeek = debounce((newPosition) => {
        if (sound) {
          sound.setPositionAsync(newPosition).catch(err => console.error('Error setting position:', err));
        }
      }, 300)

    const content = showTranslation ? surahTranslation : surah;


    return (
        <ScrollView>
            <View style={styles.container}>
                
                <View style={styles.playerContainer}>
                    
                    <View style={styles.sliderContainer}>
                        <Text>
                            {formatTime(playbackPosition || 0)}
                        </Text>

                        <Slider
                            style={styles.slider}
                            minimumValue={0}
                            maximumValue={1}
                            value={playbackPosition / playbackDuration}
                            onValueChange={value => {
                                const newPlaybackPosition = value * playbackDuration;
                                debouncedSeek(Math.round(newPlaybackPosition));
                            }}
                            minimumTrackTintColor="#1FB954" // Spotify green, for example
                            maximumTrackTintColor="#D3D3D3"
                            thumbTintColor="rgba(255, 255, 255, 0)"
                        />
                        
                        <Text>
                            {formatTime(playbackDuration || 0)}
                        </Text>
                    </View>

                    <View style={styles.playerButtonContainer}>
                        <TouchableOpacity onPress={playPauseAudio} style={styles.playPauseButton}>
                            {isPlaying ? (
                                <AntDesign name="pausecircle" size={42} color="red"/>
                            ) : (
                                <AntDesign name="play" size={42} color="green" />
                            )}
                        </TouchableOpacity>
                    </View>
                    
                </View>



                <View style={styles.column}>
                    {content.map((ayah, index) => (
                        <View style={styles.row} key={index}>
                            <Text style={content == surah ? styles.ayah : styles.translation}>
                                {ayah.text}
                            </Text>
                        </View>
                    ))}
                    
                </View>
            </View>
        </ScrollView>
    )
}

export default SurahScreen

const styles = StyleSheet.create({
    container:{
        backgroundColor: "#fff",
        flex: 1,
        width: "100%"
    },

    column: {
        width: "100%",
        flexDirection: "column",
    },
  
    row: {
        flexDirection: "row",
        justifyContent: "center",
        // borderBottomWidth: 1,
        // borderBottomColor: "#ccc",
        paddingTop: 10,
    },

    ayah: {
        fontSize: 32,
        fontWeight: "bold",
        textAlign: "right",
        lineHeight: 60,
        marginBottom: 0,
        padding: 10
    },
    translation: {
        fontSize: 18,
        padding: 10,
        lineHeight: 30
    },
    
    playerContainer: {
        alignItems: "center",
        justifyContent: "center",
    },

    sliderContainer: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingTop: 10,
    },

    playerButtonContainer:{
        marginTop: 0,
    },

    slider: {
        width: "70%"
    },

    // playPauseButton: {
    //     padding: 10,
    //     backgroundColor: "red"
    // },
})