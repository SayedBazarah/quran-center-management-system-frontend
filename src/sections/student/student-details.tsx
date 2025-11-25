import type { IStudentItem } from 'src/types/student';

import dayjs from 'dayjs';
import * as zod from 'zod';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { isValidPhoneNumber } from 'react-phone-number-input';

import { Box, Alert, Stack, Button, MenuItem } from '@mui/material';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';

import { today } from 'src/utils/format-time';
import { appendFormData } from 'src/utils/append-form-data';

import axios, { endpoints } from 'src/lib/axios';
import { useGetAdmins } from 'src/actions/admin';
import { useGetBranches } from 'src/actions/branch';

import { Form, Field, schemaUtils } from 'src/components/hook-form';

import { getErrorMessage } from 'src/auth/utils';

// ----------------------------------------------------------------------

export type StudentQuickEditSchemaType = zod.infer<typeof StudentQuickEditSchema>;

export const StudentQuickEditSchema = zod.object({
  name: zod.string().min(1, { message: 'الاسم الطالب مطلوب!' }),
  phone: schemaUtils.phoneNumber({ isValid: isValidPhoneNumber }),
  gender: zod.string(),
  birthDate: schemaUtils.date({
    error: {
      required: 'تاريخ الميلاد مطلوب!',
    },
  }),
  address: zod.string().min(1, { message: 'العنوان مطلوب!' }),
  adminId: zod.string().min(1, { message: 'اسم مسئول الطالب مطلوب!' }),
  branchId: zod.string().min(1, { message: 'اسم مسئول الطالب مطلوب!' }),
  nationalId: zod.string().min(1, { message: 'رقم الهوية مطلوب !' }).length(14, {
    message: 'رقم الهوية يجب ان يكون 14 رقم!',
  }),
});
// ----------------------------------------------------------------------

type Props = {
  student: IStudentItem;
  refetch: VoidFunction;
};

export default function StudentDetails({ student, refetch }: Props) {
  const { admins } = useGetAdmins();
  const { branches } = useGetBranches();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const defaultValues: StudentQuickEditSchemaType = {
    name: student?.name,
    phone: student?.phone,
    gender: student?.gender,
    birthDate: today(),
    address: student?.address,
    adminId: student?.adminId?.id,
    branchId: student?.branchId?.id,
    nationalId: student?.nationalId,
  };

  const methods = useForm<StudentQuickEditSchemaType>({
    mode: 'all',
    resolver: zodResolver(StudentQuickEditSchema),
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
      await axios.patch(endpoints.student.update.replace(':id', student.id), formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      refetch();
    } catch (error) {
      console.error(error);
      const feedbackMessage = getErrorMessage(error);
      setErrorMessage(feedbackMessage);
    }
  });

  // ----------------------------------------
  const renderStudentForm = () => (
    <Stack direction="column" spacing={2}>
      <Field.Text fullWidth name="name" label="اسم الطالب" />
      <Stack direction="row" spacing={2}>
        <Field.Phone name="phone" label="رقم الهاتف" placeholder="ادخل رقم الهاتف" country="EG" />
        <Field.Text name="address" label="العنوان" />
      </Stack>
      <Stack direction="row" spacing={2}>
        <Field.Text select name="branchId" label="الفرع">
          {branches.map((r) => (
            <MenuItem key={r.id} value={r.id}>
              {r.name}
            </MenuItem>
          ))}
        </Field.Text>
        <Field.Text select name="adminId" label="مسئول الطالب">
          {admins.map((r) => (
            <MenuItem key={r.id} value={r.id}>
              {r.name}
            </MenuItem>
          ))}
        </Field.Text>
      </Stack>
      <Box
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          sm: 'repeat(3, 1fr)',
        }}
        sx={{ display: 'grid', gap: 2 }}
      >
        <Field.Text name="nationalId" label="رقم الهوية" />
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
        <Field.Text select name="gender" label="النوع" >
          <MenuItem value="male">ولد</MenuItem>
          <MenuItem value="female">بنت</MenuItem>
        </Field.Text>
      </Box>
    </Stack>
  );
  // ----------------------------------------------------------------------
  return (
    <>
      {errorMessage && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMessage}
        </Alert>
      )}
      <Form methods={methods} onSubmit={onSubmit}>
        {renderStudentForm()}

        <Button type="submit" variant="contained" loading={isSubmitting} sx={{ mt: 3 }}>
          تحديث
        </Button>
      </Form>
    </>
  );
}
