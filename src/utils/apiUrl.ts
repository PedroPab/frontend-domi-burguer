/**
 * Obtiene la URL de la API ajustada según el entorno.
 * Si estamos en desarrollo y accediendo desde una IP de LAN (no localhost),
 * reemplaza el host de la API con la IP actual del navegador.
 */
export function getApiUrl(): string {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';

    // Solo en el cliente (navegador)
    if (typeof window === 'undefined') {
        return baseUrl;
    }

    const currentHost = window.location.hostname;

    // Si estamos en localhost, usar la URL original
    if (currentHost === 'localhost' || currentHost === '127.0.0.1') {
        return baseUrl;
    }

    // Estamos en una IP de LAN u otro host de desarrollo
    // Reemplazar el host de la API con la IP actual
    try {
        const apiUrlObj = new URL(baseUrl);
        const apiOriginalHost = apiUrlObj.hostname;

        // Solo reemplazar si la API apunta a localhost
        if (apiOriginalHost === 'localhost' || apiOriginalHost === '127.0.0.1') {
            apiUrlObj.hostname = currentHost;
            return apiUrlObj.toString();
        }
    } catch {
        // Si hay error parseando la URL, retornar la original
        return baseUrl;
    }

    return baseUrl;
}
