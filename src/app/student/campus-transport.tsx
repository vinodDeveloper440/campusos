import React, { useEffect, useMemo, useState } from 'react';
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
import {
  CampusTransportMap,
  type CampusTransportStop,
} from '../../components/CampusTransportMap';

type ServiceDay = 'Weekdays' | 'Saturday' | 'Sunday';

type ServiceWindow = {
  firstDeparture: number;
  lastDeparture: number;
  frequencyMinutes: number;
} | null;

type TransportRoute = {
  id: string;
  code: string;
  name: string;
  destination: string;
  description: string;
  color: string;
  tint: string;
  durationMinutes: number;
  schedule: Record<ServiceDay, ServiceWindow>;
  stops: CampusTransportStop[];
};

type Departure = {
  time: string;
  detail: string;
  minutesUntil: number | null;
  departureMinutes: number | null;
};

const COLORS = {
  navy: '#202B49',
  blue: '#6478E8',
  muted: '#8992A8',
  border: '#E9EDF5',
  background: '#F6F8FD',
  green: '#259B78',
  paleBlue: '#EEF2FF',
  paleGreen: '#EAF8F1',
  paleOrange: '#FFF4E9',
};

const ROUTES: TransportRoute[] = [
  {
    id: 'campus-loop',
    code: 'C1',
    name: 'Campus Loop',
    destination: 'Main campus',
    description: 'A convenient loop between the main campus buildings.',
    color: '#6478E8',
    tint: '#EEF2FF',
    durationMinutes: 25,
    schedule: {
      Weekdays: {
        firstDeparture: 7 * 60 + 15,
        lastDeparture: 19 * 60 + 15,
        frequencyMinutes: 20,
      },
      Saturday: {
        firstDeparture: 8 * 60,
        lastDeparture: 15 * 60,
        frequencyMinutes: 30,
      },
      Sunday: null,
    },
    stops: [
      { id: 'main-gate', name: 'Main Gate', detail: 'North entrance', minutesFromStart: 0, point: { x: 0.13, y: 0.72 } },
      { id: 'library', name: 'Library', detail: 'Library plaza', minutesFromStart: 5, point: { x: 0.33, y: 0.28 } },
      { id: 'academic-block', name: 'Academic Block', detail: 'Block A drop-off', minutesFromStart: 10, point: { x: 0.53, y: 0.68 } },
      { id: 'cafeteria', name: 'Cafeteria', detail: 'East courtyard', minutesFromStart: 16, point: { x: 0.74, y: 0.3 } },
      { id: 'hostel-gate', name: 'Hostel Gate', detail: 'Residence entrance', minutesFromStart: 22, point: { x: 0.88, y: 0.7 } },
    ],
  },
  {
    id: 'town-connector',
    code: 'C2',
    name: 'Town Connector',
    destination: 'Town & transit hub',
    description: 'Campus connections to the town transit points.',
    color: '#259B78',
    tint: '#EAF8F1',
    durationMinutes: 45,
    schedule: {
      Weekdays: {
        firstDeparture: 7 * 60 + 30,
        lastDeparture: 18 * 60 + 30,
        frequencyMinutes: 45,
      },
      Saturday: {
        firstDeparture: 8 * 60 + 30,
        lastDeparture: 14 * 60 + 30,
        frequencyMinutes: 60,
      },
      Sunday: null,
    },
    stops: [
      { id: 'town-campus-gate', name: 'Campus Gate', detail: 'Main entrance', minutesFromStart: 0, point: { x: 0.12, y: 0.7 } },
      { id: 'bus-hub', name: 'City Bus Hub', detail: 'Central bus interchange', minutesFromStart: 10, point: { x: 0.36, y: 0.34 } },
      { id: 'railway-station', name: 'Railway Station', detail: 'Station forecourt', minutesFromStart: 23, point: { x: 0.62, y: 0.69 } },
      { id: 'market-square', name: 'Market Square', detail: 'South-side pickup', minutesFromStart: 35, point: { x: 0.87, y: 0.28 } },
    ],
  },
  {
    id: 'hostel-shuttle',
    code: 'C3',
    name: 'Hostel Shuttle',
    destination: 'Hostel & campus',
    description: 'A frequent shuttle between residence and study areas.',
    color: '#D99035',
    tint: '#FFF4E9',
    durationMinutes: 16,
    schedule: {
      Weekdays: {
        firstDeparture: 6 * 60 + 30,
        lastDeparture: 22 * 60 + 30,
        frequencyMinutes: 15,
      },
      Saturday: {
        firstDeparture: 7 * 60,
        lastDeparture: 21 * 60,
        frequencyMinutes: 20,
      },
      Sunday: {
        firstDeparture: 8 * 60,
        lastDeparture: 20 * 60,
        frequencyMinutes: 30,
      },
    },
    stops: [
      { id: 'residence', name: 'Residence Block', detail: 'Hostel pickup bay', minutesFromStart: 0, point: { x: 0.15, y: 0.28 } },
      { id: 'sports-centre', name: 'Sports Centre', detail: 'West entrance', minutesFromStart: 4, point: { x: 0.39, y: 0.69 } },
      { id: 'study-hall', name: 'Study Hall', detail: 'North walkway', minutesFromStart: 9, point: { x: 0.64, y: 0.29 } },
      { id: 'shuttle-main-gate', name: 'Main Gate', detail: 'South entrance', minutesFromStart: 14, point: { x: 0.88, y: 0.69 } },
    ],
  },
];

