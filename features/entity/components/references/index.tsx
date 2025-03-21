import { Reference } from '@/types/parsed/entity';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Card, Divider, Popover, Tooltip, Typography, theme } from 'antd';
import React from 'react';
import { Property } from '@/types/property';
import { ExternalLink } from '@/components/external-link';
import { CopyHeadlineAnchorLink } from '@/components/copy-headline-anchor-link';

interface ReferencesProps {
  references: Reference[];
}

export const References: React.FC<ReferencesProps> = ({ references }) => {
  const { token } = theme.useToken();

  return (
    <>
      <Popover
        content={references.map((reference, index) => {
          const url = reference[Property.URL] || reference[Property.URIGNDSubfield];
          const contentElement = url ? (
            <React.Fragment key={index}>
              <ExternalLink linkProps={{ href: url }}>
                {reference[Property.description] ?? url}
              </ExternalLink>{' '}
              <CopyHeadlineAnchorLink url={url} />
            </React.Fragment>
          ) : (
            reference[Property.description] && (
              <>{reference[Property.description]}</>
            )
          );
          return (
            contentElement && (
              <React.Fragment key={index}>
                <Card
                  css={{
                    border: 'none',
                    '& > .ant-card-body': { padding: '1em' },
                  }}
                >
                  <Typography.Paragraph>
                    {reference[Property.description] ? (
                      <Tooltip title={url}>{contentElement}</Tooltip>
                    ) : (
                      contentElement
                    )}
                    {reference[Property['description-(at-the-end)']] && (
                      <Typography.Paragraph>
                        {reference[Property['description-(at-the-end)']]}
                      </Typography.Paragraph>
                    )}
                  </Typography.Paragraph>
                </Card>
                {index !== references.length - 1 && (
                  <Divider
                    css={{
                      borderBlockStart: `1px solid ${token.colorPrimaryBorder}`,
                      margin: 0,
                    }}
                  />
                )}
              </React.Fragment>
            )
          );
        })}
        // open // <- good for debugging
        trigger="hover"
      >
        <Typography.Text strong>Siehe </Typography.Text>
        <QuestionCircleOutlined
          css={{
            color: token.colorPrimaryActive,
            fontSize: 16,
            marginBottom: '1em',
          }}
        />
      </Popover>
    </>
  );
};
