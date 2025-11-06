import type { ICourseRounds } from 'src/types/course';

import dayjs from 'dayjs';
import * as zod from 'zod';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import { Box, Stack, Alert } from '@mui/material';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';

import axios, { endpoints } from 'src/lib/axios';
import { useGetCourses } from 'src/actions/course';
import { useGetTeachers } from 'src/actions/teacher';

import { Form, Field, schemaUtils } from 'src/components/hook-form';

import { getErrorMessage } from 'src/auth/utils';

// ----------------------------------------------------------------------

export type RoundQuickEditSchemaType = zod.infer<typeof RoundQuickEditSchema>;

export const RoundQuickEditSchema = zod
  .object({
    startDate: schemaUtils.date({
      error: {
        required: 'تاريخ الميلاد مطلوب!',
        invalid: 'تاريخ الميلاد غير صحيح !',
      },
    }),
    endDate: schemaUtils.date({
      error: {
        required: 'تاريخ الميلاد مطلوب!',
        invalid: 'تاريخ الميلاد غير صحيح !',
      },
    }),
    course: zod.object({
      id: zod.number().min(1, { message: 'الاسم الدورة مطلوب!' }),
      name: zod.string().min(1, { message: 'الاسم الدورة مطلوب!' }),
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
  isNew?: boolean;
  open: boolean;
  onClose: () => void;
  round?: ICourseRounds;
  refetch: () => void;
};

export function RoundQuickEditForm({ isNew = true, round, open, refetch, onClose }: Props) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { courses } = useGetCourses();
  const { teachers } = useGetTeachers();
  const defaultValues: RoundQuickEditSchemaType = {
    startDate: round?.startDate || new Date(),
    endDate: round?.endDate || new Date(),
    course: {
      id: round?.course?.id || 0,
      name: round?.course?.name || '',
    },
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
    reset,
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    const body = {
      startDate: data.startDate,
      endDate: data.endDate,
      courseId: data.course.id,
      teacherId: data.teacher.id,
    };
    try {
      if (isNew) await axios.post(endpoints.round.new, body);
      else await axios.patch(endpoints.round.update.replace(':id', `${round?.id}`), body);

      reset();
      refetch();
      onClose();
    } catch (error) {
      console.error(error);
      const feedbackMessage = getErrorMessage(error);
      setErrorMessage(feedbackMessage);
    }
  });

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
      <DialogTitle>{isNew ? 'اضافة مجموعة' : 'تحديث سريع'}</DialogTitle>

      {errorMessage && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMessage}
        </Alert>
      )}

      <Form methods={methods} onSubmit={onSubmit}>
        <DialogContent sx={{ my: 1 }}>
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
                name="course"
                label="الدورة"
                options={courses.map((c) => ({ id: c.id, name: c.name }))}
                getOptionLabel={(option) => option.name}
                sx={{ width: 1 }}
              />
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
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" onClick={onClose}>
            الغاء
          </Button>

          <Button type="submit" variant="contained" loading={isSubmitting}>
            {isNew ? 'اضافة مدرس' : 'تحديث'}
          </Button>
        </DialogActions>
      </Form>
    </Dialog>
  );
}
