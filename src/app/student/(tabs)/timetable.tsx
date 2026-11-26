import React, { useMemo, useState } from 'react';
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

type UserRole = 'lecturer' | 'class_representative' | 'student';
type ClassType = 'Lecture' | 'Lab' | 'Tutorial';
type FilterType = 'All' | ClassType;

type TimetableClass = {
  id: string;
  day: number;
  subject: string;
  start: string;
  end: string;
  faculty: string;
  room: string;
  type: ClassType;
};

type DayItem = {
  date: Date;
  key: string;
  weekday: number;
};

type BreakItem = {
  start: string;
  end: string;
  title: string;
  subtitle: string;
};

const USER_ROLE: UserRole = 'student';

const canManageTimetable = (role: UserRole) =>
  role === 'lecturer' || role === 'class_representative';

const C = {
  background: '#F7F9FD',
  surface: '#FFFFFF',
  surfaceSoft: '#F1F4FB',
  border: '#E5EAF5',
  text: '#172344',
  secondary: '#7582A0',
  muted: '#A1ABC0',
  primary: '#5969EF',
  primaryDark: '#4555DA',
  primaryLight: '#ECEFFF',
  teal: '#159B98',
  tealLight: '#E4F7F5',
  orange: '#E38B35',
  orangeLight: '#FFF1E3',
  purple: '#8A65E8',
  purpleLight: '#F0EAFF',
  greyLight: '#EEF2F8',
  green: '#209C79',
};

const PALETTE: Record<
  ClassType,
  { color: string; background: string; icon: 'book-open' | 'monitor' | 'users' }
> = {
  Lecture: {
    color: C.purple,
    background: C.purpleLight,
    icon: 'book-open',
  },
  Lab: {
    color: C.teal,
    background: C.tealLight,
    icon: 'monitor',
  },
  Tutorial: {
    color: C.orange,
    background: C.orangeLight,
    icon: 'users',
  },
};

const WEEKDAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

const FILTERS: FilterType[] = ['All', 'Lecture', 'Lab', 'Tutorial'];

const INITIAL_CLASSES: TimetableClass[] = [
  { id: 'c1', day: 0, subject: 'Data Structures', start: '09:00', end: '10:00', faculty: 'Dr. Priya Sharma', room: 'Room 204', type: 'Lecture' },
  { id: 'c2', day: 0, subject: 'Database Systems', start: '10:15', end: '11:15', faculty: 'Prof. Arjun Kumar', room: 'Lab 02', type: 'Lab' },
  { id: 'c3', day: 0, subject: 'Computer Networks', start: '11:30', end: '12:30', faculty: 'Dr. Meera Nair', room: 'Room 108', type: 'Lecture' },
  { id: 'c4', day: 0, subject: 'Operating Systems', start: '13:30', end: '14:30', faculty: 'Prof. Rahul', room: 'Room 301', type: 'Tutorial' },
  { id: 'c5', day: 1, subject: 'Software Engineering', start: '09:00', end: '10:00', faculty: 'Dr. Kavitha', room: 'Room 105', type: 'Lecture' },
  { id: 'c6', day: 1, subject: 'Java Programming', start: '10:15', end: '12:15', faculty: 'Prof. Arjun Kumar', room: 'Lab 01', type: 'Lab' },
  { id: 'c7', day: 1, subject: 'Mathematics', start: '13:30', end: '14:30', faculty: 'Dr. Suresh', room: 'Room 202', type: 'Lecture' },
  { id: 'c8', day: 2, subject: 'Computer Networks', start: '09:00', end: '10:00', faculty: 'Dr. Meera Nair', room: 'Room 108', type: 'Lecture' },
  { id: 'c9', day: 2, subject: 'Data Structures', start: '10:15', end: '12:15', faculty: 'Dr. Priya Sharma', room: 'Lab 03', type: 'Lab' },
  { id: 'c10', day: 2, subject: 'Database Systems', start: '13:30', end: '14:30', faculty: 'Prof. Arjun Kumar', room: 'Room 204', type: 'Tutorial' },
  { id: 'c11', day: 3, subject: 'Operating Systems', start: '09:00', end: '10:00', faculty: 'Prof. Rahul', room: 'Room 301', type: 'Lecture' },
  { id: 'c12', day: 3, subject: 'Java Programming', start: '10:15', end: '12:15', faculty: 'Prof. Arjun Kumar', room: 'Lab 01', type: 'Lab' },
  { id: 'c13', day: 3, subject: 'Software Engineering', start: '13:30', end: '14:30', faculty: 'Dr. Kavitha', room: 'Room 105', type: 'Lecture' },
  { id: 'c14', day: 4, subject: 'Database Systems', start: '09:00', end: '10:00', faculty: 'Prof. Arjun Kumar', room: 'Room 204', type: 'Lecture' },
  { id: 'c15', day: 4, subject: 'Computer Networks', start: '10:15', end: '12:15', faculty: 'Dr. Meera Nair', room: 'Lab 02', type: 'Lab' },
  { id: 'c16', day: 4, subject: 'Mathematics', start: '13:30', end: '14:30', faculty: 'Dr. Suresh', room: 'Room 202', type: 'Tutorial' },
  { id: 'c17', day: 5, subject: 'Project Work', start: '09:00', end: '11:00', faculty: 'Project Mentor', room: 'Project Lab', type: 'Lab' },
  { id: 'c18', day: 5, subject: 'Library / Study', start: '11:15', end: '12:15', faculty: 'Library Session', room: 'Central Library', type: 'Tutorial' },
];

