import React from 'react';
import { View, Text, Animated } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

interface XPMeterProps {
  currentXP: number;
  maxXP: number;
  level: number;
  animated?: boolean;
}

export const XPMeter: React.FC<XPMeterProps> = ({
  currentXP,
  maxXP,
  level,
  animated = true,
}) => {
  const progress = (currentXP / maxXP) * 100;
  const animatedValue = new Animated.Value(animated ? 0 : progress);

  React.useEffect(() => {
    if (animated) {
      Animated.timing(animatedValue, {
        toValue: progress,
        duration: 1000,
        useNativeDriver: false,
      }).start();
    }
  }, [progress, animated]);

  return (
    <View className="bg-gray-800 rounded-full p-1 mb-4">
      <View className="flex-row items-center justify-between mb-2">
        <Text className="text-white font-bold text-lg">Level {level}</Text>
        <Text className="text-gray-300 text-sm">
          {currentXP}/{maxXP} XP
        </Text>
      </View>
      
      <View className="h-6 bg-gray-700 rounded-full overflow-hidden">
        <Animated.View
          style={{
            width: animated ? animatedValue.interpolate({
              inputRange: [0, 100],
              outputRange: ['0%', '100%'],
            }) : `${progress}%`,
            height: '100%',
          }}
        >
          <LinearGradient
            colors={['#10B981', '#059669']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ flex: 1, borderRadius: 12 }}
          />
        </Animated.View>
      </View>
    </View>
  );
};