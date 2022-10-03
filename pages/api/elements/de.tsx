import * as sparql from '@/lib/sparql';
import { getLabels } from '@/lib/api';

export default async function handler(req, res) {
  const labels = await getLabels(sparql.LABELDE);
  res.status(200).json(labels);
}
