import FilterableList from "../../components/content/FilterableList";
import type { ProjectListItem } from "./types";

interface Props {
  projects: ProjectListItem[];
  allTags: string[];
}

export default function ProjectBrowser({ projects, allTags }: Props) {
  const items = projects.map((project) => ({
    ...project,
    id: project.slug,
    href: `/projects/${project.slug}`,
  }));

  return (
    <FilterableList
      items={items}
      allTags={allTags}
      filterLabel="Technologies"
      emptyMessage="No projects match these filters."
    />
  );
}
