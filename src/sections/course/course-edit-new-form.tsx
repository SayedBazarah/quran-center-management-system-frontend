import type { ICourseItem } from 'src/types/course';

import * as zod from 'zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { Box, Stack, Alert, Typography } from '@mui/material';

import axios, { endpoints } from 'src/lib/axios';
import { GlobalPermissionCode } from 'src/global-config';

import { Form, Field } from 'src/components/hook-form';

import { useAuthContext } from 'src/auth/hooks';
import { getErrorMessage } from 'src/auth/utils';
import { hasAnyRole } from 'src/utils/has-role';
import { NotAllowedDialog } from 'src/components/not-allowed';

// ----------------------------------------------------------------------

export type CourseQuickEditSchemaType = zod.infer<typeof CourseQuickEditSchema>;

export const CourseQuickEditSchema = zod.object({
  name: zod.string().min(1, { message: 'الاسم الدورة مطلوب!' }),
  order: zod.number().optional(),
  price: zod.number().optional(),
  duration: zod.number().min(1, { message: 'مدة الدورة مطلوب!' }).optional(),
});
// ----------------------------------------------------------------------

type Props = {
  isNew?: boolean;
  open: boolean;
  onClose: () => void;
  course?: ICourseItem;
  refetch: () => void;
};

export function CourseQuickEditForm({ isNew = true, course, open, refetch, onClose }: Props) {
  const { permissions } = useAuthContext();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const creatingPermission = hasAnyRole(permissions, [GlobalPermissionCode.CreateBranch]);
  const updatingPermission = hasAnyRole(permissions, [GlobalPermissionCode.UpdateBranch]);

  const defaultValues: CourseQuickEditSchemaType = {
    name: course?.name || '',
    price: course?.price || 0,
    duration: course?.duration || 0,
  };

  const methods = useForm<CourseQuickEditSchemaType>({
    mode: 'all',
    resolver: zodResolver(CourseQuickEditSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (isNew) await axios.post(endpoints.course.new, data);
      else await axios.patch(endpoints.course.update.replace(':id', `${course?.id}`), data);

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
    return <NotAllowedDialog title="لا تملك الصلاحيات لاضافة دورة" open={open} onClose={onClose} />;

  if (!isNew && !updatingPermission)
    return <NotAllowedDialog title="ليس لديك صلاحية تعديل دورة" open={open} onClose={onClose} />;

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
      <DialogTitle>{isNew ? 'اضافة دورة' : 'تحديث سريع'}</DialogTitle>

      {errorMessage && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMessage}
        </Alert>
      )}
      <Form methods={methods} onSubmit={onSubmit}>
        <DialogContent>
          <Stack direction="column" spacing={2}>
            <Box />
            {/* <RHFUploadAvatar name="pic" /> */}
            <Field.Text name="name" label="اسم الدورة" />
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', md: 'repeat(3, 1fr)' },
                gap: 2,
              }}
            >
              <Field.Text name="order" label="ترتيب الدورة" type="number" />
              <Field.Text
                name="price"
                label="سعر الدورة"
                type="number"
                slotProps={{
                  input: {
                    endAdornment: <Typography>جنية</Typography>,
                  },
                }}
              />
              <Field.Text
                name="duration"
                label="مدة الدورة"
                type="number"
                slotProps={{
                  input: {
                    endAdornment: <Typography>يوم</Typography>,
                  },
                }}
              />
            </Box>
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" onClick={onClose}>
            الغاء
          </Button>

          <Button type="submit" variant="contained" loading={isSubmitting}>
            {isNew ? 'اضافة دورة' : 'تحديث'}
          </Button>
        </DialogActions>
      </Form>
    </Dialog>
  );
}
