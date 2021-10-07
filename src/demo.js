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

import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';


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
  account: requiredRule,
  created_on: requiredRule,
  created_by: requiredRule,
  currency: requiredRule,

};
const validate = (changed, validationStatus) => Object.keys(changed).reduce((status, id) => {
  let rowStatus = validationStatus[id] || {};
  if (changed[id]) {
    rowStatus = {
      ...rowStatus,
      ...Object.keys(changed[id]).reduce((acc, field) => {
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
  const [rows, setRows] = useState(
    [
      {"id":0, "parentId":null ,"name":"Assets", "account":"" },
      {"id":1, "parentId":0 ,"name":"External Accounting", "account":""},
      {"id":2, "parentId":1 ,"name":"Cash and Cash balances", "car":"", "city":"","gender":"" },
      {"id":3, "parentId":2 ,"name":"Cash Reserve", "account":1010131,"created_on":"30.8.2020","created_by":"SAP" ,"currency":"CHF"},
      {"id":4, "parentId":2 ,"name":"Values Undergoing Collection", "account":1012131 ,"created_on":"25.8.2020","created_by":"SAP","currency":"CHF"},
      {"id":5, "parentId":2 ,"name":"Bank Account Number", "account":1011000,"created_on":"22.8.2020","created_by":"SAP","currency":"EUR"},
      {"id":6, "parentId":2 ,"name":"Bank Clearing Number", "account":1011100 ,"created_on":"14.8.2020","created_by":"SAP","currency":"CHF"},
      {"id":7, "parentId":2 ,"name":"IFX Adjustment Account: FI-GL",  "account":1011200,"created_on":"28.8.2020","created_by":"SAP","currency":"EUR" },
      {"id":8, "parentId":1 ,"name":"Loans and Advances",  "account":""},
      {"id":9, "parentId":8 ,"name":"Risk Provision", "account":""},
      {"id":10, "parentId":1 ,"name":"Derivative Hedging Instruments - Assets", "account":"" },
      {"id":11, "parentId":10 ,"name":"Derivative Hedge Accounting",  "account":1040111,"created_on":"21.8.2020","created_by":"SAP" ,"currency":"USD"},
      {"id":12, "parentId":10 ,"name":"Fair Value Charges of Hedge Items",  "account":1040211,"created_on":"10.8.2020","created_by":"SAP","currency":"USD" },
      {"id":13, "parentId":1 ,"name":"Securities and Equity Holding",  "account":""},
      {"id":14, "parentId":13 ,"name":"Shares of Corporation",  "account":""},
      {"id":15, "parentId":1 ,"name":"Trading Assets",  "account":""},
      {"id":16, "parentId":1 ,"name":"Intangible Assets",  "account":""},
      {"id":17, "parentId":16 ,"name":"Patents",  "account":"" },
      {"id":18, "parentId":16 ,"name":"Trade Marks",  "account":"" },
      {"id":19, "parentId":1 ,"name":"Fixed Assets",  "account":"" },
      {"id":20, "parentId":19 ,"name":"Property & Equipments",  "account":1030255,"created_on":"5.8.2020","created_by":"SAP","currency":"EUR" },
      {"id":21, "parentId":19 ,"name":"Cash",  "account":1030544,"created_on":"13.8.2020","created_by":"SAP","currency":"CHF"},
      {"id":22, "parentId":1 ,"name":"Income Tax Receivables",  "account":"","created_on":"18.8.2020","created_by":"SAP","currency":"EUR"},
      {"id":23, "parentId":22 ,"name":"Tax Return",  "account":1010113,"created_on":"20.8.2020","created_by":"SAP","currency":"USD"},
      {"id":24, "parentId":1 ,"name":"Other Assets",  "account":""},
      {"id":25, "parentId":23 ,"name":"Investments",  "account":1050466,"created_on":"19.8.2020","created_by":"SAP","currency":"USD"}    
  ]
    
);
console.log(rows);
  useEffect( () => {
    const apiUrl = 'https://raw.githubusercontent.com/anilkumar9854/treetabledata/main/treeData.json';
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        console.log('apidata',data);
        //setRows(data);

    },[]);
},[]);
  const [columns] = useState([
    { name: 'name', title: 'Name' },
    { name: 'account', title: 'Account' },
    { name: 'created_on', title: 'Created On' },
    { name: 'created_by', title: 'Created By' },
    { name: 'currency', title: 'Currency' },
  ]);
  
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
    let selectedRows=rows.filter(function(d){
      return selection.indexOf(d.id)!=-1
    });
    console.log(selectedRows);
  
  }

  const [editingRowIds, setEditingRowIds] = useState([]);
  const [rowChanges, setRowChanges] = useState({});
  const [validationStatus, setValidationStatus] = useState({});
  const [modifiedRows, setModifiedRows] = useState(rows);
  const DeleteButton = ({ onExecute }) => (
    <IconButton
      onClick={() => {
        // eslint-disable-next-line
        if (window.confirm('Are you sure you want to delete this row?')) {
          onExecute();
        }
      }}
      title="Delete row"
    >
      <DeleteIcon />
    </IconButton>
  );
  
const AddButton = ({ onExecute }) => (
  <div style={{ textAlign: 'center' }}>
    <Button
      color="primary"
      onClick={onExecute}
      title="Create new row"
    >
      New
    </Button>
  </div>
);
  const commandComponents = {
    add: AddButton,
    delete: DeleteButton,
  };
  
const Command = ({ id, onExecute }) => {
  const CommandButton = commandComponents[id];
  return (
    <CommandButton
      onExecute={onExecute}
    />
  );
};
  const commitChanges = ({ changed, deleted }) => {
    let changedRows;
    if (changed) {
      changedRows = rows.map(row => (changed[row.id] ? { ...row, ...changed[row.id] } : row));
      setValidationStatus({ ...validationStatus, ...validate(changed, validationStatus) });
    }
    if (deleted) {
      const deletedSet = new Set(deleted);
      console.log(deleted);
      changedRows = rows.filter(row => row.id!=deleted[0]);
      setRows(changedRows);
      
  console.log(changedRows);
    }

    
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
      <div>
        <div className="table_container">
        <Paper>
        <Grid
            rows={rows}
            columns={columns}
          >
          <SelectionState
            selection={selection}
            onSelectionChange={setSelection}
          />
            <EditingState
              editingRowIds={editingRowIds}
              onEditingRowIdsChange={setEditingRowIds}
              rowChanges={rowChanges}
              onRowChangesChange={(e) => {
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
            <PagingState
              defaultCurrentPage={0}
              pageSize={6}
            />
            <TableEditColumn
              width={60}
              showAddCommand
              showDeleteCommand
              commandComponent={Command}
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
