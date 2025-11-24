import { CONFIG } from 'src/global-config';

import BranchesListView from 'src/sections/branch/view/branches-list-view';

// ----------------------------------------------------------------------

export const metadata = { title: `الفروع - ${CONFIG.appName}` };

export default function Page() {
  return <BranchesListView />;
}
