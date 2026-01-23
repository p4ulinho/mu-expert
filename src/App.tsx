import React, { useState, useEffect } from 'react'
import TitleBar from './components/TitleBar'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import Accounts from './pages/Accounts'
import Proxies from './pages/Proxies'
import Plans from './pages/Plans'
import Scripts from './pages/Scripts'
import Settings from './pages/Settings'
import AccountDefaults from './pages/AccountDefaults'
import ManageModelsAccounts from './pages/ManageModelsAccounts'
import Notifications from './pages/Notifications'
import Groups from './pages/Groups'
import { motion, AnimatePresence } from 'framer-motion'
import { Toaster } from 'react-hot-toast'

const App: React.FC = () => {
  const [user, setUser] = useState<any>(null)
  const [activeTab, setActiveTab] = useState('contas')
  const [isInitializing, setIsInitializing] = useState(true)

  useEffect(() => {
    // Check for saved session
    const savedUser = localStorage.getItem('user_session')
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser)
        // Ensure UUID exists in session, otherwise force re-login for security
        if (parsed && parsed.uuid) {
          setUser(parsed)

            // Refresh user data from server to ensure settings are up to date
            ; (window as any).ipcRenderer.invoke('user:get', parsed.uuid).then((result: any) => {
              if (result && result.success && result.user) {
                console.log('User data refreshed from server:', result.user)
                setUser(result.user)
                localStorage.setItem('user_session', JSON.stringify(result.user))
              }
            }).catch((err: any) => console.error('Failed to refresh user data:', err))

        } else {
          localStorage.removeItem('user_session')
        }
      } catch (e) {
        localStorage.removeItem('user_session')
      }
    }
    setIsInitializing(false)
  }, [])

  const handleLogin = (userData: any, rememberMe: boolean) => {
    if (!userData || !userData.uuid) {
      console.error('Invalid user data received', userData)
      return
    }
    setUser(userData)
    if (rememberMe) {
      try {
        localStorage.setItem('user_session', JSON.stringify(userData))
      } catch (err) {
        console.error('Failed to save session:', err)
      }
    }
  }

  const handleLogout = () => {
    setUser(null)
    setActiveTab('contas')
    localStorage.removeItem('user_session')
  }

  if (isInitializing) {
    return (
      <div className="h-screen flex items-center justify-center bg-background text-primary">
        <div className="animate-pulse font-black italic text-4xl italic tracking-tighter">
          CARREGANDO...
        </div>
      </div>
    )
  }

  if (!user || !user.uuid) {
    return (
      <div className="h-screen flex flex-col bg-background text-textMain">
        <TitleBar title="Multi Contas Expert PS - Login" />
        <Login onLogin={handleLogin} />
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-background text-textMain overflow-hidden">
      <Toaster position="top-right" toastOptions={{ duration: 5000, style: { background: '#1a1a1e', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' } }} />
      <TitleBar />
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} user={user} />

      <main className="flex-1 overflow-y-auto bg-background relative custom-scrollbar">
        <div className="h-full p-6 max-w-full mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -10, filter: 'blur(10px)' }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="h-full"
            >
              {activeTab === 'contas' && <Accounts userUuid={user.uuid} user={user} navigateToTab={setActiveTab} />}
              {activeTab === 'proxies' && <Proxies userUuid={user.uuid} />}
              {activeTab === 'atalhos' && <AccountDefaults user={user} updateUser={setUser} />}
              {activeTab === 'modelos' && <ManageModelsAccounts userUuid={user.uuid} navigateToTab={setActiveTab} />}
              {activeTab === 'planos' && <Plans />}
              {activeTab === 'scripts' && <Scripts user={user} updateUser={setUser} />}
              {activeTab === 'notificacoes' && <Notifications user={user} updateUser={setUser} />}
              {activeTab === 'grupos' && <Groups userUuid={user.uuid} user={user} updateUser={setUser} />}
              {activeTab === 'configuracoes' && <Settings user={user} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}

export default App
