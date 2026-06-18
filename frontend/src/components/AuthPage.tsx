import { type FormEvent, useMemo, useState } from 'react'
import './AuthPage.css'

type AuthMode = 'login' | 'register'

type AuthResponse = {
  success: boolean
  message?: string
  data?: {
    user?: {
      id: string
      fullName: string
      email: string
      role: string
    }
    token?: string
  }
}

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000'

function AuthPage() {
  const [mode, setMode] = useState<AuthMode>('login')
  const [fullName, setFullName] = useState('')
  const [dateOfBirth, setDateOfBirth] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const isRegister = mode === 'register'
  const title = useMemo(
    () => (isRegister ? 'Tạo tài khoản' : 'Đăng nhập hoặc Tạo tài khoản'),
    [isRegister],
  )

  const resetFeedback = () => {
    setMessage('')
    setError('')
  }

  const handleModeChange = (nextMode: AuthMode) => {
    setMode(nextMode)
    resetFeedback()
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    resetFeedback()

    if (isRegister && password !== confirmPassword) {
      setError('Mật khẩu xác nhận chưa khớp.')
      return
    }

    setIsSubmitting(true)

    try {
      const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login'
      const payload = isRegister
        ? { fullName, dateOfBirth, email, password, confirmPassword }
        : { email, password }

      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      })

      const result = (await response.json()) as AuthResponse

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Có lỗi xảy ra, vui lòng thử lại.')
      }

      if (isRegister) {
        setMode('login')
        setPassword('')
        setConfirmPassword('')
        setMessage('Đăng ký tài khoản thành công. Vui lòng đăng nhập để tiếp tục.')
        return
      }

      window.location.href = '/homepage.html'
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Không thể kết nối máy chủ.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-panel" aria-labelledby="auth-title">
        <div className="auth-form-area">
          <div className="auth-tabs" aria-label="Chọn thao tác tài khoản">
            <button
              className={mode === 'login' ? 'auth-tab auth-tab--active' : 'auth-tab'}
              type="button"
              onClick={() => handleModeChange('login')}
            >
              Đăng nhập
            </button>
            <button
              className={mode === 'register' ? 'auth-tab auth-tab--active' : 'auth-tab'}
              type="button"
              onClick={() => handleModeChange('register')}
            >
              Đăng kí
            </button>
          </div>

          <h1 id="auth-title">{title}</h1>
          <p className="auth-subtitle">Vui lòng đăng nhập để nhận nhiều ưu đãi</p>

          <form className="auth-form" onSubmit={handleSubmit}>
            {isRegister && (
              <label className="auth-field">
                <span>Họ tên</span>
                <input
                  autoComplete="name"
                  minLength={2}
                  onChange={(event) => setFullName(event.target.value)}
                  placeholder="Nguyễn Văn A"
                  required
                  type="text"
                  value={fullName}
                />
              </label>
            )}

            {isRegister && (
              <label className="auth-field">
                <span>Ngày sinh</span>
                <input
                  autoComplete="bday"
                  onChange={(event) => setDateOfBirth(event.target.value)}
                  required
                  type="date"
                  value={dateOfBirth}
                />
              </label>
            )}

            <label className="auth-field">
              <span>Email</span>
              <input
                autoComplete="email"
                onChange={(event) => setEmail(event.target.value)}
                placeholder="email@example.com"
                required
                type="email"
                value={email}
              />
            </label>

            <label className="auth-field">
              <span>Mật khẩu</span>
              <input
                autoComplete={isRegister ? 'new-password' : 'current-password'}
                minLength={6}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Tối thiểu 6 ký tự"
                required
                type="password"
                value={password}
              />
            </label>

            {isRegister && (
              <label className="auth-field">
                <span>Xác nhận mật khẩu</span>
                <input
                  autoComplete="new-password"
                  minLength={6}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder="Nhập lại mật khẩu"
                  required
                  type="password"
                  value={confirmPassword}
                />
              </label>
            )}

            {error && <p className="auth-alert auth-alert--error">{error}</p>}
            {message && <p className="auth-alert auth-alert--success">{message}</p>}

            <button className="auth-submit" disabled={isSubmitting} type="submit">
              {isSubmitting ? 'Đang xử lý...' : isRegister ? 'Tạo tài khoản' : 'Tiếp tục'}
            </button>
          </form>
        </div>

        <aside className="auth-promo" aria-label="Khuyến mãi rạp phim">
          <div className="promo-brand">
            <span className="promo-logo">L</span>
            <span>LOTTE CINEMA</span>
          </div>
          <div className="promo-map" aria-hidden="true">
            <span className="map-line map-line--one" />
            <span className="map-line map-line--two" />
            <span className="map-line map-line--three" />
          </div>
          <div className="promo-token promo-token--red">
            <span>VIP</span>
          </div>
          <div className="promo-token promo-token--pink">
            <span>POP</span>
          </div>
          <div className="promo-token promo-token--green">
            <span>2D</span>
          </div>
          <div className="promo-copy">
            <span>NEW MERCHANDISE</span>
            <strong>COMBO CÙNG MÓC KHÓA XOAY</strong>
            <b>ONEPIECE</b>
          </div>
        </aside>
      </section>
    </main>
  )
}

export default AuthPage
