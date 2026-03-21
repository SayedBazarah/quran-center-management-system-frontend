'use client';

import useSWR from 'swr';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';

import { fetcher, endpoints } from 'src/lib/axios';

import { LoadingScreen } from 'src/components/loading-screen';

import {
  type IParentItem,
  type IStudentItem,
  type IEnrollmentItem,
  EnrollmentStatusLabels,
} from 'src/types/student';

// ----------------------------------------------------------------------

type PortalData = {
  parent: Pick<IParentItem, 'name' | 'relationship'> | null;
  student: IStudentItem;
  enrollments: IEnrollmentItem[];
};

const statusColors: Record<string, 'default' | 'success' | 'warning' | 'error' | 'info'> = {
  active: 'success',
  pending: 'warning',
  late: 'warning',
  graduated: 'info',
  dropout: 'error',
  rejected: 'error',
};

const studentStatusLabels: Record<string, string> = {
  active: 'نشط',
  pending: 'بانتظار القبول',
  late: 'متأخر',
  graduated: 'متخرج',
  dropout: 'منقطع',
  rejected: 'مرفوض',
};

// ----------------------------------------------------------------------

type Props = { studentId: string };

export function ParentPortalStudentView({ studentId }: Props) {
  const url = endpoints.parentPortal.student.replace(':studentId', studentId);
  const { data, isLoading, error } = useSWR<{ success: boolean; data: PortalData }>(url, fetcher);

  if (isLoading) return <LoadingScreen />;

  if (error || !data?.data) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Alert severity="error">لم يتم العثور على بيانات الطالب</Alert>
      </Box>
    );
  }

  const { student, parent, enrollments } = data.data;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        pt: 6,
        px: 2,
        bgcolor: 'background.default',
      }}
    >
      {/* Header */}
      <Stack spacing={1} alignItems="center" sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold">
          بوابة أولياء الأمور
        </Typography>
        <Typography variant="body2" color="text.secondary">
          مركز اقرا
        </Typography>
      </Stack>

      <Box sx={{ width: '100%', maxWidth: 720 }}>
        {/* Student Card */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
              <Box>
                <Typography variant="h5" fontWeight="bold">
                  {student.name}
                </Typography>
                {parent && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    ولي الأمر: {parent.name}
                    {parent.relationship && ` (${parent.relationship})`}
                  </Typography>
                )}
                {(student.branchId as any)?.name && (
                  <Typography variant="body2" color="text.secondary">
                    الفرع: {(student.branchId as any).name}
                  </Typography>
                )}
              </Box>
              <Chip
                label={studentStatusLabels[student.status] ?? student.status}
                color={statusColors[student.status] ?? 'default'}
              />
            </Stack>
          </CardContent>
        </Card>

        {/* Admin Note */}
        {student.parentNote && (
          <Card sx={{ bgcolor: 'warning.lighter', mb: 3 }}>
            <CardContent>
              <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
                ملاحظة من الإدارة
              </Typography>
              <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                {student.parentNote}
              </Typography>
            </CardContent>
          </Card>
        )}

        {/* Enrollments */}
        <Typography variant="h6" sx={{ mb: 2 }}>
          الدورات المسجلة ({enrollments.length})
        </Typography>

        {enrollments.length === 0 ? (
          <Alert severity="info">لا توجد دورات مسجلة حتى الآن</Alert>
        ) : (
          <Stack spacing={2}>
            {enrollments.map((enrollment) => (
              <Card key={enrollment._id} variant="outlined">
                <CardContent>
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {(enrollment.courseId as any)?.name}
                      </Typography>
                      {(enrollment.teacherId as any)?.name && (
                        <Typography variant="body2" color="text.secondary">
                          المعلم: {(enrollment.teacherId as any).name}
                        </Typography>
                      )}
                      <Typography variant="body2" color="text.secondary">
                        تاريخ البدء:{' '}
                        {enrollment.startDate
                          ? new Date(enrollment.startDate).toLocaleDateString('ar-EG')
                          : '—'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        تاريخ الانتهاء:{' '}
                        {enrollment.endDate
                          ? new Date(enrollment.endDate).toLocaleDateString('ar-EG')
                          : '—'}
                      </Typography>
                    </Box>
                    <Chip
                      label={EnrollmentStatusLabels[enrollment.status] ?? enrollment.status}
                      color={statusColors[enrollment.status] ?? 'default'}
                      size="small"
                    />
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Stack>
        )}

        <Divider sx={{ my: 3 }} />
        <Typography variant="caption" color="text.secondary" display="block" textAlign="center">
          إذا كانت هناك أي استفسارات، يرجى التواصل مع إدارة المركز
        </Typography>
      </Box>
    </Box>
  );
}
