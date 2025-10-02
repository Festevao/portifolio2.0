import { useState, useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { WeatherData } from '@/types/Weather';
import { SharedPlaylist, SpotifyTrack } from '@/types/SharedPlaylist';
import AddMusicModal from './AddMusicModal';
import CreatePlaylistModal from './CreatePlaylistModal';

interface MusicSectionProps {
  weather: WeatherData;
  participants: string[];
}

/**
 * Seção de playlist compartilhada - gerencia uma playlist única entre dois usuários
 * Busca músicas diretamente do Spotify
 */
const MusicSection = ({ weather, participants }: MusicSectionProps) => {
  const { data: session, status } = useSession();
  const [playlist, setPlaylist] = useState<SharedPlaylist | null>(null);
  const [playlistTracks, setPlaylistTracks] = useState<SpotifyTrack[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [spotifyTheme, setSpotifyTheme] = useState<'light' | 'dark'>('dark');
  const [tokenExpired, setTokenExpired] = useState(false);

  /**
   * Carrega a playlist compartilhada
   */
  const loadPlaylist = async () => {
    try {
      const participantsParam = participants.join(',');
      const response = await fetch(`/api/playlist/shared?participants=${participantsParam}`);
      const data = await response.json();
      
      if (data.success) {
        setPlaylist(data.playlist);
        
        // Se existe playlist, carrega as músicas do Spotify
        if (data.playlist && data.playlist.playlistId) {
          await loadPlaylistTracks(data.playlist.playlistId);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar playlist:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Carrega as músicas da playlist do Spotify
   */
  const loadPlaylistTracks = async (playlistId: string) => {
    try {
      const response = await fetch(`/api/spotify/playlist-tracks?playlistId=${playlistId}`);
      const data = await response.json();
      
      if (response.status === 401) {
        console.error('Token expirado, precisa relogar');
        setTokenExpired(true);
        return;
      }
      
      if (data.tracks && data.tracks.items) {
        setPlaylistTracks(data.tracks.items);
      }
    } catch (error) {
      console.error('Erro ao carregar músicas da playlist:', error);
    }
  };

  /**
   * Cria uma nova playlist compartilhada
   */
  const createPlaylist = async (playlistUrl: string) => {
    try {
      const response = await fetch('/api/playlist/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          playlistUrl,
          participants,
          createdBy: participants[0]
        })
      });

      const data = await response.json();

      if (data.success && data.playlist) {
        setPlaylist(data.playlist);
        if (data.playlist.playlistId) {
          await loadPlaylistTracks(data.playlist.playlistId);
        }
        setShowCreateModal(false);
      } else {
        throw new Error(data.message || 'Erro ao criar playlist');
      }
    } catch (error) {
      console.error('Erro ao criar playlist:', error);
      alert('Erro ao criar playlist: ' + (error as Error).message);
    }
  };

  /**
   * Adiciona uma música à playlist do Spotify
   */
  const addTrackToPlaylist = async (trackId: string) => {
    if (!playlist || !playlist.playlistId) {
      alert('Playlist não encontrada');
      return;
    }

    try {
      const response = await fetch('/api/spotify/add-to-playlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          playlistId: playlist.playlistId,
          trackId
        })
      });

      if (response.status === 401) {
        console.error('Token expirado, precisa relogar');
        setTokenExpired(true);
        return;
      }

      const data = await response.json();

      if (data.success) {
        // Recarrega as músicas da playlist
        await loadPlaylistTracks(playlist.playlistId);
        setShowAddModal(false);
      } else {
        throw new Error(data.message || 'Erro ao adicionar música');
      }
    } catch (error) {
      console.error('Erro ao adicionar música:', error);
      alert('Erro ao adicionar música: ' + (error as Error).message);
    }
  };


  useEffect(() => {
    if (status === 'authenticated') {
      setTokenExpired(false); // Reset token expired state on new auth
      loadPlaylist();
    } else if (status === 'unauthenticated') {
      setLoading(false);
    }
  }, [status]);

  return (
    <>
      {/* Card principal */}
      <div className={`backdrop-blur-md rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 md:p-8 mb-6 transition-all duration-300 ${
        weather.isDaytime 
          ? 'bg-white/30 border border-white/20' 
          : 'bg-purple-950/30 border border-purple-800/20'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="text-3xl sm:text-4xl">🎵</div>
            <div>
              <h2 className={`text-xl sm:text-2xl font-bold ${
                weather.isDaytime ? 'text-gray-800' : 'text-white'
              }`}>
                {playlist ? 'Pra gente ouvir' : 'Playlist Compartilhada'}
              </h2>
              <p className={`text-sm sm:text-base ${
                weather.isDaytime ? 'text-gray-600' : 'text-purple-200'
              }`}>
                {playlistTracks.length} {playlistTracks.length === 1 ? 'música' : 'músicas'} compartilhada{playlistTracks.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          
          <button
            onClick={() => setExpanded(!expanded)}
            className={`p-2 sm:p-3 rounded-full transition-all transform hover:scale-105 ${
              weather.isDaytime
                ? 'bg-white/50 hover:bg-white/70 text-gray-700'
                : 'bg-purple-600/50 hover:bg-purple-600/70 text-white'
            }`}
          >
            <span className={`text-lg sm:text-xl transition-transform duration-300 ${
              expanded ? 'rotate-180' : ''
            }`}>
              ▼
            </span>
          </button>
        </div>

        {/* Conteúdo expandido */}
        {expanded && (
          <div className="space-y-4">
            {/* Lista de músicas */}
            {status === 'loading' || loading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-600 mb-4"></div>
                <p className={`${weather.isDaytime ? 'text-gray-600' : 'text-purple-300'}`}>
                  {status === 'loading' ? 'Autenticando com Spotify...' : 'Carregando playlist...'}
                </p>
              </div>
            ) : status === 'unauthenticated' || tokenExpired ? (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">🎵</div>
                <p className={`text-lg ${weather.isDaytime ? 'text-gray-600' : 'text-purple-300'}`}>
                  {tokenExpired ? 'Sessão Expirada' : 'Conecte-se ao Spotify'}
                </p>
                <p className={`text-sm ${weather.isDaytime ? 'text-gray-500' : 'text-purple-400'}`}>
                  {tokenExpired 
                    ? 'Sua sessão do Spotify expirou. Faça login novamente para continuar.'
                    : 'Para usar as funcionalidades de música, você precisa se conectar ao Spotify'
                  }
                </p>
                <button
                  onClick={() => {
                    if (tokenExpired) {
                      // Logout primeiro para limpar sessão inválida
                      window.location.href = '/api/auth/signout';
                    } else {
                      signIn('spotify', { 
                        callbackUrl: `${window.location.origin}/our-space?me=${participants[0]}&other=${participants[1]}` 
                      });
                    }
                  }}
                  className={`mt-4 px-6 py-3 rounded-xl font-bold transition-all transform hover:scale-105 shadow-lg ${
                    weather.isDaytime
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700'
                      : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700'
                  }`}
                >
                  🎵 {tokenExpired ? 'Relogar no Spotify' : 'Conectar ao Spotify'}
                </button>
              </div>
            ) : !playlist ? (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">🎶</div>
                <p className={`text-lg ${weather.isDaytime ? 'text-gray-600' : 'text-purple-300'}`}>
                  Nenhuma playlist compartilhada ainda
                </p>
                <p className={`text-sm ${weather.isDaytime ? 'text-gray-500' : 'text-purple-400'}`}>
                  Crie uma playlist no Spotify e compartilhe a URL!
                </p>
              </div>
            ) : playlistTracks.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">🎶</div>
                <p className={`text-lg ${weather.isDaytime ? 'text-gray-600' : 'text-purple-300'}`}>
                  Playlist vazia
                </p>
                <p className={`text-sm ${weather.isDaytime ? 'text-gray-500' : 'text-purple-400'}`}>
                  Clique no botão abaixo para adicionar a primeira música!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Player do Spotify */}
                {playlist && (
                  <div className={`rounded-xl overflow-hidden shadow-lg ${
                    weather.isDaytime
                      ? 'bg-white/20 border border-white/30'
                      : 'bg-black/20 border border-purple-800/30'
                  }`}>
                    <iframe
                      title={`Spotify Embed: ${playlist.playlistId}`}
                      src={`https://open.spotify.com/embed/playlist/${playlist.playlistId}?utm_source=generator&theme=${spotifyTheme === 'dark' ? '0' : '1'}`}
                      width="100%"
                      height="400"
                      frameBorder="0"
                      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                      loading="lazy"
                      className="rounded-xl"
                    />
                  </div>
                )}

                {/* Controles do player */}
                <div className="flex flex-wrap gap-3 justify-center">
                  <button
                    onClick={() => setSpotifyTheme(spotifyTheme === 'dark' ? 'light' : 'dark')}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      weather.isDaytime
                        ? 'bg-white/40 text-gray-700 hover:bg-white/60'
                        : 'bg-purple-600/40 text-white hover:bg-purple-600/60'
                    }`}
                  >
                    {spotifyTheme === 'dark' ? '🌙' : '☀️'} Tema {spotifyTheme === 'dark' ? 'Escuro' : 'Claro'}
                  </button>
                  
                  {playlist && (
                    <a
                      href={playlist.playlistUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                        weather.isDaytime
                          ? 'bg-green-500 text-white hover:bg-green-600'
                          : 'bg-green-600 text-white hover:bg-green-700'
                      }`}
                    >
                      🎵 Abrir no Spotify
                    </a>
                  )}
                </div>

                {/* Informações da playlist */}
                <div className={`rounded-xl border p-4 ${
                  weather.isDaytime
                    ? 'bg-white/20 border-white/30'
                    : 'bg-purple-900/20 border-purple-700/30'
                }`}>
                  <div className="text-center">
                    <p className={`text-sm font-medium ${
                      weather.isDaytime ? 'text-gray-700' : 'text-purple-200'
                    }`}>
                      🎵 {playlistTracks.length} {playlistTracks.length === 1 ? 'música' : 'músicas'} na playlist
                    </p>
                    <p className={`text-xs mt-1 ${
                      weather.isDaytime ? 'text-gray-500' : 'text-purple-300'
                    }`}>
                      Use o player acima para navegar, reproduzir e ver detalhes das músicas
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Botões de ação */}
            {status === 'authenticated' && (
              <div className="pt-4 border-t border-white/20 space-y-3">
                {!playlist ? (
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className={`w-full py-3 px-6 rounded-xl font-bold transition-all transform hover:scale-105 shadow-lg ${
                      weather.isDaytime
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700'
                        : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700'
                    }`}
                  >
                    🎵 Criar Playlist Compartilhada
                  </button>
                ) : (
                  <button
                    onClick={() => setShowAddModal(true)}
                    className={`w-full py-3 px-6 rounded-xl font-bold transition-all transform hover:scale-105 shadow-lg ${
                      weather.isDaytime
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700'
                        : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700'
                    }`}
                  >
                    ➕ Adicionar Música à Playlist
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal para criar playlist */}
      {showCreateModal && (
        <CreatePlaylistModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSave={createPlaylist}
          weather={weather}
        />
      )}

      {/* Modal para adicionar música */}
      <AddMusicModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={addTrackToPlaylist}
        weather={weather}
        participants={participants}
      />

    </>
  );
};

export default MusicSection;