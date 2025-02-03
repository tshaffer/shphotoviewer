import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Box from '@mui/material/Box';
import { Button } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { TreeView } from '@mui/x-tree-view/TreeView';

import { Keyword, KeywordNodeDeep, KeywordTreeDeep, MediaItem, StringToKeywordLUT, StringToKeywordNodeLUT, StringToStringArrayLUT } from '../types';
import { TedTaggerDispatch, } from '../models';
import { getAppInitialized, getKeywordNodesByNodeId, getKeywordRootNodeId, getKeywordsAsTree, getKeywordsById, getMediaItemById, getSelectedMediaItemIds } from '../selectors';

import AddKeywordDialog from './AddKeywordDialog';
import { addKeyword, addKeywordToMediaItems, updateKeywordAssignedToSelectedMediaItems } from '../controllers';
import { isNil } from 'lodash';
import { KeywordTreeItem } from './KeywordTreeItem';

export interface KeywordsProps {
  appInitialized: boolean;
  keywordRootNodeId: string;
  keywordsAsTree: KeywordTreeDeep | undefined;
  keywordNodesByNodeId: StringToKeywordNodeLUT;
  keywordsById: StringToKeywordLUT;
  selectedMediaItemIds: string[],
  mapKeywordNodeIdToSelectedMediaItemIds: StringToStringArrayLUT,
  mapSelectedMediaItemIdToKeywordNodeIds: StringToStringArrayLUT,
  onAddKeyword: (
    parentNodeId: string,
    keywordLabel: string,
    keywordType: string,
  ) => void;
  onUpdateKeywordAssignedToSelectedMediaItems: (
    keywordNodeId: string,
    selectedMediaItemIds: string[],
    assignKeyword: boolean
  ) => void;
}

const Keywords = (props: KeywordsProps) => {

  const [showAddKeywordDialog, setShowAddKeywordDialog] = React.useState(false);

  if (!props.appInitialized) {
    return null;
  }

  const handleCloseAddKeywordDialog = () => {
    setShowAddKeywordDialog(false);
  };

  const handleAddKeyword = (keywordLabel: string, parentKeywordNodeId: string): void => {
    props.onAddKeyword(parentKeywordNodeId, keywordLabel, 'user');
  };

  function handleUpdateKeywordAssignedToSelectedMediaItems(keywordNodeId: string, assignKeyword: boolean) {
    console.log('handleToggleAssignKeywordToSelectedMediaItems', keywordNodeId, assignKeyword);
    props.onUpdateKeywordAssignedToSelectedMediaItems(keywordNodeId, props.selectedMediaItemIds, assignKeyword);
  }

  const renderTreeViewItems = (keywordNode: KeywordNodeDeep): JSX.Element => {

    if (keywordNode.childNodes.length === 0) {
      const keyword: Keyword = props.keywordsById[keywordNode.keywordId];
      const keywordLabel: string = keyword.label;

      return (
        <KeywordTreeItem
          key={keywordNode.nodeId}
          nodeId={keywordNode.nodeId}
          keywordsAsTree={props.keywordsAsTree}
          keywordNodesByNodeId={props.keywordNodesByNodeId}
          label={keywordLabel}
          onUpdateKeywordAssignedToSelectedMediaItems={(assignKeyword: boolean) => { handleUpdateKeywordAssignedToSelectedMediaItems(keywordNode.nodeId, assignKeyword); }}
          selectedMediaItemIds={props.selectedMediaItemIds}
          mapKeywordNodeIdToSelectedMediaItemIds={props.mapKeywordNodeIdToSelectedMediaItemIds}
        />
      );
    }
    const keywordNodes = keywordNode.childNodes.map((childNode: KeywordNodeDeep) => {
      return renderTreeViewItems(childNode);
    });

    return (
      <KeywordTreeItem
        key={keywordNode.nodeId}
        nodeId={keywordNode.nodeId}
        keywordsAsTree={props.keywordsAsTree}
        keywordNodesByNodeId={props.keywordNodesByNodeId}
        label={props.keywordsById[keywordNode.keywordId].label}
        onUpdateKeywordAssignedToSelectedMediaItems={(assignKeyword: boolean) => { handleUpdateKeywordAssignedToSelectedMediaItems(keywordNode.nodeId, assignKeyword); }}
        selectedMediaItemIds={props.selectedMediaItemIds}
        mapKeywordNodeIdToSelectedMediaItemIds={props.mapKeywordNodeIdToSelectedMediaItemIds}
      >
        {keywordNodes}
      </KeywordTreeItem>
    );
  };

  const renderTreeViewContents = (): JSX.Element => {
    const treeViewItems: JSX.Element = renderTreeViewItems(props.keywordsAsTree!.root);
    return (
      <div>
        <Button onClick={() => setShowAddKeywordDialog(true)}>Add Keyword</Button>
        <TreeView
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpandIcon={<ChevronRightIcon />}
        >
          {treeViewItems}
        </TreeView>
      </div >
    );
  };

  const treeViewContents: JSX.Element = renderTreeViewContents();

  return (
    <Box sx={{ minHeight: 180, flexGrow: 1, maxWidth: 300 }}>
      <AddKeywordDialog
        open={showAddKeywordDialog}
        onAddKeyword={handleAddKeyword}
        onClose={handleCloseAddKeywordDialog}
      />
      {treeViewContents}
    </Box>
  );
};

