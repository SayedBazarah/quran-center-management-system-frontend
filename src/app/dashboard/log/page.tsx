import { CONFIG } from 'src/global-config';
import { BlankView } from 'src/sections/blank/view';
import { LogsView } from 'src/sections/dashboard/view/logs-view';

export const metadata = { title: `السجلات - ${CONFIG.appName}` };

export default function Page() {
  return <LogsView />;
}
