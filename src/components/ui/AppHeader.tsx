import { Button } from './button'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { injected } from 'wagmi/connectors'
import { APP_CONFIG } from '../../config/wagmi'

interface AppHeaderProps {
  className?: string
}

export function AppHeader({ className = '' }: AppHeaderProps) {
  const { address, isConnected } = useAccount()
  const { connect } = useConnect()
  const { disconnect } = useDisconnect()

  return (
    <div className={`text-center space-y-3 ${className}`}>
      {/* Logo et titre */}
      <div className="space-y-1">
                        <div className="flex items-center justify-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-lg" style={{ background: 'var(--gradient-nature)', boxShadow: 'var(--shadow-md)' }}>
                    <span className="text-xl">🌱</span>
                  </div>
                  <h1 className="text-xl font-bold" style={{ background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                    Signal Garden
                  </h1>
                </div>
        <p className="text-secondary text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
          Token-curated knowledge sur Intuition Testnet
        </p>
      </div>

      {/* Wallet Connection */}
      <div className="flex justify-center">
        {!isConnected ? (
          <Button 
            onClick={() => connect({ connector: injected() })}
            className="text-white shadow-md font-medium"
            style={{ background: 'var(--gradient-primary)', boxShadow: 'var(--shadow-md)' }}
          >
            <span className="mr-2">🔗</span>
            Connecter Wallet
          </Button>
        ) : (
          <div className="flex items-center gap-3 rounded-lg px-4 py-2 shadow-md" style={{ backgroundColor: 'var(--bg-overlay)', backdropFilter: 'blur(8px)', border: '1px solid var(--border-light)' }}>
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--success-500)' }}></div>
            <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
              {address?.slice(0, 6)}...{address?.slice(-4)}
            </span>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => disconnect()}
              className="text-xs"
            >
              Déconnecter
            </Button>
          </div>
        )}
      </div>

                        {/* Network Info */}
                  <div className="text-xs rounded-lg px-3 py-1 inline-block" style={{ color: 'var(--text-secondary)', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-light)' }}>
                    Network: Intuition Testnet (Chain ID: {APP_CONFIG.CHAIN_ID})
                  </div>
    </div>
  )
}
