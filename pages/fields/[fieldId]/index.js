import FieldDetail from '../../../components/fields/FieldDetail'

function FieldDetails(props) {
        const field = props.field
        // console.log('field', field)
        return(
                <FieldDetail data={props.field}/>
        )
}

export default FieldDetails

export async function getStaticPaths() {
        //fetch data from API 
        const res = await fetch('https://doku.wikibase.wiki/w/rest.php/gnd/doku/v1/datafields')
        const data = await res.json()
        const fields = data.fields
        const rows = []
        Object.keys(fields).map(key => {
                // every field needs a Property ID
                fields[key]['id'] = key
                rows.push(fields[key])
                // console.log('rows',rows)
                // console.log(fields[key])
                // console.log('key',key)
        })

        return {
                fallback: false,
                paths: rows.map((field) => ({
                        params: { fieldId: field.id.toString() }
                }))
        }
    
}

export async function getStaticProps(context) {
        //fetch data for a single field
        const res = await fetch('https://doku.wikibase.wiki/w/rest.php/gnd/doku/v1/datafields')
        const data = await res.json()
        const fields = data.fields
        const rows = []
        Object.keys(fields).map(key => {
                // every field needs a Property ID
                fields[key]['id'] = key
                rows.push(fields[key])
                // console.log('rows',rows)
                // console.log(fields[key])
                // console.log('key',key)
        })
        const field = rows.filter(field => field.id === fieldId)

        return {
                props: {
                        // meetups: DUMMY_MEETUPS,
                        field: field[0]
                },
                revalidate: 10
        }

}
