import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList
} from 'recharts';
import { ClassAttendance } from './interfaces';

interface ClassAttendanceCardProps {
  classData: ClassAttendance;
}

const CustomLabel = (props: any) => {
  const { x, y, width, height, value } = props;

  if (height < 1) return null;

  return (
    <text
      x={x + width / 2}
      y={y - 5}
      fill="gray"
      fontSize={12}
      textAnchor="middle"
    >
      {value}
    </text>
  );
};

const ClassAttendanceCard: React.FC<ClassAttendanceCardProps> = ({ classData }) => {
  const renderBadge = (percentage: number) => (
    <span
      className={`ml-2 text-sm font-normal px-2 py-1 rounded-full ${
        percentage >= 75
          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
          : percentage >= 50
          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      }`}
    >
      {percentage.toFixed(1)}% Attendance
    </span>
  );

  const getAbsent = (total: number, present: number = 0) => total - present;

  const chartData = [
    {
      name: 'Total',
      present: classData.total_present,
      absent: getAbsent(classData.total_students, classData.total_present),
    },
    {
      name: 'Boys',
      present: classData.boys_present,
      absent: getAbsent(classData.boys_total, classData.boys_present),
    },
    {
      name: 'Girls',
      present: classData.girls_present,
      absent: getAbsent(classData.girls_total, classData.girls_present),
    },
    ...(classData.other_gender_total
      ? [
          {
            name: 'Other',
            present: classData.other_gender_present || 0,
            absent: getAbsent(
              classData.other_gender_total,
              classData.other_gender_present || 0
            ),
          },
        ]
      : []),
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-700/50 p-6">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
        {classData.grade_name}
        {renderBadge(classData.attendance_percentage)}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 30, right: 10, left: 10, bottom: 20 }}
            >
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip
                formatter={(value: number, name: string) => [value, name]}
                labelFormatter={(label) => `${label} Attendance`}
              />
              <Legend />
              <Bar dataKey="present" fill="#4ade80" name="Present">
                <LabelList content={<CustomLabel />} />
              </Bar>
              <Bar dataKey="absent" fill="#f87171" name="Absent">
                <LabelList content={<CustomLabel />} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-4 text-sm">
          <AttendanceDetail
            title="Overall"
            total={classData.total_students}
            present={classData.total_present}
          />
          <AttendanceDetail
            title="Boys"
            total={classData.boys_total}
            present={classData.boys_present}
          />
          <AttendanceDetail
            title="Girls"
            total={classData.girls_total}
            present={classData.girls_present}
          />
          {classData.other_gender_total ? (
            <AttendanceDetail
              title="Other"
              total={classData.other_gender_total}
              present={classData.other_gender_present || 0}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
};

const AttendanceDetail: React.FC<{
  title: string;
  total: number;
  present: number;
}> = ({ title, total, present }) => {
  const absent = total - present;

  return (
    <div>
      <h4 className="font-medium text-gray-700 dark:text-gray-300">{title}</h4>
      <p className="text-gray-600 dark:text-gray-400">
        Total: {total} | Present: {present} | Absent: {absent}
      </p>
    </div>
  );
};

export default ClassAttendanceCard;
