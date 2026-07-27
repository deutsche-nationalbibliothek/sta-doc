import { EntityLink } from '@/entity/components/preview/link';
import { EntityId } from '@/types/entity-id';
import { ExampleProcessingResult } from '@/utils/example-statements-reducer';
import { Typography } from 'antd';
import React from 'react';

type FormatNeutralItem = ExampleProcessingResult['formatNeutral'][number];

export interface GndFormatNeutralProps {
  formatNeutrals: FormatNeutralItem[];
}

/**
 * GND-specific format-neutral prose ("Erfassen Sie … im Datenfeld …").
 * Used as Example's renderFormatNeutral override.
 */
export const GndFormatNeutral: React.FC<GndFormatNeutralProps> = ({
  formatNeutrals,
}) => (
  <>
    {formatNeutrals.map((formatNeutral, index) => (
      <Typography.Paragraph key={index}>
        <Typography.Text>Erfassen Sie </Typography.Text>
        <Typography.Text strong>{formatNeutral.value}</Typography.Text>
        {formatNeutral.formatNeutralLayoutId == 'Q11801' ? ( //GND-Umsetzung 2: Beziehungen | Layouttyp
          <Typography.Text>
            {' '}
            als in Beziehung stehende Entität
          </Typography.Text>
        ) : undefined}
        <Typography.Text> im Datenfeld </Typography.Text>
        <Typography.Text strong>
          <EntityLink
            id={formatNeutral.propertyId}
            label={formatNeutral.propertyLabel}
            staNotationLabel={formatNeutral.staNotationLabel}
          />
        </Typography.Text>
        {formatNeutral.subfieldsGroup.naming.length > 0 &&
        formatNeutral.formatNeutralLayoutId != 'Q11801' ? ( // nicht bei GND-Umsetzung 2: Beziehungen | Layouttyp
          <>
            {formatNeutral.subfieldsGroup.naming.length > 1 ? (
              <Typography.Text>
                {' '}
                in den Unterfeldern / Datenelementen{' '}
              </Typography.Text>
            ) : formatNeutral.subfieldsGroup.naming.length == 1 ? (
              <Typography.Text>
                {' '}
                im Unterfeld / Datenelement{' '}
              </Typography.Text>
            ) : undefined}
            {formatNeutral.subfieldsGroup.naming.map((subfield, index) => (
              <Typography.Text strong key={index}>
                <EntityLink
                  id={subfield.property as EntityId}
                  label={subfield.label ? subfield.label : ''}
                  staNotationLabel={
                    subfield.staNotationLabel
                      ? subfield.staNotationLabel
                      : undefined
                  }
                />
                {formatNeutral.subfieldsGroup.naming.length - 1 > index ? (
                  <Typography.Text>{', '}</Typography.Text>
                ) : undefined}
              </Typography.Text>
            ))}
          </>
        ) : undefined}
        {formatNeutral.subfieldsGroup.addition.length > 0 &&
        formatNeutral.formatNeutralLayoutId != 'Q11792' ? ( // nicht bei GND-Umsetzung 1b
          <>
            {formatNeutral.subfieldsGroup.addition && (
              <>
                <Typography.Text>
                  {' '}
                  und ergänzen Sie bei Bedarf zur Identifizierung{' '}
                </Typography.Text>
                {formatNeutral.subfieldsGroup.addition.length > 1 ? (
                  <Typography.Text>
                    {' '}
                    die Unterfelder / Datenelemente{' '}
                  </Typography.Text>
                ) : formatNeutral.subfieldsGroup.addition.length == 1 ? (
                  <Typography.Text>
                    {' '}
                    das Unterfeld / Datenelement{' '}
                  </Typography.Text>
                ) : undefined}
                {formatNeutral.subfieldsGroup.addition.map(
                  (subfield, index) => (
                    <React.Fragment key={index}>
                      <Typography.Text strong>
                        <EntityLink
                          id={subfield.property}
                          label={subfield.label ? subfield.label : ''}
                          staNotationLabel={
                            subfield.staNotationLabel
                              ? subfield.staNotationLabel
                              : undefined
                          }
                        />
                        {formatNeutral.subfieldsGroup.addition.length - 1 >
                        index ? (
                          <Typography.Text>{', '}</Typography.Text>
                        ) : undefined}
                      </Typography.Text>
                    </React.Fragment>
                  )
                )}
              </>
            )}
          </>
        ) : undefined}
        {formatNeutral.subfieldsGroup.relationType.length > 0 &&
        !formatNeutral.permittedCharacteristics ? (
          <>
            {formatNeutral.subfieldsGroup.relationType[0].wikibasePointers &&
            !formatNeutral.subfieldsGroup.relationType[0].wikibasePointers[0]
              .missingValue ? (
              <>
                <Typography.Text>
                  {' '}
                  mit der Beziehungskennzeichnung{' '}
                </Typography.Text>
                <Typography.Text strong>
                  <EntityLink
                    id={
                      formatNeutral.subfieldsGroup.relationType[0]
                        .wikibasePointers[0].id
                    }
                    label={
                      formatNeutral.subfieldsGroup.relationType[0]
                        .wikibasePointers[0].label
                    }
                    staNotationLabel={
                      formatNeutral.subfieldsGroup.relationType[0]
                        .wikibasePointers[0].staNotationLabel
                    }
                  />
                </Typography.Text>
              </>
            ) : (
              <Typography.Text>
                {' '}
                mit einer geeigneten Beziehungskennzeichnung
              </Typography.Text>
            )}
          </>
        ) : undefined}
        {formatNeutral.subfieldsGroup.relationType.length > 0 &&
        formatNeutral.permittedCharacteristics &&
        formatNeutral.permittedCharacteristics[0].property === 'P168' ? (
          <Typography.Text>
            {' '}
            mit einer der folgenden Beziehungskennzeichnungen{' '}
          </Typography.Text>
        ) : undefined}
        {formatNeutral.permittedCharacteristics &&
        formatNeutral.permittedCharacteristics[0].property === 'P8' ? (
          <Typography.Text>
            {' '}
            mit einem der folgenden Werte{' '}
          </Typography.Text>
        ) : undefined}
        {formatNeutral.permittedCharacteristics
          ? formatNeutral.permittedCharacteristics.map(
              (characteristic, index) => (
                <React.Fragment key={index}>
                  <Typography.Text strong>
                    <EntityLink
                      id={characteristic.property}
                      label={
                        characteristic.label ? characteristic.label : ''
                      }
                      staNotationLabel={
                        characteristic.staNotationLabel
                          ? characteristic.staNotationLabel
                          : undefined
                      }
                    />
                    {formatNeutral.permittedCharacteristics!.length - 1 >
                    index ? (
                      <Typography.Text>{', '}</Typography.Text>
                    ) : undefined}
                  </Typography.Text>
                </React.Fragment>
              )
            )
          : undefined}
        <Typography.Text>{'. '}</Typography.Text>
        {formatNeutral.subfieldsGroup.qualifier.length > 0 &&
        formatNeutral.formatNeutralLayoutId != 'Q11792' ? ( // nicht bei GND-Umsetzung 1b
          <>
            <Typography.Text>
              Ergänzen Sie je nach Bedarf zusätzliche Angaben{' '}
            </Typography.Text>
            {formatNeutral.subfieldsGroup.qualifier.length > 1 ? (
              <Typography.Text>
                in den Unterfeldern / Datenelementen{' '}
              </Typography.Text>
            ) : formatNeutral.subfieldsGroup.qualifier.length == 1 ? (
              <Typography.Text>
                {' '}
                im Unterfeld / Datenelement{' '}
              </Typography.Text>
            ) : undefined}
            {formatNeutral.subfieldsGroup.qualifier.map((subfield, index) => (
              <React.Fragment key={index}>
                <Typography.Text strong>
                  <EntityLink
                    id={subfield.property}
                    label={subfield.label ? subfield.label : ''}
                    staNotationLabel={
                      subfield.staNotationLabel
                        ? subfield.staNotationLabel
                        : undefined
                    }
                  />
                  {formatNeutral.subfieldsGroup.qualifier.length - 1 >
                  index ? (
                    <Typography.Text>{', '}</Typography.Text>
                  ) : (
                    <Typography.Text>{'.'}</Typography.Text>
                  )}
                </Typography.Text>
              </React.Fragment>
            ))}
          </>
        ) : undefined}
      </Typography.Paragraph>
    ))}
  </>
);
