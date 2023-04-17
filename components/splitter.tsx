import ReactSplit, { SplitDirection } from '@devbookhq/splitter';
import React, { useEffect, useState } from 'react';

interface SplitterProps {
  children: React.ReactNode[];
}

export const Splitter: React.FC<SplitterProps> = ({ children }) => {
  const [sizes, setSizes] = useState<[number, number]>();
  useEffect(() => {
    setSizes(children.length === 2 ? [20, 80] : [100, 0]);
  }, [children.length]);
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
          children.length === 2
            ? ['no-print', 'gutter-content']
            : ['gutter-content']
        }
        minWidths={children.length === 2 ? [256, 512] : [100, 0]}
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
