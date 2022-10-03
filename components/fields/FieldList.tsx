import FieldTable from '@/components/tables/FieldTable';
import classes from './FieldList.module.css';

const columns = [
  { key: 'label', name: 'Feld' },
  { key: 'description', name: 'Beschreibung' },
];

export default function FieldList(props) {
  console.log('FieldListr', props.data);
  return <FieldTable data={props.data} />;
}
