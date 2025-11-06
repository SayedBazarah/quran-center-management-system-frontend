'use client';

import { usePathname, useSearchParams } from 'next/navigation';

import { Box, Tab, Card, Tabs, useTheme } from '@mui/material';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { LoadingScreen } from 'src/components/loading-screen';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import TeacherDetails from '../teacher-details';

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
    value: 'rounds',
    label: 'الدورات',
    icon: <Iconify width={24} icon="solar:chat-round-dots-bold" />,
  },
];

// ----------------------------------------------------------------------

const TAB_PARAM = 'tab';

export function TeacherDetailsView({ id }: Props) {
  // const { teacher, teacherLoading } = useGetTeacherById(id);
  const theme = useTheme();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const selectedTab = searchParams.get(TAB_PARAM) ?? '';

  const createRedirectPath = (currentPath: string, query: string) => {
    const queryString = new URLSearchParams({ [TAB_PARAM]: query }).toString();
    return query ? `${currentPath}?${queryString}` : currentPath;
  };

  // if (teacherLoading) return <LoadingScreen />;
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="ملف المدرس"
        links={[
          { name: 'لوحة التحكم', href: paths.dashboard.root },
          { name: 'المدرسين', href: paths.dashboard.student.root },
          // { name: teacher.name },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      {/* <Card sx={{ p: 3 }}>
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

        {selectedTab === '' && <TeacherDetails teacher={teacher} />}
      </Card> */}
      {/* {selectedTab === 'rounds' && <TeacherRounds rounds={teacher.courseRounds} />} */}
    </DashboardContent>
  );
}
