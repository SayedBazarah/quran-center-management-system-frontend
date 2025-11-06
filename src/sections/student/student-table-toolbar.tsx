import type { SelectChangeEvent } from '@mui/material';
import type { UseSetStateReturn } from 'minimal-shared/hooks';
import type { IStudentTableFilters } from 'src/types/student';

import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import { Select, MenuItem, InputLabel, FormControl, OutlinedInput } from '@mui/material';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type Props = {
  onResetPage: () => void;
  filters: UseSetStateReturn<IStudentTableFilters>;
  options: {
    admins: { value: string; label: string }[];
    teachers: { value: string; label: string }[];
    branches: { value: string; label: string }[];
    enrollmentStatus: { value: string; label: string }[];
  };
};

export function StudentTableToolbar({ filters, options, onResetPage }: Props) {
  const { state: currentFilters, setState: updateFilters } = filters;
  const [admin, setAdmin] = useState(currentFilters.admin);
  const [teacher, setTeacher] = useState(currentFilters.teacher);
  const [branch, setBranch] = useState(currentFilters.branch);
  const [enrollmentStatus, setEnrollmentStatus] = useState(currentFilters.enrollmentStatus);

  const handleFilterName = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onResetPage();
      updateFilters({ name: event.target.value });
    },
    [onResetPage, updateFilters]
  );

  const handleChangeEnrollmentStatus = useCallback((event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event;

    setEnrollmentStatus(typeof value === 'string' ? value.split(',') : value);
  }, []);

  const handleFilterEnrollmentStatus = useCallback(() => {
    updateFilters({ enrollmentStatus });
  }, [updateFilters, enrollmentStatus]);

  const handleChangeBranch = useCallback((event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event;

    setBranch(typeof value === 'string' ? value.split(',') : value);
  }, []);

  const handleFilterBranch = useCallback(() => {
    updateFilters({ branch });
  }, [updateFilters, branch]);

  const handleChangeAdmin = useCallback((event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event;

    setAdmin(typeof value === 'string' ? value.split(',') : value);
  }, []);

  const handleFilterAdmin = useCallback(() => {
    updateFilters({ admin });
  }, [updateFilters, admin]);

  const handleChangeTeacher = useCallback((event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event;

    setTeacher(typeof value === 'string' ? value.split(',') : value);
  }, []);

  const handleFilterTeacher = useCallback(() => {
    updateFilters({ teacher });
  }, [updateFilters, teacher]);

  return (
    <Box
      sx={{
        p: 2.5,
        gap: 2,
        display: 'grid',
        pr: { xs: 2.5, md: 1 },
        gridTemplateColumns: { xs: 'repeat(1,1fr)', sm: '2fr 1fr', md: '3fr 1fr' },
      }}
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: 'repeat(1,1fr)', sm: 'repeat(2,1fr)', lg: 'repeat(4,1fr)' },
          gap: 1,
        }}
      >
        <FormControl sx={{ width: { xs: 1 } }}>
          <InputLabel htmlFor="filter-role-select">المشرف</InputLabel>
          <Select
            multiple
            value={admin}
            onChange={handleChangeAdmin}
            onClose={handleFilterAdmin}
            input={<OutlinedInput label="المسئول" />}
            inputProps={{ id: 'filter-stock-select' }}
            sx={{ textTransform: 'capitalize' }}
          >
            {options.admins.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ width: { xs: 1 } }}>
          <InputLabel htmlFor="filter-role-select">المدرس</InputLabel>
          <Select
            multiple
            value={teacher}
            onChange={handleChangeTeacher}
            onClose={handleFilterTeacher}
            input={<OutlinedInput label="المعلم" />}
            inputProps={{ id: 'filter-stock-select' }}
            sx={{ textTransform: 'capitalize' }}
          >
            {options.teachers.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ width: { xs: 1 } }}>
          <InputLabel htmlFor="filter-role-select">الفرع</InputLabel>
          <Select
            multiple
            value={branch}
            onChange={handleChangeBranch}
            onClose={handleFilterBranch}
            input={<OutlinedInput label="الفرع" />}
            inputProps={{ id: 'filter-stock-select' }}
            sx={{ textTransform: 'capitalize' }}
          >
            {options.branches.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ width: { xs: 1 } }}>
          <InputLabel htmlFor="filter-role-select">حالة المرحلة</InputLabel>
          <Select
            multiple
            value={enrollmentStatus}
            onChange={handleChangeEnrollmentStatus}
            onClose={handleFilterEnrollmentStatus}
            input={<OutlinedInput label="الفرع" />}
            inputProps={{ id: 'filter-stock-select' }}
            sx={{ textTransform: 'capitalize' }}
          >
            {options.enrollmentStatus.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Box
        sx={{
          gap: 2,
          width: 1,
          flexGrow: 1,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <TextField
          fullWidth
          value={currentFilters.name}
          onChange={handleFilterName}
          placeholder="بحث..."
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
            },
          }}
        />
      </Box>
    </Box>
  );
}
