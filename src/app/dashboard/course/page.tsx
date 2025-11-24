import { CONFIG } from 'src/global-config';

import { CoursesListView } from 'src/sections/course/view';

export const metadata = { title: `المراحل - ${CONFIG.appName}` };

export default function Page() {
  return <CoursesListView />;
}
