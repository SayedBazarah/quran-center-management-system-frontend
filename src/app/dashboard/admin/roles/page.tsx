import { CONFIG } from 'src/global-config';

import { RolesListView } from 'src/sections/role/view';

// ----------------------------------------------------------------------

export const metadata = { title: `الوظائف - ${CONFIG.appName}` };

export default function Page() {
  return <RolesListView />;
}
