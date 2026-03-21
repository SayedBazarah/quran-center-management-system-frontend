'use client';

import { z as zod } from 'zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';

import { Form, Field } from 'src/components/hook-form';
import axiosInstance, { endpoints } from 'src/lib/axios';
import { EnrollmentStatusLabels, type IEnrollmentItem, type IStudentItem, type IParentItem } from 'src/types/student';

// ----------------------------------------------------------------------

const LookupSchema = zod.object({
  phone: zod.string().min(1, { message: 'رقم الهاتف مطلوب' }),
  nationalId: zod.string().min(1, { message: 'الرقم القومي مطلوب' }),
});

type LookupSchemaType = zod.infer<typeof LookupSchema>;

type PortalData = {
  parent: Pick<IParentItem, 'name' | 'relationship'>;
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

export function ParentPortalView() {
  const [result, setResult] = useState<PortalData | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const methods = useForm<LookupSchemaType>({
    resolver: zodResolver(LookupSchema),
    defaultValues: { phone: '', nationalId: '' },
  });

  const { handleSubmit, formState: { isSubmitting } } = methods;

  const onSubmit = handleSubmit(async (data) => {
    setErrorMessage(null);
    setResult(null);
    try {
      const res = await axiosInstance.post<{ success: boolean; data: PortalData }>(
        endpoints.parentPortal.lookup,
        data
      );
      setResult(res.data.data);
    } catch (err: any) {
      setErrorMessage(err?.message || 'حدث خطأ، يرجى التحقق من البيانات والمحاولة مرة أخرى');
    }
  });

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
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
        <Typography variant="body2" color="text.secondary" textAlign="center">
          أدخل رقم هاتفك والرقم القومي لعرض بيانات ابنك/ابنتك
        </Typography>
      </Stack>

      {/* Lookup Form */}
      <Card sx={{ width: '100%', maxWidth: 480 }}>
        <CardContent sx={{ p: 3 }}>
          <Form methods={methods} onSubmit={onSubmit}>
            <Stack spacing={2.5}>
              <Field.Text
                name="phone"
                label="رقم الهاتف"
                placeholder="01xxxxxxxxx"
                inputProps={{ dir: 'ltr' }}
              />
              <Field.Text
                name="nationalId"
                label="الرقم القومي"
                placeholder="xxxxxxxxxxxxxxxxx"
                inputProps={{ dir: 'ltr' }}
              />

              {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={isSubmitting}
                startIcon={isSubmitting ? <CircularProgress size={18} color="inherit" /> : null}
              >
                {isSubmitting ? 'جارٍ البحث...' : 'عرض البيانات'}
              </Button>
            </Stack>
          </Form>
        </CardContent>
      </Card>

      {/* Results */}
      {result && (
        <Box sx={{ width: '100%', maxWidth: 720, mt: 4 }}>
          {/* Student Card */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <Typography variant="h5" fontWeight="bold">
                    {result.student.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    ولي الأمر: {result.parent.name}
                    {result.parent.relationship && ` (${result.parent.relationship})`}
                  </Typography>
                  {result.student.branchId && (
                    <Typography variant="body2" color="text.secondary">
                      الفرع: {(result.student.branchId as any)?.name}
                    </Typography>
                  )}
                </Box>
                <Chip
                  label={studentStatusLabels[result.student.status] ?? result.student.status}
                  color={statusColors[result.student.status] ?? 'default'}
                  size="small"
                />
              </Stack>
            </CardContent>
          </Card>

          {/* Admin Note */}
          {result.student.parentNote && (
            <Card sx={{ bgcolor: 'warning.lighter', mb: 3 }}>
              <CardContent>
                <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
                  ملاحظة من الإدارة
                </Typography>
                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                  {result.student.parentNote}
                </Typography>
              </CardContent>
            </Card>
          )}

          {/* Enrollments */}
          <Typography variant="h6" sx={{ mb: 2 }}>
            الدورات المسجلة ({result.enrollments.length})
          </Typography>

          {result.enrollments.length === 0 ? (
            <Alert severity="info">لا توجد دورات مسجلة حتى الآن</Alert>
          ) : (
            <Stack spacing={2}>
              {result.enrollments.map((enrollment) => (
                <Card key={enrollment._id} variant="outlined">
                  <CardContent>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="flex-start"
                    >
                      <Box>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {(enrollment.courseId as any)?.name}
                        </Typography>
                        {enrollment.teacherId && (
                          <Typography variant="body2" color="text.secondary">
                            المعلم: {(enrollment.teacherId as any)?.name}
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
      )}
    </Box>
  );
}
