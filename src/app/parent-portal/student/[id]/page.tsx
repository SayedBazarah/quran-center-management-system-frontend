import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';

import { ParentPortalStudentView } from 'src/sections/parent-portal';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: `بوابة أولياء الأمور - ${CONFIG.appName}`,
};

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ParentPortalStudentView studentId={id} />;
}
