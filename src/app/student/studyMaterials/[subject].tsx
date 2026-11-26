import React, { useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";

type ResourceType = "PDF" | "PPT" | "NOTES" | "VIDEO";
type FilterType = "All" | ResourceType;

type Resource = {
  id: string;
  title: string;
  type: ResourceType;
  size: string;
  date: string;
};

type Topic = {
  id: string;
  name: string;
  description: string;
  resources: Resource[];
};

type Subject = {
  name: string;
  code: string;
  description: string;
  color: string;
  bg: string;
  topics: Topic[];
};

const subjectData: Record<string, Subject> = {
  "data-structures": {
    name: "Data Structures",
    code: "CS301",
    description: "Organize, store and process data efficiently.",
    color: "#6478E8",
    bg: "#EEF1FF",
    topics: [
      {
        id: "ds1",
        name: "Introduction to Data Structures",
        description: "Basic concepts, classifications and applications.",
        resources: [
          {
            id: "1",
            title: "Introduction - Lecture Notes",
            type: "PDF",
            size: "2.4 MB",
            date: "Nov 03, 2026",
          },
          {
            id: "2",
            title: "Data Structure Fundamentals",
            type: "PPT",
            size: "4.1 MB",
            date: "Nov 03, 2026",
          },
          {
            id: "3",
            title: "Important Questions",
            type: "NOTES",
            size: "850 KB",
            date: "Nov 02, 2026",
          },
        ],
      },
      {
        id: "ds2",
        name: "Arrays and Strings",
        description: "Array operations, searching and string handling.",
        resources: [
          {
            id: "4",
            title: "Arrays - Complete Notes",
            type: "PDF",
            size: "1.8 MB",
            date: "Oct 30, 2026",
          },
          {
            id: "5",
            title: "Array Operations",
            type: "PPT",
            size: "3.2 MB",
            date: "Oct 30, 2026",
          },
        ],
      },
      {
        id: "ds3",
        name: "Linked Lists",
        description: "Singly, doubly and circular linked lists.",
        resources: [
          {
            id: "6",
            title: "Linked Lists - Study Material",
            type: "PDF",
            size: "2.1 MB",
            date: "Oct 28, 2026",
          },
          {
            id: "7",
            title: "Linked List Operations",
            type: "PPT",
            size: "3.5 MB",
            date: "Oct 28, 2026",
          },
          {
            id: "8",
            title: "Linked List Explanation",
            type: "VIDEO",
            size: "18 min",
            date: "Oct 27, 2026",
          },
        ],
      },
      {
        id: "ds4",
        name: "Stacks and Queues",
        description: "Stack operations, queue types and applications.",
        resources: [
          {
            id: "9",
            title: "Stacks and Queues Notes",
            type: "PDF",
            size: "2.7 MB",
            date: "Oct 25, 2026",
          },
          {
            id: "10",
            title: "Stack and Queue Examples",
            type: "NOTES",
            size: "950 KB",
            date: "Oct 25, 2026",
          },
        ],
      },
      {
        id: "ds5",
        name: "Trees and Graphs",
        description: "Tree traversal, binary trees and graph concepts.",
        resources: [
          {
            id: "11",
            title: "Trees and Graphs",
            type: "PDF",
            size: "3.4 MB",
            date: "Oct 23, 2026",
          },
          {
            id: "12",
            title: "Tree Traversal Presentation",
            type: "PPT",
            size: "4.2 MB",
            date: "Oct 23, 2026",
          },
        ],
      },
    ],
  },

  mathematics: {
    name: "Mathematics",
    code: "MA302",
    description: "Mathematical methods and problem-solving resources.",
    color: "#259B78",
    bg: "#EAF8F1",
    topics: [
      {
        id: "ma1",
        name: "Probability",
        description: "Events, probability rules and distributions.",
        resources: [
          {
            id: "13",
            title: "Probability - Lecture Notes",
            type: "PDF",
            size: "1.8 MB",
            date: "Nov 01, 2026",
          },
          {
            id: "14",
            title: "Solved Probability Problems",
            type: "NOTES",
            size: "900 KB",
            date: "Oct 30, 2026",
          },
        ],
      },
      {
        id: "ma2",
        name: "Statistics",
        description: "Mean, median, mode and standard deviation.",
        resources: [
          {
            id: "15",
            title: "Statistics Notes",
            type: "PDF",
            size: "2.1 MB",
            date: "Oct 29, 2026",
          },
          {
            id: "16",
            title: "Statistics Presentation",
            type: "PPT",
            size: "3 MB",
            date: "Oct 29, 2026",
          },
        ],
      },
      {
        id: "ma3",
        name: "Numerical Methods",
        description: "Numerical solutions and approximation methods.",
        resources: [
          {
            id: "17",
            title: "Numerical Methods Notes",
            type: "PDF",
            size: "2.5 MB",
            date: "Oct 26, 2026",
          },
        ],
      },
    ],
  },

  "database-systems": {
    name: "Database Systems",
    code: "CS303",
    description: "Database concepts, SQL and relational database design.",
    color: "#9277D6",
    bg: "#F3EFFF",
    topics: [
      {
        id: "db1",
        name: "Database Fundamentals",
        description: "DBMS architecture, concepts and data models.",
        resources: [
          {
            id: "18",
            title: "DBMS Fundamentals",
            type: "PDF",
            size: "2.2 MB",
            date: "Oct 30, 2026",
          },
          {
            id: "19",
            title: "DBMS Introduction Slides",
            type: "PPT",
            size: "3.5 MB",
            date: "Oct 30, 2026",
          },
        ],
      },
      {
        id: "db2",
        name: "SQL and Queries",
        description: "SQL commands, joins and query writing.",
        resources: [
          {
            id: "20",
            title: "SQL Complete Notes",
            type: "PDF",
            size: "3.2 MB",
            date: "Oct 28, 2026",
          },
          {
            id: "21",
            title: "SQL Queries Practice",
            type: "NOTES",
            size: "1 MB",
            date: "Oct 28, 2026",
          },
        ],
      },
      {
        id: "db3",
        name: "Normalization",
        description: "Functional dependencies and normal forms.",
        resources: [
          {
            id: "22",
            title: "Normalization Notes",
            type: "PDF",
            size: "2 MB",
            date: "Oct 25, 2026",
          },
        ],
      },
    ],
  },

  "computer-networks": {
    name: "Computer Networks",
    code: "CS304",
    description: "Network architecture, communication and protocols.",
    color: "#D99035",
    bg: "#FFF5E8",
    topics: [
      {
        id: "cn1",
        name: "Network Fundamentals",
        description: "Network types, topologies and architecture.",
        resources: [
          {
            id: "23",
            title: "Network Fundamentals",
            type: "PDF",
            size: "2.2 MB",
            date: "Oct 28, 2026",
          },
          {
            id: "24",
            title: "Network Topologies",
            type: "PPT",
            size: "3.1 MB",
            date: "Oct 28, 2026",
          },
        ],
      },
      {
        id: "cn2",
        name: "OSI and TCP/IP Models",
        description: "Network layers and communication models.",
        resources: [
          {
            id: "25",
            title: "OSI Model Notes",
            type: "PDF",
            size: "2 MB",
            date: "Oct 26, 2026",
          },
          {
            id: "26",
            title: "OSI Model Explanation",
            type: "VIDEO",
            size: "18 min",
            date: "Oct 26, 2026",
          },
        ],
      },
      {
        id: "cn3",
        name: "Network Protocols",
        description: "HTTP, FTP, DNS and transport protocols.",
        resources: [
          {
            id: "27",
            title: "Network Protocols Notes",
            type: "PDF",
            size: "1.9 MB",
            date: "Oct 23, 2026",
          },
        ],
      },
    ],
  },

  "operating-systems": {
    name: "Operating Systems",
    code: "CS305",
    description: "Processes, memory, scheduling and file systems.",
    color: "#DC626B",
    bg: "#FFF0F1",
    topics: [
      {
        id: "os1",
        name: "Introduction to Operating Systems",
        description: "OS functions, structures and services.",
        resources: [
          {
            id: "28",
            title: "Operating Systems Notes",
            type: "PDF",
            size: "2.4 MB",
            date: "Oct 26, 2026",
          },
          {
            id: "29",
            title: "OS Introduction Slides",
            type: "PPT",
            size: "3.3 MB",
            date: "Oct 26, 2026",
          },
        ],
      },
      {
        id: "os2",
        name: "Process Management",
        description: "Process states, threads and scheduling.",
        resources: [
          {
            id: "30",
            title: "Process Management",
            type: "PDF",
            size: "2.9 MB",
            date: "Oct 24, 2026",
          },
          {
            id: "31",
            title: "CPU Scheduling Notes",
            type: "NOTES",
            size: "1.1 MB",
            date: "Oct 24, 2026",
          },
        ],
      },
      {
        id: "os3",
        name: "Memory Management",
        description: "Paging, segmentation and virtual memory.",
        resources: [
          {
            id: "32",
            title: "Memory Management Notes",
            type: "PDF",
            size: "2.6 MB",
            date: "Oct 22, 2026",
          },
        ],
      },
    ],
  },
};

const resourceStyle: Record<
  ResourceType,
  {
    icon: keyof typeof Ionicons.glyphMap;
    color: string;
    bg: string;
  }
> = {
  PDF: {
    icon: "document-text-outline",
    color: "#DC626B",
    bg: "#FFF0F1",
  },
  PPT: {
    icon: "easel-outline",
    color: "#9277D6",
    bg: "#F3EFFF",
  },
  NOTES: {
    icon: "book-outline",
    color: "#259B78",
    bg: "#EAF8F1",
  },
  VIDEO: {
    icon: "play-circle-outline",
    color: "#D99035",
    bg: "#FFF5E8",
  },
};

const formatDate = (date: string) => {
  const parsed = new Date(`${date} 00:00:00`);
  return Number.isNaN(parsed.getTime()) ? 0 : parsed.getTime();
};

export default function SubjectMaterialsScreen() {
  const { subject } = useLocalSearchParams<{ subject: string }>();
  const subjectInfo = subjectData[String(subject)];

  const [search, setSearch] = useState("");
  const [activeType, setActiveType] = useState<FilterType>("All");
  const [expandedTopics, setExpandedTopics] = useState<string[]>([]);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [savedOnly, setSavedOnly] = useState(false);

  const allResources = useMemo(
    () =>
      subjectInfo?.topics.flatMap((topic) =>
        topic.resources.map((resource) => ({
          ...resource,
          topic: topic.name,
          topicId: topic.id,
        })),
      ) ?? [],
    [subjectInfo],
  );

  const filteredResources = useMemo(() => {
    const query = search.trim().toLowerCase();

    return allResources.filter((resource) => {
      const matchesSearch =
        !query ||
        resource.title.toLowerCase().includes(query) ||
        resource.topic.toLowerCase().includes(query) ||
        resource.type.toLowerCase().includes(query);

      const matchesType = activeType === "All" || resource.type === activeType;

      const matchesSaved = !savedOnly || bookmarks.includes(resource.id);

      return matchesSearch && matchesType && matchesSaved;
    });
  }, [allResources, search, activeType, savedOnly, bookmarks]);

  const toggleTopic = (id: string) => {
    setExpandedTopics((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  };

  const toggleBookmark = (id: string) => {
    setBookmarks((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  };

  if (!subjectInfo) {
    return (
      <SafeAreaView
        edges={["top", "bottom"]}
        className="flex-1 items-center justify-center bg-[#F7F9FD]"
      >
        <View className="h-16 w-16 items-center justify-center rounded-3xl bg-white">
          <Ionicons name="alert-circle-outline" size={34} color="#8992A6" />
        </View>

        <Text className="mt-4 text-lg font-extrabold text-[#202B49]">
          Subject not found
        </Text>

        <Pressable
          onPress={() => router.back()}
          className="mt-5 rounded-2xl bg-[#6478E8] px-6 py-3"
        >
          <Text className="font-bold text-white">Go back</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const allExpanded = subjectInfo.topics.every((topic) =>
    expandedTopics.includes(topic.id),
  );

  const toggleAllTopics = () => {
    setExpandedTopics(
      allExpanded ? [] : subjectInfo.topics.map((topic) => topic.id),
    );
  };

  const counts: Record<ResourceType, number> = {
    PDF: allResources.filter((item) => item.type === "PDF").length,
    PPT: allResources.filter((item) => item.type === "PPT").length,
    NOTES: allResources.filter((item) => item.type === "NOTES").length,
    VIDEO: allResources.filter((item) => item.type === "VIDEO").length,
  };

  const savedCount = bookmarks.filter((id) =>
    allResources.some((resource) => resource.id === id),
  ).length;

  const visibleTopics = subjectInfo.topics
    .map((topic) => ({
      ...topic,
      resources: topic.resources.filter((resource) =>
        filteredResources.some((item) => item.id === resource.id),
      ),
    }))
    .filter((topic) => topic.resources.length > 0);

  const recentResources = [...allResources]
    .sort((a, b) => formatDate(b.date) - formatDate(a.date))
    .slice(0, 3);

  const clearFilters = () => {
    setSearch("");
    setActiveType("All");
    setSavedOnly(false);
  };

  return (
    <SafeAreaView
      className="flex-1 bg-[#F7F9FD]"
      edges={["top", "bottom", "left", "right"]}
    >
      <StatusBar barStyle="dark-content" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 12 }}
      >
        <View className="px-5 pb-12">
          {/* HEADER */}
          <View className="flex-row items-center justify-between pt-3">
            <View className="flex-row items-center">
              <Pressable
                onPress={() => router.back()}
                className="h-11 w-11 items-center justify-center rounded-2xl border border-[#E9EDF5] bg-white"
                hitSlop={6}
              >
                <Ionicons name="arrow-back" size={20} color="#202B49" />
              </Pressable>

              <View className="ml-3">
                <Text className="text-[10px] font-extrabold tracking-[2px] text-[#8992A6]">
                  CAMPUSOS
                </Text>
                <Text className="mt-0.5 text-base font-extrabold text-[#202B49]">
                  Subject Library
                </Text>
              </View>
            </View>

            <Pressable
              onPress={() => setSavedOnly((value) => !value)}
              className={`h-11 w-11 items-center justify-center rounded-2xl border ${
                savedOnly
                  ? "border-[#6478E8] bg-[#EEF1FF]"
                  : "border-[#E9EDF5] bg-white"
              }`}
              hitSlop={6}
            >
              <Ionicons
                name={savedOnly ? "bookmark" : "bookmark-outline"}
                size={20}
                color={savedOnly ? "#6478E8" : "#202B49"}
              />
            </Pressable>
          </View>

          {/* SUBJECT HERO */}
          <LinearGradient
            colors={["#E8EDFF", "#F1EDFF", "#F9F8FF"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              marginTop: 24,
              padding: 15,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: "#E2E7FA",
              overflow: "hidden",
            }}
          >
            <View className="flex-row items-start justify-between">
              <View
                className="h-14 w-14 items-center justify-center rounded-2xl bg-white"
                style={{
                  shadowColor: "#6478E8",
                  shadowOpacity: 0.1,
                  shadowRadius: 12,
                  shadowOffset: { width: 0, height: 4 },
                  elevation: 2,
                }}
              >
                <Ionicons
                  name="book-outline"
                  size={28}
                  color={subjectInfo.color}
                />
              </View>

              <View className="rounded-full border border-white bg-white/80 px-4 py-2">
                <Text className="text-[10px] font-extrabold tracking-wider text-[#6478E8]">
                  {subjectInfo.code}
                </Text>
              </View>
            </View>

            <Text className="mt-5 text-[10px] font-extrabold tracking-[2px] text-[#6478E8]">
              SUBJECT MATERIALS
            </Text>

            <Text className="mt-2 text-[28px] font-extrabold leading-[36px] text-[#202B49]">
              {subjectInfo.name}
            </Text>

            <Text className="mt-2 text-[13px] leading-[22px] text-[#71809C]">
              {subjectInfo.description}
            </Text>

            <View className="my-5 h-px bg-white/80" />

            <View className="flex-row items-center">
              <View className="flex-1">
                <Text className="text-[25px] font-extrabold text-[#202B49]">
                  {subjectInfo.topics.length}
                </Text>
                <Text className="mt-1 text-[11px] font-semibold text-[#77829C]">
                  Topics
                </Text>
              </View>

              <View className="flex-1">
                <Text className="text-[25px] font-extrabold text-[#202B49]">
                  {allResources.length}
                </Text>
                <Text className="mt-1 text-[11px] font-semibold text-[#77829C]">
                  Resources
                </Text>
              </View>

              <View className="flex-1">
                <Text className="text-[25px] font-extrabold text-[#6478E8]">
                  {savedCount}
                </Text>
                <Text className="mt-1 text-[11px] font-semibold text-[#77829C]">
                  Saved
                </Text>
              </View>
            </View>
          </LinearGradient>

          {/* LIBRARY OVERVIEW */}
          <View className="mt-8">
            <View className="mb-4">
              <Text className="text-lg font-extrabold text-[#202B49]">
                Library overview
              </Text>
              <Text className="mt-1 text-xs text-[#8992A6]">
                Your available academic resources
              </Text>
            </View>

            <View className="-mx-1.5 flex-row flex-wrap">
              {(
                [
                  {
                    type: "PDF",
                    icon: "document-text",
                    color: "#DC626B",
                    bg: "#FFF1F2",
                    description: "Reading material",
                    detail: "Documents",
                    count: counts.PDF,
                  },
                  {
                    type: "PPT",
                    icon: "easel",
                    color: "#9277D6",
                    bg: "#F4F0FF",
                    description: "Class presentations",
                    detail: "Slides",
                    count: counts.PPT,
                  },
                  {
                    type: "NOTES",
                    icon: "book",
                    color: "#259B78",
                    bg: "#ECF8F2",
                    description: "Study resources",
                    detail: "Study notes",
                    count: counts.NOTES,
                  },
                  {
                    type: "VIDEO",
                    icon: "play-circle",
                    color: "#D99035",
                    bg: "#FFF6E9",
                    description: "Visual learning",
                    detail: "Lessons",
                    count: counts.VIDEO,
                  },
                ] as const
              ).map((item) => (
                <View key={item.type} className="mb-5 w-1/2 px-1.5">
                  <View
                    className="overflow-hidden rounded-[10px] bg-white p-2.5"
                    style={{
                      shadowColor: "#202B49",
                      shadowOpacity: 0.055,
                      shadowRadius: 12,
                      shadowOffset: { width: 0, height: 5 },
                      elevation: 2,
                    }}
                  >
                    <View className="flex-row items-center justify-between">
                      <View
                        className="h-9 w-9 items-center justify-center rounded-[13px]"
                        style={{ backgroundColor: item.bg }}
                      >
                        <Ionicons
                          name={item.icon}
                          size={19}
                          color={item.color}
                        />
                      </View>
                    </View>

                    {/* Resource count */}
                    <Text
                      className="mt-3 text-[23px] font-extrabold text-[#202B49]"
                      numberOfLines={1}
                      adjustsFontSizeToFit
                    >
                      {item.count}
                    </Text>

                    <Text
                      className="mt-0.5 text-[10px] font-extrabold tracking-wide"
                      style={{ color: item.color }}
                      numberOfLines={1}
                    >
                      {item.type}
                    </Text>

                    <View className="my-2 h-[1px] bg-[#EDF0F5]" />

                    <Text
                      className="text-[9px] font-semibold leading-[13px] text-[#8992A6]"
                      numberOfLines={2}
                    >
                      {item.description}
                    </Text>

                    <View className="mt-2 flex-row items-center">
                      <Ionicons
                        name="layers-outline"
                        size={11}
                        color={item.color}
                      />
                      <Text
                        className="ml-1 flex-1 text-[9px] font-bold text-[#59647A]"
                        numberOfLines={1}
                      >
                        {item.detail}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* RESOURCE INSIGHT */}
          <LinearGradient
            colors={["#E8EDFF", "#F1EDFF", "#F9F8FF"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              marginTop: 24,
              padding: 15,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: "#E2E7FA",
              overflow: "hidden",
            }}
          >
            <View className="flex-row items-center">
              <View className="h-11 w-11 items-center justify-center rounded-2xl bg-white">
                <Ionicons name="library-outline" size={22} color="#6478E8" />
              </View>

              <View className="ml-3 flex-1">
                <Text className="text-sm font-extrabold text-[#202B49]">
                  Your study collection
                </Text>
                <Text className="mt-1 text-[11px] text-[#8992A6]">
                  All your subject resources in one place
                </Text>
              </View>
            </View>

            <View className="mt-5 flex-row items-center justify-between">
              <Text className="text-xs font-semibold text-[#77829C]">
                Available resources
              </Text>
              <Text className="text-sm font-extrabold text-[#6478E8]">
                {allResources.length} files
              </Text>
            </View>

            <View className="mt-3 h-2.5 flex-row overflow-hidden rounded-full bg-white">
              {allResources.length > 0 &&
                (
                  [
                    ["PDF", "#DC626B"],
                    ["PPT", "#9277D6"],
                    ["NOTES", "#259B78"],
                    ["VIDEO", "#D99035"],
                  ] as const
                ).map(([type, color]) =>
                  counts[type] > 0 ? (
                    <View
                      key={type}
                      style={{
                        flex: counts[type],
                        backgroundColor: color,
                      }}
                    />
                  ) : null,
                )}
            </View>

            <View className="mt-3 flex-row flex-wrap">
              {(
                [
                  ["PDF", "#DC626B"],
                  ["PPT", "#9277D6"],
                  ["NOTES", "#259B78"],
                  ["VIDEO", "#D99035"],
                ] as const
              ).map(([type, color]) => (
                <View key={type} className="mr-4 mt-1 flex-row items-center">
                  <View
                    className="mr-1.5 h-2 w-2 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                  <Text className="text-[10px] text-[#8992A6]">
                    {type} ({counts[type]})
                  </Text>
                </View>
              ))}
            </View>
          </LinearGradient>

          {/* SEARCH */}
          <View className="mt-8">
            <Text className="text-lg font-extrabold text-[#202B49]">
              Find study materials
            </Text>
            <Text className="mt-1 text-xs text-[#8992A6]">
              Search by topic, document or file type
            </Text>

            <View className="mt-4 h-[54px] flex-row items-center rounded-2xl border border-[#E5E9F2] bg-white px-4">
              <Ionicons name="search-outline" size={20} color="#8992A6" />

              <TextInput
                value={search}
                onChangeText={setSearch}
                placeholder="Search your resources..."
                placeholderTextColor="#A0A8B8"
                className="h-full flex-1 px-3 text-[13px] text-[#202B49]"
                returnKeyType="search"
                autoCapitalize="none"
              />

              {search.length > 0 && (
                <Pressable onPress={() => setSearch("")} hitSlop={8}>
                  <Ionicons name="close-circle" size={19} color="#8992A6" />
                </Pressable>
              )}
            </View>
          </View>

          {/* FILTERS */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mt-4"
            contentContainerStyle={{ paddingRight: 8 }}
          >
            {(["All", "PDF", "PPT", "NOTES", "VIDEO"] as FilterType[]).map(
              (type) => {
                const selected = activeType === type;

                return (
                  <Pressable
                    key={type}
                    onPress={() => setActiveType(type)}
                    className={`mr-2 min-h-[30px] items-center justify-center rounded-full border px-3 ${
                      selected
                        ? "border-[#6478E8] bg-[#6478E8]"
                        : "border-[#E9EDF5] bg-white"
                    }`}
                  >
                    <Text
                      className={`text-xs font-bold ${
                        selected ? "text-white" : "text-[#8992A6]"
                      }`}
                    >
                      {type === "All" ? "All files" : type}
                    </Text>
                  </Pressable>
                );
              },
            )}
          </ScrollView>

          {/* SAVED FILTER */}
          <Pressable
            onPress={() => setSavedOnly((value) => !value)}
            className={`mt-4 min-h-[40px] flex-row items-center self-end rounded-xl border px-2 ${
              savedOnly
                ? "border-[#6478E8] bg-[#EEF1FF]"
                : "border-[#E9EDF5] bg-white"
            }`}
          >
            <Ionicons
              name={savedOnly ? "bookmark" : "bookmark-outline"}
              size={16}
              color={savedOnly ? "#6478E8" : "#8992A6"}
            />
            <Text
              className={`ml-2 text-[11px] font-bold ${
                savedOnly ? "text-[#6478E8]" : "text-[#8992A6]"
              }`}
            >
              Show saved resources ({savedCount})
            </Text>
          </Pressable>

          {/* QUICK ACCESS */}
          {!search.trim() && activeType === "All" && !savedOnly && (
            <View className="mt-8">
              <View className="mb-4 flex-row items-center justify-between">
                <View>
                  <Text className="text-lg font-extrabold text-[#202B49]">
                    Quick access
                  </Text>
                  <Text className="mt-1 text-xs text-[#8992A6]">
                    Recently updated resources
                  </Text>
                </View>

                <View className="h-9 w-9 items-center justify-center rounded-xl bg-[#EEF1FF]">
                  <Ionicons name="flash-outline" size={19} color="#6478E8" />
                </View>
              </View>

              {recentResources.map((resource) => {
                const style = resourceStyle[resource.type];

                return (
                  <View
                    key={resource.id}
                    className="mb-3 min-h-[72px] flex-row items-center rounded-[10px] border border-[#dae4f7ce] bg-white px-3 py-3"
                  >
                    <View
                      className="h-11 w-11 items-center justify-center rounded-[15px]"
                      style={{ backgroundColor: style.bg }}
                    >
                      <Ionicons
                        name={style.icon}
                        size={20}
                        color={style.color}
                      />
                    </View>

                    <View className="ml-3 flex-1">
                      <Text
                        numberOfLines={1}
                        className="text-xs font-extrabold text-[#202B49]"
                      >
                        {resource.title}
                      </Text>
                      <Text className="mt-1 text-[10px] text-[#8992A6]">
                        {resource.topic} · {resource.type} · {resource.date}
                      </Text>
                    </View>

                    <Ionicons name="time-outline" size={18} color="#A0A8B8" />
                  </View>
                );
              })}
            </View>
          )}

          {/* TOPICS */}
          <View className="mt-8">
            <View className="mb-4 flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="text-lg font-extrabold text-[#202B49]">
                  Topics & Materials
                </Text>
                <Text className="mt-1 text-xs text-[#8992A6]">
                  {visibleTopics.length} topics · {filteredResources.length}{" "}
                  files
                </Text>
              </View>

              <Pressable
                onPress={toggleAllTopics}
                className="ml-2 min-h-[40px] justify-center rounded-xl bg-[#EEF1FF] px-3"
              >
                <Text className="text-[10px] font-extrabold text-[#6478E8]">
                  {allExpanded ? "Collapse all" : "Expand all"}
                </Text>
              </Pressable>
            </View>

            {visibleTopics.length === 0 ? (
              <View className="items-center rounded-[26px] border border-[#E9EDF5] bg-white px-6 py-10">
                <View className="h-14 w-14 items-center justify-center rounded-2xl bg-[#F2F4FA]">
                  <Ionicons
                    name="documents-outline"
                    size={27}
                    color="#8992A6"
                  />
                </View>

                <Text className="mt-4 text-base font-extrabold text-[#202B49]">
                  No resources found
                </Text>

                <Text className="mt-2 text-center text-xs leading-5 text-[#8992A6]">
                  Try another search or change your selected filters.
                </Text>

                <Pressable
                  onPress={clearFilters}
                  className="mt-5 min-h-[42px] justify-center rounded-xl bg-[#EEF1FF] px-5"
                >
                  <Text className="text-xs font-extrabold text-[#6478E8]">
                    Clear filters
                  </Text>
                </Pressable>
              </View>
            ) : (
              visibleTopics.map((topic, index) => {
                const expanded =
                  expandedTopics.includes(topic.id) || search.trim().length > 0;

                const topicCounts: [string, number, string][] = [
                  [
                    "PDF",
                    topic.resources.filter((item) => item.type === "PDF")
                      .length,
                    "#DC626B",
                  ],
                  [
                    "PPT",
                    topic.resources.filter((item) => item.type === "PPT")
                      .length,
                    "#9277D6",
                  ],
                  [
                    "Notes",
                    topic.resources.filter((item) => item.type === "NOTES")
                      .length,
                    "#259B78",
                  ],
                  [
                    "Video",
                    topic.resources.filter((item) => item.type === "VIDEO")
                      .length,
                    "#D99035",
                  ],
                ];

                return (
                  <View
                    key={topic.id}
                    className="mb-4 overflow-hidden rounded-[10px] border border-gray-100/30 bg-white"
                    style={{
                      shadowColor: "#202B49",
                      shadowOpacity: 0.025,
                      shadowRadius: 9,
                      shadowOffset: { width: 0, height: 3 },
                      elevation: 1,
                    }}
                  >
                    <Pressable
                      onPress={() => toggleTopic(topic.id)}
                      className="min-h-[82px] flex-row items-center px-4 py-4"
                    >
                      <LinearGradient
                        colors={["#E8EDFF", "#F1EDFF", "#F9F8FF"]}
                        style={{
                          padding: 7,
                          borderRadius: 10,
                          borderWidth: 1,
                          borderColor: "#E8EDFF",
                          flexDirection: "row",
                          alignItems: "center",
                          overflow: "hidden",
                        }}
                      >
                        <Text className="text-sm font-extrabold text-[#6478E8]">
                          {String(index + 1).padStart(2, "0")}
                        </Text>
                      </LinearGradient>

                      <View className="ml-3 flex-1">
                        <Text className="text-[13px] font-extrabold leading-5 text-[#202B49]">
                          {topic.name}
                        </Text>
                        <Text className="mt-1 text-[11px] text-[#8992A6]">
                          {topic.resources.length} available resources
                        </Text>
                      </View>

                      <View className="h-9 w-9 items-center justify-center">
                        <Ionicons
                          name={expanded ? "chevron-up" : "chevron-down"}
                          size={18}
                          color="#6478E8"
                        />
                      </View>
                    </Pressable>

                    {expanded && (
                      <View className="border-t border-[#F0F2F7] px-4 pb-4">
                        <Text className="mb-3 mt-4 text-[11px] leading-[19px] text-[#8992A6]">
                          {topic.description}
                        </Text>

                        {/* TOPIC BREAKDOWN */}
                        <View className="mb-3 flex-row flex-wrap">
                          {topicCounts.map(([label, count, color]) => (
                            <View
                              key={label}
                              className="mb-2 mr-2 flex-row items-center rounded-xl bg-[#F7F8FC] px-3 py-2"
                            >
                              <View
                                className="mr-1.5 h-1.5 w-1.5 rounded-full"
                                style={{ backgroundColor: color }}
                              />
                              <Text className="text-[10px] font-bold text-[#8992A6]">
                                {count} {label}
                              </Text>
                            </View>
                          ))}
                        </View>

                        {/* RESOURCE LIST */}
                        {topic.resources.map((resource) => {
                          const style = resourceStyle[resource.type];
                          const saved = bookmarks.includes(resource.id);

                          return (
                            <View
                              key={resource.id}
                              className="mb-3 min-h-[82px] flex-row items-center rounded-[10px] border border-[#EDF0F6] bg-[#FCFCFE] px-3 py-3"
                            >
                              <View
                                className="h-12 w-12 items-center justify-center rounded-[15px]"
                                style={{ backgroundColor: style.bg }}
                              >
                                <Ionicons
                                  name={style.icon}
                                  size={21}
                                  color={style.color}
                                />
                              </View>

                              <View className="ml-3 flex-1">
                                <Text
                                  numberOfLines={2}
                                  className="text-xs font-extrabold leading-5 text-[#202B49]"
                                >
                                  {resource.title}
                                </Text>

                                <View className="mt-1 flex-row flex-wrap items-center">
                                  <Text
                                    className="text-[10px] font-extrabold"
                                    style={{ color: style.color }}
                                  >
                                    {resource.type}
                                  </Text>

                                  <Text className="mx-1 text-[10px] text-[#B4BBC8]">
                                    ·
                                  </Text>

                                  <Text className="text-[10px] text-[#8992A6]">
                                    {resource.size}
                                  </Text>
                                </View>

                                <Text className="mt-1 text-[10px] text-[#A0A8B8]">
                                  Updated {resource.date}
                                </Text>
                              </View>

                              <Pressable
                                onPress={() => toggleBookmark(resource.id)}
                                hitSlop={4}
                                className="ml-2 h-11 w-11 items-center justify-center rounded-2xl border border-[#EEF0F6] bg-white"
                              >
                                <Ionicons
                                  name={saved ? "bookmark" : "bookmark-outline"}
                                  size={18}
                                  color={saved ? "#6478E8" : "#A0A8B8"}
                                />
                              </Pressable>
                            </View>
                          );
                        })}
                      </View>
                    )}
                  </View>
                );
              })
            )}
          </View>

          {/* FOOTER */}
          <LinearGradient
            colors={["#E8EDFF", "#F1EDFF", "#F9F8FF"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              marginTop: 12,
              padding: 20,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: "#E7E9FA",
              flexDirection: "row",
              alignItems: "center",
              overflow: "hidden",
            }}
          >
            <View className="h-11 w-11 items-center justify-center rounded-2xl bg-white">
              <Ionicons name="bookmark-outline" size={20} color="#6478E8" />
            </View>

            <View className="ml-3 flex-1">
              <Text className="text-xs font-extrabold text-[#202B49]">
                Keep important files close
              </Text>
              <Text className="mt-1 text-[10px] leading-[17px] text-[#77829C]">
                Bookmark your study materials for quick access later.
              </Text>
            </View>
          </LinearGradient>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
