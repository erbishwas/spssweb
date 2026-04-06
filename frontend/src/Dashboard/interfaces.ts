export interface ClassAttendance {
  grade_id: number;
  grade_name: string;
  total_students: number;
  total_present: number;
  boys_total: number;
  boys_present: number;
  girls_total: number;
  girls_present: number;
  other_gender_total?: number;
  other_gender_present?: number;
  attendance_percentage: number;
}

export interface StaffAttendance {
  date: string;
  total_staff: number;
  active_staff: number;
 
}

export interface ClassAttendanceData {
  name: string;
  total: number;
  present: number;
  boys_total: number;
  boys_present: number;
  girls_total: number;
  girls_present: number;
  other_total?: number;
  other_present?: number;
  attendance_percentage: number;
}

export interface SchoolTotals {
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
  attendance_percentage: number;
}

export interface ClassData {
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

export interface StaffSummary {
  date: string;
  total_staff: number;
  active_staff: number;
  
}

export interface DashboardData {
  date: string;
  nepali_date: string;
  is_holiday: boolean;
  school_totals: SchoolTotals;
  classes: ClassData[];
  available_dates: string[];
  last_updated: string;
}

export interface ApiResponse {
  dashboard: DashboardData;
  staff?: StaffSummary;
  loading: boolean;
  error: string | null;
}

export interface PieChartData {
  name: string;
  value: number;
  color: string;
}

export interface PieChartProps {
  data: PieChartData[];
  title: string;
  total?: number;
}

export interface BarChartData {
  name: string;
  present?: number;
  absent?: number;
}

export interface BarChartProps {
  data: BarChartData[];
  title: string;
}

export interface StatsCardProps {
  title: string;
  value: number | string;
  change?: number;
  icon?: React.ReactNode;
  color?: string;
}