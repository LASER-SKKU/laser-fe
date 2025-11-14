import { useState, useRef, useEffect, useMemo } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { GROUPS } from "../share/groups";
import FilterCard from "../components/FilterCard";
import ProfessorCard from "../components/ProfessorCard";
import PROFS from "../share/profs";
import "./Home.css";
import "./Search.css"

import logo from "../assets/logo/logoxmas.svg";
import chemlogo from "../assets/logo/chemlogo.svg";
import * as profImg from "../assets/prof";
import nf404 from "../assets/logo/404.svg";

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

export default function SearchResults() {
  const routerLocation = useLocation();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const idFromQS = searchParams.get("tag");

  const aiText = (searchParams.get("ai") ?? "").trim();
  const hasAI = aiText.length > 0;
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
          `http://43.201.113.80:8000/labs?department=${encodeURIComponent(deptParam)}`,
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

  const selected = tags[0] || null;

  const selectedTagId = selected?.id || idFromQS || null;
  // const hasAI = Boolean((location.state?.aiQuery || searchParams.get("ai") || "").trim());

  const getAiScore = (p) => {
    const m = p?.aiMatch;
    if (!m) return -Infinity;
    if (typeof m === "number") return m;
    if (typeof m === "string") {
      const num = parseFloat(m.replace?.("%", "") ?? m);
      return Number.isFinite(num) ? num : -Infinity;
    }

    const s = m.score;
    if (typeof s === "number") return s;
    if (typeof s === "string") {
      const num = parseFloat(s.replace?.("%", "") ?? s);
      return Number.isFinite(num) ? num : -Infinity;
    }
    return -Infinity;
  };

  const getAiRank = (p) => {
    const r = p?.aiMatch?.rank;
    return typeof r === "number" ? r : Infinity;
  };

  const aiList = useMemo(() => {
    if (!hasAI) return [];
    let base = PROFS.filter(p => {
      const m = p.aiMatch;
      if (!m) return false;
      if (typeof m === "string") return m.trim().length > 0;
      if (typeof m === "object") return Boolean(m.reason) || typeof m.score === "number" || typeof m.rank === "number" || Boolean(m.match);
      return false;
    });

    if (currentTag) {
      base = base.filter(p => Array.isArray(p.depts) && p.depts.includes(currentTag));
    }

    return [...base].sort((a, b) => {
      const ds = getAiScore(b) - getAiScore(a);
      return ds !== 0 ? ds : getAiRank(a) - getAiRank(b);
    });
  }, [hasAI, currentTag]);

  const displayList = useMemo(() => {
    if (hasAI) return aiList;
    if (currentTag) return labs;
    return [];
  }, [hasAI, aiList, currentTag, labs]);

  // TODO: tag 기반으로 fetch 해서 목록 렌더링
  return (
    <main className="home search-page">
          <div className="hero">
            {/* 상단 좌측: 로고 + 검색창 가로 정렬 */}
            <div className="search-row">
              <Link to="/">
                <img src={logo} alt="LASER" className="site-logo" />
              </Link>
    
              <form className="search-wrap" onSubmit={onSubmitTag}>
                {/* 1) 캡슐 + AI태그 한 줄 */}
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
            
            {!hasAI && !notFound && (
              <div className="chemlogo-wrap">
                <img src={chemlogo} alt="Chem Logo" className="chemlogo" />
              </div>
            )}

            {!hasAI && notFound && (
              <div className="nf-wrap">
                <img src={nf404} alt="Not Found" className="nf-img" />
              </div>
            )}

              <section className="prof-cards">
                {labsLoading && <div className="empty">Loading...</div>}
                {labsError && !notFound && <div className="empty">Error: {labsError}</div>}

                {displayList.length === 0 && !labsLoading && !labsError && !notFound && (
                  <div className="empty">There is no result</div>
                )}

                {displayList.map((item) => {
                  if (hasAI) {
                    const meta = getDeptMetaById(item.depts?.[0]);
                    return (
                      <ProfessorCard
                        key={item.id}
                        labId={item.lab_id || item.id}
                        {...item}
                        badges={item.status}
                        mode="ai"
                        ai={item.aiMatch}
                        deptName={meta?.label}
                        deptColor={meta?.color}
                        deptIcon={meta?.icon}
                      />
                    );
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