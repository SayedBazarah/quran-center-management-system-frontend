import Box from '@mui/material/Box';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { DashboardContent } from 'src/layouts/dashboard';
import { CourseWidgetSummary } from '../enrollment-widget-summary';
import { CONFIG } from 'src/global-config';
import axiosInstance, { endpoints } from 'src/lib/axios';
import { cookies } from 'next/headers';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import { EnrollmentsOverview } from '../enrollments-overview';
import { EnrollmentStatus, EnrollmentStatusLabels, EnrollmentStatusList } from 'src/types/student';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import { Iconify } from 'src/components/iconify';
import AccordionDetails from '@mui/material/AccordionDetails';

interface ReportData {
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

// Fetch data on the server
async function getReportData(startDate?: Date, endDate?: Date): Promise<ReportData[]> {
  try {
    const cookieStore = await cookies();

    const params = new URLSearchParams();
    if (startDate) params.append('start', startDate.toISOString());
    if (endDate) params.append('end', endDate.toISOString());

    const url = `${endpoints.reports.root}?${params.toString()}`;
    const res = await axiosInstance.get(url, {
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookieStore.toString(),
      },
    });
    return res.data && res.data;
  } catch (e) {
    console.log(e);
    return [];
  }
}

type Props = {
  startDate: Date;
  endDate: Date;
};
export async function GlobaSystemReportView({ startDate, endDate }: Props) {
  const data = await getReportData(startDate, endDate);

  const new_students = data.reduce((acc, item) => acc + item.new_students, 0);
  const new_students_accepted = data.reduce((acc, item) => acc + item.new_students_accepted, 0);
  const new_enrollments = data.reduce((acc, item) => acc + item.new_enrollments, 0);
  const new_enrollments_accepted = data.reduce(
    (acc, item) => acc + item.new_enrollments_accepted,
    0
  );
  const enrollment_status_counts = data.reduce(
    (
      acc: {
        pending: number;
        active: number;
        late: number;
        graduated: number;
        rejected: number;
        dropout: number;
      },
      item
    ) => ({
      ...acc,
      pending: acc.pending + item.enrollment_status_counts.pending,
      active: acc.active + item.enrollment_status_counts.active,
      late: acc.late + item.enrollment_status_counts.late,
      graduated: acc.graduated + item.enrollment_status_counts.graduated,
      rejected: acc.rejected + item.enrollment_status_counts.rejected,
      dropout: acc.dropout + item.enrollment_status_counts.dropout,
    }),
    {
      pending: 0,
      active: 0,
      late: 0,
      graduated: 0,
      rejected: 0,
      dropout: 0,
    }
  );
  return (
    <>
      <Box>
        <AccordionDetails sx={{ p: 3 }}>
          {/* Statistics Grid */}
          <Box
            sx={{
              gap: 3,
              display: 'grid',
              gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
              mb: 3,
            }}
          >
            <CourseWidgetSummary
              title="الطلاب الجدد"
              total={new_students}
              color="info"
              icon={`${CONFIG.assetsDir}/assets/icons/courses/ic-courses-progress.svg`}
            />
            <CourseWidgetSummary
              title="الطلاب الجدد المقبولين"
              total={new_students_accepted}
              color="secondary"
              icon={`${CONFIG.assetsDir}/assets/icons/courses/ic-courses-completed.svg`}
            />
            <CourseWidgetSummary
              title="المراحل الجديدة"
              total={new_enrollments}
              icon={`${CONFIG.assetsDir}/assets/icons/courses/ic-courses-progress.svg`}
            />
            <CourseWidgetSummary
              title="المراحل الجديدة المقبولة"
              total={new_enrollments_accepted}
              color="success"
              icon={`${CONFIG.assetsDir}/assets/icons/courses/ic-courses-completed.svg`}
            />
          </Box>
          {/* Enrollment Overview */}
          <EnrollmentsOverview
            title="نظرة عامه لحالات المراحل"
            data={[
              {
                label: EnrollmentStatusLabels[EnrollmentStatus.PENDING],
                totalAmount: enrollment_status_counts.pending,
              },
              {
                label: EnrollmentStatusLabels[EnrollmentStatus.ACTIVE],
                totalAmount: enrollment_status_counts.active,
              },
              {
                label: EnrollmentStatusLabels[EnrollmentStatus.LATE],
                totalAmount: enrollment_status_counts.late,
              },
              {
                label: EnrollmentStatusLabels[EnrollmentStatus.GRADUATED],
                totalAmount: enrollment_status_counts.graduated,
              },
              {
                label: EnrollmentStatusLabels[EnrollmentStatus.REJECTED],
                totalAmount: enrollment_status_counts.rejected,
              },
              {
                label: EnrollmentStatusLabels[EnrollmentStatus.DROPOUT],
                totalAmount: enrollment_status_counts.dropout,
              },
            ]}
          />
        </AccordionDetails>
      </Box>
      {data.map((item, index) => (
        <Accordion key={index} sx={{ mt: 2 }}>
          <AccordionSummary
            expandIcon={<Iconify icon="eva:chevron-down-fill" />}
            aria-controls={`panel${index}-content`}
            id={`panel${index}-header`}
            sx={{
              backgroundColor: 'rgba(0, 0, 0, 0.03)',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.05)',
              },
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 'medium' }}>
              {item.branchName}
            </Typography>
          </AccordionSummary>

          <AccordionDetails sx={{ p: 3 }}>
            {/* Statistics Grid */}
            <Box
              sx={{
                gap: 3,
                display: 'grid',
                gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
                mb: 3,
              }}
            >
              <CourseWidgetSummary
                title="الطلاب الجدد"
                total={item.new_students}
                color="info"
                icon={`${CONFIG.assetsDir}/assets/icons/courses/ic-courses-progress.svg`}
              />
              <CourseWidgetSummary
                title="الطلاب الجدد المقبولين"
                total={item.new_students_accepted}
                color="secondary"
                icon={`${CONFIG.assetsDir}/assets/icons/courses/ic-courses-completed.svg`}
              />
              <CourseWidgetSummary
                title="المراحل الجديدة"
                total={item.new_enrollments}
                icon={`${CONFIG.assetsDir}/assets/icons/courses/ic-courses-progress.svg`}
              />
              <CourseWidgetSummary
                title="المراحل الجديدة المقبولة"
                total={item.new_enrollments_accepted}
                color="success"
                icon={`${CONFIG.assetsDir}/assets/icons/courses/ic-courses-completed.svg`}
              />
            </Box>

            {/* Enrollment Overview */}
            <EnrollmentsOverview
              title="نظرة عامه لحالات المراحل"
              data={[
                {
                  label: EnrollmentStatusLabels[EnrollmentStatus.PENDING],
                  totalAmount: item.enrollment_status_counts.pending,
                },
                {
                  label: EnrollmentStatusLabels[EnrollmentStatus.ACTIVE],
                  totalAmount: item.enrollment_status_counts.active,
                },
                {
                  label: EnrollmentStatusLabels[EnrollmentStatus.LATE],
                  totalAmount: item.enrollment_status_counts.late,
                },
                {
                  label: EnrollmentStatusLabels[EnrollmentStatus.GRADUATED],
                  totalAmount: item.enrollment_status_counts.graduated,
                },
                {
                  label: EnrollmentStatusLabels[EnrollmentStatus.REJECTED],
                  totalAmount: item.enrollment_status_counts.rejected,
                },
                {
                  label: EnrollmentStatusLabels[EnrollmentStatus.DROPOUT],
                  totalAmount: item.enrollment_status_counts.dropout,
                },
              ]}
            />
          </AccordionDetails>
        </Accordion>
        // ))}
      ))}
    </>
  );
}
