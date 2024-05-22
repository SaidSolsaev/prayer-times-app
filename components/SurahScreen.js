import { ScrollView, StyleSheet, Button, Text, View, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { fetchQuranSurah, fetchQuranSurahRecitation, fetchQuranSurahTranslation } from '../data/fetchData'
import  { LoadingCircle,LoadingCircleSmall } from './LoadingCircle';
import {Audio, InterruptionModeAndroid, InterruptionModeIOS} from "expo-av";
import Slider from '@react-native-community/slider';
import { AntDesign } from '@expo/vector-icons';
import { debounce } from 'lodash';

const SurahScreen = ({route, navigation}) => {
    const {surahNum} = route.params;
    const [surah, setSurah] = useState(null);
    const [surahTranslation, setSurahTranslation] = useState(null);
    const [surahRecitation, setSurahRecitation] = useState(null);
    const [showTranslation, setShowTranslation] = useState(false);
    const [fontSize, setFontSize] = useState(22)
    
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
    const [loadingAudio, setLoadingAudio] = useState(false);

    useEffect(() => {
        const configureAudio = async () => {
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: false,
                interruptionModeIOS: InterruptionModeIOS.DoNotMix,
                interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
                playsInSilentModeIOS: true,
                shouldDuckAndroid: true,
                playThroughEarpieceAndroid: false,
                shouldDuckIos: true
            });
        };
        configureAudio();
    }, []);

    const playPauseAudio = async () => {
        if (!sound){
            console.log("Loading new sound from URL:", surahRecitation);
            setLoadingAudio(true);
            const {sound: newSound, status} = await Audio.Sound.createAsync(
                {uri: surahRecitation},
                {shouldPlay: true},
            );
            setSound(newSound);
            newSound.setOnPlaybackStatusUpdate(updateStatus);
            setLoadingAudio(false);
            setIsPlaying(true);
            
            if (status.isLoaded && !status.isPlaying){
                setLoadingAudio(false);
                await newSound.playAsync();
                setIsPlaying(true);
            }else if(!status.isLoaded){
                return <LoadingCircle />
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
        return <LoadingCircle />
    }

    const debouncedSeek = debounce((newPosition) => {
        if (sound) {
          sound.setPositionAsync(newPosition).catch(err => console.error('Error setting position:', err));
        }
      }, 300)

    const content = showTranslation ? surahTranslation : surah;

    const styles = getStyles(fontSize);

    const changeFontSize = (increase) => {
        let size = fontSize
        if (increase){
            setFontSize(size += 1)
        } else if(!increase){
            setFontSize(size -= 1)
        }
    }

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
                            
                            {loadingAudio ? 
                                <LoadingCircleSmall text="Laster inn audio..."/> 
                            : isPlaying ? (
                                <AntDesign name="pausecircle" size={42} color="red"/>
                            ) : (
                                <AntDesign name="play" size={42} color="green" />
                            )}
                        </TouchableOpacity>
                    </View>
                    
                </View>
                
                {!showTranslation && 
                    <View style={styles.buttonGroupContainer}>
                        <View style={styles.buttonGroup}>
                            <TouchableOpacity onPress={() => changeFontSize(false)} style={styles.button}>
                                <Text style={{fontSize: 22, fontWeight: "bold"}}>-</Text>
                            </TouchableOpacity>
                            <Text style={styles.btnGroupText}>Endre skriftstørrelse: {fontSize}</Text>
                            <TouchableOpacity onPress={() => changeFontSize(true)} style={styles.button}>
                                <Text style={{fontSize: 22, fontWeight: "bold"}}>+</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                }

                <View style={styles.column}>
                    {content.map((ayah, index) => (
                        <Text key={index} style={content == surah ? styles.ayah : styles.translation}>
                            {ayah.text}
                        </Text>
                    ))}
                </View>
            </View>
        </ScrollView>
    )
}

export default SurahScreen

const getStyles = (fontSize) => StyleSheet.create({
    container:{
        backgroundColor: "#fff",
    },

    column: {
        width: "100%",
        flexDirection: "column",
        marginVertical: 30,
    },

    row: {
        flexDirection: "row",
        justifyContent: "center",
        paddingTop: 10,
    },

    ayah: {
        fontSize: fontSize,
        fontWeight: "bold",
        textAlign: "right",
        color: "black",
        paddingHorizontal: 10
    },

    translation: {
        fontSize: 18,
        paddingHorizontal: 10,
        lineHeight: 30
    },

    playerContainer: {
        alignItems: "center",
        justifyContent: "center",
        borderBottomColor: "#ccc",
        borderBottomWidth: 1,
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
        marginBottom: 10,
    },

    slider: {
        width: "70%",
    },

    buttonGroupContainer: {
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 10,
    },

    buttonGroup: {
        flexDirection: "row",
        width: "70%",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 10,
        backgroundColor: "#ccc",
        
    },

    btnGroupText: {
        fontSize: 16
    },

    button: {
        backgroundColor: "green",
        // padding: 10,
        width: 30,
        height: 30,
        alignItems: "center",
        justifyContent: "center",
    }
})