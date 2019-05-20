import * as React from 'react';
import Helmet from 'react-helmet';
import styled from 'styled-components';

const Wrapper = styled.div`
  color: darkslategrey;
`;

const App = () => (
  <>
    <Helmet title="Trains app" />
    <Wrapper>Hello, React!</Wrapper>
  </>
);

export default App;
