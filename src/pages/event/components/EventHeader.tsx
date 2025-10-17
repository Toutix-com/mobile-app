import React, { useState, useRef } from 'react';
import { View, ImageBackground, TouchableOpacity, StyleSheet, FlatList, Dimensions, ScrollView } from 'react-native';
import { X, Share2, Heart, ChevronLeft, Share } from 'lucide-react-native';
import { normalize } from '../../../utils/responsive';
import { AppText, Icon } from '../../../components';

interface EventHeaderProps {
    imageUrls: string[]; // Changed from single imageUrl to array of imageUrls
    onBack: () => void;
    onShare: () => void;
    onFavorite: () => void;
    isFavorite: boolean;
    status: string;
}

const EventHeader: React.FC<EventHeaderProps> = ({
    imageUrls,
    onBack,
    onShare,
    onFavorite,
    isFavorite,
    status,
}) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const flatListRef = useRef<FlatList>(null);
    const screenWidth = Dimensions.get('window').width;

    const handleImageScroll = (event: any) => {
        const contentOffset = event.nativeEvent.contentOffset.x;
        const index = Math.round(contentOffset / screenWidth);
        setCurrentImageIndex(index);
    };

    const goToImage = (index: number) => {
        flatListRef.current?.scrollToIndex({ index, animated: true });
        setCurrentImageIndex(index);
    };

    const renderImageItem = ({ item }: { item: string }) => (
        <ImageBackground
            source={{ uri: item }}
            style={styles.image}
            resizeMode="stretch"
            imageStyle={{ borderTopLeftRadius: 18, borderTopRightRadius: 18 }}
        >
            <View style={styles.topRow}>
                <Icon 
                    icon={<ChevronLeft />}
                    size={24}
                    color="#fff"
                    backgroundColor="rgba(0,0,0,0.4)"
                    rounded
                    padding={8}
                    onPress={onBack}
                />
                <View style={{ flexDirection: 'row' }}>
                    <Icon 
                        icon={<Share />}
                        size={22}
                        color="#fff"
                        backgroundColor="rgba(0,0,0,0.4)"
                        rounded
                        padding={8}
                        onPress={onShare}
                    />
                    <Icon 
                        icon={<Heart color={isFavorite ? '#FF6B6B' : '#fff'} fill={isFavorite ? '#FF6B6B' : 'transparent'} />}
                        size={22}
                        backgroundColor="rgba(0,0,0,0.4)"
                        rounded
                        padding={8}
                        onPress={onFavorite}
                    />
                </View>
            </View>
            <View style={styles.limitedBadge}>
                <AppText style={styles.limitedBadgeText}>{status}</AppText>
            </View>
        </ImageBackground>
    );

    return (
        <View style={{ position: 'relative', height: normalize(320) }}>
            {/* Image Slider */}
            <FlatList
                ref={flatListRef}
                data={imageUrls}
                renderItem={renderImageItem}
                keyExtractor={(item, index) => index.toString()}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={handleImageScroll}
                getItemLayout={(data, index) => ({
                    length: screenWidth,
                    offset: screenWidth * index,
                    index,
                })}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    image: {
        width: Dimensions.get('window').width,
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
    iconBackground: {
        backgroundColor: 'rgba(0,0,0,0.4)',
        borderRadius: 20,
        padding: 8,
        alignItems: 'center',
        justifyContent: 'center',
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
    paginationContainer: {
        position: 'absolute',
        bottom: normalize(80),
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: normalize(8),
    },
    paginationDot: {
        width: normalize(8),
        height: normalize(8),
        borderRadius: normalize(4),
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
    },
    paginationDotActive: {
        backgroundColor: '#FFFFFF',
        width: normalize(24),
    },
    imageCounter: {
        position: 'absolute',
        top: normalize(60),
        right: normalize(16),
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        borderRadius: normalize(12),
        paddingHorizontal: normalize(8),
        paddingVertical: normalize(4),
    },
    imageCounterText: {
        color: '#FFFFFF',
        fontSize: normalize(12),
        fontWeight: '600',
    },
});

export default EventHeader; 