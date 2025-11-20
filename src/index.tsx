import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './MainAppContent.tsx';
import '../index.css';
import { AuthProvider } from './AuthContext';

// 1. IMPORTAÇÃO CRÍTICA PARA INICIALIZAÇÃO (Side Effect)
import { auth } from './firebase/firebaseClient'; 

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);

// Verifica se o Firebase Auth foi inicializado (se as chaves estão corretas)
if (!auth) {
    // Renderiza uma tela de erro em vez da tela preta
    root.render(
        <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fee2e2', color: '#dc2626', fontSize: '20px', padding: '20px' }}>
            ERRO CRÍTICO: Falha ao carregar o Firebase. Verifique a chave de configuração.
        </div>
    );
} else {
    root.render(
      <React.StrictMode>
        {/* 2. PASSA A INSTÂNCIA 'auth' para o AuthProvider */}
        <AuthProvider auth={auth}> 
          <App />
        </AuthProvider>
      </React.StrictMode>
    );
}