
import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StatusBar,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const NAVY = '#111A35';
const BLUE = '#6478E8';
const MUTED = '#8992A6';
const BORDER = '#E8EBF2';
const RED = '#DC4545';

const LOGIN_ROLES = [
  { key: 'student', label: 'Student', icon: 'school-outline' },
  { key: 'parent', label: 'Parent', icon: 'heart-outline' },
  { key: 'faculty', label: 'Faculty', icon: 'book-outline' },
  { key: 'hod', label: 'HOD', icon: 'business-outline' },
  { key: 'principal', label: 'Principal', icon: 'ribbon-outline' },
] as const;
type LoginRole = (typeof LOGIN_ROLES)[number]['key'];

export default function LoginScreen() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [role, setRole] = useState<LoginRole>('student');
  const [activeField, setActiveField] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading] = useState(false);

  const emailError = !email.trim()
    ? 'Email address is required.'
    : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
      ? 'Please enter a valid email address.'
      : '';

  const passwordError = !password
    ? 'Password is required.'
    : '';

  const handleLogin = () => {
    setSubmitted(true);

    if (emailError || passwordError) {
      return;
    }

    router.replace({
      pathname: '/login-success',
      params: { role },
    });
  };

  const getInputStyle = (field: string, error: string) => ({
    borderColor:
      submitted && error
        ? RED
        : activeField === field
          ? BLUE
          : BORDER,
    backgroundColor:
      activeField === field ? '#FFFFFF' : '#F8F9FC',
  });

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar
        barStyle="dark-content"
      />

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 26,
            paddingTop: 14,
            paddingBottom: 26,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* BRAND HEADER */}
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <View
                className="h-[48px] w-[48px] items-center justify-center rounded-2xl"
                style={{ backgroundColor: NAVY }}
              >
                <Text className="text-[27px] font-black text-white">
                  C
                </Text>

                <View
                  className="absolute bottom-2 right-2 h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: '#A7B4FF' }}
                />
              </View>

              <View className="ml-3">
                <Text
                  className="text-[20px] font-extrabold tracking-tight"
                  style={{ color: NAVY }}
                >
                  CampusOS
                </Text>

                <Text className="mt-0.5 text-[9px] font-bold tracking-[2px] text-slate-400">
                  CAMPUS, CONNECTED
                </Text>
              </View>
            </View>
          </View>

          {/* WELCOME SECTION */}
          <View className="mt-11">
            <View className="mb-5 flex-row items-center">
              <View
                className="mr-2 h-[3px] w-6 rounded-full"
                style={{ backgroundColor: BLUE }}
              />

              <Text className="text-[10px] font-extrabold tracking-[2px] text-slate-500">
                YOUR CAMPUS. YOUR WORLD.
              </Text>
            </View>

            <Text
              className="text-[44px] font-extrabold leading-[50px] tracking-[-2px]"
              style={{ color: NAVY }}
            >
              Welcome{'\n'}back
              <Text style={{ color: BLUE }}>.</Text>
            </Text>

            <Text className="mt-4 max-w-[310px] text-[14px] leading-[23px] text-slate-500">
              Your campus updates, learning, and community — all in one place.
            </Text>

            <View className="mt-6 flex-row items-center">
              <View className="h-1 w-8 rounded-full bg-[#111A35]" />
              <View className="ml-1.5 h-1 w-4 rounded-full bg-[#A7B4FF]" />
              <View className="ml-1.5 h-1 w-2 rounded-full bg-slate-200" />
            </View>
          </View>

          <View className="mt-7">
            <Text className="mb-2.5 text-[12px] font-bold text-slate-800">
              Sign in as
            </Text>
            <View className="flex-row flex-wrap" style={{ gap: 8 }}>
              {LOGIN_ROLES.map((item) => {
                const selected = role === item.key;
                return (
                  <TouchableOpacity
                    key={item.key}
                    onPress={() => setRole(item.key)}
                    activeOpacity={0.8}
                    accessibilityRole="radio"
                    accessibilityState={{ checked: selected }}
                    accessibilityLabel={`Sign in as ${item.label}`}
                    className="flex-row items-center rounded-xl border px-3 py-2.5"
                    style={{
                      borderColor: selected ? NAVY : BORDER,
                      backgroundColor: selected ? '#F0F2FF' : '#FFFFFF',
                    }}
                  >
                    <Ionicons
                      name={item.icon as keyof typeof Ionicons.glyphMap}
                      size={15}
                      color={selected ? BLUE : MUTED}
                    />
                    <Text
                      className="ml-1.5 text-[10px] font-bold"
                      style={{ color: selected ? NAVY : '#667085' }}
                    >
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* EMAIL FIELD */}
          <View className="mt-8">
            <Text className="mb-2.5 text-[12px] font-bold text-slate-800">
              Email address
            </Text>

            <View
              className="h-[56px] flex-row items-center rounded-2xl border px-4"
              style={getInputStyle('email', emailError)}
            >
              <Ionicons
                name="mail-outline"
                size={21}
                color={activeField === 'email' ? BLUE : MUTED}
              />

              <TextInput
                className="ml-3 h-full flex-1 text-[14px] text-slate-900"
                placeholder="you@college.edu"
                placeholderTextColor="#A0A8B8"
                value={email}
                onChangeText={setEmail}
                onFocus={() => setActiveField('email')}
                onBlur={() => setActiveField('')}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="email"
                returnKeyType="next"
                accessibilityLabel="Email address"
              />

              {submitted && !emailError && (
                <Ionicons
                  name="checkmark-circle"
                  size={19}
                  color="#16A36A"
                />
              )}
            </View>

            {submitted && !!emailError && (
              <View className="mt-2 flex-row items-center">
                <Ionicons
                  name="alert-circle-outline"
                  size={14}
                  color={RED}
                />
                <Text
                  className="ml-1.5 flex-1 text-[11px]"
                  style={{ color: RED }}
                >
                  {emailError}
                </Text>
              </View>
            )}
          </View>

          {/* PASSWORD FIELD */}
          <View className="mt-5">
            <View className="mb-2.5 flex-row items-center justify-between">
              <Text className="text-[12px] font-bold text-slate-800">
                Password
              </Text>

              <TouchableOpacity
                onPress={() => router.push('/forgot-password')}
                activeOpacity={0.7}
                accessibilityRole="button"
              >
                <Text
                  className="text-[11px] font-bold"
                  style={{ color: BLUE }}
                >
                  Forgot password?
                </Text>
              </TouchableOpacity>
            </View>

            <View
              className="h-[56px] flex-row items-center rounded-2xl border px-4"
              style={getInputStyle('password', passwordError)}
            >
              <Ionicons
                name="lock-closed-outline"
                size={21}
                color={activeField === 'password' ? BLUE : MUTED}
              />

              <TextInput
                className="ml-3 h-full flex-1 text-[14px] text-slate-900"
                placeholder="Enter your password"
                placeholderTextColor="#A0A8B8"
                value={password}
                onChangeText={setPassword}
                onFocus={() => setActiveField('password')}
                onBlur={() => setActiveField('')}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="current-password"
                returnKeyType="done"
                onSubmitEditing={handleLogin}
                accessibilityLabel="Password"
              />

              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityLabel={
                  showPassword ? 'Hide password' : 'Show password'
                }
              >
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={21}
                  color={MUTED}
                />
              </TouchableOpacity>
            </View>

            {submitted && !!passwordError && (
              <View className="mt-2 flex-row items-center">
                <Ionicons
                  name="alert-circle-outline"
                  size={14}
                  color={RED}
                />
                <Text
                  className="ml-1.5 flex-1 text-[11px]"
                  style={{ color: RED }}
                >
                  {passwordError}
                </Text>
              </View>
            )}
          </View>

          {/* REMEMBER ME */}
          <TouchableOpacity
            className="mb-6 mt-5 flex-row items-center self-start py-1"
            onPress={() => setRememberMe(!rememberMe)}
            activeOpacity={0.7}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: rememberMe }}
          >
            <View
              className="h-5 w-5 items-center justify-center rounded-md border"
              style={{
                backgroundColor: rememberMe ? NAVY : '#FFFFFF',
                borderColor: rememberMe ? NAVY : '#D7DCE7',
              }}
            >
              {rememberMe && (
                <Ionicons
                  name="checkmark"
                  size={14}
                  color="#FFFFFF"
                />
              )}
            </View>

            <Text className="ml-2.5 text-[12px] font-medium text-slate-600">
              Remember me
            </Text>
          </TouchableOpacity>

          {/* PRIMARY SIGN-IN BUTTON */}
          <TouchableOpacity
            className="h-[56px] flex-row items-center justify-center rounded-2xl"
            style={{
              backgroundColor: NAVY,
              opacity: loading ? 0.7 : 1,
            }}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.85}
            accessibilityRole="button"
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Text className="text-[13px] font-bold tracking-wide text-white">
                  Sign in
                </Text>
             </>
            )}
          </TouchableOpacity>

          {/* CREATE ACCOUNT PANEL */}
          <View
            className="mt-7 rounded-[24px] p-5"
            style={{ backgroundColor: '#F1F3FF' }}
          >
            <View className="flex-row items-center">
              <View
                className="h-12 w-12 items-center justify-center rounded-2xl"
                style={{ backgroundColor: '#E2E7FF' }}
              >
                <Ionicons
                  name="person-add-outline"
                  size={23}
                  color={BLUE}
                />
              </View>

              <View className="ml-3 flex-1">
                <Text
                  className="text-[14px] font-bold"
                  style={{ color: NAVY }}
                >
                  New to CampusOS?
                </Text>

                <Text
                  className="mt-1 text-[11px] leading-[18px]"
                  style={{ color: '#78819A' }}
                >
                  Create your account and get started.
                </Text>
              </View>
            </View>

            <TouchableOpacity
              className="mt-5 h-[49px] flex-row items-center justify-center rounded-2xl"
              style={{ backgroundColor: '#FFFFFF' }}
              onPress={() => router.push('/register')}
              activeOpacity={0.75}
              accessibilityRole="button"
            >
              <Text
                className="text-[13px] font-bold"
                style={{ color: '#465BCC' }}
              >
                Create account
              </Text>

              <Ionicons
                name="arrow-forward"
                size={17}
                color="#465BCC"
                style={{ marginLeft: 9 }}
              />
            </TouchableOpacity>
          </View>

          {/* FOOTER */}
          <View className="mt-auto items-center pt-7">
            <View className="mb-3 flex-row items-center">
              <View className="mr-2 h-1.5 w-1.5 rounded-full bg-emerald-500" />

              <Text className="text-[9px] font-bold tracking-[1.5px] text-slate-400">
                YOUR CAMPUS. YOUR SPACE.
              </Text>
            </View>

            <Text className="text-center text-[10px] text-slate-400">
              By continuing, you agree to our
            </Text>

            <View className="mt-2 flex-row items-center">
              <TouchableOpacity activeOpacity={0.7}>
                <Text className="text-[10px] font-semibold text-slate-600">
                  Terms of Service
                </Text>
              </TouchableOpacity>

              <Text className="mx-2 text-slate-300">·</Text>

              <TouchableOpacity activeOpacity={0.7}>
                <Text className="text-[10px] font-semibold text-slate-600">
                  Privacy Policy
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
