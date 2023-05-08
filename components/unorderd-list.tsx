import { PropsWithChildren } from 'react';

export const UnorderedList = ({ children }: PropsWithChildren) => {
  return (
    <ul
      css={{
        listStyle: 'none',
        paddingLeft: 0,
        '& li': { marginTop: '0.2em' },
      }}
    >
      {children}
    </ul>
  );
};
