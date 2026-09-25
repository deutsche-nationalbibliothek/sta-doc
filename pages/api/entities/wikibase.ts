// next.js macht routing automatisch, also durch ordnerstruktur /api/wikibase
import { NextApiRequest, NextApiResponse } from "next";
import { fetcher } from '@/bin/data/fetcher';
import { EntityId } from "@/types/entity-id";

// function handler wie meine express callback
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query

    if (typeof id !== "string") { return res.status(400).json({message: "Entity Id is missing or not valid!"})}

    try{
        const wikibaseData = fetcher();
        const result = wikibaseData.entities.single(id as EntityId);

        return res.status(200).json(result)
    } catch(e){console.error(e);
    return res.status(500).json({message: "Wikibase request was not possible."})}
}