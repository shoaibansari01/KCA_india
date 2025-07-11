import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import { AnimatedIcon } from './animatedIcon';
import { s3PreFixUrl } from '../helper/routes';

const { width: viewportWidth } = Dimensions.get('window');

const Slider = ({ data, handleImagePress, handleVideoPress }: any) => {
    const carouselRef = useRef(null);
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const autoSlideTimer = setInterval(() => {
            setActiveIndex(pre => {
                const nextIndex = pre === data.length - 1 ? 0 : pre + 1;
                carouselRef.current?.snapToItem(nextIndex);
                return nextIndex;
            });
        }, 4000);

        return () => {
            clearInterval(autoSlideTimer);
        };
    }, [data.length]);

    const renderItem = ({ item }: any) => {
        if (["png", "jpg"].includes(item?.uploadedFile.split(".").pop())) {
            return (
                <TouchableOpacity onPress={() => handleImagePress(item, activeIndex)}>
                    <Image source={{ uri: `${s3PreFixUrl}${item?.uploadedFile}` }} style={{ width: '100%', height: 120 }} />
                    <Text style={{ position: 'absolute', bottom: 10, left: 10, color: 'white' }}>
                        {item?.banner_link ?? ""}
                    </Text>
                </TouchableOpacity>
            );
        } else if (["mp4"].includes(item?.uploadedFile.split(".").pop())) {
            return (
                <TouchableOpacity onPress={() => handleVideoPress(item, activeIndex)}>
                    <View style={{ width: '100%', height: 120, justifyContent: 'center', alignItems: 'center', backgroundColor: '#CDDFFF' }}>
                        <View style={{ width: '90%', padding: 5, alignItems: "center" }}>
                            <AnimatedIcon name="smart-display" color="#93278f" size={40} />
                            <Text style={{ color: '#000',fontWeight:"500" }}>{item?.banner_heading ?? ""}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            );
        }
    };

    return (
        <Carousel
            ref={carouselRef}
            data={data}
            renderItem={renderItem}
            sliderWidth={viewportWidth}
            itemWidth={viewportWidth}
            onSnapToItem={(index) => setActiveIndex(index)}
        />
    );
};

export default Slider;
