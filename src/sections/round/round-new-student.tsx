import * as zod from 'zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import { Stack, Alert } from '@mui/material';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import axios, { endpoints } from 'src/lib/axios';

import { Form } from 'src/components/hook-form';

import { getErrorMessage } from 'src/auth/utils';

export type AddStudentQuickEditSchemaType = zod.infer<typeof AddStudentQuickEditSchema>;

export const AddStudentQuickEditSchema = zod.object({
  students: zod
    .array(
      zod.object({
        id: zod.number().min(1, { message: 'الاسم الدورة مطلوب!' }),
        name: zod.string().min(1, { message: 'الاسم الدورة مطلوب!' }),
      })
    )
    .optional(),
});

type Props = {
  open: boolean;
  onClose: VoidFunction;

  roundId: number;
  refetch: () => void;
};

export function AddStudents({ roundId, open, refetch, onClose }: Props) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const defaultValues: AddStudentQuickEditSchemaType = {
    students: [],
  };

  const methods = useForm<AddStudentQuickEditSchemaType>({
    mode: 'all',
    resolver: zodResolver(AddStudentQuickEditSchema),
    defaultValues,
  });
  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await axios.post(endpoints.round.bulkEnroll, {
        studentIds: data.students?.map((s) => s.id),
        roundId,
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
      <DialogTitle>اضافة طلاب للمجموعة</DialogTitle>

      {errorMessage && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMessage}
        </Alert>
      )}

      <Form methods={methods} onSubmit={onSubmit}>
        <DialogContent sx={{ py: 1 }}>
          <Stack direction="row" spacing={2} />
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={onClose}>
            الغاء
          </Button>

          <Button type="submit" variant="contained" loading={isSubmitting}>
            اضافة الطلاب
          </Button>
        </DialogActions>
      </Form>
    </Dialog>
  );
}
