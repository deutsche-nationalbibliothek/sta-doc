import { AutoComplete } from 'antd';
import useTranslation from 'next-translate/useTranslation';
import { useWikibaseEditorContext } from '@/features/entity/context/wikibase-editor-context';
import useEntitySearch from '@/hooks/use-entity-search';

interface EntitySelectProps {
  defaultValue: string; // current ID, for instance "Q5"
  onSelect: (id: string) => void; // called with the chosen ID
}

// Autocomplete for picking a Wikibase item by ID or label.
export const EntitySelect = ({ defaultValue, onSelect }: EntitySelectProps) => {
  const { t } = useTranslation('wikibase');
  const { idLookup } = useWikibaseEditorContext();
  const { idSearchOptions, searchEntityIds } = useEntitySearch(idLookup);

  return (
    <AutoComplete
      defaultValue={defaultValue}
      options={idSearchOptions}
      onSearch={searchEntityIds}
      onSelect={onSelect}
      filterOption={false}
      autoFocus
      style={{ width: 400 }}
      placeholder={t('search.selectPlaceholder')}
    />
  );
};
