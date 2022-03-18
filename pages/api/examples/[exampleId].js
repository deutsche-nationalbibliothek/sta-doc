import { getExample } from '@/lib/api'

export default async function handler(req, res) {
  const { exampleId } = req.query
  const example  = await getExample( exampleId )
  res.status(200).json(example)
}
