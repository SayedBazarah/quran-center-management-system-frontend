'use client';

// ----------------------------------------------------------------------

import type { TableHeadCellProps } from 'src/components/table';
import {
  EnrollmentStatus,
  StudentStatus,
  type IEnrollmentItem,
  type IStudentItem,
  type IStudentTableFilters,
} from 'src/types/student';

import { useCallback } from 'react';
import { useBoolean, useSetState } from 'minimal-shared/hooks';

import {
  Box,
  Card,
  Table,
  Button,
  Tooltip,
  TableBody,
  IconButton,
  Tabs,
  Tab,
  useTheme,
} from '@mui/material';

import { paths } from 'src/routes/paths';

import { useGetPendingEnrollments, useGetStudents } from 'src/actions/student';
import { DashboardContent } from 'src/layouts/dashboard';
import { GlobalPermissionCode } from 'src/global-config';

import { Scrollbar } from 'src/components/scrollbar';
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
  TablePaginationCustom,
} from 'src/components/table';

import { useAuthContext } from 'src/auth/hooks';

import { AcceptEnrollmentTableRow } from '../accept-enrollment-table-row';
import { NotAllowedView } from 'src/components/not-allowed';
import { hasAnyRole } from 'src/utils/has-role';
import axios, { endpoints } from 'src/lib/axios';

const TABLE_HEAD: TableHeadCellProps[] = [
  { id: 'name', label: 'الاسم الطالب' },
  { id: 'createdAt', label: 'بداية المرحلة' },
  { id: 'enrollment', label: 'المرحلة' },
  { id: 'admin', label: 'مشرف المرحلة' },
  { id: 'teacher', label: 'مدرس المرحلة' },
  { id: 'createdBy', label: 'سجل بواسطة' },
  { id: '', width: 88 },
];

// ----------------------------------------------------------------------
export function AcceptNewEnrollmentView() {
  const table = useTable({
    defaultRowsPerPage: 25,
  });
  const { permissions } = useAuthContext();
  const isAuthorized = hasAnyRole(permissions, [GlobalPermissionCode.AcceptStudent]);

  const { enrollments, refetch, enrollmentsLoading } = useGetPendingEnrollments();

  const dataFiltered = applyFilter({
    inputData: enrollments,
    comparator: getComparator(table.order, table.orderBy),
  });

  const dataInPage = rowInPage(dataFiltered, table.page, table.rowsPerPage);

  const notFound = !dataFiltered.length || !dataFiltered.length;

  // ------------------------------------------------------
  const onRejectStudent = useCallback(async (enrollmentId: string, reason: string) => {
    await axios.post(endpoints.student.acceptEnroll.replace(':enrollmentId', enrollmentId), {
      status: EnrollmentStatus.REJECTED,
      reason,
    });
    refetch();
    table.onUpdatePageDeleteRow(dataInPage.length);
  }, []);
  const onAcceptStudent = useCallback(async (enrollmentId: string) => {
    await axios.post(endpoints.student.acceptEnroll.replace(':enrollmentId', enrollmentId), {
      status: EnrollmentStatus.ACTIVE,
    });
    refetch();
  }, []);

  // ------------------------------------------------------

  if (enrollmentsLoading) return <LoadingScreen />;
  if (!isAuthorized) return <NotAllowedView />;
  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="الدورات بنتظار القبول"
          links={[
            { name: 'لوحة التحكم', href: paths.dashboard.root },
            { name: 'الطلاب', href: paths.dashboard.student.root },
            { name: 'الدورات بنتظار القبول' },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Card>
          <Box sx={{ position: 'relative' }}>
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
                      dataFiltered.map((row) => row.id)
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
                      <AcceptEnrollmentTableRow
                        key={row.id}
                        row={row}
                        selected={table.selected.includes(row.id)}
                        onSelectRow={() => table.onSelectRow(row.id)}
                        onAcceptRow={() => onAcceptStudent(row.id)}
                        onRejectRow={(reason: string) => onRejectStudent(row.id, reason)}
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
    </>
  );
}

// ----------------------------------------------------------------------

type ApplyFilterProps = {
  inputData: IEnrollmentItem[];
  // filters: IStudentTableFilters;
  comparator: (a: any, b: any) => number;
};

function applyFilter({ inputData, comparator }: ApplyFilterProps) {
  // const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  // stabilizedThis.sort((a, b) => {
  //   const order = comparator(a[0], b[0]);
  //   if (order !== 0) return order;
  //   return a[1] - b[1];
  // });

  // inputData = stabilizedThis.map((el) => el[0]);

  return inputData;
}
