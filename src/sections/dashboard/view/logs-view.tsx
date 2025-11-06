'use client';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';

import { fDateTime } from 'src/utils/format-time';

import { useGetLogs } from 'src/actions/log';
import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

export function LogsView() {
  const { logs } = useGetLogs();
  return (
    <DashboardContent>
      <CustomBreadcrumbs heading="السجلات" sx={{ mb: { xs: 3, md: 5 } }} />
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {logs.map((item, index) => (
          <Card
            key={index}
            variant="outlined"
            sx={{ display: 'flex', flexDirection: 'column', p: 2 }}
          >
            <Box>
              <Typography variant="body1">{item.note}</Typography>
            </Box>
            <Box display="flex" justifyContent="flex-end">
              <Typography variant="caption" color="textDisabled" sx={{ alignSelf: 'flex-end' }}>
                {item.adminId?.name} | {fDateTime(item.createdAt)}
              </Typography>
            </Box>
          </Card>
        ))}
      </Box>
    </DashboardContent>
  );
}
