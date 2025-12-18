// src/pages/Papers.jsx
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { GROUPS } from "../share/groups";
import { getApiUrl } from "../utils/api";
import FilterCard from "../components/FilterCard";

import "./Home.css";
import "./Search.css";
import "./Details.css";
import "./Papers.css";
import logo from "../assets/logo/logoxmas.svg";
import publication from "../assets/icons/publication.svg";
import citation from "../assets/icons/citation.svg";
import popular from "../assets/icons/popular.svg";
import authoritative from "../assets/icons/authoritative.svg";
import readmore from "../assets/icons/readmore.svg";

const getDeptMetaById = (id) => {
  if (!id) return null;
  for (const g of GROUPS) {
    const s = g.sub.find((x) => x.id === id);
    if (s) return { label: s.label, color: s.color, icon: s.icon };
  }
  return null;
};

export default function Papers() {
  const { paperId } = useParams();
  const navigate = useNavigate();

  // main interface
  const [tags, setTags] = useState([]);
  const [openGroupId, setOpenGroupId] = useState(null);
  const [selectedByGroup, setSelectedByGroup] = useState({});
  
  // paper information
  const [paper, setPaper] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // TODO: 논문 홈페이지 링크 기능 추가

  // lab information
  const [lab, setLab] = useState(null);
  const [labLoading, setLabLoading] = useState(false);
  const [labError, setLabError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);

  const canSearch = !!tags[0];

  const [impactInfo, setImpactInfo] = useState(null);

  const toggleImpactInfo = (type) => {
    setImpactInfo((prev) => (prev === type ? null : type));
  };

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

  useEffect(() => {
    if (!paperId) return;

    const controller = new AbortController();

    (async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(
          getApiUrl(`/papers/${encodeURIComponent(paperId)}`),
          { signal: controller.signal }
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();
        setPaper(data);
      } catch (e) {
        if (e.name === "AbortError") return;
        console.error(e);
        setError(e.message || "Failed to load");
      } finally {
        setLoading(false);
      }
    })();

    return () => controller.abort();
  }, [paperId]);

  useEffect(() => {
    if (!paper || !paper.lab_id) {
      setLab(null);
      return;
    }

    const controller = new AbortController();

    (async () => {
      try {
        setLabLoading(true);
        setLabError(null);

        const res = await fetch(
          getApiUrl(`/labs/${encodeURIComponent(paper.lab_id)}`),
          { signal: controller.signal }
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();
        setLab(data);
      } catch (e) {
        if (e.name === "AbortError") return;
        console.error(e);
        setLabError(e.meesage || "Failed to load lab info");
      } finally {
        setLabLoading(false);
      }
    })();

    return () => controller.abort();
  }, [paper]);

  const deptMeta = lab ? getDeptMetaById(lab.department) : null;

  return (
    <main className="home search-page papers-page">
      <div className="hero">
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
                        clearGroup();
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

        <div className="papers-body">
          <div className="papers-outer">
            {loading && <p>Loading...</p>}
            {error && !loading && <p>Error: {error}</p>}
          
            {paper && (
              <>
              {/* Lab Information header */}
              <div className="lab-info-header">
                <span className="labs-list-pill" />
                <span className="labs-list-title">Paper Information</span>
              </div>
              <div className="papers-inner papers-page">
                {(() => {
                  const citations = Number(paper.citation_count ?? 0);
                  var impactType =
                    citations >= 500 ? "authoritative" : citations >= 100 ? "popular" : null;
                
                  return (
                    <div className="paper-badges-row papers-page">
                      <div className="paper-badge year papers-page">
                        <img
                          src={publication}
                          alt=""
                          className="paper-badge-icon"
                          aria-hidden="true"
                        />
                        <span>{paper.publication_year}</span>
                      </div>
                      <div className="paper-badge cites papers-page">
                        <img
                          src={citation}
                          alt=""
                          className="paper-badge-icon"
                          aria-hidden="true"
                        />
                        <span>{paper.citation_count}</span>
                      </div>

                      {impactType === "popular" && (
                        <button
                          type="button"
                          className="paper-badge impact popular"
                          onClick={() => toggleImpactInfo("popular")}
                        >
                          <img
                            src={popular}
                            alt=""
                            className="paper-badge-icon"
                            aria-hidden="true"
                          />
                          <span>Popular</span>

                          {impactInfo === "popular" && (
                            <div className="badge-popover">
                              This is a paper with more than 100 citations
                            </div>
                          )}
                        </button>
                      )}

                      {impactType === "authoritative" && (
                        <button
                          type="button"
                          className="paper-badge impact authoritative"
                          onClick={() => toggleImpactInfo("authoritative")}
                        >
                          <img
                            src={authoritative}
                            alt=""
                            className="paper-badge-icon"
                            aria-hidden="true"
                          />
                          <span>Authoritative</span>

                          {impactInfo === "authoritative" && (
                            <div className="badge-popover">
                              This is a paper with more than 500 citations
                            </div>
                          )}
                        </button>
                      )}

                      {paper.google_scholar_url && (
                        <button
                          type="button"
                          className="paper-readmore-pill"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation?.();
                            window.open(
                              paper.google_scholar_url,
                              "_blank",
                              "noopener,noreferrer"
                            );
                          }}
                        >
                          <img
                            src={readmore}
                            alt=""
                            className="paper-readmore-icon"
                            aria-hidden="true"
                          />
                          <span>Read More</span>
                        </button>
                      )}
                    </div>
                  );
                })()}

                  <h1 className="papers-title">{paper.title}</h1>

                  <section className="papers-section">
                    <div className="papers-divider" />
                    <h2 className="papers-section-title">Lab information</h2>

                    {labLoading && (
                      <p className="papers-subtext">Loading lab information...</p>
                    )}
                    {labError && !labLoading && (
                      <p className="papers-subtext error">Error: {labError}</p>
                    )}

                    {lab && (
                      <div className="details-left papers-lab">
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
                            style={
                              deptMeta?.color
                                ? { "--dept-color": deptMeta.color }
                                : undefined
                            }
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
                            <h2 className="details-prof-name">
                              {lab.professor_name}
                            </h2>

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

                        <p className="details-summary">{lab.summary}</p>
                      </div>
                    </div>
                  )}
                </section>

                <section className="papers-section">
                  <div className="papers-divider" />
                  <h2 className="papers-section-title">Abstraction</h2>
                  
                  {paper.abstract ? (
                    <p className="paper-text">{paper.abstract}</p>
                  ) : (
                    <p className="papers-placeholder">
                        No abstraction is provided for this paper.
                    </p>
                  )}
                </section>

                <section className="papers-section">
                  <div className="papers-divider" />
                  <h2 className="papers-section-title">Summary</h2>
                  
                  {paper.summary ? (
                    <p className="papers-text">{paper.summary}</p>
                  ) : (
                    <p className="papers-placeholder">
                        No summary is provided for this paper.
                    </p>
                  )}
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