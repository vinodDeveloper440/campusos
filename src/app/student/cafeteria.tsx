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

type MealPeriod = 'Breakfast' | 'Lunch' | 'Snacks';
type DietaryChoice = 'All' | 'Veg' | 'Vegan' | 'Non-veg';

type MenuItem = {
  id: string;
  name: string;
  description: string;
  period: MealPeriod;
  dietary: Exclude<DietaryChoice, 'All'>;
  price: number;
  tags: string[];
};

const MENU: MenuItem[] = [
  { id: 'idli', name: 'Idli & sambar', description: 'Steamed rice cakes with lentil sambar and chutney.', period: 'Breakfast', dietary: 'Vegan', price: 45, tags: ['Popular', 'No dairy'] },
  { id: 'dosa', name: 'Masala dosa', description: 'Crisp dosa filled with potato masala.', period: 'Breakfast', dietary: 'Veg', price: 65, tags: ['Popular'] },
  { id: 'poha', name: 'Vegetable poha', description: 'Light flattened rice with vegetables and peanuts.', period: 'Breakfast', dietary: 'Vegan', price: 40, tags: ['Peanuts'] },
  { id: 'veg-thali', name: 'Veg lunch plate', description: 'Rice, seasonal vegetables, dal, curd and salad.', period: 'Lunch', dietary: 'Veg', price: 95, tags: ['Complete meal'] },
  { id: 'dal-rice', name: 'Dal rice bowl', description: 'Comforting lentil dal served with steamed rice.', period: 'Lunch', dietary: 'Vegan', price: 75, tags: ['No dairy'] },
  { id: 'chicken-meal', name: 'Chicken meal', description: 'Rice, chicken curry, vegetables and salad.', period: 'Lunch', dietary: 'Non-veg', price: 125, tags: ['Contains spice'] },
  { id: 'veg-sandwich', name: 'Grilled veg sandwich', description: 'Grilled seasonal vegetables with mint chutney.', period: 'Snacks', dietary: 'Veg', price: 55, tags: ['Made to order'] },
  { id: 'fruit-bowl', name: 'Fresh fruit bowl', description: 'A rotating selection of seasonal fruit.', period: 'Snacks', dietary: 'Vegan', price: 50, tags: ['Fresh'] },
  { id: 'egg-roll', name: 'Egg roll', description: 'Warm flatbread with egg and vegetables.', period: 'Snacks', dietary: 'Non-veg', price: 60, tags: ['Contains egg'] },
];

const PERIODS: MealPeriod[] = ['Breakfast', 'Lunch', 'Snacks'];
const DIETARY_FILTERS: DietaryChoice[] = ['All', 'Veg', 'Vegan', 'Non-veg'];

