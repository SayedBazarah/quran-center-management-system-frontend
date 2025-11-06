import { CONFIG } from 'src/global-config';

import { TeacherListView } from 'src/sections/teacher/view';

export const metadata = { title: `المدرسين - ${CONFIG.appName}` };

export default function Page() {
  return <TeacherListView />;
}
