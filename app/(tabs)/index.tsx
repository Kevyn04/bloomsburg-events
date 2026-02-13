import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated, Easing, Pressable } from "react-native";
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
                        useNativeDriver: false, // ✅ IMPORTANT: SVG props can't use native driver
                    }),
                    Animated.timing(v, {
                        toValue: 0,
                        duration: 0,
                        useNativeDriver: false, // ✅ keep consistent
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
            {/* Base background */}
            <LinearGradient colors={["#120303", "#3b0d0d", "#7a1f1f"]} style={StyleSheet.absoluteFill} />

            {/* Soft under-glow */}
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

            {/* Expanding wave rings */}
            <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
                <AnimatedCircle
                    cx="50%"
                    cy="45%"
                    r={r1}
                    fill="rgba(0,0,0,0)"
                    stroke="rgba(220,38,38,1)"
                    strokeWidth={2}
                    opacity={o1}
                />
                <AnimatedCircle
                    cx="50%"
                    cy="45%"
                    r={r2}
                    fill="rgba(0,0,0,0)"
                    stroke="rgba(124,58,237,1)"
                    strokeWidth={2}
                    opacity={o2}
                />
                <AnimatedCircle
                    cx="50%"
                    cy="45%"
                    r={r3}
                    fill="rgba(0,0,0,0)"
                    stroke="rgba(14,165,233,1)"
                    strokeWidth={2}
                    opacity={o3}
                />
            </Svg>

            {/* Text + Buttons */}
            <View style={styles.content}>
                <Text style={styles.title}>The Hangout</Text>
                <Text style={styles.subtitle}>FOR EVERYONE, EVERYWHERE</Text>

                <View style={styles.buttonRow}>
                    <Pressable
                        style={({ pressed }) => [styles.primaryBtn, pressed && styles.pressed]}
                        onPress={() => {
                            // TODO: hook up navigation (expo-router / react-navigation)
                            console.log("Sign In");
                        }}
                    >
                        <Text style={styles.primaryBtnText}>Sign In</Text>
                    </Pressable>

                    <Pressable
                        style={({ pressed }) => [styles.secondaryBtn, pressed && styles.pressed]}
                        onPress={() => {
                            // TODO: hook up navigation (expo-router / react-navigation)
                            console.log("Sign Up");
                        }}
                    >
                        <Text style={styles.secondaryBtnText}>Sign Up</Text>
                    </Pressable>
                </View>
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
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 24,
    },

    title: {
        fontSize: 56,
        fontFamily: "GreatVibes_400Regular",
        color: "white",
        letterSpacing: 1,
        textAlign: "center",
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
        textAlign: "center",
    },

    buttonRow: {
        marginTop: 22,
        width: "100%",
        paddingHorizontal: 24,
        gap: 12,
    },

    primaryBtn: {
        height: 48,
        borderRadius: 14,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(255,255,255,0.92)",
    },

    primaryBtnText: {
        fontSize: 14,
        letterSpacing: 1.5,
        color: "#0b0b0f",
        fontFamily: "Cinzel_700Bold",
    },

    secondaryBtn: {
        height: 48,
        borderRadius: 14,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.75)",
        backgroundColor: "rgba(0,0,0,0.18)",
    },

    secondaryBtnText: {
        fontSize: 14,
        letterSpacing: 1.5,
        color: "#f8fafc",
        fontFamily: "Cinzel_700Bold",
    },

    pressed: {
        transform: [{ scale: 0.98 }],
        opacity: 0.9,
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
