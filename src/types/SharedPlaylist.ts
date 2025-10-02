/**
 * Representa uma playlist compartilhada entre dois usuários
 * Apenas armazena a referência para a playlist no Spotify
 */
export interface SharedPlaylist {
  _id?: string;
  participants: string[]; // array de usernames dos participantes
  playlistUrl: string; // URL da playlist no Spotify
  playlistId?: string; // ID da playlist no Spotify (extraído da URL)
  createdAt: Date;
  updatedAt: Date;
  createdBy: string; // username do usuário que criou
}

/**
 * Dados para criar uma nova playlist compartilhada
 */
export interface CreateSharedPlaylistData {
  playlistUrl: string;
}

/**
 * Resposta da API para operações de playlist
 */
export interface PlaylistResponse {
  success: boolean;
  message?: string;
  playlist?: SharedPlaylist;
}

/**
 * Dados de busca do Spotify
 */
export interface SpotifySearchResult {
  tracks?: {
    items: SpotifyTrack[];
  };
  playlists?: {
    items: SpotifyPlaylist[];
  };
  albums?: {
    items: SpotifyAlbum[];
  };
}

export interface SpotifyTrack {
  id: string;
  name: string;
  artists: Array<{ name: string }>;
  album: {
    name: string;
    images: Array<{ url: string }>;
  };
  duration_ms: number;
  preview_url: string | null;
  external_urls: {
    spotify: string;
  };
}

export interface SpotifyPlaylist {
  id: string;
  name: string;
  description: string;
  images: Array<{ url: string }>;
  external_urls: {
    spotify: string;
  };
  tracks: {
    total: number;
  };
}

export interface SpotifyAlbum {
  id: string;
  name: string;
  artists: Array<{ name: string }>;
  images: Array<{ url: string }>;
  external_urls: {
    spotify: string;
  };
  total_tracks: number;
}

/**
 * Dados para adicionar uma música à playlist do Spotify
 */
export interface AddTrackToPlaylistData {
  playlistId: string;
  trackId: string;
}