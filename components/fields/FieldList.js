// import MeetupItem from './MeetupItem';
// import DataGrid from 'react-data-grid';
import FieldTable from '../tables/FieldTable.js';
import classes from './FieldList.module.css';

const columns = [
          { key: 'label', name: 'Feld' },
          { key: 'description', name: 'Beschreibung' }
];
// const rows = [
          // { id: 0, title: 'Example' },
          // { id: 1, title: 'Demo' }
// ];

function FieldList(props) {
        // console.log('FieldList', props.data)
        return (
                <FieldTable data={props.data}/>
        )
}

export default FieldList;

