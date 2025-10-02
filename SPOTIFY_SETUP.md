# Spotify API Configuration

## Variáveis de Ambiente Necessárias

Adicione as seguintes variáveis ao seu arquivo `.env.local`:

```bash
# Spotify App Configuration
SPOTIFY_CLIENT_ID=your_spotify_client_id_here
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret_here

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here
```

## Como Configurar o App no Spotify

1. **Acesse o Spotify Developer Dashboard**
   - Vá para: https://developer.spotify.com/dashboard
   - Faça login com sua conta Spotify

2. **Crie um novo App**
   - Clique em "Create App"
   - Preencha os dados:
     - **App name**: Seu app name
     - **App description**: Descrição do seu app
     - **Website**: http://localhost:3000 (para desenvolvimento)
     - **Redirect URI**: http://localhost:3000/api/auth/callback/spotify

3. **Obtenha as Credenciais**
   - Após criar o app, você verá o **Client ID** e **Client Secret**
   - Copie esses valores para o arquivo `.env.local`

4. **Configurar Permissões**
   - No dashboard do app, vá em "Edit Settings"
   - Adicione as seguintes URLs de redirecionamento:
     - `http://localhost:3000/api/auth/callback/spotify` (desenvolvimento)
     - `https://seudominio.com/api/auth/callback/spotify` (produção)

## Scopes Necessários

O app está configurado para solicitar as seguintes permissões:
- `playlist-read-private`: Ler playlists privadas
- `playlist-modify-public`: Modificar playlists públicas
- `playlist-modify-private`: Modificar playlists privadas
- `user-read-email`: Ler email do usuário
- `user-read-private`: Ler informações privadas do usuário

## Como Testar

1. **Inicie o servidor de desenvolvimento**
   ```bash
   npm run dev
   ```

2. **Acesse a página de música**
   - Vá para a página "Nosso Espaço"
   - Clique em "Criar Playlist Compartilhada"
   - Você será redirecionado para o Spotify para autenticação

3. **Autentique com Spotify**
   - Faça login com sua conta Spotify
   - Autorize as permissões solicitadas
   - Você será redirecionado de volta para o app

4. **Teste as funcionalidades**
   - Crie uma playlist no Spotify
   - Cole a URL da playlist no app
   - Busque e adicione músicas
   - Veja as músicas sendo carregadas da playlist real

## Troubleshooting

### Erro de CORS
Se você encontrar erros de CORS, verifique se:
- A URL de redirecionamento está correta no dashboard do Spotify
- O `NEXTAUTH_URL` está configurado corretamente

### Erro de Autenticação
Se a autenticação falhar:
- Verifique se o Client ID e Secret estão corretos
- Confirme se as URLs de redirecionamento estão configuradas
- Verifique se o app está ativo no dashboard do Spotify

### Erro de Permissões
Se você não conseguir acessar playlists:
- Verifique se o usuário tem as permissões necessárias
- Confirme se os scopes estão configurados corretamente
- Teste com uma playlist pública primeiro
