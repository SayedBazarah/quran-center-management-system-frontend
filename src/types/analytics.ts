export interface ReportData {
  branchName: string;
  new_enrollments: number;
  new_enrollments_accepted: number;
  new_students: number;
  new_students_accepted: number;
  enrollment_status_counts: {
    pending: number;
    active: number;
    late: number;
    graduated: number;
    rejected: number;
    dropout: number;
  };
}
