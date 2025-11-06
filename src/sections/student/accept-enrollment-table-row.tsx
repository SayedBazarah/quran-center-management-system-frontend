import type { IEnrollmentItem } from 'src/types/student';

import { useBoolean } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';

import { fDate } from 'src/utils/format-time';

import { Iconify } from 'src/components/iconify';
import { ConfirmDialog, ConfirmDialogWithReason } from 'src/components/custom-dialog';


// ----------------------------------------------------------------------

type Props = {
  row: IEnrollmentItem;
  selected: boolean;
  onSelectRow: VoidFunction;
  onRejectRow: (reason: string) => void;
  onAcceptRow: VoidFunction;
};

export function AcceptEnrollmentTableRow({
  row,
  selected,
  onSelectRow,
  onAcceptRow,
  onRejectRow,
}: Props) {
  const confirmRejectDialog = useBoolean();
  const confirmAcceptDialog = useBoolean();

  const renderConfirmDialog = () => (
    <ConfirmDialogWithReason
      open={confirmRejectDialog.value}
      title="رفض طلب الطالب"
      content="هل تريد رفض اضافة هذا الطالب؟"
      confirmLabel="رفض"
      cancelLabel="الغاء"
      minLength={3}
      maxLength={300}
      onClose={confirmRejectDialog.onFalse}
      onConfirm={(reason) => {
        onRejectRow(reason);
        confirmRejectDialog.onFalse();
      }}
    />
  );
  const renderAcceptConfirmDialog = () => (
    <ConfirmDialog
      open={confirmAcceptDialog.value}
      onClose={confirmAcceptDialog.onFalse}
      title="تاكيد"
      content="هل تريد تاكيد اضافة هذا الطالب؟"
      action={
        <Button
          variant="contained"
          color="black"
          onClick={() => {
            onAcceptRow();
            confirmAcceptDialog.onFalse();
          }}
        >
          تاكيد
        </Button>
      }
    />
  );
  const renderPrimaryRow = () => (
    <TableRow hover selected={selected} aria-checked={selected} tabIndex={-1}>
      <TableCell padding="checkbox">
        <Checkbox
          checked={selected}
          onClick={onSelectRow}
          slotProps={{
            input: {
              id: `${row.id}-checkbox`,
              'aria-label': `${row.id} checkbox`,
            },
          }}
        />
      </TableCell>

      <TableCell>
        <Box sx={{ gap: 2, display: 'flex', alignItems: 'center' }}>
          <Stack sx={{ typography: 'body2', flex: '1 1 auto', alignItems: 'flex-start' }}>
            <Box color="inherit" sx={{ cursor: 'pointer' }}>
              {row.studentId?.name}
            </Box>
            <Box
              component="a"
              href={`tel:${row.studentId?.phone}`}
              sx={{ display: 'flex', alignItems: 'center', color: 'text.disabled' }}
            >
              <Iconify icon="solar:phone-bold" />
              {row.studentId?.phone}
            </Box>
          </Stack>
        </Box>
      </TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap', width: 160 }}>{fDate(row.startDate) || '-'}</TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap', width: 160 }}>{row.courseId?.name || '-'}</TableCell>
      <TableCell sx={{ whiteSpace: 'nowrap', width: 160 }}>{row.adminId?.name || '-'}</TableCell>
      <TableCell sx={{ whiteSpace: 'nowrap', width: 160 }}>{row.teacherId?.name || '-'}</TableCell>
      <TableCell sx={{ whiteSpace: 'nowrap', width: 160 }}>{row.createdBy?.name || '-'}</TableCell>
      <TableCell>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', justifyContent: 'flex-end' }}>
          <Button variant="contained" color="black" onClick={confirmAcceptDialog.onTrue}>
            قبول
          </Button>
          <Button variant="contained" color="error" onClick={confirmRejectDialog.onTrue}>
            رفض
          </Button>
        </Box>
      </TableCell>
    </TableRow>
  );

  return (
    <>
      {renderPrimaryRow()}
      {renderAcceptConfirmDialog()}
      {renderConfirmDialog()}
    </>
  );
}
