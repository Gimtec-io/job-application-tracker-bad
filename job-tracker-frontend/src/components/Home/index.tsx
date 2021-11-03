import { Box } from 'grommet';
import { useEffect } from 'react';
import { AnchorLink } from '../AnchorLink';
import { useAPI } from '../../hooks/useQuery';
import { Application } from '../../models';
import { List, Text } from 'grommet';
import { useHistory } from 'react-router';

export const Home = () => {
  const [getApplications, { data: applications, error, isLoading }] = useAPI<Application[]>('/applications');
  const history = useHistory();

  useEffect(() => {
    getApplications();
  }, [getApplications]);
  
  if (error) {
    return <div>Error</div>;
  }

  if (isLoading || !applications) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Box margin={ { bottom: 'medium' } }>
        <AnchorLink to="/applications/new" label="Create new application" />
      </Box>
      <List
        data={ applications }
        primaryKey={
          (application: Application) => <Text key={ `status-${application.id}` } weight="bold">{ application.status.content }</Text>
        }
        secondaryKey={
          (application: Application) => (
            <Text key={ `title-${application.id}` }>
              { `${application.position} @ ${application.company}` }
            </Text>
          )
        }
        onClickItem={
          ({ item }: { item?: Application }) => {
            if (item) {
              history.push(`/applications/${item.slug}`)
            }
          }
        }
      />
    </>
  );
}
