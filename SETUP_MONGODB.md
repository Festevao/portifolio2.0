# Configuração do MongoDB para a página "Our Space"

## 1. Configurar variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:

```env
# MongoDB Connection String
MONGODB_URI=mongodb://localhost:27017/portifolio
# ou para MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/portifolio?retryWrites=true&w=majority

# Base URL da aplicação (usado no getServerSideProps)
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

**Nota:** Não é necessário API key para o clima! A aplicação usa a [Open-Meteo API](https://open-meteo.com/en/docs) que é completamente gratuita e sem necessidade de autenticação. ✨

## 2. Estrutura do banco de dados

### Collection: `users`

A collection `users` deve ter a seguinte estrutura:

```json
{
  "_id": "ObjectId",
  "username": "string (único)",
  "nome": "string",
  "dataNascimento": "Date",
  "email": "string",
  "telefone": "string",
  "bio": "string (opcional)",
  "avatar": "string (opcional - URL da imagem)",
  "createdAt": "Date (opcional)",
  "updatedAt": "Date (opcional)"
}
```

### Exemplo de documento:

```javascript
db.users.insertMany([
  {
    username: "joao",
    nome: "João Silva",
    dataNascimento: new Date("1995-03-15"),
    email: "joao@email.com",
    telefone: "(11) 99999-9999",
    bio: "Desenvolvedor apaixonado por tecnologia",
    avatar: "https://i.pravatar.cc/300?img=12",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    username: "maria",
    nome: "Maria Santos",
    dataNascimento: new Date("1997-07-22"),
    email: "maria@email.com",
    telefone: "(21) 98888-8888",
    bio: "Designer e desenvolvedora frontend",
    avatar: "https://i.pravatar.cc/300?img=20",
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);
```

## 3. Como usar a página

Acesse a página passando os usernames como query params:

```
http://localhost:3000/our-space?me=joao&other=maria
```

### Comportamento:

- ✅ Se ambos os usuários existirem: exibe a página com as informações e clima
- ❌ Se um ou ambos não existirem: redireciona para a home (`/`)
- ❌ Se os query params não forem fornecidos: redireciona para a home (`/`)
- 📍 A página solicitará permissão para acessar sua localização (necessário para obter o clima)

## 4. Funcionalidades da página

### 🌍 Geolocalização em Tempo Real

A página usa a **Geolocation API do navegador** para obter a localização atual do usuário que está acessando, não usa dados salvos no banco. Isso significa que o clima mostrado será sempre baseado na localização atual de quem está visualizando a página.

### 🌤️ Background Animado Baseado no Clima

A página busca automaticamente o clima da localização atual do usuário usando a [Open-Meteo API](https://open-meteo.com/en/docs) e ajusta o design:

#### Período do Dia:
- **☀️ Dia** (`is_day = 1`): Fundo amarelado/laranja com sol animado
- **🌙 Noite** (`is_day = 0`): Fundo roxo/escuro com lua crescente animada

#### Condições Climáticas (baseado nos códigos WMO):
- **☀️ Céu Limpo** (código 0): Apenas sol/lua, sem elementos extras
- **☁️ Céu Nublado** (códigos 1-3, 45, 48): Nuvens animadas flutuando
- **🌧️ Chuva** (códigos 51-67, 80-86): Nuvens + animação de gotas de chuva caindo
- **❄️ Neve** (códigos 71-77): Nuvens (pode ser expandido futuramente)
- **⛈️ Tempestade** (códigos 95-99): Nuvens + chuva forte

### 📱 Responsivo
- Design adaptado para desktop e mobile
- Animações otimizadas para cada tamanho de tela

### 🔄 Estados de Loading
- Tela de loading enquanto obtém a localização
- Tela de loading enquanto busca o clima
- Tela de erro caso o usuário negue permissão de localização

## 5. API do Clima - Open-Meteo

A aplicação utiliza a [Open-Meteo Weather Forecast API](https://open-meteo.com/en/docs), que oferece:

### Vantagens:
- ✅ **Totalmente gratuita** - sem necessidade de cadastro ou API key
- ✅ **Sem limite de requisições** para uso não comercial
- ✅ **Dados precisos** - agregação de múltiplos modelos meteorológicos
- ✅ **Código WMO padronizado** - interpretação universal do clima
- ✅ **API de geocoding incluída** - conversão de coordenadas em nomes de cidade

### Endpoints utilizados:

**1. Weather Forecast:**
```
https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current=temperature_2m,weather_code,is_day&timezone=auto
```

**2. Reverse Geocoding:**
```
https://geocoding-api.open-meteo.com/v1/search?latitude={lat}&longitude={lon}&count=1&language=pt&format=json
```

### Códigos WMO Weather (WW):
| Código | Descrição |
|--------|-----------|
| 0 | Céu limpo |
| 1, 2, 3 | Predominantemente limpo, parcialmente nublado, nublado |
| 45, 48 | Neblina |
| 51-57 | Garoa (leve a forte) |
| 61-67 | Chuva (leve a forte) |
| 71-77 | Neve |
| 80-86 | Pancadas de chuva/neve |
| 95-99 | Tempestade |

## 6. Arquitetura da solução

### Arquivos criados:

#### Tipos e Interfaces:
1. **`src/types/User.ts`** - Tipagem TypeScript do usuário
2. **`src/types/Weather.ts`** - Tipagem dos dados do clima

#### Backend:
3. **`src/lib/mongodb.ts`** - Configuração da conexão com MongoDB
4. **`src/pages/api/users/check.ts`** - API route que busca os usuários
5. **`src/pages/api/weather/get.ts`** - API route que busca o clima via Open-Meteo

#### Hooks:
6. **`src/hooks/useGeolocation.ts`** - Hook customizado para obter localização do navegador

#### Componentes:
7. **`src/components/WeatherBackground/Sun.tsx`** - Animação do sol
8. **`src/components/WeatherBackground/Moon.tsx`** - Animação da lua
9. **`src/components/WeatherBackground/Clouds.tsx`** - Animação de nuvens
10. **`src/components/WeatherBackground/Rain.tsx`** - Animação de chuva
11. **`src/components/WeatherBackground/WeatherBackground.tsx`** - Componente principal do clima

#### Página:
12. **`src/pages/our-space/index.tsx`** - Página principal

#### Estilos:
13. **`src/styles/globals.css`** - Animações CSS customizadas

### Fluxo de execução:

1. Usuário acessa `/our-space?me=joao&other=maria`
2. **Server-side**: `getServerSideProps` valida os query params
3. **Server-side**: Chama a API `/api/users/check?me=joao&other=maria`
4. **Server-side**: API consulta o MongoDB e retorna os usuários
5. **Server-side**: Se tudo ok, renderiza a página (caso contrário, redireciona)
6. **Client-side**: Página solicita permissão de localização do navegador
7. **Client-side**: Navegador retorna latitude e longitude
8. **Client-side**: Chama a API `/api/weather/get?lat=-23.5505&lon=-46.6333`
9. **Client-side**: API consulta a Open-Meteo e retorna o clima
10. **Client-side**: Página renderiza o fundo animado baseado no clima

## 7. Próximos passos

- ✅ Configure o MongoDB localmente ou use MongoDB Atlas
- ✅ Adicione o arquivo `.env.local` com suas credenciais (apenas MongoDB URI)
- ✅ Insira dados de teste na collection `users`
- ✅ Teste a aplicação acessando a rota com query params válidos
- ✅ **Permita o acesso à localização quando o navegador solicitar**

## 8. Animações implementadas

### ☀️ Sol:
- Rotação lenta dos raios
- Pulsação suave do núcleo
- Movimento de flutuação

### 🌙 Lua:
- Brilho pulsante
- Movimento de flutuação
- Crateras decorativas

### ☁️ Nuvens:
- Movimento horizontal contínuo
- Três velocidades diferentes
- Adaptação de cor (branco no dia, roxo à noite)

### 🌧️ Chuva:
- 50 gotas animadas
- Posições e delays aleatórios
- Movimento de queda contínuo

## 9. Permissões necessárias

⚠️ **Importante**: O navegador solicitará permissão para acessar sua localização. É necessário permitir para que a página funcione corretamente e exiba o clima personalizado.

### Como permitir localização:

**Chrome/Edge:**
- Clique no ícone de cadeado/informação na barra de endereço
- Localize "Localização" e selecione "Permitir"

**Firefox:**
- Clique no ícone de escudo/informação na barra de endereço
- Localize "Localização" e selecione "Permitir"

**Safari:**
- Safari > Preferências > Sites > Localização
- Encontre o site e selecione "Permitir"

## 10. Referências

- [Open-Meteo Weather API Documentation](https://open-meteo.com/en/docs)
- [Open-Meteo Geocoding API](https://open-meteo.com/en/docs/geocoding-api)
- [WMO Weather Interpretation Codes](https://www.nodc.noaa.gov/archive/arc0021/0002199/1.1/data/0-data/HTML/WMO-CODE/WMO4677.HTM)
