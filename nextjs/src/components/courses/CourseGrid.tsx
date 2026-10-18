"use client";
import { useState } from "react";
import type { Course } from "@/content/courses";
import { CourseCard } from "@/components/cards/CourseCard";
import { LoadMoreButton } from "@/components/ui/LoadMoreButton";
import s from "./CoursesPage.module.css";

/**
 * The /courses collection list: Framer pages it 6 / 4 / 3 per page (desktop / tablet / phone). Every card is in the
 * DOM; the ones past the current page are hidden per breakpoint, and the "Load More V2" button shows on a breakpoint
 * only while it still has hidden cards (Framer's "Hidden" state once the list is exhausted).
 */
const PAGE = { desktop: 6, tablet: 4, phone: 3 } as const;

export function CourseGrid({ courses }: { courses: Course[] }) {
  const [pages, setPages] = useState(1);
  const n = courses.length;
  const more = {
    desktop: PAGE.desktop * pages < n,
    tablet: PAGE.tablet * pages < n,
    phone: PAGE.phone * pages < n,
  };
  return (
    <div className={s.grid}>
      {courses.map((c, i) => {
        const hide = [
          i >= PAGE.desktop * pages ? "hide-desktop" : "",
          i >= PAGE.tablet * pages ? "hide-tablet" : "",
          i >= PAGE.phone * pages ? "hide-phone" : "",
        ].join(" ");
        return (
          <div key={c.slug} className={`${s.item} ${hide}`}>
            <CourseCard course={c} variant={{ desktop: "Desktop Course Card", tablet: "Secondary", phone: "Secondary" }} />
          </div>
        );
      })}
      <div
        className={[s.loadMore, more.desktop ? "" : "hide-desktop", more.tablet ? "" : "hide-tablet", more.phone ? "" : "hide-phone"].join(" ")}
      >
        {more.desktop || more.tablet || more.phone ? (
          <LoadMoreButton variant="Load More V2" onClick={() => setPages((p) => p + 1)} />
        ) : null}
      </div>
    </div>
  );
}
