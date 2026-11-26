
import { Ionicons } from '@expo/vector-icons';
import { Modal, Pressable, Text, View } from 'react-native';

export type PlannerAlertType =
  | 'success'
  | 'warning'
  | 'info'
  | 'error';

type PlannerAlertProps = {
  visible: boolean;
  title: string;
  message: string;
  type?: PlannerAlertType;
  confirmText?: string;
  cancelText?: string;
  showCancel?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

const alertStyles: Record<
  PlannerAlertType,
  {
    icon: keyof typeof Ionicons.glyphMap;
    iconColor: string;
    iconBackground: string;
  }
> = {
  success: {
    icon: 'checkmark-circle',
    iconColor: '#059669',
    iconBackground: '#D1FAE5',
  },
  warning: {
    icon: 'alert-circle',
    iconColor: '#D97706',
    iconBackground: '#FEF3C7',
  },
  info: {
    icon: 'information-circle',
    iconColor: '#4F46E5',
    iconBackground: '#E0E7FF',
  },
  error: {
    icon: 'trash-outline',
    iconColor: '#E11D48',
    iconBackground: '#FFE4E6',
  },
};

export default function PlannerAlert({
  visible,
  title,
  message,
  type = 'info',
  confirmText = 'Continue',
  cancelText = 'Cancel',
  showCancel = true,
  onConfirm,
  onCancel,
}: PlannerAlertProps) {
  const appearance = alertStyles[type];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onCancel}
    >
      <View className="flex-1 items-center justify-center bg-black/45 px-6">
        <Pressable
          className="absolute inset-0"
          onPress={onCancel}
          accessibilityLabel="Close alert"
        />

        <View className="w-full max-w-[380px] rounded-[28px] bg-white p-6">
          <View className="items-center">
            <View
              className="h-[66px] w-[66px] items-center justify-center rounded-[22px]"
              style={{ backgroundColor: appearance.iconBackground }}
            >
              <Ionicons
                name={appearance.icon}
                size={34}
                color={appearance.iconColor}
              />
            </View>

            <Text className="mt-5 text-center text-xl font-bold text-slate-900">
              {title}
            </Text>

            <Text className="mt-2 text-center text-sm leading-6 text-slate-500">
              {message}
            </Text>
          </View>

          <View className="mt-7 gap-3">
            <Pressable
              onPress={onConfirm}
              className="items-center rounded-2xl bg-[#111827] py-4"
            >
              <Text className="text-sm font-bold text-white">
                {confirmText}
              </Text>
            </Pressable>

            {showCancel && (
              <Pressable
                onPress={onCancel}
                className="items-center rounded-2xl border border-slate-200 bg-white py-3.5"
              >
                <Text className="text-sm font-semibold text-slate-600">
                  {cancelText}
                </Text>
              </Pressable>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}
