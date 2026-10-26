import { Certification } from "@/types/education";
import {
  ExternalLink,
  Award,
  Cloud,
  GraduationCap,
  FileSpreadsheet,
} from "lucide-react";
import {
  siAnthropic,
  siGoogle,
  siGoogleplay,
  siCisco,
  siCoursera,
  siKaggle,
} from "simple-icons";
import { RenderedIcon } from "@/components/ui/rendered-icon";

function getCertificationIcon(cert: Certification) {
  const issuerLower = cert.issuer.toLowerCase();
  const nameLower = cert.name.toLowerCase();
  const platformLower = (cert.platform || "").toLowerCase();

  if (issuerLower.includes("anthropic") || nameLower.includes("claude")) {
    return siAnthropic;
  }
  if (issuerLower.includes("play") || nameLower.includes("play store")) {
    return siGoogleplay;
  }
  if (issuerLower.includes("google") || platformLower.includes("google")) {
    return siGoogle;
  }
  if (issuerLower.includes("cisco") || nameLower.includes("cybersecurity")) {
    return siCisco;
  }
  if (issuerLower.includes("kaggle") || nameLower.includes("sql")) {
    return siKaggle;
  }
  if (platformLower.includes("coursera") || issuerLower.includes("coursera")) {
    return siCoursera;
  }
  if (
    issuerLower.includes("amazon") ||
    nameLower.includes("aws") ||
    nameLower.includes("cloud computing")
  ) {
    return Cloud;
  }
  if (issuerLower.includes("iit") || issuerLower.includes("university")) {
    return GraduationCap;
  }
  if (nameLower.includes("office") || issuerLower.includes("scrollwell")) {
    return FileSpreadsheet;
  }
  return Award;
}

export function CertificationCard({ cert }: { cert: Certification }) {
  const icon = getCertificationIcon(cert);
  const subtitle = [cert.issuer, cert.platform].filter(Boolean).join(" • ");

  return (
    <a
      href={cert.link}
      target="_blank"
      rel="noopener noreferrer"
      title={`${cert.name} - ${subtitle} (${cert.year})`}
      className="group relative flex items-center justify-between gap-3 p-3 rounded-xl border border-border/50 bg-card/60 hover:bg-card hover:border-primary/40 hover:shadow-xs transition-[border-color,background-color,box-shadow] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1"
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="h-9 w-9 rounded-lg flex items-center justify-center shrink-0 bg-primary/10 text-primary border border-primary/20 group-hover:scale-105 transition-transform duration-200">
          <RenderedIcon icon={icon} className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
            {cert.name}
          </h3>
          <p className="text-xs text-muted-foreground truncate">{subtitle}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-muted/60 text-muted-foreground border border-border/40">
          {cert.year}
        </span>
        <ExternalLink className="h-3.5 w-3.5 text-muted-foreground/60 group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
      </div>
    </a>
  );
}
