import { Code } from "@/types/codes";
import { getApiUrl } from "@/utils/apiUrl";

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
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || "Error al crear el código");
            }
            return await response.json();
        } catch (error) {
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
