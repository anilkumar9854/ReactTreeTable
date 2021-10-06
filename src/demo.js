import React, { useState, useEffect } from 'react';
import Paper from '@material-ui/core/Paper';
import './table.css';
import {
  SelectionState,
  IntegratedSelection,PagingState,IntegratedPaging,
  TreeDataState,EditingState,
  CustomTreeData,
} from '@devexpress/dx-react-grid';
import {
  Grid,
  Table,
  TableHeaderRow,
  TableTreeColumn,
  TableSelection,
  PagingPanel,
  TableEditRow, TableInlineCellEditing,TableEditColumn,
} from '@devexpress/dx-react-grid-material-ui';



import {
  generateRows,
  defaultColumnValues,
} from './demo-data/generator';

import {apiData} from './gettingData';

const getChildRows = (row, rootRows) => {
  const childRows = rootRows.filter(r => r.parentId === (row ? row.id : null));
  return childRows.length ? childRows : null;
};

var datas=[];
const columns = [
  { name: 'firstName', title: 'First Name' },
  { name: 'lastName', title: 'Last Name' },
  { name: 'phone', title: 'Phone' },
  { name: 'state', title: 'State' },
];

const requiredRule = {
  isValid: value => value?value.length > 0:"",
  errorText: 'This field is required',
};
const validationRules = {
  phone: {
    isValid: phone => phone.match(/^\(\d{3}\) \d{3}-\d{4}$/i),
    errorText: 'Your phone must have "(555) 555-5555" format!',
  },
  name: requiredRule,
  firstName: requiredRule,
  lastName: requiredRule,
  state: requiredRule,
  gender: requiredRule,
  city: requiredRule,
  car: requiredRule,

};
const validate = (changed, validationStatus) => Object.keys(changed).reduce((status, id) => {
  let rowStatus = validationStatus[id] || {};
  if (changed[id]) {
    rowStatus = {
      ...rowStatus,
      ...Object.keys(changed[id]).reduce((acc, field) => {
        console.log(validationRules[field].isValid(changed[id][field]));
        const isValid = validationRules[field].isValid(changed[id][field]);
        return {
          ...acc,
          [field]: {
            isValid,
            error: !isValid && validationRules[field].errorText,
          },
        };
      }, {}),
    };
  }

  return { ...status, [id]: rowStatus };
}, {});

export default () => {
  const [rows, setRows] = useState(generateRows({
    columnValues: {
      id: ({ index }) => index,
      parentId: ({ index, random }) => (index > 0 ? Math.trunc((random() * index) / 2) : null),
      ...defaultColumnValues,
    },
    length: 10,
  }));
  useEffect( () => {
    const apiUrl = 'https://raw.githubusercontent.com/anilkumar9854/treetabledata/main/treeData.json';
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        setRows(data)
        console.log('This is your data', data)
        console.log('This is your data', datas)
    },[]);
    // const apiUrl = 'https://api.github.com/users/hacktivist123/repos';
    // axios.get(apiUrl).then((repos) => {
    //   const allRepos = repos.data;
    //   // setAppState({ loading: false, repos: allRepos });
    // });
},[]);
  const [columns] = useState([
    { name: 'name', title: 'Name' },
    { name: 'gender', title: 'Gender' },
    { name: 'city', title: 'City' },
    { name: 'car', title: 'Car' },
  ]);
  //const [rows] = useState(generateRows({ length: 8 }));
  const [selection, setSelection] = useState([]);
  const [update_disable, setUpdateDisable] = useState("false");
  
  const [data] = useState(generateRows({
    columnValues: {
      id: ({ index }) => index,
      parentId: ({ index, random }) => (index > 0 ? Math.trunc((random() * index) / 2) : null),
      ...defaultColumnValues,
    },
    length: 20,
  }));
  const [tableColumnExtensions] = useState([
    { columnName: 'name', width: 300 },
  ]);
  const [defaultExpandedRowIds] = useState([0,1,2,3,4,5,6]);
  const onSumbnit= () =>{
    let selectedRows=data.filter(function(d){
      return selection.indexOf(d.id)!=-1
    });
    console.log(selectedRows);
  
  }

  
  
  
  const [editingRowIds, setEditingRowIds] = useState([]);
  const [rowChanges, setRowChanges] = useState({});
  const [validationStatus, setValidationStatus] = useState({});
  const [modifiedRows, setModifiedRows] = useState(rows);
  console.log(apiData);
  const commitChanges = ({ changed, deleted }) => {
    let changedRows;
    if (changed) {
      console.log(changed);
      changedRows = rows.map(row => (changed[row.id] ? { ...row, ...changed[row.id] } : row));
      console.log(changedRows);
      setValidationStatus({ ...validationStatus, ...validate(changed, validationStatus) });
    }
    if (deleted) {
      const deletedSet = new Set(deleted);
      changedRows = rows.filter(row => !deletedSet.has(row.id));
    }

    setRows(changedRows);
    console.log(changedRows);
    setModifiedRows(changedRows);
  };
  const Cell = React.useCallback((props) => {
    const { tableRow: { rowId }, column: { name: columnName } } = props;
    const columnStatus = validationStatus[rowId]?"":[columnName];
    const valid = !columnStatus || columnStatus.isValid;
    const style = {
      ...(!valid ? { border: '1px solid red' } : null),
    };
    const title = valid ? '' : validationStatus[rowId][columnName].error;

    return (
      <Table.Cell
        {...props}
        style={style}
        title={title}
      />
    );
  }, [validationStatus]);
  return (
    <div>
      <div className="table_container">
      <Paper>
      <Grid
          rows={rows}
          columns={columns}
        >
          <EditingState
            editingRowIds={editingRowIds}
            onEditingRowIdsChange={setEditingRowIds}
            rowChanges={rowChanges}
            onRowChangesChange={(e) => {
              console.log('its working');
              setRowChanges(e);
              setUpdateDisable("false");
            }}
            onCommitChanges={commitChanges}
          />
          <Table
            cellComponent={Cell}
          />
          <TreeDataState
            defaultExpandedRowIds={defaultExpandedRowIds}
          />
          <CustomTreeData
            getChildRows={getChildRows}
          />
          <Table
            columnExtensions={tableColumnExtensions}
          />
          <SelectionState
            selection={selection}
            onSelectionChange={setSelection}
          />
          <PagingState
            defaultCurrentPage={0}
            pageSize={6}
          />
          <TableEditColumn
            showAddCommand
            showDeleteCommand
          />
          <IntegratedSelection />
          <IntegratedPaging />
          <TableHeaderRow />
          <TableTreeColumn
            for="name"
            showSelectionControls
            showSelectAll
          />
          <TableInlineCellEditing />
          {/* <PagingPanel /> */}
        </Grid>
      </Paper>
      </div>
      <div className="btns" style={{paddingTop:'10px'}}>
        <button onClick={() => {
          setRows(modifiedRows);
          setUpdateDisable("true");
        }} >Update</button>
      <button onClick={onSumbnit}>Submit</button>
      </div>
    </div>
  );
};
