
import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StatusBar,
  KeyboardAvoidingView,
  ScrollView,
  type ScrollViewInstance,
  Platform,
  Alert,
  useWindowDimensions,
  type KeyboardTypeOptions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const NAVY = '#111A35';
const BLUE = '#6478E8';
const MUTED = '#8992A6';
const BORDER = '#E8EBF2';
const RED = '#DC4545';
const LIGHT_BG = '#F8F9FC';
const LAVENDER = '#F1F3FF';

const TOTAL_STEPS = 4;

type FieldProps = {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (value: string) => void;
  field: string;
  activeField: string;
  setActiveField: (field: string) => void;
  icon: keyof typeof Ionicons.glyphMap;
  error?: string;
  submitted: boolean;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  secureTextEntry?: boolean;
  rightAction?: React.ReactNode;
  autoComplete?: 'email' | 'name' | 'off' | 'new-password';
};

function FormInput({
  label,
  placeholder,
  value,
  onChangeText,
  field,
  activeField,
  setActiveField,
  icon,
  error = '',
  submitted,
  keyboardType = 'default',
  autoCapitalize = 'none',
  secureTextEntry = false,
  rightAction,
  autoComplete = 'off',
}: FieldProps) {
  const focused = activeField === field;
  const hasError = submitted && !!error;

  return (
    <View className="mb-5">
      <Text className="mb-2.5 text-[12px] font-bold text-slate-800">
        {label}
      </Text>

      <View
        className="h-[56px] flex-row items-center rounded-2xl border px-4"
        style={{
          borderColor: hasError ? RED : focused ? BLUE : BORDER,
          backgroundColor: focused ? '#FFFFFF' : LIGHT_BG,
        }}
      >
        <Ionicons
          name={icon}
          size={21}
          color={focused ? BLUE : MUTED}
        />

        <TextInput
          className="ml-3 h-full flex-1 text-[14px] text-slate-900"
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#A0A8B8"
          onFocus={() => setActiveField(field)}
          onBlur={() => setActiveField('')}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={false}
          autoComplete={autoComplete}
          secureTextEntry={secureTextEntry}
          selectionColor={BLUE}
          accessibilityLabel={label}
        />

        {rightAction}
      </View>

      {hasError && (
        <View className="mt-2 flex-row items-start">
          <Ionicons
            name="alert-circle-outline"
            size={14}
            color={RED}
          />
          <Text className="ml-1.5 flex-1 text-[11px]" style={{ color: RED }}>
            {error}
          </Text>
        </View>
      )}

      {submitted && !error && value.trim().length > 0 && (
        <View className="absolute right-3 top-[38px]">
          {/* Validation checkmarks are shown in the field when useful. */}
        </View>
      )}
    </View>
  );
}

