import { useInitialHeadlines } from '@/hooks/initial-headlines';
import { Modal } from './modal';
import { MenuOutlined } from '@ant-design/icons';
import { TableOfContent } from '@/features/entity/components/table-of-content';
import { layoutContentHeight } from './layout';
import useIsSmallScreen from '@/hooks/use-is-small-screen';

export const SidebarSmallScreen: React.FC = () => {
  const { headlines } = useInitialHeadlines();
  const isSmallScreen = useIsSmallScreen();
  return headlines ? (
    <Modal
      forceRender
      closeOnRouteChange
      disableLabelOnOpen
      renderSpan
      css={{
        top: 10,
        '& .ant-modal-content': {
          padding: '39px 24px !important',
        },
      }}
      label={
        <MenuOutlined
          css={{
            position: 'absolute',
            fontSize: 20,
            top: 95,
            right: 20,
            zIndex: 4,
            cursor: 'pointer',
          }}
        />
      }
    >
      <div
        css={{
          height: layoutContentHeight(isSmallScreen),
          zIndex: 99,
        }}
      >
        <TableOfContent headlines={headlines} />
      </div>
    </Modal>
  ) : null;
};
