import type { Metadata } from "next";

import { DemoTracking } from "./DemoTracking";

export const metadata: Metadata = {
  title: "Seguimiento de tu figura",
  description: "Ingresa tu código de seguimiento para ver en qué etapa está la figura de tu mascota.",
  alternates: { canonical: "/seguimiento" },
};

export default function TrackingDemoPage() {
  return <DemoTracking />;
}
