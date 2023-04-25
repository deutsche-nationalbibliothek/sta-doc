/* eslint-disable @typescript-eslint/no-floating-promises */
import { useEntity } from '@/hooks/entity-provider';
import {
  FullscreenExitOutlined,
  FullscreenOutlined,
  GithubOutlined,
  PrinterOutlined,
  VerticalAlignTopOutlined,
} from '@ant-design/icons';
import { CSSObject, css } from '@emotion/react';
import { Layout as AntdLayout, Col, message, Row, theme, Tooltip } from 'antd';
import copy from 'copy-to-clipboard';
import { useMemo } from 'react';
import { ExternalLink } from './external-link';
import { useCollapseToggleEvent } from '@/hooks/use-custom-events';

const styles: Record<string, CSSObject> = {
  icon: {
    fontSize: 'medium',
    padding: '0 6px',
    cursor: 'pointer',
    marginTop: 2,
  },
  col: {
    flex: 1,
    display: 'flex',
  },
};

export const Footer: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const { entity } = useEntity();

  const { onNextState: onCollapseNextState, state: collapseStateIsOpen } =
    useCollapseToggleEvent();

  const onClick = useMemo(
    () => ({
      staNotation: () => {
        copy(
          `${window.location.origin}${process.env.basePath ?? ''}/${
            entity?.staNotationLabel as string
          }`
        );
        messageApi.success('Link kopiert!');
      },
      scrollTop: () =>
        document.getElementById('main-scroll-container')?.scroll(0, 0),
      print: () => window.print(),
      betaDisclaimer: () => {
        messageApi.warning('In Beta Version ohne Funktion');
      },
    }),
    [messageApi, entity?.staNotationLabel]
  );

  const { token } = theme.useToken();

  return (
    <AntdLayout.Footer
      css={{
        height: 'var(--footer-height)',
        padding: '2.5px 0 0 0',
        margin: '0 8px 0 8px',
        background: 'var(--light-gray)',
      }}
    >
      {contextHolder}
      <Row
        justify="space-between"
        align="middle"
        css={{
          padding: '0 10px 0 10px',
          background: 'var(--light-gray)',
          '& span:hover': {
            color: token.colorPrimary,
          },
        }}
      >
        <Col
          css={css(styles.col, {
            justifyContent: 'flex-start',
          })}
        >
          {process.env['NEXT_PUBLIC_VERSION'] && (
            <span
              css={{
                '&:hover': {
                  color: `${token.colorPrimary} !important`,
                },
                '& a:hover': {
                  color: `${token.colorPrimary} !important`,
                },
              }}
            >
              <GithubOutlined
                css={{
                  paddingRight: 2,
                }}
              />
              <ExternalLink
                css={{
                  color: `${token.colorText} !important`,
                }}
                linkProps={{
                  href: `https://github.com/tbauer2811/gnd-doc/releases/tag/${process.env['NEXT_PUBLIC_VERSION']}`,
                }}
              >
                <>Version: {process.env['NEXT_PUBLIC_VERSION']}</>
              </ExternalLink>
            </span>
          )}
        </Col>
        <Col
          css={css(styles.col, {
            justifyContent: 'center',
          })}
        >
          <Tooltip title="Nach oben scrollen">
            <VerticalAlignTopOutlined
              onClick={onClick.scrollTop}
              css={styles.icon}
            />
          </Tooltip>
          <Tooltip className="no-print" title="Seiteninhalt drucken">
            <PrinterOutlined onClick={onClick.print} css={styles.icon} />
          </Tooltip>
          {collapseStateIsOpen ? (
            <Tooltip title="Alle Klapptexte einklappen">
              <FullscreenExitOutlined
                onClick={onCollapseNextState}
                css={styles.icon}
              />
            </Tooltip>
          ) : (
            <Tooltip title="Alle Klapptexte ausklappen">
              <FullscreenOutlined
                onClick={onCollapseNextState}
                css={styles.icon}
              />
            </Tooltip>
          )}
        </Col>
        <Col
          css={css(styles.col, {
            justifyContent: 'flex-end',
          })}
        >
          {entity?.staNotationLabel && (
            <span
              css={{
                position: 'relative',
                right: 0,
                cursor: 'pointer',
              }}
              onClick={onClick.staNotation}
            >
              STA-Notation: {entity.staNotationLabel}
            </span>
          )}
        </Col>
      </Row>
    </AntdLayout.Footer>
  );
};
