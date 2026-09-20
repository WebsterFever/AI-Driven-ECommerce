import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { ErrorMessage } from '../../components/ui/ErrorMessage'

function Login() {
  const { login, loginGoogle } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)
    setLoading(true)

    try {
      await login(email, password)
      navigate('/')
    } catch {
      setError('Incorrect email or password.')
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogleLogin() {
    setError(null)
    setLoading(true)

    try {
      await loginGoogle()
      navigate('/')
    } catch {
      setError('Unable to sign in with Google.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-2xl">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-slate-900">Patagonix Tech</h1>
          <p className="mt-1 text-sm text-slate-500">Sign in to your account</p>
        </div>
        {error && <div className="mb-4"><ErrorMessage message={error} /></div>}
        <div className="mb-4">
          <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="mb-6">
          <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <Button type="submit" disabled={loading} fullWidth>
          {loading ? 'Signing in...' : 'Sign in'}
        </Button>
        <div className="my-4 flex items-center gap-3"><div className="h-px flex-1 bg-slate-200" /><span className="text-xs text-slate-400">or</span><div className="h-px flex-1 bg-slate-200" /></div>
        <Button type="button" onClick={handleGoogleLogin} disabled={loading} variant="secondary" fullWidth>Sign in with Google</Button>
        <p className="mt-6 text-center text-sm text-slate-500">Don't have an account?{' '}<Link to="/register" className="font-medium text-blue-600 hover:underline">Create account</Link></p>
      </form>
    </div>
  )
}

export default Login
