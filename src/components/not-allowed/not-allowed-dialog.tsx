import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';

type Props = {
  title: string;
  open: boolean;
  onClose: () => void;
};
export function NotAllowedDialog({ title, open, onClose }: Props) {
  return (
    <Dialog
      fullWidth
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: { maxWidth: 720 },
        },
      }}
    >
      <DialogTitle>اشعار</DialogTitle>
      <DialogContent
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 2,
        }}
      >
        <Typography variant="h4" color="error">
          {(title && title) || 'لم يتم السماح برؤية المحتوى'}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={onClose}>
          إغلاق
        </Button>
      </DialogActions>
    </Dialog>
  );
}
