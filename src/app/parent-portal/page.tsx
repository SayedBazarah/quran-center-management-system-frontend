import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';

import { ParentPortalView } from 'src/sections/parent-portal';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: `بوابة أولياء الأمور - ${CONFIG.appName}`,
};

export default function Page() {
  return <ParentPortalView />;
}
