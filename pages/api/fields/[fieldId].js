// import { getField } from '@/lib/api'
import { getEntity } from '@/lib/api'

export default async function handler(req, res) {
  const { fieldId } = req.query
  // const field = await getField( fieldId )
  const field = await getEntity( fieldId )
  res.status(200).json(field)
}
