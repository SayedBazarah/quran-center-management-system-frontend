import type { ICourseRounds } from 'src/types/course';

import dayjs from 'dayjs';
import * as zod from 'zod';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Box, Alert, Stack, Button } from '@mui/material';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';

import axios, { endpoints } from 'src/lib/axios';
import { useGetTeachers } from 'src/actions/teacher';

import { Form, Field, schemaHelper } from 'src/components/hook-form';

import { getErrorMessage } from 'src/auth/utils';

// ----------------------------------------------------------------------
export type RoundQuickEditSchemaType = zod.infer<typeof RoundQuickEditSchema>;

export const RoundQuickEditSchema = zod
  .object({
    startDate: schemaHelper.date({
      message: {
        required: 'تاريخ الميلاد مطلوب!',
        invalid_type: 'تاريخ الميلاد غير صحيح !',
      },
    }),
    endDate: schemaHelper.date({
      message: {
        required: 'تاريخ الميلاد مطلوب!',
        invalid_type: 'تاريخ الميلاد غير صحيح !',
      },
    }),
    teacher: zod.object({
      id: zod.string().min(1, { message: 'الاسم الدورة مطلوب!' }),
      name: zod.string().min(1, { message: 'الاسم الدورة مطلوب!' }),
    }),
  })
  .refine(
    (data) =>
      data.startDate !== null &&
      data.endDate !== null &&
      new Date(data.endDate) >= new Date(data.startDate),
    {
      message: 'تاريخ الانتهاء يجب أن يكون بعد تاريخ البدء!',
      path: ['endDate'], // This will attach the error to the endDate field
    }
  );
// ----------------------------------------------------------------------

type Props = {
  round: ICourseRounds;
};

export default function RoundDetails({ round }: Props) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { teachers } = useGetTeachers();

  const defaultValues: RoundQuickEditSchemaType = {
    startDate: round?.startDate || new Date(),
    endDate: round?.endDate || new Date(),
    teacher: {
      id: round?.teacher?.id || '',
      name: round?.teacher?.name || '',
    },
  };

  const methods = useForm<RoundQuickEditSchemaType>({
    mode: 'all',
    resolver: zodResolver(RoundQuickEditSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await axios.patch(endpoints.student.update.replace(':id', `${round.id}`), data);
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
          <Stack direction="row" spacing={2}>
            <Controller
              name="startDate"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <DesktopDatePicker
                  openTo="year"
                  views={['year', 'month', 'day']}
                  label="تاريخ البداية"
                  value={dayjs(field.value)}
                  onChange={(date) => field.onChange(dayjs(date) ?? null)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!error,
                      helperText: error?.message,
                    },
                  }}
                />
              )}
            />
            <Controller
              name="endDate"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <DesktopDatePicker
                  openTo="year"
                  views={['year', 'month', 'day']}
                  label="تاريخ الانتهاء"
                  value={dayjs(field.value)}
                  onChange={(date) => field.onChange(dayjs(date) ?? null)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!error,
                      helperText: error?.message,
                    },
                  }}
                />
              )}
            />
          </Stack>
          <Stack direction="row" spacing={2}>
            <Field.Autocomplete
              multiple={false}
              name="teacher"
              label="المدرس"
              options={teachers.map((c) => ({ id: c.id, name: c.name }))}
              getOptionLabel={(option) => option.name}
              sx={{ width: 1 }}
            />
          </Stack>
        </Stack>

        <Button type="submit" variant="contained" loading={isSubmitting} sx={{ mt: 3 }}>
          تحديث
        </Button>
      </Form>
    </>
  );
}
