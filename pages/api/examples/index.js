import fetchWithCache from '../../../cache/fetchWithCache.js'
import * as constants from '../../../sparql/queryConstants'
import queryElements from '../../../sparql/queryElements'
import queryLabel from '../../../sparql/queryLabel'
import queryCodings from '../../../sparql/queryCodings'
import queryExamples from '../../../wikibase/queryExamples'

export default async function handler(req, res) {
  const examples = await queryExamples()
  res.status(200).json(examples)
}
