import * as sparql from "@/lib/sparql";
import { getExamples } from "@/lib/api";

export default async function handler(req, res) {
  const examples = await getExamples(sparql.EXAMPLES);
  res.status(200).json(examples);
}