const DAYS: ServiceDay[] = ['Weekdays', 'Saturday', 'Sunday'];

function getTodayServiceDay(date: Date): ServiceDay {
  const day = date.getDay();
  if (day === 6) return 'Saturday';
  if (day === 0) return 'Sunday';
  return 'Weekdays';
}

function formatClock(minutes: number): string {
  const hours24 = Math.floor(minutes / 60) % 24;
  const hours12 = hours24 % 12 || 12;
  const minute = String(minutes % 60).padStart(2, '0');
  const suffix = hours24 >= 12 ? 'PM' : 'AM';
  return `${hours12}:${minute} ${suffix}`;
}

function getDeparture(
  route: TransportRoute,
  selectedDay: ServiceDay,
  now: Date,
): Departure {
  const window = route.schedule[selectedDay];
  if (!window) {
    return {
      time: 'No service',
      detail: 'This route does not run on Sundays.',
      minutesUntil: null,
      departureMinutes: null,
    };
  }

  const isToday = getTodayServiceDay(now) === selectedDay;
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const elapsed = isToday ? currentMinutes - window.firstDeparture : 0;
  const departuresPassed = Math.max(
    0,
    Math.ceil(elapsed / window.frequencyMinutes),
  );
  const departureMinutes =
    window.firstDeparture + departuresPassed * window.frequencyMinutes;

  if (departureMinutes > window.lastDeparture) {
    return {
      time: 'Service ended',
      detail: 'Check the next service day for departures.',
      minutesUntil: null,
      departureMinutes: null,
    };
  }

  if (!isToday) {
    return {
      time: formatClock(departureMinutes),
      detail: 'First departure on this service day',
      minutesUntil: null,
      departureMinutes,
    };
  }

  const minutesUntil = Math.max(0, departureMinutes - currentMinutes);
  return {
    time: formatClock(departureMinutes),
    detail:
      minutesUntil === 0
        ? 'Scheduled to depart now'
        : `Next scheduled bus in ${minutesUntil} min`,
    minutesUntil,
    departureMinutes,
  };
}

function SectionHeading({
  title,
  subtitle,
  trailing,
}: {
  title: string;
  subtitle: string;
  trailing?: React.ReactNode;
}) {
  return (
    <View className="mb-4 mt-7 flex-row items-end justify-between">
      <View className="flex-1 pr-3">
        <Text className="text-[19px] font-extrabold text-[#202B49]">{title}</Text>
        <Text className="mt-1 text-[11px] text-[#8992A8]">{subtitle}</Text>
      </View>
      {trailing}
    </View>
  );
}

function DayChip({
  day,
  active,
  onPress,
}: {
  day: ServiceDay;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      onPress={onPress}
      className={`mr-2 rounded-full px-4 py-3 ${
        active ? 'bg-[#202B49]' : 'border border-[#E9EDF5] bg-white'
      }`}
      style={
        active
          ? {
              shadowColor: COLORS.navy,
              shadowOpacity: 0.12,
              shadowRadius: 7,
              elevation: 2,
            }
          : undefined
      }
    >
      <Text
        className={`text-[11px] font-bold ${
          active ? 'text-white' : 'text-[#77829D]'
        }`}
      >
        {day}
      </Text>
    </Pressable>
  );
}

