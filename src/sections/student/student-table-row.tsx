import type { IEnrollmentWithStudent } from 'src/types/student';

import { useBoolean, usePopover } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import { Chip, Paper, Collapse } from '@mui/material';

import { RouterLink } from 'src/routes/components';

import { fDate } from 'src/utils/format-time';

import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomPopover } from 'src/components/custom-popover';

import { StudentStatus, EnrollmentStatus } from 'src/types/student';

import { NewEnrollmentForm } from './new-enrollemtn-form';

// ----------------------------------------------------------------------

type Props = {
  row: IEnrollmentWithStudent;
  selected: boolean;
  editHref: string;
  onSelectRow: VoidFunction;
  onDeleteRow: VoidFunction;
  refetch: VoidFunction;
};

export function StudentTableRow({
  row,
  selected,
  editHref,
  refetch,
  onSelectRow,
  onDeleteRow,
}: Props) {
  const collapseRow = useBoolean();
  const menuActions = usePopover();
  const confirmDialog = useBoolean();
  const newEnrollmentForm = useBoolean();

  const renderAddEnrollmentForm = () => (
    <NewEnrollmentForm
      open={newEnrollmentForm.value}
      onClose={newEnrollmentForm.onFalse}
      studentId={row.student.id}
    />
  );

  const renderMenuActions = () => (
    <CustomPopover
      open={menuActions.open}
      anchorEl={menuActions.anchorEl}
      onClose={menuActions.onClose}
      slotProps={{ arrow: { placement: 'right-top' } }}
    >
      <MenuList>
        <li>
          <MenuItem component={RouterLink} href={editHref} onClick={() => menuActions.onClose()}>
            <Iconify icon="solar:pen-bold" />
            تعديل
          </MenuItem>
        </li>
        <li>
          <MenuItem
            onClick={() => {
              newEnrollmentForm.onTrue();
              menuActions.onClose();
            }}
          >
            <Iconify icon="mingcute:add-line" />
            التسجيل بمرحلة تعليمية
          </MenuItem>
        </li>

        <MenuItem
          onClick={() => {
            confirmDialog.onTrue();
            menuActions.onClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          حذف
        </MenuItem>
      </MenuList>
    </CustomPopover>
  );
  const renderConfirmDialog = () => (
    <ConfirmDialog
      open={confirmDialog.value}
      onClose={confirmDialog.onFalse}
      title="حذف"
      content="هل تريد حذف هذا الطالب؟"
      action={
        <Button variant="contained" color="error" onClick={onDeleteRow}>
          حذف
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
              id: `${row.student.id}-checkbox`,
              'aria-label': `${row.student.id} checkbox`,
            },
          }}
        />
      </TableCell>

      <TableCell>
        <Box sx={{ gap: 2, display: 'flex', alignItems: 'center' }}>
          <Stack sx={{ typography: 'body2', flex: '1 1 auto', alignItems: 'flex-start' }}>
            <Link component={RouterLink} href={editHref} color="inherit" sx={{ cursor: 'pointer' }}>
              {row.student.name}
              <Chip
                color={
                  row.student.status === StudentStatus.DROPOUT
                    ? 'default'
                    : row.student.status === StudentStatus.GRADUATED
                      ? 'success'
                      : row.student.status === StudentStatus.REJECTED
                        ? 'error'
                        : row.student.status === StudentStatus.LATE
                          ? 'error'
                          : row.student.status === StudentStatus.PENDING
                            ? 'warning'
                            : row.student.status === StudentStatus.ACTIVE
                              ? 'success'
                              : 'default'
                }
                size="small"
                variant="outlined"
                label={
                  row.student.status === StudentStatus.DROPOUT
                    ? 'ترك المركز'
                    : row.student.status === StudentStatus.GRADUATED
                      ? 'تخرج'
                      : row.student.status === StudentStatus.REJECTED
                        ? 'مرفوض'
                        : row.student.status === StudentStatus.LATE
                          ? 'متاخر'
                          : row.student.status === StudentStatus.PENDING
                            ? 'بنتظار القبول'
                            : row.student.status === StudentStatus.ACTIVE
                              ? 'يدرس'
                              : 'لا يوجد حالة'
                }
                sx={{ ml: 1 }}
              />
            </Link>
            <Box
              component="a"
              href={`tel:${row.student.phone}`}
              sx={{ display: 'flex', alignItems: 'center', color: 'text.disabled' }}
            >
              <Iconify icon="solar:phone-bold" />
              {row.student.phone}
            </Box>
          </Stack>
        </Box>
      </TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>{fDate(row.student.createdAt) || '-'}</TableCell>
      <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.student.adminId?.name || '-'}</TableCell>
      <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.currentEnrollment?.courseId?.name}</TableCell>
      <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.currentEnrollment?.teacherId?.name}</TableCell>
      {/* <TableCell sx={{ whiteSpace: 'nowrap' }}>{teacherNames.join(', ') || '-'}</TableCell> */}

      <TableCell>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton
            color={collapseRow.value ? 'inherit' : 'default'}
            onClick={collapseRow.onToggle}
            sx={{ ...(collapseRow.value && { bgcolor: 'action.hover' }) }}
          >
            <Iconify icon="eva:arrow-ios-downward-fill" />
          </IconButton>
          <IconButton color={menuActions.open ? 'inherit' : 'default'} onClick={menuActions.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </Box>
      </TableCell>
    </TableRow>
  );
  const renderSecondaryRow = () => (
    <TableRow>
      <TableCell sx={{ p: 0, border: 'none' }} colSpan={8}>
        <Collapse
          in={collapseRow.value}
          timeout="auto"
          unmountOnExit
          sx={{ bgcolor: 'background.neutral' }}
        >
          <Paper sx={{ m: 1.5 }}>
            {row.enrollments.map((item, index) => (
              <Box
                key={index}
                sx={(theme) => ({
                  display: 'flex',
                  alignItems: 'center',
                  p: theme.spacing(1.5, 2, 1.5, 1.5),
                  '&:not(:last-of-type)': {
                    borderBottom: `solid 2px ${theme.vars.palette.background.neutral}`,
                  },
                })}
              >
                <Box>{item.courseId?.name} </Box>
                <Box>
                  {(`${item.status}` === EnrollmentStatus.ACTIVE && (
                    <Chip
                      label="يدرس"
                      color="success"
                      size="small"
                      variant="outlined"
                      sx={{ mx: 1 }}
                    />
                  )) ||
                    (`${item.status}` === EnrollmentStatus.PENDING && (
                      <Chip
                        label="بنتظار القبول"
                        color="warning"
                        size="small"
                        variant="outlined"
                        sx={{ mx: 1 }}
                      />
                    )) ||
                    (`${item.status}` === EnrollmentStatus.LATE && (
                      <Chip
                        label="متاخر"
                        color="error"
                        size="small"
                        variant="outlined"
                        sx={{ mx: 1 }}
                      />
                    )) ||
                    (`${item.status}` === EnrollmentStatus.DROPOUT && (
                      <Chip
                        label="سقط"
                        color="default"
                        size="small"
                        variant="outlined"
                        sx={{ mx: 1 }}
                      />
                    )) ||
                    (`${item.status}` === EnrollmentStatus.GRADUATED && (
                      <Chip
                        label="انتهي من الدورة"
                        color="info"
                        size="small"
                        variant="outlined"
                        sx={{ mx: 1 }}
                      />
                    )) ||
                    (`${item.status}` === EnrollmentStatus.REJECTED && (
                      <Chip
                        label="مرفوضه"
                        color="error"
                        size="small"
                        variant="outlined"
                        sx={{ mx: 1 }}
                      />
                    ))}
                </Box>
              </Box>
            ))}
          </Paper>
        </Collapse>
      </TableCell>
    </TableRow>
  );
  return (
    <>
      {renderPrimaryRow()}
      {renderSecondaryRow()}
      {renderAddEnrollmentForm()}
      {renderMenuActions()}
      {renderConfirmDialog()}
    </>
  );
}
