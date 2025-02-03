import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import List from '@mui/material/List';
import { getDeletedMediaItems } from '../selectors';
import { Dialog, DialogTitle, DialogContent, Box, DialogActions, Button, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';

import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import { MediaItem } from '../types';
import { clearDeletedMediaItems, removeDeletedMediaItem } from '../controllers';
import { cloneDeep } from 'lodash';

export interface DeletedMediaItemsDialogPropsFromParent {
  open: boolean;
  onClose: () => void;
}

export interface DeletedMediaItemsDialogProps extends DeletedMediaItemsDialogPropsFromParent {
  deletedMediaItems: MediaItem[];
  onClearDeletedMediaItems: () => void;
  onRemoveDeletedMediaItem: (mediaItemId: string) => void;
}

const DeletedMediaItemsDialog = (props: DeletedMediaItemsDialogProps) => {

  const { open, onClose, onClearDeletedMediaItems, onRemoveDeletedMediaItem } = props;

  const handleClose = () => {
    onClose();
  };

  const handleClearAll = () => {
    onClearDeletedMediaItems();
    onClose();
  };

  const handleRemoveDeletedMediaItem = (uniqueId: string) => {
    console.log('handleRemoveDeletedMediaItem: ', uniqueId);
    onRemoveDeletedMediaItem(uniqueId);
  };

  const deletedMediaItems = cloneDeep(props.deletedMediaItems);
  deletedMediaItems.sort((a: MediaItem, b: MediaItem) => {
    if (a.fileName < b.fileName) {
      return -1;
    }
    if (a.fileName > b.fileName) {
      return 1;
    }
    return 0;
  });

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Deleted Media Items</DialogTitle>
      <DialogContent style={{ paddingBottom: '0px' }}>
        <div>
          <Box
            component="form"
            noValidate
            autoComplete="off"
          >
            <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
              {deletedMediaItems.map((mediaItem: MediaItem) => {
                const labelId = `checkbox-list-label-${mediaItem.fileName}`;
                return (
                  <ListItem
                    key={mediaItem.uniqueId}
                  // disablePadding
                  >
                    <ListItemButton role={undefined} onClick={() => { handleRemoveDeletedMediaItem(mediaItem.uniqueId); }} dense>
                      <ListItemIcon>
                        <RemoveCircleIcon />
                      </ListItemIcon>
                      <ListItemText id={labelId} primary={mediaItem.fileName} />
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </Box>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClearAll}>Clear All</Button>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

function mapStateToProps(state: any) {
  return {
    deletedMediaItems: getDeletedMediaItems(state),
  };
}

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({
    onRemoveDeletedMediaItem: removeDeletedMediaItem,
    onClearDeletedMediaItems: clearDeletedMediaItems,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(DeletedMediaItemsDialog);


