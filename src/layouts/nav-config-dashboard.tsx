import type { NavSectionProps } from 'src/components/nav-section';

import { paths } from 'src/routes/paths';

import { CONFIG } from 'src/global-config';

import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor src={`${CONFIG.assetsDir}/assets/icons/navbar/${name}.svg`} />
);

const ICONS = {
  job: icon('ic-job'),
  blog: icon('ic-blog'),
  chat: icon('ic-chat'),
  mail: icon('ic-mail'),
  user: icon('ic-user'),
  file: icon('ic-file'),
  lock: icon('ic-lock'),
  tour: icon('ic-tour'),
  order: icon('ic-order'),
  label: icon('ic-label'),
  blank: icon('ic-blank'),
  kanban: icon('ic-kanban'),
  folder: icon('ic-folder'),
  course: icon('ic-course'),
  banking: icon('ic-banking'),
  booking: icon('ic-booking'),
  invoice: icon('ic-invoice'),
  product: icon('ic-product'),
  calendar: icon('ic-calendar'),
  disabled: icon('ic-disabled'),
  external: icon('ic-external'),
  menuItem: icon('ic-menu-item'),
  ecommerce: icon('ic-ecommerce'),
  analytics: icon('ic-analytics'),
  dashboard: icon('ic-dashboard'),
  parameter: icon('ic-parameter'),
};

// ----------------------------------------------------------------------

export const navData: NavSectionProps['data'] = [
  /**
   * Overview
   */
  {
    subheader: 'تقارير',
    items: [
      { title: 'لوحة التحكم', path: paths.dashboard.root, icon: ICONS.ecommerce },
      { title: 'التقارير', path: paths.dashboard.reports.root, icon: ICONS.ecommerce },
      { title: 'السجلات', path: paths.dashboard.reports.logs, icon: ICONS.ecommerce },
    ],
  },
  {
    subheader: 'ادارة الطلاب والمدرسين',
    items: [
      { title: 'الطلاب', path: paths.dashboard.student.root, icon: ICONS.ecommerce },
      {
        title: 'قبول دفعة',
        path: paths.dashboard.student.acceptStudents,
        icon: ICONS.ecommerce,
      },
      {
        title: 'تصعيدات',
        path: paths.dashboard.student.acceptEnrollment,
        icon: ICONS.ecommerce,
      },
      { title: 'المعلمين', path: paths.dashboard.teacher.root, icon: ICONS.job },
      {
        title: 'المراحل',
        path: paths.dashboard.course.root,
        icon: ICONS.course,
      },
    ],
  },
  /**
   * Management
   */
  {
    subheader: 'المسئولين والادوار',
    items: [
      {
        title: 'المشرفين',
        path: paths.dashboard.admin.root,
        icon: ICONS.user,
      },
      {
        title: 'الوظائف',
        path: paths.dashboard.admin.role,
        icon: ICONS.user,
      },
      {
        title: ' الفروع',
        path: paths.dashboard.branch.root,
        icon: ICONS.external,
      },
    ],
  },
];
