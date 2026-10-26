import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { BrowserRouter, Route, Routes } from 'react-router'
import { NavBar } from './components/NavBar/NavBar'
import { ProspectsPage } from './components/ProspectsPage/ProspectsPage'
import { AppContext, defaultAppContext } from './contexts/AppContext'

const theme = createTheme({
  colorSchemes: {
    dark: true,
    light: true,
  },
  palette: {
    mode: 'dark',
    primary: {
      main: '#E2A0FF',
    },
    secondary: {
      main: '#90F3FF',
    },
    tertiary: {
      main: '#0e6fff', // Replace with your tertiary color hex
    },
    tertiaryVariant: {
      main: '#c4dcff', // Replace with your tertiary color hex
    },
    text: {
      secondary: '#6bc3e2',
    },
    background: {
      default: '#000000',
      paper: '#111111',
    },
  },
})

/**
 * The React App with the navbar, pages, routing, etc...
 * It includes the whole App Layout.
 */
export function App() {
  return (
    <div className='app'>
      <ThemeProvider theme={theme} defaultMode='dark'>
        <CssBaseline enableColorScheme />
        <AppContext.Provider value={defaultAppContext}>
          <BrowserRouter>
            <NavBar />
            <Routes>
              <Route index element={<>Use the navbar to navigate.</>} />
              <Route path='prospects' element={<ProspectsPage />} />
            </Routes>
          </BrowserRouter>
        </AppContext.Provider>
      </ThemeProvider>
    </div>
  )
}
