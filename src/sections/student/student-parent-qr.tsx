'use client';

import { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type Props = {
  studentId: string;
  studentName: string;
};

export default function StudentParentQR({ studentId, studentName }: Props) {
  const qrRef = useRef<HTMLDivElement>(null);

  const portalUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/parent-portal/student/${studentId}`
      : `/parent-portal/student/${studentId}`;

  const handlePrint = () => {
    if (!qrRef.current) return;
    const svgEl = qrRef.current.querySelector('svg');
    if (!svgEl) return;

    const svgData = new XMLSerializer().serializeToString(svgEl);
    const win = window.open('', '_blank');
    if (!win) return;

    win.document.write(`
      <!DOCTYPE html>
      <html dir="rtl">
        <head>
          <title>QR Code - ${studentName}</title>
          <style>
            body { display:flex; flex-direction:column; align-items:center; justify-content:center; min-height:100vh; margin:0; font-family:sans-serif; }
            h2 { margin-bottom: 8px; }
            p { color:#666; margin:0 0 16px; font-size:13px; }
            svg { width:240px; height:240px; }
          </style>
        </head>
        <body>
          <h2>${studentName}</h2>
          <p>امسح الرمز لعرض تقدم الطالب</p>
          ${svgData}
        </body>
      </html>
    `);
    win.document.close();
    win.focus();
    win.print();
    win.close();
  };

  return (
    <Stack spacing={3} alignItems="center" sx={{ py: 4 }}>
      <Box>
        <Typography variant="h6" textAlign="center" gutterBottom>
          رمز QR لولي الأمر
        </Typography>
        <Typography variant="body2" color="text.secondary" textAlign="center">
          امسح الرمز لعرض دورات الطالب وحالته بدون الحاجة لتسجيل الدخول
        </Typography>
      </Box>

      <Box
        ref={qrRef}
        sx={{
          p: 3,
          border: (theme) => `1px solid ${theme.palette.divider}`,
          borderRadius: 2,
          bgcolor: 'background.paper',
        }}
      >
        <QRCodeSVG
          value={portalUrl}
          size={220}
          level="M"
          includeMargin
        />
      </Box>

      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ wordBreak: 'break-all', maxWidth: 360, textAlign: 'center', direction: 'ltr' }}
      >
        {portalUrl}
      </Typography>

      <Divider sx={{ width: '100%', maxWidth: 400 }} />

      <Button
        variant="outlined"
        startIcon={<Iconify icon="solar:printer-bold" />}
        onClick={handlePrint}
      >
        طباعة رمز QR
      </Button>
    </Stack>
  );
}
