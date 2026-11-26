
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
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as DocumentPicker from 'expo-document-picker';
import { router } from 'expo-router';

const C = {
  navy: '#202B49',
  blue: '#6478E8',
  blueDark: '#5064D5',
  muted: '#8992A6',
  border: '#E9EDF5',
  bg: '#F7F9FD',
  white: '#FFFFFF',
  green: '#259B78',
  orange: '#D99035',
  red: '#DC626B',
  purple: '#9277D6',
  paleBlue: '#EEF1FF',
  paleGreen: '#EAF8F1',
  paleOrange: '#FFF5E8',
  paleRed: '#FFF0F0',
  palePurple: '#F3EFFF',
};

type LeaveStatus = 'Pending' | 'Approved' | 'Rejected';

type LeaveRequest = {
  id: string;
  type: string;
  from: string;
  to: string;
  days: number;
  reason: string;
  submitted: string;
  status: LeaveStatus;
  document?: string;
  remarks?: string;
  reviewedBy?: string;
  contact?: string;
  halfDay?: boolean;
};

const leaveTypes = [
  { name: 'Medical Leave', icon: 'medkit-outline' as const, description: 'For illness, treatment or medical recovery.', color: C.red, tint: C.paleRed },
  { name: 'Personal Leave', icon: 'person-outline' as const, description: 'For personal commitments and important work.', color: C.blue, tint: C.paleBlue },
  { name: 'Family Function', icon: 'people-outline' as const, description: 'For family events and ceremonies.', color: C.purple, tint: C.palePurple },
  { name: 'Emergency Leave', icon: 'alert-circle-outline' as const, description: 'For urgent or unexpected situations.', color: C.orange, tint: C.paleOrange },
  { name: 'On Duty', icon: 'briefcase-outline' as const, description: 'For approved academic or institutional activities.', color: C.green, tint: C.paleGreen },
  { name: 'Other', icon: 'calendar-outline' as const, description: 'For other leave requirements.', color: C.muted, tint: C.bg },
];

const initialRequests: LeaveRequest[] = [
  {
    id: 'LV20261101',
    type: 'Medical Leave',
    from: '2026-11-02',
    to: '2026-11-03',
    days: 2,
    reason: 'Not feeling well and need rest.',
    submitted: '01 Nov 2026',
    status: 'Approved',
    document: 'medical_certificate.pdf',
    remarks: 'Leave approved. Take care.',
    reviewedBy: 'Dr. Priya Sharma',
    contact: '9876543210',
  },
  {
    id: 'LV20261028',
    type: 'Personal Leave',
    from: '2026-11-10',
    to: '2026-11-10',
    days: 1,
    reason: 'Personal work at home.',
    submitted: '28 Oct 2026',
    status: 'Pending',
    contact: '9876543210',
  },
  {
    id: 'LV20261015',
    type: 'Family Function',
    from: '2026-10-20',
    to: '2026-10-21',
    days: 2,
    reason: 'Attending an important family function.',
    submitted: '15 Oct 2026',
    status: 'Rejected',
    remarks: 'Please coordinate with your class mentor.',
    reviewedBy: 'Dr. Priya Sharma',
  },
];

const pad = (value: number) => String(value).padStart(2, '0');

const toDateString = (date: Date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

const parseDate = (value: string) => {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day);
};

const formatDate = (date: Date) =>
  date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

const formatMonth = (date: Date) =>
  date.toLocaleDateString('en-IN', {
    month: 'long',
    year: 'numeric',
  });

const calculateDays = (from: Date, to: Date) =>
  Math.round(
    (new Date(to.getFullYear(), to.getMonth(), to.getDate()).getTime() -
      new Date(from.getFullYear(), from.getMonth(), from.getDate()).getTime()) /
      86400000,
  ) + 1;

const todayAtMidnight = () => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
};

const getStatusStyle = (status: LeaveStatus) => {
  if (status === 'Approved') return { color: C.green, bg: C.paleGreen };
  if (status === 'Rejected') return { color: C.red, bg: C.paleRed };
  return { color: C.orange, bg: C.paleOrange };
};

