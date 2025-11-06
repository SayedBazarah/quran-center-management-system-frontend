import { useState, useCallback } from 'react';
import { useBoolean } from 'minimal-shared/hooks';

import { Box, Chip, Stack, Button, Typography } from '@mui/material';

import axios, { endpoints } from 'src/lib/axios';

import { Scrollbar } from 'src/components/scrollbar';

import { getErrorMessage } from 'src/auth/utils';

import { EnrollmentStatus, type IStudentItem, type IEnrollmentItem } from 'src/types/student';

import { EnrollmentEditForm } from './enrollment-form';
import { NewEnrollmentForm } from './new-enrollemtn-form';
import { useGetStudentById, useGetStudentEnrollments } from 'src/actions/student';
import { LoadingScreen } from 'src/components/loading-screen';

type Props = {
  student: IStudentItem;
};
export default function StudentEnrollments({ student }: Props) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [enrollment, setEnrollment] = useState<IEnrollmentItem | null>(null);
  const { enrollments, enrollmentsLoading } = useGetStudentEnrollments(student.id);

  const onClose = useCallback(() => {
    setEnrollment(null);
  }, [setEnrollment]);

  const onEndEnrollment = useCallback(async () => {
    try {
      await axios.post(endpoints.student.closeEnrollment.replace(':id', student.id), {
        enrollmentId: enrollment?.id,
      });
      onClose();
    } catch (error) {
      console.error(error);
      const feedbackMessage = getErrorMessage(error);
      setErrorMessage(feedbackMessage);
    }
  }, [enrollment, student.id, onClose]);

  if (enrollmentsLoading) return <LoadingScreen />;

  return (
    <>
      <Scrollbar>
        <Stack spacing={2}>
          <Stack direction="row" justifyContent="end"></Stack>
        </Stack>
      </Scrollbar>
      {enrollments.map((item) => (
        <Stack
          key={item._id}
          direction="row"
          justifyContent="space-between"
          sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}`, py: 1 }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="h6">{item.courseId.name}</Typography>
            <Chip
              label={
                (item.status === EnrollmentStatus.ACTIVE && 'يدرس') ||
                (item.status === EnrollmentStatus.DROPOUT && 'منقطع') ||
                (item.status === EnrollmentStatus.GRADUATED && 'انتهت') ||
                (item.status === EnrollmentStatus.LATE && 'متاخر') ||
                (item.status === EnrollmentStatus.REJECTED && 'مرفوض') ||
                'بنتظار قبول الدورة'
              }
              color={
                (item.status === EnrollmentStatus.ACTIVE && 'success') ||
                (item.status === EnrollmentStatus.DROPOUT && 'error') ||
                (item.status === EnrollmentStatus.GRADUATED && 'default') ||
                (item.status === EnrollmentStatus.LATE && 'warning') ||
                (item.status === EnrollmentStatus.REJECTED && 'error') ||
                'info'
              }
              size="small"
            />
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => {
                setEnrollment(item);
              }}
            >
              عرض بيانات الدورة
            </Button>
          </Box>
        </Stack>
      ))}
      {enrollment && (
        <EnrollmentEditForm
          studentId={student.id}
          open={!!enrollment}
          onClose={onClose}
          enrollment={enrollment}
          onEndEnrollment={onEndEnrollment}
          error={errorMessage}
        />
      )}
    </>
  );
}
