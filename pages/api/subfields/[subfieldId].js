import { getField } from '@/lib/api'

export default async function handler(req, res) {
  const { subfieldId } = req.query
  const subfield = await getField( subfieldId )
  res.status(200).json(subfield)
}
