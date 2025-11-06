import { CONFIG } from 'src/global-config';

import {
  AcceptNewEnrollmentView,
} from 'src/sections/student/view';

export const metadata = { title: ` ${CONFIG.appName} | الطلاب` };

export default function Page() {
  return <AcceptNewEnrollmentView />;
}
