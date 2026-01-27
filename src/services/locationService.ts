import { Location } from "@/types/locations";

export class LocationService {
  private static readonly API_URL = `${process.env.NEXT_PUBLIC_API_URL}`;

  static async getLocationId(id: string): Promise<{ body: Location }> {
    try {
      const response = await fetch(`${this.API_URL}api/v2/locations/${id}`);
      if (!response.ok) {
        throw new Error("Error fetching location");
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching location:", error);
      throw error;
    }
  }

  //add location 
  static async addLocation({ token, location }: { token: string | null, location: object }): Promise<{ body: Location }> {
    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      let url = `${this.API_URL}api/v2/locations/public`;
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
        url = `${this.API_URL}api/v2/locations`;
      }

      const options = {
        method: 'POST',
        headers,
        body: JSON.stringify(location),
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

  static async getUserLocations(token: string): Promise<{ body: [Location] }> {
    try {
      const response = await fetch(`${this.API_URL}api/v2/locations/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Error fetching location");
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching location:", error);
      throw error;
    }
  }
  static async deleteLocationProfile({ token, id }: { token: string, id: string }): Promise<void> {
    try {
      const response = await fetch(`${this.API_URL}api/v2/locations/me/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Error deleting location");
      }
    } catch (error) {
      console.error("Error deleting location:", error);
      throw error;
    }
  }
}
