import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import Box from '@mui/material/Box';

import { TableRow, TableCell, Table, TableBody, TableContainer } from '@mui/material';

import { getAppInitialized, getKeywordNodeIdToKeywordLUT, getKeywordRootNodeId, getMatchRule, getSearchRules } from '../selectors';
import { Button, DialogActions, DialogContent, FormControl, InputLabel, MenuItem, OutlinedInput, Paper, Select, SelectChangeEvent } from '@mui/material';
import { DateSearchRule, DateSearchRuleType, KeywordSearchRule, KeywordSearchRuleType, MatchRule, SearchRule, SearchRuleType, StringToKeywordLUT } from '../types';

import AddIcon from '@mui/icons-material/Add';
import { addSearchRule, updateSearchRule } from '../models';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import dayjs, { Dayjs } from 'dayjs';
import { isNil } from 'lodash';
import { loadMediaItemsFromSearchSpec } from '../controllers';

export interface SearchSpecDialogPropsFromParent {
  open: boolean;
  onClose: () => void;
}

export interface SearchSpecDialogProps extends SearchSpecDialogPropsFromParent {
  appInitialized: boolean;
  rootNodeId: string;
  matchRule: MatchRule;
  searchRules: SearchRule[];
  keywordNodeIdToKeywordLUT: StringToKeywordLUT;
  onAddSearchRule: (searchRule: SearchRule) => any;
  onUpdateSearchRule: (searchRuleIndex: number, searchRule: SearchRule) => any;
  onLoadMediaItemsFromSearchSpec: () => any;
}

