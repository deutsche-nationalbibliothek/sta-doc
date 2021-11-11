export const DATA = [
]

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
