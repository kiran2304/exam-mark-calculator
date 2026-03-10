import React, { useRef } from 'react';
import { Animated, Pressable, Platform, StyleSheet } from 'react-native';

export default function HoverCard({ children, style, disabled = false }) {
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const handleHoverIn = () => {
        if (disabled) return;
        Animated.spring(scaleAnim, {
            toValue: 1.02,
            tension: 60,
            friction: 7,
            useNativeDriver: true,
        }).start();
    };

    const handleHoverOut = () => {
        if (disabled) return;
        Animated.spring(scaleAnim, {
            toValue: 1,
            tension: 40,
            friction: 7,
            useNativeDriver: true,
        }).start();
    };

    // onHoverIn/Out are supported by React Native Web
    return (
        <Animated.View style={[style, { transform: [{ scale: scaleAnim }] }]}>
            <Pressable
                onHoverIn={Platform.OS === 'web' ? handleHoverIn : undefined}
                onHoverOut={Platform.OS === 'web' ? handleHoverOut : undefined}
                style={styles.pressableBlock}
                disabled={disabled}
            >
                {children}
            </Pressable>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    pressableBlock: {
        width: '100%',
        height: '100%'
    }
});
