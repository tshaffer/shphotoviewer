import React, { useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { TedTaggerDispatch } from '../models';
import { ListItemText } from '@mui/material';

export interface EditableTextLabelProps {
  text: string;
  onBlur: (text: string) => void;
}

const EditableTextLabel = (props: EditableTextLabelProps) => {

  const [isEditing, setEditing] = useState(false);
  const [value, setValue] = useState(props.text);

  const handleDoubleClick = () => {
    setEditing(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleBlur = () => {
    setEditing(false);
    props.onBlur(value);
  };

  return (
    <div>
      {isEditing ? (
        <input
          type="props.text"
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          autoFocus
          width="80px"
        />
      ) : (
        <ListItemText style={{ paddingLeft: '6px', width: '80px' }} primary={props.text} onDoubleClick={handleDoubleClick} />
      )}
    </div>
  );
};

function mapStateToProps(state: any) {
  return {
  };
}

const mapDispatchToProps = (dispatch: TedTaggerDispatch) => {
  return bindActionCreators({
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(EditableTextLabel);

