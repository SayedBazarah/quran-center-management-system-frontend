import type { ICourseItem } from 'src/types/course';

import * as zod from 'zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Box, Alert, Stack, Button } from '@mui/material';

import axios, { endpoints } from 'src/lib/axios';

import { Form, Field } from 'src/components/hook-form';

import { getErrorMessage } from 'src/auth/utils';

// ----------------------------------------------------------------------

export type CourseQuickEditSchemaType = zod.infer<typeof CourseQuickEditSchema>;

export const CourseQuickEditSchema = zod.object({
  name: zod.string().min(1, { message: 'الاسم الطالب مطلوب!' }),
});
// ----------------------------------------------------------------------

type Props = {
  course: ICourseItem;
};

export default function CourseDetails({ course }: Props) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const defaultValues: CourseQuickEditSchemaType = {
    name: course?.name || '',
  };

  const methods = useForm<CourseQuickEditSchemaType>({
    mode: 'all',
    resolver: zodResolver(CourseQuickEditSchema),
    defaultValues,
    values: course,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await axios.patch(endpoints.student.update.replace(':id', `${course?.id}`), data);
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
        </Stack>

        <Button type="submit" variant="contained" loading={isSubmitting} sx={{ mt: 3 }}>
          تحديث
        </Button>
      </Form>
    </>
  );
}
