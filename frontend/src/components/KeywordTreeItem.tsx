import * as React from 'react';

import { isNil } from 'lodash';

import clsx from 'clsx';

import { TreeItem } from '@mui/x-tree-view/TreeItem';
import Typography from '@mui/material/Typography';
import {
  useTreeItem,
  TreeItemContentProps,
} from '@mui/x-tree-view/TreeItem';
import Checkbox from '@mui/material/Checkbox';

import { KeywordAssignedToSelectedMediaItemsStatus, KeywordNode, KeywordTreeDeep, StringToKeywordNodeLUT, StringToStringArrayLUT } from '../types';

interface KeywordTreeItemProps extends TreeItemContentProps {
  selectedMediaItemIds: string[];
  keywordsAsTree: KeywordTreeDeep | undefined;
  keywordNodesByNodeId: StringToKeywordNodeLUT
  onUpdateKeywordAssignedToSelectedMediaItems: (assignKeyword: boolean) => void;
  mapKeywordNodeIdToSelectedMediaItemIds: StringToStringArrayLUT;
}

const CustomContent = React.forwardRef(function CustomContent(
  props: KeywordTreeItemProps,
  ref,
) {
  const {
    classes,
    className,
    label,
    nodeId,
    icon: iconProp,
    expansionIcon,
    displayIcon,
    mapKeywordNodeIdToSelectedMediaItemIds,
    selectedMediaItemIds,
    onUpdateKeywordAssignedToSelectedMediaItems,
  } = props;

  const {
    disabled,
    expanded,
    selected,
    focused,
    handleExpansion,
    handleSelection,
    preventSelection,
  } = useTreeItem(nodeId);

  const icon = iconProp || expansionIcon || displayIcon;

  const getIsDisabled = (): boolean => {
    return isNil(selectedMediaItemIds) || selectedMediaItemIds.length === 0;
  };

  const getKeywordAssignedToSelectedMediaItemsStatus = (inputNodeId: string): KeywordAssignedToSelectedMediaItemsStatus => {

    if (selectedMediaItemIds.length === 0) {
      return KeywordAssignedToSelectedMediaItemsStatus.NoSelectedMediaItemsIncludeThisKeyword;
    }

    if (Object.prototype.hasOwnProperty.call(mapKeywordNodeIdToSelectedMediaItemIds, inputNodeId)) {
      // the keyword associated with inputNodeId is assigned to one or more of the selected photos
      // get all the selected media item ids that include this keyword
      const selectedMediaItemIdsThatIncludeThisKeyword: string[] = mapKeywordNodeIdToSelectedMediaItemIds[inputNodeId];
      if (selectedMediaItemIdsThatIncludeThisKeyword.length === 0) {
        // if there are none, then the code should not have reached this point
        debugger;
      } else if (selectedMediaItemIdsThatIncludeThisKeyword.length === selectedMediaItemIds.length) {
        // if the number of selected media items that include this keyword is the same as the number of selected media items, then all selected media items include this keyword
        return KeywordAssignedToSelectedMediaItemsStatus.AllSelectedMediaItemsIncludeThisKeyword;
      } else {
        // if the number of selected media items that include this keyword is not the same as the number of selected media items, then some of the selected media items include this keyword
        return KeywordAssignedToSelectedMediaItemsStatus.SomeSelectedMediaItemsIncludeThisKeyword;
      }
    } else {
      // keyword associated with inputNodeId is not assigned to any of the selected photos
      // recursively search children of inputNodeId; as soon as one is found that is assigned to any of the selected photos, return SomeSelectedMediaItemsIncludeThisKeyword 
      const keywordNodesByNodeId = props.keywordNodesByNodeId;
      if (Object.prototype.hasOwnProperty.call(keywordNodesByNodeId, inputNodeId)) {
        const keywordNode: KeywordNode = keywordNodesByNodeId[inputNodeId];
        if (!isNil(keywordNode.childrenNodeIds)) {
          for (const childNodeId of keywordNode.childrenNodeIds) {
            const keywordAssignedToSelectedMediaItemsStatus: KeywordAssignedToSelectedMediaItemsStatus = getKeywordAssignedToSelectedMediaItemsStatus(childNodeId);
            if (keywordAssignedToSelectedMediaItemsStatus !== KeywordAssignedToSelectedMediaItemsStatus.NoSelectedMediaItemsIncludeThisKeyword) {
              // childNodeId is assigned to at least one of the selected media items' children
              return KeywordAssignedToSelectedMediaItemsStatus.SomeSelectedMediaItemsIncludeThisKeyword;
            } 
          }
          return KeywordAssignedToSelectedMediaItemsStatus.NoSelectedMediaItemsIncludeThisKeyword;
        }
      } else {
        debugger;
      }
    }
    // the keyword associated with nodeId is not assigned to any of the selected photos
    return KeywordAssignedToSelectedMediaItemsStatus.NoSelectedMediaItemsIncludeThisKeyword;
  };


  // props.nodeId is the keywordNodeId
  const getPropKeywordAssignedToSelectedMediaItemsStatus = (): KeywordAssignedToSelectedMediaItemsStatus => {
    // is the keyword associated with nodeId assigned to any of the selected photos?
    if (Object.prototype.hasOwnProperty.call(mapKeywordNodeIdToSelectedMediaItemIds, nodeId)) {
      // get all the selected media item ids that include this keyword
      const selectedMediaItemIdsThatIncludeThisKeyword: string[] = mapKeywordNodeIdToSelectedMediaItemIds[nodeId];
      if (selectedMediaItemIdsThatIncludeThisKeyword.length === 0) {
        // if there are none, then the code should not have reached this point
        debugger;
      } else if (selectedMediaItemIdsThatIncludeThisKeyword.length === selectedMediaItemIds.length) {
        // if the number of selected media items that include this keyword is the same as the number of selected media items, then all selected media items include this keyword
        return KeywordAssignedToSelectedMediaItemsStatus.AllSelectedMediaItemsIncludeThisKeyword;
      } else {
        // if the number of selected media items that include this keyword is not the same as the number of selected media items, then some of the selected media items include this keyword
        return KeywordAssignedToSelectedMediaItemsStatus.SomeSelectedMediaItemsIncludeThisKeyword;
      }
    }
    // the keyword associated with nodeId is not assigned to any of the selected photos
    return KeywordAssignedToSelectedMediaItemsStatus.NoSelectedMediaItemsIncludeThisKeyword;
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    preventSelection(event);
  };

  const handleExpansionClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    handleExpansion(event);
  };

  const handleSelectionClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    handleSelection(event);
  };


  // the result of clicking has nothing to do with the current state of any of the child keywords.
  const handleClickKeywordAssign = () => {
    const keywordAssignedToSelectedMediaItemsStatus: KeywordAssignedToSelectedMediaItemsStatus = getPropKeywordAssignedToSelectedMediaItemsStatus();
    if (keywordAssignedToSelectedMediaItemsStatus === KeywordAssignedToSelectedMediaItemsStatus.AllSelectedMediaItemsIncludeThisKeyword) {
      console.log('all selected media items include this keyword: unassign keyword from all selected media items');
      onUpdateKeywordAssignedToSelectedMediaItems(false);
    } else if (keywordAssignedToSelectedMediaItemsStatus === KeywordAssignedToSelectedMediaItemsStatus.NoSelectedMediaItemsIncludeThisKeyword) {
      console.log('no selected media items include this keyword: assign keyword to all selected media items');
      onUpdateKeywordAssignedToSelectedMediaItems(true);
    } else {
      console.log('some selected media items include this keyword: assign keyword to all selected media items');
      onUpdateKeywordAssignedToSelectedMediaItems(true);
    }
  };

  // const isChecked = getIsChecked();
  const isDisabled = getIsDisabled();
  const keywordAssignedToSelectedMediaItemsStatus: KeywordAssignedToSelectedMediaItemsStatus = getKeywordAssignedToSelectedMediaItemsStatus(props.nodeId);

  return (
    <div
      className={clsx(className, classes.root, {
        [classes.expanded]: expanded,
        [classes.selected]: selected,
        [classes.focused]: focused,
        [classes.disabled]: disabled,
      })}
      onMouseDown={handleMouseDown}
      ref={ref as React.Ref<HTMLDivElement>}
    >
      <div onClick={handleExpansionClick} className={classes.iconContainer}>
        {icon}
      </div>
      <Typography
        onClick={handleSelectionClick}
        component="div"
        className={classes.label}
      >
        {label}
      </Typography>
      <Checkbox
        checked={keywordAssignedToSelectedMediaItemsStatus === KeywordAssignedToSelectedMediaItemsStatus.AllSelectedMediaItemsIncludeThisKeyword}
        onChange={handleClickKeywordAssign}
        disabled={isDisabled}
        indeterminate={keywordAssignedToSelectedMediaItemsStatus === KeywordAssignedToSelectedMediaItemsStatus.SomeSelectedMediaItemsIncludeThisKeyword}
      />
    </div>
  );
});

export const KeywordTreeItem = React.forwardRef(function KeywordTreeItem(
  // props: TreeItemProps,
  // props: KeywordTreeItemProps,
  props: any,
  ref: React.Ref<HTMLLIElement>,
) {
  return <TreeItem
    ContentComponent={CustomContent}
    ContentProps={{
      onUpdateKeywordAssignedToSelectedMediaItems: (assignKeyword: boolean) => props.onUpdateKeywordAssignedToSelectedMediaItems(assignKeyword),
      selectedMediaItemIds: props.selectedMediaItemIds,
      keywordsAsTree: props.keywordsAsTree,
      keywordNodesByNodeId: props.keywordNodesByNodeId,
      mapKeywordNodeIdToSelectedMediaItemIds: props.mapKeywordNodeIdToSelectedMediaItemIds,
    }}
    {...props}
    ref={ref}
  />;
});

