import NextAuth from 'next-auth'
import SpotifyProvider from 'next-auth/providers/spotify'
import { AuthOptions } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    accessToken?: string
  }
  
  interface JWT {
    accessToken?: string
    refreshToken?: string
    accessTokenExpires?: number
  }
}

export const authOptions = {
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID!,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: 'playlist-read-private playlist-modify-public playlist-modify-private user-read-email user-read-private'
        }
      }
    })
  ],
  callbacks: {
    async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
      // Se a URL contém parâmetros de query, preserva eles
      if (url.includes('?')) {
        const urlObj = new URL(url, baseUrl)
        const searchParams = urlObj.searchParams
        
        // Se tem parâmetros me e other, redireciona para our-space
        if (searchParams.get('me') && searchParams.get('other')) {
          return `${baseUrl}/our-space?me=${searchParams.get('me')}&other=${searchParams.get('other')}`
        }
      }
      
      // Se a URL for relativa, usa a baseUrl (ngrok)
      if (url.startsWith("/")) return `${baseUrl}${url}`
      // Se a URL for do mesmo domínio, permite
      else if (new URL(url).origin === baseUrl) return url
      // Caso contrário, redireciona para a baseUrl
      return baseUrl
    },
    async jwt({ token, account, user }: { token: any; account: any; user: any }) {
      console.log('JWT callback called with:', {
        hasAccount: !!account,
        hasToken: !!token,
        hasUser: !!user,
        accountKeys: account ? Object.keys(account) : [],
        tokenKeys: token ? Object.keys(token) : []
      })
      
      // Persist the OAuth access_token to the token right after signin
      if (account) {
        token.accessToken = account.access_token
        token.refreshToken = account.refresh_token
        token.accessTokenExpires = Date.now() + (account.expires_in * 1000) - 60000 // 1 minuto antes
        console.log('JWT callback - account found:', {
          hasAccessToken: !!account.access_token,
          hasRefreshToken: !!account.refresh_token,
          tokenType: account.token_type,
          accessTokenLength: account.access_token?.length,
          expiresIn: account.expires_in
        })
      }
      
      // Refresh token if it's about to expire (check every time)
      if (token.refreshToken) {
        const now = Date.now();
        const expiresAt = token.accessTokenExpires || 0;
        const timeUntilExpiry = expiresAt - now;
        
        console.log('Token check:', {
          now: new Date(now).toISOString(),
          expiresAt: new Date(expiresAt).toISOString(),
          timeUntilExpiry: Math.round(timeUntilExpiry / 1000) + 's',
          needsRefresh: timeUntilExpiry < 300000 // 5 minutes before expiry
        });
        
        // Refresh if expired or expiring in less than 5 minutes
        if (timeUntilExpiry < 300000) {
          console.log('Token expiring soon, refreshing...')
          try {
            const response = await fetch('https://accounts.spotify.com/api/token', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${Buffer.from(
                  `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
                ).toString('base64')}`
              },
              body: new URLSearchParams({
                grant_type: 'refresh_token',
                refresh_token: token.refreshToken
              })
            })
            
            const refreshedTokens = await response.json()
            
            if (response.ok) {
              console.log('Token refreshed successfully:', {
                newExpiresAt: new Date(Date.now() + (refreshedTokens.expires_in * 1000)).toISOString()
              })
              token.accessToken = refreshedTokens.access_token
              token.accessTokenExpires = Date.now() + (refreshedTokens.expires_in * 1000) - 60000 // 1 minute buffer
              
              // Update refresh token if provided
              if (refreshedTokens.refresh_token) {
                token.refreshToken = refreshedTokens.refresh_token
              }
            } else {
              console.error('Failed to refresh token:', refreshedTokens)
              // Clear tokens if refresh fails
              token.accessToken = null
              token.refreshToken = null
              token.accessTokenExpires = null
            }
          } catch (error) {
            console.error('Error refreshing token:', error)
            // Clear tokens if refresh fails
            token.accessToken = null
            token.refreshToken = null
            token.accessTokenExpires = null
          }
        }
      }
      
      console.log('JWT callback - final token:', {
        hasAccessToken: !!token.accessToken,
        hasRefreshToken: !!token.refreshToken,
        accessTokenLength: token.accessToken?.length,
        expiresAt: token.accessTokenExpires ? new Date(token.accessTokenExpires).toISOString() : null
      })
      
      return token
    },
    async session({ session, token }: { session: any; token: any }) {
      console.log('Session callback called with:', {
        hasToken: !!token,
        tokenKeys: token ? Object.keys(token) : [],
        hasSession: !!session,
        sessionKeys: session ? Object.keys(session) : []
      })
      
      // Send properties to the client
      session.accessToken = token.accessToken as string;
      
      console.log('Session callback - final session:', {
        hasAccessToken: !!session.accessToken,
        accessTokenLength: session.accessToken?.length,
        userEmail: session.user?.email
      })
      
      return session
    }
  },
  pages: {
    signIn: '/our-space'
  },
  session: {
    strategy: 'jwt'
  }
}

const handler = NextAuth(authOptions as AuthOptions)

export default handler