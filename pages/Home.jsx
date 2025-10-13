import { useEffect, useMemo, useRef, useState } from "react";
import "./Home.css";

import naturalscience from "../assets/icons/ns.svg";
import math from "../assets/icons/math.svg";
import phy from "../assets/icons/phy.svg";
import chem from "../assets/icons/chem.svg";
import life from "../assets/icons/plant.svg";

import it from "../assets/icons/it.svg";
import jj from "../assets/icons/jj.svg";
import bsg from "../assets/icons/bsg.svg";
import sj from "../assets/icons/sj.svg";
import by from "../assets/icons/by.svg";

import swy from "../assets/icons/swy.svg";
import cs from "../assets/icons/cs.svg";
import gy from "../assets/icons/gy.svg";
import jn from "../assets/icons/jn.svg";

import engineering from "../assets/icons/engineering.svg";
import me from "../assets/icons/me.svg";
import ce from "../assets/icons/ce.svg";
import amse from "../assets/icons/amse.svg";
import arch from "../assets/icons/arch.svg";
import sg from "../assets/icons/sg.svg";
import gc from "../assets/icons/gc.svg";
import nano from "../assets/icons/nano.svg";
import quantum from "../assets/icons/quantum.svg";

import yak from "../assets/icons/yak.svg";
import med from "../assets/icons/med.svg";

import lifee from "../assets/icons/life.svg";
import food from "../assets/icons/food.svg";
import bm from "../assets/icons/bm.svg";
import ys from "../assets/icons/ys.svg";

import soccer from "../assets/icons/soccer.svg";
import sports from "../assets/icons/baseball.svg";

import hospital from "../assets/icons/hospital.svg";
import dr from "../assets/icons/dr.svg";

import logo from "../assets/logo/logo.svg";

/* Search filter tags */
const GROUPS = [
  {
    groupId: "ns",
    label: "자연과학",
    icon: naturalscience,
    sub: [
      { id: "life", groupId: "ns", label: "생명과학과", icon: life, color: "#66A945" },
      { id: "math", groupId: "ns", label: "수학과", icon: math, color: "#4C4948" },
      { id: "phy", groupId: "ns", label: "물리학과", icon: phy, color: "#5185C5" },
      { id: "chem", groupId: "ns", label: "화학과", icon: chem, color: "#E56C3E" },
    ],
  },
  {
    groupId: "it",
    label: "정보통신",
    icon: it,
    sub: [
      { id: "jj", groupId: "it", label: "전자전기공학부", icon: jj, color: "#02f5ff" },
      { id: "bsg", groupId: "it", label: "반도체시스템공학과", icon: bsg, color: "#2075a4" },
      { id: "sj", groupId: "it", label: "소재부품융합공학과", icon: sj, color: "#a0c1a2" },
      { id: "by", groupId: "it", label: "반도체융합공학과", icon: by, color: "#05ddea" },
    ],
  },
  {
    groupId: "swy",
    label: "소프트웨어",
    icon: swy,
    sub: [
      { id: "cse", groupId: "swy", label: "소프트웨어학과", icon: cs, color: "#6DC8EB" },
      { id: "gy", groupId: "swy", label: "글로벌융합학부", icon: gy, color: "#923" },
      { id: "jn", groupId: "swy", label: "지능형소프트웨어학과", icon: jn, color: "#cf845f" },
    ],
  },
  {
    groupId: "eng",
    label: "공학",
    icon: engineering,
    sub: [
      { id: "cheme", groupId: "eng", label: "화학공학부", icon: ce, color: "#E09C30" },
      { id: "amse", groupId: "eng", label: "신소재공학부", icon: amse, color: "#BFB889" },
      { id: "me", groupId: "eng", label: "기계공학부", icon: me, color: "#69A9C7" },
      { id: "arch", groupId: "eng", label: "건설환경공학부", icon: arch, color: "#9C7743" },
      { id: "sg", groupId: "eng", label: "시스템경영공학과", icon: sg, color: "#8f12f2" },
      { id: "gc", groupId: "eng", label: "건축학과", icon: gc, color: "#128ff2" },
      { id: "nano", groupId: "eng", label: "나노공학과", icon: nano, color: "#7777f7"},
      { id: "quantum", groupId: "eng", label: "양자정보공학과", icon: quantum, color: "#987654"},
    ],
  },
  {
    groupId: "yak",
    label: "약학",
    icon: yak,
    sub: [
      { id: "med", groupId: "yak", label: "약학과", icon: med, color: "#735198" },
    ],
  },
  {
    groupId: "lifee",
    label: "생명공학",
    icon: lifee,
    sub: [
      { id: "food", groupId: "lifee", label: "식품생명공학과", icon: food, color: "#456712" },
      { id: "bm", groupId: "lifee", label: "바이오메카트로닉스학과", icon: bm, color: "#a667f0" },
      { id: "ys", groupId: "lifee", label: "융합생명공학과", icon: ys, color: "#4173f4" },
    ],
  },
  {
    groupId: "soccer",
    label : "스포츠과학",
    icon: soccer,
    sub: [
      { id: "sports", groupId: "soccer", label: "스포츠과학과", icon: sports, color: "#21d311" },
    ],
  },
  {
    groupId: "hp",
    label: "의학",
    icon: hospital,
    sub: [
      { id: "dr", groupId: "hp", label: "의학과", icon: dr, color: "#A2C3E7" },
    ],
  },
];

export default function Home() {
  const [tags, setTags] = useState([]);
  const [openGroupId, setOpenGroupId] = useState(null);
  const [selectedByGroup, setSelectedByGroup] = useState({});

  const canSearch = tags.length > 0;

  const onSubmit = (e) => {
    e.preventDefault();
    if (!canSearch) return;
    alert(`검색 실행\n태그: ${tags.map((t) => t.label).join(", ")}`);
  };

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

  return (
    <main className="home">
      <div className="hero">
        {/* 상단 좌측: 로고 + 검색창 가로 정렬 */}
        <div className="search-row">
          <img src={logo} alt="LASER" className="site-logo" />

          {/* 검색창 */}
          <form className="search-wrap" onSubmit={onSubmit}>
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

              {/* search button */}
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
          </form>
        </div>
      </div>
    </main>
  );
}

/* filter card component */
function FilterCard({ group, open, selected, onToggle, onPickSub }) {
  const icon = selected?.icon || group.icon;
  const label = selected?.label || group.label;

  return (
    <div className="filter-card">
      {/* main filter */}
      <button
        type="button"
        className={`filter-main ${selected ? "selected" : ""} ${open ? "open" : ""}`}
        onClick={onToggle}
        style={{ "--active-bg": selected?.color || "#000" }}
      >
        <span className="icon-badge">
          <img src={icon} alt={label} />
        </span>
        <span className="filter-text">{label}</span>
        <span className="arrow" aria-hidden />
      </button>

      {/* sub filters */}
      <div className={`sublist ${open ? "show" : ""}`}>
        {group.sub.map((s) => {
          const isActive = selected?.id === s.id;
          return (
            <button
              key={s.id}
              type="button"
              className={`subitem ${isActive ? "active" : ""}`}
              onClick={() => (isActive ? onPickSub(null) : onPickSub(s))}
              style={{ "--hover-color": s.color }}
            >
              <span className="icon-badge">
                <img src={s.icon} alt={s.label} />
              </span>
              <span className="sub-text">{s.label}</span>
              <span className="plus">{isActive ? "×" : "+"}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
