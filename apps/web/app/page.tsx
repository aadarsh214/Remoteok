"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";

import styles from "./page.module.css";
import { jobFixtures, type JobFixture, type JobTheme } from "./data/jobFixtures";

type FilterKey = "location" | "salary" | "benefits";

const FILTER_LABELS: Record<FilterKey, string> = {
  location: "Location",
  salary: "Salary",
  benefits: "Benefits",
};

const FILTER_OPTIONS: Record<FilterKey, string[]> = {
  location: ["Any location", "Worldwide", "Americas", "EMEA"],
  salary: ["Any salary", "Under $60k", "$60k - $100k", "$100k+"],
  benefits: ["Any benefits", "Health insurance", "Contractor friendly", "Verified"],
};

const SORT_OPTIONS = ["Newest", "Oldest", "Salary: High to Low"] as const;
type SortOption = (typeof SORT_OPTIONS)[number];

const TAG_FILTERS = [
  "Support",
  "Engineer",
  "Senior",
  "Software",
  "Management",
  "Technical",
  "Lead",
  "Design",
];

const suggestionsCatalog = Array.from(
  new Set(
    jobFixtures.flatMap((job) => [job.title, job.company, job.remoteScope, ...job.tags])
  )
);

type FilterSelection = Record<FilterKey, string | null>;

const initialFilters: FilterSelection = {
  location: null,
  salary: null,
  benefits: null,
};

type BadgeType = NonNullable<JobFixture["badges"]>[number]["type"];

const badgeIconMap: Record<BadgeType, string> = {
  remote: "🌍",
  salary: "💰",
  contract: "📄",
  verified: "✅",
  benefit: "✨",
};

const avatarIconMap: Record<JobTheme, string> = {
  teal: "🪶",
  black: "🎙️",
  purple: "🛸",
  white: "🌐",
};

const filterKeys: FilterKey[] = ["location", "salary", "benefits"];

const parseSalaryRange = (label: string) => {
  const match = label.match(/\$?(\d+)k\s*-\s*\$?(\d+)k/i);
  if (!match) {
    return null;
  }

  return {
    min: Number(match[1]) * 1000,
    max: Number(match[2]) * 1000,
  };
};

const matchesSalaryFilter = (salaryLabel: string, filter: string | null) => {
  if (!filter || filter === "Any salary") {
    return true;
  }

  const range = parseSalaryRange(salaryLabel);
  if (!range) {
    return true;
  }

  switch (filter) {
    case "Under $60k":
      return range.min < 60000;
    case "$60k - $100k":
      return range.min <= 60000 && range.max <= 100000 && range.max >= 60000;
    case "$100k+":
      return range.max >= 100000;
    default:
      return true;
  }
};

const matchesBenefitFilter = (job: JobFixture, filter: string | null) => {
  if (!filter || filter === "Any benefits") {
    return true;
  }

  const normalized = filter.toLowerCase();

  if (normalized.startsWith("health")) {
    return (
      job.tags.some((tag) => tag.toLowerCase().includes("health")) ||
      job.about?.toLowerCase().includes("health") ||
      job.companyTagline?.toLowerCase().includes("health") ||
      false
    );
  }

  if (normalized.includes("contractor")) {
    return job.badges?.some((badge) => badge.type === "contract") ?? false;
  }

  if (normalized.includes("verified")) {
    return job.badges?.some((badge) => badge.type === "verified") ?? false;
  }

  return false;
};

const matchesLocationFilter = (job: JobFixture, filter: string | null) => {
  if (!filter || filter === "Any location") {
    return true;
  }

  return job.remoteScope.toLowerCase().includes(filter.toLowerCase());
};

const matchesSearch = (job: JobFixture, value: string) => {
  if (!value.trim()) {
    return true;
  }

  const haystack = [
    job.title,
    job.company,
    job.remoteScope,
    job.salary,
    job.about ?? "",
    job.tags.join(" "),
  ]
    .join(" ")
    .toLowerCase();

  return haystack.includes(value.trim().toLowerCase());
};

