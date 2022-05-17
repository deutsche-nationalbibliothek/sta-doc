import * as sparql from "@/lib/sparql";
import { getEntity } from "@/lib/api";
import { getElements } from "@/lib/api";

export default async function handler(req, res) {
  const entries = await getElements(sparql.ENTRIES);
  // const { fieldId } = req.query;
  // const field = await getEntity(fieldId);
  res.status(200).json(entries);
}
