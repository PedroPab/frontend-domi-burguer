import { Code } from "@/types/codes";

/**
 * Obtiene la URL de la API ajustada según el entorno.
 * Si estamos en desarrollo y accediendo desde una IP de LAN (no localhost),
 * reemplaza el host de la API con la IP actual del navegador.
 */
function getApiUrl(): string {
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

export class CodesService {
    private static get API_URL(): string {
        return getApiUrl();
    }

    static async getAllCodes(token: string): Promise<{ body: Code[] }> {
        try {
            const response = await fetch(`${this.API_URL}api/v2/codes`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                throw new Error("Error fetching codes");
            }
            return await response.json();
        } catch (error) {
            console.error("Error fetching codes:", error);
            throw error;
        }
    }
    static async getCodesByUser(token: string, id: string): Promise<{ body: Code[] }> {
        try {
            const response = await fetch(`${this.API_URL}api/v2/codes/user/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                throw new Error("Error fetching user's codes");
            }
            return await response.json();
        } catch (error) {
            console.error("Error fetching user's codes:", error);
            throw error;
        }
    }
    static async getCodeId(token: string, id: string): Promise<{ body: [Code] }> {
        try {
            const response = await fetch(`${this.API_URL}api/v2/codes/code/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                throw new Error("Error fetching code");
            }
            return await response.json();
        } catch (error) {
            console.error("Error fetching code:", error);
            throw error;
        }
    }

    static async getCodeByIdPublic(id: string): Promise<{ body: Code }> {
        const response = await fetch(`${this.API_URL}api/v2/codes/public/${id}`);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || "Código no encontrado");
        }

        return await response.json();
    }

    static async validateCoupon(token: string, code: string): Promise<{ body: Code }> {
        const response = await fetch(`${this.API_URL}api/v2/codes/validate/${code}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || "Código no válido");
        }

        return await response.json();
    }

    static async createCode(token: string, code: Partial<Code>): Promise<{ body: Code }> {
        try {
            const response = await fetch(`${this.API_URL}api/v2/codes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(code),
            });
            if (!response.ok) {
                throw new Error("Error creating code");
            }
            return await response.json();
        } catch (error) {
            console.error("Error creating code:", error);
            throw error;
        }
    }
    //user Create code 
    static async createCodeByUser(token: string, code: string): Promise<{ body: Code }> {
        try {
            const response = await fetch(`${this.API_URL}api/v2/codes/me/${code}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                throw new Error("Error creating code");
            }
            return await response.json();
        } catch (error) {
            console.error("Error creating code:", error);
            throw error;
        }
    }
    static async updateCode(token: string, id: string, code: Partial<Code>): Promise<{ body: Code }> {
        try {
            const response = await fetch(`${this.API_URL}api/v2/codes/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(code),
            });
            if (!response.ok) {
                throw new Error("Error updating code");
            }
            return await response.json();
        } catch (error) {
            console.error("Error updating code:", error);
            throw error;
        }
    }

    static async deleteCode(token: string, id: string): Promise<void> {
        try {
            const response = await fetch(`${this.API_URL}api/v2/codes/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                throw new Error("Error deleting code");
            }
        } catch (error) {
            console.error("Error deleting code:", error);
            throw error;
        }
    }

    static async addCode({ token, code }: { token: string | null, code: object }): Promise<{ body: Code }> {
        try {
            const headers: HeadersInit = {
                'Content-Type': 'application/json',
            };
            let url = `${this.API_URL}api/v2/codes/public`;
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
                url = `${this.API_URL}api/v2/locations`;
            }

            const options = {
                method: 'POST',
                headers,
                body: JSON.stringify(code),
            };


            const response = await fetch(url, options);
            if (!response.ok) {
                throw new Error("Error fetching location");
            }
            return await response.json();
        } catch (error) {
            console.error("Error fetching location:", error);
            throw error;
        }
    }
}