const formatAgeLabel = (days: number) => {
  if (days <= 0) {
    return "New";
  }

  if (days >= 14 && days % 7 === 0) {
    return `${days / 7}w`;
  }

  return `${days}d`;
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export default function HomePage() {
  const [searchValue, setSearchValue] = useState("");
  const [filters, setFilters] = useState<FilterSelection>(initialFilters);
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState<SortOption>("Newest");
  const [openFilter, setOpenFilter] = useState<FilterKey | null>(null);
  const [sortOpen, setSortOpen] = useState(false);
  const [heroVisible, setHeroVisible] = useState(true);
  const [loaded, setLoaded] = useState(false);

  const filterRefs = useRef<Record<FilterKey, HTMLDivElement | null>>({
    location: null,
    salary: null,
    benefits: null,
  });
  const sortRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setLoaded(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openFilter) {
        const container = filterRefs.current[openFilter];
        if (container && !container.contains(event.target as Node)) {
          setOpenFilter(null);
        }
      }

      if (sortOpen) {
        const node = sortRef.current;
        if (node && !node.contains(event.target as Node)) {
          setSortOpen(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openFilter, sortOpen]);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenFilter(null);
        setSortOpen(false);
      }
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const suggestions = useMemo(() => {
    if (!searchValue.trim()) {
      return [];
    }

    const lower = searchValue.toLowerCase();

    return suggestionsCatalog
      .filter((item) => item.toLowerCase().includes(lower))
      .filter((item) => item.toLowerCase() !== lower)
      .slice(0, 6);
  }, [searchValue]);

  const adFixture = jobFixtures.find((job) => job.isAd);

  const filteredJobs = useMemo(() => {
    const jobs = jobFixtures.filter((job) => !job.isAd);

    const filtered = jobs.filter((job) => {
      const matchesFilters =
        matchesLocationFilter(job, filters.location) &&
        matchesSalaryFilter(job.salary, filters.salary) &&
        matchesBenefitFilter(job, filters.benefits);

      const matchesTags =
        activeTags.length === 0 ||
        activeTags.every((tag) =>
          job.tags.some(
            (jobTag) => jobTag.toLowerCase() === tag.toLowerCase()
          )
        );

      return matchesFilters && matchesTags && matchesSearch(job, searchValue);
    });

    const sorted = [...filtered];

    sorted.sort((a, b) => {
      if (sortOption === "Newest") {
        return a.postedDays - b.postedDays;
      }

      if (sortOption === "Oldest") {
        return b.postedDays - a.postedDays;
      }

      const aRange = parseSalaryRange(a.salary);
      const bRange = parseSalaryRange(b.salary);

      const aMax = aRange?.max ?? 0;
      const bMax = bRange?.max ?? 0;

      return bMax - aMax;
    });

    return sorted;
  }, [activeTags, filters, searchValue, sortOption]);

  const jobCount = filteredJobs.length;

  const handleSelectOption = (key: FilterKey, option: string) => {
    const isDefault = option.toLowerCase().startsWith("any");
    setFilters((prev) => ({
      ...prev,
      [key]: isDefault ? null : option,
    }));
    setOpenFilter(null);
  };

  const handleTagToggle = (tag: string) => {
    setActiveTags((prev) =>
      prev.includes(tag) ? prev.filter((item) => item !== tag) : [...prev, tag]
    );
  };

  const handleJobTagClick = (tag: string) => {
    setActiveTags((prev) =>
      prev.includes(tag) ? prev.filter((item) => item !== tag) : [...prev, tag]
    );
  };

  const handleApplySuggestion = (value: string) => {
    setSearchValue(value);
  };

  return (
    <div className={styles.page}>
      <div className={styles.shell}>
        <header className={styles.topBar}>
          <div className={styles.brand}>
            <span className={styles.logoMark} aria-hidden>
              <svg
                width="26"
                height="26"
                viewBox="0 0 26 26"
                role="img"
                aria-hidden="true"
              >
                <circle cx="13" cy="13" r="13" fill="#1976D2" />
                <path
                  d="M7.5 13c0-3.05 2.45-5.5 5.5-5.5s5.5 2.45 5.5 5.5-2.45 5.5-5.5 5.5-5.5-2.45-5.5-5.5Zm3.2-1.6 2.3 3.1 2.3-3.1"
                  stroke="#fff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </svg>
            </span>
            <div className={styles.brandCopy}>
              <span className={`caveat-logo ${styles.logoText}`}>Remote OK</span>
              <span className={styles.brandCaption}>Remote jobs you can do from anywhere.</span>
            </div>
          </div>
          <nav className={styles.headerActions} aria-label="Secondary">
            <Link
              href="https://safetywing.com/nomad-insurance"
              className={`${styles.pillButton} ${styles.pillHealth}`}
            >
              Health insurance
            </Link>
            <Link
              href="/post-job"
              className={`${styles.pillButton} ${styles.pillPrimary}`}
            >
              Post a job →
            </Link>
            <Link
              href="/login"
              className={`${styles.pillButton} ${styles.pillOutline}`}
            >
              Log in
            </Link>
          </nav>
        </header>

        {heroVisible && (
          <section
            className={styles.heroBanner}
            role="complementary"
            aria-label="Employer announcement"
          >
            <div className={styles.heroMain}>
              <span aria-hidden className={styles.heroEmoji}>
                👉
              </span>
              <p className={styles.heroMessage}>
                Hiring remotely? Reach <strong>8,200,000+ remote workers</strong> on the #1 remote job platform.
              </p>
            </div>
            <div className={styles.heroActions}>
              <Link
                href="/post-job"
                className={styles.heroCta}
                aria-label="Post a remote job"
              >
                Post a remote job →
              </Link>
              <button
                type="button"
                className={styles.heroHide}
                onClick={() => setHeroVisible(false)}
                aria-label="Hide hiring announcement"
              >
                Hide this
              </button>
            </div>
          </section>
        )}

        <section className={styles.searchSection} aria-labelledby="search-heading">
          <h2 id="search-heading" className="sr-only">
            Search and filter remote jobs
          </h2>
          <div className={styles.searchRow}>
            <span className={`caveat-logo ${styles.inlineLogo}`} aria-hidden>
              RO
            </span>
            <div className={styles.searchControl}>
              <label htmlFor="job-search" className={styles.srOnly}>
                Search remote jobs
              </label>
              <span className={styles.searchIcon} aria-hidden>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12.3 12.3 16 16"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                  <circle
                    cx="8"
                    cy="8"
                    r="5.5"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  />
                </svg>
              </span>
              <input
                id="job-search"
                className={styles.searchInput}
                type="search"
                placeholder="Search by role, company or keyword"
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
                autoComplete="off"
                aria-autocomplete="list"
                aria-controls="search-suggestions"
                aria-expanded={suggestions.length > 0}
              />
              {suggestions.length > 0 && (
                <ul
                  id="search-suggestions"
                  className={styles.searchSuggestions}
                  role="listbox"
                >
                  {suggestions.map((suggestion) => (
                    <li key={suggestion} className={styles.suggestionItem}>
                      <button
                        type="button"
                        onClick={() => handleApplySuggestion(suggestion)}
                        className={styles.suggestionButton}
                        role="option"
                      >
                        {suggestion}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className={styles.filterGroup}>
              {filterKeys.map((key) => {
                const activeValue = filters[key] ?? FILTER_OPTIONS[key][0];
                return (
                  <div
                    key={key}
                    ref={(node) => {
                      filterRefs.current[key] = node;
                    }}
                    className={styles.filterDropdown}
                  >
                    <button
                      type="button"
                      className={styles.dropdownButton}
                      aria-expanded={openFilter === key}
                      aria-controls={`${key}-menu`}
                      onClick={() =>
                        setOpenFilter((prev) => (prev === key ? null : key))
                      }
                    >
                      <span className={styles.dropdownLabel}>
                        {FILTER_LABELS[key]}
                      </span>
                      <span className={styles.dropdownValue}>{activeValue}</span>
                      <span className={styles.dropdownChevron} aria-hidden>
                        <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                          <path
                            d="M1 1.25 5 5l4-3.75"
                            stroke="currentColor"
                            strokeWidth="1.3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                    </button>
                    <div
                      id={`${key}-menu`}
                      className={`${styles.dropdownPanel} ${
                        openFilter === key ? styles.dropdownPanelOpen : ""
                      }`}
                      role="menu"
                    >
                      {FILTER_OPTIONS[key].map((option) => {
                        const isActive = activeValue === option;
                        return (
                          <button
                            key={option}
                            type="button"
                            role="menuitemradio"
                            aria-checked={isActive}
                            onClick={() => handleSelectOption(key, option)}
                            className={`${styles.dropdownOption} ${
                              isActive ? styles.dropdownOptionActive : ""
                            }`}
                          >
                            {option}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className={styles.sortWrapper} ref={sortRef}>
              <button
                type="button"
                className={styles.dropdownButton}
                aria-expanded={sortOpen}
                aria-controls="sort-menu"
                onClick={() => setSortOpen((prev) => !prev)}
              >
                <span className={styles.dropdownLabel}>Sort</span>
                <span className={styles.dropdownValue}>{sortOption}</span>
                <span className={styles.dropdownChevron} aria-hidden>
                  <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                    <path
                      d="M1 1.25 5 5l4-3.75"
                      stroke="currentColor"
                      strokeWidth="1.3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </button>
              <div
                id="sort-menu"
                className={`${styles.dropdownPanel} ${
                  sortOpen ? styles.dropdownPanelOpen : ""
                }`}
                role="menu"
              >
                {SORT_OPTIONS.map((option) => (
                  <button
                    key={option}
                    type="button"
                    role="menuitemradio"
                    aria-checked={sortOption === option}
                    className={`${styles.dropdownOption} ${
                      sortOption === option ? styles.dropdownOptionActive : ""
                    }`}
                    onClick={() => {
                      setSortOption(option);
                      setSortOpen(false);
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className={styles.tagScroller} aria-label="Popular categories">
            {TAG_FILTERS.map((tag) => {
              const isActive = activeTags.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  className={`${styles.tagChip} ${isActive ? styles.tagChipActive : ""}`}
                  onClick={() => handleTagToggle(tag)}
                  aria-pressed={isActive}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </section>

        {adFixture && (
          <section
            className={`${styles.adCard} ${loaded ? styles.adCardVisible : ""}`}
            aria-label="Sponsored listing"
          >
            <div className={styles.adIcon} aria-hidden>
              {avatarIconMap[adFixture.theme]}
            </div>
            <div className={styles.adBody}>
              <h2 className={`caveat-title--lg ${styles.adTitle}`}>
                {adFixture.title}
              </h2>
              <p className={styles.adSubtitle}>{adFixture.about}</p>
            </div>
            <Link href="https://safetywing.com/nomad-insurance" className={styles.adCta}>
              Sign up today
            </Link>
          </section>
        )}

        <div className={styles.listHeader}>
          <h2 className={`caveat-title ${styles.jobFeedTitle}`}>
            Latest remote openings
          </h2>
          <p className={styles.jobCount} aria-live="polite">
            {jobCount} roles
          </p>
        </div>

        <section className={styles.jobList} aria-label="Remote job listings">
          {filteredJobs.map((job, index) => (
            <article
              key={job.id}
              className={`${styles.jobCard} ${loaded ? styles.jobCardLoaded : ""}`}
              data-theme={job.theme}
              style={{ animationDelay: `${index * 90}ms` }}
            >
              <div className={styles.jobCardHeader}>
                <span className={styles.companyAvatar} data-theme={job.theme} aria-hidden>
                  {avatarIconMap[job.theme]}
                </span>
                <div className={styles.jobHeading}>
                  <h3 className={`caveat-title--lg ${styles.jobTitle}`}>
                    <Link
                      href={`/remote-jobs/${slugify(job.title)}-${job.id}`}
                      className={styles.jobTitleLink}
                    >
                      {job.title}
                    </Link>
                  </h3>
                  <p className={styles.companyName}>{job.company}</p>
                  <div className={styles.badgeRow}>
                    {job.badges?.map((badge) => (
                      <span key={badge.label} className={styles.badge}>
                        <span className={styles.badgeIcon} aria-hidden>
                          {badge.type in badgeIconMap ? badgeIconMap[badge.type as BadgeType] : ""}
                        </span>
                        {badge.label}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className={styles.jobAside}>
                <div className={styles.tagGroup}>
                  {job.tags.map((tag) => {
                    const isActive = activeTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        className={`${styles.jobTag} ${isActive ? styles.jobTagActive : ""}`}
                        onClick={() => handleJobTagClick(tag)}
                        aria-pressed={isActive}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
                <Link
                  href={`/remote-jobs/${slugify(job.title)}-${job.id}`}
                  className={styles.jobAgeLink}
                  aria-label={`Posted ${formatAgeLabel(job.postedDays)} ago`}
                >
                  {formatAgeLabel(job.postedDays)}
                </Link>
              </div>
            </article>
          ))}

          {filteredJobs.length === 0 && (
            <p className={styles.emptyState}>
              No roles match your filters yet. Try broadening your search or
              clearing a few filters.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
