import { Suspense } from "react";
import { WarisanCardBuilder } from "@/components/warisan-builder/WarisanCardBuilder";

export default function BuatWarisanPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            minHeight: "100vh",
            display: "grid",
            placeItems: "center",
            background: "var(--cream)",
            color: "var(--indigo-deep)",
            fontFamily: "var(--font-cormorant), serif",
            fontStyle: "italic",
            fontSize: 18,
          }}
        >
          Memuatkan pembina kad…
        </div>
      }
    >
      <WarisanCardBuilder />
    </Suspense>
  );
}
