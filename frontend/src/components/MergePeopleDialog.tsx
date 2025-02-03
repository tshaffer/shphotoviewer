import * as React from 'react';
import { connect } from 'react-redux';

import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import Box from '@mui/material/Box';

import { getAppInitialized } from '../selectors';
import { Button, DialogActions, DialogContent } from '@mui/material';

export interface MergePeopleDialogPropsFromParent {
  open: boolean;
  onMergePeople: (takeoutFiles: FileList) => void;
  onClose: () => void;
}

export interface MergePeopleDialogProps extends MergePeopleDialogPropsFromParent {
  appInitialized: boolean;
}

const MergePeopleDialog = (props: MergePeopleDialogProps) => {

  const { open, onClose } = props;

  const folderInputRef = React.useRef<HTMLInputElement | null>(null);
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

  const handleFolderSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      console.log('event.target.files', event.target.files);
      setSelectedFiles(event.target.files);
    }
  };

  function handleMerge(): void {
    console.log('Merging People');
    props.onMergePeople(selectedFiles!);
    onClose();
  }

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Merge People</DialogTitle>
      <DialogContent style={{ paddingBottom: '0px' }}>
        <div>
          <Box
            component="form"
            noValidate
            autoComplete="off"
          >
            <input
              type="file"
              webkitdirectory=""
              id="folderInput"
              name="file"
              multiple
              onChange={handleFolderSelect}
              ref={folderInputRef}
              style={{ marginBottom: '1rem' }}
            />
          </Box>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleMerge} autoFocus disabled={!selectedFiles || selectedFiles.length === 0}>
          Merge
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

export default connect(mapStateToProps)(MergePeopleDialog);
