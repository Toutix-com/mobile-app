import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from 'react-native';
import BottomSheet from '../../../components/bottomsheet';
import { X, ChevronLeft, ChevronRight, Calendar } from 'lucide-react-native';
import { normalize } from '../../../utils/responsive';
import { useSignals } from '@preact/signals-react/runtime';
import { selectedDate, setSelectedDate, selectedMonth, setSelectedMonth, updateEventCount } from '../store/search.store';

const { width } = Dimensions.get('window');

interface DatePickerBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  onUseSelected: () => void;
}

const DatePickerBottomSheet: React.FC<DatePickerBottomSheetProps> = ({
  visible,
  onClose,
  onUseSelected,
}) => {
  useSignals();
  
  // Local state for calendar navigation
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  // Generate calendar days for current month
  const getDaysInMonth = (month: number, year: number) => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    const days = [];
    
    // Add empty days for padding
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    
    return days;
  };

  const calendarDays = getDaysInMonth(currentMonth, currentYear);
  const today = new Date();
  const isToday = (day: number) => {
    return day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();
  };

  const isSelectedDate = (day: number) => {
    if (!selectedDate.value) return false;
    
    // Parse the selected date string (format: "Month Day, Year")
    const selectedDateParts = selectedDate.value.split(' ');
    if (selectedDateParts.length !== 3) return false;
    
    const selectedMonthName = selectedDateParts[0];
    const selectedDay = parseInt(selectedDateParts[1].replace(',', ''));
    const selectedYear = parseInt(selectedDateParts[2]);
    
    // Compare with current calendar month, day, and year
    return day === selectedDay && 
           months[currentMonth] === selectedMonthName && 
           currentYear === selectedYear;
  };

  const handleDateSelect = (day: number) => {
    if (!day) return;
    const selectedDateString = `${months[currentMonth]} ${day}, ${currentYear}`;
    setSelectedDate(selectedDateString);
    updateEventCount();
    onUseSelected();
  };

  const handleMonthSelect = (month: string, year: number) => {
    const monthString = `${month} ${year}`;
    setSelectedMonth(monthString);
    updateEventCount();
    onUseSelected();
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    } else {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    }
  };

  // Generate months for horizontal scroll (current year + next year)
  const generateMonthOptions = () => {
    const options = [];
    const currentYear = new Date().getFullYear();
    
    // Add remaining months of current year
    for (let month = new Date().getMonth(); month < 12; month++) {
      options.push({
        month: months[month],
        year: currentYear
      });
    }
    
    // Add all months of next year
    for (let month = 0; month < 12; month++) {
      options.push({
        month: months[month],
        year: currentYear + 1
      });
    }
    
    return options;
  };

  const monthOptions = generateMonthOptions();

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      heightPercent={0.93}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Pick a date</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X color="#000" size={24} />
          </TouchableOpacity>
        </View>

        <Text style={styles.subtitle}>Show events up to selected date</Text>

        {/* Calendar Section */}
        <View style={styles.calendarContainer}>
          <View style={styles.monthHeader}>
            <View style={styles.monthHeaderRow}>
            <Text style={styles.monthTitle}>{months[currentMonth]} {currentYear}</Text>
            <TouchableOpacity onPress={() => navigateMonth('next')} style={styles.navButtonMonthNext}>
                <ChevronRight color="#000" size={20} />
              </TouchableOpacity>
            </View>
            <View style={styles.navigationButtons}>
              <TouchableOpacity onPress={() => navigateMonth('prev')} style={styles.navButton}>
                <ChevronLeft color="#000" size={25} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigateMonth('next')} style={styles.navButton}>
                <ChevronRight color="#000" size={25} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Days of Week */}
          <View style={styles.daysOfWeek}>
            {daysOfWeek.map((day) => (
              <Text key={day} style={styles.dayOfWeek}>{day}</Text>
            ))}
          </View>

          {/* Calendar Grid */}
          <View style={styles.calendarGrid}>
            {calendarDays.map((day, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.calendarDay,
                  day && isSelectedDate(day) ? styles.selectedDay : null,
                  day && isToday(day) ? styles.today : null
                ]}
                onPress={() => day && handleDateSelect(day)}
                disabled={!day}
              >
                {day && (
                  <Text style={[
                    styles.dayText,
                    isSelectedDate(day) ? styles.selectedDayText : null,
                    isToday(day) && !isSelectedDate(day) ? styles.todayText : null
                  ]}>
                    {day}
                  </Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Month Selection Section */}
        <View style={styles.monthSelectionContainer}>
          <Text style={styles.monthSelectionTitle}>Show events on a month</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.monthScrollView}
            contentContainerStyle={styles.monthScrollContent}
          >
            {monthOptions.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.monthCard,
                  selectedMonth.value === `${option.month} ${option.year}` && styles.selectedMonthCard
                ]}
                onPress={() => handleMonthSelect(option.month, option.year)}
              >
                <Calendar color={selectedMonth.value === `${option.month} ${option.year}` ? "#fff" : "#000"} size={20} />
                <Text style={[
                  styles.monthCardText,
                  selectedMonth.value === `${option.month} ${option.year}` && styles.selectedMonthCardText
                ]}>
                  {option.month} {option.year}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
  },
  title: {
    fontSize: normalize(20),
    fontWeight: 'bold',
    color: '#0D1117',
  },
  closeButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subtitle: {
    fontSize: normalize(14),
    color: '#666',
    marginBottom: 20,
  },
  calendarContainer: {
    marginBottom: 30,
  },
  monthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  monthTitle: {
    fontSize: normalize(18),
    fontWeight: 'bold',
    color: '#0D1117',
  },
  monthHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',

  },
  navigationButtons: {
    flexDirection: 'row',
  },
  navButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  navButtonMonthNext: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: normalize(5),
  },
  daysOfWeek: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  dayOfWeek: {
    flex: 1,
    textAlign: 'center',
    fontSize: normalize(12),
    fontWeight: '600',
    color: '#666',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  calendarDay: {
    width: (width - normalize(32)) / 7,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 2,
  },
  dayText: {
    fontSize: normalize(14),
    color: '#0D1117',
  },
  selectedDay: {
    backgroundColor: '#0C0453',
    borderRadius: 50,
  },
  selectedDayText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  today: {
    borderBottomWidth: 2,
    borderBottomColor: '#0C0453',
  },
  todayText: {
    color: '#0C0453',
    fontWeight: 'bold',
  },
  monthSelectionContainer: {
    marginBottom: 30,
  },
  monthSelectionTitle: {
    fontSize: normalize(14),
    color: '#666',
    marginBottom: 15,
  },
  monthScrollView: {
    flexGrow: 0,
  },
  monthScrollContent: {
    paddingRight: 20,
  },
  monthCard: {
    width: 100,
    height: 80,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  selectedMonthCard: {
    backgroundColor: '#0C0453',
    borderColor: '#0C0453',
  },
  monthCardText: {
    fontSize: normalize(12),
    fontWeight: '600',
    color: '#0D1117',
    marginTop: 8,
    textAlign: 'center',
  },
  selectedMonthCardText: {
    color: '#fff',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  clearButton: {
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: '#F5F6FA',
  },
  clearButtonText: {
    color: '#0C0453',
    fontWeight: 'bold',
    fontSize: 16,
  },
  useSelectedButton: {
    flex: 1,
    marginLeft: 10,
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: '#0C0453',
  },
  useSelectedButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default DatePickerBottomSheet; 