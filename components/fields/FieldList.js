import FieldTable from '../tables/FieldTable.js';
import classes from './FieldList.module.css';

const columns = [
          { key: 'label', name: 'Feld' },
          { key: 'description', name: 'Beschreibung' }
];

function FieldList(props) {
        // console.log('FieldList', props.data)
        return (
                <FieldTable data={props.data}/>
        )
}

export default FieldList;