function CustomCalendar({
  visible,
  value,
  minimumDate,
  onClose,
  onSelect,
}: {
  visible: boolean;
  value: Date;
  minimumDate: Date;
  onClose: () => void;
  onSelect: (date: Date) => void;
}) {
  const [month, setMonth] = useState(
    () => new Date(value.getFullYear(), value.getMonth(), 1),
  );

  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  const firstDay = new Date(year, monthIndex, 1).getDay();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

  const calendarDays = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ];

  const previousMonth = () => {
    setMonth(new Date(year, monthIndex - 1, 1));
  };

  const nextMonth = () => {
    setMonth(new Date(year, monthIndex + 1, 1));
  };

  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View
        className="flex-1 justify-center px-5"
        style={{ backgroundColor: '#10182A99' }}
      >
        <View
          className="rounded-3xl p-5"
          style={{ backgroundColor: C.white }}
        >
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-lg font-extrabold" style={{ color: C.navy }}>
                Select a date
              </Text>
              <Text className="mt-1 text-xs" style={{ color: C.muted }}>
                Choose your leave date
              </Text>
            </View>
            <Pressable
              onPress={onClose}
              className="h-9 w-9 items-center justify-center rounded-full"
              style={{ backgroundColor: C.bg }}
            >
              <Ionicons name="close" size={20} color={C.navy} />
            </Pressable>
          </View>

          <View
            className="mt-5 rounded-2xl p-4"
            style={{ backgroundColor: C.paleBlue }}
          >
            <Text className="text-xs font-semibold" style={{ color: C.blue }}>
              SELECTED DATE
            </Text>
            <Text className="mt-1 text-xl font-extrabold" style={{ color: C.navy }}>
              {formatDate(value)}
            </Text>
          </View>

          <View className="mt-5 flex-row items-center justify-between">
            <Pressable
              onPress={previousMonth}
              className="h-10 w-10 items-center justify-center rounded-xl"
              style={{ backgroundColor: C.bg }}
            >
              <Ionicons name="chevron-back" size={20} color={C.navy} />
            </Pressable>

            <Text className="text-base font-extrabold" style={{ color: C.navy }}>
              {formatMonth(month)}
            </Text>

            <Pressable
              onPress={nextMonth}
              className="h-10 w-10 items-center justify-center rounded-xl"
              style={{ backgroundColor: C.bg }}
            >
              <Ionicons name="chevron-forward" size={20} color={C.navy} />
            </Pressable>
          </View>

          <View className="mt-5 flex-row">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <View key={day} className="flex-1 items-center">
                <Text className="text-xs font-bold" style={{ color: C.muted }}>
                  {day}
                </Text>
              </View>
            ))}
          </View>

          <View className="mt-3 flex-row flex-wrap">
            {calendarDays.map((day, index) => {
              if (day === null) {
                return <View key={`empty-${index}`} style={{ width: '14.2857%', height: 43 }} />;
              }

              const date = new Date(year, monthIndex, day);
              const disabled = date < minimumDate;
              const selected = isSameDay(date, value);
              const isToday = isSameDay(date, todayAtMidnight());

              return (
                <View
                  key={`${year}-${monthIndex}-${day}`}
                  style={{ width: '14.2857%', height: 43, padding: 2 }}
                >
                  <Pressable
                    disabled={disabled}
                    onPress={() => {
                      onSelect(date);
                      onClose();
                    }}
                    className="flex-1 items-center justify-center rounded-xl"
                    style={{
                      backgroundColor: selected ? C.blue : C.white,
                      borderWidth: isToday && !selected ? 1 : 0,
                      borderColor: C.blue,
                      opacity: disabled ? 0.3 : 1,
                    }}
                  >
                    <Text
                      className="text-sm font-bold"
                      style={{
                        color: selected ? C.white : disabled ? C.muted : C.navy,
                      }}
                    >
                      {day}
                    </Text>
                  </Pressable>
                </View>
              );
            })}
          </View>

          <View className="mt-4 flex-row items-center justify-between">
            <View className="flex-row items-center">
              <View className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: C.blue }} />
              <Text className="ml-2 text-xs" style={{ color: C.muted }}>
                Selected
              </Text>
            </View>
            <Text className="text-xs" style={{ color: C.muted }}>
              Past dates are disabled
            </Text>
          </View>

          <Pressable
            onPress={onClose}
            className="mt-5 items-center rounded-2xl p-4"
            style={{ backgroundColor: C.paleBlue }}
          >
            <Text className="text-sm font-bold" style={{ color: C.blue }}>
              Done
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

