import type { ITeacherItem } from 'src/types/teacher';

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

import axios, { endpoints } from 'src/lib/axios';
import { useGetBranches } from 'src/actions/branch';
import { GlobalPermissionCode } from 'src/global-config';

import { NotAllowedDialog } from 'src/components/not-allowed';
import { Form, Field, schemaUtils } from 'src/components/hook-form';

import { useAuthContext } from 'src/auth/hooks';
import { getErrorMessage } from 'src/auth/utils';

// ----------------------------------------------------------------------

export type TeacherQuickEditSchemaType = zod.infer<typeof TeacherQuickEditSchema>;

export const TeacherQuickEditSchema = zod.object({
  name: zod.string().min(1, { message: 'الاسم الدورة مطلوب!' }),
  email: zod.email({ message: 'البريد الإلكتروني غير صحيح!' }).nullable(),
  username: zod.string({ message: ' الاسم المستخدم غير صحيح!' }),
  phone: schemaUtils.phoneNumber({ isValid: isValidPhoneNumber }),
  nationalId: zod
    .string()
    .min(1, { message: 'الهوية الوطنية مطلوبة!' })
    .length(14, { message: 'الهوية الوطنية يجب أن تكون 14 رقم!' }),
  gender: zod.string().min(1, { message: 'الجنس مطلوب!' }),
  branchId: zod.string().min(1, { message: 'الفرع مطلوب!' }),
});
// ----------------------------------------------------------------------

type Props = {
  isNew?: boolean;
  open: boolean;
  onClose: () => void;
  teacher?: ITeacherItem;
  refetch: () => void;
};

export function TeacherQuickEditForm({ isNew = true, refetch, teacher, open, onClose }: Props) {
  const { permissions } = useAuthContext();
  const { branches } = useGetBranches();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const creatingPermission = hasAnyRole(permissions, [GlobalPermissionCode.CreateTeacher]);
  const updatingPermission = hasAnyRole(permissions, [GlobalPermissionCode.UpdateTeacher]);

  const defaultValues: TeacherQuickEditSchemaType = {
    name: teacher?.name || '',
    email: teacher?.email || '',
    phone: teacher?.phone || '',
    username: teacher?.username || '',
    gender: teacher?.gender || '',
    branchId: teacher?.branchId?.id || '',
    nationalId: teacher?.nationalId || '',
  };

  const methods = useForm<TeacherQuickEditSchemaType>({
    mode: 'all',
    resolver: zodResolver(TeacherQuickEditSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (isNew)
        await axios.post(endpoints.teacher.new, data);
      else
        await axios.patch(endpoints.teacher.update.replace(':id', teacher?.id || ''), data);
      reset();
      refetch();
      onClose();
    } catch (error) {
      console.error(error);
      const feedbackMessage = getErrorMessage(error);
      setErrorMessage(feedbackMessage);
    }
  });

  if (isNew && !creatingPermission)
    return <NotAllowedDialog title="لا تملك الصلاخيات لاضافة مدرس" open={open} onClose={onClose} />;

  if (!isNew && !updatingPermission)
    return (
      <NotAllowedDialog title="لا تملك صلاحية لتحديث المدرسين" open={open} onClose={onClose} />
    );

  return (
    <Dialog
      fullWidth
      open={open}
      onClose={() => {
        reset();
        onClose();
      }}
      slotProps={{
        paper: {
          sx: { maxWidth: 720 },
        },
      }}
    >
      <DialogTitle>{isNew ? 'اضافة مدرس' : 'تحديث سريع'}</DialogTitle>

      {errorMessage && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMessage}
        </Alert>
      )}
      <Form methods={methods} onSubmit={onSubmit}>
        <DialogContent>
          <Stack direction="column" spacing={2} mt={1}>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }, gap: 2 }}>
              <Field.Text fullWidth name="name" label="اسم المدرس" />
              <Field.Text select name="branchId" label="الفرع">
                {branches.map((r) => (
                  <MenuItem key={r.id} value={r.id}>
                    {r.name}
                  </MenuItem>
                ))}
              </Field.Text>
            </Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }, gap: 2 }}>
              <Field.Text name="email" label="البريد الإلكتروني" />
              <Field.Phone name="phone" placeholder="رقم الهاتف" defaultCountry="EG" />
            </Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }, gap: 2 }}>
              <Field.Text name="nationalId" label="رقم البطاقة" />
              <Field.Text select name="gender" label="الجنس" >
                <MenuItem value="male">رجل</MenuItem>
                <MenuItem value="female">سيدة</MenuItem>
              </Field.Text>
            </Box>
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
