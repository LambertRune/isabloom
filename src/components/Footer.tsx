import { Hairline } from "@/components/Hairline";

export function Footer() {
  return (
    <footer className="border-t border-line px-6 py-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-4">
        <Hairline />
        <p className="text-center text-sm tracking-[0.16em] text-muted uppercase">
          Isabloom · Zwevezele
        </p>
      </div>
    </footer>
  );
}
