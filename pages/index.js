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
        const image = 'https://doku.wikibase.wiki/w/thumb.php?f=GND_RGB.jpg&width=200'
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
        const htmlparser2 = require("htmlparser2");
        const json = props.json
        const dom = htmlparser2.parseDocument(props.parser);
        const htmlString = props.parser
        const title = props.title
        const tag_list = []
        dom.children[0].children.map((element) => {
                if (element['type'] === 'tag') {
                        tag_list.push(element)
                }})
        // console.log('props.parser',props.parser)
        // console.log('json',json)
        // console.log('html page',dom)

        return (
                <>
                <h1>{title}</h1>
                <div dangerouslySetInnerHTML={{ __html: htmlString }}>
                </div>
                </>
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
        const title = json.parse.title

        return {
                props: {
                        // meetups: DUMMY_MEETUPS,
                        parser: parser,
                        json: json,
                        title: title
                },
                revalidate: 10
        }

}

