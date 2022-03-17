export default function HomePage(props) { 
  const image = 'https://doku.wikibase.wiki/w/thumb.php?f=GND_RGB.jpg&width=200'
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

  return (
    <>
    <h1>{title}</h1>
    <div dangerouslySetInnerHTML={{ __html: htmlString }}>
    </div>
    </>
  )

} 

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
      parser: parser,
      json: json,
      title: title
    },
    revalidate: 10
  }

}

