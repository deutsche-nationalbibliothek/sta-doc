import ReactSplit, { SplitDirection } from '@devbookhq/splitter';
import React, { useMemo, useState } from 'react';

interface SplitterProps {
  children: React.ReactNode[];
  // collapses the first pane instead of removing it, so that the number of
  // panes stays constant and the content pane is never remounted
  collapsed?: boolean;
}

export const Splitter: React.FC<SplitterProps> = ({
  children,
  collapsed = false,
}) => {
  const [userSizes, setUserSizes] = useState<[number, number] | null>(null);

  const sizes = useMemo<[number, number]>(
    () => (collapsed ? [0, 100] : userSizes ?? [20, 80]),
    [collapsed, userSizes]
  );
  const direction: SplitDirection = SplitDirection.Horizontal;
  // const cssClass = direction === SplitDirection.Vertical ? 'gutter-vertical' : 'gutter-horizontal'
  const cssClass = 'gutter-horizontal';

  const onResizeFinished = (_pairIdx: number, newSizes: [number, number]) => {
    setUserSizes(newSizes);
  };

  return (
    <div
      css={{
        '& .dragger.Horizontal': {
          height: '100%',
          backgroundColor: 'var(--light-gray)',
          width: 3,
          '&:hover': {
            width: 4,
            backgroundColor: 'var(--top-bar-color)',
            opacity: 0.2,
          },
        },
        '& .gutter-horizontal': {
          height: 'auto !important',
          width: 0.5,
        },
        '& .gutter': {
          display: collapsed ? 'none' : undefined,
          padding: 0,
          marginLeft: '2px',
          marginRight: '2px',
        },
        '& .gutter-content': {
          '@media print': {
            width: '100% !important',
          },
        },
      }}
    >
      <ReactSplit
        classes={['no-print', 'gutter-content']}
        minWidths={collapsed ? [0, 0] : [256, 512]}
        direction={direction}
        gutterClassName={`gutter ${cssClass}`}
        draggerClassName="dragger"
        onResizeFinished={onResizeFinished}
        initialSizes={sizes}
      >
        {children.map((child, index) => (
          <React.Fragment key={index}>
            <Tile>{child}</Tile>
          </React.Fragment>
        ))}
      </ReactSplit>
    </div>
  );
};

interface TileProps {
  children?: React.ReactNode;
}

function Tile({ children }: TileProps) {
  return (
    <div
      css={{
        height: 'inherit',
      }}
    >
      {children}
    </div>
  );
}