const generatePropData = (state: any): any => {

  // required mappings
  //    for each keywordNodeId,
  //        mediaItems (ids) that include this keyword
  //            map keywordNodeId to array of mediaItemIds
  //    for each selectedMediaItem(id)
  //        list of keywords associated with this media item
  //            map mediaItemId to array of keywordNodeIds

  const mapKeywordNodeIdToSelectedMediaItemIds: StringToStringArrayLUT = {};
  const mapSelectedMediaItemIdToKeywordNodeIds: StringToStringArrayLUT = {};

  if (getAppInitialized(state)) {
    const keywordNodesByNodeId: StringToKeywordNodeLUT = getKeywordNodesByNodeId(state);
    const selectedMediaItemIds: string[] = getSelectedMediaItemIds(state);


    for (const keywordNodeId in keywordNodesByNodeId) {
      for (const selectedMediaItemId of selectedMediaItemIds) {
        const selectedMediaItem: MediaItem | null = getMediaItemById(state, selectedMediaItemId);
        if (!isNil(selectedMediaItem) && !isNil(selectedMediaItem.keywordNodeIds)) {
          const keywordNodeIdsForSelectedMediaItem: string[] = selectedMediaItem.keywordNodeIds;
          if (keywordNodeIdsForSelectedMediaItem.includes(keywordNodeId)) {
            if (Object.prototype.hasOwnProperty.call(mapKeywordNodeIdToSelectedMediaItemIds, keywordNodeId)) {
              mapKeywordNodeIdToSelectedMediaItemIds[keywordNodeId].push(selectedMediaItemId);
            } else {
              mapKeywordNodeIdToSelectedMediaItemIds[keywordNodeId] = [selectedMediaItemId];
            }
          }
        }
      }
    }

    for (const selectedMediaItemId of selectedMediaItemIds) {
      const selectedMediaItem: MediaItem | null = getMediaItemById(state, selectedMediaItemId);
      if (!isNil(selectedMediaItem) && !isNil(selectedMediaItem.keywordNodeIds)) {
        const keywordNodeIdsForSelectedMediaItem: string[] = selectedMediaItem.keywordNodeIds;
        for (const keywordNodeId in keywordNodesByNodeId) {
          if (keywordNodeIdsForSelectedMediaItem.includes(keywordNodeId)) {
            if (Object.prototype.hasOwnProperty.call(mapSelectedMediaItemIdToKeywordNodeIds, keywordNodeId)) {
              mapSelectedMediaItemIdToKeywordNodeIds[selectedMediaItemId].push(keywordNodeId);
            } else {
              mapSelectedMediaItemIdToKeywordNodeIds[selectedMediaItemId] = [keywordNodeId];
            }
          }
        }
      }
    }

    // console.log('generatePropData');
    // console.log(mapKeywordNodeIdToSelectedMediaItemIds);
    // console.log(mapSelectedMediaItemIdToKeywordNodeIds);
  }

  return {
    mapKeywordNodeIdToSelectedMediaItemIds,
    mapSelectedMediaItemIdToKeywordNodeIds,
  };
};

function mapStateToProps(state: any) {

  const { mapKeywordNodeIdToSelectedMediaItemIds, mapSelectedMediaItemIdToKeywordNodeIds } = generatePropData(state);
  return {
    appInitialized: getAppInitialized(state),
    keywordRootNodeId: getKeywordRootNodeId(state),
    keywordsAsTree: getKeywordsAsTree(state),
    keywordNodesByNodeId: getKeywordNodesByNodeId(state),
    keywordsById: getKeywordsById(state),
    selectedMediaItemIds: getSelectedMediaItemIds(state),
    mapKeywordNodeIdToSelectedMediaItemIds,
    mapSelectedMediaItemIdToKeywordNodeIds
  };
}

const mapDispatchToProps = (dispatch: TedTaggerDispatch) => {
  return bindActionCreators({
    onAddKeyword: addKeyword,
    onUpdateKeywordAssignedToSelectedMediaItems: updateKeywordAssignedToSelectedMediaItems
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Keywords);

