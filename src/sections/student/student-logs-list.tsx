'use client';

import type { IStudentItem } from 'src/types/student';

import { useState, useCallback } from 'react';

import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';

import { fDateTime } from 'src/utils/format-time';

import { useGetStudentLogs } from 'src/actions/student';

import { Scrollbar } from 'src/components/scrollbar';
import { LoadingScreen } from 'src/components/loading-screen';
import {
  TableNoData,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/components/table';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'action', label: 'الإجراء' },
  { id: 'note', label: 'ملاحظة' },
  { id: 'admin', label: 'المسؤول' },
  { id: 'date', label: 'التاريخ' },
];

type Props = {
  student: IStudentItem;
};

export default function StudentLogsList({ student }: Props) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { logs, logsLoading, total } = useGetStudentLogs(student.id, {
    page: page + 1,
    limit: rowsPerPage,
  });

  const handleChangePage = useCallback((_event: unknown, newPage: number) => {
    setPage(newPage);
  }, []);

  const handleChangeRowsPerPage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    },
    []
  );

  if (logsLoading && logs.length === 0) return <LoadingScreen />;

  return (
    <>
      <TableContainer sx={{ overflow: 'unset' }}>
        <Scrollbar>
          <Table sx={{ minWidth: 640 }}>
            <TableHeadCustom headCells={TABLE_HEAD} />

            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>{log.action}</TableCell>
                  <TableCell>{log.note || '—'}</TableCell>
                  <TableCell>{log.adminId?.name || '—'}</TableCell>
                  <TableCell>{fDateTime(log.createdAt)}</TableCell>
                </TableRow>
              ))}

              <TableNoData notFound={!logsLoading && logs.length === 0} />
            </TableBody>
          </Table>
        </Scrollbar>
      </TableContainer>

      <TablePaginationCustom
        count={total}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  );
}
