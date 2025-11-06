import * as zod from 'zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useBoolean } from 'minimal-shared/hooks';
import { zodResolver } from '@hookform/resolvers/zod';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import { Box, Card, Stack, Alert, Divider, MenuItem, IconButton, Typography } from '@mui/material';

import { hasAnyRole } from 'src/utils/has-role';
import { fDate, fTime, fDateTime } from 'src/utils/format-time';

import axios, { endpoints } from 'src/lib/axios';
import { useGetAdmins } from 'src/actions/admin';
import { useGetTeachers } from 'src/actions/teacher';
import { GlobalPermissionCode } from 'src/global-config';

import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

import { useAuthContext } from 'src/auth/hooks';
import { getErrorMessage } from 'src/auth/utils';

import { EnrollmentStatus, EnrollmentStatusList, type IEnrollmentItem } from 'src/types/student';

import { CreateEnrollmentLogForm } from './create-note-form';
// import { mutate } from 'swr';\\\

// ----------------------------------------------------------------------

export type StudentQuickEditSchemaType = zod.infer<typeof StudentQuickEditSchema>;

export const StudentQuickEditSchema = zod.object({
  teacherId: zod.string().min(1, { message: 'المدرس مطلوب!' }),
  adminId: zod.string().min(1, { message: 'المشرف مطلوب!' }),
  status: zod.string(),
  startDate: zod.string(),
  endDate: zod.string(),
  course: zod.string().min(1, { message: 'الدورة مطلوب!' }),
});
// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  onClose: () => void;
  onEndEnrollment: () => void;
  studentId: string;
  enrollment: IEnrollmentItem;
  error: string | null;
};

export function EnrollmentEditForm({
  studentId,
  enrollment,
  open,
  onEndEnrollment,
  onClose,
  error,
}: Props) {
  const router = useRouter();
  const { permissions } = useAuthContext();
  const { admins } = useGetAdmins();
  const { teachers } = useGetTeachers();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const isAuthorized = hasAnyRole(permissions, [GlobalPermissionCode.AcceptEnrollment]);

  const logsForm = useBoolean();

  const defaultValues: StudentQuickEditSchemaType = {
    teacherId: enrollment.teacherId?.id,
    adminId: enrollment.adminId?.id,
    status: enrollment.status,
    startDate: fDate(enrollment.startDate),
    endDate: fDate(enrollment.endDate),
    course: enrollment.courseId?.name,
  };
  const methods = useForm<StudentQuickEditSchemaType>({
    mode: 'all',
    resolver: zodResolver(StudentQuickEditSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await axios.patch(endpoints.enrollments.update.replace(':id', enrollment?.id), data);
      router.refresh();
      onClose();
    } catch (e) {
      console.error(e);
      const feedbackMessage = getErrorMessage(e);
      setErrorMessage(feedbackMessage);
    }
  });

  // ----------------------------------------
  const renderStudentForm = () => (
    <Stack direction="column" spacing={2}>
      <Field.Text name="course" label="الدورة" disabled />
      <Stack direction="row" justifyContent="space-between" alignItems="center" gap={1}>
        <Field.Text name="startDate" label="تاريخ بداية الدورة" disabled />
        <Field.Text name="endDate" label="تاريخ انتهاء الدورة" disabled />
      </Stack>
      <Field.Text select name="status" label="حالة الدورة" disabled={!isAuthorized}>
        {EnrollmentStatusList.map((r) => (
          <MenuItem key={r.value} value={r.value}>
            {r.label}
          </MenuItem>
        ))}
      </Field.Text>
      <Field.Text select name="teacherId" label="المدرس" disabled={!!enrollment.endDate}>
        {teachers.map((r) => (
          <MenuItem key={r.id} value={r.id}>
            {r.name}
          </MenuItem>
        ))}
      </Field.Text>
      <Field.Text select name="adminId" label="المشرف" disabled={!!enrollment.endDate}>
        {admins.map((r) => (
          <MenuItem key={r.id} value={r.id}>
            {r.name}
          </MenuItem>
        ))}
      </Field.Text>
      {!enrollment.endDate && (
        <Stack direction="row" justifyContent="flex-end" gap={1}>
          <Button type="submit" variant="contained" loading={isSubmitting}>
            تحديث
          </Button>
        </Stack>
      )}
    </Stack>
  );

  const renderNotes = () => (
    <Stack direction="column" spacing={2}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" gap={1}>
        <Typography variant="h6">ملاحظات الدورة</Typography>
        <Button variant="contained" color="primary" onClick={logsForm.onTrue}>
          اضافة ملاحظة
        </Button>
      </Stack>
      {enrollment.logs?.map((item, index) => (
        <Card
          key={index}
          variant="outlined"
          sx={{ display: 'flex', flexDirection: 'column', p: 2 }}
        >
          <Box>
            <Typography variant="body1">{item.note}</Typography>
          </Box>
          <Box display="flex" justifyContent="flex-end">
            <Typography variant="caption" color="textDisabled" sx={{ alignSelf: 'flex-end' }}>
              {item.adminId?.name} | {fDateTime(item.createdAt)}
            </Typography>
          </Box>
        </Card>
      ))}
    </Stack>
  );
  const renderStatus = () => (
    <Alert
      severity={(enrollment.status === EnrollmentStatus.REJECTED && 'error') || 'info'}
      sx={{ mb: 3 }}
    >
      انشاءت الدورة بواسطة{' '}
      <Typography component="span" fontWeight="bold">
        {enrollment.createdBy?.name}{' '}
      </Typography>
      {enrollment.status === EnrollmentStatus.ACTIVE && (
        <>
          وتم قبول الدورة بواسطة{' '}
          <Typography component="span" fontWeight="bold">
            {enrollment.acceptedBy?.name} في {fTime(enrollment.acceptedAt)}
          </Typography>
        </>
      )}
      {enrollment.status === EnrollmentStatus.REJECTED && (
        <>
          وتم رفض قبول الدورة بواسطة{' '}
          <Typography component="span" fontWeight="bold">
            {enrollment.rejectedBy?.name} في {fTime(enrollment.rejectedAt)}
          </Typography>
        </>
      )}
    </Alert>
  );
  return (
    <Dialog fullScreen open={open} onClose={onClose}>
      <DialogTitle>
        <Stack direction="row" justifyContent="space-between" alignItems="center" gap={1}>
          <Typography variant="h6">بيانات الدورة</Typography>
          <IconButton
            size="large"
            color="error"
            onClick={onClose}
            sx={{
              bgcolor: 'error.main',
              '&:hover .icon': {
                color: 'error.main',
              },
            }}
          >
            <Iconify
              className="icon"
              icon="carbon:close"
              sx={{
                color: 'white',
              }}
            />
          </IconButton>
        </Stack>
      </DialogTitle>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      {errorMessage && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMessage}
        </Alert>
      )}
      <Form methods={methods} onSubmit={onSubmit}>
        <DialogContent>
          <Box
            sx={{
              my: 2,
              display: 'grid',
              gridTemplateColumns: {
                xs: 'repeat(1, 1fr)',
                sm: '1fr auto 1fr',
              },
              gap: 2,
            }}
          >
            <Box>
              {renderStatus()}
              {renderStudentForm()}
            </Box>
            <Divider orientation="vertical" flexItem />
            <Box>{renderNotes()}</Box>
          </Box>
        </DialogContent>
      </Form>
      <CreateEnrollmentLogForm
        open={logsForm.value}
        onClose={() => {
          logsForm.onFalse();
          onClose();
        }}
        studentId={studentId}
        enrollmentId={enrollment.id}
      />
    </Dialog>
  );
}
