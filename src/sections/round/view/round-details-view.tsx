'use client';

import { useBoolean } from 'minimal-shared/hooks';
import { usePathname, useSearchParams } from 'next/navigation';

import { Box, Tab, Card, Tabs, Button, useTheme } from '@mui/material';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useGetRoundeById } from 'src/actions/round';
import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { LoadingScreen } from 'src/components/loading-screen';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import RoundDetails from '../round-details';
import RoundStudents from '../round-student';
import { AddStudents } from '../round-new-student';

type Props = {
  id: string;
};

// ----------------------------------------------------------------------

const NAV_ITEMS = [
  {
    value: '',
    label: 'نظرة عامة',
    icon: <Iconify width={24} icon="solar:user-id-bold" />,
  },
  {
    value: 'students',
    label: 'الطلاب',
    icon: <Iconify width={24} icon="solar:user-plus-bold" />,
  },
];

// ----------------------------------------------------------------------

const TAB_PARAM = 'tab';

export function RoundDetailsView({ id }: Props) {
  const addStudent = useBoolean();
  const { round, roundLoading, refetch } = useGetRoundeById(id);
  console.log('round', { round });
  const theme = useTheme();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const selectedTab = searchParams.get(TAB_PARAM) ?? '';

  const createRedirectPath = (currentPath: string, query: string) => {
    const queryString = new URLSearchParams({ [TAB_PARAM]: query }).toString();
    return query ? `${currentPath}?${queryString}` : currentPath;
  };

  if (roundLoading || !round) return <LoadingScreen />;
  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="ملف المجموعة"
          links={[
            { name: 'لوحة التحكم', href: paths.dashboard.root },
            { name: 'المجاميع', href: paths.dashboard.student.root },
            { name: round?.course?.name },
          ]}
          action={
            <Button
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
              onClick={addStudent.onTrue}
            >
              اصافة طالب للمجموعة
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />
        <Card sx={{ p: 3 }}>
          <Box
            sx={{
              width: 1,
              bottom: 0,
              zIndex: 9,
              px: { md: 2 },
              mb: 3,
              bgcolor: 'background.paper',
              borderBottom: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Tabs value={selectedTab}>
              {NAV_ITEMS.map((tab) => (
                <Tab
                  component={RouterLink}
                  key={tab.value}
                  value={tab.value}
                  icon={tab.icon}
                  label={tab.label}
                  href={createRedirectPath(pathname, tab.value)}
                />
              ))}
            </Tabs>
          </Box>

          {selectedTab === '' && <RoundDetails round={round} />}
          {selectedTab === 'students' && <RoundStudents round={round} />}
        </Card>
      </DashboardContent>
      {addStudent.value && (
        <AddStudents
          roundId={round.id}
          open={addStudent.value}
          onClose={addStudent.onFalse}
          refetch={refetch}
        />
      )}
    </>
  );
}
