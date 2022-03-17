import * as sparql from '@/lib/sparql'
import { getCodings } from '@/lib/api'

export default async function handler(req, res) {
  const { codingId } = req.query
  const codings = await getCodings( sparql.CODINGS )
  const coding = codings[codingId]
  res.status(200).json(coding)
}
