import * as sparql from '@/lib/sparql'
import { getElements } from '@/lib/api'

export default async function handler(req, res) {
  const labels = await getElements( sparql.LABELEN )
  res.status(200).json(labels)
}
