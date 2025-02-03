import * as React from 'react';
import { connect } from 'react-redux';

import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import Box from '@mui/material/Box';

import { getAppInitialized } from '../selectors';
import { Button, DialogActions, DialogContent } from '@mui/material';

export interface ImportFromDriveDialogPropsFromParent {
  open: boolean;
  onImportFromDrive: (files: FileList) => void;
  onClose: () => void;
}

export interface ImportFromDriveDialogProps extends ImportFromDriveDialogPropsFromParent {
  appInitialized: boolean;
}

const ImportFromDriveDialog = (props: ImportFromDriveDialogProps) => {

  const { open, onClose } = props;

  const [selectedFiles, setSelectedFiles] = React.useState<FileList | null>(null);

  if (!props.appInitialized) {
    return null;
  }

  if (!open) {
    return null;
  }

  const handleClose = () => {
    onClose();
  };

  const handleImportFilesSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFiles(event.target.files);
      // setError(null); // Reset error message when new folder is selected
      // setSuccessMessage(null); // Reset success message
    }
  };

  function handleImport(): void {
    console.log('Importing');
    props.onImportFromDrive(selectedFiles!);
    onClose();
  }

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Import</DialogTitle>
      <DialogContent style={{ paddingBottom: '0px' }}>
        <div>
          <Box
            component="form"
            noValidate
            autoComplete="off"
          >
            <input
              type="file"
              accept=".jpg,.heic,image/jpeg,image/heic"
              onChange={handleImportFilesSelect}
              id="importFilesInput"
              name="file"
              multiple
              style={{ marginBottom: '1rem' }}
            />
          </Box>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleImport} autoFocus disabled={!selectedFiles || selectedFiles.length === 0}>
          Import
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

export default connect(mapStateToProps)(ImportFromDriveDialog);
