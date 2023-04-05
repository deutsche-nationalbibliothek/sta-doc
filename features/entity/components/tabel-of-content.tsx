import { useHeadlines } from '@/hooks/headlines';
import { useScroll } from '@/hooks/use-scroll';
import { useRouter } from '@/lib/next-use-router';
import { Headline } from '@/types/headline';
import { Tree, Typography } from 'antd';
import { DataNode } from 'antd/lib/tree';
import RcTree from 'rc-tree';
import React from 'react';

interface TableOfContentProps {
  containerRef: React.RefObject<HTMLDivElement>;
  dividerRef: React.RefObject<HTMLDivElement>;
  headlines: Headline[];
}

export const TableOfContent: React.FC<TableOfContentProps> = ({
  containerRef,
  dividerRef,
  headlines,
}) => {
  const { nestedHeadlines, currentHeadlinesPath, headlineKeysInViewport } =
    useHeadlines();

  const router = useRouter();
  const treeRef = React.useRef<RcTree<DataNode>>(null);
  useScroll(treeRef);

  const containerHeight =
    containerRef.current?.getBoundingClientRect().height ?? 0;
  const dividerHeight = dividerRef.current?.getBoundingClientRect().height ?? 0;

  return (
    <>
      <Tree
        showLine
        showIcon
        expandedKeys={headlines.map((headline) => headline.key)}
        ref={treeRef}
        height={
          containerHeight - dividerHeight * 2
          // document ? document.querySelector('.tile').getBoundingClientRect().height - dividerHeight * 2 - 20 : containerHeight - dividerHeight * 2
          // window.innerHeight - 64 - 53 * 2 // topbar- and divider-height
        }
        selectedKeys={headlineKeysInViewport}
        multiple
        titleRender={({ key, title }: { key: string; title: string }) => (
          <Typography.Text
            id={`nav-${key}`}
            onClick={() => {
              router
                .push(`#${key}`, undefined, { shallow: false })
                .catch((e) => console.error(e));
            }}
            strong={
              currentHeadlinesPath.findIndex(
                (nestedHeadline) => nestedHeadline.key === key
              ) >= 0
            }
          >
            {title}
          </Typography.Text>
        )}
        treeData={nestedHeadlines}
      />
    </>
  );
};
