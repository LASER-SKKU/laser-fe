import { useState, useRef, useEffect, useMemo } from "react";
import { Link, useLocation, useSearchParams, useNavigate } from "react-router-dom";
import { GROUPS } from "../share/groups";
import FilterCard from "../components/FilterCard";
import ProfessorCard from "../components/ProfessorCard";
import "./Home.css";
import "./Search.css"

import logo from "../assets/logo/logoxmas.svg";
import nf404 from "../assets/logo/404.svg";
import noresult from "../assets/logo/noresult.svg";
import mryj from "../assets/logo/mryj.svg";

const getDeptMetaById = (id) => {
  if (!id) return null;
  for (const g of GROUPS) {
    const s = g.sub.find((x) => x.id === id);
    if (s) return { label: s.label, color:s.color, icon: s.icon };
  }
  return null;
};

const normalizeUrl = (raw) => {
  const s = String(raw ?? "").trim();
  if (!s) return "";
  return /^(https?:)?\/\//i.test(s) ? s : `https://${s}`;
};

function NoResultSkeleton() {
  return (
    <div className="noresult-skeleton">
      {[0, 1].map((block) => (
        <div key={block} className="noresult-block">
          <div className="skel-title-bar" />
          <div className="skel-line wide-1" />
          <div className="skel-line wide-2" />
          <div className="skel-line wide-3" />
          <div className="skel-title-bar" />
          <div className="skel-line wide-1" />
          <div className="skel-line wide-2" />
          <div className="skel-line wide-3" />
          <div className="skel-title-bar" />
          <div className="skel-line wide-1" />
          <div className="skel-line wide-2" />
          <div className="skel-line wide-3" />
        </div>
      ))}
    </div>
  );
}

function AiSearchingHeader() {
  const [dotCount, setDotCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setDotCount((prev) => (prev + 1) % 4); // 0,1,2,3 반복
    }, 500); // 0.5초마다 변경
    return () => clearInterval(id);
  }, []);

  const dots = ".".repeat(dotCount);

  return (
    <div className="ai-search-header">
      {/* 1. 로고 + 로딩 빛 효과 */}
      <div className="ai-wait-logo-wrap">
        <img src={mryj} alt="Loading" className="ai-wait-logo" />
      </div>

      {/* 2. Wait a minute (초록 글씨 + 흰 빛 샥샥) */}
      <div className="ai-wait-title">Wait a minute</div>

      {/* 3. 점 개수 변하는 문구 */}
      <div className="ai-wait-message">
        AI is looking for a custom lab
        <span className="ai-wait-dots">{dots}</span>
      </div>
    </div>
  );
}

