import type { ICourseRounds } from 'src/types/course';

import {
  Box,
  Stack,
  Button,
  Accordion,
  Typography,
  AccordionDetails,
  AccordionSummary,
} from '@mui/material';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { fDate } from 'src/utils/format-time';

import { Iconify } from 'src/components/iconify';

type Props = {
  rounds: ICourseRounds[];
};

export default function TeacherRounds({ rounds }: Props) {
  return (
    <Stack>
      {rounds?.map((item) => (
        <Accordion key={item.id}>
          <AccordionSummary expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}>
            <Typography variant="subtitle1" sx={{ width: '33%', flexShrink: 0 }}>
              {item.course?.name}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            {/* {item.course?.description} */}

            <Box
              display="grid"
              gap={2}
              gridTemplateColumns={{
                xs: 'repeat(2, 1fr)',
                md: 'repeat(5, 1fr)',
              }}
              alignItems="center"
            >
              {[
                {
                  title: 'الحالة',
                  value: new Date(item.endDate) > new Date() ? 'انتهت' : 'قيد التدريس',
                },
                {
                  title: 'بداية',
                  value: fDate(item.startDate),
                },
                {
                  title: 'الانتهاء',
                  value: fDate(item.endDate),
                },
                {
                  title: 'عدد الطلاب',
                  value: item.enrollments?.length,
                },
              ].map(({ title, value }) => (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, textAlign: 'center' }}>
                  <Box
                    sx={{
                      py: 1,
                      borderRadius: (theme) => theme.shape.borderRadius,
                      bgcolor: (theme) => theme.palette.primary.lighter,
                      fontWeight: 'bold',
                    }}
                  >
                    {title}
                  </Box>
                  <Box>{value}</Box>
                </Box>
              ))}
              <Button
                LinkComponent={RouterLink}
                href={paths.dashboard.course.roundsDetails.replace(':id', item.id.toString())}
                variant="outlined"
                size="large"
                color="primary"
              >
                عرض المزيد
              </Button>
            </Box>
          </AccordionDetails>
        </Accordion>
      ))}
    </Stack>
  );
}
