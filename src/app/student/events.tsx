import React, { useMemo, useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  ServiceEmptyState,
  ServiceSectionHeading,
  ServiceTag,
  SERVICE_COLORS,
  StudentServiceScreen,
} from '../../components/StudentServiceScreen';

type EventCategory = 'Academic' | 'Culture' | 'Wellness' | 'Sports';
type CampusEvent = {
  id: string;
  title: string;
  category: EventCategory;
  date: string;
  dateLabel: string;
  time: string;
  venue: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  tint: string;
  seats: string;
};

const EVENTS: CampusEvent[] = [
  { id: 'research-forum', title: 'Student Research Forum', category: 'Academic', date: '2026-11-15', dateLabel: '15 NOV', time: '10:00 AM – 1:00 PM', venue: 'Innovation Hall', description: 'Share student projects, meet faculty mentors and explore research opportunities across departments.', icon: 'bulb-outline', color: '#6478E8', tint: '#EEF2FF', seats: 'Limited seats' },
  { id: 'wellness-hour', title: 'Mindful Campus Hour', category: 'Wellness', date: '2026-11-19', dateLabel: '19 NOV', time: '4:00 PM – 5:00 PM', venue: 'Wellness Garden', description: 'Take a break with a guided breathing session and practical study-stress tips.', icon: 'leaf-outline', color: '#259B78', tint: '#EAF8F1', seats: 'Open to all students' },
  { id: 'music-night', title: 'Campus Music Night', category: 'Culture', date: '2026-11-22', dateLabel: '22 NOV', time: '6:00 PM – 8:30 PM', venue: 'Open-Air Stage', description: 'An evening of student bands, acoustic sets and campus performances.', icon: 'musical-notes-outline', color: '#C04FA0', tint: '#FCEBFA', seats: 'Registration required' },
  { id: 'friendly-cup', title: 'Inter-Department Friendly Cup', category: 'Sports', date: '2026-11-28', dateLabel: '28 NOV', time: '8:00 AM – 12:00 PM', venue: 'Main Sports Ground', description: 'Join the cheering section or register your team for the campus friendly tournament.', icon: 'football-outline', color: '#D99035', tint: '#FFF4E9', seats: 'Team registration open' },
  { id: 'career-lab', title: 'Career Readiness Lab', category: 'Academic', date: '2026-12-03', dateLabel: '03 DEC', time: '2:00 PM – 4:00 PM', venue: 'Seminar Room 2', description: 'Practice interview introductions and get feedback on your resume from the career team.', icon: 'briefcase-outline', color: '#6478E8', tint: '#EEF2FF', seats: 'Bring a resume copy' },
];

const FILTERS: ('All' | EventCategory)[] = ['All', 'Academic', 'Culture', 'Wellness', 'Sports'];

