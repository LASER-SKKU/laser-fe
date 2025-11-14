import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GROUPS } from "../share/groups"
import FilterCard from "../components/FilterCard"
import "./Home.css";

import logo from "../assets/logo/logoxmas.svg";
import christmaslogo from "../assets/logo/christmaslogo.svg";

/* Search filter tags */

export default function Home() {
  const [tags, setTags] = useState([]);
  const [openGroupId, setOpenGroupId] = useState(null);
  const [selectedByGroup, setSelectedByGroup] = useState({});
  const navigate = useNavigate();

  const canSearch = tags.length > 0;

  const onSubmitTag = (e) => {
    e.preventDefault();
    if (!canSearch) return;
    navigate(`/search?tag=${tags[0].id}&ai=${encodeURIComponent(aiQuery || "")}`, { state: { selected: tags[0], aiQuery } });
  };

  const onSubmitAI = (e) => {
    e.preventDefault();
    const q = aiQuery.trim();
    if (!q) return;
    const tagParam = tags[0] ? `&tag=${tags[0].id}` : "";
    navigate(`/search?ai=${encodeURIComponent(q)}${tagParam}`);
  }

  // One subitem in same main item
  const addOrReplaceChip = (sub) => {
    setTags([sub]);
    setSelectedByGroup({ [sub.groupId]: sub})
  };

  // undo selection
  const clearGroup = (groupId) => {
    setTags((prev) => prev.filter((t) => t.groupId !== groupId));
    setSelectedByGroup((prev) => {
      const copy = { ...prev };
      delete copy[groupId];
      return copy;
    });
  };

  // x button
  const removeChipById = (id) => {
    const chip = tags.find((t) => t.id === id);
    if (!chip) return;
    clearGroup(chip.groupId);
  };

  const [aiQuery, setAiQuery] = useState("");

  const aiAreaRef = useRef(null);
  const autoGrowAI = () => {
    const el = aiAreaRef.current;
    if (!el) return;
    const MAX = 2200;
    el.style.height = "auto";
    const h = Math.min(el.scrollHeight, MAX);
    el.style.height = h + "px";
    el.style.overflowY = el.scrollHeight > MAX ? "auto" : "hidden";
  };
  {/* useEffect(() => { if (aiOpen) autoGrowAI(); }, [aiOpen, aiQuery]); */}

  return (
    <main className="home">
      <div className="hero">
        {/* 상단 좌측: 로고 + 검색창 가로 정렬 */}
        <div className="search-row">
          <Link to="/">
            <img src={logo} alt="LASER" className="site-logo" />
          </Link>

          {/* 검색창 */}
          <section className="landing">
            <div className="landing-box">
              <img
                src={christmaslogo}
                alt="LASER Christmas Logo"
                className="welcome-head"
              />
              <form className="landing-search" onSubmit={onSubmitAI}>
                <div className="ai-input center">
                  <textarea
                    ref={aiAreaRef}
                    className="ai-textarea"
                    value={aiQuery}
                    onChange={(e)=>{ setAiQuery(e.target.value); autoGrowAI(); }}
                    placeholder="Feel free to enter whatever you want"
                    rows={1}
                  />
                  <button
                    type="submit"
                    className={`ai-go ${aiQuery.trim() ? "enabled" : "disabled"}`}
                    disabled={!aiQuery.trim()}
                  >
                    AI
                  </button>
                </div>
              </form>
            </div>
          </section>

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
              <svg viewBox="0 0 24 24" width="22" heigth="22" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 1 0-.71.71l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0A4.5 4.5 0 1 1 14 9.5 4.5 4.5 0 0 1 9.5 14z"
                />
              </svg>
            </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}

/* 돋보기 아이콘 SVG 디자인
<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
  <path
    fill="currentColor"
    d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 1 0-.71.71l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0A4.5 4.5 0 1 1 14 9.5 4.5 4.5 0 0 1 9.5 14z"
  />
</svg> */
