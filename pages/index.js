// import FieldTable from '../components/tables/FieldTable';
// import MeetupList from '../components/meetups/MeetupList';
// require('es6-promise').polyfill();
// require('isomorphic-fetch');

// const DUMMY_MEETUPS = [
  // {
    // id: 'm1',
    // title: 'title',
    // image: 'https://upload.wikimedia.org/wikipedia/commons/0/01/Thomas_Wolff.jpg',
    // address: 'address 1, ss',
    // description: 'bla bla'
  // },
  // {
    // id: 'm2',
    // title: 'title',
    // image: 'https://upload.wikimedia.org/wikipedia/commons/0/01/Thomas_Wolff.jpg',
    // address: 'address 1, ss',
    // description: 'bla bla'
  // }
// ]

function HomePage(props) { 
        // const [data, setData] = useState([])
        // const[q, setQ] = useState('')

        // useEffect(() => {
                // fetch('https://doku.wikibase.wiki/w/rest.php/gnd/doku/v1/datafields')
                // .then((response) => response.json())
                // .then((json) => setData(json))
            
        // }, [])

        // var rows = props.rows
        // console.log(rows)
        // var keys = Object.keys(rows)
        // keys.map(key => {
                // console.log(key, ' : ', rows[key])
        // })
        // console.log('props', props);
        // <FieldTable data={data}></FieldTable>
        console.log(props.parser)

        return (
                <div>
                <p>Willkommen auf der Webseite zur STA Dokumentation. </p>
                </div>
        )

} 
export default HomePage

export async function getStaticProps() {
        const url = "https://doku.wikibase.wiki/api.php?" +
                new URLSearchParams({
                        origin: "*",
                        action: "parse",
                        page: "GND-Dokumentation",
                        prop: "text",
                        format: "json",
                })

        const req = await fetch(url)
        const json = await req.json()
        const parser = json.parse.text['*']
        console.log(json.parse.text["*"])

        // const res = await fetch('https://doku.wikibase.wiki/w/rest.php/gnd/doku/v1/datafields')
        // const data = await res.json()
        // const fields = data.fields
        // const rows = []
        // Object.keys(fields).map(key => {
                // // every field needs a Property ID
                // fields[key]['id'] = key
                // rows.push(fields[key])
                // // console.log('rows',rows)
                // console.log(fields[key])
                // console.log('key',key)
        // })
        // const field = rows.filter(field => field.id === fieldId)

        return {
                props: {
                        // meetups: DUMMY_MEETUPS,
                        parser: parser
                },
                // revalidate: 10
        }

}

