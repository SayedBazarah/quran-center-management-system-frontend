'use client';

import type { TableHeadCellProps } from 'src/components/table';
import type { IBranchItem, IBranchTableFilters } from 'src/types/admin';

import { useCallback } from 'react';
import { useBoolean, useSetState } from 'minimal-shared/hooks';

import { Box, Card, Table, Button, Tooltip, TableBody, IconButton } from '@mui/material';

import { paths } from 'src/routes/paths';

import { hasAnyRole } from 'src/utils/has-role';

import axios, { endpoints } from 'src/lib/axios';
import { useGetBranches } from 'src/actions/branch';
import { DashboardContent } from 'src/layouts/dashboard';
import { GlobalPermissionCode } from 'src/global-config';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { NotAllowedView } from 'src/components/not-allowed';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import {
  useTable,
  emptyRows,
  rowInPage,
  TableNoData,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';

import { useAuthContext } from 'src/auth/hooks';

import { BranchTableRow } from '../branch-table-row';
import { BranchTableToolbar } from '../branch-table-toolbar';
import { BranchQuickEditForm } from '../branch-edit-new-form';
import { BranchTableFiltersResult } from '../branch-table-filters-result';

// ----------------------------------------------------------------------

const TABLE_HEAD: TableHeadCellProps[] = [
  { id: 'name', label: 'الاسم' },
  { id: '', width: 88 },
];

export default function BranchesListView() {
  const isNew = useBoolean();
  const table = useTable({
    defaultRowsPerPage: 25,
  });
  const { permissions } = useAuthContext();
  const isAuthorized = hasAnyRole(permissions, [GlobalPermissionCode.ReadBranch]);

  const confirmDialog = useBoolean();

  const { branches, refetch } = useGetBranches();

  const filters = useSetState<IBranchTableFilters>({ name: '' });
  const { state: currentFilters } = filters;

  const dataFiltered = applyFilter({
    inputData: branches,
    comparator: getComparator(table.order, table.orderBy),
    filters: currentFilters,
  });

  const dataInPage = rowInPage(dataFiltered, table.page, table.rowsPerPage);

  const canReset = !!currentFilters.name;

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const handleDeleteRow = useCallback(
    async (id: string) => {
      await axios.delete(endpoints.branch.delete.replace(':id', id));
      toast.success('تم المسح بنجاح!');

      refetch();

      table.onUpdatePageDeleteRow(dataInPage.length);
    },
    [dataInPage.length, table, refetch]
  );

  // const handleDeleteRows = useCallback(() => {
  //   // const deleteRows = courses.filter((row) => !table.selected.includes(row.id.toString()));

  //   toast.success('تم المسح بنجاح!');

  //   // refetch();

  //   table.onUpdatePageDeleteRows(dataInPage.length, dataFiltered.length);
  // }, [dataFiltered.length, dataInPage.length, table]);

  // const handleFilterTeacher = useCallback(
  //   (event: React.SyntheticEvent, newValue: string) => {
  //     table.onResetPage();
  //     updateFilters({ teacher: newValue });
  //   },
  //   [updateFilters, table]
  // );

  // const renderConfirmDialog = () => (
  //   <ConfirmDialog
  //     open={confirmDialog.value}
  //     onClose={confirmDialog.onFalse}
  //     title="مسح"
  //     content={
  //       <>
  //         هل تريد حذف <strong> {table.selected.length} </strong> المرحلة؟
  //       </>
  //     }
  //     action={
  //       <Button
  //         variant="contained"
  //         color="error"
  //         onClick={() => {
  //           handleDeleteRows();
  //           confirmDialog.onFalse();
  //         }}
  //       >
  //         حذف
  //       </Button>
  //     }
  //   />
  // );
  if (!isAuthorized) return <NotAllowedView />;

  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="الفروع"
          links={[{ name: 'لوحة التحكم', href: paths.dashboard.root }, { name: 'الفروع' }]}
          action={
            <Button
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
              onClick={isNew.onTrue}
            >
              فرع جديد
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />
        <Card>
          <BranchTableToolbar filters={filters} onResetPage={table.onResetPage} options={{}} />

          {canReset && (
            <BranchTableFiltersResult
              filters={filters}
              totalResults={dataFiltered.length}
              onResetPage={table.onResetPage}
              sx={{ p: 2.5, pt: 0 }}
            />
          )}

          <Box sx={{ position: 'relative' }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={dataFiltered.length}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  dataFiltered.map((row) => row.id.toString())
                )
              }
              action={
                <Tooltip title="مسح">
                  <IconButton color="primary" onClick={confirmDialog.onTrue}>
                    <Iconify icon="solar:trash-bin-trash-bold" />
                  </IconButton>
                </Tooltip>
              }
            />

            <Scrollbar>
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headCells={TABLE_HEAD}
                  rowCount={dataFiltered.length}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                  onSelectAllRows={(checked) =>
                    table.onSelectAllRows(
                      checked,
                      dataFiltered.map((row) => row.id.toString())
                    )
                  }
                />

                <TableBody>
                  {dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row) => (
                      <BranchTableRow
                        key={row.id}
                        row={row}
                        selected={table.selected.includes(row.id.toString())}
                        // refetch={refetch}
                        refetch={() => {}}
                        onSelectRow={() => table.onSelectRow(row.id.toString())}
                        onDeleteRow={() => handleDeleteRow(row.id)}
                      />
                    ))}

                  <TableEmptyRows
                    height={table.dense ? 56 : 56 + 20}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
                  />

                  <TableNoData notFound={notFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </Box>

          <TablePaginationCustom
            page={table.page}
            dense={table.dense}
            count={dataFiltered.length}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            onChangeDense={table.onChangeDense}
            onRowsPerPageChange={table.onChangeRowsPerPage}
          />
        </Card>
      </DashboardContent>
      <BranchQuickEditForm isNew open={isNew.value} onClose={isNew.onFalse} refetch={refetch} />
    </>
  );
}

// ----------------------------------------------------------------------

type ApplyFilterProps = {
  inputData: IBranchItem[];
  filters: IBranchTableFilters;
  comparator: (a: any, b: any) => number;
};

function applyFilter({ inputData, comparator, filters }: ApplyFilterProps) {
  const { name } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter((branch) =>
      branch.name.toLowerCase().includes(name.toLowerCase())
    );
  }

  return inputData;
}
