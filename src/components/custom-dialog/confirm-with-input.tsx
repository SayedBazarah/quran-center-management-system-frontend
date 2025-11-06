import { useState, useEffect } from 'react';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import FormHelperText from '@mui/material/FormHelperText';

export type ConfirmWithReasonProps = {
  open: boolean;
  title: React.ReactNode;
  content?: React.ReactNode;
  confirmLabel?: string; // e.g., "تأكيد"
  cancelLabel?: string; // e.g., "الغاء"
  placeholder?: string; // e.g., "أدخل السبب"
  minLength?: number; // e.g., 3
  maxLength?: number; // e.g., 300
  autoFocus?: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
};

export function ConfirmDialogWithReason({
  open,
  title,
  content,
  confirmLabel = 'تأكيد',
  cancelLabel = 'الغاء',
  placeholder = 'أدخل السبب',
  minLength = 1,
  maxLength = 300,
  autoFocus = true,
  onClose,
  onConfirm,
}: ConfirmWithReasonProps) {
  const [reason, setReason] = useState('');
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (open) {
      setReason('');
      setTouched(false);
    }
  }, [open]);

  const trimmed = reason.trim();
  const tooShort = trimmed.length < minLength;
  const tooLong = trimmed.length > maxLength;
  const hasError = touched && (tooShort || tooLong);

  const errorMessage = tooShort
    ? `السبب مطلوب (حد أدنى ${minLength} حرف)`
    : tooLong
      ? `السبب أطول من المسموح (${maxLength})`
      : '';

  const handleConfirm = () => {
    setTouched(true);
    if (!tooShort && !tooLong) {
      onConfirm(trimmed);
    }
  };

  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose}>
      <DialogTitle sx={{ pb: 2 }}>{title}</DialogTitle>

      <DialogContent sx={{ pt: 1 }}>
        {content && <div style={{ marginBottom: 12 }}>{content}</div>}
        <FormControl fullWidth error={hasError} variant="outlined">
          <TextField
            fullWidth
            autoFocus={autoFocus}
            multiline
            minRows={2}
            maxRows={6}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            onBlur={() => setTouched(true)}
            inputProps={{ maxLength }}
            placeholder={placeholder}
            label="السبب"
          />
          {hasError && <FormHelperText>{errorMessage}</FormHelperText>}
          {!hasError && <FormHelperText>{`${trimmed.length}/${maxLength}`}</FormHelperText>}
        </FormControl>
      </DialogContent>

      <DialogActions>
        <Button
          variant="contained"
          color="error"
          onClick={handleConfirm}
          disabled={tooShort || tooLong}
        >
          {confirmLabel}
        </Button>
        <Button variant="outlined" color="inherit" onClick={onClose}>
          {cancelLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
