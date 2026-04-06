import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
} from 'recharts';
import { SchoolTotals } from './interfaces';

const SchoolAttendanceChart: React.FC<{ data: SchoolTotals }> = ({ data }) => {
  const totalPercentage = data.attendance_percentage;
  const boysPercentage = data.boys_total > 0 ? ((data.boys_present ?? 0) / data.boys_total) * 100 : 0;
  const girlsPercentage = data.girls_total > 0 ? ((data.girls_present ?? 0) / data.girls_total) * 100 : 0;
  const otherPercentage = data.other_gender_total && data.other_gender_total > 0
    ? ((data.other_gender_present || 0) / data.other_gender_total) * 100
    : 0;

  const chartData = [
    {
      name: 'Total',
      present: data.total_present,
      absent: data.total_absent,
      percentage: totalPercentage,
    },
    {
      name: 'Boys',
      present: data.boys_present,
      absent: data.boys_absent,
      percentage: boysPercentage,
    },
    {
      name: 'Girls',
      present: data.girls_present,
      absent: data.girls_absent,
      percentage: girlsPercentage,
    },
    ...(data.other_gender_total ? [{
      name: 'Other',
      present: data.other_gender_present || 0,
      absent: data.other_gender_absent || 0,
      percentage: otherPercentage,
    }] : []),
  ];

  const colors = {
    present: '#4ade80',
    absent: '#f87171',
  };

  const getBadgeClass = (percentage: number) => {
    if (percentage >= 75) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    if (percentage >= 50) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
  };

  const DetailCard = ({
    title,
    color,
    total,
    present,
    absent,
    percentage,
  }: {
    title: string;
    color: 'blue' | 'indigo' | 'pink' | 'purple';
    total: number;
    present: number;
    absent: number;
    percentage: number;
  }) => {
    const colorMap = {
      blue: {
        bg: 'bg-blue-50 dark:bg-blue-900/30',
        text: 'text-blue-800 dark:text-blue-200',
        value: 'text-blue-600 dark:text-blue-300',
      },
      indigo: {
        bg: 'bg-indigo-50 dark:bg-indigo-900/30',
        text: 'text-indigo-800 dark:text-indigo-200',
        value: 'text-indigo-600 dark:text-indigo-300',
      },
      pink: {
        bg: 'bg-pink-50 dark:bg-pink-900/30',
        text: 'text-pink-800 dark:text-pink-200',
        value: 'text-pink-600 dark:text-pink-300',
      },
      purple: {
        bg: 'bg-purple-50 dark:bg-purple-900/30',
        text: 'text-purple-800 dark:text-purple-200',
        value: 'text-purple-600 dark:text-purple-300',
      },
    };
    const styles = colorMap[color];

    return (
      <div className={`${styles.bg} p-4 rounded-lg`}>
        <h3 className={`font-medium ${styles.text} mb-2`}>
          {title}
          <span className={`ml-2 text-xs px-2 py-1 rounded-full ${getBadgeClass(percentage)}`}>
            {percentage.toFixed(1)}%
          </span>
        </h3>
        <p className={`text-2xl font-bold ${styles.value}`}>{total}</p>
        <div className="mt-2 space-y-1 text-sm">
          <p>
            <span className="font-medium text-green-700 dark:text-green-400">Present:</span> {present}
          </p>
          <p>
            <span className="font-medium text-red-700 dark:text-red-400">Absent:</span> {absent}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-700/50 p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
        School-wide Attendance by Gender
        <span className={`ml-2 text-xs px-2 py-1 rounded-full ${getBadgeClass(totalPercentage)}`}>
          {totalPercentage.toFixed(1)}%
        </span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
            >
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip
                formatter={(value: number, name: string) => [value, name]}
                labelFormatter={(label: string, payload: any) => {
                  const percentage = payload?.[0]?.payload?.percentage ?? 0;
                  return `${label} - ${percentage.toFixed(1)}% Attendance`;
                }}
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  borderColor: '#e2e8f0',
                  borderRadius: '0.5rem',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  color: '#1a202c',
                }}
              />
              <Legend />
              <Bar dataKey="present" name="Present" fill={colors.present}>
                <LabelList dataKey="present" position="top" />
              </Bar>
              <Bar dataKey="absent" name="Absent" fill={colors.absent}>
                <LabelList dataKey="absent" position="top" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <DetailCard title="Total Students" color="blue" total={data.total_students} present={data.total_present ?? 0} absent={data.total_absent ?? 0} percentage={totalPercentage} />
          <DetailCard title="Boys" color="indigo" total={data.boys_total} present={data.boys_present ?? 0} absent={data.boys_absent ?? 0} percentage={boysPercentage} />
          <DetailCard title="Girls" color="pink" total={data.girls_total} present={data.girls_present ?? 0} absent={data.girls_absent ?? 0} percentage={girlsPercentage} />
          {data.other_gender_total && data.other_gender_total > 0 && (
            <DetailCard title="Other" color="purple" total={data.other_gender_total} present={data.other_gender_present || 0} absent={data.other_gender_absent || 0} percentage={otherPercentage} />
          )}
        </div>
      </div>
    </div>
  );
};

export default SchoolAttendanceChart;
