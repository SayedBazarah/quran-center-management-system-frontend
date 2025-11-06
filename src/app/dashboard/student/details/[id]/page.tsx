import { CONFIG } from 'src/global-config';
import { BlankView } from 'src/sections/blank/view';
import { StudentDetailsView } from 'src/sections/student/view';

// import { StudentDetailsView } from 'src/sections/student/view';

export const metadata = { title: `بيانات الطالب - ${CONFIG.appName}` };
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return <StudentDetailsView id={id} />;
}
