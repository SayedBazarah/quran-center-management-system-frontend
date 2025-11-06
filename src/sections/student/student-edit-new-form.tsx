import type { IStudentItem } from 'src/types/student';

import * as zod from 'zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { isValidPhoneNumber } from 'react-phone-number-input';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { Box, Stack, Alert, MenuItem } from '@mui/material';

import { hasAnyRole } from 'src/utils/has-role';
import { appendFormData } from 'src/utils/append-form-data';

import axios, { endpoints } from 'src/lib/axios';
import { useGetAdmins } from 'src/actions/admin';
import { useGetBranches } from 'src/actions/branch';
import { GlobalPermissionCode } from 'src/global-config';

import { NotAllowedDialog } from 'src/components/not-allowed';
import { Form, Field, schemaUtils } from 'src/components/hook-form';

import { useAuthContext } from 'src/auth/hooks';
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
      invalid: 'تاريخ الميلاد غير صالح!',
    },
  }),
  address: zod.string().min(1, { message: 'العنوان مطلوب!' }),
  adminId: zod.string().min(1, { message: 'الفرع مطلوب!' }),
  branchId: zod.string().min(1, { message: 'الفرع مطلوب!' }),
  nationalId: zod.string().min(1, { message: 'رقم الهوية مطلوب !' }).length(14, {
    message: 'رقم الهوية يجب ان يكون 14 رقم!',
  }),
  nationalIdImg: schemaUtils.file({
    error: 'الصورة غير صحيحة!',
  }),
});
// ----------------------------------------------------------------------

type Props = {
  isNew?: boolean;
  open: boolean;
  onClose: () => void;
  currentStudent?: IStudentItem;
  refetch: () => void;
};

export function StudentQuickEditForm({
  isNew = true,
  refetch,
  currentStudent,
  open,
  onClose,
}: Props) {
  const { admins } = useGetAdmins();
  const { branches } = useGetBranches();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { permissions } = useAuthContext();

  const creatingPermission = hasAnyRole(permissions, [GlobalPermissionCode.CreateStudent]);
  const updatingPermission = hasAnyRole(permissions, [GlobalPermissionCode.UpdateStudent]);

  const defaultValues: StudentQuickEditSchemaType = {
    name: currentStudent?.name || '',
    phone: currentStudent?.phone || '',
    gender: currentStudent?.gender || 'ذكر',
    birthDate: currentStudent?.birthDate || '',
    address: currentStudent?.address || '',
    nationalId: currentStudent?.nationalId || '',
    branchId: currentStudent?.branchId?.id || '',
    nationalIdImg: currentStudent?.nationalIdImg || '',
    adminId: currentStudent?.adminId?.id || '',
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
      const formData = new FormData();
      appendFormData(formData, data);
      if (isNew)
        await axios.post(endpoints.student.new, data, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      else
        await axios.patch(endpoints.student.update.replace(':id', currentStudent?.id || ''), data, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      reset();
      refetch();
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
      <Field.Text fullWidth name="name" label="اسم الطالب" />
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: 'repeat(1, 1fr)',
            sm: 'repeat(2, 1fr)',
          },
          gap: 2,
        }}
      >
        <Field.Phone name="phone" label="رقم الهاتف" placeholder="ادخل رقم الهاتف" country="EG" />
        <Field.Text name="address" label="العنوان" />
      </Box>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: 'repeat(1, 1fr)',
            sm: 'repeat(2, 1fr)',
          },
          gap: 2,
        }}
      >
        <Field.Text name="nationalId" label="رقم الهوية" />
        <Field.DatePicker name="birthDate" label="تاريخ الميلاد" />
      </Box>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: 'repeat(1, 1fr)',
            sm: 'repeat(3, 1fr)',
          },
          gap: 2,
        }}
      >
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
        <Field.Text select name="gender" label="النوع">
          <MenuItem value="male">رجل</MenuItem>
          <MenuItem value="female">سيدة</MenuItem>
        </Field.Text>
      </Box>
      <Field.Upload name="nationalIdImg" />
    </Stack>
  );

  if (isNew && !creatingPermission)
    return <NotAllowedDialog title="لا تملك الصلاحيات لاضافة طالب" open={open} onClose={onClose} />;

  if (!isNew && !updatingPermission)
    return <NotAllowedDialog title="ليس لديك صلاحية تعديل طالب" open={open} onClose={onClose} />;

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
      <DialogTitle>{isNew ? 'اضافة طالب' : 'تحديث سريع'}</DialogTitle>

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
            {isNew ? 'اضافة طالب' : 'تحديث'}
          </Button>
        </DialogActions>
      </Form>
    </Dialog>
  );
}
