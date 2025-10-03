import { useState, useEffect, useCallback } from 'react';
import jwt from 'jsonwebtoken';

interface AuthState {
  isAuthenticated: boolean;
  loading: boolean;
  user: any | null;
  error: string | null;
}

/**
 * Hook para gerenciar autenticação com JWT
 * Inclui refresh automático de tokens
 */
export const useAuth = (username: string) => {
  // Estado inicial sempre consistente (servidor e cliente)
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    loading: true,
    user: null,
    error: null
  });

  // Flag para saber se já hidratou no cliente
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Verificação rápida só no cliente (após hidratação)
  useEffect(() => {
    if (!isClient) return;

    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      try {
        const decoded: any = jwt.decode(accessToken);
        if (decoded && decoded.exp && decoded.username === username) {
          const currentTime = Date.now() / 1000;
          if (decoded.exp > currentTime) {
            setAuthState({
              isAuthenticated: true,
              loading: false,
              user: { username: decoded.username, userId: decoded.userId },
              error: null
            });
            return;
          }
        }
      } catch (error) {
        // Token inválido, continua com verificação completa
      }
    }

    // Se não passou na verificação rápida, fazer verificação completa
    checkAuth();
  }, [isClient, username]);

  /**
   * Verifica se um token JWT está válido
   */
  const isTokenValid = (token: string): boolean => {
    try {
      const decoded: any = jwt.decode(token);
      if (!decoded || !decoded.exp) return false;
      
      const currentTime = Date.now() / 1000;
      return decoded.exp > currentTime;
    } catch {
      return false;
    }
  };

  /**
   * Renova o access token usando refresh token
   */
  const refreshAccessToken = useCallback(async (): Promise<boolean> => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken || !isTokenValid(refreshToken)) {
        return false;
      }

      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ refreshToken })
      });

      const data = await response.json();

      if (data.success && data.accessToken) {
        localStorage.setItem('accessToken', data.accessToken);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Erro ao renovar token:', error);
      return false;
    }
  }, []);

  /**
   * Verifica autenticação atual
   */
  const checkAuth = useCallback(async () => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');

      // Se não tem tokens, não está autenticado
      if (!accessToken && !refreshToken) {
        setAuthState({
          isAuthenticated: false,
          loading: false,
          user: null,
          error: null
        });
        return;
      }

      // Se access token é válido, está autenticado
      if (accessToken && isTokenValid(accessToken)) {
        const decoded: any = jwt.decode(accessToken);
        if (decoded && decoded.username === username) {
          setAuthState({
            isAuthenticated: true,
            loading: false,
            user: { username: decoded.username, userId: decoded.userId },
            error: null
          });
          return;
        }
      }

      // Tentar renovar access token
      const refreshed = await refreshAccessToken();
      
      if (refreshed) {
        const newAccessToken = localStorage.getItem('accessToken');
        const decoded: any = jwt.decode(newAccessToken!);
        
        if (decoded && decoded.username === username) {
          setAuthState({
            isAuthenticated: true,
            loading: false,
            user: { username: decoded.username, userId: decoded.userId },
            error: null
          });
          return;
        }
      }

      // Se chegou até aqui, não conseguiu autenticar
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      
      setAuthState({
        isAuthenticated: false,
        loading: false,
        user: null,
        error: 'Sessão expirada'
      });

    } catch (error) {
      console.error('Erro na verificação de autenticação:', error);
      setAuthState({
        isAuthenticated: false,
        loading: false,
        user: null,
        error: 'Erro na autenticação'
      });
    }
  }, [username, refreshAccessToken]);

  /**
   * Faz logout removendo tokens
   */
  const logout = useCallback(() => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setAuthState({
      isAuthenticated: false,
      loading: false,
      user: null,
      error: null
    });
  }, []);

  /**
   * Configuração de interval para verificação periódica
   */
  useEffect(() => {
    if (!isClient) return;

    // Verificar tokens a cada 5 minutos (só se autenticado)
    const interval = setInterval(() => {
      if (authState.isAuthenticated) {
        checkAuth();
      }
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [isClient, checkAuth, authState.isAuthenticated]);

  return {
    ...authState,
    checkAuth,
    logout,
    refreshAccessToken
  };
};