import * as sparql from "@/lib/sparql";
import { getCodings } from "@/lib/api";

export default async function handler(req, res) {
  const { codingId } = req.query;
  const codings = await getCodings(sparql.CODINGS);
  res.status(200).json(codings);
}
