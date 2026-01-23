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

import { EnrollmentStatus } from 'src/types/student';

import { NewEnrollmentForm } from './new-enrollemtn-form';

// ----------------------------------------------------------------------
const TABLE_HEAD = ['المرحلة', 'تاريخ البداء', 'تاريخ الانتهاء', 'المشرف', 'المدرس',];

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
    <TableRow hover selected={selected} aria-checked={selected} tabIndex={-1}
      sx={{
        ...(`${row.currentEnrollment?.status}` === EnrollmentStatus.LATE) && { backgroundColor: 'rgba(255, 0, 0, 0.08)' },
      }}>
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
              {(`${row.currentEnrollment?.status}` === EnrollmentStatus.LATE && (
                <Chip
                  label="متاخر"
                  color="error"
                  size="small"
                  variant="outlined"
                  sx={{ mx: 1 }}
                />
              ))}
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
      <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.enrollments?.length || '-'}</TableCell>
      <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.currentEnrollment?.courseId?.name || '-'}</TableCell>
      <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.currentEnrollment?.teacherId?.name || '-'}</TableCell>
      <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.currentEnrollment?.adminId?.name || '-'}</TableCell>

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
          <Paper
            elevation={1} sx={{
              m: 1.5,
              borderRadius: '0 0 6px 6px ',

            }}>
            {/* Header */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: '1fr 150px 150px 150px 150px ',
                gap: 0,
                backgroundColor: 'primary.main',
                padding: '5px 0',
                borderRadius: '6px 6px 0 0',
                color: 'white',
              }}
            >
              {TABLE_HEAD.map((header, index) => (
                <Box
                  key={index}
                  sx={{
                    padding: '0px 12px',
                    fontWeight: 600,
                    fontSize: '14px',
                    borderRight: index < TABLE_HEAD.length - 1 ? '1px solid #ddd' : 'none',
                    ...(index !== 0 && { textAlign: 'center' }),
                  }}
                >
                  {header}
                </Box>
              ))}
            </Box>
            {row.enrollments.map((enrollment, rowIndex) => {
              const startDate = new Date(enrollment.startDate as string);

              const endDate = new Date(startDate);
              endDate.setDate(startDate.getDate() + (enrollment.courseId?.duration || 0));

              return (
                <Box
                  key={rowIndex}
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 150px 150px 150px 150px',
                    gap: 0,
                    borderBottom: '1px solid #eee',
                    '&:hover': {
                      backgroundColor: '#fafafa',
                    },
                  }}
                >
                  <Box sx={{ padding: '6px', borderRight: '1px solid #eee' }}>{enrollment.courseId?.name}
                    {(`${enrollment.status}` === EnrollmentStatus.ACTIVE && (
                      <Chip
                        label="يدرس"
                        color="success"
                        size="small"
                        variant="outlined"
                        sx={{ mx: 1 }}
                      />
                    )) ||
                      (`${enrollment.status}` === EnrollmentStatus.PENDING && (
                        <Chip
                          label="بنتظار القبول"
                          color="warning"
                          size="small"
                          variant="outlined"
                          sx={{ mx: 1 }}
                        />
                      )) ||
                      (`${enrollment.status}` === EnrollmentStatus.LATE && (
                        <Chip
                          label="متاخر"
                          color="error"
                          size="small"
                          variant="outlined"
                          sx={{ mx: 1 }}
                        />
                      )) ||
                      (`${enrollment.status}` === EnrollmentStatus.DROPOUT && (
                        <Chip
                          label="سقط"
                          color="default"
                          size="small"
                          variant="outlined"
                          sx={{ mx: 1 }}
                        />
                      )) ||
                      (`${enrollment.status}` === EnrollmentStatus.GRADUATED && (
                        <Chip
                          label="انتهي من الدورة"
                          color="info"
                          size="small"
                          variant="outlined"
                          sx={{ mx: 1 }}
                        />
                      )) ||
                      (`${enrollment.status}` === EnrollmentStatus.REJECTED && (
                        <Chip
                          label="مرفوضه"
                          color="error"
                          size="small"
                          variant="outlined"
                          sx={{ mx: 1 }}
                        />
                      ))}

                  </Box>
                  <Box sx={{ padding: '6px', borderRight: '1px solid #eee', textAlign: 'center', fontSize: '13px' }}>
                    {fDate(enrollment.startDate)}
                  </Box>
                  <Box sx={{ padding: '6px', borderRight: '1px solid #eee', textAlign: 'center', fontSize: '13px' }}>
                    {fDate(endDate)}
                  </Box>
                  <Box sx={{ padding: '6px', borderRight: '1px solid #eee', textAlign: 'center', fontSize: '13px' }}>
                    {enrollment.adminId?.name}
                  </Box>
                  <Box sx={{ padding: '6px', borderRight: '1px solid #eee', textAlign: 'center', fontSize: '13px' }}>
                    {enrollment.teacherId?.name}
                  </Box>
                </Box>
              )
            })}
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
