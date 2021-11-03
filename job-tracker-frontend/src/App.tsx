import { Box, Grommet, Heading } from 'grommet';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { ApplicationNew } from './components/ApplicationNew';
import { ApplicationShow } from './components/ApplicationShow';
import { Home } from './components/Home';

const theme = {
  global: {
   colors: {
     brand: '#228BE6',
   },
    font: {
      family: 'Roboto',
      size: '18px',
      height: '20px',
    },
  },
};

export const App = () => (
  <Grommet theme={ theme } full>
    <BrowserRouter>
      <Box align="center">
        <Box as="header" fill="horizontal" background="brand" align="center">
          <Box width="large">
            <Heading color="white" level="1">Job Tracker</Heading>
          </Box>
        </Box>
        <Box width="large" pad={ { top: 'medium' } }>
          <Switch>
            <Route exact path="/" component={ Home } />
            <Route exact path="/applications/new" component={ ApplicationNew } />
            <Route exact path="/applications/:slug" component={ ApplicationShow } />
          </Switch>
        </Box>
      </Box>
    </BrowserRouter>
  </Grommet>
);
