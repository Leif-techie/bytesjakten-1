import type { Metadata } from "next";
import { BredbandClient } from "./BredbandClient";

export const metadata: Metadata = {
  title: "Bredband – byt smartare, betala mindre | Bytesjakten",
  description:
    "Registrera dig gratis så mejlar Bytesjakten dig när det är dags att byta bredband till ett bättre kampanjpris.",
};

export default function BredbandPage() {
  return <BredbandClient />;
}
