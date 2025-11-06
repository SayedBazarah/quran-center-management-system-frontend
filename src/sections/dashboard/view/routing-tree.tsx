'use client';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';

import { useAuthContext } from 'src/auth/hooks';

export function RoutingTreeView() {
  const { user } = useAuthContext();
  return (
    <DashboardContent>
      <Card
        elevation={2}
        sx={{
          borderRadius: 3,
          overflow: 'hidden',
          bgcolor: 'background.paper',
        }}
      >
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          <Stack spacing={1.5}>
            <Typography variant="h6">اهلا بعودتك، {user?.name}</Typography>
            <Divider sx={{ my: 1 }} />

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
                gap: 1.5,
              }}
            >
              <Button
                href={paths.dashboard.student.root}
                variant="contained"
                color="inherit"
                startIcon={<Iconify icon="solar:user-id-bold" />}
                aria-label="Go to dashboard"
                sx={{ justifyContent: 'flex-start', py: 1.25 }}
              >
                الطلاب
              </Button>
              <Button
                href={paths.dashboard.teacher.root}
                variant="contained"
                color="info"
                startIcon={<Iconify icon="solar:user-id-bold" />}
                aria-label="Go to dashboard"
                sx={{ justifyContent: 'flex-start', py: 1.25 }}
              >
                المدرسين
              </Button>
              <Button
                href={paths.dashboard.student.acceptStudents}
                variant="contained"
                color="warning"
                startIcon={<Iconify icon="solar:user-id-bold" />}
                aria-label="Go to dashboard"
                sx={{ justifyContent: 'flex-start', py: 1.25 }}
              >
                قبول الطلاب
              </Button>
              <Button
                href={paths.dashboard.student.acceptEnrollment}
                variant="contained"
                color="secondary"
                startIcon={<Iconify icon="solar:user-id-bold" />}
                aria-label="Go to dashboard"
                sx={{ justifyContent: 'flex-start', py: 1.25 }}
              >
                قبول الدورات
              </Button>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </DashboardContent>
  );
}
