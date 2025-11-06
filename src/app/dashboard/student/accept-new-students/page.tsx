import { CONFIG } from 'src/global-config';

import { AcceptNewStudentsView } from 'src/sections/student/view';

export const metadata = { title: ` ${CONFIG.appName} | الطلاب` };

export default function Page() {
  return <AcceptNewStudentsView />;
}
