'use client';

import type { CardProps } from '@mui/material/Card';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';

// ----------------------------------------------------------------------

type Props = CardProps & {
  title?: string;
  subheader?: string;
  data: {
    label: string;
    totalAmount: number;
  }[];
};

export function EnrollmentsOverview({ title, subheader, data, sx, ...other }: Props) {
  return (
    <Card sx={sx} {...other}>
      <CardHeader title={title} subheader={subheader} />

      <Box
        sx={{
          gap: 4,
          px: 3,
          py: 4,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {data.map((progress) => (
          <Item key={progress.label} progress={progress} />
        ))}
      </Box>
    </Card>
  );
}

// ----------------------------------------------------------------------

type ItemProps = {
  progress: Props['data'][number];
};

function Item({ progress }: ItemProps) {
  return (
    <div>
      <Box
        sx={{
          mb: 1,
          gap: 0.5,
          display: 'flex',
          alignItems: 'center',
          typography: 'subtitle2',
        }}
      >
        <Box component="span" sx={{ flexGrow: 1 }}>
          {progress.label}
        </Box>

        <Box component="span">{progress.totalAmount || 0}</Box>
      </Box>
    </div>
  );
}
