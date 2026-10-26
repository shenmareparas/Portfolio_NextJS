import { Achievement } from "@/types/education";
import {
  ExternalLink,
  Trophy,
  GitPullRequest,
  Sparkles,
  Medal,
} from "lucide-react";
import { siAndroid } from "simple-icons";
import { RenderedIcon } from "@/components/ui/rendered-icon";
import { cn } from "@/lib/utils";

function getAchievementIcon(achievement: Achievement) {
  const titleLower = achievement.title.toLowerCase();

  if (titleLower.includes("hackathon") || titleLower.includes("finalist")) {
    return Trophy;
  }
  if (
    titleLower.includes("summer of code") ||
    titleLower.includes("contributor")
  ) {
    return GitPullRequest;
  }
  if (titleLower.includes("hacktoberfest")) {
    return Sparkles;
  }
  if (
    titleLower.includes("android") ||
    titleLower.includes("bugoff") ||
    titleLower.includes("andro series")
  ) {
    return siAndroid;
  }
  return Medal;
}

export function AchievementCard({ achievement }: { achievement: Achievement }) {
  const icon = getAchievementIcon(achievement);

  const [mainTitle, subtitle] = achievement.title.includes(" – ")
    ? achievement.title.split(" – ")
    : [achievement.title, undefined];

  const cardInner = (
    <div
      className={cn(
        "flex items-center justify-between gap-3 p-3 rounded-xl border border-border/50 bg-card/60 transition-[border-color,background-color,box-shadow] h-full",
        achievement.link
          ? "hover:bg-card hover:border-primary/40 hover:shadow-xs cursor-pointer"
          : "hover:bg-card hover:border-border/80",
      )}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="h-9 w-9 rounded-lg flex items-center justify-center shrink-0 bg-primary/10 text-primary border border-primary/20 group-hover:scale-105 transition-transform duration-200">
          <RenderedIcon icon={icon} className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <h3
            className={cn(
              "text-sm font-medium text-foreground truncate transition-colors",
              achievement.link ? "group-hover:text-primary" : "",
            )}
          >
            {mainTitle}
          </h3>
          {subtitle && (
            <p className="text-xs text-muted-foreground truncate">{subtitle}</p>
          )}
        </div>
      </div>
      {achievement.link ? (
        <div className="flex items-center gap-2 shrink-0">
          <ExternalLink className="h-3.5 w-3.5 text-muted-foreground/60 group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
        </div>
      ) : null}
    </div>
  );

  if (achievement.link) {
    return (
      <a
        href={achievement.link}
        target="_blank"
        rel="noopener noreferrer"
        title={achievement.title}
        className="block group rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1"
      >
        {cardInner}
      </a>
    );
  }

  return (
    <div title={achievement.title} className="group rounded-xl">
      {cardInner}
    </div>
  );
}