const BREAKS: Record<number, BreakItem[]> = {
  0: [
    { start: '10:00', end: '10:15', title: 'Short break', subtitle: '15 minutes' },
    { start: '11:15', end: '11:30', title: 'Short break', subtitle: '15 minutes' },
    { start: '12:30', end: '13:30', title: 'Lunch break', subtitle: '1 hour' },
  ],
  1: [
    { start: '10:00', end: '10:15', title: 'Short break', subtitle: '15 minutes' },
    { start: '12:15', end: '13:30', title: 'Lunch break', subtitle: '1 hour 15 minutes' },
  ],
  2: [
    { start: '10:00', end: '10:15', title: 'Short break', subtitle: '15 minutes' },
    { start: '12:15', end: '13:30', title: 'Lunch break', subtitle: '1 hour 15 minutes' },
  ],
  3: [
    { start: '10:00', end: '10:15', title: 'Short break', subtitle: '15 minutes' },
    { start: '12:15', end: '13:30', title: 'Lunch break', subtitle: '1 hour 15 minutes' },
  ],
  4: [
    { start: '10:00', end: '10:15', title: 'Short break', subtitle: '15 minutes' },
    { start: '12:15', end: '13:30', title: 'Lunch break', subtitle: '1 hour 15 minutes' },
  ],
  5: [
    { start: '11:00', end: '11:15', title: 'Short break', subtitle: '15 minutes' },
  ],
  6: [],
};

const pad = (value: number) => String(value).padStart(2, '0');

function dateKey(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function getWeekDays(): DayItem[] {
  const today = new Date();

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + index,
    );

    return {
      date,
      key: dateKey(date),
      weekday: (date.getDay() + 6) % 7,
    };
  });
}

function formatTime(time: string) {
  const [hourText, minutes] = time.split(':');
  const hour = Number(hourText);
  return `${hour % 12 || 12}:${minutes} ${hour >= 12 ? 'PM' : 'AM'}`;
}

function formatDate(date: Date) {
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function formatShortDate(date: Date) {
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
  });
}

function SectionHeading({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <View style={{ gap: 4, flex: 1 }}>
      <Text style={{ fontSize: 18, fontWeight: '800', color: C.text, letterSpacing: -0.5 }}>
        {title}
      </Text>
      {!!subtitle && (
        <Text style={{ fontSize: 12, color: C.secondary, lineHeight: 17 }}>
          {subtitle}
        </Text>
      )}
    </View>
  );
}

function IconBox({
  name,
  color,
  background,
  size = 44,
}: {
  name: React.ComponentProps<typeof Feather>['name'];
  color: string;
  background: string;
  size?: number;
}) {
  return (
    <View
      style={{
        height: size,
        width: size,
        borderRadius: size * 0.34,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: background,
      }}
    >
      <Feather name={name} size={size * 0.44} color={color} />
    </View>
  );
}

