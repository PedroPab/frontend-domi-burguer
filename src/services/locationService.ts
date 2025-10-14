import { Location } from "@/types/locations"; 

export class LocationService {
    private static readonly API_URL = `${process.env.NEXT_PUBLIC_API_URL}`;

  static async getLocationId(id: string) : Promise<{ body: Location}> {
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
}
