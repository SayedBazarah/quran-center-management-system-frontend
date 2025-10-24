// ----------------------------------------------------------------------

const ROOTS = {
  AUTH: '/auth',
  DASHBOARD: '/dashboard',
};

// ----------------------------------------------------------------------

export const paths = {
  faqs: '/faqs',
  minimalStore: 'https://mui.com/store/items/minimal-dashboard/',
  // AUTH
  auth: {
    amplify: {
      signIn: `${ROOTS.AUTH}/amplify/sign-in`,
      verify: `${ROOTS.AUTH}/amplify/verify`,
      signUp: `${ROOTS.AUTH}/amplify/sign-up`,
      updatePassword: `${ROOTS.AUTH}/amplify/update-password`,
      resetPassword: `${ROOTS.AUTH}/amplify/reset-password`,
    },
    jwt: {
      signIn: `${ROOTS.AUTH}/jwt/sign-in`,
      signUp: `${ROOTS.AUTH}/jwt/sign-up`,
    },
    firebase: {
      signIn: `${ROOTS.AUTH}/firebase/sign-in`,
      verify: `${ROOTS.AUTH}/firebase/verify`,
      signUp: `${ROOTS.AUTH}/firebase/sign-up`,
      resetPassword: `${ROOTS.AUTH}/firebase/reset-password`,
    },
    auth0: {
      signIn: `${ROOTS.AUTH}/auth0/sign-in`,
    },
    supabase: {
      signIn: `${ROOTS.AUTH}/supabase/sign-in`,
      verify: `${ROOTS.AUTH}/supabase/verify`,
      signUp: `${ROOTS.AUTH}/supabase/sign-up`,
      updatePassword: `${ROOTS.AUTH}/supabase/update-password`,
      resetPassword: `${ROOTS.AUTH}/supabase/reset-password`,
    },
  },
  // DASHBOARD
  dashboard: {
    root: ROOTS.DASHBOARD,
    reports: {
      root: `${ROOTS.DASHBOARD}/reports`,
      finance: `${ROOTS.DASHBOARD}/reports/:id`,
    },
    teacher: {
      root: `${ROOTS.DASHBOARD}/teacher`,
      details: `${ROOTS.DASHBOARD}/teacher/:id`,
    },
    student: {
      root: `${ROOTS.DASHBOARD}/student`,
      details: `${ROOTS.DASHBOARD}/student/:id`,
    },
    course: {
      root: `${ROOTS.DASHBOARD}/course`,
      details: `${ROOTS.DASHBOARD}/course/details/:id`,
      rounds: `${ROOTS.DASHBOARD}/course/round`,
      roundsDetails: `${ROOTS.DASHBOARD}/course/round/:id`,
    },
    admin: {
      root: `${ROOTS.DASHBOARD}/admin`,
      role: `${ROOTS.DASHBOARD}/admin/roles`,
    },
    branch: {
      root: `${ROOTS.DASHBOARD}/branch`,
    },
    two: `${ROOTS.DASHBOARD}/two`,
    group: {
      root: `${ROOTS.DASHBOARD}/group`,
      five: `${ROOTS.DASHBOARD}/group/five`,
      six: `${ROOTS.DASHBOARD}/group/six`,
    },
  },
};
