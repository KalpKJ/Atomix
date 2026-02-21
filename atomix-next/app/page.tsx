import { elementService } from "@/application/services/element.service";
import { PeriodicTable } from "@/presentation/components";

export default async function Home() {
  const elements = await elementService.getAllElements();

  return <PeriodicTable elements={elements} />;
}