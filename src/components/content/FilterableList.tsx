import { useMemo, useState } from "react";

export interface FilterableListItem {
  id: string;
  title: string;
  date: string;
  tags: string[];
  href: string;
}

interface Props {
  items: FilterableListItem[];
  allTags: string[];
  filterLabel: string;
  emptyMessage: string;
}

const matchesSelectedTags = (
  item: FilterableListItem,
  selectedTagSet: Set<string>
) => {
  if (selectedTagSet.size === 0) return true;
  return [...selectedTagSet].every((tag) => item.tags.includes(tag));
};

interface TagFilterItemProps {
  tag: string;
  isSelected: boolean;
  count: number;
  onToggle: (tag: string) => void;
}

function TagFilterItem({
  tag,
  isSelected,
  count,
  onToggle,
}: TagFilterItemProps) {
  return (
    <label className="-mx-2 flex cursor-pointer items-center gap-3 rounded-sm px-2 py-1 transition-colors duration-200 group hover:bg-gray-50">
      <input
        type="checkbox"
        className="peer sr-only"
        checked={isSelected}
        onChange={() => onToggle(tag)}
      />
      <div
        aria-hidden="true"
        className={`w-4 h-4 shrink-0 border transition-colors duration-200 flex items-center justify-center peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-black
        ${isSelected ? "bg-black border-black text-white" : "border-gray-300 bg-white"}`}
      >
        {isSelected && (
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
      <span className="text-sm text-gray-900 group-hover:text-black transition-colors">
        {tag} <span className="text-gray-400">({count})</span>
      </span>
    </label>
  );
}

function ContentRow({ item }: { item: FilterableListItem }) {
  const date = item.date.slice(0, 10).replace(/-/g, ".");

  return (
    <a
      href={item.href}
      className="group flex items-center justify-between py-4 border-b border-gray-300 hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
    >
      <div className="w-24 sm:w-32 md:w-48 flex-shrink-0 flex items-center font-mono text-sm text-gray-800 px-3">
        <span>
          {date.slice(0, 7)}<span className="hidden sm:inline">{date.slice(7)}</span>
        </span>
      </div>

      <div className="flex-grow px-3 font-medium text-gray-900 group-hover:text-black">
        {item.title}
      </div>
    </a>
  );
}

export default function FilterableList({ items, allTags, filterLabel, emptyMessage }: Props) {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const selectedTagSet = useMemo(() => new Set(selectedTags), [selectedTags]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const tagCounts = useMemo(() => {
    const counts = new Map<string, number>();
    items.forEach((item) => {
      item.tags.forEach((tag) => {
        counts.set(tag, (counts.get(tag) ?? 0) + 1);
      });
    });
    return counts;
  }, [items]);

  const filteredItems = useMemo(() => {
    return items.filter((item) =>
      matchesSelectedTags(item, selectedTagSet)
    );
  }, [items, selectedTagSet]);

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* LEFT SIDEBAR: FILTERS */}
      <div className="hidden lg:block w-64 flex-shrink-0">
        <div className="border-b border-black pb-2 mb-4 font-mono text-xs text-gray-500 uppercase tracking-wider">
          / {filterLabel}
        </div>

        <div className="flex flex-col">
          {allTags.map((tag) => (
            <TagFilterItem
              key={tag}
              tag={tag}
              isSelected={selectedTagSet.has(tag)}
              count={tagCounts.get(tag) ?? 0}
              onToggle={toggleTag}
            />
          ))}
        </div>
      </div>

      {/* RIGHT SIDE: CONTENT LIST */}
      <div className="min-w-0 flex-1">
        {/* Header */}
        <div className="flex items-end border-b-2 border-black pb-2 mb-0 font-mono text-xs text-gray-500 uppercase tracking-wider">
          <div className="w-24 sm:w-32 md:w-48 flex-shrink-0">/ Date</div>
          <div className="flex-grow">/ Name</div>
        </div>

        {/* List */}
        <div className="flex flex-col">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <ContentRow key={item.id} item={item} />
            ))
          ) : (
            <div className="py-12 text-gray-400 italic">
              {emptyMessage}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
