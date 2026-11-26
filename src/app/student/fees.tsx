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
import { router } from 'expo-router';

const C = {
  navy: '#202B49',
  blue: '#6478E8',
  blueDark: '#5064D5',
  muted: '#8992A6',
  border: '#E9EDF5',
  bg: '#F6F8FD',
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

type FeeStatus = 'Paid' | 'Partial' | 'Pending';

type Fee = {
  id: string;
  title: string;
  description: string;
  amount: number;
  paid: number;
  dueDate: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  tint: string;
  mandatory: boolean;
};

type Payment = {
  id: string;
  date: string;
  title: string;
  method: string;
  amount: number;
  status: 'Success' | 'Processing' | 'Failed';
  reference: string;
};

const initialFees: Fee[] = [
  {
    id: 'FEE001',
    title: 'Tuition Fee',
    description: 'Academic tuition and classroom instruction',
    amount: 45000,
    paid: 45000,
    dueDate: '15 Jun 2026',
    icon: 'school-outline',
    color: C.blue,
    tint: C.paleBlue,
    mandatory: true,
  },
  {
    id: 'FEE002',
    title: 'Examination Fee',
    description: 'Semester examination and registration',
    amount: 2500,
    paid: 0,
    dueDate: '15 Nov 2026',
    icon: 'document-text-outline',
    color: C.orange,
    tint: C.paleOrange,
    mandatory: true,
  },
  {
    id: 'FEE003',
    title: 'Library Fee',
    description: 'Library access and maintenance',
    amount: 1500,
    paid: 1500,
    dueDate: '15 Jun 2026',
    icon: 'library-outline',
    color: C.purple,
    tint: C.palePurple,
    mandatory: true,
  },
  {
    id: 'FEE004',
    title: 'Laboratory Fee',
    description: 'Practical sessions and laboratory facilities',
    amount: 5000,
    paid: 2500,
    dueDate: '20 Nov 2026',
    icon: 'flask-outline',
    color: C.green,
    tint: C.paleGreen,
    mandatory: true,
  },
];

const initialPayments: Payment[] = [
  {
    id: 'PAY-2026-001',
    date: '12 Jun 2026',
    title: 'Tuition Fee',
    method: 'UPI',
    amount: 45000,
    status: 'Success',
    reference: 'UPI20260612001',
  },
  {
    id: 'PAY-2026-002',
    date: '12 Jun 2026',
    title: 'Library Fee',
    method: 'UPI',
    amount: 1500,
    status: 'Success',
    reference: 'UPI20260612002',
  },
  {
    id: 'PAY-2026-003',
    date: '10 Oct 2026',
    title: 'Laboratory Fee',
    method: 'Card',
    amount: 2500,
    status: 'Success',
    reference: 'CARD20261010003',
  },
];

const formatCurrency = (amount: number) =>
  `₹${amount.toLocaleString('en-IN')}`;

const getFeeStatus = (fee: Fee): FeeStatus => {
  if (fee.paid >= fee.amount) return 'Paid';
  if (fee.paid > 0) return 'Partial';
  return 'Pending';
};

const getDueInfo = (dueDate: string) => {
  const [day, month, year] = dueDate.split(' ');
  const monthIndex = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ].indexOf(month);

  const due = new Date(Number(year), monthIndex, Number(day));
  due.setHours(23, 59, 59, 999);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const difference = Math.ceil(
    (due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (difference < 0) {
    return {
      label: `${Math.abs(difference)} days overdue`,
      color: C.red,
      tint: C.paleRed,
      overdue: true,
      days: difference,
    };
  }

  if (difference === 0) {
    return {
      label: 'Due today',
      color: C.orange,
      tint: C.paleOrange,
      overdue: false,
      days: difference,
    };
  }

  if (difference <= 7) {
    return {
      label: `${difference} days left`,
      color: C.orange,
      tint: C.paleOrange,
      overdue: false,
      days: difference,
    };
  }

  return {
    label: `${difference} days left`,
    color: C.green,
    tint: C.paleGreen,
    overdue: false,
    days: difference,
  };
};

export default function StudentFeesScreen() {
  const [semester, setSemester] = useState(5);
  const [showSemesterPicker, setShowSemesterPicker] = useState(false);

  const [fees, setFees] = useState<Fee[]>(initialFees);
  const [payments, setPayments] = useState<Payment[]>(initialPayments);

  const [activeTab, setActiveTab] = useState<'breakdown' | 'history'>(
    'breakdown',
  );

  const [filter, setFilter] = useState<'All' | FeeStatus>('All');
  const [search, setSearch] = useState('');

  const [selectedFee, setSelectedFee] = useState<Fee | null>(null);
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const [receipt, setReceipt] = useState<Payment | null>(null);
  const [showReceipt, setShowReceipt] = useState(false);

  const [showNotification, setShowNotification] = useState(false);
  const [showSupport, setShowSupport] = useState(false);
  const [showFeeInfo, setShowFeeInfo] = useState(false);

  const totalFee = fees.reduce((sum, fee) => sum + fee.amount, 0);
  const totalPaid = fees.reduce((sum, fee) => sum + fee.paid, 0);
  const outstanding = Math.max(totalFee - totalPaid, 0);
  const progress = totalFee > 0 ? (totalPaid / totalFee) * 100 : 0;

  const paidCount = fees.filter(
    (fee) => getFeeStatus(fee) === 'Paid',
  ).length;

  const partialCount = fees.filter(
    (fee) => getFeeStatus(fee) === 'Partial',
  ).length;

  const pendingCount = fees.filter(
    (fee) => getFeeStatus(fee) === 'Pending',
  ).length;

  const upcomingFees = useMemo(() => {
    return fees
      .filter((fee) => fee.paid < fee.amount)
      .sort((a, b) => {
        const [dayA, monthA, yearA] = a.dueDate.split(' ');
        const [dayB, monthB, yearB] = b.dueDate.split(' ');

        const dateA = new Date(
          Number(yearA),
          ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].indexOf(monthA),
          Number(dayA),
        ).getTime();

        const dateB = new Date(
          Number(yearB),
          ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].indexOf(monthB),
          Number(dayB),
        ).getTime();

        return dateA - dateB;
      });
  }, [fees]);

  const filteredFees = useMemo(() => {
    return fees.filter((fee) => {
      const matchesFilter =
        filter === 'All' || getFeeStatus(fee) === filter;

      const matchesSearch =
        fee.title.toLowerCase().includes(search.toLowerCase()) ||
        fee.description.toLowerCase().includes(search.toLowerCase()) ||
        fee.id.toLowerCase().includes(search.toLowerCase());

      return matchesFilter && matchesSearch;
    });
  }, [fees, filter, search]);

  const openPayment = (fee: Fee) => {
    if (getFeeStatus(fee) === 'Paid') return;

    setSelectedFee(fee);
    setPaymentMethod('UPI');
    setShowPaymentModal(true);
  };

  const confirmPayment = () => {
    if (!selectedFee) return;

    const remaining = selectedFee.amount - selectedFee.paid;

    if (remaining <= 0) return;

    const payment: Payment = {
      id: `PAY-${Date.now()}`,
      date: new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      title: selectedFee.title,
      method: paymentMethod,
      amount: remaining,
      status: 'Success',
      reference: `DEMO${Date.now()}`,
    };

    setFees((current) =>
      current.map((fee) =>
        fee.id === selectedFee.id
          ? { ...fee, paid: fee.amount }
          : fee,
      ),
    );

    setPayments((current) => [payment, ...current]);

    setShowPaymentModal(false);
    setSelectedFee(null);
    setReceipt(payment);
    setShowReceipt(true);
  };

  const selectSemester = (value: number) => {
    setSemester(value);
    setShowSemesterPicker(false);

    if (value !== 5) {
      Alert.alert(
        `Semester ${value}`,
        'Sample fee records are currently available for Semester 5 only. Connect your backend to load actual semester-wise records.',
      );
    }
  };

  const closeReceipt = () => {
    setShowReceipt(false);
    setReceipt(null);
  };

  const downloadReceipt = () => {
    Alert.alert(
      'Receipt download',
      'Receipt PDF generation will be available after connecting a receipt-generation service.',
    );
  };

  const renderStatus = (status: FeeStatus) => {
    const color =
      status === 'Paid'
        ? C.green
        : status === 'Partial'
          ? C.orange
          : C.red;

    const background =
      status === 'Paid'
        ? C.paleGreen
        : status === 'Partial'
          ? C.paleOrange
          : C.paleRed;

    return (
      <View
        className="rounded-full px-3 py-1.5"
        style={{ backgroundColor: background }}
      >
        <Text style={{ color, fontSize: 10, fontWeight: '900' }}>
          {status}
        </Text>
      </View>
    );
  };

  const renderFeeCard = (fee: Fee) => {
    const status = getFeeStatus(fee);
    const remaining = fee.amount - fee.paid;
    const percentage = fee.amount > 0
      ? (fee.paid / fee.amount) * 100
      : 0;
    const dueInfo = getDueInfo(fee.dueDate);

    return (
      <View
        key={fee.id}
        className="mb-3 rounded-[23px] border p-4"
        style={{
          backgroundColor: C.white,
          borderColor: C.border,
        }}
      >
        <View className="flex-row items-start">
          <View
            className="h-12 w-12 items-center justify-center rounded-2xl"
            style={{ backgroundColor: fee.tint }}
          >
            <Ionicons name={fee.icon} size={22} color={fee.color} />
          </View>

          <View className="ml-3 flex-1">
            <Text
              style={{
                color: C.navy,
                fontSize: 14,
                fontWeight: '900',
              }}
            >
              {fee.title}
            </Text>

            <Text
              className="mt-1"
              style={{ color: C.muted, fontSize: 10 }}
            >
              {fee.description}
            </Text>

            <Text
              className="mt-1"
              style={{ color: C.muted, fontSize: 9 }}
            >
              Fee ID: {fee.id}
            </Text>
          </View>

          {renderStatus(status)}
        </View>

        <View
          className="mt-4 flex-row rounded-2xl p-3"
          style={{ backgroundColor: C.bg }}
        >
          <View className="flex-1">
            <Text style={{ color: C.muted, fontSize: 9 }}>
              Total fee
            </Text>
            <Text
              className="mt-1"
              style={{
                color: C.navy,
                fontSize: 16,
                fontWeight: '900',
              }}
            >
              {formatCurrency(fee.amount)}
            </Text>
          </View>

          <View className="flex-1">
            <Text style={{ color: C.muted, fontSize: 9 }}>
              Amount paid
            </Text>
            <Text
              className="mt-1"
              style={{
                color: C.green,
                fontSize: 16,
                fontWeight: '900',
              }}
            >
              {formatCurrency(fee.paid)}
            </Text>
          </View>

          <View className="flex-1 items-end">
            <Text style={{ color: C.muted, fontSize: 9 }}>
              Balance
            </Text>
            <Text
              className="mt-1"
              style={{
                color: remaining > 0 ? C.red : C.green,
                fontSize: 16,
                fontWeight: '900',
              }}
            >
              {formatCurrency(remaining)}
            </Text>
          </View>
        </View>

        <View className="mt-4">
          <View className="mb-2 flex-row items-center justify-between">
            <Text style={{ color: C.muted, fontSize: 10 }}>
              Payment completion
            </Text>
            <Text
              style={{
                color: C.navy,
                fontSize: 10,
                fontWeight: '900',
              }}
            >
              {Math.round(percentage)}%
            </Text>
          </View>

          <View
            className="h-2 overflow-hidden rounded-full"
            style={{ backgroundColor: '#EEF0F6' }}
          >
            <View
              className="h-full rounded-full"
              style={{
                width: `${percentage}%`,
                backgroundColor: fee.color,
              }}
            />
          </View>
        </View>

        <View
          className="mt-4 flex-row items-center justify-between border-t pt-3"
          style={{ borderColor: C.border }}
        >
          <View className="flex-1">
            <View className="flex-row items-center">
              <Ionicons
                name="calendar-outline"
                size={13}
                color={C.muted}
              />
              <Text
                className="ml-1.5"
                style={{ color: C.muted, fontSize: 10 }}
              >
                Due: {fee.dueDate}
              </Text>
            </View>

            {remaining > 0 && (
              <View
                className="mt-2 self-start rounded-full px-2.5 py-1"
                style={{ backgroundColor: dueInfo.tint }}
              >
                <Text
                  style={{
                    color: dueInfo.color,
                    fontSize: 9,
                    fontWeight: '900',
                  }}
                >
                  {dueInfo.label}
                </Text>
              </View>
            )}
          </View>

          {status === 'Paid' ? (
            <View className="flex-row items-center">
              <Ionicons
                name="checkmark-circle"
                size={16}
                color={C.green}
              />
              <Text
                className="ml-1"
                style={{
                  color: C.green,
                  fontSize: 10,
                  fontWeight: '900',
                }}
              >
                Fully paid
              </Text>
            </View>
          ) : (
            <Pressable
              onPress={() => openPayment(fee)}
              className="flex-row items-center rounded-xl px-4 py-3"
              style={{ backgroundColor: C.navy }}
            >
              <Text
                style={{
                  color: C.white,
                  fontSize: 10,
                  fontWeight: '900',
                }}
              >
                Pay {formatCurrency(remaining)}
              </Text>
              <Ionicons
                name="arrow-forward"
                size={13}
                color={C.white}
                style={{ marginLeft: 6 }}
              />
            </Pressable>
          )}
        </View>
      </View>
    );
  };

  const renderPaymentCard = (payment: Payment) => (
    <View
      key={payment.id}
      className="mb-3 rounded-[20px] border p-4"
      style={{
        backgroundColor: C.white,
        borderColor: C.border,
      }}
    >
      <View className="flex-row items-center">
        <View
          className="h-11 w-11 items-center justify-center rounded-2xl"
          style={{ backgroundColor: C.paleGreen }}
        >
          <Ionicons
            name="receipt-outline"
            size={20}
            color={C.green}
          />
        </View>

        <View className="ml-3 flex-1">
          <Text
            style={{
              color: C.navy,
              fontSize: 13,
              fontWeight: '900',
            }}
          >
            {payment.title}
          </Text>
          <Text
            className="mt-1"
            style={{ color: C.muted, fontSize: 10 }}
          >
            {payment.date} · {payment.method}
          </Text>
          <Text
            className="mt-1"
            style={{ color: C.muted, fontSize: 9 }}
          >
            {payment.id}
          </Text>
        </View>

        <View className="items-end">
          <Text
            style={{
              color: C.navy,
              fontSize: 15,
              fontWeight: '900',
            }}
          >
            {formatCurrency(payment.amount)}
          </Text>
          <Text
            className="mt-1"
            style={{
              color:
                payment.status === 'Success'
                  ? C.green
                  : payment.status === 'Failed'
                    ? C.red
                    : C.orange,
              fontSize: 10,
              fontWeight: '900',
            }}
          >
            {payment.status}
          </Text>
        </View>
      </View>

      <View
        className="mt-3 flex-row items-center justify-between border-t pt-3"
        style={{ borderColor: C.border }}
      >
        <Text
          style={{ color: C.muted, fontSize: 9 }}
          numberOfLines={1}
        >
          Ref: {payment.reference}
        </Text>

        <Pressable
          onPress={() => {
            setReceipt(payment);
            setShowReceipt(true);
          }}
          className="flex-row items-center"
        >
          <Ionicons
            name="document-text-outline"
            size={14}
            color={C.blue}
          />
          <Text
            className="ml-1"
            style={{
              color: C.blue,
              fontSize: 10,
              fontWeight: '900',
            }}
          >
            View receipt
          </Text>
        </Pressable>
      </View>
    </View>
  );

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: C.bg }}
      edges={['top', 'bottom']}
    >
      <StatusBar barStyle="dark-content" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 35 }}
      >
        {/* Header */}
        <View className="px-5 pt-3">
          <View className="mb-5 flex-row items-center justify-between">
            <Pressable
              onPress={() => router.back()}
              className="h-11 w-11 items-center justify-center rounded-2xl border"
              style={{
                backgroundColor: C.white,
                borderColor: C.border,
              }}
            >
              <Ionicons
                name="arrow-back"
                size={20}
                color={C.navy}
              />
            </Pressable>

            <View className="items-center">
              <Text
                style={{
                  color: C.navy,
                  fontSize: 11,
                  fontWeight: '900',
                  letterSpacing: 2,
                }}
              >
                CAMPUSOS
              </Text>
              <Text style={{ color: C.muted, fontSize: 9 }}>
                STUDENT PORTAL
              </Text>
            </View>

            <Pressable
              onPress={() => setShowNotification(true)}
              className="h-11 w-11 items-center justify-center rounded-2xl border"
              style={{
                backgroundColor: C.white,
                borderColor: C.border,
              }}
            >
              <Ionicons
                name="notifications-outline"
                size={20}
                color={C.navy}
              />
              {outstanding > 0 && (
                <View
                  className="absolute right-2 top-2 h-2 w-2 rounded-full"
                  style={{ backgroundColor: C.red }}
                />
              )}
            </Pressable>
          </View>

          <View className="mb-5 flex-row items-center justify-between">
            <View>
              <Text
                style={{
                  color: C.navy,
                  fontSize: 25,
                  fontWeight: '900',
                }}
              >
                Fee Details
              </Text>
              <Text
                className="mt-1"
                style={{ color: C.muted, fontSize: 11 }}
              >
                Your academic fee account
              </Text>
            </View>

            <Pressable
              onPress={() => setShowSemesterPicker(true)}
              className="flex-row items-center rounded-xl border px-3 py-2.5"
              style={{
                backgroundColor: C.white,
                borderColor: C.border,
              }}
            >
              <Ionicons
                name="calendar-outline"
                size={15}
                color={C.blue}
              />
              <Text
                className="mx-2"
                style={{
                  color: C.navy,
                  fontSize: 11,
                  fontWeight: '900',
                }}
              >
                Sem {semester}
              </Text>
              <Ionicons
                name="chevron-down"
                size={13}
                color={C.muted}
              />
            </Pressable>
          </View>
        </View>

        {/* Student information */}
        <View className="mx-5 mb-5 overflow-hidden rounded-[25px]">
          <LinearGradient
            colors={['#E6ECFF', '#F4F0FF', '#E8F5FF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ padding: 18 }}
          >
            <View className="flex-row items-center">
              <View
                className="h-14 w-14 items-center justify-center rounded-2xl"
                style={{
                  backgroundColor: C.white,
                  borderWidth: 1,
                  borderColor: '#FFFFFF',
                }}
              >
                <Text
                  style={{
                    color: C.blue,
                    fontSize: 19,
                    fontWeight: '900',
                  }}
                >
                  AJ
                </Text>
              </View>

              <View className="ml-3 flex-1">
                <Text
                  style={{
                    color: C.navy,
                    fontSize: 16,
                    fontWeight: '900',
                  }}
                >
                  Alex Johnson
                </Text>
                <Text
                  className="mt-1"
                  style={{ color: '#69758F', fontSize: 10 }}
                >
                  B.Tech Computer Science · Year 3
                </Text>
                <Text
                  className="mt-1"
                  style={{ color: '#69758F', fontSize: 10 }}
                >
                  Semester {semester} · Section A
                </Text>
              </View>

              <View
                className="rounded-full px-3 py-1.5"
                style={{ backgroundColor: C.white }}
              >
                <Text
                  style={{
                    color: C.blue,
                    fontSize: 9,
                    fontWeight: '900',
                  }}
                >
                  STUDENT
                </Text>
              </View>
            </View>

            <View
              className="mt-5 flex-row border-t pt-4"
              style={{ borderColor: '#DCE2F3' }}
            >
              <View className="flex-1">
                <Text style={{ color: C.muted, fontSize: 9 }}>
                  Student ID
                </Text>
                <Text
                  className="mt-1"
                  style={{
                    color: C.navy,
                    fontSize: 11,
                    fontWeight: '900',
                  }}
                >
                  COS2025-0142
                </Text>
              </View>

              <View className="flex-1">
                <Text style={{ color: C.muted, fontSize: 9 }}>
                  Department
                </Text>
                <Text
                  className="mt-1"
                  style={{
                    color: C.navy,
                    fontSize: 11,
                    fontWeight: '900',
                  }}
                >
                  Computer Science
                </Text>
              </View>

              <View className="flex-1">
                <Text style={{ color: C.muted, fontSize: 9 }}>
                  Academic year
                </Text>
                <Text
                  className="mt-1"
                  style={{
                    color: C.navy,
                    fontSize: 11,
                    fontWeight: '900',
                  }}
                >
                  2026–27
                </Text>
              </View>
            </View>

            <View
              className="mt-4 flex-row items-center rounded-xl p-3"
              style={{ backgroundColor: '#FFFFFF90' }}
            >
              <Ionicons
                name="information-circle-outline"
                size={16}
                color={C.blue}
              />
              <Text
                className="ml-2 flex-1"
                style={{
                  color: '#65718C',
                  fontSize: 9,
                  lineHeight: 14,
                }}
              >
                Fee records shown below are linked to your selected
                academic semester.
              </Text>
            </View>
          </LinearGradient>
        </View>

        {/* Outstanding balance */}
        <View className="mx-5 mb-5 overflow-hidden rounded-[26px]">
          <LinearGradient
            colors={['#687DE7', '#8795ED', '#A9A5F1']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ padding: 20 }}
          >
            <View className="flex-row items-center justify-between">
              <View>
                <Text
                  style={{
                    color: '#F0F1FF',
                    fontSize: 11,
                    fontWeight: '700',
                  }}
                >
                  Total outstanding balance
                </Text>

                <Text
                  className="mt-2"
                  style={{
                    color: C.white,
                    fontSize: 31,
                    fontWeight: '900',
                  }}
                >
                  {formatCurrency(outstanding)}
                </Text>

                <Text
                  className="mt-1"
                  style={{ color: '#F0F1FF', fontSize: 9 }}
                >
                  Remaining amount for Semester {semester}
                </Text>
              </View>

              <View
                className="h-14 w-14 items-center justify-center rounded-2xl"
                style={{ backgroundColor: '#FFFFFF35' }}
              >
                <Ionicons
                  name="wallet-outline"
                  size={27}
                  color={C.white}
                />
              </View>
            </View>

            <View
              className="mt-5 rounded-2xl p-3.5"
              style={{ backgroundColor: '#FFFFFF25' }}
            >
              <View className="mb-2 flex-row justify-between">
                <Text
                  style={{ color: '#F0F1FF', fontSize: 10 }}
                >
                  Overall payment progress
                </Text>
                <Text
                  style={{
                    color: C.white,
                    fontSize: 11,
                    fontWeight: '900',
                  }}
                >
                  {Math.round(progress)}%
                </Text>
              </View>

              <View
                className="h-2.5 overflow-hidden rounded-full"
                style={{ backgroundColor: '#FFFFFF55' }}
              >
                <View
                  className="h-full rounded-full"
                  style={{
                    width: `${progress}%`,
                    backgroundColor: C.white,
                  }}
                />
              </View>

              <View className="mt-3 flex-row justify-between">
                <View>
                  <Text style={{ color: '#E9EBFF', fontSize: 9 }}>
                    Amount paid
                  </Text>
                  <Text
                    className="mt-1"
                    style={{
                      color: C.white,
                      fontSize: 12,
                      fontWeight: '900',
                    }}
                  >
                    {formatCurrency(totalPaid)}
                  </Text>
                </View>

                <View className="items-end">
                  <Text style={{ color: '#E9EBFF', fontSize: 9 }}>
                    Total semester fee
                  </Text>
                  <Text
                    className="mt-1"
                    style={{
                      color: C.white,
                      fontSize: 12,
                      fontWeight: '900',
                    }}
                  >
                    {formatCurrency(totalFee)}
                  </Text>
                </View>
              </View>
            </View>

            {outstanding > 0 ? (
              <Pressable
                onPress={() => {
                  const nextFee = upcomingFees[0];
                  if (nextFee) openPayment(nextFee);
                }}
                className="mt-4 flex-row items-center justify-center rounded-xl py-3.5"
                style={{ backgroundColor: C.white }}
              >
                <Ionicons
                  name="card-outline"
                  size={17}
                  color={C.blueDark}
                />
                <Text
                  className="ml-2"
                  style={{
                    color: C.blueDark,
                    fontSize: 11,
                    fontWeight: '900',
                  }}
                >
                  Pay next outstanding fee
                </Text>
                <Ionicons
                  name="arrow-forward"
                  size={15}
                  color={C.blueDark}
                  style={{ marginLeft: 7 }}
                />
              </Pressable>
            ) : (
              <View
                className="mt-4 flex-row items-center justify-center rounded-xl py-3"
                style={{ backgroundColor: '#FFFFFF35' }}
              >
                <Ionicons
                  name="checkmark-circle"
                  size={17}
                  color={C.white}
                />
                <Text
                  className="ml-2"
                  style={{
                    color: C.white,
                    fontSize: 11,
                    fontWeight: '900',
                  }}
                >
                  All semester fees are paid
                </Text>
              </View>
            )}
          </LinearGradient>
        </View>

        {/* Fee statistics */}
        <View className="mx-5 mb-6">
          <View className="mb-3 flex-row items-center justify-between">
            <Text
              style={{
                color: C.navy,
                fontSize: 16,
                fontWeight: '900',
              }}
            >
              Payment overview
            </Text>
            <Text style={{ color: C.muted, fontSize: 9 }}>
              Semester {semester}
            </Text>
          </View>

          <View className="flex-row">
            <View
              className="mr-2 flex-1 rounded-2xl border p-3"
              style={{
                backgroundColor: C.white,
                borderColor: C.border,
              }}
            >
              <View
                className="h-9 w-9 items-center justify-center rounded-xl"
                style={{ backgroundColor: C.paleGreen }}
              >
                <Ionicons
                  name="checkmark-circle-outline"
                  size={18}
                  color={C.green}
                />
              </View>
              <Text
                className="mt-3"
                style={{
                  color: C.navy,
                  fontSize: 21,
                  fontWeight: '900',
                }}
              >
                {paidCount}
              </Text>
              <Text style={{ color: C.muted, fontSize: 9 }}>
                Fully paid
              </Text>
            </View>

            <View
              className="mx-1 flex-1 rounded-2xl border p-3"
              style={{
                backgroundColor: C.white,
                borderColor: C.border,
              }}
            >
              <View
                className="h-9 w-9 items-center justify-center rounded-xl"
                style={{ backgroundColor: C.paleOrange }}
              >
                <Ionicons
                  name="pie-chart-outline"
                  size={18}
                  color={C.orange}
                />
              </View>
              <Text
                className="mt-3"
                style={{
                  color: C.navy,
                  fontSize: 21,
                  fontWeight: '900',
                }}
              >
                {partialCount}
              </Text>
              <Text style={{ color: C.muted, fontSize: 9 }}>
                Partially paid
              </Text>
            </View>

            <View
              className="ml-2 flex-1 rounded-2xl border p-3"
              style={{
                backgroundColor: C.white,
                borderColor: C.border,
              }}
            >
              <View
                className="h-9 w-9 items-center justify-center rounded-xl"
                style={{ backgroundColor: C.paleRed }}
              >
                <Ionicons
                  name="time-outline"
                  size={18}
                  color={C.red}
                />
              </View>
              <Text
                className="mt-3"
                style={{
                  color: C.navy,
                  fontSize: 21,
                  fontWeight: '900',
                }}
              >
                {pendingCount}
              </Text>
              <Text style={{ color: C.muted, fontSize: 9 }}>
                Not paid
              </Text>
            </View>
          </View>
        </View>

        {/* Upcoming payments */}
        {upcomingFees.length > 0 && (
          <View className="mx-5 mb-6">
            <View className="mb-3 flex-row items-center justify-between">
              <View>
                <Text
                  style={{
                    color: C.navy,
                    fontSize: 16,
                    fontWeight: '900',
                  }}
                >
                  Upcoming payments
                </Text>
                <Text
                  className="mt-1"
                  style={{ color: C.muted, fontSize: 10 }}
                >
                  Keep track of your remaining dues
                </Text>
              </View>

              <View
                className="rounded-full px-3 py-1.5"
                style={{ backgroundColor: C.paleOrange }}
              >
                <Text
                  style={{
                    color: C.orange,
                    fontSize: 9,
                    fontWeight: '900',
                  }}
                >
                  {upcomingFees.length} DUE
                </Text>
              </View>
            </View>

            {upcomingFees.map((fee) => {
              const dueInfo = getDueInfo(fee.dueDate);
              const remaining = fee.amount - fee.paid;

              return (
                <View
                  key={fee.id}
                  className="mb-2 flex-row items-center rounded-2xl border p-3.5"
                  style={{
                    backgroundColor: C.white,
                    borderColor: C.border,
                  }}
                >
                  <View
                    className="h-10 w-10 items-center justify-center rounded-xl"
                    style={{ backgroundColor: fee.tint }}
                  >
                    <Ionicons
                      name={fee.icon}
                      size={19}
                      color={fee.color}
                    />
                  </View>

                  <View className="ml-3 flex-1">
                    <Text
                      style={{
                        color: C.navy,
                        fontSize: 11,
                        fontWeight: '900',
                      }}
                    >
                      {fee.title}
                    </Text>
                    <Text
                      className="mt-1"
                      style={{ color: C.muted, fontSize: 9 }}
                    >
                      Due {fee.dueDate}
                    </Text>
                    <Text
                      className="mt-1"
                      style={{
                        color: dueInfo.color,
                        fontSize: 9,
                        fontWeight: '800',
                      }}
                    >
                      {dueInfo.label}
                    </Text>
                  </View>

                  <View className="items-end">
                    <Text
                      style={{
                        color: C.navy,
                        fontSize: 13,
                        fontWeight: '900',
                      }}
                    >
                      {formatCurrency(remaining)}
                    </Text>
                    <Pressable
                      onPress={() => openPayment(fee)}
                      className="mt-2 rounded-lg px-3 py-1.5"
                      style={{ backgroundColor: C.paleBlue }}
                    >
                      <Text
                        style={{
                          color: C.blue,
                          fontSize: 9,
                          fontWeight: '900',
                        }}
                      >
                        Pay now
                      </Text>
                    </Pressable>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {/* Fee management */}
        <View className="mx-5">
          <View className="mb-4 flex-row items-center justify-between">
            <View>
              <Text
                style={{
                  color: C.navy,
                  fontSize: 18,
                  fontWeight: '900',
                }}
              >
                Fee management
              </Text>
              <Text
                className="mt-1"
                style={{ color: C.muted, fontSize: 10 }}
              >
                View detailed fee records and transactions
              </Text>
            </View>

            <Pressable
              onPress={() => setShowFeeInfo(true)}
              className="h-9 w-9 items-center justify-center rounded-xl"
              style={{ backgroundColor: C.paleBlue }}
            >
              <Ionicons
                name="information-circle-outline"
                size={19}
                color={C.blue}
              />
            </Pressable>
          </View>

          {/* Tabs */}
          <View
            className="mb-4 flex-row rounded-2xl p-1"
            style={{ backgroundColor: '#EDEFF6' }}
          >
            <Pressable
              onPress={() => setActiveTab('breakdown')}
              className="flex-1 items-center rounded-xl py-3"
              style={{
                backgroundColor:
                  activeTab === 'breakdown' ? C.white : 'transparent',
              }}
            >
              <Text
                style={{
                  color:
                    activeTab === 'breakdown' ? C.navy : C.muted,
                  fontSize: 10,
                  fontWeight: '900',
                }}
              >
                Fee breakdown
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setActiveTab('history')}
              className="flex-1 items-center rounded-xl py-3"
              style={{
                backgroundColor:
                  activeTab === 'history' ? C.white : 'transparent',
              }}
            >
              <Text
                style={{
                  color:
                    activeTab === 'history' ? C.navy : C.muted,
                  fontSize: 10,
                  fontWeight: '900',
                }}
              >
                Payment history
              </Text>
            </Pressable>
          </View>

          {activeTab === 'breakdown' ? (
            <>
              {/* Search */}
              <View
                className="mb-4 flex-row items-center rounded-2xl border px-4"
                style={{
                  backgroundColor: C.white,
                  borderColor: C.border,
                }}
              >
                <Ionicons
                  name="search-outline"
                  size={18}
                  color={C.muted}
                />
                <TextInput
                  value={search}
                  onChangeText={setSearch}
                  placeholder="Search fee name or fee ID..."
                  placeholderTextColor="#A5ADBC"
                  className="ml-3 flex-1 py-3.5"
                  style={{
                    color: C.navy,
                    fontSize: 11,
                  }}
                />
                {search.length > 0 && (
                  <Pressable onPress={() => setSearch('')}>
                    <Ionicons
                      name="close-circle"
                      size={18}
                      color={C.muted}
                    />
                  </Pressable>
                )}
              </View>

              {/* Filters */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="mb-4"
              >
                {(['All', 'Paid', 'Partial', 'Pending'] as const).map(
                  (item) => (
                    <Pressable
                      key={item}
                      onPress={() => setFilter(item)}
                      className="mr-2 rounded-full px-4 py-2.5"
                      style={{
                        backgroundColor:
                          filter === item ? C.navy : C.white,
                        borderWidth: 1,
                        borderColor:
                          filter === item ? C.navy : C.border,
                      }}
                    >
                      <Text
                        style={{
                          color:
                            filter === item ? C.white : C.muted,
                          fontSize: 10,
                          fontWeight: '900',
                        }}
                      >
                        {item}
                      </Text>
                    </Pressable>
                  ),
                )}
              </ScrollView>

              <View className="mb-3 flex-row items-center justify-between">
                <Text
                  style={{
                    color: C.navy,
                    fontSize: 12,
                    fontWeight: '900',
                  }}
                >
                  Semester fee records
                </Text>
                <Text style={{ color: C.muted, fontSize: 9 }}>
                  {filteredFees.length} records
                </Text>
              </View>

              {filteredFees.length > 0 ? (
                filteredFees.map(renderFeeCard)
              ) : (
                <View
                  className="items-center rounded-2xl border p-8"
                  style={{
                    backgroundColor: C.white,
                    borderColor: C.border,
                  }}
                >
                  <Ionicons
                    name="search-outline"
                    size={30}
                    color={C.muted}
                  />
                  <Text
                    className="mt-3"
                    style={{
                      color: C.navy,
                      fontSize: 13,
                      fontWeight: '900',
                    }}
                  >
                    No fee records found
                  </Text>
                  <Text
                    className="mt-1 text-center"
                    style={{ color: C.muted, fontSize: 10 }}
                  >
                    Try changing your search or filter.
                  </Text>
                </View>
              )}

              {/* Fee summary */}
              <View
                className="mt-2 rounded-[22px] border p-4"
                style={{
                  backgroundColor: C.white,
                  borderColor: C.border,
                }}
              >
                <Text
                  style={{
                    color: C.navy,
                    fontSize: 13,
                    fontWeight: '900',
                  }}
                >
                  Semester fee summary
                </Text>

                <View className="mt-4">
                  {[
                    ['Total fee amount', totalFee, C.navy],
                    ['Total amount paid', totalPaid, C.green],
                    ['Remaining amount', outstanding, C.red],
                  ].map(([label, amount, color]) => (
                    <View
                      key={String(label)}
                      className="mb-3 flex-row items-center justify-between"
                    >
                      <Text style={{ color: C.muted, fontSize: 10 }}>
                        {label}
                      </Text>
                      <Text
                        style={{
                          color: String(color),
                          fontSize: 12,
                          fontWeight: '900',
                        }}
                      >
                        {formatCurrency(Number(amount))}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            </>
          ) : (
            <>
              <View className="mb-4 flex-row items-center justify-between">
                <View>
                  <Text
                    style={{
                      color: C.navy,
                      fontSize: 14,
                      fontWeight: '900',
                    }}
                  >
                    Transaction records
                  </Text>
                  <Text
                    className="mt-1"
                    style={{ color: C.muted, fontSize: 9 }}
                  >
                    Your previous payment activity
                  </Text>
                </View>

                <View
                  className="rounded-xl px-3 py-2"
                  style={{ backgroundColor: C.paleBlue }}
                >
                  <Text
                    style={{
                      color: C.blue,
                      fontSize: 9,
                      fontWeight: '900',
                    }}
                  >
                    {payments.length} records
                  </Text>
                </View>
              </View>

              {payments.length > 0 ? (
                payments.map(renderPaymentCard)
              ) : (
                <View
                  className="items-center rounded-2xl border p-8"
                  style={{
                    backgroundColor: C.white,
                    borderColor: C.border,
                  }}
                >
                  <Ionicons
                    name="receipt-outline"
                    size={30}
                    color={C.muted}
                  />
                  <Text
                    className="mt-3"
                    style={{
                      color: C.navy,
                      fontSize: 13,
                      fontWeight: '900',
                    }}
                  >
                    No transactions yet
                  </Text>
                  <Text
                    className="mt-1 text-center"
                    style={{ color: C.muted, fontSize: 10 }}
                  >
                    Your completed payments will appear here.
                  </Text>
                </View>
              )}
            </>
          )}
        </View>

        {/* Payment instructions */}
        <View className="mx-5 mt-6">
          <View
            className="overflow-hidden rounded-[22px] border"
            style={{
              backgroundColor: C.white,
              borderColor: C.border,
            }}
          >
            <LinearGradient
              colors={['#F0F2FF', '#F7F5FF']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ padding: 16 }}
            >
              <View className="flex-row items-center">
                <View
                  className="h-10 w-10 items-center justify-center rounded-xl"
                  style={{ backgroundColor: C.white }}
                >
                  <Ionicons
                    name="information-circle-outline"
                    size={21}
                    color={C.blue}
                  />
                </View>
                <View className="ml-3 flex-1">
                  <Text
                    style={{
                      color: C.navy,
                      fontSize: 13,
                      fontWeight: '900',
                    }}
                  >
                    Before making a payment
                  </Text>
                  <Text
                    className="mt-1"
                    style={{ color: C.muted, fontSize: 9 }}
                  >
                    Follow these steps for a smooth payment experience.
                  </Text>
                </View>
              </View>

              {[
                'Verify your student ID and semester.',
                'Check the fee category and outstanding amount.',
                'Choose your preferred payment method.',
                'Keep your transaction reference for future enquiries.',
              ].map((item, index) => (
                <View
                  key={item}
                  className="mt-3 flex-row items-start"
                >
                  <View
                    className="h-5 w-5 items-center justify-center rounded-full"
                    style={{ backgroundColor: '#DFE5FF' }}
                  >
                    <Text
                      style={{
                        color: C.blue,
                        fontSize: 9,
                        fontWeight: '900',
                      }}
                    >
                      {index + 1}
                    </Text>
                  </View>
                  <Text
                    className="ml-2 flex-1"
                    style={{
                      color: '#65718C',
                      fontSize: 10,
                      lineHeight: 16,
                    }}
                  >
                    {item}
                  </Text>
                </View>
              ))}
            </LinearGradient>
          </View>
        </View>

        {/* Accounts support */}
        <View className="mx-5 mt-5">
          <View
            className="rounded-[22px] border p-4"
            style={{
              backgroundColor: C.white,
              borderColor: C.border,
            }}
          >
            <View className="flex-row items-center">
              <View
                className="h-11 w-11 items-center justify-center rounded-2xl"
                style={{ backgroundColor: C.paleBlue }}
              >
                <Ionicons
                  name="headset-outline"
                  size={21}
                  color={C.blue}
                />
              </View>

              <View className="ml-3 flex-1">
                <Text
                  style={{
                    color: C.navy,
                    fontSize: 12,
                    fontWeight: '900',
                  }}
                >
                  Need help with payments?
                </Text>
                <Text
                  className="mt-1"
                  style={{ color: C.muted, fontSize: 9 }}
                >
                  Contact the accounts office for fee-related queries.
                </Text>
              </View>

              <Pressable
                onPress={() => setShowSupport(true)}
                className="rounded-xl px-3 py-2.5"
                style={{ backgroundColor: C.paleBlue }}
              >
                <Text
                  style={{
                    color: C.blue,
                    fontSize: 10,
                    fontWeight: '900',
                  }}
                >
                  Contact
                </Text>
              </Pressable>
            </View>
          </View>

          <View className="mt-4 flex-row items-start px-1">
            <Ionicons
              name="shield-checkmark-outline"
              size={16}
              color={C.green}
            />
            <Text
              className="ml-2 flex-1"
              style={{
                color: C.muted,
                fontSize: 9,
                lineHeight: 15,
              }}
            >
              Always verify the fee amount and student details before
              making a payment. Keep your transaction reference for
              future enquiries.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Semester picker */}
      <Modal
        visible={showSemesterPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowSemesterPicker(false)}
      >
        <Pressable
          onPress={() => setShowSemesterPicker(false)}
          className="flex-1 justify-end"
          style={{ backgroundColor: '#17213D70' }}
        >
          <Pressable
            onPress={() => {}}
            className="rounded-t-[28px] p-5"
            style={{ backgroundColor: C.white }}
          >
            <View className="mb-5 flex-row items-center justify-between">
              <View>
                <Text
                  style={{
                    color: C.navy,
                    fontSize: 18,
                    fontWeight: '900',
                  }}
                >
                  Select semester
                </Text>
                <Text
                  className="mt-1"
                  style={{ color: C.muted, fontSize: 10 }}
                >
                  Choose your academic semester
                </Text>
              </View>

              <Pressable
                onPress={() => setShowSemesterPicker(false)}
                className="h-9 w-9 items-center justify-center rounded-xl"
                style={{ backgroundColor: C.bg }}
              >
                <Ionicons name="close" size={19} color={C.navy} />
              </Pressable>
            </View>

            <View className="flex-row flex-wrap">
              {Array.from({ length: 8 }, (_, index) => index + 1).map(
                (item) => (
                  <Pressable
                    key={item}
                    onPress={() => selectSemester(item)}
                    className="mb-3 mr-3 w-[21%] items-center rounded-2xl border py-4"
                    style={{
                      backgroundColor:
                        semester === item ? C.paleBlue : C.white,
                      borderColor:
                        semester === item ? C.blue : C.border,
                    }}
                  >
                    <Text
                      style={{
                        color:
                          semester === item ? C.blue : C.navy,
                        fontSize: 15,
                        fontWeight: '900',
                      }}
                    >
                      {item}
                    </Text>
                    <Text
                      className="mt-1"
                      style={{ color: C.muted, fontSize: 9 }}
                    >
                      Semester
                    </Text>
                  </Pressable>
                ),
              )}
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Payment modal */}
      <Modal
        visible={showPaymentModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowPaymentModal(false)}
      >
        <Pressable
          onPress={() => setShowPaymentModal(false)}
          className="flex-1 justify-end"
          style={{ backgroundColor: '#17213D70' }}
        >
          <Pressable
            onPress={() => {}}
            className="rounded-t-[28px] p-5"
            style={{ backgroundColor: C.white }}
          >
            <View className="mb-5 flex-row items-center justify-between">
              <View>
                <Text
                  style={{
                    color: C.navy,
                    fontSize: 19,
                    fontWeight: '900',
                  }}
                >
                  Complete payment
                </Text>
                <Text
                  className="mt-1"
                  style={{ color: C.muted, fontSize: 10 }}
                >
                  Review your payment details
                </Text>
              </View>

              <Pressable
                onPress={() => setShowPaymentModal(false)}
                className="h-9 w-9 items-center justify-center rounded-xl"
                style={{ backgroundColor: C.bg }}
              >
                <Ionicons name="close" size={19} color={C.navy} />
              </Pressable>
            </View>

            {selectedFee && (
              <>
                <View
                  className="rounded-2xl p-4"
                  style={{ backgroundColor: C.paleBlue }}
                >
                  <View className="flex-row items-center justify-between">
                    <Text style={{ color: C.muted, fontSize: 10 }}>
                      Fee category
                    </Text>
                    {renderStatus(getFeeStatus(selectedFee))}
                  </View>

                  <Text
                    className="mt-2"
                    style={{
                      color: C.navy,
                      fontSize: 15,
                      fontWeight: '900',
                    }}
                  >
                    {selectedFee.title}
                  </Text>

                  <Text
                    className="mt-1"
                    style={{ color: C.muted, fontSize: 9 }}
                  >
                    Fee ID: {selectedFee.id}
                  </Text>

                  <View className="mt-4 flex-row justify-between">
                    <View>
                      <Text style={{ color: C.muted, fontSize: 9 }}>
                        Total fee
                      </Text>
                      <Text
                        className="mt-1"
                        style={{
                          color: C.navy,
                          fontSize: 12,
                          fontWeight: '900',
                        }}
                      >
                        {formatCurrency(selectedFee.amount)}
                      </Text>
                    </View>

                    <View>
                      <Text style={{ color: C.muted, fontSize: 9 }}>
                        Already paid
                      </Text>
                      <Text
                        className="mt-1"
                        style={{
                          color: C.green,
                          fontSize: 12,
                          fontWeight: '900',
                        }}
                      >
                        {formatCurrency(selectedFee.paid)}
                      </Text>
                    </View>

                    <View className="items-end">
                      <Text style={{ color: C.muted, fontSize: 9 }}>
                        Payable
                      </Text>
                      <Text
                        className="mt-1"
                        style={{
                          color: C.blue,
                          fontSize: 17,
                          fontWeight: '900',
                        }}
                      >
                        {formatCurrency(
                          selectedFee.amount - selectedFee.paid,
                        )}
                      </Text>
                    </View>
                  </View>
                </View>

                <Text
                  className="mb-3 mt-5"
                  style={{
                    color: C.navy,
                    fontSize: 13,
                    fontWeight: '900',
                  }}
                >
                  Choose payment method
                </Text>

                {[
                  {
                    id: 'UPI',
                    icon: 'phone-portrait-outline' as const,
                    title: 'UPI',
                    description: 'Google Pay, PhonePe, Paytm',
                  },
                  {
                    id: 'Card',
                    icon: 'card-outline' as const,
                    title: 'Debit / Credit Card',
                    description: 'Visa, Mastercard and RuPay',
                  },
                  {
                    id: 'Net Banking',
                    icon: 'business-outline' as const,
                    title: 'Net Banking',
                    description: 'Pay through your bank',
                  },
                ].map((method) => (
                  <Pressable
                    key={method.id}
                    onPress={() => setPaymentMethod(method.id)}
                    className="mb-3 flex-row items-center rounded-2xl border p-3"
                    style={{
                      backgroundColor:
                        paymentMethod === method.id
                          ? C.paleBlue
                          : C.white,
                      borderColor:
                        paymentMethod === method.id
                          ? C.blue
                          : C.border,
                    }}
                  >
                    <View
                      className="h-10 w-10 items-center justify-center rounded-xl"
                      style={{ backgroundColor: C.white }}
                    >
                      <Ionicons
                        name={method.icon}
                        size={20}
                        color={C.blue}
                      />
                    </View>

                    <View className="ml-3 flex-1">
                      <Text
                        style={{
                          color: C.navy,
                          fontSize: 11,
                          fontWeight: '900',
                        }}
                      >
                        {method.title}
                      </Text>
                      <Text
                        className="mt-1"
                        style={{ color: C.muted, fontSize: 9 }}
                      >
                        {method.description}
                      </Text>
                    </View>

                    <Ionicons
                      name={
                        paymentMethod === method.id
                          ? 'radio-button-on'
                          : 'radio-button-off'
                      }
                      size={19}
                      color={
                        paymentMethod === method.id
                          ? C.blue
                          : C.muted
                      }
                    />
                  </Pressable>
                ))}

                <View
                  className="mb-4 flex-row items-start rounded-xl p-3"
                  style={{ backgroundColor: C.paleOrange }}
                >
                  <Ionicons
                    name="information-circle-outline"
                    size={17}
                    color={C.orange}
                  />
                  <Text
                    className="ml-2 flex-1"
                    style={{
                      color: '#8C7047',
                      fontSize: 9,
                      lineHeight: 15,
                    }}
                  >
                    Demo payment only. No real money will be transferred.
                    This confirmation is not proof of an actual bank
                    transaction.
                  </Text>
                </View>

                <Pressable
                  onPress={confirmPayment}
                  className="items-center rounded-2xl py-4"
                  style={{ backgroundColor: C.navy }}
                >
                  <Text
                    style={{
                      color: C.white,
                      fontSize: 12,
                      fontWeight: '900',
                    }}
                  >
                    Confirm demo payment
                  </Text>
                </Pressable>
              </>
            )}
          </Pressable>
        </Pressable>
      </Modal>

      {/* Receipt modal */}
      <Modal
        visible={showReceipt}
        transparent
        animationType="fade"
        onRequestClose={closeReceipt}
      >
        <View
          className="flex-1 items-center justify-center px-5"
          style={{ backgroundColor: '#17213D80' }}
        >
          <View
            className="w-full rounded-[26px] p-5"
            style={{ backgroundColor: C.white }}
          >
            <View className="items-center">
              <View
                className="h-16 w-16 items-center justify-center rounded-full"
                style={{ backgroundColor: C.paleGreen }}
              >
                <Ionicons
                  name="checkmark-circle"
                  size={38}
                  color={C.green}
                />
              </View>

              <Text
                className="mt-4"
                style={{
                  color: C.navy,
                  fontSize: 19,
                  fontWeight: '900',
                }}
              >
                Payment recorded
              </Text>

              <Text
                className="mt-1 text-center"
                style={{ color: C.muted, fontSize: 10 }}
              >
                Frontend demo confirmation
              </Text>
            </View>

            {receipt && (
              <View
                className="mt-5 rounded-2xl p-4"
                style={{ backgroundColor: C.bg }}
              >
                <Text
                  className="text-center"
                  style={{ color: C.muted, fontSize: 9 }}
                >
                  Amount recorded
                </Text>

                <Text
                  className="mt-1 text-center"
                  style={{
                    color: C.navy,
                    fontSize: 27,
                    fontWeight: '900',
                  }}
                >
                  {formatCurrency(receipt.amount)}
                </Text>

                <View
                  className="my-4 border-t"
                  style={{ borderColor: C.border }}
                />

                {[
                  ['Student', 'Alex Johnson'],
                  ['Student ID', 'COS2025-0142'],
                  ['Fee category', receipt.title],
                  ['Payment method', receipt.method],
                  ['Date', receipt.date],
                  ['Transaction ID', receipt.id],
                  ['Reference', receipt.reference],
                  ['Status', receipt.status],
                ].map(([label, value]) => (
                  <View
                    key={label}
                    className="mb-3 flex-row justify-between"
                  >
                    <Text style={{ color: C.muted, fontSize: 9 }}>
                      {label}
                    </Text>
                    <Text
                      style={{
                        color: C.navy,
                        fontSize: 9,
                        fontWeight: '900',
                      }}
                    >
                      {value}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            <Pressable
              onPress={downloadReceipt}
              className="mt-5 flex-row items-center justify-center rounded-xl py-3.5"
              style={{ backgroundColor: C.paleBlue }}
            >
              <Ionicons
                name="download-outline"
                size={17}
                color={C.blue}
              />
              <Text
                className="ml-2"
                style={{
                  color: C.blue,
                  fontSize: 11,
                  fontWeight: '900',
                }}
              >
                Download receipt
              </Text>
            </Pressable>

            <Pressable
              onPress={closeReceipt}
              className="mt-3 items-center rounded-xl py-3.5"
              style={{ backgroundColor: C.navy }}
            >
              <Text
                style={{
                  color: C.white,
                  fontSize: 11,
                  fontWeight: '900',
                }}
              >
                Done
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Notifications modal */}
      <Modal
        visible={showNotification}
        transparent
        animationType="fade"
        onRequestClose={() => setShowNotification(false)}
      >
        <Pressable
          onPress={() => setShowNotification(false)}
          className="flex-1 items-center justify-center px-5"
          style={{ backgroundColor: '#17213D70' }}
        >
          <Pressable
            onPress={() => {}}
            className="w-full rounded-[25px] p-5"
            style={{ backgroundColor: C.white }}
          >
            <View className="flex-row items-center justify-between">
              <View>
                <Text
                  style={{
                    color: C.navy,
                    fontSize: 17,
                    fontWeight: '900',
                  }}
                >
                  Fee notifications
                </Text>
                <Text
                  className="mt-1"
                  style={{ color: C.muted, fontSize: 9 }}
                >
                  Important updates about your account
                </Text>
              </View>

              <Pressable onPress={() => setShowNotification(false)}>
                <Ionicons name="close" size={21} color={C.navy} />
              </Pressable>
            </View>

            {outstanding > 0 && (
              <View className="mt-5 flex-row items-start">
                <View
                  className="h-10 w-10 items-center justify-center rounded-xl"
                  style={{ backgroundColor: C.paleOrange }}
                >
                  <Ionicons
                    name="alert-circle-outline"
                    size={20}
                    color={C.orange}
                  />
                </View>

                <View className="ml-3 flex-1">
                  <Text
                    style={{
                      color: C.navy,
                      fontSize: 11,
                      fontWeight: '900',
                    }}
                  >
                    Outstanding fee reminder
                  </Text>
                  <Text
                    className="mt-1"
                    style={{
                      color: C.muted,
                      fontSize: 10,
                      lineHeight: 16,
                    }}
                  >
                    You have {formatCurrency(outstanding)} remaining in
                    Semester {semester}.
                  </Text>
                </View>
              </View>
            )}

            {upcomingFees.length > 0 && (
              <View className="mt-4 flex-row items-start">
                <View
                  className="h-10 w-10 items-center justify-center rounded-xl"
                  style={{ backgroundColor: C.paleBlue }}
                >
                  <Ionicons
                    name="calendar-outline"
                    size={19}
                    color={C.blue}
                  />
                </View>

                <View className="ml-3 flex-1">
                  <Text
                    style={{
                      color: C.navy,
                      fontSize: 11,
                      fontWeight: '900',
                    }}
                  >
                    Upcoming due dates
                  </Text>
                  <Text
                    className="mt-1"
                    style={{
                      color: C.muted,
                      fontSize: 10,
                      lineHeight: 16,
                    }}
                  >
                    You have {upcomingFees.length} fee categories with
                    outstanding balances.
                  </Text>
                </View>
              </View>
            )}

            <View className="mt-4 flex-row items-start">
              <View
                className="h-10 w-10 items-center justify-center rounded-xl"
                style={{ backgroundColor: C.paleGreen }}
              >
                <Ionicons
                  name="receipt-outline"
                  size={19}
                  color={C.green}
                />
              </View>

              <View className="ml-3 flex-1">
                <Text
                  style={{
                    color: C.navy,
                    fontSize: 11,
                    fontWeight: '900',
                  }}
                >
                  Payment records
                </Text>
                <Text
                  className="mt-1"
                  style={{
                    color: C.muted,
                    fontSize: 10,
                    lineHeight: 16,
                  }}
                >
                  Your payment history contains {payments.length}{' '}
                  transaction records.
                </Text>
              </View>
            </View>

            <Pressable
              onPress={() => setShowNotification(false)}
              className="mt-5 items-center rounded-xl py-3"
              style={{ backgroundColor: C.navy }}
            >
              <Text
                style={{
                  color: C.white,
                  fontSize: 11,
                  fontWeight: '900',
                }}
              >
                Close
              </Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Fee information modal */}
      <Modal
        visible={showFeeInfo}
        transparent
        animationType="fade"
        onRequestClose={() => setShowFeeInfo(false)}
      >
        <Pressable
          onPress={() => setShowFeeInfo(false)}
          className="flex-1 items-center justify-center px-5"
          style={{ backgroundColor: '#17213D70' }}
        >
          <Pressable
            onPress={() => {}}
            className="w-full rounded-[25px] p-5"
            style={{ backgroundColor: C.white }}
          >
            <View className="flex-row items-center justify-between">
              <Text
                style={{
                  color: C.navy,
                  fontSize: 17,
                  fontWeight: '900',
                }}
              >
                Understanding fee status
              </Text>
              <Pressable onPress={() => setShowFeeInfo(false)}>
                <Ionicons name="close" size={21} color={C.navy} />
              </Pressable>
            </View>

            {[
              {
                title: 'Paid',
                description: 'The full fee amount has been paid.',
                color: C.green,
                tint: C.paleGreen,
                icon: 'checkmark-circle-outline' as const,
              },
              {
                title: 'Partial',
                description: 'A part of the fee has been paid. A balance remains.',
                color: C.orange,
                tint: C.paleOrange,
                icon: 'pie-chart-outline' as const,
              },
              {
                title: 'Pending',
                description: 'No payment has been recorded for this fee.',
                color: C.red,
                tint: C.paleRed,
                icon: 'time-outline' as const,
              },
            ].map((item) => (
              <View
                key={item.title}
                className="mt-4 flex-row items-center"
              >
                <View
                  className="h-10 w-10 items-center justify-center rounded-xl"
                  style={{ backgroundColor: item.tint }}
                >
                  <Ionicons
                    name={item.icon}
                    size={19}
                    color={item.color}
                  />
                </View>
                <View className="ml-3 flex-1">
                  <Text
                    style={{
                      color: item.color,
                      fontSize: 11,
                      fontWeight: '900',
                    }}
                  >
                    {item.title}
                  </Text>
                  <Text
                    className="mt-1"
                    style={{
                      color: C.muted,
                      fontSize: 10,
                      lineHeight: 15,
                    }}
                  >
                    {item.description}
                  </Text>
                </View>
              </View>
            ))}

            <View
              className="mt-5 rounded-xl p-3"
              style={{ backgroundColor: C.paleBlue }}
            >
              <Text
                style={{
                  color: C.navy,
                  fontSize: 10,
                  lineHeight: 16,
                }}
              >
                Due-date labels are reminders based on the sample dates
                in this screen. Confirm official payment deadlines with
                your college accounts office.
              </Text>
            </View>

            <Pressable
              onPress={() => setShowFeeInfo(false)}
              className="mt-4 items-center rounded-xl py-3.5"
              style={{ backgroundColor: C.navy }}
            >
              <Text
                style={{
                  color: C.white,
                  fontSize: 11,
                  fontWeight: '900',
                }}
              >
                Got it
              </Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Accounts support modal */}
      <Modal
        visible={showSupport}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSupport(false)}
      >
        <Pressable
          onPress={() => setShowSupport(false)}
          className="flex-1 items-center justify-center px-5"
          style={{ backgroundColor: '#17213D70' }}
        >
          <Pressable
            onPress={() => {}}
            className="w-full rounded-[25px] p-5"
            style={{ backgroundColor: C.white }}
          >
            <View className="flex-row items-center justify-between">
              <Text
                style={{
                  color: C.navy,
                  fontSize: 17,
                  fontWeight: '900',
                }}
              >
                Accounts office
              </Text>
              <Pressable onPress={() => setShowSupport(false)}>
                <Ionicons name="close" size={21} color={C.navy} />
              </Pressable>
            </View>

            <Text
              className="mt-2"
              style={{
                color: C.muted,
                fontSize: 10,
                lineHeight: 17,
              }}
            >
              For fee corrections, payment confirmation issues, or
              receipt enquiries, contact your college accounts office.
            </Text>

            <View
              className="mt-4 rounded-2xl p-4"
              style={{ backgroundColor: C.paleBlue }}
            >
              <View className="flex-row items-center">
                <Ionicons
                  name="mail-outline"
                  size={18}
                  color={C.blue}
                />
                <Text
                  className="ml-3"
                  style={{
                    color: C.navy,
                    fontSize: 11,
                    fontWeight: '900',
                  }}
                >
                  accounts@campus.edu
                </Text>
              </View>

              <Text
                className="mt-3"
                style={{ color: C.muted, fontSize: 9, lineHeight: 14 }}
              >
                Replace this sample email with your college&apos;s official
                accounts-office contact information.
              </Text>
            </View>

            <Pressable
              onPress={() => setShowSupport(false)}
              className="mt-4 items-center rounded-xl py-3.5"
              style={{ backgroundColor: C.navy }}
            >
              <Text
                style={{
                  color: C.white,
                  fontSize: 11,
                  fontWeight: '900',
                }}
              >
                Close
              </Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}
