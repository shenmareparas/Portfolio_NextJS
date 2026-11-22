import { LogoLoop } from "@/components/ui/logo-loop";
import { techLogos } from "@/data/tech-logos";

export function TechStackLoop() {
  return (
    <section
      aria-label="Technologies and frameworks"
      className="w-full py-6 md:py-8 relative overflow-hidden"
    >
      <LogoLoop
        logos={techLogos}
        speed={55}
        direction="left"
        logoHeight={34}
        gap={48}
        scaleOnHover
        fadeOut
        fadeOutWidth={0.12}
        labels="hover"
        disableLinks
        ariaLabel="Technologies and tools I work with"
      />
    </section>
  );
}
