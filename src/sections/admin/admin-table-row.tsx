import type { IAdminItem, IBranchItem } from 'src/types/admin';

import { useBoolean, usePopover } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import { Avatar, Badge, Chip } from '@mui/material';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';

import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomPopover } from 'src/components/custom-popover';

import { AdminQuickEditForm } from './admin-edit-new-form';
import { Label } from 'src/components/label';

// ----------------------------------------------------------------------

type Props = {
  row: IAdminItem;
  selected: boolean;
  onSelectRow: VoidFunction;
  onDeleteRow: VoidFunction;
  refetch: VoidFunction;
};

export function AdminTableRow({ row, selected, refetch, onSelectRow, onDeleteRow }: Props) {
  const menuActions = usePopover();
  const confirmDialog = useBoolean();
  const quickEditForm = useBoolean();

  const renderQuickEditForm = () =>
    quickEditForm.value && (
      <AdminQuickEditForm
        isNew={false}
        admin={row}
        open={quickEditForm.value}
        onClose={quickEditForm.onFalse}
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
          <MenuItem
            onClick={() => {
              quickEditForm.onTrue();
              menuActions.onClose();
            }}
          >
            <Iconify icon="solar:pen-bold" />
            تعديل
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
        <Button
          variant="contained"
          color="error"
          onClick={() => {
            onDeleteRow();
            confirmDialog.onFalse();
          }}
        >
          حذف
        </Button>
      }
    />
  );

  return (
    <>
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
              <Box
                onClick={quickEditForm.onTrue}
                color="inherit"
                sx={{
                  cursor: 'pointer',
                  typography: 'body2',
                  flex: '1 1 auto',
                  alignItems: 'flex-start',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                {row.name}
              </Box>
              <Box component="a" href={`tel:${row.phone}`} sx={{ color: 'text.disabled' }}>
                {row.phone}
              </Box>
            </Stack>
          </Box>
        </TableCell>

        <TableCell sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1 }}>
          {row.branchIds?.map((b: any) => (
            <Label key={b.id} color="primary" variant="filled" sx={{ mr: 1 }}>
              {b.name}
            </Label>
          )) || '-'}
        </TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.roleId?.name || '-'}</TableCell>
        <TableCell>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
            <IconButton
              color={menuActions.open ? 'inherit' : 'default'}
              onClick={menuActions.onOpen}
            >
              <Iconify icon="eva:more-vertical-fill" />
            </IconButton>
          </Box>
        </TableCell>
      </TableRow>

      {renderQuickEditForm()}
      {renderMenuActions()}
      {renderConfirmDialog()}
    </>
  );
}
