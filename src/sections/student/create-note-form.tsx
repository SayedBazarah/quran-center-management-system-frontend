import * as zod from 'zod';
import { mutate } from 'swr';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import { Stack, Alert, IconButton, Typography, DialogActions } from '@mui/material';

import axios, { endpoints } from 'src/lib/axios';

import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

import { getErrorMessage } from 'src/auth/utils';

// ----------------------------------------------------------------------

export type StudentQuickEditSchemaType = zod.infer<typeof StudentQuickEditSchema>;

export const StudentQuickEditSchema = zod.object({
  note: zod.string().min(1, { message: 'ملاحظة الدورة مطلوب!' }),
});

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  onClose: () => void;
  studentId: string;
  enrollmentId: string;
};

export function CreateEnrollmentLogForm({ studentId, enrollmentId, open, onClose }: Props) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const defaultValues: StudentQuickEditSchemaType = {
    note: '',
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
      await axios.post(
        endpoints.enrollments.createLog
          .replace(':studentId', studentId)
          .replace(':enrollmentId', enrollmentId),
        {
          note: data.note,
        }
      );

      mutate(endpoints.student.details.replace(':id', studentId));
      onClose();
    } catch (error) {
      console.error(error);
      const feedbackMessage = getErrorMessage(error);
      setErrorMessage(feedbackMessage);
    }
  });

  return (
    <Dialog fullWidth open={open} onClose={onClose}>
      <DialogTitle>
        <Stack direction="row" justifyContent="space-between" alignItems="center" gap={1}>
          <Typography variant="h6">اضافة ملاحظة للدورة</Typography>
          <IconButton
            size="small"
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

      {errorMessage && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMessage}
        </Alert>
      )}
      <Form methods={methods} onSubmit={onSubmit}>
        <DialogContent>
          <Stack direction="column" spacing={2} pt={1}>
            <Field.Text name="note" label="ملاحظة" placeholder="اضافة ملاحظة الدورات" />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button
            color="primary"
            variant="contained"
            fullWidth
            type="submit"
            loading={isSubmitting}
          >
            اضافة ملاحظة
          </Button>
        </DialogActions>
      </Form>
    </Dialog>
  );
}
