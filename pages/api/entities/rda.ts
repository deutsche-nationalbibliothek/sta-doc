import { entityRepository } from '@/features/entity/entity-repository';
import { fetchWorkingCatalogIndex } from '@/lib/bff/catalog-entity-index';
import { Namespace } from '@/types/namespace';
import { getLocaleFromReq } from '@/utils/locale-utils';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const locale = getLocaleFromReq(req);
  const fromCatalog = await fetchWorkingCatalogIndex(req, Namespace.RDA, locale);
  if (fromCatalog) {
    res.status(200).json(fromCatalog);
    return;
  }
  res.status(200).json(
    entityRepository.getEntityIndexByNamespace(locale, Namespace.RDA)
  );
};