export default function CampusEventsScreen() {
  const [activeFilter, setActiveFilter] = useState<(typeof FILTERS)[number]>('All');
  const [search, setSearch] = useState('');
  const [goingIds, setGoingIds] = useState<string[]>([]);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [expandedEventId, setExpandedEventId] = useState<string | null>(null);

  const upcomingEvents = useMemo(() => {
    const query = search.trim().toLowerCase();
    return EVENTS.filter((event) => {
      const matchesCategory = activeFilter === 'All' || event.category === activeFilter;
      const matchesSearch = !query || `${event.title} ${event.category} ${event.venue} ${event.description}`.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    }).sort((a, b) => a.date.localeCompare(b.date));
  }, [activeFilter, search]);

  const toggleId = (setter: React.Dispatch<React.SetStateAction<string[]>>, id: string) => {
    setter((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  };

  return (
    <StudentServiceScreen
      title="Campus Events"
      headline="Find your next thing."
      description="Discover student activities, save events you like and keep your upcoming plans together."
      icon="calendar-outline"
      accent="#A36A18"
      tint="#FFF5DD"
    >
      <View className="mt-4 flex-row">
        <View className="mr-3 flex-1 rounded-2xl border border-[#E9EDF5] bg-white p-4">
          <View className="mb-2 h-9 w-9 items-center justify-center rounded-xl bg-[#FFF4E9]">
            <Ionicons name="calendar-clear-outline" size={19} color="#D99035" />
          </View>
          <Text className="text-[19px] font-extrabold text-[#202B49]">{upcomingEvents.length}</Text>
          <Text className="mt-1 text-[9px] text-[#8992A8]">Upcoming events</Text>
        </View>
        <View className="flex-1 rounded-2xl border border-[#E9EDF5] bg-white p-4">
          <View className="mb-2 h-9 w-9 items-center justify-center rounded-xl bg-[#EEF2FF]">
            <Ionicons name="bookmark-outline" size={19} color="#6478E8" />
          </View>
          <Text className="text-[19px] font-extrabold text-[#202B49]">{savedIds.length}</Text>
          <Text className="mt-1 text-[9px] text-[#8992A8]">Saved for later</Text>
        </View>
      </View>

      <View className="mt-5 flex-row items-center rounded-2xl border border-[#E8ECF4] bg-white px-4" style={{ height: 52 }}>
        <Ionicons name="search-outline" size={20} color={SERVICE_COLORS.muted} />
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search events or locations..."
          placeholderTextColor="#A3ABBD"
          className="h-full flex-1 px-3 text-[12px] text-[#202B49]"
          returnKeyType="search"
          autoCapitalize="none"
          accessibilityLabel="Search campus events"
        />
        {!!search && (
          <Pressable onPress={() => setSearch('')} hitSlop={10}>
            <Ionicons name="close-circle" size={19} color={SERVICE_COLORS.muted} />
          </Pressable>
        )}
      </View>

      <ServiceSectionHeading
        title="Coming up"
        subtitle="Browse by interest and RSVP to attend"
        trailing={<ServiceTag label={`${upcomingEvents.length} events`} color="#A36A18" background="#FFF5DD" />}
      />
      <View className="flex-row flex-wrap">
        {FILTERS.map((filter) => {
          const active = activeFilter === filter;
          return (
            <Pressable
              key={filter}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              onPress={() => setActiveFilter(filter)}
              className={`mr-2 mb-2 rounded-full border px-3.5 py-2.5 ${active ? 'border-[#202B49] bg-[#202B49]' : 'border-[#E9EDF5] bg-white'}`}
            >
              <Text className={`text-[9px] font-bold ${active ? 'text-white' : 'text-[#8992A8]'}`}>{filter}</Text>
            </Pressable>
          );
        })}
      </View>

      <View className="mt-2">
        {upcomingEvents.length ? upcomingEvents.map((event) => {
          const going = goingIds.includes(event.id);
          const saved = savedIds.includes(event.id);
          const expanded = expandedEventId === event.id;
          return (
            <View key={event.id} className="mb-3 overflow-hidden rounded-[22px] border border-[#E9EDF5] bg-white">
              <Pressable
                accessibilityRole="button"
                accessibilityState={{ expanded }}
                onPress={() => setExpandedEventId(expanded ? null : event.id)}
                className="flex-row p-4"
              >
                <View className="mr-3 w-[54px] items-center justify-center rounded-2xl" style={{ backgroundColor: event.tint }}>
                  <Text className="text-[9px] font-extrabold" style={{ color: event.color }}>{event.dateLabel.split(' ')[0]}</Text>
                  <Text className="mt-1 text-[18px] font-extrabold" style={{ color: event.color }}>{event.dateLabel.split(' ')[1]}</Text>
                </View>
                <View className="flex-1">
                  <View className="flex-row items-center justify-between">
                    <ServiceTag label={event.category} color={event.color} background={event.tint} />
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel={`${saved ? 'Remove saved' : 'Save'} ${event.title}`}
                      hitSlop={8}
                      onPress={() => toggleId(setSavedIds, event.id)}
                      className="h-8 w-8 items-center justify-center rounded-full bg-[#F7F8FC]"
                    >
                      <Ionicons name={saved ? 'bookmark' : 'bookmark-outline'} size={15} color={saved ? event.color : '#8992A8'} />
                    </Pressable>
                  </View>
                  <Text className="mt-2 text-[13px] font-extrabold text-[#202B49]">{event.title}</Text>
                  <View className="mt-2 flex-row items-center">
                    <Ionicons name="time-outline" size={13} color="#8992A8" />
                    <Text className="ml-1.5 text-[9px] text-[#8992A8]">{event.time}</Text>
                  </View>
                  <View className="mt-1.5 flex-row items-center">
                    <Ionicons name="location-outline" size={13} color="#8992A8" />
                    <Text className="ml-1.5 text-[9px] text-[#8992A8]">{event.venue}</Text>
                  </View>
                </View>
              </Pressable>
              {expanded && (
                <View className="border-t border-[#F0F1F6] px-4 pb-4 pt-3">
                  <Text className="text-[10px] leading-[17px] text-[#77829D]">{event.description}</Text>
                  <Text className="mt-2 text-[9px] font-semibold text-[#8992A8]">{event.seats}</Text>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityState={{ selected: going }}
                    onPress={() => toggleId(setGoingIds, event.id)}
                    className="mt-3 flex-row items-center justify-center rounded-xl px-4 py-3"
                    style={{ backgroundColor: going ? '#EAF8F1' : '#202B49' }}
                  >
                    <Ionicons name={going ? 'checkmark-circle' : 'calendar-outline'} size={15} color={going ? '#259B78' : '#FFFFFF'} />
                    <Text className="ml-2 text-[10px] font-extrabold" style={{ color: going ? '#259B78' : '#FFFFFF' }}>
                      {going ? 'You’re on the list' : 'RSVP to attend'}
                    </Text>
                  </Pressable>
                </View>
              )}
            </View>
          );
        }) : (
          <ServiceEmptyState
            title="No matching events"
            description="Try another category or search term."
            icon="calendar-outline"
          />
        )}
      </View>

      <View className="mt-3 flex-row items-start px-1">
        <Ionicons name="information-circle-outline" size={14} color="#A0A9BC" />
        <Text className="ml-1.5 flex-1 text-[9px] leading-4 text-[#A0A9BC]">
          Event dates and venues are sample listings. Confirm registration details with the campus events team.
        </Text>
      </View>
    </StudentServiceScreen>
  );
}
