import { Reference } from '@/types/parsed/entity';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Card, Popover, Tooltip, Typography, theme } from 'antd';
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
          const url = reference[Property.URL] || reference[Property.URI];
          const linkElement = url && (
            <>
              <ExternalLink linkProps={{ href: url }}>
                {reference[Property.description] ?? url}
              </ExternalLink>{' '}
              <CopyHeadlineAnchorLink url={url} />
            </>
          );
          return (
            url && (
              <Card key={index}>
                <Typography.Paragraph>
                  {reference[Property.description] ? (
                    <Tooltip title={url}>{linkElement}</Tooltip>
                  ) : (
                    linkElement
                  )}
                  {reference[Property['description-(at-the-end)']] && (
                    <Typography.Paragraph>
                      {reference[Property['description-(at-the-end)']]}
                    </Typography.Paragraph>
                  )}
                </Typography.Paragraph>
              </Card>
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