export default function RegisterScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const pagesRef = useRef<ScrollViewInstance>(null);

  const [step, setStep] = useState(0);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const [activeField, setActiveField] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const emailError = !email.trim()
    ? 'Email address is required.'
    : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
      ? 'Please enter a valid email address.'
      : '';

  const validateStep = () => {
    setSubmitted(true);
    setError('');

    if (step === 0) {
      if (!firstName.trim()) {
        setError('Please enter your first name.');
        return false;
      }

      if (!lastName.trim()) {
        setError('Please enter your last name.');
        return false;
      }

      if (emailError) {
        setError(emailError);
        return false;
      }
    }

    if (step === 1 && !studentId.trim()) {
      setError('Student ID is required.');
      return false;
    }

    if (step === 2) {
      if (!password) {
        setError('Please create a password.');
        return false;
      }

      if (password.length < 8) {
        setError('Password must contain at least 8 characters.');
        return false;
      }

      if (!confirmPassword) {
        setError('Please confirm your password.');
        return false;
      }

      if (password !== confirmPassword) {
        setError('Your passwords do not match.');
        return false;
      }
    }

    if (step === 3 && !acceptedTerms) {
      setError('Please accept the Terms of Service and Privacy Policy.');
      return false;
    }

    return true;
  };

  const goToStep = (nextStep: number) => {
    const safeStep = Math.max(0, Math.min(TOTAL_STEPS - 1, nextStep));

    setStep(safeStep);
    setError('');
    setSubmitted(false);
    setActiveField('');

    pagesRef.current?.scrollTo({
      x: safeStep * width,
      animated: true,
    });
  };

  const handleContinue = () => {
    if (!validateStep()) return;

    if (step < TOTAL_STEPS - 1) {
      goToStep(step + 1);
      return;
    }

    // Connect your authentication API here.
    Alert.alert(
      'CampusOS',
      'Your details are ready. Connect your registration API to create your account.',
    );
  };

  const handleBack = () => {
    if (step > 0) {
      goToStep(step - 1);
    } else {
      router.back();
    }
  };

  const commonInputProps = {
    activeField,
    setActiveField,
    submitted,
  };

  const renderNameInput = (
    label: string,
    placeholder: string,
    value: string,
    onChangeText: (value: string) => void,
    field: string,
  ) => {
    const focused = activeField === field;

    return (
      <View className="flex-1">
        <Text className="mb-2.5 text-[12px] font-bold text-slate-800">
          {label}
        </Text>

        <View
          className="h-[56px] justify-center rounded-2xl border px-3"
          style={{
            borderColor: focused ? BLUE : BORDER,
            backgroundColor: focused ? '#FFFFFF' : LIGHT_BG,
          }}
        >
          <TextInput
            className="h-full text-[13px] text-slate-900"
            placeholder={placeholder}
            placeholderTextColor="#A0A8B8"
            value={value}
            onChangeText={onChangeText}
            onFocus={() => setActiveField(field)}
            onBlur={() => setActiveField('')}
            autoCapitalize="words"
            autoCorrect={false}
            selectionColor={BLUE}
            accessibilityLabel={label}
          />
        </View>
      </View>
    );
  };

  const renderStepHeading = (
    eyebrow: string,
    title: string,
    description: string,
  ) => (
    <View className="mb-8">
      <View className="mb-5 flex-row items-center">
        <View
          className="mr-2 h-[3px] w-6 rounded-full"
          style={{ backgroundColor: BLUE }}
        />
        <Text className="text-[10px] font-extrabold tracking-[2px] text-slate-500">
          {eyebrow}
        </Text>
      </View>

      <Text
        className="text-[38px] font-extrabold leading-[44px] tracking-[-1.5px]"
        style={{ color: NAVY }}
      >
        {title}
        <Text style={{ color: BLUE }}>.</Text>
      </Text>

      <Text className="mt-4 max-w-[310px] text-[14px] leading-[23px] text-slate-500">
        {description}
      </Text>

      <View className="mt-6 flex-row items-center">
        <View
          className="h-1 rounded-full"
          style={{
            width: step + 1 === 1 ? 32 : 22,
            backgroundColor: NAVY,
          }}
        />
        <View
          className="ml-1.5 h-1 rounded-full"
          style={{
            width: step + 1 === 2 ? 32 : 16,
            backgroundColor: '#A7B4FF',
          }}
        />
        <View className="ml-1.5 h-1 w-2 rounded-full bg-slate-200" />
      </View>
    </View>
  );

  const renderPage = (index: number) => {
    switch (index) {
      case 0:
        return (
          <>
            {renderStepHeading(
              'YOUR CAMPUS. YOUR WORLD.',
              "Let's get\nstarted",
              'Create your CampusOS account and bring your campus life together in one place.',
            )}

            <View className="mb-5 flex-row gap-3">
              {renderNameInput(
                'First name',
                'First name',
                firstName,
                setFirstName,
                'firstName',
              )}

              {renderNameInput(
                'Last name',
                'Last name',
                lastName,
                setLastName,
                'lastName',
              )}
            </View>

            {submitted && (!firstName.trim() || !lastName.trim()) && (
              <View className="mb-4 flex-row items-center">
                <Ionicons
                  name="alert-circle-outline"
                  size={14}
                  color={RED}
                />
                <Text className="ml-1.5 text-[11px]" style={{ color: RED }}>
                  Enter both your first and last name.
                </Text>
              </View>
            )}

            <FormInput
              {...commonInputProps}
              label="College email address"
              placeholder="you@college.edu"
              value={email}
              onChangeText={setEmail}
              field="email"
              icon="mail-outline"
              keyboardType="email-address"
              autoComplete="email"
              error={emailError}
            />

            <View
              className="mt-1 flex-row items-start rounded-[22px] p-4"
              style={{ backgroundColor: LAVENDER }}
            >
              <View className="h-10 w-10 items-center justify-center rounded-xl bg-[#E2E7FF]">
                <Ionicons
                  name="shield-checkmark-outline"
                  size={21}
                  color={BLUE}
                />
              </View>

              <View className="ml-3 flex-1">
                <Text className="text-[12px] font-bold" style={{ color: NAVY }}>
                  Your account, your space
                </Text>
                <Text className="mt-1 text-[11px] leading-[18px] text-slate-500">
                  Use an email address you can access to keep your account secure.
                </Text>
              </View>
            </View>
          </>
        );

      case 1:
        return (
          <>
            {renderStepHeading(
              'YOUR CAMPUS. YOUR IDENTITY.',
              'Make it\nofficial',
              'Add your college details so we can personalize your campus experience.',
            )}

            <FormInput
              {...commonInputProps}
              label="Student ID"
              placeholder="Enter your student ID"
              value={studentId}
              onChangeText={setStudentId}
              field="studentId"
              icon="id-card-outline"
              autoCapitalize="none"
              error={!studentId.trim() ? 'Student ID is required.' : ''}
            />

            <View
              className="mt-2 rounded-[22px] p-5"
              style={{ backgroundColor: LAVENDER }}
            >
              <View className="h-11 w-11 items-center justify-center rounded-2xl bg-[#E2E7FF]">
                <Ionicons
                  name="school-outline"
                  size={23}
                  color={BLUE}
                />
              </View>

              <Text className="mt-4 text-[14px] font-bold" style={{ color: NAVY }}>
                Your student identity
              </Text>

              <Text className="mt-2 text-[12px] leading-[21px] text-slate-500">
                Enter the student ID assigned by your institution. You can go back to edit your personal details whenever needed.
              </Text>
            </View>
          </>
        );

      case 2:
        return (
          <>
            {renderStepHeading(
              'KEEP YOUR ACCOUNT SAFE.',
              'Secure your\naccount',
              'Choose a strong password that you can remember and keep private.',
            )}

            <FormInput
              {...commonInputProps}
              label="Create password"
              placeholder="At least 8 characters"
              value={password}
              onChangeText={setPassword}
              field="password"
              icon="lock-closed-outline"
              secureTextEntry={!showPassword}
              autoComplete="new-password"
              error={
                !password
                  ? 'Password is required.'
                  : password.length < 8
                    ? 'Password must contain at least 8 characters.'
                    : ''
              }
              rightAction={
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  activeOpacity={0.7}
                  accessibilityRole="button"
                  accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
                >
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={21}
                    color={MUTED}
                  />
                </TouchableOpacity>
              }
            />

            <FormInput
              {...commonInputProps}
              label="Confirm password"
              placeholder="Enter password again"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              field="confirmPassword"
              icon="shield-checkmark-outline"
              secureTextEntry={!showConfirmPassword}
              autoComplete="new-password"
              error={
                !confirmPassword
                  ? 'Please confirm your password.'
                  : password !== confirmPassword
                    ? 'Your passwords do not match.'
                    : ''
              }
              rightAction={
                <TouchableOpacity
                  onPress={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  activeOpacity={0.7}
                  accessibilityRole="button"
                  accessibilityLabel={
                    showConfirmPassword ? 'Hide password' : 'Show password'
                  }
                >
                  <Ionicons
                    name={
                      showConfirmPassword
                        ? 'eye-off-outline'
                        : 'eye-outline'
                    }
                    size={21}
                    color={MUTED}
                  />
                </TouchableOpacity>
              }
            />

            <View className="mt-1 flex-row items-center">
              <Ionicons
                name={
                  password.length >= 8
                    ? 'checkmark-circle'
                    : 'ellipse-outline'
                }
                size={17}
                color={password.length >= 8 ? '#16A36A' : MUTED}
              />

              <Text className="ml-2 text-[11px] text-slate-500">
                Use at least 8 characters for your password.
              </Text>
            </View>
          </>
        );

      default:
        return (
          <>
            {renderStepHeading(
              'ONE LAST STEP.',
              "You're all\nset",
              'Review your information and agree to the terms to finish setting up your account.',
            )}

            <View
              className="rounded-[24px] p-5"
              style={{ backgroundColor: LAVENDER }}
            >
              <View className="mb-4 flex-row items-center">
                <View className="h-11 w-11 items-center justify-center rounded-2xl bg-[#E2E7FF]">
                  <Ionicons name="person-outline" size={22} color={BLUE} />
                </View>

                <View className="ml-3 flex-1">
                  <Text className="text-[14px] font-bold" style={{ color: NAVY }}>
                    Account overview
                  </Text>
                  <Text className="mt-1 text-[11px] text-slate-500">
                    Check your details below
                  </Text>
                </View>
              </View>

              {[
                {
                  label: 'Full name',
                  value: `${firstName.trim()} ${lastName.trim()}`.trim(),
                  icon: 'person-outline' as const,
                  target: 0,
                },
                {
                  label: 'Email address',
                  value: email.trim(),
                  icon: 'mail-outline' as const,
                  target: 0,
                },
                {
                  label: 'Student ID',
                  value: studentId.trim(),
                  icon: 'id-card-outline' as const,
                  target: 1,
                },
              ].map((item, index) => (
                <View
                  key={item.label}
                  className={`flex-row items-center py-4 ${
                    index < 2 ? 'border-b border-[#DFE4FA]' : ''
                  }`}
                >
                  <Ionicons
                    name={item.icon}
                    size={19}
                    color={BLUE}
                  />

                  <View className="ml-3 flex-1">
                    <Text className="text-[10px] font-medium text-slate-500">
                      {item.label}
                    </Text>
                    <Text
                      className="mt-1 text-[13px] font-bold"
                      style={{ color: NAVY }}
                    >
                      {item.value || 'Not provided'}
                    </Text>
                  </View>

                  <TouchableOpacity
                    onPress={() => goToStep(item.target)}
                    accessibilityRole="button"
                    accessibilityLabel={`Edit ${item.label}`}
                  >
                    <Ionicons
                      name="pencil-outline"
                      size={18}
                      color={BLUE}
                    />
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            <TouchableOpacity
              className="mt-6 flex-row items-start"
              onPress={() => {
                setAcceptedTerms(!acceptedTerms);
                setError('');
              }}
              activeOpacity={0.75}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: acceptedTerms }}
            >
              <View
                className="mt-0.5 h-5 w-5 items-center justify-center rounded-md border"
                style={{
                  backgroundColor: acceptedTerms ? NAVY : '#FFFFFF',
                  borderColor: acceptedTerms ? NAVY : '#D7DCE7',
                }}
              >
                {acceptedTerms && (
                  <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                )}
              </View>

              <Text className="ml-3 flex-1 text-[12px] leading-[21px] text-slate-500">
                I agree to the{' '}
                <Text className="font-bold" style={{ color: BLUE }}>
                  Terms of Service
                </Text>{' '}
                and{' '}
                <Text className="font-bold" style={{ color: BLUE }}>
                  Privacy Policy
                </Text>
                .
              </Text>
            </TouchableOpacity>
          </>
        );
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View className="flex-1">
          {/* BRAND HEADER — MATCHES LOGIN */}
          <View className="px-[26px] pt-3">
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

              <TouchableOpacity
                onPress={handleBack}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityLabel={step === 0 ? 'Go back' : 'Previous step'}
                className="h-11 w-11 items-center justify-center rounded-2xl border"
                style={{ borderColor: BORDER }}
              >
                <Ionicons
                  name="arrow-back"
                  size={20}
                  color={NAVY}
                />
              </TouchableOpacity>
            </View>

            {/* STEP PROGRESS */}
            <View className="mt-7 flex-row gap-2">
              {Array.from({ length: TOTAL_STEPS }).map((_, index) => (
                <View
                  key={index}
                  className="h-[4px] flex-1 rounded-full"
                  style={{
                    backgroundColor: index <= step ? BLUE : BORDER,
                  }}
                />
              ))}
            </View>

            <View className="mt-3 flex-row items-center justify-between">
              <Text className="text-[10px] font-bold tracking-[1.5px] text-slate-400">
                STEP {String(step + 1).padStart(2, '0')} OF 04
              </Text>

              <Text className="text-[11px] font-semibold" style={{ color: BLUE }}>
                {['Personal details', 'College details', 'Security', 'Review'][step]}
              </Text>
            </View>
          </View>

          {/* FOUR SWIPEABLE PAGES */}
          <ScrollView
            ref={pagesRef}
            horizontal
            pagingEnabled
            directionalLockEnabled
            showsHorizontalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            onMomentumScrollEnd={(event) => {
              const nextStep = Math.round(
                event.nativeEvent.contentOffset.x / width,
              );

              setStep(nextStep);
              setError('');
              setSubmitted(false);
              setActiveField('');
            }}
          >
            {[0, 1, 2, 3].map((index) => (
              <View
                key={index}
                style={{ width }}
                className="flex-1"
              >
                <ScrollView
                  className="flex-1"
                  contentContainerStyle={{
                    flexGrow: 1,
                    paddingHorizontal: 26,
                    paddingTop: 35,
                    paddingBottom: 28,
                  }}
                  keyboardShouldPersistTaps="handled"
                  showsVerticalScrollIndicator={false}
                >
                  {renderPage(index)}
                </ScrollView>
              </View>
            ))}
          </ScrollView>

          {/* ERROR + PRIMARY BUTTON */}
          <View
            className="border-t px-[26px] pb-3 pt-4"
            style={{ borderColor: '#F0F1F5', backgroundColor: '#FFFFFF' }}
          >
            {error ? (
              <View className="mb-3 flex-row items-start">
                <Ionicons
                  name="alert-circle-outline"
                  size={15}
                  color={RED}
                />
                <Text className="ml-2 flex-1 text-[11px]" style={{ color: RED }}>
                  {error}
                </Text>
              </View>
            ) : null}

            <TouchableOpacity
              className="h-[56px] flex-row items-center justify-center rounded-2xl"
              style={{ backgroundColor: NAVY }}
              onPress={handleContinue}
              activeOpacity={0.85}
              accessibilityRole="button"
            >
              <Text className="mr-2 text-[13px] font-bold tracking-wide text-white">
                {step === TOTAL_STEPS - 1 ? 'Create Account' : 'Continue'}
              </Text>

              <Ionicons
                name={
                  step === TOTAL_STEPS - 1
                    ? 'checkmark-circle-outline'
                    : 'arrow-forward'
                }
                size={19}
                color="#FFFFFF"
              />
            </TouchableOpacity>

            <View className="mt-5 flex-row items-center justify-center">
              <Text className="text-[12px] text-slate-500">
                Already have an account?{' '}
              </Text>

              <TouchableOpacity
                onPress={() => router.replace('/login')}
                activeOpacity={0.7}
                accessibilityRole="button"
              >
                <Text className="text-[12px] font-bold" style={{ color: BLUE }}>
                  Sign in
                </Text>
              </TouchableOpacity>
            </View>

            <View className="mt-4 flex-row items-center justify-center">
              <View className="mr-2 h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <Text className="text-[9px] font-bold tracking-[1.5px] text-slate-400">
                YOUR CAMPUS. YOUR SPACE.
              </Text>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
