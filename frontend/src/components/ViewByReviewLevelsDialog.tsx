import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import Box from '@mui/material/Box';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

import { getAppInitialized } from '../selectors';
import { Button, DialogActions, DialogContent } from '@mui/material';

import { ReviewLevel } from '../types';
import { loadMediaItemsByReviewLevels } from '../controllers';

export interface ViewByReviewsLevelDialogPropsFromParent {
  open: boolean;
  onClose: () => void;
}

export interface ViewByReviewsLevelDialogProps extends ViewByReviewsLevelDialogPropsFromParent {
  appInitialized: boolean;
  onLoadMediaItemsByReviewLevels: (reviewLevels: ReviewLevel[]) => void;
}

const reviewLevels = [
  { key: 'Unreviewed', value: ReviewLevel.Unreviewed },
  { key: 'Ready For Review', value: ReviewLevel.ReadyForReview },
  { key: 'Ready For Upload', value: ReviewLevel.ReadyForUpload },
  { key: 'Uploaded To Google', value: ReviewLevel.UploadedToGoogle },
];

const ViewByReviewsLevelDialog = (props: ViewByReviewsLevelDialogProps) => {
  const { open, onClose } = props;

  const [selectedReviewLevels, setSelectedReviewLevels] = React.useState<ReviewLevel[]>([]);

  if (!props.appInitialized) {
    return null;
  }

  if (!open) {
    return null;
  }

  const handleClose = () => {
    onClose();
  };

  const handleViewByReviewLevels = () => {
    props.onLoadMediaItemsByReviewLevels(selectedReviewLevels);
    onClose();
  };

  const handleCheckboxChange = (level: ReviewLevel) => (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedReviewLevels((prev) => [...prev, level]);
    } else {
      setSelectedReviewLevels((prev) => prev.filter((l) => l !== level));
    }
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Review Levels</DialogTitle>
      <DialogContent style={{ paddingBottom: '0px' }}>
        <Box component="form" noValidate autoComplete="off">
          <FormGroup>
            {reviewLevels.map(({ key, value }) => (
              <FormControlLabel
                key={value}
                control={
                  <Checkbox
                    checked={selectedReviewLevels.includes(value)}
                    onChange={handleCheckboxChange(value)}
                  />
                }
                label={key}
              />
            ))}
          </FormGroup>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleViewByReviewLevels} autoFocus>
          OK
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

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({
    onLoadMediaItemsByReviewLevels: loadMediaItemsByReviewLevels,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(ViewByReviewsLevelDialog);
