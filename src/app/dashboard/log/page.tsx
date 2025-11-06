import { CONFIG } from 'src/global-config';

import { LogsView } from 'src/sections/dashboard/view/logs-view';

export const metadata = { title: `السجلات - ${CONFIG.appName}` };

export default function Page() {
  return <LogsView />;
}
