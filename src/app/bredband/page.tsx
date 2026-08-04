import type { Metadata } from "next";
import { BredbandClient } from "./BredbandClient";

export const metadata: Metadata = {
  title: "Mobilt bredband & 5G-hemma – byt smartare | Bytesjakten",
  description:
    "Registrera dig gratis så mejlar Bytesjakten dig när det är dags att byta mobilt bredband eller 5G-hemma till ett bättre kampanjpris.",
};

export default function BredbandPage() {
  return <BredbandClient />;
}