export default function StudentLeaveScreen() {
  const [requests, setRequests] = useState<LeaveRequest[]>(initialRequests);
  const [activeTab, setActiveTab] = useState<'All' | LeaveStatus>('All');
  const [search, setSearch] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);

  const [leaveType, setLeaveType] = useState('Medical Leave');
  const [reason, setReason] = useState('');
  const [contact, setContact] = useState('9876543210');
  const [fromDate, setFromDate] = useState(todayAtMidnight());
  const [toDate, setToDate] = useState(todayAtMidnight());
  const [halfDay, setHalfDay] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);

  const [showTypePicker, setShowTypePicker] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [dateTarget, setDateTarget] = useState<'from' | 'to'>('from');

  const pendingCount = requests.filter(r => r.status === 'Pending').length;
  const approvedCount = requests.filter(r => r.status === 'Approved').length;
  const rejectedCount = requests.filter(r => r.status === 'Rejected').length;

  const approvedDays = requests
    .filter(r => r.status === 'Approved')
    .reduce((sum, r) => sum + r.days, 0);

  // Sample leave balance for UI demonstration.
  const totalLeaveAllowance = 12;
  const usedLeave = approvedDays;
  const remainingLeave = Math.max(totalLeaveAllowance - usedLeave, 0);

  const duration = halfDay ? 0.5 : calculateDays(fromDate, toDate);

  const selectedLeaveType = leaveTypes.find(item => item.name === leaveType)!;

  const filteredRequests = useMemo(() => {
    return requests.filter(item => {
      const matchesTab = activeTab === 'All' || item.status === activeTab;
      const query = search.trim().toLowerCase();

      const matchesSearch =
        !query ||
        item.id.toLowerCase().includes(query) ||
        item.type.toLowerCase().includes(query) ||
        item.reason.toLowerCase().includes(query);

      return matchesTab && matchesSearch;
    });
  }, [requests, activeTab, search]);

  const resetForm = () => {
    setLeaveType('Medical Leave');
    setReason('');
    setContact('9876543210');
    setFromDate(todayAtMidnight());
    setToDate(todayAtMidnight());
    setHalfDay(false);
    setSelectedDocument(null);
    setShowTypePicker(false);
  };

  const openForm = () => {
    resetForm();
    setShowForm(true);
  };

  const openCalendar = (target: 'from' | 'to') => {
    setDateTarget(target);
    setShowCalendar(true);
  };

  const handleDateSelect = (date: Date) => {
    if (dateTarget === 'from') {
      setFromDate(date);
      if (date > toDate) setToDate(date);
    } else {
      setToDate(date);
    }
  };

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (!result.canceled && result.assets?.length) {
        setSelectedDocument(result.assets[0].name);
      }
    } catch {
      Alert.alert('Attachment error', 'Unable to select the document. Please try again.');
    }
  };

  const submitRequest = () => {
    if (!reason.trim() || reason.trim().length < 8) {
      Alert.alert('Reason required', 'Please provide at least 8 characters explaining your leave.');
      return;
    }

    if (contact.trim().length < 10) {
      Alert.alert('Invalid contact number', 'Enter a valid 10-digit contact number.');
      return;
    }

    if (toDate < fromDate) {
      Alert.alert('Invalid dates', 'End date cannot be earlier than start date.');
      return;
    }

    if (duration > remainingLeave && leaveType !== 'On Duty') {
      Alert.alert(
        'Leave balance notice',
        `Your sample remaining leave balance is ${remainingLeave} days. Your request is ${duration} days. You may still submit it for review, but it could require additional approval.`,
        [
          { text: 'Review dates', style: 'cancel' },
          { text: 'Submit anyway', onPress: createRequest },
        ],
      );
      return;
    }

    createRequest();
  };

  const createRequest = () => {
    const newRequest: LeaveRequest = {
      id: `LV${Date.now().toString().slice(-8)}`,
      type: leaveType,
      from: toDateString(fromDate),
      to: toDateString(toDate),
      days: duration,
      reason: reason.trim(),
      submitted: formatDate(new Date()),
      status: 'Pending',
      document: selectedDocument || undefined,
      contact: contact.trim(),
      halfDay,
    };

    setRequests(previous => [newRequest, ...previous]);
    setShowForm(false);
    setActiveTab('All');
    setSearch('');
    resetForm();

    Alert.alert(
      'Application submitted',
      `Your application ${newRequest.id} has been submitted and is awaiting faculty review.`,
    );
  };

  const withdrawRequest = (request: LeaveRequest) => {
    if (request.status !== 'Pending') return;

    Alert.alert(
      'Withdraw application?',
      `Are you sure you want to withdraw ${request.id}?`,
      [
        { text: 'Keep application', style: 'cancel' },
        {
          text: 'Withdraw',
          style: 'destructive',
          onPress: () => {
            setRequests(previous => previous.filter(item => item.id !== request.id));
            setShowDetails(false);
            setSelectedRequest(null);
          },
        },
      ],
    );
  };

  const openDetails = (request: LeaveRequest) => {
    setSelectedRequest(request);
    setShowDetails(true);
  };

  const renderStat = (
    title: string,
    value: string | number,
    icon: keyof typeof Ionicons.glyphMap,
    color: string,
    tint: string,
  ) => (
    <View
      className="flex-1 rounded-2xl p-3"
      style={{ backgroundColor: tint }}
    >
      <View className="h-9 w-9 items-center justify-center rounded-xl" style={{ backgroundColor: C.white }}>
        <Ionicons name={icon} size={19} color={color} />
      </View>
      <Text className="mt-3 text-2xl font-extrabold" style={{ color: C.navy }}>
        {value}
      </Text>
      <Text className="mt-1 text-xs font-medium" style={{ color: C.muted }}>
        {title}
      </Text>
    </View>
  );

  const renderRequestCard = (item: LeaveRequest) => {
    const status = getStatusStyle(item.status);

    return (
      <Pressable
        key={item.id}
        onPress={() => openDetails(item)}
        className="mb-3 rounded-3xl border p-4"
        style={{ backgroundColor: C.white, borderColor: C.border }}
      >
        <View className="flex-row items-center">
          <View className="h-11 w-11 items-center justify-center rounded-2xl" style={{ backgroundColor: C.paleBlue }}>
            <Ionicons name="document-text-outline" size={21} color={C.blue} />
          </View>
          <View className="ml-3 flex-1">
            <Text className="text-md font-extrabold" style={{ color: C.navy }}>
              {item.type}
            </Text>
            <Text className="mt-1 text-xs" style={{ color: C.muted }}>
              {item.id}
            </Text>
          </View>
          <View className="rounded-full px-3 py-2" style={{ backgroundColor: status.bg }}>
            <Text className="text-xs font-bold" style={{ color: status.color }}>
              {item.status}
            </Text>
          </View>
        </View>

        <View className="my-4 flex-row rounded-2xl p-3" style={{ backgroundColor: C.bg }}>
          <View className="flex-1">
            <Text className="text-xs" style={{ color: C.muted }}>From</Text>
            <Text className="mt-1 text-sm font-bold" style={{ color: C.navy }}>
              {formatDate(parseDate(item.from))}
            </Text>
          </View>
          <View className="flex-1">
            <Text className="text-xs" style={{ color: C.muted }}>To</Text>
            <Text className="mt-1 text-sm font-bold" style={{ color: C.navy }}>
              {formatDate(parseDate(item.to))}
            </Text>
          </View>
          <View>
            <Text className="text-xs" style={{ color: C.muted }}>Duration</Text>
            <Text className="mt-1 text-sm font-extrabold" style={{ color: C.blue }}>
              {item.days} {item.days === 0.5 ? 'Day' : 'Days'}
            </Text>
          </View>
        </View>

        <Text className="text-xs font-bold" style={{ color: C.muted }}>REASON</Text>
        <Text numberOfLines={2} className="mt-1 text-sm leading-5" style={{ color: C.navy }}>
          {item.reason}
        </Text>

        {item.status === 'Pending' && (
          <View className="mt-3 flex-row items-center rounded-xl p-3" style={{ backgroundColor: C.paleOrange }}>
            <Ionicons name="time-outline" size={17} color={C.orange} />
            <Text className="ml-2 text-xs font-semibold" style={{ color: C.orange }}>
              Waiting for faculty approval
            </Text>
          </View>
        )}

        {item.status === 'Rejected' && item.remarks && (
          <View className="mt-3 rounded-xl p-3" style={{ backgroundColor: C.paleRed }}>
            <Text className="text-xs font-bold" style={{ color: C.red }}>Faculty remarks</Text>
            <Text className="mt-1 text-xs leading-5" style={{ color: C.navy }}>
              {item.remarks}
            </Text>
          </View>
        )}

        <View className="mt-4 flex-row items-center justify-between">
          <Text className="text-xs" style={{ color: C.muted }}>
            Submitted {item.submitted}
          </Text>
          <View className="flex-row items-center">
            <Text className="mr-1 text-xs font-bold" style={{ color: C.blue }}>
              View details
            </Text>
            <Ionicons name="chevron-forward" size={15} color={C.blue} />
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: C.bg }}>
      <StatusBar barStyle="dark-content"  />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 35 }}>
        {/* HEADER */}
        <View className="px-5 pt-3">
          <View className="flex-row items-center justify-between">
            <Pressable
              onPress={() => router.back()}
              className="h-10 w-10 items-center justify-center rounded-xl border"
              style={{ backgroundColor: C.white, borderColor: C.border }}
            >
              <Ionicons name="arrow-back" size={21} color={C.navy} />
            </Pressable>

            <View className="flex-1 items-center">
              <Text className="text-xs font-extrabold tracking-widest" style={{ color: C.blue }}>
                CAMPUSOS
              </Text>
              <Text className="mt-1 text-base font-bold" style={{ color: C.navy }}>
                Student Services
              </Text>
            </View>

            <Pressable
              onPress={() =>
                Alert.alert(
                  'Leave request support',
                  'Contact your class mentor or department office for leave-related assistance.\n\nMentor: Dr. Priya Sharma\nEmail: support@campus.edu',
                )
              }
              className="h-10 w-10 items-center justify-center rounded-xl border"
              style={{ backgroundColor: C.white, borderColor: C.border }}
            >
              <Ionicons name="help-circle-outline" size={22} color={C.blue} />
            </Pressable>
          </View>

          <View className="mt-6">
            <Text className="text-2xl font-extrabold" style={{ color: C.navy }}>
              Leave Management
            </Text>
            <Text className="mt-1 text-sm" style={{ color: C.muted }}>
              Manage applications, leave balance and approval status.
            </Text>
          </View>
        </View>

        {/* STUDENT PROFILE */}
        <View className="mx-5 mt-5 overflow-hidden rounded-3xl">
          <LinearGradient
            colors={['#FFFFFF', '#EDF1FF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ padding: 18 }}
          >
            <View className="flex-row items-center">
              <View className="h-14 w-14 items-center justify-center rounded-2xl" style={{ backgroundColor: C.paleBlue }}>
                <Ionicons name="person" size={27} color={C.blue} />
              </View>
              <View className="ml-3 flex-1">
                <Text className="text-lg font-extrabold" style={{ color: C.navy }}>
                  Alex Johnson
                </Text>
                <Text className="mt-1 text-xs" style={{ color: C.muted }}>
                  B.Tech Computer Science
                </Text>
                <Text className="mt-1 text-xs font-bold" style={{ color: C.blue }}>
                  COS2025-0142
                </Text>
              </View>
              <View className="rounded-xl px-3 py-2" style={{ backgroundColor: C.white }}>
                <Text className="text-xs font-bold" style={{ color: C.green }}>STUDENT</Text>
              </View>
            </View>

            <View className="mt-4 flex-row border-t pt-3" style={{ borderColor: '#DFE5F5' }}>
              <View className="flex-1">
                <Text className="text-xs" style={{ color: C.muted }}>Semester</Text>
                <Text className="mt-1 text-sm font-bold" style={{ color: C.navy }}>5th</Text>
              </View>
              <View className="flex-1">
                <Text className="text-xs" style={{ color: C.muted }}>Section</Text>
                <Text className="mt-1 text-sm font-bold" style={{ color: C.navy }}>A</Text>
              </View>
              <View className="flex-1">
                <Text className="text-xs" style={{ color: C.muted }}>Class mentor</Text>
                <Text className="mt-1 text-sm font-bold" style={{ color: C.navy }}>Dr. Priya Sharma</Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* LEAVE BALANCE */}
        <View className="mx-5 mt-5">
          <View className="mb-3 flex-row items-center justify-between">
            <Text className="text-base font-extrabold" style={{ color: C.navy }}>
              Leave Balance
            </Text>
            <Text className="text-xs" style={{ color: C.muted }}>
              Sample academic allowance
            </Text>
          </View>

          <View className="rounded-3xl border p-4" style={{ backgroundColor: C.white, borderColor: C.border }}>
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-xs" style={{ color: C.muted }}>Available leave balance</Text>
                <View className="mt-1 flex-row items-baseline">
                  <Text className="text-3xl font-extrabold" style={{ color: C.navy }}>
                    {remainingLeave}
                  </Text>
                  <Text className="ml-2 text-sm" style={{ color: C.muted }}>
                    / {totalLeaveAllowance} days
                  </Text>
                </View>
              </View>
              <View className="h-12 w-12 items-center justify-center rounded-2xl" style={{ backgroundColor: C.paleGreen }}>
                <Ionicons name="calendar-outline" size={24} color={C.green} />
              </View>
            </View>

            <View className="mt-4 h-2.5 overflow-hidden rounded-full" style={{ backgroundColor: C.bg }}>
              <View
                className="h-full rounded-full"
                style={{
                  width: `${Math.min((usedLeave / totalLeaveAllowance) * 100, 100)}%`,
                  backgroundColor: C.blue,
                }}
              />
            </View>

            <View className="mt-3 flex-row justify-between">
              <Text className="text-xs" style={{ color: C.muted }}>
                Used: {usedLeave} days
              </Text>
              <Text className="text-xs font-bold" style={{ color: C.green }}>
                Remaining: {remainingLeave} days
              </Text>
            </View>

            <View className="mt-3 rounded-xl p-3" style={{ backgroundColor: C.paleOrange }}>
              <Text className="text-xs leading-5" style={{ color: C.orange }}>
                This is sample leave-balance information. Actual balances and eligibility should come from your college&apos;s leave policy.
              </Text>
            </View>
          </View>
        </View>

        {/* STATISTICS */}
        <View className="mx-5 mt-5">
          <Text className="mb-3 text-base font-extrabold" style={{ color: C.navy }}>
            Application Overview
          </Text>
          <View className="flex-row gap-2">
            {renderStat('Total requests', requests.length, 'document-text-outline', C.blue, C.paleBlue)}
            {renderStat('Approved', approvedCount, 'checkmark-circle-outline', C.green, C.paleGreen)}
          </View>
          <View className="mt-2 flex-row gap-2">
            {renderStat('Pending', pendingCount, 'time-outline', C.orange, C.paleOrange)}
            {renderStat('Rejected', rejectedCount, 'close-circle-outline', C.red, C.paleRed)}
          </View>
        </View>

        {/* APPLY BANNER */}
        <View className="mx-5 mt-5 overflow-hidden rounded-3xl">
          <LinearGradient
            colors={[C.blue, C.blueDark]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ padding: 19 }}
          >
            <View className="flex-row items-center">
              <View className="flex-1">
                <Text className="text-lg font-extrabold text-white">
                  Need time off?
                </Text>
                <Text className="mt-2 text-xs leading-5 text-white">
                  Submit your leave request with dates and supporting details.
                </Text>
                <Pressable
                  onPress={openForm}
                  className="mt-4 self-start flex-row items-center rounded-xl px-4 py-3"
                  style={{ backgroundColor: C.white }}
                >
                  <Ionicons name="add-circle-outline" size={19} color={C.blue} />
                  <Text className="ml-2 text-sm font-extrabold" style={{ color: C.blue }}>
                    New Leave Application
                  </Text>
                </Pressable>
              </View>
              <View className="ml-3 h-20 w-20 items-center justify-center rounded-full" style={{ backgroundColor: '#FFFFFF22' }}>
                <Ionicons name="calendar-outline" size={43} color={C.white} />
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* APPLICATIONS */}
        <View className="mx-5 mt-6">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-lg font-extrabold" style={{ color: C.navy }}>
                My Applications
              </Text>
              <Text className="mt-1 text-xs" style={{ color: C.muted }}>
                Track and manage your leave requests
              </Text>
            </View>
            <Text className="text-xs font-bold" style={{ color: C.blue }}>
              {filteredRequests.length} Records
            </Text>
          </View>

          <View className="mt-4 h-12 flex-row items-center rounded-2xl border px-3" style={{ backgroundColor: C.white, borderColor: C.border }}>
            <Ionicons name="search-outline" size={19} color={C.muted} />
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Search by type, ID or reason..."
              placeholderTextColor={C.muted}
              className="ml-2 flex-1 text-sm"
              style={{ color: C.navy }}
            />
            {search.length > 0 && (
              <Pressable onPress={() => setSearch('')}>
                <Ionicons name="close-circle" size={19} color={C.muted} />
              </Pressable>
            )}
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-4">
            {(['All', 'Pending', 'Approved', 'Rejected'] as const).map(tab => {
              const active = activeTab === tab;
              return (
                <Pressable
                  key={tab}
                  onPress={() => setActiveTab(tab)}
                  className="mr-2 rounded-full px-5 py-2.5"
                  style={{
                    backgroundColor: active ? C.blue : C.white,
                    borderWidth: 1,
                    borderColor: active ? C.blue : C.border,
                  }}
                >
                  <Text className="text-xs font-bold" style={{ color: active ? C.white : C.muted }}>
                    {tab}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          <View className="mt-4">
            {filteredRequests.length ? (
              filteredRequests.map(renderRequestCard)
            ) : (
              <View className="items-center rounded-3xl border px-5 py-10" style={{ backgroundColor: C.white, borderColor: C.border }}>
                <Ionicons name="document-text-outline" size={36} color={C.blue} />
                <Text className="mt-3 text-base font-bold" style={{ color: C.navy }}>
                  No applications found
                </Text>
                <Text className="mt-2 text-center text-xs leading-5" style={{ color: C.muted }}>
                  Try another search or submit a new leave application.
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* APPROVAL PROCESS */}
        <View className="mx-5 mt-3 rounded-3xl border p-4" style={{ backgroundColor: C.white, borderColor: C.border }}>
          <Text className="text-base font-extrabold" style={{ color: C.navy }}>
            Approval Process
          </Text>
          <Text className="my-1 mb-5 text-xs" style={{ color: C.muted }}>
            How your application is reviewed
          </Text>

          {[
            { title: 'Application submitted', description: 'Your leave request is recorded.', icon: 'paper-plane-outline' as const },
            { title: 'Faculty review', description: 'Your class mentor reviews the details.', icon: 'person-outline' as const },
            { title: 'Department approval', description: 'The department processes the request according to policy.', icon: 'business-outline' as const },
            { title: 'Final status', description: 'You can view the approval or rejection in your application history.', icon: 'checkmark-done-outline' as const },
          ].map((step, index) => (
            <View key={step.title} className="flex-row">
              <View className="items-center">
                <View className="h-9 w-9 items-center justify-center rounded-xl" style={{ backgroundColor: C.paleBlue }}>
                  <Ionicons name={step.icon} size={18} color={C.blue} />
                </View>
                {index !== 3 && <View className="my-1 h-7 w-px" style={{ backgroundColor: C.border }} />}
              </View>
              <View className="ml-3 flex-1 pb-4">
                <Text className="text-sm font-bold" style={{ color: C.navy }}>
                  {step.title}
                </Text>
                <Text className="mt-1 text-xs leading-5" style={{ color: C.muted }}>
                  {step.description}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* GUIDELINES */}
        <View className="mx-5 mt-4 rounded-3xl border p-4" style={{ backgroundColor: C.white, borderColor: C.border }}>
          <View className="flex-row items-center">
            <Ionicons name="information-circle-outline" size={21} color={C.blue} />
            <Text className="ml-2 text-sm font-extrabold" style={{ color: C.navy }}>
              Important Guidelines
            </Text>
          </View>
          {[
            'Apply as early as possible before your intended leave.',
            'Provide correct dates and a clear explanation.',
            'Attach medical documents when required.',
            'Check your application status regularly.',
            'Wait for approval before treating your leave as confirmed.',
          ].map((item, index) => (
            <View key={index} className="mt-3 flex-row items-start">
              <Ionicons name="checkmark-circle" size={17} color={C.green} />
              <Text className="ml-2 flex-1 text-xs leading-5" style={{ color: C.muted }}>
                {item}
              </Text>
            </View>
          ))}
        </View>

        {/* SUPPORT */}
        <Pressable
          onPress={() =>
            Alert.alert(
              'Student Support',
              'Contact your class mentor or department office for assistance.\n\nMentor: Dr. Priya Sharma\nEmail: support@campus.edu',
            )
          }
          className="mx-5 mt-4 flex-row items-center rounded-2xl border p-4"
          style={{ backgroundColor: C.white, borderColor: C.border }}
        >
          <View className="h-11 w-11 items-center justify-center rounded-xl" style={{ backgroundColor: C.palePurple }}>
            <Ionicons name="headset-outline" size={22} color={C.purple} />
          </View>
          <View className="ml-3 flex-1">
            <Text className="text-sm font-bold" style={{ color: C.navy }}>
              Need assistance?
            </Text>
            <Text className="mt-1 text-xs" style={{ color: C.muted }}>
              Contact your mentor or department office
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={19} color={C.muted} />
        </Pressable>
      </ScrollView>

      {/* NEW APPLICATION MODAL */}
      <Modal
        visible={showForm}
        animationType="slide"
        transparent
        onRequestClose={() => setShowForm(false)}
      >
        <View className="flex-1 justify-end" style={{ backgroundColor: '#10182A88' }}>
          <View className="rounded-t-[30px] px-5 pt-5" style={{ backgroundColor: C.bg, maxHeight: '94%', paddingBottom: 25 }}>
            <View className="mb-4 flex-row items-center justify-between">
              <View>
                <Text className="text-xl font-extrabold" style={{ color: C.navy }}>
                  Apply for Leave
                </Text>
                <Text className="mt-1 text-xs" style={{ color: C.muted }}>
                  Complete the application details
                </Text>
              </View>
              <Pressable onPress={() => setShowForm(false)} className="h-10 w-10 items-center justify-center rounded-full" style={{ backgroundColor: C.white }}>
                <Ionicons name="close" size={21} color={C.navy} />
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* LEAVE TYPE */}
              <Text className="mb-2 text-xs font-bold" style={{ color: C.navy }}>
                LEAVE CATEGORY *
              </Text>
              <Pressable
                onPress={() => setShowTypePicker(!showTypePicker)}
                className="mb-3 flex-row items-center justify-between rounded-2xl border p-4"
                style={{ backgroundColor: C.white, borderColor: C.border }}
              >
                <View className="flex-row items-center">
                  <View className="h-9 w-9 items-center justify-center rounded-xl" style={{ backgroundColor: selectedLeaveType.tint }}>
                    <Ionicons name={selectedLeaveType.icon} size={19} color={selectedLeaveType.color} />
                  </View>
                  <View className="ml-3">
                    <Text className="text-sm font-bold" style={{ color: C.navy }}>
                      {leaveType}
                    </Text>
                    <Text className="mt-1 text-xs" style={{ color: C.muted }}>
                      Select your leave category
                    </Text>
                  </View>
                </View>
                <Ionicons name={showTypePicker ? 'chevron-up' : 'chevron-down'} size={19} color={C.muted} />
              </Pressable>

              {showTypePicker && (
                <View className="mb-4 rounded-2xl border p-2" style={{ backgroundColor: C.white, borderColor: C.border }}>
                  {leaveTypes.map(type => (
                    <Pressable
                      key={type.name}
                      onPress={() => {
                        setLeaveType(type.name);
                        setShowTypePicker(false);
                      }}
                      className="mb-1 flex-row items-center rounded-xl p-3"
                      style={{ backgroundColor: leaveType === type.name ? C.paleBlue : C.white }}
                    >
                      <View className="h-9 w-9 items-center justify-center rounded-xl" style={{ backgroundColor: type.tint }}>
                        <Ionicons name={type.icon} size={19} color={type.color} />
                      </View>
                      <View className="ml-3 flex-1">
                        <Text className="text-sm font-bold" style={{ color: C.navy }}>
                          {type.name}
                        </Text>
                        <Text className="mt-1 text-xs" style={{ color: C.muted }}>
                          {type.description}
                        </Text>
                      </View>
                      {leaveType === type.name && (
                        <Ionicons name="checkmark-circle" size={19} color={C.blue} />
                      )}
                    </Pressable>
                  ))}
                </View>
              )}

              {/* DATE SELECTION */}
              <Text className="mb-2 mt-3 text-xs font-bold" style={{ color: C.navy }}>
                LEAVE DATES *
              </Text>

              <View className="flex-row gap-2">
                <Pressable
                  onPress={() => openCalendar('from')}
                  className="flex-1 rounded-2xl border p-3"
                  style={{ backgroundColor: C.white, borderColor: C.border }}
                >
                  <Text className="text-xs" style={{ color: C.muted }}>START DATE</Text>
                  <View className="mt-2 flex-row items-center">
                    <Ionicons name="calendar-outline" size={17} color={C.blue} />
                    <Text className="ml-2 flex-1 text-sm font-bold" style={{ color: C.navy }}>
                      {formatDate(fromDate)}
                    </Text>
                  </View>
                  <Text className="mt-2 text-xs font-semibold" style={{ color: C.blue }}>
                    Change date
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() => openCalendar('to')}
                  className="flex-1 rounded-2xl border p-3"
                  style={{ backgroundColor: C.white, borderColor: C.border }}
                >
                  <Text className="text-xs" style={{ color: C.muted }}>END DATE</Text>
                  <View className="mt-2 flex-row items-center">
                    <Ionicons name="calendar-outline" size={17} color={C.blue} />
                    <Text className="ml-2 flex-1 text-sm font-bold" style={{ color: C.navy }}>
                      {formatDate(toDate)}
                    </Text>
                  </View>
                  <Text className="mt-2 text-xs font-semibold" style={{ color: C.blue }}>
                    Change date
                  </Text>
                </Pressable>
              </View>

              {/* HALF DAY */}
              <Pressable
                onPress={() => {
                  setHalfDay(!halfDay);
                  if (!halfDay) setToDate(fromDate);
                }}
                className="mt-3 flex-row items-center justify-between rounded-2xl border p-4"
                style={{ backgroundColor: C.white, borderColor: C.border }}
              >
                <View className="flex-row items-center">
                  <Ionicons name="time-outline" size={19} color={C.blue} />
                  <View className="ml-3">
                    <Text className="text-sm font-bold" style={{ color: C.navy }}>
                      Half-day leave
                    </Text>
                    <Text className="mt-1 text-xs" style={{ color: C.muted }}>
                      Request leave for half a day
                    </Text>
                  </View>
                </View>
                <View className="h-6 w-11 justify-center rounded-full px-1" style={{ backgroundColor: halfDay ? C.blue : '#D9DEEA' }}>
                  <View className="h-4 w-4 rounded-full" style={{ backgroundColor: C.white, alignSelf: halfDay ? 'flex-end' : 'flex-start' }} />
                </View>
              </Pressable>

              {halfDay && (
                <View className="mt-2 rounded-xl p-3" style={{ backgroundColor: C.paleOrange }}>
                  <Text className="text-xs leading-5" style={{ color: C.orange }}>
                    Half-day mode uses the selected start date. Confirm the applicable morning or afternoon session with your department.
                  </Text>
                </View>
              )}

              {/* DURATION */}
              <View className="mt-3 flex-row items-center justify-between rounded-2xl p-4" style={{ backgroundColor: C.paleBlue }}>
                <View className="flex-row items-center">
                  <Ionicons name="hourglass-outline" size={20} color={C.blue} />
                  <Text className="ml-2 text-sm font-semibold" style={{ color: C.navy }}>
                    Total leave duration
                  </Text>
                </View>
                <Text className="text-lg font-extrabold" style={{ color: C.blue }}>
                  {duration > 0 ? duration : 0} {duration === 1 ? 'Day' : 'Days'}
                </Text>
              </View>

              {/* REASON */}
              <Text className="mb-2 mt-5 text-xs font-bold" style={{ color: C.navy }}>
                REASON FOR LEAVE *
              </Text>
              <TextInput
                value={reason}
                onChangeText={setReason}
                placeholder="Explain why you need leave..."
                placeholderTextColor={C.muted}
                multiline
                textAlignVertical="top"
                maxLength={500}
                className="rounded-2xl border p-4 text-sm"
                style={{ backgroundColor: C.white, borderColor: C.border, color: C.navy, minHeight: 105 }}
              />
              <Text className="mt-1 text-right text-xs" style={{ color: C.muted }}>
                {reason.length}/500 characters
              </Text>

              {/* CONTACT */}
              <Text className="mb-2 mt-4 text-xs font-bold" style={{ color: C.navy }}>
                CONTACT NUMBER *
              </Text>
              <View className="flex-row items-center rounded-2xl border px-4" style={{ backgroundColor: C.white, borderColor: C.border }}>
                <Ionicons name="call-outline" size={19} color={C.blue} />
                <TextInput
                  value={contact}
                  onChangeText={value => setContact(value.replace(/[^0-9]/g, '').slice(0, 10))}
                  keyboardType="phone-pad"
                  placeholder="Enter contact number"
                  placeholderTextColor={C.muted}
                  maxLength={10}
                  className="ml-3 flex-1 py-4 text-sm"
                  style={{ color: C.navy }}
                />
              </View>

              {/* DOCUMENT */}
              <Text className="mb-2 mt-4 text-xs font-bold" style={{ color: C.navy }}>
                SUPPORTING DOCUMENT
              </Text>
              <Pressable
                onPress={pickDocument}
                className="flex-row items-center rounded-2xl border border-dashed p-4"
                style={{ backgroundColor: C.white, borderColor: C.blue }}
              >
                <View className="h-11 w-11 items-center justify-center rounded-xl" style={{ backgroundColor: C.paleBlue }}>
                  <Ionicons name="cloud-upload-outline" size={23} color={C.blue} />
                </View>
                <View className="ml-3 flex-1">
                  <Text className="text-sm font-bold" style={{ color: C.navy }}>
                    {selectedDocument ? 'Document attached' : 'Upload supporting document'}
                  </Text>
                  <Text className="mt-1 text-xs" numberOfLines={1} style={{ color: C.muted }}>
                    {selectedDocument || 'PDF or image file'}
                  </Text>
                </View>
                {selectedDocument ? (
                  <Pressable onPress={() => setSelectedDocument(null)}>
                    <Ionicons name="close-circle" size={21} color={C.red} />
                  </Pressable>
                ) : (
                  <Ionicons name="add-circle-outline" size={22} color={C.blue} />
                )}
              </Pressable>

              <Text className="mt-2 text-xs leading-5" style={{ color: C.muted }}>
                Attach relevant documents such as a medical certificate if required by your college.
              </Text>

              {/* DECLARATION */}
              <View className="mt-4 rounded-2xl p-3" style={{ backgroundColor: C.paleOrange }}>
                <View className="flex-row items-start">
                  <Ionicons name="information-circle-outline" size={19} color={C.orange} />
                  <Text className="ml-2 flex-1 text-xs leading-5" style={{ color: C.navy }}>
                    Submitting this application does not mean your leave is approved. Please wait for the official decision.
                  </Text>
                </View>
              </View>

              <Pressable onPress={submitRequest} className="mt-5 overflow-hidden rounded-2xl">
                <LinearGradient
                  colors={[C.blue, C.blueDark]}
                  style={{ padding: 16, alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }}
                >
                  <Ionicons name="paper-plane-outline" size={18} color={C.white} />
                  <Text className="ml-2 text-sm font-extrabold text-white">
                    Submit Application
                  </Text>
                </LinearGradient>
              </Pressable>

              <Pressable onPress={() => setShowForm(false)} className="mb-4 mt-3 items-center rounded-2xl p-3">
                <Text className="text-sm font-bold" style={{ color: C.muted }}>
                  Cancel
                </Text>
              </Pressable>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* CUSTOM CALENDAR */}
      <CustomCalendar
        key={showCalendar ? `${dateTarget}-${(dateTarget === 'from' ? fromDate : toDate).getTime()}` : 'closed'}
        visible={showCalendar}
        value={dateTarget === 'from' ? fromDate : toDate}
        minimumDate={dateTarget === 'from' ? todayAtMidnight() : fromDate}
        onClose={() => setShowCalendar(false)}
        onSelect={handleDateSelect}
      />

      {/* APPLICATION DETAILS */}
      <Modal
        visible={showDetails}
        transparent
        animationType="slide"
        onRequestClose={() => setShowDetails(false)}
      >
        <View className="flex-1 justify-end" style={{ backgroundColor: '#10182A88' }}>
          <View className="rounded-t-[30px] px-5 pt-5" style={{ backgroundColor: C.bg, maxHeight: '88%', paddingBottom: 30 }}>
            <View className="mb-5 flex-row items-center justify-between">
              <View>
                <Text className="text-xl font-extrabold" style={{ color: C.navy }}>
                  Application Details
                </Text>
                <Text className="mt-1 text-xs" style={{ color: C.muted }}>
                  Full leave request information
                </Text>
              </View>
              <Pressable onPress={() => setShowDetails(false)} className="h-10 w-10 items-center justify-center rounded-full" style={{ backgroundColor: C.white }}>
                <Ionicons name="close" size={21} color={C.navy} />
              </Pressable>
            </View>

            {selectedRequest && (
              <ScrollView showsVerticalScrollIndicator={false}>
                <View className="rounded-3xl border p-4" style={{ backgroundColor: C.white, borderColor: C.border }}>
                  <View className="flex-row items-center justify-between">
                    <Text className="flex-1 text-base font-extrabold" style={{ color: C.navy }}>
                      {selectedRequest.type}
                    </Text>
                    <View className="rounded-full px-3 py-2" style={{ backgroundColor: getStatusStyle(selectedRequest.status).bg }}>
                      <Text className="text-xs font-bold" style={{ color: getStatusStyle(selectedRequest.status).color }}>
                        {selectedRequest.status}
                      </Text>
                    </View>
                  </View>
                  <Text className="mt-2 text-xs" style={{ color: C.muted }}>
                    ID: {selectedRequest.id}
                  </Text>

                  <View className="my-4 border-t" style={{ borderColor: C.border }} />

                  {[
                    ['Application ID', selectedRequest.id],
                    ['Submitted on', selectedRequest.submitted],
                    ['Leave category', selectedRequest.type],
                    ['Start date', formatDate(parseDate(selectedRequest.from))],
                    ['End date', formatDate(parseDate(selectedRequest.to))],
                    ['Duration', `${selectedRequest.days} Days`],
                    ['Contact number', selectedRequest.contact || 'Not provided'],
                  ].map(([label, value]) => (
                    <View key={label} className="mb-4 flex-row justify-between">
                      <Text className="text-xs" style={{ color: C.muted }}>{label}</Text>
                      <Text className="ml-3 flex-1 text-right text-xs font-bold" style={{ color: C.navy }}>{value}</Text>
                    </View>
                  ))}

                  <View className="rounded-2xl p-3" style={{ backgroundColor: C.bg }}>
                    <Text className="text-xs font-bold" style={{ color: C.muted }}>REASON</Text>
                    <Text className="mt-2 text-sm leading-6" style={{ color: C.navy }}>
                      {selectedRequest.reason}
                    </Text>
                  </View>

                  {selectedRequest.document && (
                    <View className="mt-3 flex-row items-center rounded-2xl p-3" style={{ backgroundColor: C.paleBlue }}>
                      <Ionicons name="document-attach-outline" size={21} color={C.blue} />
                      <View className="ml-2 flex-1">
                        <Text className="text-xs font-bold" style={{ color: C.navy }}>Supporting document</Text>
                        <Text className="mt-1 text-xs" numberOfLines={1} style={{ color: C.muted }}>
                          {selectedRequest.document}
                        </Text>
                      </View>
                    </View>
                  )}

                  {selectedRequest.reviewedBy && (
                    <View className="mt-4">
                      <Text className="text-xs font-bold" style={{ color: C.muted }}>REVIEWED BY</Text>
                      <Text className="mt-1 text-sm font-bold" style={{ color: C.navy }}>
                        {selectedRequest.reviewedBy}
                      </Text>
                    </View>
                  )}

                  {selectedRequest.remarks && (
                    <View className="mt-4 rounded-2xl p-3" style={{ backgroundColor: selectedRequest.status === 'Rejected' ? C.paleRed : C.paleGreen }}>
                      <Text className="text-xs font-bold" style={{ color: selectedRequest.status === 'Rejected' ? C.red : C.green }}>
                        FACULTY REMARKS
                      </Text>
                      <Text className="mt-2 text-sm leading-5" style={{ color: C.navy }}>
                        {selectedRequest.remarks}
                      </Text>
                    </View>
                  )}

                  <View className="mt-5">
                    <Text className="mb-3 text-sm font-extrabold" style={{ color: C.navy }}>
                      Application Timeline
                    </Text>
                    {[
                      { title: 'Application submitted', desc: selectedRequest.submitted, done: true },
                      { title: 'Faculty review', desc: selectedRequest.status === 'Pending' ? 'Waiting for review' : 'Review completed', done: selectedRequest.status !== 'Pending' },
                      { title: 'Final decision', desc: selectedRequest.status === 'Pending' ? 'Decision pending' : selectedRequest.status, done: selectedRequest.status !== 'Pending' },
                    ].map((step, index) => (
                      <View key={step.title} className="mb-3 flex-row items-center">
                        <View className="h-8 w-8 items-center justify-center rounded-full" style={{ backgroundColor: step.done ? C.paleGreen : C.paleOrange }}>
                          <Ionicons name={step.done ? 'checkmark' : 'time-outline'} size={17} color={step.done ? C.green : C.orange} />
                        </View>
                        <View className="ml-3 flex-1">
                          <Text className="text-xs font-bold" style={{ color: C.navy }}>{step.title}</Text>
                          <Text className="mt-1 text-xs" style={{ color: C.muted }}>{step.desc}</Text>
                        </View>
                      </View>
                    ))}
                  </View>
                </View>

                {selectedRequest.status === 'Pending' && (
                  <Pressable
                    onPress={() => withdrawRequest(selectedRequest)}
                    className="mt-4 flex-row items-center justify-center rounded-2xl border p-4"
                    style={{ backgroundColor: C.paleRed, borderColor: '#F5D7D7' }}
                  >
                    <Ionicons name="trash-outline" size={18} color={C.red} />
                    <Text className="ml-2 text-sm font-bold" style={{ color: C.red }}>
                      Withdraw Application
                    </Text>
                  </Pressable>
                )}

                <Pressable
                  onPress={() => setShowDetails(false)}
                  className="mt-3 items-center rounded-2xl p-4"
                  style={{ backgroundColor: C.white }}
                >
                  <Text className="text-sm font-bold" style={{ color: C.navy }}>
                    Close Details
                  </Text>
                </Pressable>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
