import ReactSplit, { SplitDirection } from '@devbookhq/splitter';
import React, { useState } from 'react';

interface SplitterProps {
  children?: React.ReactNode[];
}

export const Splitter: React.FC<SplitterProps> = ({ children }) => {
  const childs = children?.filter((a) => a) ?? [];
  const [sizes, setSizes] = useState<[number, number]>([20, 80]);
  // const [sizes, setSizes] = useState<[number, number]>(
  //   childs.length === 2 ? [20, 80] : [100, 0]
  // );
  const direction: SplitDirection = SplitDirection.Horizontal;
  // const cssClass = direction === SplitDirection.Vertical ? 'gutter-vertical' : 'gutter-horizontal'
  const cssClass = 'gutter-horizontal';

  const onResizeFinished = (_pairIdx: number, newSizes: [number, number]) => {
    setSizes(newSizes);
  };

  return (
    <div
      css={{
        '& .dragger.Horizontal': {
          height: '100%',
          backgroundColor: 'var(--dark-gray)',
          width: 3,
          '&:hover': {
            width: 4,
            backgroundColor: 'var(--top-bar-color)',
            opacity: 0.2,
          },
        },
        '& .gutter-horizontal': {
          padding: '0 2px !important',
          height: 'auto !important',
          width: 0.5,
        },
        '& .gutter': {
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
        classes={
          childs.length === 2
            ? ['no-print', 'gutter-content']
            : ['gutter-content']
        }
        minWidths={childs.length === 2 ? [256, 512] : []}
        direction={direction}
        gutterClassName={`gutter ${cssClass}`}
        draggerClassName="dragger"
        onResizeFinished={onResizeFinished}
        initialSizes={sizes}
      >
        {childs.map((child, index) => (
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
      className="tile"
    >
      {children}
    </div>
  );
}
