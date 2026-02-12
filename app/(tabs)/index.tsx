import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated, Easing } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Defs, RadialGradient, Stop, Rect, Circle } from "react-native-svg";
import { useFonts, GreatVibes_400Regular } from "@expo-google-fonts/great-vibes";
import { Cinzel_700Bold } from "@expo-google-fonts/cinzel";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function HomeScreen() {
    // ✅ ALWAYS declare hooks first (before any conditional return)
    const pulse1 = useRef(new Animated.Value(0)).current;
    const pulse2 = useRef(new Animated.Value(0)).current;
    const pulse3 = useRef(new Animated.Value(0)).current;

    const [fontsLoaded] = useFonts({
        GreatVibes_400Regular,
        Cinzel_700Bold,
    });

    useEffect(() => {
        const makePulse = (v: Animated.Value, delayMs: number) =>
            Animated.loop(
                Animated.sequence([
                    Animated.delay(delayMs),
                    Animated.timing(v, {
                        toValue: 1,
                        duration: 3800, // wave speed (lower = faster)
                        easing: Easing.out(Easing.quad),
                        useNativeDriver: true,
                    }),
                    Animated.timing(v, {
                        toValue: 0,
                        duration: 0,
                        useNativeDriver: true,
                    }),
                ])
            );

        const a = makePulse(pulse1, 0);
        const b = makePulse(pulse2, 1200);
        const c = makePulse(pulse3, 2400);

        a.start();
        b.start();
        c.start();

        return () => {
            a.stop();
            b.stop();
            c.stop();
        };
    }, [pulse1, pulse2, pulse3]);

    // ✅ Now it's safe to early-return
    if (!fontsLoaded) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Loading…</Text>
            </View>
        );
    }

    const maxRadius = 520;

    const r1 = pulse1.interpolate({ inputRange: [0, 1], outputRange: [0, maxRadius] });
    const o1 = pulse1.interpolate({ inputRange: [0, 0.2, 1], outputRange: [0.0, 0.35, 0.0] });

    const r2 = pulse2.interpolate({ inputRange: [0, 1], outputRange: [0, maxRadius] });
    const o2 = pulse2.interpolate({ inputRange: [0, 0.2, 1], outputRange: [0.0, 0.28, 0.0] });

    const r3 = pulse3.interpolate({ inputRange: [0, 1], outputRange: [0, maxRadius] });
    const o3 = pulse3.interpolate({ inputRange: [0, 0.2, 1], outputRange: [0.0, 0.22, 0.0] });

    return (
        <View style={styles.container}>
            {/* Base background (Bloomsburg maroon vibe) */}
            <LinearGradient
                colors={["#120303", "#3b0d0d", "#7a1f1f"]}
                style={StyleSheet.absoluteFill}
            />

            {/* Soft royal under-glow */}
            <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
                <Defs>
                    <RadialGradient id="glow" cx="50%" cy="45%" r="60%">
                        <Stop offset="0%" stopColor="#dc2626" stopOpacity="0.35" />
                        <Stop offset="45%" stopColor="#7c3aed" stopOpacity="0.16" />
                        <Stop offset="100%" stopColor="#000000" stopOpacity="0" />
                    </RadialGradient>
                </Defs>
                <Rect x="0" y="0" width="100%" height="100%" fill="url(#glow)" />
            </Svg>

            {/* Expanding wave rings from center */}
            <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
                <AnimatedCircle
                    cx="50%"
                    cy="45%"
                    r={r1 as any}
                    fill="rgba(0,0,0,0)"
                    stroke="rgba(220,38,38,1)"
                    strokeWidth={2}
                    opacity={o1 as any}
                />
                <AnimatedCircle
                    cx="50%"
                    cy="45%"
                    r={r2 as any}
                    fill="rgba(0,0,0,0)"
                    stroke="rgba(124,58,237,1)"
                    strokeWidth={2}
                    opacity={o2 as any}
                />
                <AnimatedCircle
                    cx="50%"
                    cy="45%"
                    r={r3 as any}
                    fill="rgba(0,0,0,0)"
                    stroke="rgba(14,165,233,1)"
                    strokeWidth={2}
                    opacity={o3 as any}
                />
            </Svg>

            {/* Text */}
            <View style={styles.content}>
                <Text style={styles.title}>Bloomsburg Unite</Text>
                <Text style={styles.subtitle}>UNITING STUDENTS OF BLOOMSBURG</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        overflow: "hidden",
    },
    content: {
        flex: 1,
        justifyContent: "center",   // vertical center
        alignItems: "center",       // horizontal center
        paddingHorizontal: 24,
    },
    title: {
        fontSize: 56,
        fontFamily: "GreatVibes_400Regular",
        color: "white",
        letterSpacing: 1,
        textAlign: "center",        // centers text itself
        textShadowColor: "rgba(255,255,255,0.35)",
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 14,
    },

    subtitle: {
        marginTop: 10,
        fontSize: 14,
        fontFamily: "Cinzel_700Bold",
        letterSpacing: 2,
        color: "#f8fafc",
        opacity: 0.9,
        textAlign: "center",        // centers subtitle
    },


    loadingContainer: {
        flex: 1,
        backgroundColor: "#0b0b0f",
        alignItems: "center",
        justifyContent: "center",
    },
    loadingText: {
        color: "white",
        fontSize: 16,
    },
});
