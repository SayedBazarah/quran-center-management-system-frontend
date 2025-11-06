import * as zod from 'zod';
import { mutate } from 'swr';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import { Stack, Alert, MenuItem } from '@mui/material';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import axios, { endpoints } from 'src/lib/axios';
import { useGetAdmins } from 'src/actions/admin';
import { useGetCourses } from 'src/actions/course';
import { useGetTeachers } from 'src/actions/teacher';

import { Form, Field, schemaUtils } from 'src/components/hook-form';

import { getErrorMessage } from 'src/auth/utils';

// ----------------------------------------------------------------------

export type StudentQuickEditSchemaType = zod.infer<typeof StudentQuickEditSchema>;

export const StudentQuickEditSchema = zod.object({
  courseId: zod.string().min(1, { message: 'الدورة مطلوبه!' }),
  adminId: zod.string().min(1, { message: 'المشرف مطلوب!' }),
  teacherId: zod.string().min(1, { message: 'المدرس مطلوب!' }),
  startDate: schemaUtils.date({
    error: {
      invalid: 'تاريخ البدء غير صحيح!',
      required: 'تاريخ البدء مطلوب!',
    },
  }),
});
// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  onClose: () => void;
  studentId: string;
};

export function NewEnrollmentForm({ studentId, open, onClose }: Props) {
  const { courses } = useGetCourses();
  const { teachers } = useGetTeachers();
  const { admins } = useGetAdmins();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const defaultValues: StudentQuickEditSchemaType = {
    adminId: '',
    courseId: '',
    teacherId: '',
    startDate: new Date().toISOString().split('T')[0],
  };

  const methods = useForm<StudentQuickEditSchemaType>({
    mode: 'all',
    resolver: zodResolver(StudentQuickEditSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await axios.post(endpoints.enrollments.create.replace(':id', studentId), data);
      reset();
      mutate(endpoints.student.details.replace(':id', studentId));
      onClose();
    } catch (error) {
      console.error(error);
      const feedbackMessage = getErrorMessage(error);
      setErrorMessage(feedbackMessage);
    }
  });

  // ----------------------------------------
  const renderStudentForm = () => (
    <Stack direction="column" spacing={2} mt={2}>
      <Field.Text select name="courseId" label="الدورة">
        {courses.map((r) => (
          <MenuItem key={r.id} value={r.id}>
            {r.name}
          </MenuItem>
        ))}
      </Field.Text>
      <Field.Text select name="teacherId" label="المدرس">
        {teachers.map((r) => (
          <MenuItem key={r.id} value={r.id}>
            {r.name}
          </MenuItem>
        ))}
      </Field.Text>
      <Field.Text select name="adminId" label="المشرف">
        {admins.map((r) => (
          <MenuItem key={r.id} value={r.id}>
            {r.name}
          </MenuItem>
        ))}
      </Field.Text>
      <Field.DatePicker name="startDate" label="تاريخ البدء" />
    </Stack>
  );

  return (
    <Dialog
      fullWidth
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: { maxWidth: 720 },
        },
      }}
    >
      <DialogTitle>بيانات الدورة</DialogTitle>

      {errorMessage && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMessage}
        </Alert>
      )}
      <Form methods={methods} onSubmit={onSubmit}>
        <DialogContent>{renderStudentForm()}</DialogContent>

        <DialogActions>
          <Button variant="outlined" onClick={onClose}>
            الغاء
          </Button>

          <Button type="submit" variant="contained" loading={isSubmitting}>
            اضافة
          </Button>
        </DialogActions>
      </Form>
    </Dialog>
  );
}
