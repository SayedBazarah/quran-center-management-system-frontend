'use client';

// ----------------------------------------------------------------------

import type { TableHeadCellProps } from 'src/components/table';

import { useCallback } from 'react';
import { varAlpha } from 'minimal-shared/utils';
import { useBoolean, useSetState } from 'minimal-shared/hooks';

import {
  Box,
  Tab,
  Card,
  Tabs,
  Table,
  Button,
  Tooltip,
  useTheme,
  TableBody,
  IconButton,
} from '@mui/material';

import { paths } from 'src/routes/paths';

import { hasAnyRole } from 'src/utils/has-role';

import axios, { endpoints } from 'src/lib/axios';
import { useGetStudents } from 'src/actions/student';
import { DashboardContent } from 'src/layouts/dashboard';
import { GlobalPermissionCode } from 'src/global-config';

import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { NotAllowedView } from 'src/components/not-allowed';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { LoadingScreen } from 'src/components/loading-screen';
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

import {
  StudentStatus,
  EnrollmentStatusList,
  type IStudentTableFilters,
  type IEnrollmentWithStudent,
} from 'src/types/student';

import { StudentTableRow } from '../student-table-row';
import { StudentTableToolbar } from '../student-table-toolbar';
import { StudentQuickEditForm } from '../student-edit-new-form';
import { StudentTableFiltersResult } from '../student-table-filters-result';

const TABLE_HEAD: TableHeadCellProps[] = [
  { id: 'name', label: 'الاسم' },
  { id: 'rounds', label: 'عدد المراحل', width: 100 },
  { id: 'currentRound', label: 'المراحل الحالية', width: 100 },
  { id: 'teacherId', label: 'المدرس', width: 80 },
  { id: 'adminId', label: 'المشرف', width: 80 },
  { id: '', width: 88 },
];

