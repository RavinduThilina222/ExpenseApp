import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ScrollView, Dimensions, TouchableOpacity, Modal } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { getExpenses, calculateTotal } from '../utils/expenseUtils';
import { useFocusEffect } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';

const screenWidth = Dimensions.get('window').width;

const HomeScreen = ({ navigation }: any) => {
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [total, setTotal] = useState(0);
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  
  // Filter states
  const [startDate, setStartDate] = useState(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)); // 30 days ago
  const [endDate, setEndDate] = useState(new Date());
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  
  type PieChartData = {
    name: string;
    amount: number;
    color: string;
    legendFontColor: string;
    legendFontSize: number;
  };
  
  const [chartData, setChartData] = useState<PieChartData[]>([]);

  const categories = ['All', 'Food', 'Travel', 'Shopping', 'Utility', 'Other'];

  const fetchData = async () => {
    try {
      const data = await getExpenses();
      setExpenses(data);
      applyFilters(data);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
  };

  const applyFilters = (data: any[]) => {
    let filtered = data;

    // Filter by date range
    filtered = filtered.filter(expense => {
      const expenseDate = new Date(expense.date);
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      // Set time to start/end of day for accurate comparison
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      
      return expenseDate >= start && expenseDate <= end;
    });

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(expense => expense.category === selectedCategory);
    }

    setFilteredExpenses(filtered);
    setTotal(calculateTotal(filtered));
    generateChartData(filtered);
  };

  const generateChartData = (data: any[]) => {
    const categoryTotals = data.reduce((acc: any, expense: any) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {});

    const chartColors = {
      Food: '#4A90E2',
      Travel: '#2E5BBA',
      Shopping: '#1E3A8A',
      Utility: '#60A5FA',
      Other: '#3B82F6'
    };

    const pieData = Object.entries(categoryTotals).map(([category, amount]: [string, any]) => ({
      name: category,
      amount: amount,
      color: chartColors[category as keyof typeof chartColors] || '#6B7280',
      legendFontColor: '#374151',
      legendFontSize: 14,
    }));

    setChartData(pieData);
  };

  const handleApplyFilters = () => {
    applyFilters(expenses);
    setIsFilterModalVisible(false);
  };

  const handleClearFilters = () => {
    setStartDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
    setEndDate(new Date());
    setSelectedCategory('All');
    applyFilters(expenses);
    setIsFilterModalVisible(false);
  };

  // Use useFocusEffect to refresh data when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, [])
  );

  // Also fetch data on initial mount
  useEffect(() => {
    fetchData();
  }, []);

  // Apply filters whenever filter criteria change
  useEffect(() => {
    if (expenses.length > 0) {
      applyFilters(expenses);
    }
  }, [startDate, endDate, selectedCategory]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Expense Tracker</Text>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total Expenses</Text>
          <Text style={styles.totalAmount}>Rs.{total.toFixed(2)}</Text>
        </View>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={styles.addButton} 
          onPress={() => navigation.navigate('AddExpense')}
        >
          <Text style={styles.addButtonText}>+ Add Expense</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.filterButton} 
          onPress={() => setIsFilterModalVisible(true)}
        >
          <Text style={styles.filterButtonText}>🔍 Filter</Text>
        </TouchableOpacity>
      </View>

      {/* Filter Summary */}
      <View style={styles.filterSummary}>
        <Text style={styles.filterSummaryText}>
          {selectedCategory !== 'All' ? `${selectedCategory} • ` : ''}
          {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}
        </Text>
        <Text style={styles.filterResultsText}>
          {filteredExpenses.length} expense{filteredExpenses.length !== 1 ? 's' : ''}
        </Text>
      </View>
      
      {chartData.length > 0 && (
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Expenses by Category</Text>
          <PieChart
            data={chartData}
            width={screenWidth - 32}
            height={220}
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
            }}
            accessor="amount"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          />
        </View>
      )}
      
      <Text style={styles.listTitle}>Expenses</Text>
      {filteredExpenses.length > 0 ? (
        <FlatList
          data={filteredExpenses}
          keyExtractor={(item: any) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.expenseItem}
              onPress={() => navigation.navigate('ExpenseDetail', { expense: item })}
            >
              <View style={styles.expenseContent}>
                <Text style={styles.expenseTitle}>{item.title}</Text>
                <Text style={styles.expenseAmount}>Rs.{item.amount}</Text>
              </View>
              <View style={styles.expenseFooter}>
                <Text style={styles.categoryText}>{item.category}</Text>
                <Text style={styles.dateText}>
                  {new Date(item.date).toLocaleDateString()}
                </Text>
              </View>
            </TouchableOpacity>
          )}
          scrollEnabled={false}
        />
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No expenses found</Text>
          <Text style={styles.emptyStateSubtext}>
            {expenses.length === 0 
              ? 'Add your first expense to get started' 
              : 'Try adjusting your filters'
            }
          </Text>
        </View>
      )}

      {/* Filter Modal */}
      <Modal
        visible={isFilterModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsFilterModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Filter Expenses</Text>
            
            {/* Date Range Section */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Date Range</Text>
              
              <View style={styles.dateRow}>
                <View style={styles.dateContainer}>
                  <Text style={styles.dateLabel}>Start Date</Text>
                  <TouchableOpacity 
                    style={styles.dateButton}
                    onPress={() => setShowStartDatePicker(true)}
                  >
                    <Text style={styles.dateButtonText}>
                      {startDate.toLocaleDateString()}
                    </Text>
                  </TouchableOpacity>
                </View>
                
                <View style={styles.dateContainer}>
                  <Text style={styles.dateLabel}>End Date</Text>
                  <TouchableOpacity 
                    style={styles.dateButton}
                    onPress={() => setShowEndDatePicker(true)}
                  >
                    <Text style={styles.dateButtonText}>
                      {endDate.toLocaleDateString()}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Category Section */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Category</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={selectedCategory}
                  onValueChange={setSelectedCategory}
                  style={styles.picker}
                >
                  {categories.map(category => (
                    <Picker.Item key={category} label={category} value={category} />
                  ))}
                </Picker>
              </View>
            </View>

            {/* Modal Buttons */}
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.clearButton}
                onPress={handleClearFilters}
              >
                <Text style={styles.clearButtonText}>Clear Filters</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.applyButton}
                onPress={handleApplyFilters}
              >
                <Text style={styles.applyButtonText}>Apply Filters</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Date Pickers */}
      {showStartDatePicker && (
        <DateTimePicker
          value={startDate}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowStartDatePicker(false);
            if (selectedDate) setStartDate(selectedDate);
          }}
        />
      )}
      
      {showEndDatePicker && (
        <DateTimePicker
          value={endDate}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowEndDatePicker(false);
            if (selectedDate) setEndDate(selectedDate);
          }}
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 24,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
  },
  totalContainer: {
    backgroundColor: '#2563EB',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 14,
    color: '#DBEAFE',
    marginBottom: 4,
  },
  totalAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  actionButtons: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 20,
    gap: 12,
  },
  addButton: {
    backgroundColor: '#3B82F6',
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  filterButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#3B82F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  filterButtonText: {
    color: '#3B82F6',
    fontSize: 16,
    fontWeight: '600',
  },
  filterSummary: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  filterSummaryText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  filterResultsText: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '600',
  },
  chartContainer: {
    marginHorizontal: 16,
    marginTop: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#1F2937',
    textAlign: 'center',
  },
  listTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 24,
    marginBottom: 12,
    marginHorizontal: 16,
    color: '#1F2937',
  },
  expenseItem: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginVertical: 6,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  expenseContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  expenseTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
  },
  expenseAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3B82F6',
  },
  expenseFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryText: {
    fontSize: 12,
    color: '#3B82F6',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    fontWeight: '500',
  },
  dateText: {
    fontSize: 12,
    color: '#6B7280',
  },
  emptyState: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 20,
    padding: 40,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    width: '90%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 24,
  },
  filterSection: {
    marginBottom: 24,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  dateContainer: {
    flex: 1,
  },
  dateLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  dateButton: {
    backgroundColor: '#F3F4F6',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    alignItems: 'center',
  },
  dateButtonText: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '500',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },
  picker: {
    height: 50,
    width: '100%',
    color: '#1F2937',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  clearButton: {
    backgroundColor: '#F3F4F6',
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  clearButtonText: {
    color: '#6B7280',
    fontSize: 16,
    fontWeight: '600',
  },
  applyButton: {
    backgroundColor: '#3B82F6',
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default HomeScreen;