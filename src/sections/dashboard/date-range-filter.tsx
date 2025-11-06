'use client';

import type { Dayjs } from 'dayjs';

import dayjs from 'dayjs';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

import Box from '@mui/material/Box';

import { Form, Field } from 'src/components/hook-form';

export function DateRangeFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Initialize with parsed dates or null
  const initialStartDate = searchParams.get('startDate')
    ? dayjs(searchParams.get('startDate'))
    : null;
  const initialEndDate = searchParams.get('endDate') ? dayjs(searchParams.get('endDate')) : null;

  const [startDate, setStartDate] = useState<Dayjs | null>(initialStartDate);
  const [endDate, setEndDate] = useState<Dayjs | null>(initialEndDate);

  const handleDateChange = (start: Dayjs | null, end: Dayjs | null) => {
    const params = new URLSearchParams(searchParams.toString());

    // Use YYYY-MM-DD format for cleaner URLs
    if (start) {
      params.set('startDate', start.format('YYYY-MM-DD'));
    } else {
      params.delete('startDate');
    }

    if (end) {
      params.set('endDate', end.format('YYYY-MM-DD'));
    } else {
      params.delete('endDate');
    }

    // Update URL and trigger Server Component re-fetch
    router.push(`${pathname}?${params.toString()}`);
  };

  const methods = useForm({
    defaultValues: {
      startDate: initialStartDate,
      endDate: initialEndDate,
    },
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  return (
    <Box
      width={{
        xs: '100%',
        md: 'calc(100% - 320px)',
      }}
      mb={{
        xs: 3,
        md: 0,
      }}
    >
      <Form methods={methods}>
        <Box
          sx={{
            width: '100%',
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
            gap: 2,
          }}
        >
          <Field.DatePicker
            name="startDate"
            label="تاريخ بداية التقرير"
            value={startDate}
            onChange={(newValue: Dayjs | null) => {
              setStartDate(newValue);
              handleDateChange(newValue, endDate);
            }}
          />
          <Field.DatePicker
            name="endDate"
            label="تاريخ انتهاء التقرير"
            value={endDate} // Fixed: was using startDate
            onChange={(newValue: Dayjs | null) => {
              setEndDate(newValue);
              handleDateChange(startDate, newValue);
            }}
          />
        </Box>
      </Form>
    </Box>
  );
}
