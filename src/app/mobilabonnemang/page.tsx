import type { Metadata } from "next";
import { MobilabonnemangClient } from "./MobilabonnemangClient";

export const metadata: Metadata = {
  title: "Mobilabonnemang – byt smartare | Bytesjakten",
  description:
    "Registrera dig gratis så mejlar Bytesjakten dig när det är dags att byta mobilabonnemang till nästa billiga kampanjpris.",
};

export default function MobilabonnemangPage() {
  return <MobilabonnemangClient />;
}
