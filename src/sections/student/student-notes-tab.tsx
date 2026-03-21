import type { IStudentItem } from 'src/types/student';

import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { Alert, Stack, Button, Typography } from '@mui/material';

import axios, { endpoints } from 'src/lib/axios';

import { Form, Field } from 'src/components/hook-form';

import { getErrorMessage } from 'src/auth/utils';

// ----------------------------------------------------------------------

type FormValues = { parentNote: string };

type Props = {
  student: IStudentItem;
  refetch: VoidFunction;
};

export default function StudentNotesTab({ student, refetch }: Props) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const methods = useForm<FormValues>({
    defaultValues: { parentNote: student.parentNote ?? '' },
  });

  const { handleSubmit, formState: { isSubmitting } } = methods;

  const onSubmit = handleSubmit(async (data) => {
    setErrorMessage(null);
    setSuccess(false);
    try {
      await axios.patch(
        endpoints.student.parentNote.replace(':id', student.id),
        { parentNote: data.parentNote }
      );
      refetch();
      setSuccess(true);
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    }
  });

  return (
    <Stack spacing={2} sx={{ maxWidth: 640 }}>
      <Typography variant="subtitle2" color="text.secondary">
        هذه الملاحظة ستظهر لولي الأمر في بوابة أولياء الأمور
      </Typography>

      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
      {success && <Alert severity="success">تم حفظ الملاحظة بنجاح</Alert>}

      <Form methods={methods} onSubmit={onSubmit}>
        <Stack spacing={2}>
          <Field.Text
            name="parentNote"
            label="ملاحظة لولي الأمر"
            multiline
            rows={5}
            placeholder="اكتب ملاحظة لولي الأمر هنا..."
          />
          <Button type="submit" variant="contained" loading={isSubmitting} sx={{ alignSelf: 'flex-start' }}>
            حفظ الملاحظة
          </Button>
        </Stack>
      </Form>
    </Stack>
  );
}
