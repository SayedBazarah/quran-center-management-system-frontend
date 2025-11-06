import type { ITeacherItem } from 'src/types/teacher';

import * as zod from 'zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { isValidPhoneNumber } from 'react-phone-number-input';

import { Box, Alert, Stack, Button } from '@mui/material';

import axios, { endpoints } from 'src/lib/axios';

import { Form, Field, schemaUtils } from 'src/components/hook-form';

import { getErrorMessage } from 'src/auth/utils';

// ----------------------------------------------------------------------

export type TeacherQuickEditSchemaType = zod.infer<typeof TeacherQuickEditSchema>;

export const TeacherQuickEditSchema = zod.object({
  name: zod.string().min(1, { message: 'الاسم الطالب مطلوب!' }),
  phone: schemaUtils.phoneNumber({ isValid: isValidPhoneNumber }),
});
// ----------------------------------------------------------------------

type Props = {
  teacher: ITeacherItem;
};

export default function TeacherDetails({ teacher }: Props) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const defaultValues: TeacherQuickEditSchemaType = {
    name: teacher?.name || '',
    phone: teacher?.phone || '',
  };

  const methods = useForm<TeacherQuickEditSchemaType>({
    mode: 'all',
    resolver: zodResolver(TeacherQuickEditSchema),
    defaultValues,
    values: teacher,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await axios.patch(endpoints.student.update.replace(':id', teacher.id), data);
    } catch (error) {
      console.error(error);
      const feedbackMessage = getErrorMessage(error);
      setErrorMessage(feedbackMessage);
    }
  });

  return (
    <>
      {errorMessage && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMessage}
        </Alert>
      )}
      <Form methods={methods} onSubmit={onSubmit}>
        <Stack direction="column" spacing={2}>
          <Box />
          {/* <RHFUploadAvatar name="pic" /> */}

          <Field.Text name="name" label="اسم المدرس" />
          <Field.Phone name="phone" label="رقم الهاتف" placeholder="ادخل رقم الهاتف" country="EG" />
        </Stack>

        <Button type="submit" variant="contained" loading={isSubmitting} sx={{ mt: 3 }}>
          تحديث
        </Button>
      </Form>
    </>
  );
}
