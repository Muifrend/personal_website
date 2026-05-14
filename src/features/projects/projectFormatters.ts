import type { CollectionEntry } from "astro:content";
import { normalizeExternalUrl, normalizeInternalPath } from "../../lib/urls";
import type { ProjectLinks, ProjectListItem } from "./types";

type ProjectEntry = CollectionEntry<"projectsCollection">;
type ProjectData = ProjectEntry["data"];

export const PROJECT_LINK_CLASS =
  "text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1";

export function sortProjectsByDate(projects: ProjectEntry[]) {
  return [...projects].sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf(),
  );
}

export function getProjectTags(projects: ProjectEntry[]) {
  return [
    ...new Set(projects.flatMap((project) => project.data.tags || [])),
  ].sort();
}

export function toProjectListItem(project: ProjectEntry): ProjectListItem {
  return {
    slug: project.id,
    title: project.data.title,
    date: project.data.date.toISOString(),
    tags: project.data.tags || [],
  };
}

export function getProjectLinks(data: ProjectData): ProjectLinks {
  const repoHref = normalizeExternalUrl(data.repo);
  const externalLinkHref = normalizeExternalUrl(data.link_url);
  const internalLinkHref = externalLinkHref
    ? null
    : normalizeInternalPath(data.link_file);
  const hasProjectLink = Boolean(externalLinkHref || internalLinkHref);

  return {
    repoHref,
    externalLinkHref,
    internalLinkHref,
    hasProjectLink,
    hasAnyLink: Boolean(repoHref || hasProjectLink),
  };
}

export function buildProjectLinkLabel(
  value?: string,
  fallback = "Link",
) {
  return value?.trim() || fallback;
}

export function formatProjectDate(date?: Date | null) {
  const parsedDate = date ? new Date(date) : null;

  return parsedDate && !Number.isNaN(parsedDate.valueOf())
    ? new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }).format(parsedDate)
    : "Date unavailable";
}
