import React, { useState, useEffect, useMemo } from 'react';
import ClassAttendanceCard from './ClassAttendanceCard';
import StaffAttendanceCard from './StaffAttendanceCard';
import AttendanceStatsCard from './AttendanceStatsCard';
import SchoolAttendanceChart from './SchoolAttendanceChart';
import { FiUsers, FiUserCheck, FiUserX, FiAward } from 'react-icons/fi';
import { DashboardData, StaffAttendance, ApiResponse } from './interfaces';

const AttendanceDashboard: React.FC = () => {
  const today = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState<string>(today);

  const [data, setData] = useState<ApiResponse>({
    dashboard: {} as DashboardData,
    staff: undefined,
    loading: true,
    error: null
  });

  const fetchData = async (date: string) => {
    try {
      setData(prev => ({ ...prev, loading: true }));
      const [dashboardRes, staffRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_DJANGO_BASE_URL}/api/dashboard?date=${date}`),
        fetch(`${import.meta.env.VITE_DJANGO_BASE_URL}/api/staff-summary?date=${date}`)
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

  useEffect(() => {
    if (selectedDate) fetchData(selectedDate);
  }, [selectedDate]);

  const allDates = useMemo(() => {
    const datesSet = new Set(data.dashboard.available_dates || []);
    if (data.dashboard.date) {
      datesSet.add(data.dashboard.date);
    }
    return Array.from(datesSet).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  }, [data.dashboard]);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-CA'); // YYYY-MM-DD

  const isToday = selectedDate === today;
  const isHoliday = data.dashboard?.is_holiday;

  if (data.loading) return <div className="text-center py-8">Loading...</div>;
  if (data.error) return <div className="text-center py-8 text-red-500">Error: {data.error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 md:p-6">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-2">Attendance Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Date: {data.dashboard.nepali_date} BS ({formatDate(data.dashboard.date)} AD)
            {isToday && isHoliday && (
              <span className="ml-2 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 px-2 py-1 rounded-full text-sm">
                Holiday
              </span>
            )}
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <label htmlFor="date-select" className="mr-2 font-medium">Select Date:</label>
          <select
            id="date-select"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 rounded border dark:bg-gray-800 dark:border-gray-600"
          >
            {allDates.map((date) => (
              <option key={date} value={date}>
                {formatDate(date)} AD
              </option>
            ))}
          </select>
        </div>
      </div>

      {isToday && isHoliday ? (
        <div className="text-center text-xl font-semibold text-yellow-700 dark:text-yellow-400 mt-4">
          No attendance data available for today. It's a holiday.
        </div>
      ) : (
        <>
          <p className="text-red-600 font-bold mb-4">
            **Note: The below dashboard data does not include Class 11 and 12 students.**
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <AttendanceStatsCard
              title="Total Students"
              value={data.dashboard.school_totals?.total_students || 0}
              icon={<FiUsers />}
              color="blue"
            />
            <AttendanceStatsCard
              title="Attending Today"
              value={data.dashboard.school_totals?.total_present || 0}
              icon={<FiUserCheck />}
              color="green"
            />
            <AttendanceStatsCard
              title="Not Attending Today"
              value={data.dashboard.school_totals?.total_absent || 0}
              icon={<FiUserX />}
              color="red"
            />
            <AttendanceStatsCard
              title="Total Staff"
              value={data.staff?.total_staff || 0}
              icon={<FiAward />}
              color="purple"
            />
          </div>

          <SchoolAttendanceChart
            data={{
              ...data.dashboard.school_totals,
              attendance_percentage:
                ((data.dashboard.school_totals?.total_present ?? 0) /
                  (data.dashboard.school_totals?.total_students || 1)) * 100,
            }}
          />

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Class-wise Attendance</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {data.dashboard.classes?.map((classData) => (
                <ClassAttendanceCard
                  key={classData.grade_id}
                  classData={{
                    ...classData,
                    total_present: classData.total_present || 0,
                    boys_present: classData.boys_present || 0,
                    girls_present: classData.girls_present || 0,
                  }}
                />
              ))}
            </div>
          </div>

          {data.staff && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Staff Attendance</h2>
              <StaffAttendanceCard staffData={data.staff} />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AttendanceDashboard;
