import { CONFIG } from 'src/global-config';

import { AdminListView } from 'src/sections/admin/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <AdminListView />;
}
