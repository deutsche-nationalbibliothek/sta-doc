import ReactSplit, { SplitDirection } from '@devbookhq/splitter';
import React, { useState } from 'react';

interface SplitterProps {
  children?: React.ReactNode[];
}

export const Splitter: React.FC<SplitterProps> = ({ children }) => {
  console.log(children)
  const childs = children.filter(a=>a)
  const [sizes, setSizes] =  useState<[number,number]>([20, 80])
  // const [sizes, setSizes] =  useState<[number,number]>(childs.lentgh === 2 ? [20, 80] : [100])
  const direction: SplitDirection = SplitDirection.Horizontal
  // const cssClass = direction === SplitDirection.Vertical ? 'custom-gutter-vertical' : 'custom-gutter-horizontal'
  const cssClass = 'custom-gutter-horizontal'

  const onResizeFinished = (a,b: [number,number]) => {
    setSizes(b)

  }
  return (
    <ReactSplit
      classes={['splitter', 'splitter']}
      direction={direction}
      gutterClassName={`custom-gutter ${cssClass}`}
      draggerClassName="custom-dragger"
      onResizeFinished={onResizeFinished}
      initialSizes={sizes}
    >
      {childs.map((child, index) => (
        <React.Fragment key={index}>
        <Tile>{child}</Tile>
          {/* <div className="bla" /> */}
          </React.Fragment>
      ))}
    </ReactSplit>
  );
};

interface TileProps {
  children?: React.ReactNode;
}

function Tile({ children }: TileProps) {
  return <div className="tile">
    {children}
  </div>;
}
