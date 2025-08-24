import React from 'react';
import { View, ImageBackground, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { X, Share2, Heart, ChevronLeft, Share } from 'lucide-react-native';
import { normalize } from '../../../utils/responsive';
import { BlurView } from '@react-native-community/blur';

interface EventHeaderProps {
    imageUrl: string;
    onBack: () => void;
    onShare: () => void;
    onFavorite: () => void;
    isFavorite: boolean;
    status: string;
}

const EventHeader: React.FC<EventHeaderProps> = ({
    imageUrl,
    onBack,
    onShare,
    onFavorite,
    isFavorite,
    status,
}) => {
    return (
        <View style={{ position: 'relative', height: normalize(320) }}>
            <ImageBackground
                source={{ uri: imageUrl }}
                style={styles.image}
                resizeMode="stretch"
                imageStyle={{ borderTopLeftRadius: 18, borderTopRightRadius: 18 }}
            >
                <View style={styles.topRow}>

                    <TouchableOpacity style={styles.iconBtn} onPress={onBack}>
                        <BlurView
                            style={[StyleSheet.absoluteFill,{borderRadius:normalize(20)}]}
                            blurType="light"
                            blurAmount={20}
                        />
                        <ChevronLeft color="#fff" size={24} />
                    </TouchableOpacity>
                    <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity style={styles.iconBtn} onPress={onShare}>
                        <BlurView
                            style={[StyleSheet.absoluteFill,{borderRadius:normalize(20)}]}
                            blurType="light"
                            blurAmount={20}
                        />
                            <Share color="#fff" size={22} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.iconBtn} onPress={onFavorite}>
                        <BlurView
                            style={[StyleSheet.absoluteFill,{borderRadius:normalize(20)}]}
                            blurType="light"
                            blurAmount={20}
                        />
                            <Heart color={isFavorite ? '#FF6B6B' : '#fff'} fill={isFavorite ? '#FF6B6B' : 'transparent'} size={22} />
                        </TouchableOpacity>
                    </View>
                </View>
                    <View style={styles.limitedBadge}>
                        <Text style={styles.limitedBadgeText}>{status}</Text>
                    </View>
            </ImageBackground>
        </View>
    );
};

const styles = StyleSheet.create({
    image: {
        width: '100%',
        height: normalize(340),
        justifyContent: 'space-between',
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: normalize(50),
        marginHorizontal: 16,
    },
    iconBtn: {
        backgroundColor: 'rgba(0,0,0,0.4)',
        borderRadius: 20,
        padding: 8,
        marginLeft: 8,
    },
    limitedBadge: {
        alignSelf: 'flex-start',
        backgroundColor: '#0D1117A6',
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 4,
        marginHorizontal: normalize(16),
        marginVertical: normalize(50),
        zIndex: 1000,
    },
    limitedBadgeText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 13,
    },
});

export default EventHeader; 