import { Hairline } from "@/components/Hairline";
import { PairLeaves } from "@/components/svg/PairLeaves";

export function Footer({ city = "Zwevezele" }: { city?: string }) {
  return (
    <footer className="border-t border-line bg-night px-6 py-10 text-paper">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4">
        <PairLeaves className="h-12 w-16 text-gold" />
        <Hairline />
        <p className="text-center text-sm tracking-[0.16em] text-gold uppercase">
          Isabloom · {city}
        </p>
      </div>
    </footer>
  );
}
