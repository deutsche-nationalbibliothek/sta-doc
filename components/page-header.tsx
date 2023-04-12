interface PageHeaderProps {
  title?: JSX.Element | string;
  extra?: JSX.Element;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, extra }) => {
  return <>{title}</>;
};
