/**
 * Representa um evento/lugar para ir na collection do MongoDB
 */
export interface PlaceEvent {
  _id?: string;
  title: string;
  description?: string;
  location: {
    name: string;
    address: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  date?: Date; // Data opcional do evento
  createdAt: Date;
  updatedAt: Date;
  createdBy: string; // username do usuário que criou
  participants: string[]; // array de usernames dos participantes
}

/**
 * Dados para criar um novo evento/lugar
 */
export interface CreatePlaceEventData {
  title: string;
  description?: string;
  location: {
    name: string;
    address: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  date?: Date;
}

/**
 * Resposta da API para operações de lugares
 */
export interface PlaceEventResponse {
  success: boolean;
  message?: string;
  placeEvent?: PlaceEvent;
  placeEvents?: PlaceEvent[];
}
