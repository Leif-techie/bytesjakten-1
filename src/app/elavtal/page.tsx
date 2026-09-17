import type { Metadata } from "next";
import { ElavtalClient } from "./ElavtalClient";

export const metadata: Metadata = {
  title: "Elavtal – byt smartare | Bytesjakten",
  description:
    "Registrera dig gratis så mejlar Bytesjakten dig när det är dags att byta elavtal till ett bättre kampanjpris – fastpris eller rörligt.",
};

export default function ElavtalPage() {
  return <ElavtalClient />;
}
