import React, { useMemo, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import BottomSheet from '../../../components/bottomsheet';
import { X, ChevronLeft, ChevronRight } from 'lucide-react-native';
import { normalize } from '../../../utils/responsive';
import moment from 'moment';
import { setStartDate } from '../store/home.store';
import { startDate } from '../store/home.store';
import { useSignal, useComputed } from '@preact/signals-react';

const { width } = Dimensions.get('window');


interface DatePickerBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  onClear: () => void;
  month: number; // 0-based
  year: number;
  setMonth: (m: number) => void;
  setYear: (y: number) => void;
}

const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

const DatePickerBottomSheet: React.FC<DatePickerBottomSheetProps> = ({
  visible,
  onClose,
  onClear,
  month,
  year,
  setMonth,
  setYear,
}) => {
  // Calculate days in month and first day
  const firstDay = useMemo(() => new Date(year, month, 1).getDay(), [year, month]);
  const daysInMonth = useMemo(() => new Date(year, month + 1, 0).getDate(), [year, month]);

  useEffect(() => {
    console.log("Start Date Updated:", startDate.value);
  }, [startDate.value]);

  // Build calendar grid as weeks
  const weeks = useMemo(() => {
    const days = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) days.push(d);
    while (days.length % 7 !== 0) days.push(null);
    const weeksArr = [];
    for (let i = 0; i < days.length; i += 7) {
      weeksArr.push(days.slice(i, i + 7));
    }
    return weeksArr;
  }, [firstDay, daysInMonth]);

  const handlePrevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  };
  const handleNextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };

  const isSelected = (d: number) => {
    if (!startDate) return false;
    return (
        startDate?.value?.getFullYear() === year &&
        startDate?.value?.getMonth() === month &&
        startDate?.value?.getDate() === d
    );
  };

  return (
    <BottomSheet visible={visible} onClose={onClose} heightPercent={0.9}>
  <View style={{ flex: 1, justifyContent: 'space-between' }}>
    <View>
      <View style={styles.headerRow}>
        <Text style={styles.header}>Pick a date</Text>
        <TouchableOpacity onPress={onClose}>
          <X color="#222" size={24} />
        </TouchableOpacity>
      </View>
      <Text style={styles.subtitle}>Show events up to selected date</Text>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <View style={styles.calendarHeaderRow}>
          <Text style={styles.monthText}>
            {new Date(year, month).toLocaleString('default', {
              month: 'long',
              year: 'numeric',
            })}
          </Text>
          <TouchableOpacity onPress={handleNextMonth} style={styles.arrowBtn}>
            <ChevronRight color="#0C0453" size={18} />
          </TouchableOpacity>
        </View>

        <View style={styles.calendarHeaderRow}>
          <TouchableOpacity onPress={handlePrevMonth} style={styles.arrowBtn}>
            <ChevronLeft color="#0C0453" size={24} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleNextMonth} style={styles.arrowBtn}>
            <ChevronRight color="#0C0453" size={24} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.daysOfWeekRow}>
        {daysOfWeek.map(d => (
          <Text key={d} style={styles.dayOfWeek}>
            {d}
          </Text>
        ))}
      </View>

      <View style={styles.calendarGrid}>
        {weeks.map((week, wi) => (
          <View key={wi} style={{ flexDirection: 'row' }}>
            {week.map((d, di) =>
              d ? (
                <TouchableOpacity
                  key={di}
                  style={[styles.dayCell, isSelected(d) && styles.selectedDayCell]}
                  onPress={() => {
                    setStartDate(new Date(year, month, d))
                  }}
                >
                  <Text style={[styles.dayText, isSelected(d) && styles.selectedDayText]}>
                    {d}
                  </Text>
                </TouchableOpacity>
              ) : (
                <View key={di} style={styles.dayCell} />
              )
            )}
          </View>
        ))}
      </View>
    </View>
    <TouchableOpacity style={styles.clearBtn} onPress={onClear}>
      <Text style={styles.clearBtnText}>Clear selection</Text>
    </TouchableOpacity>
    
  </View>
</BottomSheet>

  );
};

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    marginTop: normalize(10),
    paddingHorizontal: 8,
  },
  header: {
    fontWeight: 'bold',
    fontSize: 22,
  },
  subtitle: {
    color: '#666',
    fontSize: 14,
    marginBottom: 16,
    marginLeft: 8,
  },
  calendarHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: normalize(10),
    marginBottom: 8,
  },
  arrowBtn: {
    padding: 6,
  },
  arrow: {
    fontSize: 22,
    color: '#2D2154',
    fontWeight: 'bold',
  },
  monthText: {
    fontSize: 18,
    fontWeight: '600',
    marginHorizontal: 10,
    color: '#222',
  },
  daysOfWeekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
    marginLeft: normalize(10)
  },
  dayOfWeek: {
    flex: 1,
    textAlign: 'center',
    color: '#888',
    fontWeight: '600',
    fontSize: 13,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: 8,
    marginBottom: 16,
  },
  dayCell: {
    width: (width - 32) / 7,
    aspectRatio: 1.2,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  dayText: {
    fontSize: 16,
    color: '#222',
    fontWeight: '400',
  },
  selectedDayCell: {
    backgroundColor: '#0C0453',
    borderRadius: 50,
  },
  selectedDayText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  clearBtn: {
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#F0F0F0',
    paddingVertical: normalize(10),
    marginBottom: normalize(120),
    
  },
  clearBtnText: {
    color: '#0C0453',
    fontWeight: '500',
    fontSize: 16,
  },
});

export default DatePickerBottomSheet; 