function AiProfessorCard({ item }) {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  const meta = getDeptMetaById(item.department);

  const rawScore =
    typeof item.final_score === "number" ? item.final_score : null;
  
  const scoreDisplay = rawScore != null ? (rawScore * 100).toFixed(1) : null;

  const fillPct =
    rawScore != null
      ? `${Math.max(0, Math.min(1, rawScore)) * 100}%`
      : "0%";
  
  let scoreColor = "#e0e0e0";
  if (rawScore != null) {
    if (rawScore >= 0.8) scoreColor = "#1e88e5";
    else if (rawScore >= 0.6) scoreColor = "#43a047";
    else if (rawScore >= 0.4) scoreColor = "#fbc02d";
    else if (rawScore >= 0.2) scoreColor = "#fb8c00";
    else scoreColor = "#e53935";
  }

  const labSummary = item.summary;
  const aiReason = item.recommendation_reason;
  const aiPapers = Array.isArray(item.top_similar_papers)
    ? item.top_similar_papers
    : [];

  const handleCardClick = () => {
    navigate(`/labs/${item.lab_id}`);
  };

  const handlePaperClick = (paperId, e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    if (!paperId) return;
    navigate(`/papers/${paperId}`);
  };

  const handleDetailClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setExpanded((prev) => !prev);
  };

  return (
    <article
      className={`prof-card ai-prof-card ${expanded ? "expanded" : ""}`}
      onClick={handleCardClick}
    >
      {scoreDisplay && (
        <span
          className="ai-score-pill"
          style={{
            "--score-fill": fillPct,
            "--score-color": scoreColor,
          }}
        >
          SCORE {scoreDisplay}
        </span>
      )}

      <div className="prof-left">
        {item.image_url && (
          <img
            src={item.image_url}
            alt={item.professor_name}
            className="prof-photo"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.style.opacity = "0";
            }}
          />
        )}
      </div>

      <div className="prof-right">
        <div className="prof-header-row">
          <span
            className="dept-badge"
            style={
              meta?.color ? { "--dept-color": meta.color } : undefined
            }
          >
            {meta?.icon && (
              <img
                src={meta.icon}
                alt=""
                className="dept-badge-icon"
                aria-hidden="true"
              />
            )}
            <span>{meta?.label || item.department}</span>
          </span>
        </div>

        <div className="prof-head">
          <h3 className="prof-name">{item.professor_name}</h3>
        </div>

        {labSummary && <p className="prof-summary">{labSummary}</p>}
      </div>

      <div className="ai-prof-footer">
        <button
          type="button"
          className="prof-detail-btn"
          onClick={handleDetailClick}
        >
          Detail
        </button>
      </div>

      {expanded && (
        <div className="ai-detail-panel">
          {aiReason && (
            <div className="ai-reason-block">
              <h4 className="ai-subtitle">Recommendation summary</h4>
              <p className="ai-reason-text">{aiReason}</p>
            </div>
          )}

          {aiPapers.length > 0 && (
            <div className="ai-papers-block">
              <h5 className="ai-papers-title">Related papers</h5>
              <div className="ai-papers-list">
                {aiPapers.map((p) => {
                  const sim =
                    typeof p.similarity === "number"
                      ? p.similarity.toFixed(2)
                      : null;

                  return (
                    <div
                      key={p.paper_id || p.title}
                      className="ai-paper-card"
                      role="button"
                      tabIndex={0}
                      onClick={(e) => handlePaperClick(p.paper_id, e)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          handlePaperClick(p.paper_id, e);
                        }
                      }}
                    >
                      <div className="ai-paper-title">{p.title}</div>
                      {sim && (
                        <span className="ai-paper-sim-pill">{sim}</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </article>
  );
}

export default function SearchResults() {
  const routerLocation = useLocation();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const idFromQS = searchParams.get("tag");

  const aiText = (searchParams.get("ai") ?? "").trim();
  const hasAI = aiText.length > 0;

  const [noResultPhase, setNoResultPhase] = useState("idle");
  const [aiResults, setAiResults] = useState([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState(null);
  const [aiDone, setAiDone] = useState(false);
  
  const findSubById = (id) => {
    if (!id) return null;
    for (const g of GROUPS) {
      const hit = g.sub.find((s) => s.id === id);
      if (hit) return hit;
    }
    return null;
  };

  const pre = location.state?.selected ?? findSubById(idFromQS);

  const [labs, setLabs] = useState([]);
  const [labsLoading, setLabsLoading] = useState(false);
  const [labsError, setLabsError] = useState(null);
  const [tags, setTags] = useState(pre ? [pre] : []);
  const [selectedByGroup, setSelectedByGroup] = useState(pre ? { [pre.groupId]: pre } : {});
  const [openGroupId, setOpenGroupId] = useState(null);
  const [notFound, setNotFound] = useState(false);

  const initialTag = idFromQS || null;
  const [pendingTag, setPendingTag] = useState(initialTag);
  const [currentTag, setCurrentTag] = useState(initialTag);
  const canSearch = !!pendingTag;
  const addOrReplaceChip = (sub) => {
    setTags([sub]);
    setSelectedByGroup({ [sub.groupId]: sub });
  };
  const clearGroup = (groupId) => {
    setTags([]);
    setSelectedByGroup({});
  }

  const onSubmitTag = (e) => {
    e.preventDefault();
    setCurrentTag(pendingTag || null);
    const next = new URLSearchParams(searchParams);
    if (pendingTag) next.set("tag", pendingTag); else next.delete("tag");
    next.delete("ai");
    setSearchParams(next, { replace: false });
  };

  useEffect(() => {
    if (!currentTag) {
      setLabs([]);
      setLabsError(null);
      setNotFound(false);
      return;
    }

    const deptParam = currentTag;
    const ctrl = new AbortController();

    (async () => {
      try {
        setLabs([]);
        setLabsError(null);
        setNotFound(false);
        setLabsLoading(true);

        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/labs?department=${encodeURIComponent(deptParam)}`,
          { signal: ctrl.signal }
        );
        if (res.status === 404) {
          setNotFound(true);
          setLabs([]);
          setLabsError("HTTP 404");
          setLabsLoading(false);
          return;
        }
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setLabs(Array.isArray(data) ? data : []);
      } catch (e) {
        if (e.name !== "AbortError") {
          setLabs([]);
          setLabsError(String(e.message || e));
        }
      } finally {
        setLabsLoading(false);
      }
    })();

    return () => ctrl.abort();
  }, [currentTag]);

  useEffect(() => {
    if (!hasAI) {
      setAiResults([]);
      setAiError(null);
      setAiDone(false);
      return;
    }

    const ctrl = new AbortController();

    (async () => {
      try {
        setAiLoading(true);
        setAiError(null);
        setAiDone(false);

        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/labs/recommend`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_text: aiText }),
            signal: ctrl.signal,
          }
        );

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const data = await res.json();
        const baseResults = Array.isArray(data.results) ? data.results : [];
        const enriched = await Promise.all(
          baseResults.map(async (r) => {
            try {
              const labRes = await fetch(
                `${process.env.REACT_APP_API_URL}/labs/${encodeURIComponent(
                  r.lab_id
                )}`,
                { signal: ctrl.signal }
              );
              if (!labRes.ok) return r;
              const lab = await labRes.json();
              return {
                ...r,
                image_url: lab.image_url,
                summary: lab.summary,
                homepage_url: lab.homepage_url,
              };
            } catch {
              return r;
            }
          })
        );

        setAiResults(enriched);
      } catch (e) {
        if (e.name === "AbortError") return;
        console.error(e);
        setAiResults([]);
        setAiError(e.message || "Failed to load recommendation");
      } finally {
        setAiLoading(false);
        setAiDone(true);
      }
    })();

    return () => ctrl.abort();
  }, [hasAI, aiText]);


  const selected = tags[0] || null;

  const selectedTagId = selected?.id || idFromQS || null;

  const displayList = useMemo(() => {
    if (hasAI) return aiResults;
    if (currentTag) return labs;
    return [];
  }, [hasAI, aiResults, currentTag, labs]);
  
  const shouldShowNoResult =
    !labsLoading &&
    !labsError &&
    !notFound &&
    !aiLoading &&
    !aiError &&
    (aiDone || !hasAI) &&
    displayList.length === 0;

  // search result timeout
  useEffect(() => {
    if (!shouldShowNoResult) {
      setNoResultPhase("idle");
      return;
   }

    setNoResultPhase("skeleton");
    const timer = setTimeout(() => {
      setNoResultPhase("image");
    }, 30000);

    return () => clearTimeout(timer);
  }, [shouldShowNoResult]);

  return (
    <main className="home search-page">
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
                          setOpenGroupId((prev) => (prev === group.groupId ? null : group.groupId))
                        }
                        onPickSub={(subOrNull) => {
                          if (subOrNull) {
                            addOrReplaceChip(subOrNull);
                            setPendingTag(subOrNull.id);
                          } else {
                            clearGroup(group.groupId);
                            setPendingTag(null);
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
                    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
                      <path
                        fill="currentColor"
                        d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 1 0-.71.71l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0A4.5 4.5 0 1 1 14 9.5 4.5 4.5 0 0 1 9.5 14z"
                      />
                    </svg>
                  </button>
                </div>
              </form>
            </div>

            {!hasAI && notFound && (
              <div className="nf-wrap">
                <img src={nf404} alt="Not Found" className="nf-img" />
              </div>
            )}

              {displayList.length > 0 && (
                <div className="labs-list-header">
                  <span className="labs-list-pill" />
                  <span className="labs-list-title">
                    {hasAI ? "Recommendation Results" : "Labs List"}
                  </span>
                </div>
              )}
              <section className="prof-cards">
                {hasAI ? (
                  <>
                    {aiLoading && <div className="empty">Loading...</div>}
                    {aiError && !aiLoading && (
                      <div className="empty">Error: {aiError}</div>
                    )}
                    {shouldShowNoResult && noResultPhase === "skeleton" && (
                      <>
                        <AiSearchingHeader />
                        <NoResultSkeleton />
                      </>
                    )}

                    {shouldShowNoResult && noResultPhase === "image" && (
                      <div className="noresult-wrap">
                        <img src={noresult} alt="No result" className="noresult-img" />
                      </div>
                    )}

                  </>
                ) : (
                  <>
                    {labsLoading && <div className="empty">Loading</div>}
                    {labsError && !notFound && (
                      <div className="empty">Error: {labsError}</div>
                    )}
                    {displayList.length === 0 &&
                      !labsLoading &&
                      !labsError &&
                      !notFound && <div className="empty">There is no result</div>}
                    </>
                )}

                {displayList.map((item) => {
                  if (hasAI) {
                    return <AiProfessorCard key={item.lab_id} item={item} />;
                  }

                  const meta = getDeptMetaById(item.department);
                  return (
                    <ProfessorCard
                      key={item.lab_id}
                      labId={item.lab_id}
                      name={item.professor_name}
                      summary={item.summary}
                      fields={[]}
                      badges={[]}
                      mode="normal"
                      deptName={meta?.label || item.department}
                      deptColor={meta?.color}
                      deptIcon={meta?.icon}
                      website={normalizeUrl(item.homepage_url)}
                      photoSrc={item.image_url}
                    />
                  );
                })}
              </section>
          </div>
        </main>
  );
}