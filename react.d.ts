import 'react'

declare global {
    namespace JSX {
interface IntrinsicElements extends React.IntrinsicElements {
    h7: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
    topmenu: React.DetailedHTMLProps<React.HTMLAttributes<any>, any>;
  }
  }
}