export default function CampusTransportScreen() {
  const [search, setSearch] = useState('');
  const [selectedDay, setSelectedDay] = useState<ServiceDay>(() =>
    getTodayServiceDay(new Date()),
  );
  const [selectedRouteId, setSelectedRouteId] = useState(ROUTES[0].id);
  const [selectedStopId, setSelectedStopId] = useState(ROUTES[0].stops[0].id);
  const [savedRouteIds, setSavedRouteIds] = useState<string[]>([]);
  const [expandedMap, setExpandedMap] = useState(false);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(timer);
  }, []);

  const visibleRoutes = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return ROUTES;
    return ROUTES.filter((route) =>
      [route.name, route.destination, route.description, route.code, ...route.stops.map((stop) => stop.name)]
        .join(' ')
        .toLowerCase()
        .includes(query),
    );
  }, [search]);

  const selectedRoute =
    ROUTES.find((route) => route.id === selectedRouteId) ?? ROUTES[0];
  const selectedStop =
    selectedRoute.stops.find((stop) => stop.id === selectedStopId) ??
    selectedRoute.stops[0];
  const departure = getDeparture(selectedRoute, selectedDay, now);
  const saved = savedRouteIds.includes(selectedRoute.id);

  const selectRoute = (route: TransportRoute) => {
    setSelectedRouteId(route.id);
    setSelectedStopId(route.stops[0].id);
  };

  const toggleSavedRoute = (routeId: string) => {
    setSavedRouteIds((current) =>
      current.includes(routeId)
        ? current.filter((id) => id !== routeId)
        : [...current, routeId],
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F6F8FD]">
      <StatusBar barStyle="dark-content" />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
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
                shadowColor: '#202B49',
                shadowOpacity: 0.04,
                shadowRadius: 8,
                elevation: 1,
              }}
            >
              <Ionicons name="arrow-back" size={21} color={COLORS.navy} />
            </Pressable>

            <View className="items-center">
              <Text className="text-[10px] font-extrabold tracking-[2.5px] text-[#8992A8]">
                CAMPUSOS
              </Text>
              <Text className="mt-1 text-[16px] font-bold text-[#202B49]">
                Campus Transport
              </Text>
            </View>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Get transport help"
              onPress={() => router.push('/student/student-support')}
              className="h-11 w-11 items-center justify-center rounded-2xl border border-[#E9EDF5] bg-white"
            >
              <Ionicons
                name="help-circle-outline"
                size={23}
                color={COLORS.navy}
              />
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
              className="absolute -right-8 -top-12 h-40 w-40 rounded-full"
              style={{ backgroundColor: '#6478E8', opacity: 0.07 }}
            />
            <View className="flex-row items-center justify-between">
              <View className="h-12 w-12 items-center justify-center rounded-2xl bg-white">
                <Ionicons name="bus-outline" size={25} color={COLORS.blue} />
              </View>
              <View className="flex-row items-center rounded-full border border-[#DCE4FF] bg-white/80 px-3 py-2">
                <View className="mr-2 h-2 w-2 rounded-full bg-[#259B78]" />
                <Text className="text-[9px] font-bold text-[#52617F]">
                  ROUTES & TIMETABLES
                </Text>
              </View>
            </View>
            <Text className="mt-5 text-[25px] font-extrabold leading-[33px] text-[#202B49]">
              Your ride,{'\n'}right on schedule.
            </Text>
            <Text className="mt-2 max-w-[285px] text-[12px] leading-[20px] text-[#77829D]">
              Find a route, choose your pickup stop and check the next scheduled shuttle.
            </Text>
            <View className="mt-4 flex-row items-center">
              <Ionicons name="shield-checkmark" size={16} color={COLORS.green} />
              <Text className="ml-2 text-[10px] font-semibold text-[#52617F]">
                One simple view for every campus trip
              </Text>
            </View>
          </LinearGradient>

          <View className="mt-4 flex-row">
            <View className="mr-3 flex-1 rounded-2xl border border-[#E9EDF5] bg-white p-4">
              <View className="mb-2 h-9 w-9 items-center justify-center rounded-xl bg-[#EEF2FF]">
                <Ionicons name="git-branch-outline" size={19} color={COLORS.blue} />
              </View>
              <Text className="text-[21px] font-extrabold text-[#202B49]">
                {String(ROUTES.length).padStart(2, '0')}
              </Text>
              <Text className="mt-1 text-[10px] font-medium text-[#8992A8]">
                Shuttle routes
              </Text>
            </View>
            <View className="mr-3 flex-1 rounded-2xl border border-[#E9EDF5] bg-white p-4">
              <View className="mb-2 h-9 w-9 items-center justify-center rounded-xl bg-[#EAF8F1]">
                <Ionicons name="location-outline" size={19} color={COLORS.green} />
              </View>
              <Text className="text-[21px] font-extrabold text-[#202B49]">
                {ROUTES.reduce((count, route) => count + route.stops.length, 0)}
              </Text>
              <Text className="mt-1 text-[10px] font-medium text-[#8992A8]">
                Route stops
              </Text>
            </View>
            <View className="flex-1 rounded-2xl border border-[#E9EDF5] bg-white p-4">
              <View className="mb-2 h-9 w-9 items-center justify-center rounded-xl bg-[#FFF4E9]">
                <Ionicons name="time-outline" size={19} color="#D99035" />
              </View>
              <Text className="text-[21px] font-extrabold text-[#202B49]">15m</Text>
              <Text className="mt-1 text-[10px] font-medium text-[#8992A8]">
                Frequent shuttle
              </Text>
            </View>
          </View>

          <View
            className="mt-6 flex-row items-center rounded-2xl border border-[#E8ECF4] bg-white px-4"
            style={{
              height: 55,
              shadowColor: '#202B49',
              shadowOpacity: 0.025,
              shadowRadius: 10,
              elevation: 1,
            }}
          >
            <Ionicons name="search-outline" size={21} color="#8992A8" />
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Search routes or stops..."
              placeholderTextColor="#A3ABBD"
              className="h-full flex-1 px-3 text-[13px] text-[#202B49]"
              returnKeyType="search"
              autoCapitalize="none"
              accessibilityLabel="Search campus routes and stops"
            />
            {search.length > 0 && (
              <Pressable onPress={() => setSearch('')} hitSlop={10}>
                <Ionicons name="close-circle" size={20} color="#8992A8" />
              </Pressable>
            )}
          </View>

          <SectionHeading
            title="Choose a service day"
            subtitle="Timetables change on weekends"
          />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 3 }}
          >
            {DAYS.map((day) => (
              <DayChip
                key={day}
                day={day}
                active={day === selectedDay}
                onPress={() => setSelectedDay(day)}
              />
            ))}
          </ScrollView>

          <SectionHeading
            title="Available routes"
            subtitle="Select a shuttle to see its map and stops"
            trailing={
              <View className="rounded-xl bg-[#EEF2FF] px-3 py-2">
                <Text className="text-[10px] font-bold text-[#6478E8]">
                  {visibleRoutes.length} ROUTES
                </Text>
              </View>
            }
          />
          {visibleRoutes.length > 0 ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 3 }}
            >
              {visibleRoutes.map((route) => {
                const active = route.id === selectedRoute.id;
                const routeDeparture = getDeparture(route, selectedDay, now);
                const routeSaved = savedRouteIds.includes(route.id);
                return (
                  <Pressable
                    key={route.id}
                    accessibilityRole="button"
                    accessibilityState={{ selected: active }}
                    onPress={() => selectRoute(route)}
                    className={`mr-3 w-[245px] rounded-[22px] border p-4 ${
                      active
                        ? 'border-[#C9D3FF] bg-white'
                        : 'border-[#E9EDF5] bg-white'
                    }`}
                    style={{
                      shadowColor: COLORS.navy,
                      shadowOpacity: active ? 0.055 : 0.025,
                      shadowRadius: 10,
                      shadowOffset: { width: 0, height: 4 },
                      elevation: active ? 2 : 1,
                    }}
                  >
                    <View className="flex-row items-start justify-between">
                      <View className="flex-row items-center">
                        <View
                          className="h-10 w-10 items-center justify-center rounded-xl"
                          style={{ backgroundColor: route.tint }}
                        >
                          <Ionicons name="bus-outline" size={21} color={route.color} />
                        </View>
                        <View className="ml-3">
                          <Text className="text-[13px] font-extrabold text-[#202B49]">
                            {route.name}
                          </Text>
                          <Text className="mt-1 text-[10px] font-semibold text-[#8992A8]">
                            {route.code} · {route.destination}
                          </Text>
                        </View>
                      </View>
                      <Pressable
                        accessibilityRole="button"
                        accessibilityLabel={`${routeSaved ? 'Remove' : 'Save'} ${route.name}`}
                        hitSlop={8}
                        onPress={() => toggleSavedRoute(route.id)}
                        className="h-8 w-8 items-center justify-center rounded-full bg-[#F7F8FC]"
                      >
                        <Ionicons
                          name={routeSaved ? 'bookmark' : 'bookmark-outline'}
                          size={16}
                          color={routeSaved ? route.color : '#8992A8'}
                        />
                      </Pressable>
                    </View>
                    <View className="mt-4 h-px bg-[#F0F1F6]" />
                    <View className="mt-3 flex-row items-center justify-between">
                      <View className="flex-row items-center">
                        <Ionicons name="time-outline" size={14} color={route.color} />
                        <Text className="ml-1.5 text-[10px] font-bold text-[#52617F]">
                          {routeDeparture.time}
                        </Text>
                      </View>
                      <Text className="text-[10px] font-semibold text-[#8992A8]">
                        {route.schedule[selectedDay]?.frequencyMinutes
                          ? `Every ${route.schedule[selectedDay]?.frequencyMinutes} min`
                          : 'No service'}
                      </Text>
                    </View>
                  </Pressable>
                );
              })}
            </ScrollView>
          ) : (
            <View className="items-center rounded-3xl border border-[#E9EDF5] bg-white px-6 py-10">
              <View className="mb-4 h-14 w-14 items-center justify-center rounded-2xl bg-[#EEF2FF]">
                <Ionicons name="search-outline" size={26} color={COLORS.blue} />
              </View>
              <Text className="text-base font-bold text-[#202B49]">No routes found</Text>
              <Text className="mt-2 text-center text-xs leading-5 text-[#8992A8]">
                Try another route name or stop.
              </Text>
            </View>
          )}

          <View className="mt-5 overflow-hidden rounded-[24px] border border-[#E9EDF5] bg-white p-4">
            <View className="flex-row items-start justify-between">
              <View className="flex-1 pr-3">
                <View className="flex-row items-center">
                  <View
                    className="mr-2 rounded-lg px-2 py-1"
                    style={{ backgroundColor: selectedRoute.tint }}
                  >
                    <Text
                      className="text-[10px] font-extrabold"
                      style={{ color: selectedRoute.color }}
                    >
                      {selectedRoute.code}
                    </Text>
                  </View>
                  <Text className="text-[18px] font-extrabold text-[#202B49]">
                    {selectedRoute.name}
                  </Text>
                </View>
                <Text className="mt-2 text-[11px] leading-[18px] text-[#8992A8]">
                  {selectedRoute.description}
                </Text>
              </View>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`${saved ? 'Remove saved route' : 'Save route'} ${selectedRoute.name}`}
                onPress={() => toggleSavedRoute(selectedRoute.id)}
                className="h-10 w-10 items-center justify-center rounded-xl bg-[#F7F8FC]"
              >
                <Ionicons
                  name={saved ? 'bookmark' : 'bookmark-outline'}
                  size={19}
                  color={saved ? selectedRoute.color : COLORS.muted}
                />
              </Pressable>
            </View>

            <View className="mt-4 flex-row items-center rounded-2xl bg-[#F7F8FC] p-3">
              <View
                className="mr-3 h-10 w-10 items-center justify-center rounded-xl"
                style={{ backgroundColor: selectedRoute.tint }}
              >
                <Ionicons name="time-outline" size={20} color={selectedRoute.color} />
              </View>
              <View className="flex-1">
                <Text className="text-[9px] font-extrabold tracking-[1px] text-[#8992A8]">
                  NEXT SCHEDULED DEPARTURE
                </Text>
                <Text className="mt-1 text-[17px] font-extrabold text-[#202B49]">
                  {departure.time}
                </Text>
              </View>
              <View className="items-end">
                <View className="flex-row items-center rounded-full bg-[#EAF8F1] px-2.5 py-1.5">
                  <View className="mr-1.5 h-1.5 w-1.5 rounded-full bg-[#259B78]" />
                  <Text className="text-[9px] font-bold text-[#259B78]">
                    SCHEDULED
                  </Text>
                </View>
                <Text className="mt-1.5 text-[9px] text-[#8992A8]">
                  {departure.minutesUntil === null
                    ? selectedDay
                    : departure.minutesUntil === 0
                      ? 'Departing now'
                      : `In ${departure.minutesUntil} min`}
                </Text>
              </View>
            </View>

            <View className="mt-4 flex-row">
              <View className="flex-1">
                <Text className="text-[9px] font-bold tracking-[0.8px] text-[#8992A8]">
                  FREQUENCY
                </Text>
                <Text className="mt-1 text-[12px] font-extrabold text-[#202B49]">
                  {selectedRoute.schedule[selectedDay]
                    ? `Every ${selectedRoute.schedule[selectedDay]?.frequencyMinutes} min`
                    : 'No service'}
                </Text>
              </View>
              <View className="flex-1 border-l border-[#EEF0F5] pl-4">
                <Text className="text-[9px] font-bold tracking-[0.8px] text-[#8992A8]">
                  TRIP TIME
                </Text>
                <Text className="mt-1 text-[12px] font-extrabold text-[#202B49]">
                  About {selectedRoute.durationMinutes} min
                </Text>
              </View>
              <View className="flex-1 border-l border-[#EEF0F5] pl-4">
                <Text className="text-[9px] font-bold tracking-[0.8px] text-[#8992A8]">
                  STOPS
                </Text>
                <Text className="mt-1 text-[12px] font-extrabold text-[#202B49]">
                  {selectedRoute.stops.length} stops
                </Text>
              </View>
            </View>
          </View>

          <SectionHeading
            title="Route map"
            subtitle="Schematic route view · not to scale"
            trailing={
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={expandedMap ? 'Collapse map' : 'Expand map'}
                onPress={() => setExpandedMap((value) => !value)}
                className="h-9 w-9 items-center justify-center rounded-xl border border-[#E9EDF5] bg-white"
              >
                <Ionicons
                  name={expandedMap ? 'contract-outline' : 'expand-outline'}
                  size={17}
                  color={COLORS.navy}
                />
              </Pressable>
            }
          />
          <CampusTransportMap
            routeName={selectedRoute.name}
            routeColor={selectedRoute.color}
            stops={selectedRoute.stops}
            selectedStopId={selectedStop.id}
            onSelectStop={setSelectedStopId}
            expanded={expandedMap}
          />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingTop: 11, paddingBottom: 2 }}
          >
            {selectedRoute.stops.map((stop, index) => {
              const active = stop.id === selectedStop.id;
              return (
                <Pressable
                  key={stop.id}
                  accessibilityRole="button"
                  accessibilityState={{ selected: active }}
                  onPress={() => setSelectedStopId(stop.id)}
                  className={`mr-2 flex-row items-center rounded-full border px-3 py-2 ${
                    active ? 'border-[#DCE4FF] bg-[#EEF2FF]' : 'border-[#E9EDF5] bg-white'
                  }`}
                >
                  <View
                    className="mr-1.5 h-5 w-5 items-center justify-center rounded-full"
                    style={{ backgroundColor: active ? selectedRoute.color : '#F0F1F6' }}
                  >
                    <Text
                      className="text-[9px] font-extrabold"
                      style={{ color: active ? '#FFFFFF' : '#8992A8' }}
                    >
                      {index + 1}
                    </Text>
                  </View>
                  <Text
                    className="text-[10px] font-bold"
                    style={{ color: active ? COLORS.navy : '#77829D' }}
                  >
                    {stop.name}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          <SectionHeading
            title="Choose your pickup"
            subtitle="Tap a stop on the map or in the list"
            trailing={
              <View className="rounded-xl bg-[#EAF8F1] px-3 py-2">
                <Text className="text-[10px] font-bold text-[#259B78]">
                  {selectedRoute.stops.length} STOPS
                </Text>
              </View>
            }
          />

          <View className="overflow-hidden rounded-[24px] border border-[#E9EDF5] bg-white px-4">
            {selectedRoute.stops.map((stop, index) => {
              const active = stop.id === selectedStop.id;
              const stopTime =
                departure.departureMinutes === null
                  ? '—'
                  : formatClock(departure.departureMinutes + stop.minutesFromStart);
              return (
                <Pressable
                  key={stop.id}
                  accessibilityRole="button"
                  accessibilityState={{ selected: active }}
                  onPress={() => setSelectedStopId(stop.id)}
                  className="min-h-[76px] flex-row items-center"
                  style={{
                    borderBottomWidth:
                      index === selectedRoute.stops.length - 1 ? 0 : 1,
                    borderBottomColor: '#F0F1F6',
                  }}
                >
                  <View className="mr-3 w-8 items-center self-stretch justify-center">
                    {index < selectedRoute.stops.length - 1 && (
                      <View
                        className="absolute top-[50%]"
                        style={{
                          width: 2,
                          height: 38,
                          backgroundColor: active ? selectedRoute.color : '#E3E7F1',
                        }}
                      />
                    )}
                    <View
                      className="h-7 w-7 items-center justify-center rounded-full border-2"
                      style={{
                        backgroundColor: active ? selectedRoute.color : '#FFFFFF',
                        borderColor: active ? selectedRoute.color : '#DCE1EB',
                      }}
                    >
                      {active ? (
                        <Ionicons name="checkmark" size={13} color="#FFFFFF" />
                      ) : (
                        <Text className="text-[9px] font-extrabold text-[#8992A8]">
                          {index + 1}
                        </Text>
                      )}
                    </View>
                  </View>
                  <View className="flex-1 py-4">
                    <Text className="text-[12px] font-extrabold text-[#202B49]">
                      {stop.name}
                    </Text>
                    <Text className="mt-1 text-[10px] text-[#8992A8]">
                      {stop.detail}
                    </Text>
                  </View>
                  <View className="items-end pl-2">
                    <Text className="text-[12px] font-extrabold text-[#202B49]">
                      {stopTime}
                    </Text>
                    <Text
                      className="mt-1 text-[9px] font-bold"
                      style={{ color: active ? selectedRoute.color : '#8992A8' }}
                    >
                      {active ? 'YOUR PICKUP' : `${stop.minutesFromStart} min`}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </View>

          <View className="mt-4 flex-row items-center rounded-2xl border border-[#DCE4FF] bg-[#EEF2FF] p-4">
            <View className="mr-3 h-10 w-10 items-center justify-center rounded-xl bg-white">
              <Ionicons name="location" size={19} color={selectedRoute.color} />
            </View>
            <View className="flex-1">
              <Text className="text-[9px] font-extrabold tracking-[0.8px] text-[#8992A8]">
                YOUR PICKUP STOP
              </Text>
              <Text className="mt-1 text-[13px] font-extrabold text-[#202B49]">
                {selectedStop.name}
              </Text>
            </View>
            <View className="items-end">
              <Text className="text-[15px] font-extrabold text-[#202B49]">
                {departure.departureMinutes === null
                  ? '—'
                  : formatClock(departure.departureMinutes + selectedStop.minutesFromStart)}
              </Text>
              <Text className="mt-1 text-[9px] text-[#8992A8]">Scheduled arrival</Text>
            </View>
          </View>

          <LinearGradient
            colors={['#EEF1FF', '#F4F1FF', '#FFFFFF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              marginTop: 20,
              marginBottom: 8,
              borderRadius: 25,
              borderWidth: 1,
              borderColor: '#E6E8FA',
              padding: 17,
            }}
          >
            <View className="flex-row items-center">
              <View className="mr-3 h-11 w-11 items-center justify-center rounded-2xl bg-white">
                <Ionicons name="chatbubbles-outline" size={22} color="#6257D9" />
              </View>
              <View className="flex-1">
                <Text className="text-[13px] font-extrabold text-[#202B49]">
                  Need travel help?
                </Text>
                <Text className="mt-1 text-[10px] leading-4 text-[#8992A8]">
                  Contact the student support desk for campus service questions.
                </Text>
              </View>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Open student support"
                onPress={() => router.push('/student/student-support')}
                className="ml-2 h-10 w-10 items-center justify-center rounded-xl bg-[#202B49]"
              >
                <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
              </Pressable>
            </View>
          </LinearGradient>

          <View className="mb-3 mt-2 flex-row items-start justify-center px-2">
            <Ionicons
              name="information-circle-outline"
              size={14}
              color="#A0A9BC"
            />
            <Text className="ml-1.5 flex-1 text-[9px] leading-4 text-[#A0A9BC]">
              Route names and times shown here are sample schedules. Confirm current service details with your transport office.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
