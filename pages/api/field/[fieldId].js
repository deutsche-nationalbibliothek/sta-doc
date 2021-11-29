
async function handler(req, res) {

        const { fieldId } = req.query
        const wikiurl = 'https://doku.wikibase.wiki/w/api.php?action=wbgetentities&format=json&languages=de&ids=' + fieldId
        console.log( fieldId, wikiurl )
        const wikiapi = await fetch(wikiurl).then( body => body.json())
        const prop = wikiapi.entities[fieldId]
        
        res.status(200).json(prop)
}
export default handler
