import React, { useState, useMemo } from "react";

// Define the shape of the data we need
interface ProjectData {
  slug: string;
  title: string;
  date: string; // ISO string
  tags: string[];
}

interface Props {
  projects: ProjectData[];
  allTags: string[];
}

const ProjectBrowser: React.FC<Props> = ({ projects, allTags }) => {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Toggle checkbox logic
  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  // Filter logic (memoized for performance)
  const filteredProjects = useMemo(() => {
    if (selectedTags.length === 0) return projects;
    return projects.filter((project) =>
      selectedTags.every((tag) => project.tags.includes(tag))
    );
  }, [selectedTags, projects]);

  return (
    <div className="flex flex-col md:flex-row gap-8 font-mono">
      {/* LEFT SIDEBAR: FILTERS */}
      <div className="w-full md:w-64 flex-shrink-0 max-w-4xl mx-auto w-full px-2 font-mono">
        <div className="border-b border-black pb-2 mb-4 text-xs text-gray-500 uppercase tracking-wider">
          / Technologies
        </div>

        <div className="flex flex-col gap-2">
          {allTags.map((tag) => (
            <label
              key={tag}
              className="flex items-center gap-3 cursor-pointer group hover:opacity-70"
            >
              <div
                className={`w-4 h-4 border transition-colors duration-200 flex items-center justify-center
                ${
                  selectedTags.includes(tag)
                    ? "bg-black border-black text-white"
                    : "border-gray-300 bg-white"
                }`}
              >
                {/* Checkmark Icon */}
                {selectedTags.includes(tag) && (
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </div>
              <input
                type="checkbox"
                className="hidden" // Hide default checkbox
                checked={selectedTags.includes(tag)}
                onChange={() => toggleTag(tag)}
              />
              <span className="text-sm text-gray-600 group-hover:text-black transition-colors">
                {tag}
                {/* Optional: Show count per tag */}
                <span className="text-gray-400 ml-1">
                  ({projects.filter((p) => p.tags.includes(tag)).length})
                </span>
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* RIGHT SIDE: PROJECT LIST */}
      <div className="flex-grow max-w-4xl mx-auto w-full px-4 font-mono ">
        {/* Header */}
        <div className="flex items-end border-b-2 border-black pb-2 mb-0 text-xs text-gray-500 uppercase tracking-wider">
          <div className="w-32 md:w-48 flex-shrink-0">/ Date</div>
          <div className="flex-grow">/ Name</div>
        </div>

        {/* List */}
        <div className="flex flex-col">
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project) => (
              <a
                key={project.slug}
                href={`/projects/${project.slug}`}
                className="group flex items-center justify-between py-4 border-b border-gray-300 hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
              >
                <div className="w-32 md:w-48 flex-shrink-0 flex items-center gap-3 text-sm text-gray-800">
                  <span className="text-[10px] opacity-70">▪</span>
                  {project.date.slice(0, 10).replace(/-/g, ".")}
                </div>

                <div className="flex-grow font-medium text-gray-900 group-hover:text-black">
                  {project.title}
                </div>

                <div className="text-xl font-light text-gray-400 group-hover:text-black pl-4">
                  +
                </div>
              </a>
            ))
          ) : (
            <div className="py-12 text-gray-400 italic">
              No projects match these filters.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectBrowser;
