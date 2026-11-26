import React, { useMemo, useState } from 'react';
import {
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
  bg: '#F6F8FC',
  white: '#FFFFFF',
  navy: '#202B49',
  navyLight: '#34466D',
  blue: '#6478E8',
  blueDark: '#5065D5',
  muted: '#8992A6',
  border: '#E9EDF5',
  green: '#269B78',
  red: '#DC626B',
  orange: '#D99035',
  purple: '#9277D6',
  paleBlue: '#EEF1FF',
  paleGreen: '#EAF8F1',
  paleRed: '#FFF0F1',
  paleOrange: '#FFF5E8',
  palePurple: '#F3EFFF',
};

const createLibraryTransactionId = () =>
  `LIB-${Date.now().toString(36).toUpperCase()}`;

type Book = {
  id: number;
  title: string;
  author: string;
  isbn: string;
  category: string;
  publisher: string;
  edition: string;
  year: string;
  shelf: string;
  totalCopies: number;
  availableCopies: number;
  description: string;
  color: string;
};

type BorrowedBook = {
  bookId: number;
  issueDate: string;
  dueDate: string;
  status: 'Issued' | 'Overdue';
};

type Tab = 'Catalogue' | 'My Books' | 'History';

type NotificationAction = {
  text: string;
  style?: 'default' | 'cancel' | 'destructive';
  onPress?: () => void;
};

type NotificationData = {
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  actions: NotificationAction[];
};

const MAX_BOOKS = 4;
const FINE_PER_DAY = 5; // Sample rate: ₹5 per overdue day. Set this to your college's official rate.

const parseLibraryDate = (value: string) => {
  const parsed = new Date(value);
  if (!Number.isNaN(parsed.getTime())) return parsed;

  const match = value.match(/^(\d{1,2}) ([A-Za-z]{3}) (\d{4})$/);
  if (!match) return new Date();
  const monthIndex = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].indexOf(match[2]);
  if (monthIndex < 0) return new Date();
  return new Date(Number(match[3]), monthIndex, Number(match[1]));
};

const books: Book[] = [
  {
    id: 1,
    title: 'Introduction to Algorithms',
    author: 'Thomas H. Cormen',
    isbn: '9780262046305',
    category: 'Computer Science',
    publisher: 'MIT Press',
    edition: '4th Edition',
    year: '2022',
    shelf: 'CS - A12',
    totalCopies: 8,
    availableCopies: 5,
    description:
      'A comprehensive textbook covering algorithm design, analysis, data structures, sorting, graph algorithms and computational theory.',
    color: '#6478A8',
  },
  {
    id: 2,
    title: 'Database System Concepts',
    author: 'Abraham Silberschatz',
    isbn: '9780078022159',
    category: 'Computer Science',
    publisher: 'McGraw Hill',
    edition: '7th Edition',
    year: '2019',
    shelf: 'CS - B08',
    totalCopies: 6,
    availableCopies: 3,
    description:
      'A detailed reference for database architecture, SQL, relational models, transaction management and database design.',
    color: '#328A79',
  },
  {
    id: 3,
    title: 'Operating System Concepts',
    author: 'Abraham Silberschatz',
    isbn: '9781119800361',
    category: 'Computer Science',
    publisher: 'Wiley',
    edition: '10th Edition',
    year: '2021',
    shelf: 'CS - C04',
    totalCopies: 5,
    availableCopies: 0,
    description:
      'A textbook explaining operating system structures, process management, memory management, storage and security.',
    color: '#9B7452',
  },
  {
    id: 4,
    title: 'Computer Networking',
    author: 'James F. Kurose',
    isbn: '9780136681557',
    category: 'Computer Science',
    publisher: 'Pearson',
    edition: '8th Edition',
    year: '2021',
    shelf: 'CS - A18',
    totalCopies: 7,
    availableCopies: 4,
    description:
      'An introduction to computer networks, protocols, architecture, transport layers and network applications.',
    color: '#6478A8',
  },
  {
    id: 5,
    title: 'Engineering Mathematics',
    author: 'B. S. Grewal',
    isbn: '9788193328491',
    category: 'Mathematics',
    publisher: 'Khanna Publishers',
    edition: '44th Edition',
    year: '2021',
    shelf: 'MA - A03',
    totalCopies: 10,
    availableCopies: 6,
    description:
      'A reference book for engineering mathematics covering calculus, differential equations, matrices and numerical methods.',
    color: '#9675B5',
  },
  {
    id: 6,
    title: 'Software Engineering',
    author: 'Ian Sommerville',
    isbn: '9780133943030',
    category: 'Computer Science',
    publisher: 'Pearson',
    edition: '10th Edition',
    year: '2015',
    shelf: 'CS - D02',
    totalCopies: 4,
    availableCopies: 2,
    description:
      'A practical introduction to software engineering processes, requirements, architecture, testing and project management.',
    color: '#B17B55',
  },
  {
    id: 7,
    title: 'Digital Electronics',
    author: 'M. Morris Mano',
    isbn: '9780134549897',
    category: 'Electronics',
    publisher: 'Pearson',
    edition: '6th Edition',
    year: '2017',
    shelf: 'EC - B11',
    totalCopies: 5,
    availableCopies: 2,
    description:
      'A reference for digital systems, Boolean algebra, logic gates, combinational circuits and sequential circuits.',
    color: '#568A9C',
  },
  {
    id: 8,
    title: 'Principles of Management',
    author: 'Harold Koontz',
    isbn: '9781259005037',
    category: 'Management',
    publisher: 'McGraw Hill',
    edition: '14th Edition',
    year: '2012',
    shelf: 'MG - A05',
    totalCopies: 4,
    availableCopies: 0,
    description:
      'An overview of management principles, planning, organizing, leadership and organizational control.',
    color: '#A27D55',
  },
];

const initialBorrowed: BorrowedBook[] = [
  {
    bookId: 2,
    issueDate: '28 Oct 2026',
    dueDate: '11 Nov 2026',
    status: 'Issued',
  },
  {
    bookId: 4,
    issueDate: '22 Oct 2026',
    dueDate: '02 Nov 2026',
    status: 'Overdue',
  },
];

const categories = [
  'All',
  'Computer Science',
  'Mathematics',
  'Electronics',
  'Management',
];

const tabs: Tab[] = ['Catalogue', 'My Books', 'History'];

