import React from 'react';
import { View, Text, Modal, TouchableOpacity, Animated } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { XPReward } from '../types';

interface RewardModalProps {
  visible: boolean;
  reward: XPReward;
  onClose: () => void;
}

export const RewardModal: React.FC<RewardModalProps> = ({
  visible,
  reward,
  onClose,
}) => {
  const scaleValue = new Animated.Value(0);
  const rotateValue = new Animated.Value(0);

  React.useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scaleValue, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(rotateValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      scaleValue.setValue(0);
      rotateValue.setValue(0);
    }
  }, [visible]);

  const spin = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 items-center justify-center p-6">
        <Animated.View
          style={{ transform: [{ scale: scaleValue }] }}
          className="bg-white rounded-2xl p-6 items-center max-w-sm w-full"
        >
          <Animated.Text
            style={{ transform: [{ rotate: spin }] }}
            className="text-6xl mb-4"
          >
            {reward.levelUp ? '🎉' : '⭐'}
          </Animated.Text>

          {reward.levelUp ? (
            <>
              <Text className="text-2xl font-bold text-purple-600 mb-2">
                LEVEL UP!
              </Text>
              <Text className="text-lg text-gray-700 mb-4 text-center">
                Congratulations! You've reached level {reward.newLevel}!
              </Text>
            </>
          ) : (
            <>
              <Text className="text-2xl font-bold text-green-600 mb-2">
                Great Job!
              </Text>
              <Text className="text-lg text-gray-700 mb-4 text-center">
                You earned {reward.amount} XP!
              </Text>
            </>
          )}

          <TouchableOpacity
            onPress={onClose}
            className="w-full"
          >
            <LinearGradient
              colors={reward.levelUp ? ['#8B5CF6', '#7C3AED'] : ['#10B981', '#059669']}
              className="py-3 px-6 rounded-xl items-center"
            >
              <Text className="text-white font-semibold text-lg">
                Awesome!
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};