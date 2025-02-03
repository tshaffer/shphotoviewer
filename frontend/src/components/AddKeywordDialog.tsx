import * as React from 'react';
import { connect } from 'react-redux';

import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Button, DialogActions, DialogContent, FormControl, InputLabel, MenuItem, OutlinedInput, Select, SelectChangeEvent } from '@mui/material';
import { getAppInitialized, getKeywordNodesByNodeId, getKeywordRootNodeId, getKeywordsAsTree, getKeywordsById } from '../selectors';
import { KeywordTreeDeep, StringToKeywordLUT, StringToKeywordNodeLUT, KeywordNode, Keyword } from '../types';
import { isNil } from 'lodash';

export interface AddKeywordDialogPropsFromParent {
  open: boolean;
  onAddKeyword: (
    keywordLabel: string,
    parentKeywordNodeId: string,
  ) => void;
  onClose: () => void;
}

export interface AddKeywordDialogProps extends AddKeywordDialogPropsFromParent {
  appInitialized: boolean;
  keywordRootNodeId: string;
  keywordsAsTree: KeywordTreeDeep | undefined;
  keywordsById: StringToKeywordLUT;
  keywordNodesByNodeId: StringToKeywordNodeLUT
}

const AddKeywordDialog = (props: AddKeywordDialogProps) => {

  const [parentKeywordNodeId, setParentKeywordNodeId] = React.useState(props.keywordRootNodeId);
  const [keywordLabel, setKeywordLabel] = React.useState('');

  const { open, onClose } = props;

  if (!props.appInitialized) {
    return null;
  }

  if (!open) {
    return null;
  }

  const handleChange = (event: SelectChangeEvent<typeof parentKeywordNodeId>) => {
    setParentKeywordNodeId(event.target.value || '');
  };

  const traverseKeywordTree = (parentNodeId: string, keywordNodes: KeywordNode[]): void => {
    const keywordNode: KeywordNode = props.keywordNodesByNodeId[parentNodeId];
    keywordNodes.push(keywordNode);

    if (!isNil(keywordNode.childrenNodeIds)) {
      keywordNode.childrenNodeIds.forEach((childNodeId: string) => {
        traverseKeywordTree(childNodeId, keywordNodes);
      });
    }
  };

  const getKeywords = (): KeywordNode[]  => {
    const keywordNodes: KeywordNode[] = [];
    const keywordRootNodeId = props.keywordRootNodeId;
    traverseKeywordTree(keywordRootNodeId, keywordNodes);
    return keywordNodes;
  };

  const handleAddNewKeyword = (): void => {
    if (keywordLabel !== '') {
      props.onAddKeyword(keywordLabel, parentKeywordNodeId);
      props.onClose();
    }
  };

  const handleClose = () => {
    onClose();
  };

  const renderKeywordParentNode = (keywordNode: KeywordNode): JSX.Element => {
    const keywordId: string = keywordNode.keywordId;
    const keyword: Keyword = props.keywordsById[keywordId];
    return (
      <MenuItem value={keywordNode.nodeId}>{keyword.label}</MenuItem>
    );
  };

  const renderKeywordParentNodes = (): JSX.Element[] => {
    const keywordNodes = getKeywords();
    const keywordParentNodes: JSX.Element[] = keywordNodes.map((keywordNode: KeywordNode) => {
      return renderKeywordParentNode(keywordNode);
    });
    return keywordParentNodes;
  };

  const keywordParentNodes: JSX.Element[] = renderKeywordParentNodes();

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Add Keyword</DialogTitle>
      <DialogContent style={{ paddingBottom: '0px' }}>
        <Box
          component="form"
          noValidate
          autoComplete="off"
        >
          <div>
            <TextField
              style={{ paddingBottom: '8px' }}
              label="Keyword Label"
              value={keywordLabel}
              onChange={(event) => setKeywordLabel(event.target.value)}
            />
          </div>
          <FormControl sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="demo-dialog-select-label">Parent Node</InputLabel>
            <Select
              labelId="keywordParentLabel"
              id="keywordParentSelect"
              value={parentKeywordNodeId}
              onChange={handleChange}
              input={<OutlinedInput label="Takeout" />}
            >
              {keywordParentNodes}
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions
      >
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleAddNewKeyword} autoFocus>
          Add
        </Button>
      </DialogActions>

    </Dialog>
  );
};

function mapStateToProps(state: any) {
  return {
    appInitialized: getAppInitialized(state),
    keywordRootNodeId: getKeywordRootNodeId(state),
    keywordsAsTree: getKeywordsAsTree(state),
    keywordsById: getKeywordsById(state),
    keywordNodesByNodeId: getKeywordNodesByNodeId(state),
  };
}

export default connect(mapStateToProps)(AddKeywordDialog);