export default function StudentLibraryScreen() {
  const [activeTab, setActiveTab] = useState<Tab>('Catalogue');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [availabilityOnly, setAvailabilityOnly] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  const [borrowed, setBorrowed] = useState(initialBorrowed);
  const [reserved, setReserved] = useState<number[]>([3]);
  const [history, setHistory] = useState<number[]>([1, 5]);
  const [requested, setRequested] = useState<number[]>([]);
  const [showRules, setShowRules] = useState(false);
  const [notification, setNotification] = useState<NotificationData | null>(null);
  const [paymentBookId, setPaymentBookId] = useState<number | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Card' | 'Cash at library'>('UPI');
  const [paidFineBookIds, setPaidFineBookIds] = useState<number[]>([]);
  const [paymentReceipt, setPaymentReceipt] = useState<{ amount: number; bookTitle: string; transactionId: string; method: string } | null>(null);

  const showNotification = (
    title: string,
    message: string,
    type: NotificationData['type'] = 'info',
    actions: NotificationAction[] = [{ text: 'Got it' }]
  ) => {
    setNotification({ title, message, type, actions });
  };

  const closeNotification = () => setNotification(null);

  const borrowedBookIds = borrowed.map((item) => item.bookId);

  const getBook = (id: number) => books.find((book) => book.id === id);

  const overdueCount = borrowed.filter(
    (item) => item.status === 'Overdue'
  ).length;

  const today = new Date();
  const getOverdueDays = (dueDate: string) => {
    const due = parseLibraryDate(dueDate);
    due.setHours(0, 0, 0, 0);
    const current = new Date(today);
    current.setHours(0, 0, 0, 0);
    return Math.max(1, Math.ceil((current.getTime() - due.getTime()) / 86400000));
  };

  const getFineAmount = (item: BorrowedBook) =>
    item.status === 'Overdue' ? getOverdueDays(item.dueDate) * FINE_PER_DAY : 0;

  const openFinePayment = (bookId: number) => {
    const item = borrowed.find((entry) => entry.bookId === bookId);
    if (!item || item.status !== 'Overdue') {
      showNotification('Payment unavailable', 'No overdue fine was found for this book.', 'warning');
      return;
    }
    if (paidFineBookIds.includes(bookId)) {
      showNotification('Already paid', 'The overdue fine for this book has already been recorded as paid.', 'success');
      return;
    }
    setPaymentMethod('UPI');
    setPaymentBookId(bookId);
  };

  const confirmFinePayment = () => {
    if (paymentBookId === null) return;
    const bookId = paymentBookId;
    const item = borrowed.find((entry) => entry.bookId === bookId);
    const book = getBook(bookId);
    if (!item || !book) {
      setPaymentBookId(null);
      showNotification('Payment failed', 'Unable to find the selected book or fine details.', 'error');
      return;
    }
    if (paidFineBookIds.includes(bookId)) {
      setPaymentBookId(null);
      showNotification('Already paid', 'This fine has already been recorded as paid.', 'info');
      return;
    }
    const amount = getFineAmount(item);
    if (amount <= 0) {
      setPaymentBookId(null);
      showNotification('No outstanding fine', 'There is no outstanding amount to pay.', 'info');
      return;
    }
    const transactionId = createLibraryTransactionId();
    setPaidFineBookIds((current) => current.includes(bookId) ? current : [...current, bookId]);
    setPaymentReceipt({ amount, bookTitle: book.title, transactionId, method: paymentMethod });
    setPaymentBookId(null);
  };

  const unpaidFines = borrowed.filter(
    (item) => item.status === 'Overdue' && !paidFineBookIds.includes(item.bookId)
  );
  const totalOutstandingFine = unpaidFines.reduce(
    (total, item) => total + getFineAmount(item), 0
  );

  const availableCount = books.reduce(
    (total, book) => total + book.availableCopies,
    0
  );

  const filteredBooks = useMemo(() => {
    const query = search.trim().toLowerCase();

    return books.filter((book) => {
      const matchesCategory =
        category === 'All' || book.category === category;

      const matchesSearch =
        !query ||
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query) ||
        book.isbn.includes(query) ||
        book.category.toLowerCase().includes(query);

      const matchesAvailability =
        !availabilityOnly || book.availableCopies > 0;

      return matchesCategory && matchesSearch && matchesAvailability;
    });
  }, [search, category, availabilityOnly]);

  const clearFilters = () => {
    setSearch('');
    setCategory('All');
    setAvailabilityOnly(false);
  };

  const handleBorrow = (book: Book) => {
    if (borrowedBookIds.includes(book.id)) {
      showNotification('Already issued', 'This book is already in your account.', 'info');
      return;
    }

    if (requested.includes(book.id)) {
      showNotification('Request pending', 'You already have a borrowing request for this book.', 'warning');
      return;
    }

    if (reserved.includes(book.id)) {
      showNotification('Already reserved', 'This book is already in your reservation list.', 'info');
      return;
    }

    if (book.availableCopies <= 0) {
      handleReserve(book);
      return;
    }

    if (borrowed.length >= MAX_BOOKS) {
      showNotification(
        'Borrowing limit reached',
        `You can have a maximum of ${MAX_BOOKS} books issued at a time. Please return a book before requesting another.`,
        'warning'
      );
      return;
    }

    showNotification(
      'Request this book',
      `Would you like to request "${book.title}"?\n\nYour request will be sent to the librarian for approval.`,
      'info',
      [
        { text: 'Not now', style: 'cancel' },
        {
          text: 'Confirm request',
          onPress: () => {
            setRequested((current) => [...current, book.id]);
            setSelectedBook(null);
            showNotification(
              'Request submitted',
              'Your borrowing request is now awaiting librarian approval.',
              'success'
            );
          },
        },
      ]
    );
  };

  const handleReserve = (book: Book) => {
    if (reserved.includes(book.id)) {
      showNotification('Already reserved', 'This book is already in your reservation list.', 'info');
      return;
    }

    if (borrowedBookIds.includes(book.id)) {
      showNotification('Already issued', 'This book is already in your account.', 'info');
      return;
    }

    if (requested.includes(book.id)) {
      showNotification('Request pending', 'You already have a borrowing request for this book.', 'warning');
      return;
    }

    showNotification(
      'Reserve this book',
      `Would you like to reserve "${book.title}"?`,
      'info',
      [
        { text: 'Not now', style: 'cancel' },
        {
          text: 'Confirm reservation',
          onPress: () => {
            setReserved((current) => [...current, book.id]);
            setSelectedBook(null);
            showNotification(
              'Reservation submitted',
              'Your reservation request has been recorded.',
              'success'
            );
          },
        },
      ]
    );
  };

  const cancelReservation = (id: number) => {
    const book = getBook(id);
    showNotification(
      'Cancel reservation',
      `Are you sure you want to cancel your reservation for "${book?.title ?? 'this book'}"?`,
      'warning',
      [
        { text: 'Keep reservation', style: 'cancel' },
        {
          text: 'Cancel reservation',
          style: 'destructive',
          onPress: () => setReserved((current) => current.filter((item) => item !== id)),
        },
      ]
    );
  };

  const cancelRequest = (id: number) => {
    const book = getBook(id);
    showNotification(
      'Cancel borrowing request',
      `Cancel your request for "${book?.title ?? 'this book'}"?`,
      'warning',
      [
        { text: 'Keep request', style: 'cancel' },
        {
          text: 'Cancel request',
          style: 'destructive',
          onPress: () => setRequested((current) => current.filter((item) => item !== id)),
        },
      ]
    );
  };

  const handleRenew = (bookId: number) => {
    const item = borrowed.find((entry) => entry.bookId === bookId);
    if (!item) return;

    if (item.status === 'Overdue') {
      showNotification(
        'Renewal unavailable',
        'This book is overdue. Please contact the librarian regarding renewal.',
        'warning'
      );
      return;
    }

    showNotification(
      'Request renewal',
      'Would you like to send a renewal request to the librarian?',
      'info',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Request renewal',
          onPress: () =>
            showNotification(
              'Renewal request submitted',
              'Your renewal request is awaiting librarian approval.',
              'success'
            ),
        },
      ]
    );
  };

  const handleReturn = (bookId: number) => {
    const book = getBook(bookId);
    const borrowedItem = borrowed.find((item) => item.bookId === bookId);
    if (borrowedItem?.status === 'Overdue' && !paidFineBookIds.includes(bookId)) {
      showNotification(
        'Outstanding fine',
        'Please settle the overdue fine before returning this book.',
        'warning',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Pay fine', onPress: () => openFinePayment(bookId) },
        ]
      );
      return;
    }
    showNotification(
      'Return book',
      `Are you sure you want to return "${book?.title ?? 'this book'}"?`,
      'warning',
      [
        { text: 'Keep book', style: 'cancel' },
        {
          text: 'Confirm return',
          onPress: () => {
            setBorrowed((current) => current.filter((item) => item.bookId !== bookId));
            setHistory((current) => current.includes(bookId) ? current : [...current, bookId]);
            showNotification(
              'Return recorded',
              'Your return has been recorded. Final confirmation is subject to librarian verification.',
              'success'
            );
          },
        },
      ]
    );
  };

  const renderSectionTitle = (
    title: string,
    subtitle?: string,
    action?: () => void,
    actionLabel?: string
  ) => (
    <View className="mb-3 flex-row items-center justify-between">
      <View className="flex-1">
        <Text className="text-[17px] font-extrabold text-[#202B49]">
          {title}
        </Text>
        {subtitle ? (
          <Text className="mt-1 text-[11px] text-[#8992A6]">
            {subtitle}
          </Text>
        ) : null}
      </View>

      {action && actionLabel ? (
        <Pressable onPress={action} hitSlop={8}>
          <Text className="text-xs font-bold text-[#6478E8]">
            {actionLabel}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );

  const renderBookCover = (
    book: Book,
    width: number = 68,
    height: number = 94
  ) => (
    <View
      style={{
        width,
        height,
        backgroundColor: book.color,
        borderRadius: 11,
        overflow: 'hidden',
      }}
      className="items-center justify-center"
    >
      <View className="absolute left-2 top-0 h-full w-[2px] bg-white/20" />
      <Ionicons name="book" size={27} color="#FFFFFF" />
      <View className="mt-3 h-[2px] w-7 bg-white/60" />
      <View className="mt-1 h-[2px] w-5 bg-white/30" />
      <View className="absolute bottom-0 w-full items-center bg-black/10 py-1">
        <Text className="text-[7px] font-bold tracking-widest text-white">
          CAMPUS
        </Text>
      </View>
    </View>
  );

  const renderBook = (book: Book) => {
    const isBorrowed = borrowedBookIds.includes(book.id);
    const isReserved = reserved.includes(book.id);
    const isRequested = requested.includes(book.id);
    const isAvailable = book.availableCopies > 0;

    return (
      <Pressable
        key={book.id}
        onPress={() => setSelectedBook(book)}
        className="mb-3 rounded-[22px] border border-[#E9EDF5] bg-white p-4"
        style={{ elevation: 1 }}
      >
        <View className="flex-row">
          {renderBookCover(book, 68, 96)}

          <View className="ml-4 flex-1">
            <View className="flex-row items-start">
              <Text className="flex-1 text-[14px] font-extrabold leading-5 text-[#202B49]">
                {book.title}
              </Text>

              <Ionicons
                name="chevron-forward"
                size={17}
                color={C.muted}
                style={{ marginLeft: 5 }}
              />
            </View>

            <Text className="mt-1 text-[11px] text-[#8992A6]">
              {book.author}
            </Text>

            <View className="mt-2 self-start rounded-lg bg-[#F1F3F8] px-2.5 py-1">
              <Text className="text-[9px] font-bold text-[#65708A]">
                {book.category}
              </Text>
            </View>

            <View className="mt-3 flex-row items-center">
              <View
                className="h-2 w-2 rounded-full"
                style={{
                  backgroundColor: isAvailable ? C.green : C.red,
                }}
              />
              <Text
                className="ml-1.5 text-[10px] font-bold"
                style={{ color: isAvailable ? C.green : C.red }}
              >
                {isAvailable
                  ? `${book.availableCopies} copies available`
                  : 'Currently unavailable'}
              </Text>
            </View>
          </View>
        </View>

        <View className="mt-4 flex-row items-center justify-between border-t border-[#F0F2F7] pt-3">
          <View className="flex-row items-center">
            <Ionicons name="location-outline" size={14} color={C.muted} />
            <Text className="ml-1 text-[10px] text-[#8992A6]">
              Shelf {book.shelf}
            </Text>
          </View>

          {isBorrowed ? (
            <View className="rounded-lg bg-[#EAF8F1] px-3 py-2">
              <Text className="text-[10px] font-bold text-[#259B78]">
                Issued to you
              </Text>
            </View>
          ) : isRequested ? (
            <View className="rounded-lg bg-[#FFF5E8] px-3 py-2">
              <Text className="text-[10px] font-bold text-[#D99035]">
                Request pending
              </Text>
            </View>
          ) : isReserved ? (
            <View className="rounded-lg bg-[#EEF1FF] px-3 py-2">
              <Text className="text-[10px] font-bold text-[#6478E8]">
                Reserved
              </Text>
            </View>
          ) : (
            <Pressable
              onPress={() => handleBorrow(book)}
              className="flex-row items-center rounded-xl bg-[#202B49] px-3.5 py-2.5"
            >
              <Text className="text-[10px] font-bold text-white">
                {isAvailable ? 'Request issue' : 'Reserve'}
              </Text>
              <Ionicons
                name="arrow-forward"
                size={13}
                color="#FFFFFF"
                style={{ marginLeft: 5 }}
              />
            </Pressable>
          )}
        </View>
      </Pressable>
    );
  };

  const renderBorrowedBook = (item: BorrowedBook) => {
    const book = getBook(item.bookId);
    if (!book) return null;

    const isOverdue = item.status === 'Overdue';

    return (
      <View
        key={item.bookId}
        className="mb-3 rounded-[22px] border border-[#E9EDF5] bg-white p-4"
      >
        <View className="flex-row">
          {renderBookCover(book, 56, 76)}

          <View className="ml-3 flex-1">
            <Text className="text-[13px] font-extrabold leading-5 text-[#202B49]">
              {book.title}
            </Text>

            <Text className="mt-1 text-[10px] text-[#8992A6]">
              {book.author}
            </Text>

            <View
              className="mt-2 self-start rounded-lg px-2.5 py-1"
              style={{
                backgroundColor: isOverdue ? C.paleRed : C.paleGreen,
              }}
            >
              <Text
                className="text-[9px] font-extrabold"
                style={{
                  color: isOverdue ? C.red : C.green,
                }}
              >
                {isOverdue ? 'OVERDUE' : 'CURRENTLY ISSUED'}
              </Text>
            </View>
          </View>
        </View>

        <View className="mt-4 flex-row rounded-2xl bg-[#F7F8FC] p-3.5">
          <View className="flex-1">
            <Text className="text-[10px] text-[#8992A6]">Issue date</Text>
            <Text className="mt-1.5 text-xs font-bold text-[#202B49]">
              {item.issueDate}
            </Text>
          </View>

          <View className="h-8 w-px bg-[#E5E8F0]" />

          <View className="flex-1 pl-4">
            <Text className="text-[10px] text-[#8992A6]">Due date</Text>
            <Text
              className="mt-1.5 text-xs font-bold"
              style={{ color: isOverdue ? C.red : C.navy }}
            >
              {item.dueDate}
            </Text>
          </View>
        </View>

        {isOverdue ? (
          <View className="mt-3 rounded-2xl border border-[#F7D9DC] bg-[#FFF7F7] p-3.5">
            <View className="flex-row items-center">
              <Ionicons name="alert-circle-outline" size={18} color={C.red} />
              <Text className="ml-2 flex-1 text-[10px] font-extrabold text-[#B64D57]">
                {paidFineBookIds.includes(item.bookId) ? 'OVERDUE FINE PAID' : `${getOverdueDays(item.dueDate)} DAY(S) OVERDUE`}
              </Text>
              <Text className="text-[14px] font-extrabold text-[#B64D57]">
                ₹{getFineAmount(item).toFixed(2)}
              </Text>
            </View>
            <Text className="mt-1.5 text-[9px] leading-4 text-[#A65C64]">
              {paidFineBookIds.includes(item.bookId)
                ? 'Your sample fine payment has been recorded on this device.'
                : `Late fee calculated at ₹${FINE_PER_DAY} per day. Pay the outstanding fine below.`}
            </Text>
            <Pressable
              onPress={() => openFinePayment(item.bookId)}
              disabled={paidFineBookIds.includes(item.bookId)}
              className="mt-3 flex-row items-center justify-center rounded-xl py-3"
              style={{ backgroundColor: paidFineBookIds.includes(item.bookId) ? '#EAF8F1' : C.navy }}
            >
              <Ionicons
                name={paidFineBookIds.includes(item.bookId) ? 'checkmark-circle-outline' : 'card-outline'}
                size={16}
                color={paidFineBookIds.includes(item.bookId) ? C.green : '#FFFFFF'}
              />
              <Text
                className="ml-2 text-[10px] font-extrabold"
                style={{ color: paidFineBookIds.includes(item.bookId) ? C.green : '#FFFFFF' }}
              >
                {paidFineBookIds.includes(item.bookId) ? 'Fine paid' : `Pay fine · ₹${getFineAmount(item).toFixed(2)}`}
              </Text>
            </Pressable>
          </View>
        ) : null}

        <View className="mt-3 flex-row">
          <Pressable
            onPress={() => handleRenew(item.bookId)}
            className="mr-2 flex-1 flex-row items-center justify-center rounded-xl bg-[#EEF1FF] py-3"
          >
            <Ionicons name="refresh-outline" size={16} color={C.blue} />
            <Text className="ml-2 text-[11px] font-bold text-[#6478E8]">
              Request renewal
            </Text>
          </Pressable>

          <Pressable
            onPress={() => handleReturn(item.bookId)}
            className="flex-1 flex-row items-center justify-center rounded-xl bg-[#202B49] py-3"
          >
            <Ionicons
              name="return-down-back-outline"
              size={16}
              color="#FFFFFF"
            />
            <Text className="ml-2 text-[11px] font-bold text-white">
              Return book
            </Text>
          </Pressable>
        </View>
      </View>
    );
  };

  const renderEmptyState = (
    icon: keyof typeof Ionicons.glyphMap,
    title: string,
    subtitle: string,
    action?: () => void,
    actionText?: string
  ) => (
    <View className="items-center rounded-[22px] border border-[#E9EDF5] bg-white px-6 py-9">
      <View className="h-14 w-14 items-center justify-center rounded-2xl bg-[#EEF1FF]">
        <Ionicons name={icon} size={27} color={C.blue} />
      </View>

      <Text className="mt-4 text-sm font-extrabold text-[#202B49]">
        {title}
      </Text>

      <Text className="mt-2 text-center text-[11px] leading-5 text-[#8992A6]">
        {subtitle}
      </Text>

      {action && actionText ? (
        <Pressable
          onPress={action}
          className="mt-4 rounded-xl bg-[#202B49] px-5 py-3"
        >
          <Text className="text-[11px] font-bold text-white">
            {actionText}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-[#F6F8FC]" edges={['top']}>
      <StatusBar barStyle="dark-content"  />

      {/* HEADER */}
      <View className="flex-row items-center justify-between px-5 pb-3 pt-2">
        <View className="flex-row items-center">
          <Pressable
            onPress={()=>router.back()}
            className="mr-3 h-10 w-10 items-center justify-center rounded-2xl border border-[#E9EDF5] bg-white"
          >
            <Ionicons name="arrow-back" size={20} color={C.navy} />
          </Pressable>

          <View>
            <Text className="text-[9px] font-extrabold tracking-[2px] text-[#8992A6]">
              CAMPUSOS
            </Text>
            <Text className="mt-0.5 text-xl font-extrabold text-[#202B49]">
              College Library
            </Text>
          </View>
        </View>

        <Pressable
          onPress={() => setShowRules(true)}
          className="h-10 w-10 items-center justify-center rounded-2xl border border-[#E9EDF5] bg-white"
        >
          <Ionicons
            name="information-circle-outline"
            size={21}
            color={C.navy}
          />
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 35 }}
      >
        {/* PREMIUM LIGHT HERO */}
        <View className="px-5 pt-2">
          <LinearGradient
            colors={['#F0F3FF', '#E7EEFF', '#F5F2FF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              borderRadius: 25,
              padding: 20,
              overflow: 'hidden',
              borderWidth: 1,
              borderColor: '#E3E9FA',
            }}
          >
            <View
              style={{
                position: 'absolute',
                right: -38,
                top: -45,
                width: 155,
                height: 155,
                borderRadius: 100,
                borderWidth: 25,
                borderColor: '#FFFFFF55',
              }}
            />

            <View className="flex-row items-center">
              <View className="flex-1">
                <View className="self-start flex-row items-center rounded-full bg-white/80 px-3 py-1.5">
                  <View className="h-1.5 w-1.5 rounded-full bg-[#6478E8]" />
                  <Text className="ml-2 text-[9px] font-extrabold tracking-widest text-[#6478E8]">
                    STUDENT LIBRARY
                  </Text>
                </View>

                <Text className="mt-3 text-[25px] font-extrabold leading-8 text-[#202B49]">
                  Your knowledge,{' '}
                  <Text className="text-[#6478E8]">your space.</Text>
                </Text>

                <Text className="mt-2 max-w-[230px] text-[11px] leading-5 text-[#68738D]">
                  Explore your college collection and manage your borrowing
                  activity in one place.
                </Text>
              </View>

              <View className="ml-2 h-[82px] w-[76px] items-center justify-center rounded-[22px] border border-white bg-white/75">
                <Ionicons name="library" size={37} color={C.blue} />
                <Text className="mt-1 text-[8px] font-extrabold tracking-widest text-[#6478E8]">
                  CAMPUS
                </Text>
              </View>
            </View>

            <View className="mt-5 flex-row rounded-2xl border border-white/80 bg-white/65 p-3.5">
              <View className="flex-1">
                <Text className="text-xl font-extrabold text-[#202B49]">
                  {books.length}
                </Text>
                <Text className="mt-1 text-[9px] font-medium text-[#8992A6]">
                  Book titles
                </Text>
              </View>

              <View className="mx-2 h-9 w-px bg-[#DDE3F2]" />

              <View className="flex-1">
                <Text className="text-xl font-extrabold text-[#202B49]">
                  {availableCount}
                </Text>
                <Text className="mt-1 text-[9px] font-medium text-[#8992A6]">
                  Available copies
                </Text>
              </View>

              <View className="mx-2 h-9 w-px bg-[#DDE3F2]" />

              <View className="flex-1">
                <Text className="text-xl font-extrabold text-[#202B49]">
                  {borrowed.length}
                </Text>
                <Text className="mt-1 text-[9px] font-medium text-[#8992A6]">
                  Your issued books
                </Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* ACCOUNT OVERVIEW */}
        <View className="px-5 pt-5">
          {renderSectionTitle(
            'My library account',
            'Your borrowing activity at a glance',
            () => setActiveTab('My Books'),
            'View details'
          )}

          <View className="flex-row">
            <Pressable
              onPress={() => setActiveTab('My Books')}
              className="mr-2.5 flex-1 rounded-[19px] border border-[#E9EDF5] bg-white p-3.5"
            >
              <View className="h-9 w-9 items-center justify-center rounded-xl bg-[#EEF1FF]">
                <Ionicons name="book-outline" size={19} color={C.blue} />
              </View>
              <Text className="mt-3 text-[23px] font-extrabold text-[#202B49]">
                {borrowed.length}
              </Text>
              <Text className="mt-1 text-[9px] font-semibold text-[#8992A6]">
                Issued books
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setActiveTab('My Books')}
              className="mr-2.5 flex-1 rounded-[19px] border border-[#E9EDF5] bg-white p-3.5"
            >
              <View className="h-9 w-9 items-center justify-center rounded-xl bg-[#FFF0F1]">
                <Ionicons
                  name="alert-circle-outline"
                  size={19}
                  color={C.red}
                />
              </View>
              <Text className="mt-3 text-[23px] font-extrabold text-[#202B49]">
                {overdueCount}
              </Text>
              <Text className="mt-1 text-[9px] font-semibold text-[#8992A6]">
                Overdue
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setActiveTab('History')}
              className="flex-1 rounded-[19px] border border-[#E9EDF5] bg-white p-3.5"
            >
              <View className="h-9 w-9 items-center justify-center rounded-xl bg-[#EAF8F1]">
                <Ionicons
                  name="checkmark-done-outline"
                  size={19}
                  color={C.green}
                />
              </View>
              <Text className="mt-3 text-[23px] font-extrabold text-[#202B49]">
                {history.length}
              </Text>
              <Text className="mt-1 text-[9px] font-semibold text-[#8992A6]">
                Returned
              </Text>
            </Pressable>
          </View>
        </View>

        {/* TABS */}
        <View className="mx-5 mt-6 flex-row rounded-2xl bg-[#EAEDF5] p-1">
          {tabs.map((tab) => {
            const isActive = activeTab === tab;

            return (
              <Pressable
                key={tab}
                onPress={() => setActiveTab(tab)}
                className="flex-1 items-center rounded-xl py-3"
                style={{
                  backgroundColor: isActive ? '#FFFFFF' : 'transparent',
                  elevation: isActive ? 2 : 0,
                }}
              >
                <Text
                  className="text-[11px] font-extrabold"
                  style={{ color: isActive ? C.navy : C.muted }}
                >
                  {tab}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* CATALOGUE */}
        {activeTab === 'Catalogue' ? (
          <>
            <View className="px-5 pt-5">
              {renderSectionTitle(
                'Find your next book',
                'Search by title, author, ISBN or subject'
              )}

              <View className="flex-row items-center rounded-2xl border border-[#E5E9F2] bg-white px-4">
                <Ionicons name="search-outline" size={19} color={C.muted} />

                <TextInput
                  value={search}
                  onChangeText={setSearch}
                  placeholder="Search books or authors..."
                  placeholderTextColor="#A3AABD"
                  className="h-[50px] flex-1 px-3 text-[12px] text-[#202B49]"
                  returnKeyType="search"
                />

                {search.length > 0 ? (
                  <Pressable onPress={() => setSearch('')}>
                    <Ionicons
                      name="close-circle"
                      size={19}
                      color={C.muted}
                    />
                  </Pressable>
                ) : null}
              </View>

              {/* AVAILABILITY FILTER */}
              <Pressable
                onPress={() => setAvailabilityOnly((value) => !value)}
                className="mt-3 flex-row items-center justify-between rounded-2xl border border-[#E9EDF5] bg-white px-4 py-3"
              >
                <View className="flex-row items-center">
                  <View className="h-8 w-8 items-center justify-center rounded-lg bg-[#EAF8F1]">
                    <Ionicons
                      name="checkmark-circle-outline"
                      size={18}
                      color={C.green}
                    />
                  </View>

                  <View className="ml-3">
                    <Text className="text-[11px] font-bold text-[#202B49]">
                      Available books only
                    </Text>
                    <Text className="mt-0.5 text-[9px] text-[#8992A6]">
                      Hide unavailable titles
                    </Text>
                  </View>
                </View>

                <View
                  className="h-6 w-11 justify-center rounded-full px-1"
                  style={{
                    backgroundColor: availabilityOnly ? C.blue : '#DDE1EA',
                    alignItems: availabilityOnly ? 'flex-end' : 'flex-start',
                  }}
                >
                  <View className="h-4 w-4 rounded-full bg-white" />
                </View>
              </Pressable>
            </View>

            {/* DEPARTMENT FILTERS */}
            <View className="pt-5">
              <Text className="mb-3 px-5 text-[13px] font-extrabold text-[#202B49]">
                Browse departments
              </Text>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 20 }}
              >
                {categories.map((item) => {
                  const selected = category === item;

                  return (
                    <Pressable
                      key={item}
                      onPress={() => setCategory(item)}
                      className="mr-2 rounded-full border px-4 py-2.5"
                      style={{
                        backgroundColor: selected ? C.navy : '#FFFFFF',
                        borderColor: selected ? C.navy : C.border,
                      }}
                    >
                      <Text
                        className="text-[10px] font-bold"
                        style={{
                          color: selected ? '#FFFFFF' : C.muted,
                        }}
                      >
                        {item}
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
            </View>

            {/* COLLECTION */}
            <View className="px-5 pt-5">
              <View className="mb-3 flex-row items-center justify-between">
                <View>
                  <Text className="text-[17px] font-extrabold text-[#202B49]">
                    Library collection
                  </Text>
                  <Text className="mt-1 text-[10px] text-[#8992A6]">
                    {filteredBooks.length} titles matching your search
                  </Text>
                </View>

                <Pressable
                  onPress={clearFilters}
                  className="flex-row items-center rounded-xl bg-[#EEF1FF] px-3 py-2"
                >
                  <Ionicons name="options-outline" size={14} color={C.blue} />
                  <Text className="ml-1.5 text-[10px] font-bold text-[#6478E8]">
                    Reset
                  </Text>
                </Pressable>
              </View>

              {filteredBooks.length > 0 ? (
                filteredBooks.map(renderBook)
              ) : (
                renderEmptyState(
                  'search-outline',
                  'No books found',
                  'Try another title, author or department. You can also reset your filters.',
                  clearFilters,
                  'Clear filters'
                )
              )}
            </View>

            {/* LIBRARY HOURS */}
            <View className="mx-5 mt-2 rounded-[22px] border border-[#E9EDF5] bg-white p-4">
              <View className="flex-row items-center">
                <View className="h-11 w-11 items-center justify-center rounded-xl bg-[#EEF1FF]">
                  <Ionicons name="time-outline" size={21} color={C.blue} />
                </View>

                <View className="ml-3 flex-1">
                  <Text className="text-[13px] font-extrabold text-[#202B49]">
                    Library working hours
                  </Text>
                  <Text className="mt-1 text-[10px] text-[#8992A6]">
                    Plan your visit to the library
                  </Text>
                </View>

                <Pressable onPress={() => setShowRules(true)}>
                  <Ionicons
                    name="chevron-forward"
                    size={18}
                    color={C.muted}
                  />
                </Pressable>
              </View>

              <View className="mt-4 border-t border-[#F0F2F7] pt-3">
                <View className="flex-row justify-between">
                  <Text className="text-[10px] text-[#8992A6]">
                    Monday – Friday
                  </Text>
                  <Text className="text-[10px] font-bold text-[#202B49]">
                    9:00 AM – 5:00 PM
                  </Text>
                </View>

                <View className="mt-3 flex-row justify-between">
                  <Text className="text-[10px] text-[#8992A6]">
                    Saturday
                  </Text>
                  <Text className="text-[10px] font-bold text-[#202B49]">
                    9:00 AM – 1:00 PM
                  </Text>
                </View>

                <View className="mt-3 flex-row justify-between">
                  <Text className="text-[10px] text-[#8992A6]">
                    Sunday
                  </Text>
                  <Text className="text-[10px] font-bold text-[#DC626B]">
                    Closed
                  </Text>
                </View>

                <Text className="mt-3 text-[9px] leading-4 text-[#A0A7B7]">
                  Sample timings. Replace these with your college library&apos;s
                  actual working hours.
                </Text>
              </View>
            </View>
          </>
        ) : null}

        {/* MY BOOKS */}
        {activeTab === 'My Books' ? (
          <View className="px-5 pt-5">
            {renderSectionTitle(
              'My issued books',
              `${borrowed.length} of ${MAX_BOOKS} borrowing slots used`
            )}

            {totalOutstandingFine > 0 ? (
              <View className="mb-4 rounded-[22px] border border-[#F3D7DA] bg-white p-4">
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    <View className="h-10 w-10 items-center justify-center rounded-xl bg-[#FFF0F1]">
                      <Ionicons name="wallet-outline" size={20} color={C.red} />
                    </View>
                    <View className="ml-3">
                      <Text className="text-[11px] font-extrabold text-[#202B49]">Outstanding library fines</Text>
                      <Text className="mt-1 text-[9px] text-[#8992A6]">{unpaidFines.length} overdue book(s) · ₹{FINE_PER_DAY}/day</Text>
                    </View>
                  </View>
                  <Text className="text-[19px] font-extrabold text-[#DC626B]">₹{totalOutstandingFine.toFixed(2)}</Text>
                </View>
                <Text className="mt-3 text-[9px] leading-4 text-[#8992A6]">
                  Pay each overdue book&apos;s fine from its card below. This is a sample frontend payment flow.
                </Text>
              </View>
            ) : null}

            {/* BORROWING LIMIT */}
            <View className="mb-4 rounded-[20px] border border-[#E9EDF5] bg-white p-4">
              <View className="flex-row items-center justify-between">
                <Text className="text-[11px] font-bold text-[#202B49]">
                  Borrowing capacity
                </Text>
                <Text className="text-[10px] font-bold text-[#6478E8]">
                  {borrowed.length}/{MAX_BOOKS}
                </Text>
              </View>

              <View className="mt-3 h-2 overflow-hidden rounded-full bg-[#EEF0F5]">
                <View
                  className="h-full rounded-full bg-[#6478E8]"
                  style={{
                    width: `${Math.min(
                      (borrowed.length / MAX_BOOKS) * 100,
                      100
                    )}%`,
                  }}
                />
              </View>

              <Text className="mt-2 text-[9px] text-[#8992A6]">
                {Math.max(0, MAX_BOOKS - borrowed.length)} borrowing slots
                remaining.
              </Text>
            </View>

            {borrowed.length > 0 ? (
              borrowed.map(renderBorrowedBook)
            ) : (
              renderEmptyState(
                'library-outline',
                'No books issued',
                'Browse the catalogue and request a book from your college library.',
                () => setActiveTab('Catalogue'),
                'Browse catalogue'
              )
            )}

            {/* RESERVATIONS */}
            <View className="mb-3 mt-5">
              {renderSectionTitle(
                'My reservations',
                'Books you have reserved'
              )}
            </View>

            {reserved.length > 0 ? (
              reserved.map((id) => {
                const book = getBook(id);
                if (!book) return null;

                return (
                  <View
                    key={id}
                    className="mb-3 flex-row items-center rounded-[19px] border border-[#E9EDF5] bg-white p-3.5"
                  >
                    {renderBookCover(book, 43, 57)}

                    <View className="ml-3 flex-1">
                      <Text className="text-[12px] font-bold text-[#202B49]">
                        {book.title}
                      </Text>
                      <Text className="mt-1 text-[10px] text-[#8992A6]">
                        Reservation request
                      </Text>
                      <Text className="mt-1 text-[9px] font-bold text-[#D99035]">
                        WAITING FOR AVAILABILITY
                      </Text>
                    </View>

                    <Pressable
                      onPress={() => cancelReservation(id)}
                      className="h-9 w-9 items-center justify-center rounded-xl bg-[#FFF0F1]"
                    >
                      <Ionicons
                        name="close-outline"
                        size={19}
                        color={C.red}
                      />
                    </Pressable>
                  </View>
                );
              })
            ) : (
              <View className="rounded-2xl border border-[#E9EDF5] bg-white p-4">
                <Text className="text-[10px] text-[#8992A6]">
                  You have no active reservations.
                </Text>
              </View>
            )}

            {/* PENDING REQUESTS */}
            <View className="mb-3 mt-5">
              {renderSectionTitle(
                'Borrowing requests',
                'Requests awaiting librarian approval'
              )}
            </View>

            {requested.length > 0 ? (
              requested.map((id) => {
                const book = getBook(id);
                if (!book) return null;

                return (
                  <View
                    key={id}
                    className="mb-3 flex-row items-center rounded-[19px] border border-[#E9EDF5] bg-white p-3.5"
                  >
                    {renderBookCover(book, 43, 57)}

                    <View className="ml-3 flex-1">
                      <Text className="text-[12px] font-bold text-[#202B49]">
                        {book.title}
                      </Text>
                      <Text className="mt-1 text-[9px] font-bold text-[#D99035]">
                        AWAITING APPROVAL
                      </Text>
                    </View>

                    <Pressable
                      onPress={() => cancelRequest(id)}
                      className="h-9 w-9 items-center justify-center rounded-xl bg-[#FFF0F1]"
                    >
                      <Ionicons
                        name="close-outline"
                        size={19}
                        color={C.red}
                      />
                    </Pressable>
                  </View>
                );
              })
            ) : (
              <View className="rounded-2xl border border-[#E9EDF5] bg-white p-4">
                <Text className="text-[10px] text-[#8992A6]">
                  You have no pending borrowing requests.
                </Text>
              </View>
            )}
          </View>
        ) : null}

        {/* HISTORY */}
        {activeTab === 'History' ? (
          <View className="px-5 pt-5">
            {renderSectionTitle(
              'Borrowing history',
              'Your previously borrowed and returned books'
            )}

            {history.length > 0 ? (
              history.map((id, index) => {
                const book = getBook(id);
                if (!book) return null;

                return (
                  <View
                    key={`${id}-${index}`}
                    className="mt-3 flex-row items-center rounded-[20px] border border-[#E9EDF5] bg-white p-4"
                  >
                    {renderBookCover(book, 49, 66)}

                    <View className="ml-3 flex-1">
                      <Text className="text-[12px] font-extrabold text-[#202B49]">
                        {book.title}
                      </Text>

                      <Text className="mt-1 text-[10px] text-[#8992A6]">
                        {book.author}
                      </Text>

                      <View className="mt-2 self-start flex-row items-center rounded-lg bg-[#EAF8F1] px-2.5 py-1">
                        <Ionicons
                          name="checkmark-circle"
                          size={11}
                          color={C.green}
                        />
                        <Text className="ml-1 text-[9px] font-bold text-[#259B78]">
                          RETURNED
                        </Text>
                      </View>
                    </View>

                    <Ionicons
                      name="checkmark-done-circle"
                      size={22}
                      color={C.green}
                    />
                  </View>
                );
              })
            ) : (
              renderEmptyState(
                'time-outline',
                'No borrowing history',
                'Your returned books will appear here once you complete a return.'
              )
            )}
          </View>
        ) : null}

        {/* LIBRARY SUPPORT */}
        <View className="mx-5 mt-6 rounded-[22px] border border-[#E9EDF5] bg-white p-4">
          <View className="flex-row items-center">
            <View className="h-11 w-11 items-center justify-center rounded-xl bg-[#F3EFFF]">
              <Ionicons
                name="help-buoy-outline"
                size={21}
                color={C.purple}
              />
            </View>

            <View className="ml-3 flex-1">
              <Text className="text-[13px] font-extrabold text-[#202B49]">
                Library help & support
              </Text>
              <Text className="mt-1 text-[10px] text-[#8992A6]">
                Borrowing guidelines and student assistance
              </Text>
            </View>
          </View>

          <Pressable
            onPress={() => setShowRules(true)}
            className="mt-4 flex-row items-center justify-between border-t border-[#F0F2F7] pt-3"
          >
            <Text className="text-[11px] font-bold text-[#6478E8]">
              View library policies
            </Text>
            <Ionicons name="chevron-forward" size={17} color={C.blue} />
          </Pressable>
        </View>
      </ScrollView>

      {/* BOOK DETAILS MODAL */}
      <Modal
        visible={selectedBook !== null}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedBook(null)}
      >
        <View className="flex-1 justify-end bg-black/35">
          <Pressable
            className="flex-1"
            onPress={() => setSelectedBook(null)}
          />

          {selectedBook ? (
            <View
              className="rounded-t-[30px] bg-[#F7F8FC] px-5 pb-8 pt-4"
              style={{ maxHeight: '88%' }}
            >
              <View className="mb-5 h-1 w-12 self-center rounded-full bg-[#D9DDE8]" />

              <ScrollView showsVerticalScrollIndicator={false}>
                <View className="flex-row">
                  {renderBookCover(selectedBook, 82, 116)}

                  <View className="ml-4 flex-1">
                    <Text className="text-[17px] font-extrabold leading-6 text-[#202B49]">
                      {selectedBook.title}
                    </Text>

                    <Text className="mt-2 text-[11px] text-[#8992A6]">
                      {selectedBook.author}
                    </Text>

                    <View className="mt-3 self-start rounded-lg bg-[#EEF1FF] px-3 py-1.5">
                      <Text className="text-[9px] font-bold text-[#6478E8]">
                        {selectedBook.category}
                      </Text>
                    </View>

                    <View className="mt-3 flex-row items-center">
                      <View
                        className="h-2 w-2 rounded-full"
                        style={{
                          backgroundColor:
                            selectedBook.availableCopies > 0
                              ? C.green
                              : C.red,
                        }}
                      />
                      <Text
                        className="ml-1.5 text-[10px] font-bold"
                        style={{
                          color:
                            selectedBook.availableCopies > 0
                              ? C.green
                              : C.red,
                        }}
                      >
                        {selectedBook.availableCopies > 0
                          ? `${selectedBook.availableCopies} copies available`
                          : 'Currently unavailable'}
                      </Text>
                    </View>
                  </View>
                </View>

                <View className="mt-5 rounded-[20px] border border-[#E9EDF5] bg-white p-4">
                  <Text className="text-[13px] font-extrabold text-[#202B49]">
                    About this book
                  </Text>

                  <Text className="mt-2 text-[11px] leading-5 text-[#8992A6]">
                    {selectedBook.description}
                  </Text>

                  <View className="mt-4 flex-row border-t border-[#F0F2F7] pt-3">
                    <View className="flex-1">
                      <Text className="text-[9px] text-[#8992A6]">
                        Publisher
                      </Text>
                      <Text className="mt-1 text-[11px] font-bold text-[#202B49]">
                        {selectedBook.publisher}
                      </Text>
                    </View>

                    <View className="flex-1">
                      <Text className="text-[9px] text-[#8992A6]">
                        Edition
                      </Text>
                      <Text className="mt-1 text-[11px] font-bold text-[#202B49]">
                        {selectedBook.edition}
                      </Text>
                    </View>
                  </View>

                  <View className="mt-4 flex-row">
                    <View className="flex-1">
                      <Text className="text-[9px] text-[#8992A6]">
                        Publication year
                      </Text>
                      <Text className="mt-1 text-[11px] font-bold text-[#202B49]">
                        {selectedBook.year}
                      </Text>
                    </View>

                    <View className="flex-1">
                      <Text className="text-[9px] text-[#8992A6]">
                        Shelf location
                      </Text>
                      <Text className="mt-1 text-[11px] font-bold text-[#202B49]">
                        {selectedBook.shelf}
                      </Text>
                    </View>
                  </View>

                  <View className="mt-4">
                    <Text className="text-[9px] text-[#8992A6]">ISBN</Text>
                    <Text className="mt-1 text-[11px] font-bold text-[#202B49]">
                      {selectedBook.isbn}
                    </Text>
                  </View>

                  <View className="mt-4 flex-row">
                    <View className="flex-1">
                      <Text className="text-[9px] text-[#8992A6]">
                        Total copies
                      </Text>
                      <Text className="mt-1 text-[11px] font-bold text-[#202B49]">
                        {selectedBook.totalCopies}
                      </Text>
                    </View>

                    <View className="flex-1">
                      <Text className="text-[9px] text-[#8992A6]">
                        Available copies
                      </Text>
                      <Text className="mt-1 text-[11px] font-bold text-[#259B78]">
                        {selectedBook.availableCopies}
                      </Text>
                    </View>
                  </View>
                </View>

                <View className="mt-4 flex-row">
                  <Pressable
                    onPress={() => setSelectedBook(null)}
                    className="mr-2 h-12 w-12 items-center justify-center rounded-xl border border-[#E9EDF5] bg-white"
                  >
                    <Ionicons name="close" size={20} color={C.navy} />
                  </Pressable>

                  <Pressable
                    onPress={() => handleBorrow(selectedBook)}
                    disabled={
                      borrowedBookIds.includes(selectedBook.id) ||
                      requested.includes(selectedBook.id) ||
                      reserved.includes(selectedBook.id)
                    }
                    className="h-12 flex-1 flex-row items-center justify-center rounded-xl bg-[#202B49]"
                    style={{
                      opacity:
                        borrowedBookIds.includes(selectedBook.id) ||
                        requested.includes(selectedBook.id) ||
                        reserved.includes(selectedBook.id)
                          ? 0.55
                          : 1,
                    }}
                  >
                    <Ionicons
                      name={
                        selectedBook.availableCopies > 0
                          ? 'book-outline'
                          : 'bookmark-outline'
                      }
                      size={17}
                      color="#FFFFFF"
                    />

                    <Text className="ml-2 text-[11px] font-bold text-white">
                      {borrowedBookIds.includes(selectedBook.id)
                        ? 'Already issued'
                        : requested.includes(selectedBook.id)
                          ? 'Request pending'
                          : reserved.includes(selectedBook.id)
                            ? 'Already reserved'
                            : selectedBook.availableCopies > 0
                              ? 'Request this book'
                              : 'Reserve this book'}
                    </Text>
                  </Pressable>
                </View>

                <Text className="mb-2 mt-3 text-center text-[9px] text-[#8992A6]">
                  Borrowing requests are subject to librarian approval.
                </Text>
              </ScrollView>
            </View>
          ) : null}
        </View>
      </Modal>

      {/* LIBRARY POLICIES MODAL */}
      <Modal
        visible={showRules}
        transparent
        animationType="fade"
        onRequestClose={() => setShowRules(false)}
      >
        <View className="flex-1 items-center justify-center bg-black/40 px-5">
          <View className="w-full rounded-[27px] bg-white p-5">
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-[18px] font-extrabold text-[#202B49]">
                  Library policies
                </Text>
                <Text className="mt-1 text-[10px] text-[#8992A6]">
                  Student borrowing guidelines
                </Text>
              </View>

              <Pressable
                onPress={() => setShowRules(false)}
                className="h-9 w-9 items-center justify-center rounded-full bg-[#F2F4F8]"
              >
                <Ionicons name="close" size={19} color={C.navy} />
              </Pressable>
            </View>

            {[
              {
                icon: 'book-outline' as const,
                title: 'Book borrowing',
                description:
                  'Students may borrow books according to the college library borrowing limit.',
              },
              {
                icon: 'calendar-outline' as const,
                title: 'Return dates',
                description:
                  'Return books on or before the due date to avoid overdue charges.',
              },
              {
                icon: 'refresh-outline' as const,
                title: 'Renewals',
                description:
                  'Renewal requests may depend on availability and librarian approval.',
              },
              {
                icon: 'alert-circle-outline' as const,
                title: 'Late returns',
                description:
                  'Applicable fines are calculated according to your college library policy.',
              },
              {
                icon: 'bookmark-outline' as const,
                title: 'Reservations',
                description:
                  'Unavailable books may be reserved and collected when they become available.',
              },
            ].map((rule) => (
              <View key={rule.title} className="mt-4 flex-row items-start">
                <View className="h-9 w-9 items-center justify-center rounded-xl bg-[#EEF1FF]">
                  <Ionicons name={rule.icon} size={18} color={C.blue} />
                </View>

                <View className="ml-3 flex-1">
                  <Text className="text-[11px] font-extrabold text-[#202B49]">
                    {rule.title}
                  </Text>
                  <Text className="mt-1 text-[10px] leading-4 text-[#8992A6]">
                    {rule.description}
                  </Text>
                </View>
              </View>
            ))}

            <View className="mt-5 rounded-xl bg-[#FFF5E8] p-3">
              <Text className="text-[9px] leading-4 text-[#9B713B]">
                These are sample guidelines. Replace them with your college&apos;s
                official borrowing limits, loan periods, return rules and
                fine rates.
              </Text>
            </View>

            <Pressable
              onPress={() => setShowRules(false)}
              className="mt-4 items-center rounded-xl bg-[#202B49] py-3.5"
            >
              <Text className="text-[11px] font-bold text-white">Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* OVERDUE FINE PAYMENT MODAL */}
      <Modal
        visible={paymentBookId !== null}
        transparent
        animationType="slide"
        statusBarTranslucent
        onRequestClose={() => setPaymentBookId(null)}
      >
        <View className="flex-1 justify-end bg-black/45">
          <Pressable className="flex-1" onPress={() => setPaymentBookId(null)} />
          {paymentBookId !== null ? (() => {
            const item = borrowed.find((entry) => entry.bookId === paymentBookId);
            const book = getBook(paymentBookId);
            if (!item || !book) return null;
            const amount = getFineAmount(item);
            return (
              <View className="rounded-t-[30px] bg-[#F7F8FC] px-5 pb-8 pt-5">
                <View className="mb-4 h-1 w-12 self-center rounded-full bg-[#D9DDE8]" />
                <View className="flex-row items-center justify-between">
                  <View>
                    <Text className="text-[19px] font-extrabold text-[#202B49]">Pay overdue fine</Text>
                    <Text className="mt-1 text-[10px] text-[#8992A6]">Review your library fine before payment</Text>
                  </View>
                  <Pressable onPress={() => setPaymentBookId(null)} className="h-9 w-9 items-center justify-center rounded-full bg-white">
                    <Ionicons name="close" size={19} color={C.navy} />
                  </Pressable>
                </View>

                <View className="mt-5 flex-row items-center rounded-2xl border border-[#E9EDF5] bg-white p-3.5">
                  {renderBookCover(book, 45, 61)}
                  <View className="ml-3 flex-1">
                    <Text className="text-[12px] font-extrabold text-[#202B49]">{book.title}</Text>
                    <Text className="mt-1 text-[9px] text-[#8992A6]">Due date: {item.dueDate}</Text>
                    <Text className="mt-1 text-[9px] font-bold text-[#DC626B]">{getOverdueDays(item.dueDate)} day(s) overdue</Text>
                  </View>
                </View>

                <View className="mt-4 rounded-2xl border border-[#E9EDF5] bg-white p-4">
                  <View className="flex-row justify-between">
                    <Text className="text-[10px] text-[#8992A6]">Late fee per day</Text>
                    <Text className="text-[10px] font-bold text-[#202B49]">₹{FINE_PER_DAY}.00</Text>
                  </View>
                  <View className="mt-3 flex-row justify-between">
                    <Text className="text-[10px] text-[#8992A6]">Overdue days</Text>
                    <Text className="text-[10px] font-bold text-[#202B49]">{getOverdueDays(item.dueDate)} days</Text>
                  </View>
                  <View className="mt-3 border-t border-[#F0F2F7] pt-3 flex-row items-center justify-between">
                    <Text className="text-[12px] font-extrabold text-[#202B49]">Total payable</Text>
                    <Text className="text-[22px] font-extrabold text-[#DC626B]">₹{amount.toFixed(2)}</Text>
                  </View>
                </View>

                <Text className="mb-2 mt-5 text-[11px] font-extrabold text-[#202B49]">Select payment method</Text>
                {([
                  { key: 'UPI' as const, icon: 'phone-portrait-outline' as const, detail: 'Google Pay, PhonePe, Paytm or UPI app' },
                  { key: 'Card' as const, icon: 'card-outline' as const, detail: 'Debit or credit card' },
                  { key: 'Cash at library' as const, icon: 'cash-outline' as const, detail: 'Pay at the library counter' },
                ]).map((method) => {
                  const selected = paymentMethod === method.key;
                  return (
                    <Pressable
                      key={method.key}
                      onPress={() => setPaymentMethod(method.key)}
                      className="mb-2 flex-row items-center rounded-xl border bg-white p-3"
                      style={{ borderColor: selected ? C.blue : C.border }}
                    >
                      <Ionicons name={method.icon} size={19} color={selected ? C.blue : C.muted} />
                      <View className="ml-3 flex-1">
                        <Text className="text-[10px] font-extrabold text-[#202B49]">{method.key}</Text>
                        <Text className="mt-0.5 text-[9px] text-[#8992A6]">{method.detail}</Text>
                      </View>
                      <Ionicons name={selected ? 'radio-button-on' : 'radio-button-off'} size={18} color={selected ? C.blue : C.muted} />
                    </Pressable>
                  );
                })}

                <Pressable
                  onPress={confirmFinePayment}
                  className="mt-3 h-12 flex-row items-center justify-center rounded-xl bg-[#202B49]"
                >
                  <Ionicons name="lock-closed-outline" size={15} color="#FFFFFF" />
                  <Text className="ml-2 text-[11px] font-extrabold text-white">
                    {paymentMethod === 'Cash at library' ? 'Record counter payment' : `Continue · ₹${amount.toFixed(2)}`}
                  </Text>
                </Pressable>
                <Text className="mt-3 text-center text-[9px] leading-4 text-[#9AA2B2]">
                  Demo only: this screen records a local payment status. Connect a verified payment gateway and backend before accepting real payments.
                </Text>
              </View>
            );
          })() : null}
        </View>
      </Modal>

      {/* PAYMENT RECEIPT MODAL */}
      <Modal
        visible={paymentReceipt !== null}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => setPaymentReceipt(null)}
      >
        <View className="flex-1 items-center justify-center bg-black/45 px-5">
          {paymentReceipt ? (
            <View className="w-full rounded-[27px] bg-white p-5" style={{ maxWidth: 390 }}>
              <View className="h-14 w-14 items-center justify-center self-center rounded-2xl bg-[#EAF8F1]">
                <Ionicons name="checkmark-circle" size={30} color={C.green} />
              </View>
              <Text className="mt-4 text-center text-[18px] font-extrabold text-[#202B49]">Payment recorded</Text>
              <Text className="mt-1 text-center text-[10px] text-[#8992A6]">Library fine payment receipt</Text>
              <View className="mt-5 rounded-2xl bg-[#F7F8FC] p-4">
                <Text className="text-center text-[9px] font-bold tracking-widest text-[#8992A6]">AMOUNT PAID</Text>
                <Text className="mt-1 text-center text-[27px] font-extrabold text-[#269B78]">₹{paymentReceipt.amount.toFixed(2)}</Text>
                <View className="mt-4 border-t border-[#E9EDF5] pt-3">
                  <Text className="text-[9px] text-[#8992A6]">Book</Text>
                  <Text className="mt-1 text-[10px] font-bold text-[#202B49]">{paymentReceipt.bookTitle}</Text>
                  <Text className="mt-3 text-[9px] text-[#8992A6]">Payment method</Text>
                  <Text className="mt-1 text-[10px] font-bold text-[#202B49]">{paymentReceipt.method}</Text>
                  <Text className="mt-3 text-[9px] text-[#8992A6]">Reference ID</Text>
                  <Text className="mt-1 text-[10px] font-bold text-[#202B49]">{paymentReceipt.transactionId}</Text>
                </View>
              </View>
              <Pressable
                onPress={() => {
                  setPaymentReceipt(null);
                  showNotification('Fine payment recorded', 'The overdue fine is marked as paid in this demo. A real payment receipt requires payment gateway verification.', 'success');
                }}
                className="mt-5 items-center rounded-xl bg-[#202B49] py-3.5"
              >
                <Text className="text-[11px] font-extrabold text-white">Done</Text>
              </Pressable>
            </View>
          ) : null}
        </View>
      </Modal>

      {/* CUSTOM NOTIFICATION POPUP */}
      <Modal
        visible={notification !== null}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={closeNotification}
      >
        <View className="flex-1 items-center justify-center bg-black/45 px-6">
          <Pressable
            className="absolute inset-0"
            onPress={closeNotification}
          />
          {notification ? (() => {
            const palette = {
              success: { icon: 'checkmark' as const, color: C.green, soft: C.paleGreen },
              error: { icon: 'close' as const, color: C.red, soft: C.paleRed },
              warning: { icon: 'alert' as const, color: C.orange, soft: C.paleOrange },
              info: { icon: 'information' as const, color: C.blue, soft: C.paleBlue },
            }[notification.type];

            return (
              <View
                className="w-full rounded-[28px] bg-white p-5"
                style={{ maxWidth: 390, elevation: 18 }}
              >
                <View className="flex-row items-start justify-between">
                  <View
                    className="h-14 w-14 items-center justify-center rounded-2xl"
                    style={{ backgroundColor: palette.soft }}
                  >
                    <Ionicons name={palette.icon} size={27} color={palette.color} />
                  </View>
                  <Pressable
                    onPress={closeNotification}
                    hitSlop={10}
                    className="h-9 w-9 items-center justify-center rounded-full bg-[#F4F6FA]"
                  >
                    <Ionicons name="close" size={19} color={C.muted} />
                  </Pressable>
                </View>

                <Text className="mt-5 text-[18px] font-extrabold text-[#202B49]">
                  {notification.title}
                </Text>
                <Text className="mt-2 text-[12px] leading-5 text-[#77819A]">
                  {notification.message}
                </Text>

                <View className="mt-6 flex-row">
                  {notification.actions.map((action, index) => {
                    const destructive = action.style === 'destructive';
                    const cancel = action.style === 'cancel';
                    const isLast = index === notification.actions.length - 1;
                    return (
                      <Pressable
                        key={`${action.text}-${index}`}
                        onPress={() => {
                          closeNotification();
                          action.onPress?.();
                        }}
                        className="min-h-[46px] flex-1 items-center justify-center rounded-xl px-3"
                        style={{
                          marginLeft: index > 0 ? 9 : 0,
                          backgroundColor: cancel ? '#F1F3F8' : destructive ? C.paleRed : isLast ? C.navy : C.paleBlue,
                        }}
                      >
                        <Text
                          className="text-center text-[11px] font-extrabold"
                          style={{ color: cancel ? C.navy : destructive ? C.red : isLast ? '#FFFFFF' : C.blue }}
                        >
                          {action.text}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>

                <View className="mt-5 flex-row items-center justify-center border-t border-[#F0F2F7] pt-4">
                  <View className="h-5 w-5 items-center justify-center rounded-md bg-[#EEF1FF]">
                    <Text className="text-[10px] font-extrabold text-[#6478E8]">C</Text>
                  </View>
                  <Text className="ml-2 text-[9px] font-bold tracking-[1.5px] text-[#A0A7B7]">
                    CAMPUSOS · STUDENT LIBRARY
                  </Text>
                </View>
              </View>
            );
          })() : null}
        </View>
      </Modal>
    </SafeAreaView>
  );
}
