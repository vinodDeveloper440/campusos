
import { useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  FlatList,
  useWindowDimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const NAVY = '#111A35';
const BLUE = '#6478E8';
const MUTED = '#8992A6';

const pages = [
  {
    number: '01',
    eyebrow: 'YOUR CAMPUS, REIMAGINED',
    title: 'Everything campus.\nOne experience.',
    description:
      'A smarter way to manage campus life, academics, and everyday activities.',
    icon: 'school-outline',
    accent: '#E9EDFF',
    cards: [
      {
        icon: 'book-outline',
        title: 'Academics',
        subtitle: 'Your learning hub',
      },
      {
        icon: 'calendar-outline',
        title: 'Your schedule',
        subtitle: 'Every day, organized',
      },
    ],
  },
  {
    number: '02',
    eyebrow: 'STAY IN THE LOOP',
    title: 'Never miss\nwhat matters.',
    description:
      'Stay updated with campus news, important announcements, and upcoming events.',
    icon: 'notifications-outline',
    accent: '#E8F5FF',
    cards: [
      {
        icon: 'megaphone-outline',
        title: 'Campus updates',
        subtitle: 'The latest, in one place',
      },
      {
        icon: 'calendar-number-outline',
        title: 'Events & activities',
        subtitle: 'Be part of everything',
      },
    ],
  },
  {
    number: '03',
    eyebrow: 'YOUR JOURNEY STARTS HERE',
    title: 'Make campus\nlife effortless.',
    description:
      'Everything you need, thoughtfully brought together for a better campus experience.',
    icon: 'rocket-outline',
    accent: '#E9EDFF',
    cards: [
      {
        icon: 'grid-outline',
        title: 'One connected space',
        subtitle: 'Simple. Seamless. Yours.',
      },
      {
        icon: 'arrow-forward-circle-outline',
        title: 'Ready to begin?',
        subtitle: 'Your campus awaits',
      },
    ],
  },
] as const;

type OnboardingPage = (typeof pages)[number];

export default function OnboardingScreen() {
  const router = useRouter();
  const { width, height } = useWindowDimensions();

  const [currentPage, setCurrentPage] = useState(0);

  const listRef = useRef<FlatList<OnboardingPage>>(null);

  const finishOnboarding = () => {
    router.replace('/login');
  };

  const onScroll = (
    event: NativeSyntheticEvent<NativeScrollEvent>
  ) => {
    const page = Math.round(
      event.nativeEvent.contentOffset.x / width
    );

    setCurrentPage(
      Math.max(0, Math.min(page, pages.length - 1))
    );
  };

  const goToPage = (page: number) => {
    listRef.current?.scrollToIndex({
      index: page,
      animated: true,
    });
  };

  const isCompact = height < 760;

  const renderPage = ({ item }: { item: OnboardingPage }) => (
    <View style={{ width }} className="flex-1 px-6">
      <View className="flex-1 justify-center">
        {/* PREMIUM DASHBOARD ILLUSTRATION */}
        <View
          className="items-center justify-center"
          style={{ paddingVertical: isCompact ? 8 : 18 }}
        >
          {/* Background circles */}
          <View
            className="absolute rounded-full"
            style={{
              width: isCompact ? 238 : 278,
              height: isCompact ? 238 : 278,
              backgroundColor: '#F7F8FC',
            }}
          />

          <View
            className="absolute rounded-full border"
            style={{
              width: isCompact ? 204 : 240,
              height: isCompact ? 204 : 240,
              borderColor: '#E8EBF5',
            }}
          />

          {/* Main dashboard card */}
          <View
            className="rounded-[28px] border border-slate-100 bg-white p-5"
            style={{
              width: isCompact ? 282 : 306,
              maxWidth: width - 64,
              shadowColor: NAVY,
              shadowOffset: { width: 0, height: 12 },
              shadowOpacity: 0.09,
              shadowRadius: 22,
              elevation: 5,
            }}
          >
            {/* Card heading */}
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="text-[10px] font-bold tracking-[2px] text-slate-400">
                  CAMPUSOS
                </Text>

                <Text
                  className="mt-1.5 text-[18px] font-extrabold"
                  style={{ color: NAVY }}
                >
                  Your campus
                </Text>

                <Text className="mt-1 text-[11px] text-slate-400">
                  Everything in one place
                </Text>
              </View>

              <View
                className="h-[52px] w-[52px] items-center justify-center rounded-[18px]"
                style={{ backgroundColor: NAVY }}
              >
                <Ionicons
                  name={item.icon}
                  size={27}
                  color="#FFFFFF"
                />
              </View>
            </View>

            {/* Divider */}
            <View className="my-5 h-px bg-slate-100" />

            {/* Feature cards */}
            {item.cards.map((card, index) => (
              <View
                key={card.title}
                className="mb-3 flex-row items-center rounded-2xl p-3"
                style={{
                  backgroundColor:
                    index === 0 ? '#F7F8FC' : '#FFFFFF',
                  borderWidth: index === 1 ? 1 : 0,
                  borderColor: '#F0F2F7',
                }}
              >
                <View
                  className="h-[43px] w-[43px] items-center justify-center rounded-[14px]"
                  style={{
                    backgroundColor:
                      index === 0 ? item.accent : '#F1F3F8',
                  }}
                >
                  <Ionicons
                    name={card.icon}
                    size={21}
                    color={NAVY}
                  />
                </View>

                <View className="ml-3 flex-1">
                  <Text
                    className="text-[12px] font-bold"
                    style={{ color: NAVY }}
                  >
                    {card.title}
                  </Text>

                  <Text className="mt-1 text-[10px] text-slate-400">
                    {card.subtitle}
                  </Text>
                </View>

                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color="#A6ADBD"
                />
              </View>
            ))}

            {/* Dashboard footer */}
            <View className="mt-1 flex-row items-center">
              <View className="mr-2 h-2 w-2 rounded-full bg-emerald-500" />

              <Text className="text-[9px] font-semibold tracking-wide text-slate-400">
                EVERYTHING LOOKS CONNECTED
              </Text>
            </View>
          </View>

          {/* Floating number badge */}
          <View
            className="absolute right-0 top-2 flex-row items-center rounded-2xl border border-slate-100 bg-white px-3 py-2.5"
            style={{
              shadowColor: NAVY,
              shadowOpacity: 0.05,
              shadowRadius: 8,
              elevation: 2,
            }}
          >
            <Text
              className="text-[12px] font-extrabold tracking-wider"
              style={{ color: BLUE }}
            >
              {item.number}
            </Text>

            <View
              className="ml-2 h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: BLUE }}
            />
          </View>

          {/* Floating decorative icon */}
          <View
            className="absolute bottom-2 left-0 h-[49px] w-[49px] items-center justify-center rounded-2xl border border-slate-100 bg-white"
            style={{
              shadowColor: NAVY,
              shadowOpacity: 0.07,
              shadowRadius: 10,
              elevation: 3,
            }}
          >
            <Ionicons
              name="sparkles-outline"
              size={23}
              color={BLUE}
            />
          </View>
        </View>

        {/* ONBOARDING TEXT */}
        <View className="mt-5">
          <View className="items-center">
            <View
              className="rounded-full px-3 py-2"
              style={{ backgroundColor: '#F0F2FF' }}
            >
              <Text
                className="text-[9px] font-extrabold tracking-[2px]"
                style={{ color: BLUE }}
              >
                {item.eyebrow}
              </Text>
            </View>
          </View>

          <Text
            className="mt-5 text-center text-[33px] font-extrabold leading-[39px] tracking-[-1.2px]"
            style={{ color: NAVY }}
          >
            {item.title}
          </Text>

          <Text
            className="mx-3 mt-3 text-center text-[13px] leading-[22px]"
            style={{ color: MUTED }}
          >
            {item.description}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar
        barStyle="dark-content"
      />

      {/* HEADER */}
      <View className="flex-row items-center justify-between px-6 pb-3 pt-3">
        <View className="flex-row items-center">
          <View
            className="h-[43px] w-[43px] items-center justify-center rounded-[15px]"
            style={{ backgroundColor: NAVY }}
          >
            <Text className="text-[25px] font-black text-white">
              C
            </Text>

            <View
              className="absolute bottom-[8px] right-[8px] h-[5px] w-[5px] rounded-full"
              style={{ backgroundColor: '#A7B4FF' }}
            />
          </View>

          <View className="ml-3">
            <Text
              className="text-[19px] font-extrabold tracking-tight"
              style={{ color: NAVY }}
            >
              CampusOS
            </Text>

            <Text className="mt-0.5 text-[9px] font-bold tracking-[1.8px] text-slate-400">
              CAMPUS, CONNECTED
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={finishOnboarding}
          className="flex-row items-center rounded-full px-3 py-2"
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Skip onboarding"
        >
          <Text className="mr-1.5 text-[12px] font-semibold text-slate-500">
            Skip
          </Text>

          <Ionicons
            name="arrow-forward"
            size={15}
            color={MUTED}
          />
        </TouchableOpacity>
      </View>

      {/* SWIPEABLE PAGES */}
      <FlatList
        ref={listRef}
        data={pages}
        horizontal
        pagingEnabled
        bounces={false}
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.number}
        renderItem={renderPage}
        onMomentumScrollEnd={onScroll}
        getItemLayout={(_, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
        extraData={width}
      />

      {/* BOTTOM NAVIGATION */}
      <View className="px-6 pb-4 pt-3">
        {/* Pagination */}
        <View className="mb-5 flex-row items-center justify-between">
          <View className="flex-row items-center">
            {pages.map((item, index) => (
              <TouchableOpacity
                key={item.number}
                onPress={() => goToPage(index)}
                activeOpacity={0.7}
                className="mr-2 items-center justify-center py-2"
                accessibilityRole="button"
                accessibilityLabel={`Go to page ${index + 1}`}
                accessibilityState={{
                  selected: currentPage === index,
                }}
              >
                <View
                  className="h-[5px] rounded-full"
                  style={{
                    width: currentPage === index ? 28 : 7,
                    backgroundColor:
                      currentPage === index ? NAVY : '#E5E8F0',
                  }}
                />
              </TouchableOpacity>
            ))}
          </View>

          <Text className="text-[10px] font-bold tracking-[1.5px] text-slate-400">
            {pages[currentPage].number} / 03
          </Text>
        </View>

        {/* Main CTA */}
        <TouchableOpacity
          onPress={() =>
            currentPage === pages.length - 1
              ? finishOnboarding()
              : goToPage(currentPage + 1)
          }
          activeOpacity={0.85}
          className="h-[57px] flex-row items-center justify-center rounded-2xl"
          style={{
            backgroundColor: NAVY,
            shadowColor: NAVY,
            shadowOffset: { width: 0, height: 5 },
            shadowOpacity: 0.12,
            shadowRadius: 10,
            elevation: 3,
          }}
          accessibilityRole="button"
        >
          <Text className="text-[14px] font-bold tracking-wide text-white">
            {currentPage === pages.length - 1
              ? 'Get Started'
              : 'Continue'}
          </Text>

         
        </TouchableOpacity>

        {/* Footer */}
        <View className="mt-4 flex-row items-center justify-center">
          <Ionicons
            name="shield-checkmark-outline"
            size={13}
            color={MUTED}
          />

          <Text className="ml-1.5 text-[9px] font-semibold tracking-[1.3px] text-slate-400">
            DESIGNED FOR YOUR CAMPUS LIFE
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}