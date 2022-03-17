import { getField } from '@/lib/api'

export default async function handler(req, res) {
  const { fieldId } = req.query
  const field = await getField( fieldId )
  res.status(200).json(field)
}
