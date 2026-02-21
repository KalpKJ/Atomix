import { IElementRepository } from "@/domain/interfaces/element-repository.interface";
import { ElementData, PeriodicTableData } from "@/domain/models/element.model";
import { API_CONFIG } from "@/infrastructure/config/api.config";

export class ElementRepository implements IElementRepository {
  async getAll(): Promise<ElementData[]> {
    try {
      const response = await fetch(API_CONFIG.PERIODIC_TABLE_URL, {
        cache: 'force-cache',
        next: {
          revalidate: API_CONFIG.CACHE_REVALIDATION_SECONDS,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch elements: ${response.status}`);
      }

      const data: PeriodicTableData = await response.json();
      return data.elements;
    } catch (error) {
      console.error('Error fetching periodic table data:', error);
      throw new Error('Failed to load periodic table data');
    }
  }

  async getByNumber(number: number): Promise<ElementData | null> {
    const elements = await this.getAll();
    return elements.find(el => el.number === number) || null;
  }

  async getBySymbol(symbol: string): Promise<ElementData | null> {
    const elements = await this.getAll();
    return elements.find(el => el.symbol.toLowerCase() === symbol.toLowerCase()) || null;
  }
}
