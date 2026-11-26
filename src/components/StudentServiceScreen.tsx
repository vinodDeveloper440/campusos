import React from 'react';
import {
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

export const SERVICE_COLORS = {
  navy: '#202B49',
  blue: '#6478E8',
  muted: '#8992A8',
  border: '#E9EDF5',
  background: '#F6F8FD',
  green: '#259B78',
  orange: '#D99035',
  paleBlue: '#EEF2FF',
  paleGreen: '#EAF8F1',
  paleOrange: '#FFF4E9',
  paleRed: '#FFF0F1',
};

export type ServiceIcon = keyof typeof Ionicons.glyphMap;

export function StudentServiceScreen({
  title,
  description,
  headline,
  icon,
  accent = SERVICE_COLORS.blue,
  tint = SERVICE_COLORS.paleBlue,
  children,
}: {
  title: string;
  description: string;
  headline: string;
  icon: ServiceIcon;
  accent?: string;
  tint?: string;
  children: React.ReactNode;
}) {
  return (
    <SafeAreaView className="flex-1 bg-[#F6F8FD]">
      <StatusBar barStyle="dark-content" />
      <ScrollView
        className="flex-1"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View className="px-5 pt-3">
          <View className="mb-6 flex-row items-center justify-between">
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Go back"
              onPress={() => router.back()}
              className="h-11 w-11 items-center justify-center rounded-2xl border border-[#E9EDF5] bg-white"
              style={{
                shadowColor: SERVICE_COLORS.navy,
                shadowOpacity: 0.04,
                shadowRadius: 8,
                elevation: 1,
              }}
            >
              <Ionicons name="arrow-back" size={21} color={SERVICE_COLORS.navy} />
            </Pressable>
            <View className="items-center">
              <Text className="text-[10px] font-extrabold tracking-[2.5px] text-[#8992A8]">
                CAMPUSOS
              </Text>
              <Text className="mt-1 text-[16px] font-bold text-[#202B49]">
                {title}
              </Text>
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Get student support"
              onPress={() => router.push('/student/student-support')}
              className="h-11 w-11 items-center justify-center rounded-2xl border border-[#E9EDF5] bg-white"
            >
              <Ionicons name="help-circle-outline" size={23} color={SERVICE_COLORS.navy} />
            </Pressable>
          </View>

          <LinearGradient
            colors={['#EAF0FF', '#F0EEFF', '#FFFFFF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              borderRadius: 28,
              borderWidth: 1,
              borderColor: '#E8EAFE',
              padding: 20,
              overflow: 'hidden',
            }}
          >
            <View
              pointerEvents="none"
              className="absolute -right-8 -top-12 h-40 w-40 rounded-full"
              style={{ backgroundColor: accent, opacity: 0.07 }}
            />
            <View className="flex-row items-center justify-between">
              <View
                className="h-12 w-12 items-center justify-center rounded-2xl bg-white"
                style={{ backgroundColor: tint }}
              >
                <Ionicons name={icon} size={25} color={accent} />
              </View>
              <View className="flex-row items-center rounded-full border border-[#DCE4FF] bg-white/80 px-3 py-2">
                <View className="mr-2 h-2 w-2 rounded-full" style={{ backgroundColor: SERVICE_COLORS.green }} />
                <Text className="text-[9px] font-bold text-[#52617F]">
                  STUDENT SERVICES
                </Text>
              </View>
            </View>
            <Text className="mt-5 text-[25px] font-extrabold leading-[33px] text-[#202B49]">
              {headline}
            </Text>
            <Text className="mt-2 max-w-[285px] text-[12px] leading-[20px] text-[#77829D]">
              {description}
            </Text>
            <View className="mt-4 flex-row items-center">
              <Ionicons name="checkmark-circle" size={16} color={SERVICE_COLORS.green} />
              <Text className="ml-2 text-[10px] font-semibold text-[#52617F]">
                Manage it all in one place
              </Text>
            </View>
          </LinearGradient>
          {children}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export function ServiceSectionHeading({
  title,
  subtitle,
  trailing,
}: {
  title: string;
  subtitle?: string;
  trailing?: React.ReactNode;
}) {
  return (
    <View className="mb-4 mt-7 flex-row items-end justify-between">
      <View className="flex-1 pr-3">
        <Text className="text-[19px] font-extrabold text-[#202B49]">{title}</Text>
        {subtitle ? (
          <Text className="mt-1 text-[11px] text-[#8992A8]">{subtitle}</Text>
        ) : null}
      </View>
      {trailing}
    </View>
  );
}

export function ServiceTag({
  label,
  color = SERVICE_COLORS.blue,
  background = SERVICE_COLORS.paleBlue,
}: {
  label: string;
  color?: string;
  background?: string;
}) {
  return (
    <View className="self-start rounded-xl px-3 py-2" style={{ backgroundColor: background }}>
      <Text className="text-[9px] font-extrabold" style={{ color }}>
        {label.toUpperCase()}
      </Text>
    </View>
  );
}

export function ServiceEmptyState({
  title,
  description,
  icon = 'file-tray-outline',
}: {
  title: string;
  description: string;
  icon?: ServiceIcon;
}) {
  return (
    <View className="items-center rounded-3xl border border-[#E9EDF5] bg-white px-6 py-10">
      <View className="mb-4 h-14 w-14 items-center justify-center rounded-2xl bg-[#EEF2FF]">
        <Ionicons name={icon} size={25} color={SERVICE_COLORS.blue} />
      </View>
      <Text className="text-[14px] font-extrabold text-[#202B49]">{title}</Text>
      <Text className="mt-2 text-center text-[11px] leading-[18px] text-[#8992A8]">
        {description}
      </Text>
    </View>
  );
}

export function ServiceChoiceChip({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      onPress={onPress}
      className={`mr-2 mb-2 rounded-full border px-3 py-2 ${
        active ? 'border-[#DCE4FF] bg-[#EEF2FF]' : 'border-[#E9EDF5] bg-white'
      }`}
    >
      <Text className={`text-[10px] font-bold ${active ? 'text-[#6478E8]' : 'text-[#77829D]'}`}>
        {label}
      </Text>
    </Pressable>
  );
}

export function ServiceTextField({
  label,
  value,
  onChangeText,
  placeholder,
  multiline = false,
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  multiline?: boolean;
}) {
  return (
    <View className="mb-4">
      <Text className="mb-2 text-[10px] font-extrabold text-[#52617F]">{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#A3ABBD"
        multiline={multiline}
        textAlignVertical={multiline ? 'top' : 'center'}
        className={`rounded-2xl border border-[#E9EDF5] bg-white px-4 text-[12px] text-[#202B49] ${
          multiline ? 'min-h-[104px] py-3' : 'h-[48px]'
        }`}
      />
    </View>
  );
}

export function ServicePrimaryButton({
  title,
  onPress,
  icon = 'arrow-forward-outline',
  disabled = false,
}: {
  title: string;
  onPress: () => void;
  icon?: ServiceIcon;
  disabled?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      className="mt-1 flex-row items-center justify-center rounded-2xl px-4 py-4"
      style={{ backgroundColor: disabled ? '#AEB6C8' : SERVICE_COLORS.navy }}
    >
      <Text className="mr-2 text-[12px] font-extrabold text-white">{title}</Text>
      <Ionicons name={icon} size={17} color="#FFFFFF" />
    </Pressable>
  );
}
