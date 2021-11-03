import { Anchor, AnchorExtendedProps } from 'grommet';
import { Link, LinkProps } from 'react-router-dom';

export type AnchorLinkProps = LinkProps & AnchorExtendedProps;

export const AnchorLink: React.FC<AnchorLinkProps> = (props) => {
  return <Anchor as={ (props) => <Link { ...props } /> } { ...props } />;
};
