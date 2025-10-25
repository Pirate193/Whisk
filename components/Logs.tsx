import { api } from '@/convex/_generated/api';
import { useAuth } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from 'convex/react';
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';

const LogsComponent = () => {
  const { userId } = useAuth();
  const [selectedTimeRange, setSelectedTimeRange] = useState<'all' | 'week' | 'month'>('week');

  // Get date ranges
  const { startDate, endDate } = useMemo(() => {
    const today = new Date();
    const end = today.toISOString().split('T')[0];
    let start = end;

    if (selectedTimeRange === 'week') {
      const weekAgo = new Date(today);
      weekAgo.setDate(weekAgo.getDate() - 7);
      start = weekAgo.toISOString().split('T')[0];
    } else if (selectedTimeRange === 'month') {
      const monthAgo = new Date(today);
      monthAgo.setDate(monthAgo.getDate() - 30);
      start = monthAgo.toISOString().split('T')[0];
    } else {
      // All time - get logs from 90 days ago
      const ninetyDaysAgo = new Date(today);
      ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
      start = ninetyDaysAgo.toISOString().split('T')[0];
    }

    return { startDate: start, endDate: end };
  }, [selectedTimeRange]);

  // Fetch logs
  const logs = useQuery(
    api.meallogs.getMealLogsByDateRange,
    userId ? { userId, startDate, endDate } : 'skip'
  );

  // Group logs by relative time periods
  const groupedLogs = useMemo(() => {
    if (!logs) return null;

    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    const lastWeekStart = new Date(today);
    lastWeekStart.setDate(lastWeekStart.getDate() - 7);

    const lastMonthStart = new Date(today);
    lastMonthStart.setDate(lastMonthStart.getDate() - 30);

    const groups: {
      today: any[];
      yesterday: any[];
      thisWeek: any[];
      lastWeek: any[];
      older: any[];
    } = {
      today: [],
      yesterday: [],
      thisWeek: [],
      lastWeek: [],
      older: [],
    };

    logs.forEach((log) => {
      const logDate = new Date(log.date);
      const logDateStr = log.date;

      if (logDateStr === todayStr) {
        groups.today.push(log);
      } else if (logDateStr === yesterdayStr) {
        groups.yesterday.push(log);
      } else if (logDate >= lastWeekStart && logDate < yesterday) {
        groups.thisWeek.push(log);
      } else if (logDate >= lastMonthStart && logDate < lastWeekStart) {
        groups.lastWeek.push(log);
      } else {
        groups.older.push(log);
      }
    });

    return groups;
  }, [logs]);

  // Format date nicely
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  // Get meal type icon and color
  const getMealTypeConfig = (mealType: string) => {
    switch (mealType) {
      case 'breakfast':
        return { icon: 'cafe-outline', color: '#f97316', bgColor: 'bg-orange-100 dark:bg-orange-900/30' };
      case 'lunch':
        return { icon: 'restaurant-outline', color: '#3b82f6', bgColor: 'bg-blue-100 dark:bg-blue-900/30' };
      case 'dinner':
        return { icon: 'restaurant-outline', color: '#8b5cf6', bgColor: 'bg-purple-100 dark:bg-purple-900/30' };
      case 'snack':
        return { icon: 'fast-food-outline', color: '#ec4899', bgColor: 'bg-pink-100 dark:bg-pink-900/30' };
      default:
        return { icon: 'restaurant-outline', color: '#6b7280', bgColor: 'bg-gray-100 dark:bg-gray-900/30' };
    }
  };

  // Render log card
  const renderLogCard = (log: any) => {
    const mealConfig = getMealTypeConfig(log.mealType);

    return (
       <TouchableOpacity
        key={log._id}
        className="flex-row items-center bg-white dark:bg-secondary-dark rounded-xl p-3 mb-2 border border-gray-200 dark:border-black"
        onPress={() => router.push({ pathname: '/[recipeId]', params: { recipeId: log.recipeId } })}
        activeOpacity={0.7}
      >
        {/* Meal Type Icon */}
        <View className={`w-12 h-12 rounded-xl items-center justify-center mr-3 ${mealConfig.bgColor}`}>
          <Ionicons name={mealConfig.icon as any} size={20} color={mealConfig.color} />
        </View>

        {/* Info */}
        <View className="flex-1">
          <View className="flex-row items-center justify-between mb-1">
            <Text className="text-sm font-semibold text-gray-900 dark:text-white capitalize">
              {log.mealType}
            </Text>
            {log.rating && (
              <View className="flex-row items-center">
                <Ionicons name="star" size={12} color="#fbbf24" />
                <Text className="text-xs font-semibold text-gray-900 dark:text-white ml-1">
                  {log.rating}
                </Text>
              </View>
            )}
          </View>
          <View className="flex-row items-center gap-3">
            <View className="flex-row items-center">
              <Ionicons name="flame-outline" size={12} color="#9ca3af" />
              <Text className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                {Math.round(log.nutrition.calories)} cal
              </Text>
            </View>
            <View className="flex-row items-center">
              <Ionicons name="people-outline" size={12} color="#9ca3af" />
              <Text className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                {log.servings}x
              </Text>
            </View>
            <View className="flex-row items-center">
              <Text className="text-xs text-green-600 dark:text-green-400 font-medium">
                {Math.round(log.nutrition.protein)}g protein
              </Text>
            </View>
          </View>
        </View>

        <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
      </TouchableOpacity>
    );
  };

  // Render section
  const renderSection = (title: string, logs: any[], icon: string) => {
    if (logs.length === 0) return null;

    return (
      <View className="mb-6">
        <View className="flex-row items-center mb-3 px-4">
          <View className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 items-center justify-center mr-2">
            <Ionicons name={icon as any} size={16} color="#3b82f6" />
          </View>
          <Text className="text-lg font-bold text-gray-900 dark:text-white">
            {title}
          </Text>
          <Text className="text-sm text-gray-500 dark:text-gray-400 ml-2">
            ({logs.length})
          </Text>
        </View>
        <View className="px-4">
          {logs.map(renderLogCard)}
        </View>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-gray-50 dark:bg-black">
      {/* Header */}
      <View className="bg-white dark:bg-black px-4 pt-4 pb-3 border-b border-gray-200 dark:border-gray-800">

        {/* Time Range Filter */}
        <View className="flex-row gap-2">
          {[
            { key: 'week', label: 'This Week' },
            { key: 'month', label: 'This Month' },
            { key: 'all', label: 'All Time' },
          ].map((option) => (
            <TouchableOpacity
              key={option.key}
              onPress={() => setSelectedTimeRange(option.key as any)}
              className={`px-4 py-2 rounded-full border-2 ${
                selectedTimeRange === option.key
                  ? 'bg-primary-light'
                  : 'bg-gray-100 dark:bg-secondary-dark border-gray-300 dark:border-black'
              }`}
            >
              <Text
                className={`text-sm font-medium ${
                  selectedTimeRange === option.key
                    ? 'text-black'
                    : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Content */}
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {logs === undefined ? (
          <View className="flex-1 items-center justify-center py-20">
            <ActivityIndicator size="large" color="#3b82f6" />
            <Text className="text-gray-500 dark:text-gray-400 mt-4">Loading logs...</Text>
          </View>
        ) : !groupedLogs || (
          groupedLogs.today.length === 0 &&
          groupedLogs.yesterday.length === 0 &&
          groupedLogs.thisWeek.length === 0 &&
          groupedLogs.lastWeek.length === 0 &&
          groupedLogs.older.length === 0
        ) ? (
          <View className="flex-1 items-center justify-center py-20 px-8">
            <View className="w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-800 items-center justify-center mb-4">
              <Ionicons name="calendar-outline" size={48} color="#9ca3af" />
            </View>
            <Text className="text-xl font-semibold text-gray-900 dark:text-white mb-2 text-center">
              No Logs Yet
            </Text> 
            <Text className="text-base text-gray-500 dark:text-gray-400 text-center">
              Start logging your meals to track your nutrition and progress
            </Text>
          </View>
        ) : (
          <View className="py-4">
            {renderSection('Today', groupedLogs.today, 'today-outline')}
            {renderSection('Yesterday', groupedLogs.yesterday, 'time-outline')}
            {renderSection('This Week', groupedLogs.thisWeek, 'calendar-outline')}
            {renderSection('Earlier', groupedLogs.lastWeek, 'albums-outline')}
            {renderSection('Older', groupedLogs.older, 'file-tray-outline')}
          </View>
        )}

        {/* Bottom spacing */}
        <View className="h-20" />
      </ScrollView>
    </View>
  );
};

export default LogsComponent;