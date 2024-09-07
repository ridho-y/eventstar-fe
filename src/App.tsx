import React from 'react';
import Router from './Router';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { ConfigProvider } from 'antd';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      light: '#1A759F',
      main: '#1E6091',
      dark: '#184E77',
    },
    secondary: {
      light: '#52b69a',
      main: '#34a0a4',
      dark: '#168aad',
    }
  }
});

function App () {
  return (
    <>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#34a0a4',
          },
        }}
      >
        <ThemeProvider theme={theme}>
          <Router />
        </ThemeProvider>
      </ConfigProvider>
    </>
  );
}

export default App;
