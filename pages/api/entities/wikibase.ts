import { NextApiRequest, NextApiResponse } from "next";
import { fetcher } from '@/bin/data/fetcher';
import { EntityId } from "@/types/entity-id";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query

    if (typeof id !== "string") { return res.status(400).json({message: "Entity Id is missing or not valid!"})}

    try{
        const wikibaseData = fetcher();
        const result = await wikibaseData.entities.single(id as EntityId);

        // console.log('entity id:', id);
        // console.log('wikibase result:', result);

        return res.status(200).json(result)
    } catch(e) {
        console.error(e);
        return res.status(500).json({message: "Wikibase request was not possible."})
    }
}