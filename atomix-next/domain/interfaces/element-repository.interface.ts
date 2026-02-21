import { ElementData } from "@/domain/models/element.model";

export interface IElementRepository {
  getAll(): Promise<ElementData[]>;
  getByNumber(number: number): Promise<ElementData | null>;
  getBySymbol(symbol: string): Promise<ElementData | null>;
}
