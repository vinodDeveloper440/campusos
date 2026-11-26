
import React, { useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  Share,
  StatusBar,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';

type IconName = React.ComponentProps<typeof Feather>['name'];

type Student = {
  name: string;
  email: string;
  phone: string;
  department: string;
  course: string;
  year: string;
  semester: string;
  section: string;
  admissionYear: string;
  mentor: string;
  campus: string;
  role: string;
  bloodGroup: string;
};

const INITIAL_STUDENT: Student = {
  name: 'Alex Johnson',
  email: 'alex.johnson@campus.edu',
  phone: '+91 98765 43210',
  department: 'Computer Science',
  course: 'B.Tech Computer Science',
  year: '3rd Year',
  semester: 'Semester 5',
  section: 'Section A',
  admissionYear: '2024',
  mentor: 'Dr. Priya Sharma',
  campus: 'Main Campus',
  role: 'Student',
  bloodGroup: '',
};

const STUDENT_ID = 'CS2026001';
const ATTENDANCE = { attended: 72, total: 80, percentage: 90 };
const PURPLE = '#6958D8';
const GREEN = '#23966D';

function SectionTitle({
  title,
  action,
  onPress,
}: {
  title: string;
  action?: string;
  onPress?: () => void;
}) {
  return (
    <View className="mb-3 mt-1 flex-row items-center justify-between">
      <Text className="text-base font-extrabold text-[#252238]">
        {title}
      </Text>

      {action && onPress ? (
        <Pressable onPress={onPress} hitSlop={10}>
          <Text className="text-xs font-bold text-[#6958D8]">
            {action}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}

function DetailRow({
  icon,
  label,
  value,
  last = false,
}: {
  icon: IconName;
  label: string;
  value: string;
  last?: boolean;
}) {
  return (
    <>
      <View className="flex-row items-center gap-3 py-3.5">
        <View className="h-10 w-10 items-center justify-center rounded-[13px] bg-[#EFECFF]">
          <Feather name={icon} size={17} color={PURPLE} />
        </View>

        <View className="min-w-0 flex-1 gap-1">
          <Text className="text-[11px] text-[#858196]">{label}</Text>
          <Text className="text-[13px] font-bold leading-5 text-[#252238]">
            {value || 'Not provided'}
          </Text>
        </View>
      </View>

      {!last && <View className="ml-[52px] h-px bg-[#EEECF4]" />}
    </>
  );
}

function Field({
  icon,
  label,
  value,
  onChange,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
}: {
  icon: IconName;
  label: string;
  value: string;
  onChange: (value: string) => void;
  keyboardType?: 'default' | 'email-address' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words';
}) {
  return (
    <View className="flex-row items-center gap-3 py-3">
      <View className="h-10 w-10 items-center justify-center rounded-[13px] bg-[#EFECFF]">
        <Feather name={icon} size={17} color={PURPLE} />
      </View>

      <View className="min-w-0 flex-1 gap-1">
        <Text className="text-[11px] text-[#858196]">{label}</Text>
        <TextInput
          value={value}
          onChangeText={onChange}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          placeholder={`Enter ${label.toLowerCase()}`}
          placeholderTextColor="#A6A3B3"
          selectionColor={PURPLE}
          className="border-b border-[#E8E3F6] py-2 text-[13px] text-[#252238]"
        />
      </View>
    </View>
  );
}

function MenuRow({
  icon,
  title,
  subtitle,
  onPress,
  danger = false,
}: {
  icon: IconName;
  title: string;
  subtitle: string;
  onPress: () => void;
  danger?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      className="flex-row items-center gap-3 py-3.5 active:opacity-60"
    >
      <View
        className={`h-10 w-10 items-center justify-center rounded-[13px] ${
          danger ? 'bg-[#FFF0F1]' : 'bg-[#EFECFF]'
        }`}
      >
        <Feather
          name={icon}
          size={18}
          color={danger ? '#D94B55' : PURPLE}
        />
      </View>

      <View className="min-w-0 flex-1 gap-1">
        <Text
          className={`text-xs font-bold ${
            danger ? 'text-[#D94B55]' : 'text-[#252238]'
          }`}
        >
          {title}
        </Text>
        <Text className="text-[10px] leading-4 text-[#858196]">
          {subtitle}
        </Text>
      </View>

      <Feather name="chevron-right" size={18} color="#A6A3B3" />
    </Pressable>
  );
}

export default function StudentProfileScreen() {
  const [student, setStudent] = useState(INITIAL_STUDENT);
  const [draft, setDraft] = useState(INITIAL_STUDENT);
  const [editing, setEditing] = useState(false);
  const [showAcademic, setShowAcademic] = useState(false);

  const [notifications, setNotifications] = useState({
    timetable: true,
    announcements: true,
    attendance: true,
    events: false,
  });

  const [privacy, setPrivacy] = useState({
    showEmail: false,
    showPhone: false,
  });

  const updateDraft = (key: keyof Student, value: string) => {
    setDraft(previous => ({ ...previous, [key]: value }));
  };

  const startEditing = () => {
    setDraft({ ...student });
    setEditing(true);
  };

  const cancelEditing = () => {
    setDraft({ ...student });
    setEditing(false);
  };

  const saveProfile = () => {
    const name = draft.name.trim();
    const email = draft.email.trim().toLowerCase();
    const phone = draft.phone.trim();

    if (!name || !email) {
      Alert.alert(
        'Required information',
        'Please enter your name and email address.',
      );
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      Alert.alert('Invalid email', 'Enter a valid email address.');
      return;
    }

    if (phone && !/^[+()\d\s-]{7,20}$/.test(phone)) {
      Alert.alert('Invalid phone', 'Check the phone number and try again.');
      return;
    }

    const updated = { ...draft, name, email, phone };
    setStudent(updated);
    setDraft(updated);
    setEditing(false);

    Alert.alert(
      'Profile updated',
      'Changes are applied locally. Connect your backend to save them permanently.',
    );
  };

  const shareStudentId = async () => {
    try {
      await Share.share({
        message: `My CampusOS student ID is ${STUDENT_ID}.`,
      });
    } catch {
      Alert.alert('Student ID', STUDENT_ID);
    }
  };

  const shareProfile = async () => {
    const lines = [
      'CampusOS Student Profile',
      `Name: ${student.name}`,
      `Student ID: ${STUDENT_ID}`,
      `Course: ${student.course}`,
      `Department: ${student.department}`,
      `Year: ${student.year}`,
      `Section: ${student.section}`,
    ];

    if (privacy.showEmail) lines.push(`Email: ${student.email}`);
    if (privacy.showPhone && student.phone) {
      lines.push(`Phone: ${student.phone}`);
    }

    try {
      await Share.share({ message: lines.join('\n') });
    } catch {
      Alert.alert('Sharing unavailable', 'Please try again.');
    }
  };

  const showAccountInfo = () => {
    Alert.alert(
      'Account information',
      [
        `Student ID: ${STUDENT_ID}`,
        `Role: ${student.role}`,
        `Admission year: ${student.admissionYear}`,
        `Campus: ${student.campus}`,
        '',
        'Student ID and academic identifiers are read-only.',
      ].join('\n'),
    );
  };

  const openSupport = async () => {
    try {
      await Linking.openURL(
        'mailto:support@campus.edu?subject=CampusOS%20Support',
      );
    } catch {
      Alert.alert(
        'Campus support',
        'Contact your college administrator for help.',
      );
    }
  };

  const confirmLogout = () => {
    Alert.alert(
      'Log out of CampusOS?',
      'You will need to sign in again to access your account.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log out',
          style: 'destructive',
          onPress: () => {
            // Clear your authentication session before navigating.
            router.replace('/login' as never);
          },
        },
      ],
    );
  };

  const attendanceColor =
    ATTENDANCE.percentage >= 75 ? GREEN : '#C77A35';

  return (
    <SafeAreaView
      className="flex-1 bg-white"
      edges={['top', 'left', 'right']}
    >
      <StatusBar barStyle="dark-content"  />

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerClassName="px-[21px] pt-3.5"
            contentContainerStyle={{ paddingBottom:100 }}
        >
          {/* Header */}
          <View className="mb-6 flex-row items-center justify-between">
            <View>
              <View className="mb-3.5 flex-row items-center gap-2">
                <View className="h-[25px] w-[25px] items-center justify-center rounded-lg bg-[#6958D8]">
                  <Feather name="layers" size={15} color="#FFFFFF" />
                </View>
                <Text className="text-[10px] font-black tracking-[2px] text-[#6958D8]">
                  CAMPUSOS
                </Text>
              </View>

              <Text className="text-[30px] font-extrabold text-[#252238]">
                My profile
              </Text>
              <Text className="mt-1 text-xs text-[#858196]">
                Everything about your campus life.
              </Text>
            </View>

            <Pressable
              onPress={editing ? cancelEditing : startEditing}
              accessibilityLabel={editing ? 'Cancel editing' : 'Edit profile'}
              className="h-[46px] w-[46px] items-center justify-center rounded-[15px] border border-[#EEECF4] bg-[#F7F6FC] active:opacity-60"
            >
              <Feather
                name={editing ? 'x' : 'edit-3'}
                size={19}
                color="#252238"
              />
            </Pressable>
          </View>

          {/* Student identity */}
          <View className="mb-7 rounded-[25px] border border-[#ECE8FA] bg-[#FAF9FF] p-[18px]">
            <View className="flex-row items-center gap-[15px]">
              <View className="relative">
                <Image
                  source={{
                    uri: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=faces',
                  }}
                  className="h-[83px] w-[83px] rounded-[25px] border-[3px] border-white bg-[#EFECFF]"
                />

                <View className="absolute -bottom-1 -right-1 h-[23px] w-[23px] items-center justify-center rounded-full border-[3px] border-[#FAF9FF] bg-[#6958D8]">
                  <Feather name="check" size={10} color="#FFFFFF" />
                </View>
              </View>

              <View className="min-w-0 flex-1">
                {editing ? (
                  <TextInput
                    value={draft.name}
                    onChangeText={value => updateDraft('name', value)}
                    placeholder="Full name"
                    placeholderTextColor="#A6A3B3"
                    maxLength={80}
                    className="rounded-[10px] border border-[#EEECF4] bg-white p-2 text-[15px] font-bold text-[#252238]"
                  />
                ) : (
                  <Text className="text-[19px] font-extrabold text-[#252238]">
                    {student.name}
                  </Text>
                )}

                <Text className="mt-1 text-xs text-[#858196]">
                  {student.role}
                </Text>

                <View className="mt-2.5 flex-row items-center gap-1.5 self-start rounded-full bg-[#EAF8F1] px-2.5 py-1.5">
                  <View className="h-1.5 w-1.5 rounded-full bg-[#23966D]" />
                  <Text className="text-[10px] font-bold text-[#23966D]">
                    Student account
                  </Text>
                </View>
              </View>
            </View>

            <View className="my-[18px] h-px bg-[#E9E5F3]" />

            <Pressable
              onPress={shareStudentId}
              accessibilityRole="button"
              className="flex-row items-center gap-3 active:opacity-60"
            >
              <View className="h-[39px] w-[39px] items-center justify-center rounded-[13px] bg-[#EFECFF]">
                <Feather name="credit-card" size={18} color={PURPLE} />
              </View>

              <View className="flex-1">
                <Text className="text-[9px] font-extrabold tracking-[1.1px] text-[#858196]">
                  STUDENT IDENTIFICATION
                </Text>
                <Text className="mt-1 text-[13px] font-extrabold text-[#252238]">
                  {STUDENT_ID}
                </Text>
              </View>

              <Feather name="share" size={17} color={PURPLE} />
            </Pressable>
          </View>

          {/* Academic overview */}
          <SectionTitle title="Academic overview" />

          <View className="mb-7 flex-row gap-2.5">
            {[
              {
                icon: 'book-open' as IconName,
                value: student.year.replace(' Year', ''),
                label: 'Academic year',
                bg: 'bg-[#EFECFF]',
                color: PURPLE,
              },
              {
                icon: 'users' as IconName,
                value: student.section.replace('Section ', ''),
                label: 'Section',
                bg: 'bg-[#EAF8F1]',
                color: GREEN,
              },
              {
                icon: 'calendar' as IconName,
                value: student.semester.replace('Semester ', 'S'),
                label: 'Semester',
                bg: 'bg-[#FFF3E8]',
                color: '#C77A35',
              },
            ].map(item => (
              <View
                key={item.label}
                className="min-w-0 flex-1 rounded-[18px] border border-[#EEECF4] bg-white p-3"
              >
                <View
                  className={`mb-3.5 h-[35px] w-[35px] items-center justify-center rounded-xl ${item.bg}`}
                >
                  <Feather name={item.icon} size={18} color={item.color} />
                </View>
                <Text className="text-lg font-extrabold text-[#252238]">
                  {item.value}
                </Text>
                <Text className="mt-1 text-[10px] text-[#858196]">
                  {item.label}
                </Text>
              </View>
            ))}
          </View>

          {/* Attendance */}
          <SectionTitle
            title="Attendance snapshot"
            action="View details"
            onPress={() =>
              Alert.alert(
                'Attendance overview',
                `Attended classes: ${ATTENDANCE.attended}\nTotal classes: ${ATTENDANCE.total}\nAttendance: ${ATTENDANCE.percentage}%\n\nConnect your attendance API to display live records.`,
              )
            }
          />

          <View className="mb-7 rounded-[21px] border border-[#EEECF4] bg-white p-4">
            <View className="flex-row items-center gap-2.5">
              <View className="h-[39px] w-[39px] items-center justify-center rounded-[13px] bg-[#EFECFF]">
                <Feather name="activity" size={19} color={PURPLE} />
              </View>

              <View className="min-w-0 flex-1">
                <Text className="text-[13px] font-bold text-[#252238]">
                  Overall attendance
                </Text>
                <Text className="mt-1 text-[10px] text-[#858196]">
                  {ATTENDANCE.attended} of {ATTENDANCE.total} classes attended
                </Text>
              </View>

              <Text
                style={{ color: attendanceColor }}
                className="text-[21px] font-extrabold"
              >
                {ATTENDANCE.percentage}%
              </Text>
            </View>

            <View className="mt-[19px] h-[7px] overflow-hidden rounded-full bg-[#EFEDF5]">
              <View
                className="h-full rounded-full"
                style={{
                  width: `${ATTENDANCE.percentage}%`,
                  backgroundColor: attendanceColor,
                }}
              />
            </View>

            <View className="mt-3 flex-row items-center justify-between">
              <View className="flex-row items-center gap-1.5">
                <View
                  style={{ backgroundColor: attendanceColor }}
                  className="h-[7px] w-[7px] rounded-full"
                />
                <Text className="text-[11px] text-[#858196]">
                  {ATTENDANCE.percentage >= 75
                    ? 'On track'
                    : 'Needs attention'}
                </Text>
              </View>
              <Text className="text-[11px] text-[#858196]">
                Target: 75%
              </Text>
            </View>
          </View>

          {/* Academic information */}
          <SectionTitle
            title="Academic information"
            action={showAcademic ? 'Show less' : 'Show all'}
            onPress={() => setShowAcademic(value => !value)}
          />

          <View className="mb-7 rounded-[20px] border border-[#EEECF4] bg-white px-3.5">
            <DetailRow
              icon="book-open"
              label="Degree / course"
              value={student.course}
            />
            <DetailRow
              icon="layers"
              label="Department"
              value={student.department}
            />
            <DetailRow
              icon="calendar"
              label="Academic year"
              value={student.year}
            />

            {showAcademic ? (
              <>
                <DetailRow icon="book" label="Semester" value={student.semester} />
                <DetailRow icon="users" label="Class / section" value={student.section} />
                <DetailRow icon="user-check" label="Faculty mentor" value={student.mentor} />
                <DetailRow icon="map-pin" label="Campus" value={student.campus} />
                <DetailRow icon="calendar" label="Admission year" value={student.admissionYear} />
                <DetailRow icon="heart" label="Blood group" value={student.bloodGroup} />
              </>
            ) : null}

            <Pressable
              onPress={showAccountInfo}
              className="flex-row items-center gap-2 border-t border-[#EEECF4] py-3.5 active:opacity-60"
            >
              <Feather name="info" size={15} color={PURPLE} />
              <Text className="flex-1 text-[11px] font-bold text-[#6958D8]">
                View student account information
              </Text>
              <Feather name="chevron-right" size={16} color={PURPLE} />
            </Pressable>
          </View>

          {/* Personal information */}
          <SectionTitle
            title="Personal information"
            action={editing ? 'Cancel' : 'Edit details'}
            onPress={editing ? cancelEditing : startEditing}
          />

          <View className="mb-7 rounded-[20px] border border-[#EEECF4] bg-white px-3.5">
            {editing ? (
              <>
                <Field
                  icon="user"
                  label="Full name"
                  value={draft.name}
                  onChange={value => updateDraft('name', value)}
                />

                <View className="ml-[52px] h-px bg-[#EEECF4]" />

                <Field
                  icon="mail"
                  label="Email address"
                  value={draft.email}
                  onChange={value => updateDraft('email', value)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />

                <View className="ml-[52px] h-px bg-[#EEECF4]" />

                <Field
                  icon="phone"
                  label="Phone number"
                  value={draft.phone}
                  onChange={value => updateDraft('phone', value)}
                  keyboardType="phone-pad"
                />

                <View className="flex-row gap-2.5 py-3">
                  <Pressable
                    onPress={cancelEditing}
                    className="h-[47px] flex-1 items-center justify-center rounded-[14px] border border-[#EEECF4] active:opacity-60"
                  >
                    <Text className="text-xs font-bold text-[#858196]">
                      Cancel
                    </Text>
                  </Pressable>

                  <Pressable
                    onPress={saveProfile}
                    className="h-[47px] flex-[1.5] flex-row items-center justify-center gap-2 rounded-[14px] bg-[#6958D8] active:opacity-80"
                  >
                    <Feather name="check" size={17} color="#FFFFFF" />
                    <Text className="text-xs font-bold text-white">
                      Save changes
                    </Text>
                  </Pressable>
                </View>
              </>
            ) : (
              <>
                <DetailRow
                  icon="mail"
                  label="Email address"
                  value={student.email}
                />
                <DetailRow
                  icon="phone"
                  label="Phone number"
                  value={student.phone}
                  last
                />
              </>
            )}
          </View>

          {/* Notification preferences */}
          <SectionTitle title="Notification preferences" />

          <View className="mb-7 rounded-[20px] border border-[#EEECF4] bg-white px-3.5">
            {(
              [
                ['timetable', 'Timetable reminders', 'Class time alerts'],
                ['announcements', 'Campus announcements', 'College updates'],
                ['attendance', 'Attendance alerts', 'Attendance reminders'],
                ['events', 'Campus events', 'Activities and events'],
              ] as const
            ).map(([key, title, subtitle], index) => (
              <View key={key}>
                {index > 0 ? <View className="h-px bg-[#EEECF4]" /> : null}

                <View className="flex-row items-center gap-3 py-3.5">
                  <View className="min-w-0 flex-1 gap-1">
                    <Text className="text-xs font-bold text-[#252238]">
                      {title}
                    </Text>
                    <Text className="text-[10px] text-[#858196]">
                      {subtitle}
                    </Text>
                  </View>

                  <Switch
                    value={notifications[key]}
                    onValueChange={value =>
                      setNotifications(previous => ({
                        ...previous,
                        [key]: value,
                      }))
                    }
                    trackColor={{ false: '#E6E3EF', true: '#C8C0FA' }}
                    thumbColor={notifications[key] ? PURPLE : '#FFFFFF'}
                  />
                </View>
              </View>
            ))}

            <Text className="pb-3.5 text-[10px] leading-4 text-[#858196]">
              Preferences are stored locally until connected to your notification service.
            </Text>
          </View>

          {/* Privacy and sharing */}
          <SectionTitle title="Privacy & sharing" />

          <View className="mb-7 rounded-[20px] border border-[#EEECF4] bg-white px-3.5">
            {(
              [
                ['showEmail', 'mail', 'Include email when sharing', 'Control shared profile details'],
                ['showPhone', 'phone', 'Include phone when sharing', 'Keep your number private by default'],
              ] as const
            ).map(([key, icon, title, subtitle], index) => (
              <View key={key}>
                {index > 0 ? <View className="h-px bg-[#EEECF4]" /> : null}

                <View className="flex-row items-center gap-3 py-3.5">
                  <View className="h-10 w-10 items-center justify-center rounded-[13px] bg-[#EFECFF]">
                    <Feather name={icon} size={17} color={PURPLE} />
                  </View>

                  <View className="min-w-0 flex-1 gap-1">
                    <Text className="text-xs font-bold text-[#252238]">
                      {title}
                    </Text>
                    <Text className="text-[10px] text-[#858196]">
                      {subtitle}
                    </Text>
                  </View>

                  <Switch
                    value={privacy[key]}
                    onValueChange={value =>
                      setPrivacy(previous => ({
                        ...previous,
                        [key]: value,
                      }))
                    }
                    trackColor={{ false: '#E6E3EF', true: '#C8C0FA' }}
                    thumbColor={privacy[key] ? PURPLE : '#FFFFFF'}
                  />
                </View>
              </View>
            ))}

            <Pressable
              onPress={shareProfile}
              className="mb-3.5 mt-1 flex-row items-center justify-center gap-2 rounded-[13px] bg-[#EFECFF] py-3 active:opacity-70"
            >
              <Feather name="share-2" size={16} color="#5142B9" />
              <Text className="text-xs font-bold text-[#5142B9]">
                Share student profile
              </Text>
            </Pressable>
          </View>

          {/* Account and support */}
          <SectionTitle title="Account & support" />

          <View className="mb-[18px] rounded-[21px] border border-[#EEECF4] bg-white px-3.5">
            <MenuRow
              icon="bell"
              title="Notification settings"
              subtitle="Manage your preferences"
              onPress={() =>
                Alert.alert(
                  'Notification preferences',
                  'Use the switches in the Notification preferences section to update your choices.',
                )
              }
            />

            <View className="ml-[53px] h-px bg-[#EEECF4]" />

            <MenuRow
              icon="shield"
              title="Account & privacy"
              subtitle="View your account details"
              onPress={showAccountInfo}
            />

            <View className="ml-[53px] h-px bg-[#EEECF4]" />

            <MenuRow
              icon="help-circle"
              title="Help & support"
              subtitle="Contact the campus support team"
              onPress={openSupport}
            />

            <View className="ml-[53px] h-px bg-[#EEECF4]" />

            <MenuRow
              icon="info"
              title="About CampusOS"
              subtitle="Version 1.0.0"
              onPress={() =>
                Alert.alert(
                  'CampusOS',
                  'Your campus, all in one place.\n\nVersion 1.0.0',
                )
              }
            />
          </View>

          {/* Logout */}
          <Pressable
            onPress={confirmLogout}
            className="flex-row items-center gap-3 rounded-[18px] border border-[#F6E3E5] bg-[#FFFCFC] p-3.5 active:opacity-60"
          >
            <View className="h-[39px] w-[39px] items-center justify-center rounded-[13px] bg-[#FFF0F1]">
              <Feather name="log-out" size={18} color="#D94B55" />
            </View>

            <Text className="flex-1 text-[13px] font-bold text-[#D94B55]">
              Log out
            </Text>

            <Feather name="arrow-up-right" size={17} color="#D94B55" />
          </Pressable>

          {/* Footer */}
          <View className="mt-7 items-center">
            <View className="mb-[18px] h-px w-full bg-[#EEECF4]" />

            <View className="flex-row items-center gap-2">
              <Feather name="layers" size={13} color="#A6A3B3" />
              <Text className="text-[9px] font-extrabold tracking-[1.8px] text-[#A6A3B3]">
                MADE FOR CAMPUS LIFE
              </Text>
            </View>

            <Text className="mt-2 text-[9px] tracking-widest text-[#A6A3B3]">
              CAMPUSOS · VERSION 1.0.0
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
