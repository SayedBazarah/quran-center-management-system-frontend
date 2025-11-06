import type { IParentItem } from 'src/types/student';

import dayjs from 'dayjs';
import * as zod from 'zod';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { isValidPhoneNumber } from 'react-phone-number-input';

import Button from '@mui/material/Button';
import { Stack, Alert, MenuItem, Typography } from '@mui/material';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';

import { appendFormData } from 'src/utils/append-form-data';

import axios, { endpoints } from 'src/lib/axios';

import { Form, Field, schemaUtils } from 'src/components/hook-form';

import { getErrorMessage } from 'src/auth/utils';

// ----------------------------------------------------------------------

export type ParentSchemaType = zod.infer<typeof ParentSchema>;

export const ParentSchema = zod.object({
  studentId: zod.string(),
  name: zod.string().min(1, { message: 'الاسم الطالب مطلوب!' }),
  phone: schemaUtils.phoneNumber({ isValid: isValidPhoneNumber }),
  gender: zod.string(),
  relationship: zod.string(),
  birthDate: schemaUtils.date({
    error: {
      required: 'تاريخ الميلاد مطلوب!',
      invalid: 'تاريخ الميلاد غير صالح!',
    },
  }),
  nationalId: zod.string().min(1, { message: 'رقم الهوية مطلوب !' }).length(14, {
    message: 'رقم الهوية يجب ان يكون 14 رقم!',
  }),
  nationalIdImg: schemaUtils.file({
    error: 'الصورة غير صحيحة!',
  }),
});
// ----------------------------------------------------------------------

type Props = {
  parent?: IParentItem;
  studentId: string;
  refetch: VoidFunction;
};

export function StudentParentForm({ studentId, parent, refetch }: Props) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const defaultValues: ParentSchemaType = {
    studentId,
    name: parent?.name || '',
    phone: parent?.phone || '',
    gender: parent?.gender || '',
    birthDate: parent?.birthDate || '',
    nationalId: parent?.nationalId || '',
    nationalIdImg: parent?.nationalIdImg || '',
    relationship: parent?.relationship || '',
  };

  const methods = useForm<ParentSchemaType>({
    mode: 'all',
    resolver: zodResolver(ParentSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = methods;
  const onSubmit = handleSubmit(async (data) => {
    try {
      const formData = new FormData();
      appendFormData(formData, data);

      await axios.patch(endpoints.student.parent, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } catch (error) {
      console.error(error);
      const feedbackMessage = getErrorMessage(error);
      setErrorMessage(feedbackMessage);
    }
  });

  // ----------------------------------------
  const renderStudentForm = () => (
    <Stack direction="column" spacing={2}>
      <Field.Text fullWidth name="name" label="اسم ولي الامر" />
      <Stack direction="row" spacing={2}>
        <Field.Phone name="phone" label="رقم الهاتف" placeholder="ادخل رقم الهاتف" country="EG" />
        <Field.Text name="nationalId" label="رقم الهوية" />
      </Stack>
      <Stack direction="row" spacing={2}>
        <Field.Text select name="gender" label="النوع">
          <MenuItem value="male">رجل</MenuItem>
          <MenuItem value="female">سيدة</MenuItem>
        </Field.Text>
        <Field.Text select name="relationship" label="العلاقة بالطالب">
          <MenuItem value="parent">اب/ام</MenuItem>
          <MenuItem value="uncle">عم/عمة</MenuItem>
        </Field.Text>
        <Controller
          name="birthDate"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <DesktopDatePicker
              openTo="year"
              views={['year', 'month', 'day']}
              label="تاريخ الميلاد"
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

      <Typography variant="h6" sx={{ mt: 2 }}>
        صورة البطاقة/شهادة الميلاد
      </Typography>
      <Field.Upload name="nationalIdImg" />
    </Stack>
  );

  return (
    <>
      {errorMessage && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMessage}
        </Alert>
      )}
      <Form methods={methods} onSubmit={onSubmit}>
        {renderStudentForm()}

        <Button type="submit" variant="contained" loading={isSubmitting}>
          تحديث
        </Button>
      </Form>
    </>
  );
}
