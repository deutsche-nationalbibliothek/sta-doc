import React from 'react';
import FieldList from '../components/fields/FieldList';
import DataGrid from 'react-data-grid';
// import MeetupList from '../components/meetups/MeetupList';

const DUMMY_MEETUPS = [
  {
    id: 'm1',
    title: 'title',
    image: 'https://upload.wikimedia.org/wikipedia/commons/0/01/Thomas_Wolff.jpg',
    address: 'address 1, ss',
    description: 'bla bla'
  },
  {
    id: 'm2',
    title: 'title',
    image: 'https://upload.wikimedia.org/wikipedia/commons/0/01/Thomas_Wolff.jpg',
    address: 'address 1, ss',
    description: 'bla bla'
  }
]
const columns = [
          { key: 'label', name: 'Feld' },
          { key: 'description', name: 'Beschreibung' }
];
// const rows = [
          // { id: 0, title: 'Example' },
          // { id: 1, title: 'Demo' }
// ];

function HomePage(props) { 
        var rows = props.rows
        // console.log('fields:', fields)
        var keys = Object.keys(rows)
        keys.map(key => {
                console.log(key, ' : ', rows[key])
        })

        // for (var i=0;i<fields.length;i++) {
        // }
        return ( 
                <DataGrid columns={columns} rows={props.rows} />
                // <FieldList fields={props.fields}/>;
        )
} 

export async function getStaticProps() {
        //fetch data from API 
        const res = await fetch('https://doku.wikibase.wiki/w/rest.php/gnd/doku/v1/')
        const data = await res.json()
        const fields = data.fields
        const rows = []
        Object.keys(fields).map(key => {
                rows.push(fields[key])
        })
        // console.log('data.fields: ', Object.keys(fields))

        return {
                props: {
                        meetups: DUMMY_MEETUPS,
                        rows: rows
                }
        }

}

export default HomePage
