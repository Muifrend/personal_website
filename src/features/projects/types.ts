export interface ProjectListItem {
  slug: string;
  title: string;
  date: string;
  tags: string[];
}

export interface ProjectLinks {
  repoHref: string | null;
  externalLinkHref: string | null;
  internalLinkHref: string | null;
  hasProjectLink: boolean;
  hasAnyLink: boolean;
}
