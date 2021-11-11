// import React, { useState, useEffect} from 'react';
import FieldList from '../../components/fields/FieldList'

function FieldListPage(props) {
  // function addMeetupHandler(enteredMeetupData) {
    // console.log(enteredMeetupData)
  // }
  return (
          <FieldList data={props.rows}/>
  )
}

export async function getStaticProps() {
        //fetch data from API 
        const res = await fetch('https://doku.wikibase.wiki/w/rest.php/gnd/doku/v1/datafields')
        const data = await res.json()
        const fields = data.fields
        const rows = []
        Object.keys(fields).map(key => {
                rows.push(fields[key])
                // console.log(fields[key])
        })

        return {
                props: {
                        // meetups: DUMMY_MEETUPS,
                        rows: rows
                }
        }

}

export default FieldListPage
