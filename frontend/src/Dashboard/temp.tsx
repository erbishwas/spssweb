import React, { useState, useEffect } from 'react';
import PieChartComponent from './AttendancePieChart';
import BarChartComponent from './BarChartComponent';
import AttendanceStatsCard from './AttendanceStatsCard';
import { FiUsers, FiUserCheck, FiUserX, FiBook, FiAward } from 'react-icons/fi';

interface SchoolTotals {
  date: string;
  total_students: number;
  total_present?: number;
  total_absent?: number;
  boys_total: number;
  boys_present?: number;
  boys_absent?: number;
  girls_total: number;
  girls_present?: number;
  girls_absent?: number;
  other_gender_total: number;
  other_gender_present?: number;
  other_gender_absent?: number;
}

interface ClassData {
  grade_id: number;
  grade_name: string;
  total_students: number;
  total_present?: number;
  total_absent?: number;
  boys_total: number;
  boys_present?: number;
  boys_absent?: number;
  girls_total: number;
  girls_present?: number;
  girls_absent?: number;
  other_gender_total: number;
  other_gender_present?: number;
  other_gender_absent?: number;
  attendance_percentage: number;
}

interface StaffSummary {
  total_staff: number;
  active_staff: number;
}

interface DashboardData {
  date: string;
  is_holiday: boolean;
  school_totals: SchoolTotals;
  classes: ClassData[];
  available_dates: string[];
  last_updated: string;
}

interface ApiResponse {
  dashboard: DashboardData;
  staff?: StaffSummary;
  loading: boolean;
  error: string | null;
}

const AttendanceDashboard: React.FC = () => {
  const [data, setData] = useState<ApiResponse>({
    dashboard: {} as DashboardData,
    staff: undefined,
    loading: true,
    error: null
  });

  useEffect(() => {
      const fetchData = async () => {
        try {
          // Fetch both endpoints in parallel
          const [dashboardRes, staffRes] = await Promise.all([
            fetch(`${import.meta.env.VITE_DJANGO_BASE_URL}/api/dashboard`),
            fetch(`${import.meta.env.VITE_DJANGO_BASE_URL}/api/staff-summary`)
          ]);
  
          if (!dashboardRes.ok) throw new Error('Failed to load dashboard data');
          if (!staffRes.ok) throw new Error('Failed to load staff data');
  
          const dashboardData = await dashboardRes.json();
          const staffData = await staffRes.json();
  
          setData({
            dashboard: dashboardData,
            staff: staffData,
            loading: false,
            error: null
          });
        } catch (err) {
          setData(prev => ({
            ...prev,
            loading: false,
            error: err instanceof Error ? err.message : 'Unknown error occurred'
          }));
        }
      };
  
      fetchData();
    }, []);


  const schoolGenderData = [
    { name: 'Boys', value: data.dashboard.school_totals?.boys_total || 0, color: '#3b82f6' },
    { name: 'Girls', value: data.dashboard.school_totals?.girls_total || 0, color: '#ec4899' },
    { name: 'Other', value: data.dashboard.school_totals?.other_gender_total || 0, color: '#8b5cf6' }
  ].filter(item => item.value > 0);

  const attendanceData = [
    { name: 'Present', value: data.dashboard.school_totals?.total_present || 0, color: '#4ade80' },
    { name: 'Absent', value: data.dashboard.school_totals?.total_absent || 0, color: '#f87171' }
  ];

  const classAttendanceData = data.dashboard.classes?.map(cls => ({
    name: cls.grade_name,
    present: cls.total_present,
    absent: cls.total_absent,
    percentage: cls.attendance_percentage
  })) || [];

  // ... (keep your existing loading and error states)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200 p-4 md:p-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="text-center mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">School Attendance Dashboard</h1>
        <div className="flex flex-col md:flex-row justify-between items-center max-w-2xl mx-auto">
          <p className="flex items-center">
            <span className="font-medium">Date:</span> 
            <span className="ml-2">{formatDate(data.dashboard.date)}</span>
            {data.dashboard.is_holiday && (
              <span className="ml-3 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">Holiday</span>
            )}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 md:mt-0">
            Last Updated: {formatTime(data.dashboard.last_updated)}
          </p>
        </div>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <AttendanceStatsCard 
          title="Total Students" 
          value={data.dashboard.school_totals?.total_students || 0} 
          icon={<FiUsers className="text-blue-600 dark:text-blue-400" />} 
          color="blue"
        />
        <AttendanceStatsCard 
          title="Present Today" 
          value={data.dashboard.school_totals?.total_present || 0} 
          change={5.2} 
          icon={<FiUserCheck className="text-green-600 dark:text-green-400" />} 
          color="green"
        />
        <AttendanceStatsCard 
          title="Absent Today" 
          value={data.dashboard.school_totals?.total_absent || 0} 
          change={-2.4} 
          icon={<FiUserX className="text-red-600 dark:text-red-400" />} 
          color="red"
        />
        <AttendanceStatsCard 
          title="Total Staff" 
          value={data.staff?.total_staff || 0} 
          icon={<FiAward className="text-purple-600 dark:text-purple-400" />} 
          color="purple"
        />
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Gender Distribution Pie Chart */}
        <PieChartComponent 
          data={schoolGenderData} 
          title="Gender Distribution" 
          total={data.dashboard.school_totals?.total_students}
        />
        
        {/* Attendance Pie Chart (only show if not holiday) */}
        {!data.dashboard.is_holiday && (
          <PieChartComponent 
            data={attendanceData} 
            title="Attendance Overview" 
            total={data.dashboard.school_totals?.total_students}
          />
        )}
      </div>

      {/* Class-wise Attendance Bar Chart */}
      {!data.dashboard.is_holiday && (
        <div className="mb-6">
          <BarChartComponent 
            data={classAttendanceData} 
            title="Class-wise Attendance Comparison"
          />
        </div>
      )}

      {/* Staff Attendance Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-700/50 p-6">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
          Staff Attendance
        </h2>
        
        {data.dashboard.is_holiday ? (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
            <p className="text-yellow-700 dark:text-yellow-300">
              No staff attendance data available on holidays.
            </p>
          </div>
        ) : data.staff ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PieChartComponent 
              data={[
                { name: 'Active', value: data.staff.active_staff, color: '#8b5cf6' },
                { name: 'Inactive', value: data.staff.total_staff - data.staff.active_staff, color: '#94a3b8' }
              ]} 
              title="Staff Availability" 
              total={data.staff.total_staff}
            />
            <div className="grid grid-cols-2 gap-4">
              <AttendanceStatsCard 
                title="Total Staff" 
                value={data.staff.total_staff} 
                color="indigo"
              />
              <AttendanceStatsCard 
                title="Active Staff" 
                value={data.staff.active_staff} 
                color="purple"
              />
              <AttendanceStatsCard 
                title="Active Percentage" 
                value={`${Math.round((data.staff.active_staff / data.staff.total_staff) * 100)}%`} 
                color="green"
              />
              <AttendanceStatsCard 
                title="Last Updated" 
                value={formatTime(data.staff.last_updated)} 
                color="blue"
              />
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
            <p className="text-gray-600 dark:text-gray-300">
              Staff data is currently unavailable.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceDashboard;