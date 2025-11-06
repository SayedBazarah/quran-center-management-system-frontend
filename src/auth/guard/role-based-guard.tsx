'use client';

import type { Theme, SxProps } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { m } from 'framer-motion';
import { ForbiddenIllustration } from 'src/assets/illustrations';
import { varBounce, MotionContainer } from 'src/components/animate';
import { hasAnyRole } from 'src/utils/has-role';
import { useAuthContext } from '../hooks';

export type RoleBasedGuardProp = {
  sx?: SxProps<Theme>;
  hasContent?: boolean;
  allowedRoles: string | string[];
  children: React.ReactNode;
};

export function RoleBasedGuard({
  sx,
  children,
  hasContent = true,
  allowedRoles,
}: RoleBasedGuardProp) {
  const { user, permissions } = useAuthContext();
  const currentRolePermissions = false;
  const isAllowed = false;

  if (!isAllowed) {
    return hasContent ? (
      <Container
        component={MotionContainer}
        sx={[{ textAlign: 'center' }, ...(Array.isArray(sx) ? sx : [sx])]}
      >
        <m.div variants={varBounce('in')}>
          <Typography variant="h3" sx={{ mb: 2 }}>
            غير مسموح
          </Typography>
        </m.div>
        <m.div variants={varBounce('in')}>
          <Typography sx={{ color: 'text.secondary' }}>
            لا تملك صلاحية الوصول لهذه الصفحة
          </Typography>
        </m.div>
        <m.div variants={varBounce('in')}>
          <ForbiddenIllustration sx={{ my: { xs: 5, sm: 10 } }} />
        </m.div>
      </Container>
    ) : null;
  }

  return <>{children}</>;
}
