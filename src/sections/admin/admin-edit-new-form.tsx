import type { IAdminItem } from 'src/types/admin';

import * as zod from 'zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useBoolean } from 'minimal-shared/hooks';
import { zodResolver } from '@hookform/resolvers/zod';
import { isValidPhoneNumber } from 'react-phone-number-input';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { Box, Stack, Alert, MenuItem, IconButton, InputAdornment } from '@mui/material';

import { useGetRoles } from 'src/actions/role';
import axios, { endpoints } from 'src/lib/axios';
import { useGetAdmins } from 'src/actions/admin';
import { useGetBranches } from 'src/actions/branch';

import { Iconify } from 'src/components/iconify';
import { Form, Field, schemaUtils } from 'src/components/hook-form';

import { getErrorMessage } from 'src/auth/utils';

// ----------------------------------------------------------------------

export type AdminQuickEditSchemaType = zod.infer<typeof AdminQuickEditSchema>;

// name              String
// email             String?     @unique
// phone             String      @unique
// nationalId        String      @unique
// nationalIdImg     String?
// username          String      @unique
// password          String?

export const AdminQuickEditSchema = zod.object({
  name: zod.string().min(1, { message: 'الاسم الدورة مطلوب!' }),
  email: zod.string().email({ message: 'البريد الإلكتروني غير صحيح!' }),
  username: zod.string().min(1, { message: 'اسم المستخدم مطلوب!' }),
  password: zod.string().min(8, { message: 'كلمة المرور يجب أن تحتوي على حرفا على الأقل 8 حرف!' }),
  phone: schemaUtils.phoneNumber({ isValid: isValidPhoneNumber }),
  nationalId: zod
    .string()
    .min(1, { message: 'الهوية الوطنية مطلوبة!' })
    .length(14, { message: 'الهوية الوطنية يجب أن تكون 14 رقم!' }),
  gender: zod.string().min(1, { message: 'الجنس مطلوب!' }),
  roleId: zod.string().min(1, { message: 'الوظيفة مطلوب!' }),
  branchIds: zod.array(zod.string().min(1, { message: 'الفرع مطلوب!' })),
});
// ----------------------------------------------------------------------

type Props = {
  isNew?: boolean;
  open: boolean;
  onClose: () => void;
  admin?: IAdminItem;
};

export function AdminQuickEditForm({ isNew = true, admin, open, onClose }: Props) {
  const { roles } = useGetRoles();
  const { branches } = useGetBranches();
  const { refetch } = useGetAdmins();

  const showPassword = useBoolean();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const defaultValues: AdminQuickEditSchemaType = {
    name: admin?.name || '',
    email: admin?.email || '',
    phone: admin?.phone || '',
    gender: admin?.gender || '',
    roleId: admin?.roleId?.id || '',
    branchIds: admin?.branchIds?.map((b: any) => b.id) || [],
    nationalId: admin?.nationalId || '',
    username: admin?.username || '',
    password: '',
  };

  const methods = useForm<AdminQuickEditSchemaType>({
    mode: 'all',
    resolver: zodResolver(AdminQuickEditSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (!isNew && admin?.id) {
        await axios.patch(endpoints.admin.update.replace(':id', admin.id), data);
      } else {
        await axios.post(endpoints.admin.new, data);
      }
      await refetch();
      reset();
      setErrorMessage('');
      onClose();
    } catch (error) {
      console.error(error);
      const feedbackMessage = getErrorMessage(error);
      setErrorMessage(feedbackMessage);
    }
  });

  // ----------------------------------------
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
      <DialogTitle>{isNew ? 'اضافة موظف' : 'تحديث سريع'}</DialogTitle>

      {errorMessage && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMessage}
        </Alert>
      )}

      <Form methods={methods} onSubmit={onSubmit}>
        <DialogContent>
          <Stack direction="column" spacing={2}>
            <Box />
            <Field.Text fullWidth name="name" label="اسم المسئول" />
            <Box sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              },
              gap: 2,
            }}
            >              <Field.Text name="username" label="اسم المستخدم" />
              <Field.Text
                name="password"
                label="كلمة المرور"
                placeholder="8+ اكثر حروف"
                type={showPassword.value ? 'text' : 'password'}
                slotProps={{
                  inputLabel: { shrink: true },
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={showPassword.onToggle} edge="end">
                          <Iconify
                            icon={showPassword.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                          />
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Box>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' },
                gap: 2,
              }}
            >
              <Field.Text select name="roleId" label="الوظيفة">
                {roles.map((r) => (
                  <MenuItem key={r.id} value={r.id}>
                    {r.name}
                  </MenuItem>
                ))}
              </Field.Text>
              <Field.MultiSelect
                checkbox
                name="branchIds"
                label="الفرع"
                options={branches.map((b) => ({ value: b.id, label: b.name }))}
              />
            </Box>
            <Box sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              },
              gap: 2,
            }}
            >
              <Field.Text name="email" label="البريد الإلكتروني" />
              <Field.Phone name="phone" placeholder="رقم الهاتف" defaultCountry="EG" />
            </Box>
            <Box sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              },
              gap: 2,
            }}
            >
              <Field.Text name="nationalId" label="رقم البطاقة" disabled={!!admin} />
              <Field.Text select name="gender" label="الجنس" disabled={!!admin}>
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
            {isNew ? 'اضافة موظف' : 'تحديث'}
          </Button>
        </DialogActions>
      </Form>
    </Dialog>
  );
}