export default function CafeteriaScreen() {
  const [period, setPeriod] = useState<MealPeriod>('Lunch');
  const [dietary, setDietary] = useState<DietaryChoice>('All');
  const [search, setSearch] = useState('');
  const [savedMealIds, setSavedMealIds] = useState<string[]>([]);

  const visibleMeals = useMemo(() => {
    const query = search.trim().toLowerCase();
    return MENU.filter((item) => {
      const matchesPeriod = item.period === period;
      const matchesDiet = dietary === 'All' || item.dietary === dietary;
      const matchesSearch =
        !query ||
        `${item.name} ${item.description} ${item.tags.join(' ')}`
          .toLowerCase()
          .includes(query);
      return matchesPeriod && matchesDiet && matchesSearch;
    });
  }, [dietary, period, search]);

  const toggleSaved = (mealId: string) => {
    setSavedMealIds((current) =>
      current.includes(mealId)
        ? current.filter((id) => id !== mealId)
        : [...current, mealId],
    );
  };

  return (
    <StudentServiceScreen
      title="Cafeteria"
      headline="Good food, made easy."
      description="Browse the daily menu, check dietary options and save your favourites for later."
      icon="restaurant-outline"
      accent="#D97728"
      tint="#FFF2E5"
    >
      <View className="mt-4 flex-row">
        {[
          { title: 'Breakfast', hours: '7:30–10:00', icon: 'sunny-outline' as const, color: '#D99035', tint: '#FFF4E9' },
          { title: 'Lunch', hours: '12:00–2:30', icon: 'restaurant-outline' as const, color: '#6478E8', tint: '#EEF2FF' },
          { title: 'Snacks', hours: '4:00–6:30', icon: 'cafe-outline' as const, color: '#259B78', tint: '#EAF8F1' },
        ].map((service, index) => (
          <Pressable
            key={service.title}
            onPress={() => setPeriod(service.title as MealPeriod)}
            className={`flex-1 rounded-2xl border border-[#E9EDF5] bg-white p-3 ${index < 2 ? 'mr-2' : ''}`}
          >
            <View
              className="mb-2 h-8 w-8 items-center justify-center rounded-xl"
              style={{ backgroundColor: service.tint }}
            >
              <Ionicons name={service.icon} size={17} color={service.color} />
            </View>
            <Text className="text-[10px] font-extrabold text-[#202B49]">{service.title}</Text>
            <Text className="mt-1 text-[9px] font-medium text-[#8992A8]">{service.hours}</Text>
          </Pressable>
        ))}
      </View>

      <View className="mt-4 flex-row items-center rounded-2xl border border-[#E8ECF4] bg-white px-4" style={{ height: 52 }}>
        <Ionicons name="search-outline" size={20} color={SERVICE_COLORS.muted} />
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search menu items..."
          placeholderTextColor="#A3ABBD"
          className="h-full flex-1 px-3 text-[12px] text-[#202B49]"
          returnKeyType="search"
          autoCapitalize="none"
          accessibilityLabel="Search cafeteria menu"
        />
        {!!search && (
          <Pressable onPress={() => setSearch('')} hitSlop={10}>
            <Ionicons name="close-circle" size={19} color={SERVICE_COLORS.muted} />
          </Pressable>
        )}
      </View>

      <ServiceSectionHeading
        title="Today’s menu"
        subtitle="Choose a meal period and dietary preference"
        trailing={
          <View className="rounded-xl bg-[#EEF2FF] px-3 py-2">
            <Text className="text-[9px] font-bold text-[#6478E8]">
              {savedMealIds.length} SAVED
            </Text>
          </View>
        }
      />

      <View className="flex-row rounded-2xl border border-[#E9EDF5] bg-white p-1.5">
        {PERIODS.map((item) => {
          const active = item === period;
          return (
            <Pressable
              key={item}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              onPress={() => setPeriod(item)}
              className={`flex-1 items-center rounded-xl py-2.5 ${active ? 'bg-[#202B49]' : ''}`}
            >
              <Text className={`text-[10px] font-bold ${active ? 'text-white' : 'text-[#8992A8]'}`}>
                {item}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View className="mt-4 flex-row">
        {DIETARY_FILTERS.map((item) => {
          const active = item === dietary;
          return (
            <Pressable
              key={item}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              onPress={() => setDietary(item)}
              className={`mr-2 rounded-full border px-3 py-2 ${active ? 'border-[#DCE4FF] bg-[#EEF2FF]' : 'border-[#E9EDF5] bg-white'}`}
            >
              <Text className={`text-[9px] font-bold ${active ? 'text-[#6478E8]' : 'text-[#8992A8]'}`}>
                {item === 'All' ? 'All options' : item}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View className="mt-4">
        {visibleMeals.length > 0 ? visibleMeals.map((item) => {
          const saved = savedMealIds.includes(item.id);
          const isNonVeg = item.dietary === 'Non-veg';
          const isVegan = item.dietary === 'Vegan';
          return (
            <View key={item.id} className="mb-3 rounded-[22px] border border-[#E9EDF5] bg-white p-4">
              <View className="flex-row items-start justify-between">
                <View className="flex-1 pr-3">
                  <View className="flex-row items-center">
                    <View
                      className="mr-2 h-4 w-4 items-center justify-center rounded-[4px] border"
                      style={{ borderColor: isNonVeg ? '#D95F5F' : '#259B78' }}
                    >
                      <View
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ backgroundColor: isNonVeg ? '#D95F5F' : '#259B78' }}
                      />
                    </View>
                    <Text className="text-[14px] font-extrabold text-[#202B49]">{item.name}</Text>
                  </View>
                  <Text className="mt-2 text-[10px] leading-[17px] text-[#8992A8]">
                    {item.description}
                  </Text>
                </View>
                <Text className="text-[14px] font-extrabold text-[#202B49]">₹{item.price}</Text>
              </View>

              <View className="mt-3 flex-row items-center justify-between">
                <View className="flex-row flex-wrap items-center">
                  <ServiceTag
                    label={item.dietary}
                    color={isNonVeg ? '#C9545E' : isVegan ? '#16866B' : '#2476D2'}
                    background={isNonVeg ? '#FFF0F1' : isVegan ? '#EAF8F1' : '#EAF3FF'}
                  />
                  {item.tags[0] ? (
                    <Text className="ml-2 text-[9px] text-[#8992A8]">{item.tags[0]}</Text>
                  ) : null}
                </View>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`${saved ? 'Remove' : 'Save'} ${item.name}`}
                  onPress={() => toggleSaved(item.id)}
                  className="ml-2 h-9 w-9 items-center justify-center rounded-xl bg-[#F7F8FC]"
                >
                  <Ionicons
                    name={saved ? 'bookmark' : 'bookmark-outline'}
                    size={17}
                    color={saved ? '#6478E8' : '#8992A8'}
                  />
                </Pressable>
              </View>
            </View>
          );
        }) : (
          <ServiceEmptyState
            title="No menu items found"
            description="Try a different search or dietary filter."
            icon="restaurant-outline"
          />
        )}
      </View>

      <View className="mt-2 rounded-[22px] border border-[#E9EDF5] bg-white p-4">
        <View className="flex-row items-center">
          <View className="mr-3 h-10 w-10 items-center justify-center rounded-xl bg-[#FFF4E9]">
            <Ionicons name="time-outline" size={20} color="#D99035" />
          </View>
          <View className="flex-1">
            <Text className="text-[12px] font-extrabold text-[#202B49]">Cafeteria hours</Text>
            <Text className="mt-1 text-[10px] text-[#8992A8]">Monday–Saturday · 7:30 AM–7:00 PM</Text>
          </View>
          <Ionicons name="chevron-forward" size={17} color="#A0A9BC" />
        </View>
      </View>

      <View className="mt-4 flex-row items-start px-1">
        <Ionicons name="information-circle-outline" size={14} color="#A0A9BC" />
        <Text className="ml-1.5 flex-1 text-[9px] leading-4 text-[#A0A9BC]">
          Menu items, prices and hours are sample information. Confirm today’s menu with your campus cafeteria.
        </Text>
      </View>
    </StudentServiceScreen>
  );
}
