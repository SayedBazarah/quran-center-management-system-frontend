import { Suspense } from 'react';

import { CONFIG } from 'src/global-config';
import { DashboardContent } from 'src/layouts/dashboard';

import { LoadingScreen } from 'src/components/loading-screen';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { GlobaSystemReportView } from 'src/sections/dashboard/view';
import { DateRangeFilter } from 'src/sections/dashboard/date-range-filter';

// ----------------------------------------------------------------------

export const metadata = { title: `التقارير العامة - ${CONFIG.appName}` };
interface PageProps {
  searchParams: Promise<{ startDate?: string; endDate?: string }>;
}

export default async function Page({ searchParams }: PageProps) {
  // Await searchParams before accessing properties
  const params = await searchParams;
  const now = new Date(); // Current date and time

  const todayDate = new Date();
  todayDate.setHours(0, 0, 0, 0); // Set to 00:00:00.000 todayDate
  const startDate = (params?.startDate && new Date(params?.startDate)) || todayDate;

  const endDate = params?.endDate ? new Date(params?.endDate) : now;

  return (
    <DashboardContent>
      <CustomBreadcrumbs heading="التقارير العامة" action={<DateRangeFilter />} />

      {/* Server Component that re-fetches when searchParams change */}
      <Suspense fallback={<LoadingScreen />}>
        <GlobaSystemReportView startDate={startDate} endDate={endDate} />
      </Suspense>
    </DashboardContent>
  );
}
