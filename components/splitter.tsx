import ReactSplit, { SplitDirection } from '@devbookhq/splitter';
import React, { useState } from 'react';

interface SplitterProps {
  children?: React.ReactNode[];
}

export const Splitter: React.FC<SplitterProps> = ({ children }) => {
  const childs = children.filter((a) => a);
  const [sizes, setSizes] = useState<[number, number]>([20, 80]);
  // const [sizes, setSizes] = useState<[number, number]>(
  //   childs.length === 2 ? [20, 80] : [100, 0]
  // );
  const direction: SplitDirection = SplitDirection.Horizontal;
  // const cssClass = direction === SplitDirection.Vertical ? 'custom-gutter-vertical' : 'custom-gutter-horizontal'
  const cssClass = 'custom-gutter-horizontal';

  const onResizeFinished = (_pairIdx: number, newSizes: [number, number]) => {
    setSizes(newSizes);
  };

  return (
    <ReactSplit
      classes={
        childs.length === 2
          ? ['no-print', 'splitter-content']
          : ['splitter-content']
      }
      direction={direction}
      gutterClassName={`custom-gutter ${cssClass}`}
      draggerClassName="custom-dragger"
      onResizeFinished={onResizeFinished}
      initialSizes={sizes}
    >
      {childs.map((child, index) => (
        <React.Fragment key={index}>
          <Tile>{child}</Tile>
        </React.Fragment>
      ))}
    </ReactSplit>
  );
};

interface TileProps {
  children?: React.ReactNode;
}

function Tile({ children }: TileProps) {
  return <div className="tile">{children}</div>;
}
