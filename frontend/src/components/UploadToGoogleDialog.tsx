import * as React from 'react';
import { connect } from 'react-redux';

import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Button, DialogActions, DialogContent } from '@mui/material';
import { getAppInitialized } from '../selectors';

export interface UploadToGoogleDialogPropsFromParent {
  open: boolean;
  onUploadToGoogle: (albumName: string) => void;
  onClose: () => void;
}

export interface UploadToGoogleDialogProps extends UploadToGoogleDialogPropsFromParent {
  appInitialized: boolean;
}

const UploadToGoogleDialog = (props: UploadToGoogleDialogProps) => {

  const [albumName, setAlbumName] = React.useState('');

  const { open, onClose } = props;

  if (!props.appInitialized) {
    return null;
  }

  if (!open) {
    return null;
  }

  const handleUploadToGoogle = (): void => {
    if (albumName !== '') {
      props.onUploadToGoogle(albumName);
      props.onClose();
    }
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Upload to Google</DialogTitle>
      <DialogContent style={{ paddingBottom: '0px' }}>
        <Box
          component="form"
          noValidate
          autoComplete="off"
        >
          <div>
            <TextField
              style={{ paddingBottom: '8px' }}
              label="Album Name"
              value={albumName}
              onChange={(event) => setAlbumName(event.target.value)}
            />
          </div>
        </Box>
      </DialogContent>
      <DialogActions
      >
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleUploadToGoogle} autoFocus>
          Upload
        </Button>
      </DialogActions>

    </Dialog>
  );
};

function mapStateToProps(state: any) {
  return {
    appInitialized: getAppInitialized(state),
  };
}

export default connect(mapStateToProps)(UploadToGoogleDialog);



