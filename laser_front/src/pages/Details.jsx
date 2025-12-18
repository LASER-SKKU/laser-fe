// src/pages/Details.jsx
import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";

import { GROUPS } from "../share/groups";
import { getApiUrl } from "../utils/api";
import FilterCard from "../components/FilterCard";

import "./Home.css";
import "./Search.css";
import "./Details.css";
import logo from "../assets/logo/logoxmas.svg";
import nopaper from "../assets/icons/nopaper.svg";
import publication from "../assets/icons/publication.svg";
import citation from "../assets/icons/citation.svg";

const getDeptMetaById = (id) => {
  if (!id) return null;
  for (const g of GROUPS) {
    const s = g.sub.find((x) => x.id === id);
    if (s) return { label: s.label, color: s.color, icon: s.icon };
  }
  return null;
}

export default function Details() {
  const { labId } = useParams();
  const navigate = useNavigate();

  const handlePaperClick = (paperId) => {
    if (!paperId) return;
    navigate(`/papers/${paperId}`)
  }

  const [tags, setTags] = useState([]);
  const [openGroupId, setOpenGroupId] = useState(null);
  const [selectedByGroup, setSelectedByGroup] = useState({});

  const canSearch = !!tags[0];

  const addOrReplaceChip = (sub) => {
    setTags([sub]);
    setSelectedByGroup({ [sub.groupId]: sub });
  };

  const clearGroup = () => {
    setTags([]);
    setSelectedByGroup({});
  };

  const onSubmitTag = (e) => {
    e.preventDefault();
    if (!tags[0]) return;

    const tag = tags[0];
    navigate(`/search?tag=${encodeURIComponent(tag.id)}`, {
      state: { selected: tag },
    });
  };

  const [lab, setLab] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isFavorite, setIsFavorite] = useState(false);

  const deptMeta = lab ? getDeptMetaById(lab.department) : null;

  useEffect(() => {
    if (!labId) return;

    const ctrl = new AbortController();

    (async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(
          getApiUrl(`/labs/${encodeURIComponent(labId)}`),
          { signal: ctrl.signal }
        );

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const data = await res.json();
        setLab(data);
      } catch (e) {
        if (e.name === "AbortError") return;
        setError(e.message || "Failed to load");
      } finally {
        setLoading(false);
      }
    })();

    return () => ctrl.abort();
  }, [labId]);

  return (
    <main className="home details-page">
      <div className="hero">
        {/* Logo & Department tags */}
        <div className="search-row">
          <Link to="/">
            <img src={logo} alt="LASER" className="site-logo" />
          </Link>

          <form className="search-wrap" onSubmit={onSubmitTag}>
            <div className="bar-row">
              <div className="filters-row">
                {GROUPS.map((group) => (
                  <FilterCard
                    key={group.groupId}
                    group={group}
                    open={openGroupId === group.groupId}
                    selected={selectedByGroup[group.groupId] || null}
                    onToggle={() =>
                      setOpenGroupId((prev) =>
                        prev === group.groupId ? null : group.groupId
                      )
                    }
                    onPickSub={(subOrNull) => {
                      if (subOrNull) {
                        addOrReplaceChip(subOrNull);
                      } else {
                        clearGroup(group.groupId);
                      }
                      setOpenGroupId(null);
                    }}
                  />
                ))}
              </div>

              <button
                className={`search-btn ${canSearch ? "enabled" : "disabled"}`}
                type="submit"
                disabled={!canSearch}
                aria-label="검색"
              >
                <svg
                  viewBox="0 0 24 24"
                  width="22"
                  height="22"
                  aria-hidden="true"
                >
                  <path
                    fill="currentColor"
                    d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 1 0-.71.71l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0A4.5 4.5 0 1 1 14 9.5 4.5 4.5 0 0 1 9.5 14z"
                  />
                </svg>
              </button>
            </div>
          </form>
        </div>

        <div className="details-body">
          <div className="details-inner">
            {loading && <div className="empty">Loading.</div>}
            {error && !loading && <div className="empty">Error: {error}</div>}
            {!loading && !error && !lab && (
              <div className="empty">No data.</div>
            )}

            {lab && (
            <>
              {/* Lab Information header */}
              <div className="lab-info-header">
                <span className="labs-list-pill" />
                <span className="labs-list-title">Lab Information</span>
              </div>

              <div className="details-layout">
                <section className="details-top">
                  <div className="details-left">
                    <div className="details-photo-wrapper">
                      {lab.image_url ? (
                        <img
                          src={lab.image_url}
                          alt={lab.professor_name}
                          className="details-photo"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.style.opacity = "0";
                          }}
                        />
                      ) : (
                        <div className="details-photo-placeholder" />
                      )}
                    </div>

                    <div className="details-main">
                      <span
                        className="dept-badge"
                        style={deptMeta?.color ? { "--dept-color": deptMeta.color } : undefined}
                      >
                        {deptMeta?.icon && (
                          <img
                            src={deptMeta.icon}
                            alt=""
                            className="dept-badge-icon"
                            aria-hidden="true"
                          />
                        )}
                        <span>{deptMeta?.label || lab.department}</span>
                      </span>

                      <div className="details-name-row">
                        <h1 className="details-prof-name">
                          {lab.professor_name}
                        </h1>
                        
                        <div className="details-icons">
                          <button
                            type="button"
                            className={`details-icon-btn star ${
                              isFavorite ? "active" : ""
                            }`}
                            onClick={() =>
                              setIsFavorite((prev) => !prev)
                            }
                            aria-label={
                              isFavorite ? "Favorite" : "Cancel"
                            }
                          >
                            <svg
                              viewBox="0 0 24 24"
                              width="28"
                              height="28"
                              aria-hidden="true"
                            >
                              <path d="M12 2.5l2.9 5.88 6.5.95-4.7 4.58 1.11 6.49L12 17.77l-5.81 3.06 1.11-6.49-4.7-4.58 6.5-.95L12 2.5z" />
                            </svg>
                          </button>
                          {lab.homepage_url && (
                            <a
                              className="details-icon-btn details-home"
                              href={lab.homepage_url}
                              target="_blank"
                              rel="noreferrer noopener"
                              aria-label="To lab homepage"
                            >
                              <svg
                                viewBox="0 0 24 24"
                                width="28"
                                height="28"
                                aria-hidden="true"
                              >
                                <path d="M12 3l9 8h-2v9h-5v-6H10v6H5v-9H3l9-8z" />
                              </svg>
                            </a>
                          )}
                        </div>
                      </div>

                      <p className="details-summary">
                        {lab.summary}
                      </p>
                    </div>
                  </div>
                </section>

                <section className="details-bottom">
                  <div className="paper-panel">
                    <h2 className="paper-panel-title">Paper</h2>

                    {(!lab.papers || lab.papers.length === 0) && (
                      <div className="nopaper-wrap">
                        <img src={nopaper} alt="No Papers" className="nopaper-img" />
                      </div>
                    )}

                    {lab.papers && lab.papers.length > 0 && (
                      <div className="paper-list">
                        {lab.papers.map((p) => (
                          <div
                            key={p.paper_id}
                            className="paper-card"
                            onClick={() => handlePaperClick(p.paper_id)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                handlePaperClick(p.paper_id);
                              }
                            }}
                          >
                            <div className="paper-title">
                              {p.title}
                            </div>

                            <div className="paper-badges-row">
                              <div className="paper-badge year">
                                <img
                                  src={publication}
                                  alt=""
                                  className="paper-badge-icon"
                                  aria-hidden="true"
                                />
                                <span>{p.publication_year}</span>
                              </div>

                              <div className="paper-badge cites">
                                <img
                                  src={citation}
                                  alt=""
                                  className="paper-badge-icon"
                                  aria-hidden="true"
                                />
                                <span>{p.citation_count}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </section>
              </div>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}