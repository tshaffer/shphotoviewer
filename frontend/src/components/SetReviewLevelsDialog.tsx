import { connect } from 'react-redux';

import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import Box from '@mui/material/Box';

import { getAppInitialized, getSelectedMediaItems } from '../selectors';
import { Button, DialogActions, DialogContent, MenuItem, Select, SelectChangeEvent } from '@mui/material';

import { MediaItem, ReviewLevel } from '../types';
import React from 'react';

export interface SetReviewLevelsDialogPropsFromParent {
  open: boolean;
  onSetReviewLevel: (reviewLevel: ReviewLevel) => void;
  onClose: () => void;
}

export interface SetReviewLevelsDialogProps extends SetReviewLevelsDialogPropsFromParent {
  selectedMediaItems: MediaItem[],
  appInitialized: boolean;
}

const SetReviewLevelsDialog = (props: SetReviewLevelsDialogProps) => {

  const { open, onClose } = props;

  const [reviewLevel, setReviewLevel] = React.useState<ReviewLevel>(ReviewLevel.Unreviewed);

  React.useEffect(() => {
    console.log('SetReviewLevelsDialog useEffect');
    console.log(props.selectedMediaItems);

    if (props.selectedMediaItems.length > 0) {
      let reviewLevel: ReviewLevel = props.selectedMediaItems[0].reviewLevel;
      if (props.selectedMediaItems.length > 1) {
        for (let i = 1; i < props.selectedMediaItems.length; i++) {
          if (reviewLevel !== props.selectedMediaItems[i].reviewLevel) {
            reviewLevel = ReviewLevel.Mixed;
            break;
          }
        }
      }
      setReviewLevel(reviewLevel);
    }
  }, [props.selectedMediaItems.length]);

  if (!props.appInitialized) {
    return null;
  }

  if (!open) {
    return null;
  }


  const handleClose = () => {
    onClose();
  };

  function handleChange(event: SelectChangeEvent<typeof reviewLevel>): void {
    setReviewLevel(event.target.value as ReviewLevel);
  }

  function handleSetReviewLevel(): void {
    props.onSetReviewLevel(reviewLevel);
    onClose();
  }

  const renderSelect = (): JSX.Element => {
    const reviewLevelOptions = [
      { value: "unreviewed", label: "Unreviewed" },
      { value: "readyForReview", label: "Ready for Review" },
      { value: "readyForUpload", label: "Ready for Upload" },
      { value: "uploadedToGoogle", label: "Uploaded to Google" },
    ];
    return (
      <Select
        value={reviewLevel}
        onChange={handleChange}
      >
        {reviewLevel === "mixed" && (
          <MenuItem value="mixed">- Select a Review Level -</MenuItem>
        )}
        {reviewLevelOptions.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    );
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Import from Takeout</DialogTitle>
      <DialogContent style={{ paddingBottom: '0px' }}>
        <Box
          component="form"
          noValidate
          autoComplete="off"
        >
          {renderSelect()}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSetReviewLevel} autoFocus disabled={reviewLevel==='mixed'}>OK</Button>
      </DialogActions>
    </Dialog>
  );
};

function mapStateToProps(state: any) {
  return {
    appInitialized: getAppInitialized(state),
    selectedMediaItems: getSelectedMediaItems(state),
  };
}

export default connect(mapStateToProps)(SetReviewLevelsDialog);
