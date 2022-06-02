import { getEntity } from "@/lib/api";

export default async function handler(req, res) {
  const { entryId } = req.query;
  // const field = await getField( entryId )
  const field = await getEntity(entryId);
  res.status(200).json(field);
}
