export type PropertyType = 'house' | 'building' | 'urbanization' | 'office';

/**
 * Interfaz para representar la estructura de una Ubicación.
 * Refleja las propiedades definidas en el constructor de la clase Location.
 */
export interface Location {
    // Propiedades principales
    id: string;
    name: string; // Nombre de la ubicación, ej: 'mi casa'
    address: string; // Dirección completa
    city: string; // Ciudad
    state: string; // Estado o provincia
    country: string; // País
    postalCode: string; // Código postal
    floor: string; // Piso del inmueble
    comment: string; // Comentarios adicionales
    propertyType: PropertyType; // Tipo de inmueble (debe coincidir con Location.TYPES)
    status: string; // Estado de la locación (debe coincidir con Location.STATUS)

    // Coordenadas
    coordinates: {
        lat: number;
        lng: number;
    };

    // Propiedades de usuario y cliente
    userId: string; // ID del usuario que posee la ubicación
    userCreateId: string; // ID del usuario que creó la ubicación
    clientId: string | null; // ID del cliente asociado (opcional)
    
    // Banderas
    favorite: boolean; // Indica si la ubicación es favorita
    isFromAKitchen: boolean | null; // Indicador relacionado con 'kitchen' (opcional)

    // Metadatos
    createdAt: Date; // Fecha de creación
    updatedAt: Date; // Fecha de última actualización
    
    // (Opcional, si se incluyen propiedades con el mismo nombre y tipo)
    // static STATUS: any; 
    // static TYPES: any; 
}

// Ejemplo de cómo podrías definir las interfaces para las coordenadas si lo prefieres más explícito:
/*
interface ICoordinates {
    lat: number | null;
    lng: number | null;
}

interface ILocation {
    // ... otras propiedades
    coordinates: ICoordinates;
    // ... otras propiedades
}
*/