// ----------------------------------------------------------------------
export function StudentListView() {
  const theme = useTheme();
  const isNew = useBoolean();
  const table = useTable({
    defaultRowsPerPage: 25,
  });
  const { permissions } = useAuthContext();
  const isAuthorized = hasAnyRole(permissions, [GlobalPermissionCode.ReadStudent]);

  const confirmDialog = useBoolean();

  const { students, refetch, studentsLoading } = useGetStudents();
  const filters = useSetState<IStudentTableFilters>({
    name: '',
    teacher: [],
    admin: [],
    branch: [],
    enrollmentStatus: [],
    status: 'all',
  });

  const { state: currentFilters, setState: updateFilters } = filters;

  const dataFiltered = applyFilter({
    inputData: students,
    comparator: getComparator(table.order, table.orderBy),
    filters: currentFilters,
  });

  const admins = [
    ...new Map(
      students?.map((row) => [
        row.student.adminId?.id,
        { value: row.student?.adminId?.id, label: row.student?.adminId?.name },
      ])
    ).values(),
  ];

  // Extract unique teachers from all enrollments
  const teachers: { value: string; label: string }[] = [
    ...new Map(
      students
        .map((r) => r.currentEnrollment?.teacherId)
        .map((t) =>
          t && (t._id ?? (t as any).id) && t.name
            ? { id: String(t._id ?? (t as any).id), name: String(t.name) }
            : null
        )
        .filter((x): x is { id: string; name: string } => x !== null)
        .map((x) => [x.id, { value: x.id, label: x.name }])
    ).values(),
  ];

  const branches: { value: string; label: string }[] = Array.from(
    new Map(
      students
        .filter((row) => row.student.branchId)
        .map((row) => [
          row.student.branchId.id,
          { value: row.student.branchId.id, label: row.student.branchId.name },
        ])
    ).values()
  );

  const dataInPage = rowInPage(dataFiltered, table.page, table.rowsPerPage);

  const canReset = !!currentFilters.name;

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const handleDeleteRow = useCallback(
    async (id: string) => {
      await axios.delete(endpoints.student.delete.replace(':id', id));
      toast.success('تم المسح بنجاح!');

      refetch();

      table.onUpdatePageDeleteRow(dataInPage.length);
    },
    [dataInPage.length, table, refetch]
  );

  const handleDeleteRows = useCallback(() => {
    toast.success('تم المسح بنجاح!');

    refetch();

    table.onUpdatePageDeleteRows(dataInPage.length, dataFiltered.length);
  }, [dataFiltered.length, dataInPage.length, table, refetch]);

  // ------------------------------------------------------
  const getStudentStatusLength = (status: string) =>
    students.filter((item) => item.student.status === status).length;

  const handleFilterStatus = useCallback(
    (event: React.SyntheticEvent, newValue: string) => {
      table.onResetPage();
      updateFilters({ status: newValue });
    },
    [updateFilters, table]
  );

  const TABS = [
    {
      value: 'all',
      label: 'الكل',
      color: 'default',
      count: students.length,
    },
    {
      value: 'pending',
      label: 'بنتظار القبول',
      color: 'warning',
      count: getStudentStatusLength(StudentStatus.PENDING),
    },
    {
      value: 'active',
      label: 'يدرس',
      color: 'success',
      count: getStudentStatusLength(StudentStatus.ACTIVE),
    },
    {
      value: 'dropout',
      label: 'ترك المركز',
      color: 'default',
      count: getStudentStatusLength(StudentStatus.DROPOUT),
    },
    {
      value: 'graduated',
      label: 'تخرج',
      color: 'info',
      count: getStudentStatusLength(StudentStatus.GRADUATED),
    },
    {
      value: 'rejected',
      label: 'مرفوض',
      color: 'error',
      count: getStudentStatusLength(StudentStatus.REJECTED),
    },
  ] as const;

  const renderConfirmDialog = () => (
    <ConfirmDialog
      open={confirmDialog.value}
      onClose={confirmDialog.onFalse}
      title="مسح"
      content={
        <>
          هل تريد حذف <strong> {table.selected.length} </strong> الطالب؟
        </>
      }
      action={
        <Button
          variant="contained"
          color="error"
          onClick={() => {
            handleDeleteRows();
            confirmDialog.onFalse();
          }}
        >
          حذف
        </Button>
      }
    />
  );

  if (studentsLoading) return <LoadingScreen />;
  if (!isAuthorized) return <NotAllowedView />;
  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="الطلاب"
          links={[{ name: 'لوحة التحكم', href: paths.dashboard.root }, { name: 'الطلاب' }]}
          action={
            <Button
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
              onClick={isNew.onTrue}
            >
              طالب جديد
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Card>
          <Tabs
            value={currentFilters.status}
            onChange={handleFilterStatus}
            sx={{
              px: { md: 2.5 },
              boxShadow: `inset 0 -2px 0 0 ${varAlpha(theme.vars.palette.grey['500Channel'], 0.08)}`,
            }}
          >
            {TABS.map((tab) => (
              <Tab
                key={tab.value}
                value={tab.value}
                label={tab.label}
                iconPosition="end"
                icon={
                  <Label
                    variant={
                      ((tab.value === 'all' || tab.value === currentFilters.status) && 'filled') ||
                      'soft'
                    }
                    color={tab.color}
                  >
                    {tab.count}
                  </Label>
                }
              />
            ))}
          </Tabs>

          <StudentTableToolbar
            filters={filters}
            onResetPage={table.onResetPage}
            options={{
              admins,
              teachers,
              branches,
              enrollmentStatus: EnrollmentStatusList,
            }}
          />

          {canReset && (
            <StudentTableFiltersResult
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
                  dataFiltered.map((row) => row.student.id)
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
                      dataFiltered.map((row) => row.student.id)
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
                      <StudentTableRow
                        key={row.student.id}
                        row={row}
                        selected={table.selected.includes(row.student.id)}
                        refetch={refetch}
                        onSelectRow={() => table.onSelectRow(row.student.id)}
                        onDeleteRow={() => handleDeleteRow(row.student.id)}
                        editHref={paths.dashboard.student.details.replace(':id', row.student.id)}
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

      {isNew.value && (
        <StudentQuickEditForm open={isNew.value} onClose={isNew.onFalse} refetch={refetch} />
      )}
      {renderConfirmDialog()}
    </>
  );
}

// ----------------------------------------------------------------------

type ApplyFilterProps = {
  inputData: IEnrollmentWithStudent[];
  filters: IStudentTableFilters;
  comparator: (a: any, b: any) => number;
};

function applyFilter({ inputData, comparator, filters }: ApplyFilterProps) {
  const { name, teacher, branch, admin, status, enrollmentStatus } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (admin.length) {
    inputData = inputData.filter((row) => admin.includes(row.student?.adminId?.id));
  }

  // if (teacher.length) {
  //   inputData = inputData.filter((row) => teacher.includes(`${row.enrollments?.teacherId}`));
  // }

  if (branch.length) {
    inputData = inputData.filter((row) => branch.includes(`${row.student?.branchId?.id}`));
  }

  if (status !== 'all') {
    inputData = inputData.filter((row) => row.student?.status === status);
  }

  if (teacher.length) {
    inputData = inputData.filter((row) =>
      teacher.includes(`${row.currentEnrollment?.teacherId?._id}`)
    );
  }
  if (enrollmentStatus.length) {
    inputData = inputData.filter((row) =>
      enrollmentStatus.includes(`${row.currentEnrollment?.status}`)
    );
  }

  if (name) {
    const search = name.toLowerCase();
    inputData = inputData.filter((row) =>
      row.student.name.toLowerCase().includes(search) ||
      row.student.phone.toLowerCase().includes(search)
    );

  }

  return inputData;
}
