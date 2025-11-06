import type { IRoleItem } from 'src/types/admin';

import * as zod from 'zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import { Box, Stack, Alert, TextField } from '@mui/material';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import axios, { endpoints } from 'src/lib/axios';
import { GlobalPermissionCode } from 'src/global-config';
import { useGetRoles, useGetPermissions } from 'src/actions/role';

import { Form, Field } from 'src/components/hook-form';

import { useAuthContext } from 'src/auth/hooks';
import { getErrorMessage } from 'src/auth/utils';
import { hasAnyRole } from 'src/utils/has-role';
import { NotAllowedDialog } from 'src/components/not-allowed';

// ----------------------------------------------------------------------

export type RoleQuickEditSchemaType = zod.infer<typeof RoleQuickEditSchema>;

export const RoleQuickEditSchema = zod.object({
  name: zod.string().min(1, { message: 'الاسم الدورة مطلوب!' }),
  isDefault: zod.boolean().optional(),
  permissions: zod.array(zod.string().min(2).max(100)),
});

type Props = {
  isNew?: boolean;
  open: boolean;
  onClose: () => void;
  role?: IRoleItem;
  refetch: () => void;
};

export function RoleQuickEditForm({ isNew = true, role, open, onClose }: Props) {
  const { permissions } = useAuthContext();
  const rolePermissions = useGetPermissions();
  const { refetch } = useGetRoles();

  const creatingPermission = hasAnyRole(permissions, [GlobalPermissionCode.CreateBranch]);
  const updatingPermission = hasAnyRole(permissions, [GlobalPermissionCode.UpdateBranch]);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const defaultValues: RoleQuickEditSchemaType = {
    name: role?.name || '',
    isDefault: role?.isDefault || false,
    permissions: (role?.permissions as any) || [],
  };
  const methods = useForm<RoleQuickEditSchemaType>({
    mode: 'all',
    resolver: zodResolver(RoleQuickEditSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = methods;
  const values = watch();

  const onSubmit = handleSubmit(async (data) => {
    if (!isNew && role?.id) {
      try {
        await axios.patch(endpoints.role.update.replace(':id', role.id), data);
        refetch();
        reset();
        setErrorMessage('');
        onClose();
      } catch (error) {
        console.error(error);
        const feedbackMessage = getErrorMessage(error);
        setErrorMessage(feedbackMessage);
      }
    } else {
      try {
        await axios.post(endpoints.role.new, data);
        refetch();
        reset();
        setErrorMessage('');
        onClose();
      } catch (error) {
        console.error(error);
        const feedbackMessage = getErrorMessage(error);
        setErrorMessage(feedbackMessage);
      }
    }
  });

  if (isNew && !creatingPermission)
    return (
      <NotAllowedDialog title="لا تملك الصلاحيات لاضافة وظيفة" open={open} onClose={onClose} />
    );

  if (!isNew && !updatingPermission)
    return <NotAllowedDialog title="ليس لديك صلاحية تعديل وظيفة" open={open} onClose={onClose} />;

  return (
    <Dialog
      fullWidth
      open={open}
      onClose={() => {
        reset();
        onClose();
        setErrorMessage('');
      }}
      slotProps={{
        paper: {
          sx: { maxWidth: 720 },
        },
      }}
    >
      <DialogTitle>{isNew ? 'اضافة وظيفة' : 'تحديث سريع'}</DialogTitle>

      {errorMessage && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMessage}
        </Alert>
      )}

      <Form methods={methods} onSubmit={onSubmit}>
        <DialogContent>
          <Stack direction="column" pt={2} spacing={2}>
            <Field.Text name="name" label="اسم الوظيفة" />

            <Field.MultiSelect
              checkbox
              name="permissions"
              label="الصلاحيات"
              options={rolePermissions.permissions.map((p) => ({ value: p.id, label: p.name }))}
            />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" onClick={onClose}>
            الغاء
          </Button>

          <Button type="submit" variant="contained" loading={isSubmitting}>
            {isNew ? 'اضافة الوظيفة' : 'تحديث'}
          </Button>
        </DialogActions>
      </Form>
    </Dialog>
  );
}
