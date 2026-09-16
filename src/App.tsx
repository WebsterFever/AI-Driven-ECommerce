import { useLocation } from 'react-router-dom'
import Header from './components/layout/Header'
import { AppRouter } from './routes/AppRouter'

function App() {
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith('/admin')

  return (
    <>
      {!isAdminRoute && <Header />}
      <AppRouter />
    </>
  )
}

export default App
