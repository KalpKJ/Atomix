import { IElementRepository } from "@/domain/interfaces/element-repository.interface";
import { ElementData } from "@/domain/models/element.model";
import { ElementRepository } from "@/infrastructure/repositories/element.repository";

export class ElementService {
  private repository: IElementRepository;

  constructor(repository?: IElementRepository) {
    this.repository = repository || new ElementRepository();
  }

  async getAllElements(): Promise<ElementData[]> {
    return this.repository.getAll();
  }

  async getElementByNumber(number: number): Promise<ElementData | null> {
    return this.repository.getByNumber(number);
  }

  async getElementBySymbol(symbol: string): Promise<ElementData | null> {
    return this.repository.getBySymbol(symbol);
  }

  async getFirstFiveElements(): Promise<ElementData[]> {
    const elements = await this.repository.getAll();
    return elements.slice(0, 5);
  }
}

// Export singleton instance for use across the app
export const elementService = new ElementService();
