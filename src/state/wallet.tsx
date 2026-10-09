import { createContext, ReactNode, useContext, useMemo, useState } from 'react';
import { initialTransactions, Transaction } from '@/data/mock';

type PaymentMethod = 'pix' | 'card' | 'transfer';

type WalletState = {
  balance: number;
  transactions: Transaction[];
  topUp: (amount: number, method: PaymentMethod) => void;
};

const WalletContext = createContext<WalletState | null>(null);

const methodLabel: Record<PaymentMethod, string> = {
  pix: 'Recarga via Pix',
  card: 'Recarga no cartão',
  transfer: 'Transferência recebida',
};

export function WalletProvider({ children }: { children: ReactNode }) {
  const [balance, setBalance] = useState(10);
  const [transactions, setTransactions] = useState(initialTransactions);

  const value = useMemo<WalletState>(
    () => ({
      balance,
      transactions,
      topUp(amount, method) {
        setBalance((b) => b + amount);
        setTransactions((list) => [
          { id: String(Date.now()), title: methodLabel[method], subtitle: 'Agora', amount, kind: 'topup' },
          ...list,
        ]);
      },
    }),
    [balance, transactions],
  );

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
}

export function useWallet() {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error('useWallet must be used inside WalletProvider');
  return ctx;
}

export type { PaymentMethod };
