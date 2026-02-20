import { PeriodicTableData, ElementData } from "@/types/element";

const API_URL = 'https://raw.githubusercontent.com/Bowserinator/Periodic-Table-JSON/master/PeriodicTableJSON.json';

export async function getElements(): Promise<ElementData[]> {
  try {
    const response = await fetch(API_URL, {
      cache: 'force-cache',
      next: {
        revalidate: 86400, // Revalidate once per day (24 hours)
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

export async function getFirstFiveElements(): Promise<ElementData[]> {
  const elements = await getElements();
  return elements.slice(0, 5);
}

export async function getElementByNumber(number: number): Promise<ElementData | null> {
  const elements = await getElements();
  return elements.find(el => el.number === number) || null;
}

export async function getElementBySymbol(symbol: string): Promise<ElementData | null> {
  const elements = await getElements();
  return elements.find(el => el.symbol.toLowerCase() === symbol.toLowerCase()) || null;
}