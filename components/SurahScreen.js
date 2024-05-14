import { ScrollView, StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { fetchQuranSurah, fetchQuranSurahRecitation, fetchQuranSurahTranslation } from '../data/fetchData'
import LoadingSircle from './LoadingSircle';
import {Audio} from "expo-av";
import Slider from '@react-native-community/slider';

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

    useEffect(() => {
        return sound
            ? () => {
                console.log("Unloading sound");
                sound.unloadAsync();
            }
            : undefined;
    }, [sound]);

    const playPauseAudio = async (url) => {
        if (!sound){
            const {sound: newSound, status} = await Audio.Sound.createAsync(
                {uri: url},
                {shouldPlay: true}
            );
            setSound(newSound);
            setIsPlaying(true);
            newSound.setOnPlaybackStatusUpdate(updateStatus)
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

    const updateStatus = (status) => {
        if (!status.isLoaded){
            if (status.error){
                console.log(`Playback error: ${status.error}`)
            }
        } else{
            setPlaybackPosition(status.positionMillis);
            setPlaybackDuration(status.durationMillis);

            if (status.didJustFinish && !status.isLooping){
                setIsPlaying(false);
            }
        }
    }

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

    const content = showTranslation ? surahTranslation : surah;


    return (
        <ScrollView style={{ flex: 1}}>
            <View style={styles.container}>
                
                <TouchableOpacity onPress={() => playPauseAudio(surahRecitation)} style={styles.playPauseButton}>
                    <Text>{isPlaying ? 'Pause' : 'Play'}</Text>
                </TouchableOpacity>
                
                <Slider
                    style={{ width: '100%', height: 40 }}
                    minimumValue={0}
                    maximumValue={playbackDuration ? playbackDuration : 0}
                    value={playbackPosition ? playbackPosition : 0}
                    onValueChange={value => {
                        if (sound) {
                            sound.setPositionAsync(value);
                        }
                    }}
                />
                
                <Text>
                Duration: {formatTime(playbackPosition || 0)} / {formatTime(playbackDuration || 0)}
                </Text>



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
    playPauseButton: {
        padding: 10,
        backgroundColor: '#ccc',
        alignSelf: 'center'
    }
})