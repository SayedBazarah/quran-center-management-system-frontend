import type { ICourseRounds } from 'src/types/course';

import { Stack } from '@mui/material';

import { Scrollbar } from 'src/components/scrollbar';

type Props = {
  round: ICourseRounds;
};

export default function RoundStudents({ round }: Props) {
  return (
    <Scrollbar>
      <Stack spacing={2}>
        {round.enrollments?.map((item) => (
          <Stack
            key={item.id}
            direction="row"
            justifyContent="space-between"
            sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}`, pb: 1.5 }}
          >
            {/* <Box>{item.student?.name}</Box> */}
            {/* <Box display="flex" gap={1}>
              <Button variant="outlined" size="small" color="error">
                الغاء التسجيل بالدورة
              </Button>
              <Button
                LinkComponent={RouterLink}
                href={paths.dashboard.student.details.replace(':id', `${item.student?.id}`)}
                variant="contained"
                size="small"
                color="primary"
              >
                عرض بيانات الطالب
              </Button>
            </Box> */}
          </Stack>
        ))}
      </Stack>
    </Scrollbar>
  );
}
