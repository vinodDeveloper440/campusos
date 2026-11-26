import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Service = {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  background: string;
  category: string;
  detail: string;
  availability: string;
  route?: string;
};

const C = {
  navy: "#202B49",
  blue: "#6478E8",
  muted: "#8992A8",
  background: "#F6F8FD",
  border: "#E9EDF5",
  white: "#FFFFFF",
  green: "#259B78",
  paleBlue: "#EEF2FF",
  paleGreen: "#EAF8F1",
  paleOrange: "#FFF4E9",
  palePurple: "#F2EEFF",
};

const SERVICES: Service[] = [
  {
    id: "library",
    title: "Library",
    description: "Books, journals & study resources",
    icon: "library-outline",
    color: "#6257D9",
    background: "#EFEDFF",
    category: "Academic",
    detail: "Browse books, journals and study materials.",
    availability: "Available to students",
    route: "/student/library",
  },
  {
    id: "transport",
    title: "Campus Transport",
    description: "Bus routes & travel information",
    icon: "bus-outline",
    color: "#2476D2",
    background: "#EAF3FF",
    category: "Facilities",
    detail: "Explore college bus routes and schedules.",
    availability: "Transport information",
    route: "/student/campus-transport",
  },
  {
    id: "cafeteria",
    title: "Cafeteria",
    description: "Explore meals & food options",
    icon: "restaurant-outline",
    color: "#D97728",
    background: "#FFF2E5",
    category: "Facilities",
    detail: "Discover cafeteria menus and meal options.",
    availability: "Campus facility",
    route: "/student/cafeteria",
  },
  {
    id: "hostel",
    title: "Hostel Services",
    description: "Accommodation & hostel support",
    icon: "bed-outline",
    color: "#C04FA0",
    background: "#FCEBFA",
    category: "Facilities",
    detail: "Access hostel information and support.",
    availability: "Residential students",
    route: "/student/hostel",
  },
  {
    id: "maintenance",
    title: "Report an Issue",
    description: "Report classroom or campus issues",
    icon: "construct-outline",
    color: "#16866B",
    background: "#E5F7F1",
    category: "Support",
    detail: "Submit campus maintenance complaints.",
    availability: "Issue reporting",
    route: "/student/maintenance",
  },
  {
    id: "support",
    title: "Student Support",
    description: "Get help with student-related queries",
    icon: "headset-outline",
    color: "#D34E5B",
    background: "#FFF0F1",
    category: "Support",
    detail: "Get assistance with student-related concerns.",
    availability: "Student assistance",
    route: "/student/student-support",
  },
  {
    id: "documents",
    title: "Certificates",
    description: "Academic documents & requests",
    icon: "document-text-outline",
    color: "#5C70C9",
    background: "#EEF0FF",
    category: "Academic",
    detail: "Manage academic certificate requests.",
    availability: "Document services",
    route: "/student/certificates",
  },
  {
    id: "events",
    title: "Campus Events",
    description: "Discover activities & college events",
    icon: "calendar-outline",
    color: "#A36A18",
    background: "#FFF5DD",
    category: "Academic",
    detail: "Discover upcoming campus activities.",
    availability: "Campus activities",
    route: "/student/events",
  },
];

const FILTERS = ["All", "Academic", "Facilities", "Support"];

