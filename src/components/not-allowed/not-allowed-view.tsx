import type { Theme, SxProps } from '@mui/material/styles';

import { m } from 'framer-motion';

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { ForbiddenIllustration } from 'src/assets/illustrations';

import { varBounce, MotionContainer } from '../animate';

type Props = {
  sx?: SxProps<Theme>;
};
export function NotAllowedView({ sx }: Props) {
  return (
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
        <Typography sx={{ color: 'text.secondary' }}>لا تملك صلاحية الوصول لهذه الصفحة</Typography>
      </m.div>
      <m.div variants={varBounce('in')}>
        <ForbiddenIllustration sx={{ my: { xs: 5, sm: 10 } }} />
      </m.div>
    </Container>
  );
}