const SearchSpecDialog = (props: SearchSpecDialogProps) => {

  const [matchRule, setMatchRule] = React.useState('all');

  const { open, onClose } = props;

  if (!props.appInitialized) {
    return null;
  }

  if (!open) {
    return null;
  }

  const getSearchRuleType = (searchRuleIndex: number): SearchRuleType => {
    const searchRules: SearchRule[] = props.searchRules;
    const searchRule: SearchRule = searchRules[searchRuleIndex];
    return searchRule.searchRuleType;
  };

  const getDateSearchRuleType = (searchRuleIndex: number): DateSearchRuleType => {
    const searchRules: SearchRule[] = props.searchRules;
    const searchRule: SearchRule = searchRules[searchRuleIndex];
    const dateSearchRule: DateSearchRule = searchRule.searchRule as DateSearchRule;
    return dateSearchRule.dateSearchRuleType;
  };

  const getKeywordSearchRuleType = (searchRuleIndex: number): KeywordSearchRuleType => {
    const searchRules: SearchRule[] = props.searchRules;
    const searchRule: SearchRule = searchRules[searchRuleIndex];
    const keywordSearchRule: KeywordSearchRule = searchRule.searchRule as KeywordSearchRule;
    return keywordSearchRule.keywordSearchRuleType;
  };

  const getKeywordNodeId = (searchRuleIndex: number): string => {
    const searchRules: SearchRule[] = props.searchRules;
    const searchRule: SearchRule = searchRules[searchRuleIndex];
    const keywordSearchRule: KeywordSearchRule = searchRule.searchRule as KeywordSearchRule;
    return keywordSearchRule.keywordNodeId!;
  };

  const handleClose = () => {
    onClose();
  };

  function handleAddRow(): void {
    const newSearchRule: SearchRule = {
      searchRuleType: SearchRuleType.Date,
      searchRule: {
        dateSearchRuleType: DateSearchRuleType.IsBefore,
        date: new Date().toISOString(),
      }
    };
    props.onAddSearchRule(newSearchRule);
  }

  const handleChangeMatchRule = (event: SelectChangeEvent<string>, child: React.ReactNode): void => {
    setMatchRule(event.target.value || 'all');
  };

  const handleChangeSearchRuleType = (searchRuleIndex: number, event: SelectChangeEvent<string>): void => {

    switch (event.target.value) {
      case SearchRuleType.Keyword: {
        const newSearchRule: SearchRule = {
          searchRuleType: SearchRuleType.Keyword,
          searchRule: {
            keywordSearchRuleType: KeywordSearchRuleType.Contains,
            keywordNodeId: props.rootNodeId,
          }
        };
        props.onUpdateSearchRule(searchRuleIndex, newSearchRule);
        break;
      }
      case SearchRuleType.Date: {
        const newSearchRule: SearchRule = {
          searchRuleType: SearchRuleType.Date,
          searchRule: {
            dateSearchRuleType: DateSearchRuleType.IsBefore,
            date: new Date().toISOString(),
          }
        };
        props.onUpdateSearchRule(searchRuleIndex, newSearchRule);
        break;
      }
      default:
        debugger;
    }

  };

  const handleChangeDateSearchRuleType = (searchRuleIndex: number, event: SelectChangeEvent<string>): void => {

    const searchRules: SearchRule[] = props.searchRules;
    const searchRule: SearchRule = searchRules[searchRuleIndex];
    const dateSearchRule: DateSearchRule = searchRule.searchRule as DateSearchRule;

    dateSearchRule.dateSearchRuleType = event.target.value as DateSearchRuleType;

    props.onUpdateSearchRule(searchRuleIndex, searchRule);
  };

  const handleChangeKeywordSearchRuleType = (searchRuleIndex: number, event: SelectChangeEvent<string>): void => {

    const searchRules: SearchRule[] = props.searchRules;
    const searchRule: SearchRule = searchRules[searchRuleIndex];
    const keywordSearchRule: KeywordSearchRule = searchRule.searchRule as KeywordSearchRule;

    keywordSearchRule.keywordSearchRuleType = event.target.value as KeywordSearchRuleType;

    props.onUpdateSearchRule(searchRuleIndex, searchRule);
  };

  const handleSetDate = (searchRuleIndex: number, dateDayJs: Dayjs | null) => {
    if (!isNil(dateDayJs)) {
      const date: Date = dateDayJs.toDate();
      const searchRules: SearchRule[] = props.searchRules;
      const searchRule: SearchRule = searchRules[searchRuleIndex];
      const dateSearchRule: DateSearchRule = searchRule.searchRule as DateSearchRule;
      dateSearchRule.date = date.toISOString();
      props.onUpdateSearchRule(searchRuleIndex, searchRule);
    }
  };

  const handleSetOptionalDate = (searchRuleIndex: number, dateDayJs: Dayjs | null) => {
    if (!isNil(dateDayJs)) {
      const date: Date = dateDayJs.toDate();
      const searchRules: SearchRule[] = props.searchRules;
      const searchRule: SearchRule = searchRules[searchRuleIndex];
      const dateSearchRule: DateSearchRule = searchRule.searchRule as DateSearchRule;
      dateSearchRule.date2 = date.toISOString();
      props.onUpdateSearchRule(searchRuleIndex, searchRule);
    }
  };

  const renderMandatoryDateInput = (rowIndex: number, searchRule: SearchRule): JSX.Element => {
    const searchRuleRule: DateSearchRule = searchRule.searchRule as DateSearchRule;
    return (
      <React.Fragment>
        <FormControl style={{ marginLeft: '6px', display: 'block' }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={['DatePicker']}>
              <DatePicker
                label="Date"
                value={dayjs(searchRuleRule.date)}
                onChange={(newValue) => handleSetDate(rowIndex, newValue)}
              />
            </DemoContainer>
          </LocalizationProvider>
        </FormControl>
      </React.Fragment>
    );
  };

  const renderOptionalDateInput = (rowIndex: number, searchRule: SearchRule): JSX.Element => {
    const searchRuleRule: DateSearchRule = searchRule.searchRule as DateSearchRule;
    return (
      <React.Fragment>
        <FormControl style={{ marginLeft: '6px', display: 'block' }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={['DatePicker']}>
              <DatePicker
                label="Date"
                value={dayjs(searchRuleRule.date2)}
                onChange={(newValue) => handleSetOptionalDate(rowIndex, newValue)}
              />
            </DemoContainer>
          </LocalizationProvider>
        </FormControl>
      </React.Fragment>
    );
  };

  const renderDateInputs = (rowIndex: number, searchRule: SearchRule): JSX.Element => {
    const mandatoryDateInput: JSX.Element = renderMandatoryDateInput(rowIndex, searchRule);

    const searchRuleRule: DateSearchRule = searchRule.searchRule as DateSearchRule;
    if (searchRuleRule.dateSearchRuleType !== DateSearchRuleType.IsInTheRange) {
      return mandatoryDateInput;
    } else {
      const optionalDateInput: JSX.Element = renderOptionalDateInput(rowIndex, searchRule);
      return (
        <React.Fragment>
          {mandatoryDateInput}
          {optionalDateInput}
        </React.Fragment>
      );
    }
  };

  const renderDateRow = (rowIndex: number, searchRule: SearchRule): JSX.Element => {

    const searchRuleTypeSelect = renderSearchRuleTypeFragment(rowIndex);
    const dateSearchRuleType: DateSearchRuleType = getDateSearchRuleType(rowIndex);
    const dateInputs: JSX.Element = renderDateInputs(rowIndex, searchRule);

    return (
      <TableRow>
        {searchRuleTypeSelect}
        <TableCell>
          <Select
            labelId="dateSearchRuleTypeLabel"
            id="dateSearchRuleTypeSelect"
            value={dateSearchRuleType}
            onChange={(event) => handleChangeDateSearchRuleType(rowIndex, event)}
            input={<OutlinedInput label="Rule Type" />}
          >
            <MenuItem value={DateSearchRuleType.IsInTheRange}>is in the range</MenuItem>
            <MenuItem value={DateSearchRuleType.IsBefore}>is before</MenuItem>
            <MenuItem value={DateSearchRuleType.IsAfter}>is after</MenuItem>
          </Select>
        </TableCell>
        <TableCell>
          {dateInputs}
        </TableCell>

      </TableRow>
    );
  };

  const renderKeywordMenuItem = (keywordNodeId: string): JSX.Element => {
    return (
      <MenuItem
        key={keywordNodeId}
        value={keywordNodeId}
      >
        {props.keywordNodeIdToKeywordLUT[keywordNodeId].label}
      </MenuItem>
    );
  };

  const renderKeywordMenuItems = (): JSX.Element[] => {
    const keywordMenuItems: JSX.Element[] = Object.keys(props.keywordNodeIdToKeywordLUT).map((keywordNodeId: string) => {
      return renderKeywordMenuItem(keywordNodeId);
    });
    return keywordMenuItems;
  };

  function handleChangeKeyword(rowIndex: number, event: SelectChangeEvent<string>): void {
    const newSearchRule: SearchRule = {
      searchRuleType: SearchRuleType.Keyword,
      searchRule: {
        keywordSearchRuleType: KeywordSearchRuleType.Contains,
        keywordNodeId: event.target.value,
      }
    };
    props.onUpdateSearchRule(rowIndex, newSearchRule);
  }

  const handleSearch = () => {
    // onGenerateGroceryList(props.startDate, props.numberOfMealsInGroceryList, props.showStaples);
    props.onLoadMediaItemsFromSearchSpec();
    onClose();
  };

  const renderKeywordSelect = (rowIndex: number): JSX.Element => {
    const keywordNodeId: string = getKeywordNodeId(rowIndex);
    const keywordMenuItems: JSX.Element[] = renderKeywordMenuItems();
    return (
      <Select
        labelId="keywordSelectLabel"
        id="keywordSelect"
        value={keywordNodeId}
        onChange={(event) => handleChangeKeyword(rowIndex, event)}
        input={<OutlinedInput label="Keyword" />}
      >
        {keywordMenuItems}
      </Select>
    );
  };

  const renderKeywordInputs = (rowIndex: number, searchRule: SearchRule): JSX.Element | null => {
    const searchRuleRule: KeywordSearchRule = searchRule.searchRule as KeywordSearchRule;
    if (searchRuleRule.keywordSearchRuleType === KeywordSearchRuleType.AreEmpty || searchRuleRule.keywordSearchRuleType === KeywordSearchRuleType.AreNotEmpty) {
      return null;
    } else {
      const keywordSelect: JSX.Element = renderKeywordSelect(rowIndex);
      return (
        <React.Fragment>
          {keywordSelect}
        </React.Fragment>
      );
    }
  };

  const renderKeywordRow = (rowIndex: number, searchRule: SearchRule): JSX.Element => {

    const searchRuleTypeSelect = renderSearchRuleTypeFragment(rowIndex);
    const keywordSearchRuleType: KeywordSearchRuleType = getKeywordSearchRuleType(rowIndex);
    const keywordInputs: JSX.Element | null = renderKeywordInputs(rowIndex, searchRule);

    return (
      <TableRow>
        {searchRuleTypeSelect}
        <TableCell>
          <Select
            labelId="keywordSearchRuleTypeLabel"
            id="keywordSearchRuleTypeSelect"
            value={keywordSearchRuleType}
            onChange={(event) => handleChangeKeywordSearchRuleType(rowIndex, event)}
            input={<OutlinedInput label="Rule Type" />}
          >
            <MenuItem value={KeywordSearchRuleType.Contains}>contains</MenuItem>
            <MenuItem value={KeywordSearchRuleType.AreEmpty}>are empty</MenuItem>
            <MenuItem value={KeywordSearchRuleType.AreNotEmpty}>are not empty</MenuItem>
          </Select>
        </TableCell>
        <TableCell>
          {keywordInputs}
        </TableCell>
      </TableRow>
    );
  };

  const renderSearchRuleTypeFragment = (rowIndex: number): JSX.Element => {
    return (
      <TableCell>
        <Select
          labelId="searchRuleTypeLabel"
          id="searchRuleTypeSelect"
          value={getSearchRuleType(rowIndex)}
          onChange={(event) => handleChangeSearchRuleType(rowIndex, event)}
          input={<OutlinedInput label="Rule Type" />}
        >
          <MenuItem value={SearchRuleType.Keyword}>Keyword</MenuItem>
          <MenuItem value={SearchRuleType.Date}>Date</MenuItem>
        </Select>
      </TableCell>
    )
  };

  const renderRow = (rowIndex: number, searchRule: SearchRule): JSX.Element => {

    let rowJsx: JSX.Element;
    switch (searchRule.searchRuleType) {
      case SearchRuleType.Keyword:
        rowJsx = renderKeywordRow(rowIndex, searchRule);
        break;
      case SearchRuleType.Date:
      default:
        rowJsx = renderDateRow(rowIndex, searchRule);
    }

    return (
      <div>
        {rowJsx}
      </div>
    );
  };

  const renderRows = (): JSX.Element[] => {
    const rows: JSX.Element[] = props.searchRules.map((searchRule: SearchRule, index: number) => {
      return renderRow(index, searchRule);
    });
    return rows;
  };

  const rows: JSX.Element[] = renderRows();

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Search</DialogTitle>
      <DialogContent style={{ paddingBottom: '0px' }}>
        <div>
          <Box
            component="form"
            noValidate
            autoComplete="off"
          >
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <InputLabel id="demo-dialog-select-label">Match rules:</InputLabel>
              <Select
                labelId="matchRuleLabel"
                id="matchRuleLabelSelect"
                value={matchRule}
                onChange={handleChangeMatchRule}
                input={<OutlinedInput label="Parent Keyword" />}
              >
                <MenuItem value={'all'}>all</MenuItem>
                <MenuItem value={'any'}>any</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box sx={{ width: '100%' }}>
            <Paper sx={{ width: '100%', mb: 2 }}>
              <div>
                <Button color="primary" startIcon={<AddIcon />} onClick={handleAddRow}>
                  Add rule
                </Button>
              </div>
              <TableContainer>
                <Table
                  sx={{ minWidth: 800 }}
                  size={'small'}
                >
                  <TableBody>
                    {rows}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Box>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSearch} autoFocus>
          Search
        </Button>
      </DialogActions>
    </Dialog>
  );
};

function mapStateToProps(state: any) {
  return {
    appInitialized: getAppInitialized(state),
    matchRule: getMatchRule(state),
    searchRules: getSearchRules(state),
    keywordNodeIdToKeywordLUT: getKeywordNodeIdToKeywordLUT(state),
    rootNodeId: getKeywordRootNodeId(state),
  };
}

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({
    onAddSearchRule: addSearchRule,
    onUpdateSearchRule: updateSearchRule,
    onLoadMediaItemsFromSearchSpec: loadMediaItemsFromSearchSpec,

  }, dispatch);
};


export default connect(mapStateToProps, mapDispatchToProps)(SearchSpecDialog);