export default function CampusServicesScreen() {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const filteredServices = useMemo(() => {
    const query = search.trim().toLowerCase();

    return SERVICES.filter((service) => {
      const matchesFilter =
        activeFilter === "All" || service.category === activeFilter;

      const matchesSearch =
        service.title.toLowerCase().includes(query) ||
        service.description.toLowerCase().includes(query) ||
        service.category.toLowerCase().includes(query);

      return matchesFilter && matchesSearch;
    });
  }, [search, activeFilter]);

  const openService = (service: Service) => {
    if (service.route) {
      router.push({
        pathname: service.route as never,
        params: { from: "/student/services" },
      });
      return;
    }

    setSelectedService(service);
  };

  const showHelp = () => {
    router.push({
      pathname: "/student/student-support",
      params: { from: "/student/services" },
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F6F8FD]">
      <StatusBar barStyle="dark-content" />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 90 }}
      >
        {/* HEADER */}
        <View className="px-5 pt-3">
          <View className="mb-6 flex-row items-center justify-between">
            <Pressable
              onPress={() => router.back()}
              className="h-11 w-11 items-center justify-center rounded-2xl border border-[#E9EDF5] bg-white"
              style={{
                shadowColor: "#202B49",
                shadowOpacity: 0.04,
                shadowRadius: 8,
                elevation: 1,
              }}
            >
              <Ionicons name="arrow-back" size={21} color={C.navy} />
            </Pressable>

            <View className="items-center">
              <Text className="text-[10px] font-extrabold tracking-[2.5px] text-[#8992A8]">
                CAMPUSOS
              </Text>

              <Text className="mt-1 text-[16px] font-bold text-[#202B49]">
                Campus Services
              </Text>
            </View>

            <Pressable
              onPress={showHelp}
              className="h-11 w-11 items-center justify-center rounded-2xl border border-[#E9EDF5] bg-white"
            >
              <Ionicons name="help-circle-outline" size={23} color={C.navy} />
            </Pressable>
          </View>

          {/* HERO CARD */}
          <LinearGradient
            colors={["#EAF0FF", "#F0EEFF", "#FFFFFF"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              borderRadius: 28,
              padding: 21,
              overflow: "hidden",
              borderWidth: 1,
              borderColor: "#E8EAFE",
            }}
          >
            <View
              className="absolute -right-8 -top-12 h-40 w-40 rounded-full"
              style={{ backgroundColor: "#6478E8", opacity: 0.07 }}
            />

            <View
              className="absolute -bottom-14 right-24 h-32 w-32 rounded-full"
              style={{ backgroundColor: "#9277D6", opacity: 0.08 }}
            />

            <View className="flex-row items-center justify-between">
              <View className="h-12 w-12 items-center justify-center rounded-2xl bg-white">
                <Ionicons name="grid-outline" size={25} color={C.blue} />
              </View>

              <View className="flex-row items-center rounded-full border border-[#DCE4FF] bg-white/80 px-3 py-2">
                <View className="mr-2 h-2 w-2 rounded-full bg-[#259B78]" />
                <Text className="text-[10px] font-bold text-[#52617F]">
                  STUDENT SERVICES
                </Text>
              </View>
            </View>

            <Text className="mt-5 text-[26px] font-extrabold leading-[34px] text-[#202B49]">
              Your campus,{"\n"}made simpler.
            </Text>

            <Text className="mt-2 max-w-[270px] text-[12px] leading-[21px] text-[#77829D]">
              Everything you need for everyday campus life, academic resources
              and student assistance.
            </Text>

            <View className="mt-5 flex-row items-center">
              <Ionicons name="checkmark-circle" size={17} color="#259B78" />
              <Text className="ml-2 text-[11px] font-semibold text-[#52617F]">
                All essential services in one place
              </Text>
            </View>
          </LinearGradient>

          {/* QUICK STATS */}
          <View className="mt-4 flex-row">
            <View className="mr-3 flex-1 rounded-2xl border border-[#E9EDF5] bg-white p-4">
              <View className="mb-2 h-9 w-9 items-center justify-center rounded-xl bg-[#EEF2FF]">
                <Ionicons name="grid-outline" size={19} color={C.blue} />
              </View>

              <Text className="text-[21px] font-extrabold text-[#202B49]">
                08
              </Text>

              <Text className="mt-1 text-[10px] font-medium text-[#8992A8]">
                Campus services
              </Text>
            </View>

            <View className="mr-3 flex-1 rounded-2xl border border-[#E9EDF5] bg-white p-4">
              <View className="mb-2 h-9 w-9 items-center justify-center rounded-xl bg-[#EAF8F1]">
                <Ionicons name="book-outline" size={19} color="#259B78" />
              </View>

              <Text className="text-[21px] font-extrabold text-[#202B49]">
                03
              </Text>

              <Text className="mt-1 text-[10px] font-medium text-[#8992A8]">
                Academic services
              </Text>
            </View>

            <View className="flex-1 rounded-2xl border border-[#E9EDF5] bg-white p-4">
              <View className="mb-2 h-9 w-9 items-center justify-center rounded-xl bg-[#FFF4E9]">
                <Ionicons name="people-outline" size={19} color="#D99035" />
              </View>

              <Text className="text-[21px] font-extrabold text-[#202B49]">
                24/7
              </Text>

              <Text className="mt-1 text-[10px] font-medium text-[#8992A8]">
                Portal access
              </Text>
            </View>
          </View>

          {/* SEARCH */}
          <View
            className="mt-6 flex-row items-center rounded-2xl border border-[#E8ECF4] bg-white px-4"
            style={{
              height: 55,
              shadowColor: "#202B49",
              shadowOpacity: 0.025,
              shadowRadius: 10,
              elevation: 1,
            }}
          >
            <Ionicons name="search-outline" size={21} color="#8992A8" />

            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Search services, facilities..."
              placeholderTextColor="#A3ABBD"
              className="h-full flex-1 px-3 text-[13px] text-[#202B49]"
              returnKeyType="search"
              autoCapitalize="none"
            />

            {search.length > 0 && (
              <Pressable onPress={() => setSearch("")} hitSlop={10}>
                <Ionicons name="close-circle" size={20} color="#8992A8" />
              </Pressable>
            )}
          </View>

          {/* SERVICE HEADING */}
          <View className="mb-4 mt-7 flex-row items-end justify-between">
            <View>
              <Text className="text-[20px] font-extrabold text-[#202B49]">
                Explore services
              </Text>

              <Text className="mt-1 text-[11px] text-[#8992A8]">
                Everything available on your campus
              </Text>
            </View>

            <View className="rounded-xl bg-[#EEF2FF] px-3 py-2">
              <Text className="text-[10px] font-bold text-[#6478E8]">
                {filteredServices.length} SERVICES
              </Text>
            </View>
          </View>

          {/* FILTERS */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              gap: 9,
              paddingBottom: 3,
            }}
          >
            {FILTERS.map((filter) => {
              const active = activeFilter === filter;

              return (
                <Pressable
                  key={filter}
                  onPress={() => setActiveFilter(filter)}
                  className={`rounded-full px-5 py-3 ${
                    active ? "bg-[#202B49]" : "border border-[#E9EDF5] bg-white"
                  }`}
                  style={
                    active
                      ? {
                          shadowColor: "#202B49",
                          shadowOpacity: 0.12,
                          shadowRadius: 7,
                          elevation: 2,
                        }
                      : {}
                  }
                >
                  <Text
                    className={`text-[11px] font-bold ${
                      active ? "text-white" : "text-[#77829D]"
                    }`}
                  >
                    {filter}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* SERVICES GRID */}
        <View className="mt-5 px-5">
          <View className="flex-row flex-wrap justify-between">
            {filteredServices.map((service) => (
              <Pressable
                key={service.id}
                onPress={() => openService(service)}
                className="mb-4 w-[48%] overflow-hidden rounded-[24px] border border-[#E9EDF5] bg-white p-4 active:opacity-80"
                style={{
                  minHeight: 193,
                  shadowColor: "#202B49",
                  shadowOpacity: 0.035,
                  shadowRadius: 12,
                  shadowOffset: { width: 0, height: 5 },
                  elevation: 1,
                }}
              >
                <View className="flex-row items-start justify-between">
                  <View
                    className="h-12 w-12 items-center justify-center rounded-2xl"
                    style={{
                      backgroundColor: service.background,
                    }}
                  >
                    <Ionicons
                      name={service.icon}
                      size={24}
                      color={service.color}
                    />
                  </View>

                  <View className="h-7 w-7 items-center justify-center rounded-full bg-[#F7F8FC]">
                    <Ionicons
                      name="arrow-up-outline"
                      size={15}
                      color="#8992A8"
                    />
                  </View>
                </View>

                <View className="mt-5">
                  <Text
                    numberOfLines={1}
                    className="text-[13px] font-extrabold text-[#202B49]"
                  >
                    {service.title}
                  </Text>

                  <Text
                    numberOfLines={2}
                    className="mt-2 text-[10px] leading-[16px] text-[#8992A8]"
                  >
                    {service.description}
                  </Text>
                </View>

                <View className="mt-auto pt-4">
                  <View
                    className="mb-3 h-[1px] w-full"
                    style={{ backgroundColor: "#F0F1F6" }}
                  />

                  <View className="flex-row items-center justify-between">
                    <Text
                      className="text-[10px] font-bold"
                      style={{ color: service.color }}
                    >
                      Explore
                    </Text>

                    <Ionicons
                      name="arrow-forward-circle"
                      size={21}
                      color={service.color}
                    />
                  </View>
                </View>
              </Pressable>
            ))}
          </View>

          {/* EMPTY STATE */}
          {filteredServices.length === 0 && (
            <View className="items-center rounded-3xl border border-[#E9EDF5] bg-white px-6 py-12">
              <View className="mb-4 h-14 w-14 items-center justify-center rounded-2xl bg-[#EEF2FF]">
                <Ionicons name="search-outline" size={26} color={C.blue} />
              </View>

              <Text className="text-base font-bold text-[#202B49]">
                No services found
              </Text>

              <Text className="mt-2 text-center text-xs leading-5 text-[#8992A8]">
                We couldn&apos;t find any matching services. Try another keyword
                or category.
              </Text>

              <Pressable
                onPress={() => {
                  setSearch("");
                  setActiveFilter("All");
                }}
                className="mt-5 rounded-xl bg-[#202B49] px-5 py-3"
              >
                <Text className="text-xs font-bold text-white">
                  Clear filters
                </Text>
              </Pressable>
            </View>
          )}

          {/* CAMPUS SUPPORT BANNER */}
          <LinearGradient
            colors={["#EEF1FF", "#F4F1FF", "#FFFFFF"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              marginTop: 10,
              marginBottom: 12,
              borderRadius: 25,
              borderWidth: 1,
              borderColor: "#E6E8FA",
              padding: 19,
            }}
          >
            <View className="flex-row items-center">
              <View className="mr-4 h-12 w-12 items-center justify-center rounded-2xl bg-white">
                <Ionicons
                  name="chatbubbles-outline"
                  size={24}
                  color="#6257D9"
                />
              </View>

              <View className="flex-1">
                <Text className="text-[14px] font-extrabold text-[#202B49]">
                  Need assistance?
                </Text>

                <Text className="mt-1 text-[10px] leading-4 text-[#8992A8]">
                  Our student helpdesk is here to guide you.
                </Text>
              </View>

              <Pressable
                onPress={showHelp}
                className="h-10 w-10 items-center justify-center rounded-xl bg-[#202B49]"
              >
                <Ionicons name="arrow-forward" size={19} color="white" />
              </Pressable>
            </View>
          </LinearGradient>

          {/* FOOTER */}
          <View className="mb-2 mt-2 items-center">
            <Ionicons
              name="shield-checkmark-outline"
              size={17}
              color="#A0A9BC"
            />

            <Text className="mt-2 text-[10px] text-[#A0A9BC]">
              CampusOS • Your campus companion
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* SERVICE DETAILS MODAL */}
      <Modal
        visible={!!selectedService}
        transparent
        animationType="slide"
        statusBarTranslucent
        onRequestClose={() => setSelectedService(null)}
      >
        <View className="flex-1 justify-end bg-[#172554]/35">
          <Pressable
            onPress={() => setSelectedService(null)}
            className="flex-1"
          />

          {selectedService && (
            <View
              className="rounded-t-[32px] bg-white px-6 pb-9 pt-4"
              style={{
                shadowColor: "#172554",
                shadowOpacity: 0.12,
                shadowRadius: 20,
                elevation: 15,
              }}
            >
              <View className="mb-6 h-1.5 w-12 self-center rounded-full bg-[#E5E8F0]" />

              {/* MODAL HEADER */}
              <View className="mb-5 flex-row items-start justify-between">
                <View
                  className="h-[62px] w-[62px] items-center justify-center rounded-[22px]"
                  style={{
                    backgroundColor: selectedService.background,
                  }}
                >
                  <Ionicons
                    name={selectedService.icon}
                    size={30}
                    color={selectedService.color}
                  />
                </View>

                <Pressable
                  onPress={() => setSelectedService(null)}
                  className="h-10 w-10 items-center justify-center rounded-full bg-[#F5F6FA]"
                >
                  <Ionicons name="close" size={21} color={C.navy} />
                </Pressable>
              </View>

              <Text className="text-[23px] font-extrabold text-[#202B49]">
                {selectedService.title}
              </Text>

              <Text className="mt-2 text-[12px] leading-[21px] text-[#8992A8]">
                {selectedService.detail}
              </Text>

              {/* CATEGORY */}
              <View className="mt-5 flex-row items-center">
                <View className="rounded-xl bg-[#EEF2FF] px-3 py-2">
                  <Text className="text-[10px] font-bold text-[#6478E8]">
                    {selectedService.category.toUpperCase()}
                  </Text>
                </View>

                <View className="ml-2 flex-row items-center rounded-xl bg-[#EAF8F1] px-3 py-2">
                  <View className="mr-2 h-1.5 w-1.5 rounded-full bg-[#259B78]" />

                  <Text className="text-[10px] font-bold text-[#259B78]">
                    {selectedService.availability}
                  </Text>
                </View>
              </View>

              {/* INFORMATION CARD */}
              <View className="mt-5 rounded-2xl border border-[#E9EDF5] bg-[#F8F9FD] p-4">
                <View className="flex-row items-start">
                  <Ionicons
                    name="information-circle-outline"
                    size={21}
                    color={C.blue}
                  />

                  <View className="ml-3 flex-1">
                    <Text className="text-[12px] font-bold text-[#202B49]">
                      Service information
                    </Text>

                    <Text className="mt-1 text-[10px] leading-[18px] text-[#8992A8]">
                      This module is currently a frontend preview. Connect it
                      with your college backend to enable live information,
                      service requests and bookings.
                    </Text>
                  </View>
                </View>
              </View>

              {/* BUTTON */}
              <Pressable
                onPress={() => setSelectedService(null)}
                className="mt-6 overflow-hidden rounded-2xl"
              >
                <LinearGradient
                  colors={["#26385D", "#6478E8"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{
                    height: 53,
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 16,
                  }}
                >
                  <Text className="text-[13px] font-bold text-white">
                    Got it
                  </Text>
                </LinearGradient>
              </Pressable>
            </View>
          )}
        </View>
      </Modal>
    </SafeAreaView>
  );
}