function ClassCard({
  item,
  canEdit,
  onDelete,
}: {
  item: TimetableClass;
  canEdit: boolean;
  onDelete: (id: string) => void;
}) {
  const palette = PALETTE[item.type];

  return (
    <View style={{ flexDirection: 'row', gap: 10, marginBottom: 12 }}>
      <View style={{ width: 60, paddingTop: 8 }}>
        <Text style={{ fontSize: 12, color: C.text, fontWeight: '800' }}>
          {formatTime(item.start)}
        </Text>
        <Text style={{ marginTop: 5, color: C.secondary, fontSize: 11 }}>
          {formatTime(item.end)}
        </Text>
      </View>

      <View
        style={{
          width: 3,
          borderRadius: 4,
          backgroundColor: palette.color,
        }}
      />

      <View
        style={{
          flex: 1,
          backgroundColor: C.surface,
          borderRadius: 19,
          padding: 13,
          borderWidth: 1,
          borderColor: C.border,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 11,
        }}
      >
        <IconBox name={palette.icon} color={palette.color} background={palette.background} />

        <View style={{ flex: 1, gap: 5 }}>
          <Text style={{ fontSize: 13, color: C.text, fontWeight: '800', lineHeight: 18 }}>
            {item.subject}
          </Text>

          <Text style={{ fontSize: 11, color: C.secondary }}>
            {item.faculty || 'Faculty not specified'}
          </Text>

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
            <Feather name="map-pin" size={11} color={C.secondary} />
            <Text style={{ color: C.secondary, fontSize: 10 }}>
              {item.room || 'Room not set'}
            </Text>
          </View>
        </View>

        <View style={{ alignItems: 'flex-end', justifyContent: 'space-between', alignSelf: 'stretch' }}>
          <View
            style={{
              backgroundColor: palette.background,
              paddingHorizontal: 9,
              paddingVertical: 5,
              borderRadius: 9,
            }}
          >
            <Text style={{ color: palette.color, fontSize: 10, fontWeight: '800' }}>
              {item.type}
            </Text>
          </View>

          {canEdit && (
            <Pressable
              hitSlop={8}
              accessibilityLabel={`Remove ${item.subject}`}
              onPress={() =>
                Alert.alert('Remove class?', `Remove ${item.subject} from this timetable?`, [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Remove', style: 'destructive', onPress: () => onDelete(item.id) },
                ])
              }
              style={{ padding: 4 }}
            >
              <Feather name="more-vertical" size={17} color={C.secondary} />
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
}

function BreakCard({ item }: { item: BreakItem }) {
  return (
    <View style={{ flexDirection: 'row', gap: 10, marginBottom: 12 }}>
      <View style={{ width: 60, paddingTop: 8 }}>
        <Text style={{ fontSize: 11, color: C.secondary, fontWeight: '700' }}>
          {formatTime(item.start)}
        </Text>
        <Text style={{ marginTop: 5, fontSize: 10, color: C.muted }}>
          {formatTime(item.end)}
        </Text>
      </View>

      <View style={{ width: 3, borderRadius: 4, backgroundColor: '#D8DFED' }} />

      <View
        style={{
          flex: 1,
          borderRadius: 17,
          backgroundColor: C.surfaceSoft,
          borderWidth: 1,
          borderColor: C.border,
          paddingHorizontal: 12,
          paddingVertical: 10,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 11,
        }}
      >
        <IconBox name="coffee" color={C.secondary} background="#FFFFFF" size={38} />
        <View style={{ flex: 1, gap: 4 }}>
          <Text style={{ color: C.text, fontSize: 12, fontWeight: '800' }}>
            {item.title}
          </Text>
          <Text style={{ color: C.secondary, fontSize: 10 }}>{item.subtitle}</Text>
        </View>
        <View style={{ backgroundColor: '#E4EAF5', paddingHorizontal: 9, paddingVertical: 5, borderRadius: 8 }}>
          <Text style={{ color: C.secondary, fontSize: 10, fontWeight: '700' }}>Break</Text>
        </View>
      </View>
    </View>
  );
}

const fieldLabel = {
  fontSize: 10,
  fontWeight: '800' as const,
  color: C.secondary,
  letterSpacing: 0.8,
  marginBottom: 8,
  marginTop: 13,
};

const inputStyle = {
  height: 49,
  borderWidth: 1,
  borderColor: C.border,
  borderRadius: 14,
  paddingHorizontal: 13,
  fontSize: 13,
  color: C.text,
  backgroundColor: C.background,
};

export default function StudentTimetableScreen() {
  const [days] = useState<DayItem[]>(() => getWeekDays());
  const [selectedKey, setSelectedKey] = useState(() => dateKey(new Date()));
  const [classes, setClasses] = useState<TimetableClass[]>(INITIAL_CLASSES);
  const [filter, setFilter] = useState<FilterType>('All');
  const [modalVisible, setModalVisible] = useState(false);

  const [subject, setSubject] = useState('');
  const [start, setStart] = useState('15:00');
  const [end, setEnd] = useState('16:00');
  const [faculty, setFaculty] = useState('');
  const [room, setRoom] = useState('');
  const [type, setType] = useState<ClassType>('Lecture');

  const canEditTimetable = canManageTimetable(USER_ROLE);
  const todayKey = dateKey(new Date());

  const selectedDay = days.find((day) => day.key === selectedKey) ?? days[0];
  const selectedWeekday = selectedDay.weekday;
  const isToday = selectedKey === todayKey;

  const allDayClasses = useMemo(
    () =>
      classes
        .filter((item) => item.day === selectedWeekday)
        .sort((a, b) => a.start.localeCompare(b.start)),
    [classes, selectedWeekday],
  );

  const dayClasses = useMemo(
    () => allDayClasses.filter((item) => filter === 'All' || item.type === filter),
    [allDayClasses, filter],
  );

  const dayBreaks = useMemo(
    () => BREAKS[selectedWeekday] ?? [],
    [selectedWeekday],
  );

  const timeline = useMemo(() => {
    const items: (
      | { kind: 'class'; start: string; item: TimetableClass }
      | { kind: 'break'; start: string; item: BreakItem }
    )[] = [
      ...dayClasses.map((item) => ({ kind: 'class' as const, start: item.start, item })),
      ...(filter === 'All'
        ? dayBreaks.map((item) => ({ kind: 'break' as const, start: item.start, item }))
        : []),
    ];

    return items.sort((a, b) => a.start.localeCompare(b.start));
  }, [dayClasses, dayBreaks, filter]);

  function selectDay(day: DayItem) {
    if (day.key < dateKey(new Date())) return;
    setSelectedKey(day.key);
    setFilter('All');
  }

  function goToToday() {
    setSelectedKey(dateKey(new Date()));
    setFilter('All');
  }

  function resetForm() {
    setSubject('');
    setStart('15:00');
    setEnd('16:00');
    setFaculty('');
    setRoom('');
    setType('Lecture');
  }

  function addClass() {
    if (!canEditTimetable) {
      Alert.alert('Permission denied', 'Only lecturers and class representatives can add classes.');
      return;
    }

    if (!subject.trim()) {
      Alert.alert('Subject required', 'Please enter a subject name.');
      return;
    }

    const timePattern = /^([01]\d|2[0-3]):[0-5]\d$/;

    if (!timePattern.test(start) || !timePattern.test(end)) {
      Alert.alert('Invalid time', 'Enter time in 24-hour format, for example 09:30 or 14:00.');
      return;
    }

    if (start >= end) {
      Alert.alert('Check your timing', 'The end time must be later than the start time.');
      return;
    }

    const overlaps = classes.some(
      (item) =>
        item.day === selectedWeekday &&
        start < item.end &&
        end > item.start,
    );

    if (overlaps) {
      Alert.alert('Time conflict', 'This class overlaps another scheduled class.');
      return;
    }

    const newClass: TimetableClass = {
      id: `class-${Date.now()}`,
      day: selectedWeekday,
      subject: subject.trim(),
      start,
      end,
      faculty: faculty.trim() || 'Faculty not specified',
      room: room.trim() || 'Room not set',
      type,
    };

    setClasses((previous) => [...previous, newClass]);
    setFilter('All');
    setModalVisible(false);
    resetForm();
  }

  function deleteClass(id: string) {
    if (!canEditTimetable) return;
    setClasses((previous) => previous.filter((item) => item.id !== id));
  }

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: C.background }}
      edges={['top', 'left', 'right']}
    >
      <StatusBar barStyle="dark-content" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom:100 }}
      >
        {/* Header */}
        <View
          style={{
            paddingHorizontal: 21,
            paddingTop: 12,
            paddingBottom: 23,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 }}>
            <View
              style={{
                height: 50,
                width: 50,
                borderRadius: 17,
                backgroundColor: C.primary,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Feather name="book-open" size={23} color="#FFFFFF" />
            </View>

            <View style={{ gap: 4, flex: 1 }}>
              <Text style={{ fontSize: 10, fontWeight: '800', letterSpacing: 2, color: C.secondary }}>
                CAMPUSOS
              </Text>
              <Text style={{ fontSize: 23, fontWeight: '900', color: C.text, letterSpacing: -0.8 }}>
                My Timetable
              </Text>
            </View>
          </View>

          <Pressable
            onPress={goToToday}
            style={{
              backgroundColor: C.primaryLight,
              borderRadius: 14,
              paddingHorizontal: 13,
              paddingVertical: 11,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 7,
            }}
          >
            <Feather name="calendar" size={15} color={C.primary} />
            <Text style={{ color: C.primary, fontSize: 12, fontWeight: '800' }}>Today</Text>
          </Pressable>
        </View>

        {/* Week selector */}
        <View style={{ paddingBottom: 23 }}>
          <View
            style={{
              paddingHorizontal: 21,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 14,
            }}
          >
            <SectionHeading title="Your week" subtitle="Swipe to explore your days" />
            <View style={{ alignItems: 'flex-end', gap: 4 }}>
              <Feather name="calendar" size={15} color={C.secondary} />
              <Text style={{ fontSize: 10, color: C.secondary }}>
                {formatShortDate(days[0].date)} – {formatShortDate(days[6].date)}
              </Text>
            </View>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 21, gap: 8 }}
          >
            {days.map((day) => {
              const selected = day.key === selectedKey;
              const today = day.key === todayKey;
              const count = classes.filter((item) => item.day === day.weekday).length;

              return (
                <Pressable
                  key={day.key}
                  onPress={() => selectDay(day)}
                  style={{
                    width: 54,
                    paddingVertical: 13,
                    borderRadius: 17,
                    alignItems: 'center',
                    backgroundColor: selected ? C.primary : C.surface,
                    borderWidth: selected ? 0 : 1,
                    borderColor: C.border,
                    shadowColor: selected ? C.primary : '#27385C',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: selected ? 0.17 : 0.035,
                    shadowRadius: 9,
                    elevation: selected ? 3 : 1,
                  }}
                >
                  <Text style={{ color: selected ? '#FFFFFF' : C.secondary, fontSize: 10, fontWeight: '800' }}>
                    {day.date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase()}
                  </Text>

                  <Text style={{ marginTop: 9, fontSize: 18, fontWeight: '900', color: selected ? '#FFFFFF' : C.text }}>
                    {day.date.getDate()}
                  </Text>

                  <View
                    style={{
                      marginTop: 9,
                      height: 5,
                      width: 5,
                      borderRadius: 5,
                      backgroundColor: selected ? '#FFFFFF' : today ? C.primary : count > 0 ? '#B7BFFB' : 'transparent',
                    }}
                  />
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* Daily overview */}
        <View style={{ paddingHorizontal: 21, marginBottom: 25 }}>
          <View
            style={{
              borderRadius: 24,
              padding: 19,
              backgroundColor: '#EAF0FF',
              borderWidth: 1,
              borderColor: '#E0E8FF',
              overflow: 'hidden',
            }}
          >
            <View
              style={{
                position: 'absolute',
                width: 135,
                height: 135,
                borderRadius: 70,
                backgroundColor: '#DCE5FF',
                right: -30,
                top: -35,
              }}
            />

            <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <View style={{ flex: 1, gap: 9 }}>
                <View
                  style={{
                    alignSelf: 'flex-start',
                    backgroundColor: '#D8E1FF',
                    borderRadius: 9,
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                  }}
                >
                  <Text style={{ color: C.primaryDark, fontSize: 10, fontWeight: '900', letterSpacing: 0.8 }}>
                    {isToday ? 'TODAY AT A GLANCE' : 'DAILY OVERVIEW'}
                  </Text>
                </View>

                <Text style={{ color: C.text, fontSize: 20, fontWeight: '900', letterSpacing: -0.6 }}>
                  {selectedDay.date.toLocaleDateString('en-US', { weekday: 'long' })}
                </Text>
                <Text style={{ color: C.secondary, fontSize: 12 }}>
                  {formatDate(selectedDay.date)}
                </Text>
              </View>

              <View
                style={{
                  height: 48,
                  width: 48,
                  borderRadius: 17,
                  backgroundColor: '#DCE5FF',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginLeft: 10,
                }}
              >
                <Feather name="calendar" size={23} color={C.primary} />
              </View>
            </View>

            <View style={{ flexDirection: 'row', gap: 10, marginTop: 19 }}>
              <View
                style={{
                  flex: 1,
                  backgroundColor: '#FFFFFF',
                  borderRadius: 16,
                  padding: 13,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                <IconBox name="book-open" color={C.primary} background={C.primaryLight} size={37} />
                <View style={{ gap: 3 }}>
                  <Text style={{ color: C.text, fontSize: 20, fontWeight: '900' }}>
                    {allDayClasses.length}
                  </Text>
                  <Text style={{ color: C.secondary, fontSize: 10 }}>Classes</Text>
                </View>
              </View>

              <View
                style={{
                  flex: 1,
                  backgroundColor: '#FFFFFF',
                  borderRadius: 16,
                  padding: 13,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                <IconBox name="coffee" color={C.teal} background={C.tealLight} size={37} />
                <View style={{ gap: 3 }}>
                  <Text style={{ color: C.text, fontSize: 20, fontWeight: '900' }}>
                    {dayBreaks.length}
                  </Text>
                  <Text style={{ color: C.secondary, fontSize: 10 }}>Breaks</Text>
                </View>
              </View>
            </View>

            {allDayClasses[0] ? (
              <View
                style={{
                  marginTop: 11,
                  backgroundColor: '#FFFFFF',
                  borderRadius: 15,
                  padding: 12,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                <IconBox name="clock" color={C.primary} background={C.primaryLight} size={36} />
                <View style={{ flex: 1, gap: 3 }}>
                  <Text style={{ color: C.secondary, fontSize: 9, fontWeight: '800', letterSpacing: 0.8 }}>
                    FIRST CLASS
                  </Text>
                  <Text style={{ color: C.text, fontSize: 12, fontWeight: '800' }}>
                    {allDayClasses[0].subject}
                  </Text>
                </View>
                <Text style={{ color: C.primary, fontSize: 11, fontWeight: '900' }}>
                  {formatTime(allDayClasses[0].start)}
                </Text>
              </View>
            ) : (
              <Text style={{ color: C.secondary, fontSize: 12, marginTop: 15 }}>
                No classes scheduled. Enjoy your free day!
              </Text>
            )}
          </View>
        </View>

        {/* Schedule title */}
        <View
          style={{
            paddingHorizontal: 21,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 14,
          }}
        >
          <SectionHeading
            title="Class schedule"
            subtitle={`${selectedDay.date.toLocaleDateString('en-US', { weekday: 'short' })}, ${formatDate(selectedDay.date)}`}
          />

          {canEditTimetable && (
            <Pressable
              onPress={() => setModalVisible(true)}
              style={{
                backgroundColor: C.primary,
                paddingHorizontal: 13,
                paddingVertical: 11,
                borderRadius: 13,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <Feather name="plus" size={16} color="#FFFFFF" />
              <Text style={{ color: '#FFFFFF', fontWeight: '800', fontSize: 11 }}>Add class</Text>
            </Pressable>
          )}
        </View>

        {/* Filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 21, gap: 8, paddingBottom: 18 }}
        >
          {FILTERS.map((item) => {
            const active = filter === item;
            const palette = item === 'All' ? null : PALETTE[item];

            return (
              <Pressable
                key={item}
                onPress={() => setFilter(item)}
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 10,
                  borderRadius: 13,
                  backgroundColor: active
                    ? item === 'All'
                      ? C.primary
                      : palette!.background
                    : C.surface,
                  borderWidth: 1,
                  borderColor: active ? (palette?.background ?? C.primary) : C.border,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 7,
                }}
              >
                {item !== 'All' && (
                  <Feather
                    name={PALETTE[item].icon}
                    size={14}
                    color={active ? PALETTE[item].color : C.secondary}
                  />
                )}
                <Text
                  style={{
                    fontSize: 11,
                    fontWeight: '800',
                    color: active ? (palette?.color ?? '#FFFFFF') : C.secondary,
                  }}
                >
                  {item}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Timeline */}
        <View style={{ paddingHorizontal: 21 }}>
          {timeline.length > 0 ? (
            timeline.map((entry) =>
              entry.kind === 'class' ? (
                <ClassCard
                  key={`class-${entry.item.id}`}
                  item={entry.item}
                  canEdit={canEditTimetable}
                  onDelete={deleteClass}
                />
              ) : (
                <BreakCard
                  key={`break-${entry.item.start}-${entry.item.title}`}
                  item={entry.item}
                />
              ),
            )
          ) : (
            <View
              style={{
                padding: 28,
                borderRadius: 22,
                backgroundColor: C.surface,
                alignItems: 'center',
                borderWidth: 1,
                borderColor: C.border,
              }}
            >
              <IconBox name="coffee" color={C.primary} background={C.primaryLight} size={60} />

              <Text style={{ fontSize: 16, fontWeight: '900', color: C.text, marginTop: 15 }}>
                Nothing scheduled
              </Text>
              <Text
                style={{
                  marginTop: 7,
                  fontSize: 12,
                  color: C.secondary,
                  textAlign: 'center',
                  lineHeight: 19,
                }}
              >
                No classes match this filter. Try another filter
                {canEditTimetable ? ' or add a class.' : '.'}
              </Text>

              <Pressable onPress={() => setFilter('All')} style={{ marginTop: 15, padding: 8 }}>
                <Text style={{ color: C.primary, fontWeight: '800', fontSize: 12 }}>
                  Show all classes
                </Text>
              </Pressable>
            </View>
          )}
        </View>

        {/* Footer */}
        <View
          style={{
            marginTop: 8,
            marginHorizontal: 21,
            padding: 15,
            borderRadius: 17,
            borderWidth: 1,
            borderColor: C.border,
            backgroundColor: C.surface,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 11,
          }}
        >
          <IconBox name="info" color={C.primary} background={C.primaryLight} size={40} />
          <View style={{ flex: 1, gap: 4 }}>
            <Text style={{ color: C.text, fontSize: 12, fontWeight: '800' }}>
              Stay ahead of your day
            </Text>
            <Text style={{ color: C.secondary, fontSize: 11, lineHeight: 16 }}>
              Check your timetable before heading to class.
            </Text>
          </View>
          <Feather name="chevron-right" size={17} color={C.primary} />
        </View>
      </ScrollView>

      {/* Add class modal — lecturers and class representatives only */}
      {canEditTimetable && (
        <Modal
          visible={modalVisible}
          transparent
          animationType="slide"
          statusBarTranslucent
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={{ flex: 1, backgroundColor: 'rgba(20,30,60,0.40)', justifyContent: 'flex-end' }}>
            <Pressable style={{ flex: 1 }} onPress={() => setModalVisible(false)} />

            <View
              style={{
                backgroundColor: '#FFFFFF',
                borderTopLeftRadius: 28,
                borderTopRightRadius: 28,
                paddingHorizontal: 22,
                paddingTop: 12,
                paddingBottom: 30,
                maxHeight: '90%',
              }}
            >
              <View
                style={{
                  alignSelf: 'center',
                  height: 4,
                  width: 42,
                  borderRadius: 5,
                  backgroundColor: '#DFE4EF',
                  marginBottom: 20,
                }}
              />

              <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 7,
                  }}
                >
                  <Text style={{ fontSize: 23, color: C.text, fontWeight: '900', letterSpacing: -0.7 }}>
                    Add a class
                  </Text>

                  <Pressable
                    onPress={() => setModalVisible(false)}
                    hitSlop={8}
                    style={{ padding: 9, borderRadius: 12, backgroundColor: C.surfaceSoft }}
                  >
                    <Feather name="x" size={18} color={C.text} />
                  </Pressable>
                </View>

                <Text style={{ color: C.secondary, fontSize: 12, marginBottom: 20 }}>
                  {WEEKDAYS[selectedWeekday]} · {formatDate(selectedDay.date)}
                </Text>

                <Text style={fieldLabel}>SUBJECT NAME *</Text>
                <TextInput
                  value={subject}
                  onChangeText={setSubject}
                  placeholder="e.g. Data Structures"
                  placeholderTextColor={C.muted}
                  style={inputStyle}
                  autoCapitalize="words"
                />

                <View style={{ flexDirection: 'row', gap: 12 }}>
                  <View style={{ flex: 1 }}>
                    <Text style={fieldLabel}>START TIME *</Text>
                    <TextInput
                      value={start}
                      onChangeText={setStart}
                      placeholder="09:00"
                      placeholderTextColor={C.muted}
                      style={inputStyle}
                      keyboardType="numbers-and-punctuation"
                      maxLength={5}
                    />
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text style={fieldLabel}>END TIME *</Text>
                    <TextInput
                      value={end}
                      onChangeText={setEnd}
                      placeholder="10:00"
                      placeholderTextColor={C.muted}
                      style={inputStyle}
                      keyboardType="numbers-and-punctuation"
                      maxLength={5}
                    />
                  </View>
                </View>

                <Text style={fieldLabel}>FACULTY NAME</Text>
                <TextInput
                  value={faculty}
                  onChangeText={setFaculty}
                  placeholder="e.g. Dr. Priya Sharma"
                  placeholderTextColor={C.muted}
                  style={inputStyle}
                  autoCapitalize="words"
                />

                <Text style={fieldLabel}>ROOM / LAB</Text>
                <TextInput
                  value={room}
                  onChangeText={setRoom}
                  placeholder="e.g. Room 204"
                  placeholderTextColor={C.muted}
                  style={inputStyle}
                  autoCapitalize="words"
                />

                <Text style={fieldLabel}>CLASS TYPE</Text>
                <View style={{ flexDirection: 'row', gap: 8, marginBottom: 22 }}>
                  {(['Lecture', 'Lab', 'Tutorial'] as ClassType[]).map((item) => {
                    const active = type === item;
                    const palette = PALETTE[item];

                    return (
                      <Pressable
                        key={item}
                        onPress={() => setType(item)}
                        style={{
                          flex: 1,
                          paddingVertical: 13,
                          alignItems: 'center',
                          borderRadius: 13,
                          backgroundColor: active ? palette.background : '#FFFFFF',
                          borderWidth: 1,
                          borderColor: active ? palette.color : C.border,
                        }}
                      >
                        <Text style={{ fontSize: 11, fontWeight: '800', color: active ? palette.color : C.secondary }}>
                          {item}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>

                <Pressable
                  onPress={addClass}
                  style={{
                    backgroundColor: C.primary,
                    paddingVertical: 16,
                    borderRadius: 15,
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'row',
                    gap: 8,
                  }}
                >
                  <Feather name="check" size={17} color="#FFFFFF" />
                  <Text style={{ color: '#FFFFFF', fontWeight: '900', fontSize: 14 }}>
                    Save class
                  </Text>
                </Pressable>

                <Text style={{ textAlign: 'center', color: C.secondary, fontSize: 10, marginTop: 12 }}>
                  Use 24-hour time, for example 09:00 or 14:30.
                </Text>
              </ScrollView>
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
}
