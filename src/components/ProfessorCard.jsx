import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import paperIcon from "../assets/icons/paper.svg";
import studentIcon from "../assets/icons/student.svg";
import popularIcon from "../assets/icons/popular.svg";

import rank1 from "../assets/icons/rank1.svg";
import rank2 from "../assets/icons/rank2.svg";
import rank3 from "../assets/icons/rank3.svg";
import rank4 from "../assets/icons/rank4.svg";
import rank5 from "../assets/icons/rank5.svg";
import rank6 from "../assets/icons/rank6.svg";

const RANK_ICON = { 1: rank1, 2: rank2, 3: rank3, 4: rank4, 5: rank5, 6: rank6, };

const FIELD_META = {
  /* 화학과 */
  "Inorganic":   { color: "#5B2A82" },
  "Physical":   { color: "#0A6C8B" },
  "Polymer": { color: "#F3B005" },
  "Organic":   { color: "#C84C31" },
  "Analytic":   { color: "#4361EE" },
  "Biochemistry":     { color: "#2F9E44" },

  /* 소프트웨어학과 */
  "Natural Language Processing": { color: "#665ba6ff" },
  "Security": { color: "#1d4535ff" },
  "Intellectual System": { color: "#541945ff" },
  "AI": { color: "#211ebdff" },
  "System": { color: "#964f4fff" },
  "Data": { color: "#1a045eff" },
  "Computer Architecture": { color: "#520505ff" },
  "Machine Learning": { color: "#355565ff" },
  "Software": { color: "#b3ce63ff" },
  "Embedded System": { color: "#633a5aff" },
  "Operating System": { color: "#9966c5ff" },
  "Computer Science": { color: "#260b9aff" },
  "Software Engineering": { color: "#684141ff" },
  "Mobile Computing": { color: "#a43293ff" },
  "Computer Graphics": { color: "#778746ff" },
  "Internet of Things": { color: "#876ff4ff" },
  "Human-Computer Interaction": { color: "#ca8d8dff" },
  "Visualization": { color: "#305b0cff" },
  "Parallel Computing": { color: "#cc7bc0ff" },
  "Compiler": { color: "#604444ff" },
  "Computer Vision": { color: "#c5db74ff" },
  "Programming Language": { color: "#2c3c03ff" },

  /* 전자전기공학부 */
  "Nanophotonics": { color: "#aab644ff" },
};

const STATUS_ICON = {
  paper:   { src: paperIcon,   label: "최근 논문 발표" },
  student: { src: studentIcon, label: "학생 모집 중" },
  popular: { src: popularIcon, label: "인기 연구실" },
}

export default function ProfessorCard({ labId, name, photoSrc, fields = [], summary = "", deptName, deptColor, deptIcon, website, badges, status, mode = "normal", ai }) {
  <img
    src={photoSrc}
    alt={`${name}`}
    className="prof-photo"
    onError={(e) => {
      e.currentTarget.onerror = null;
      e.currentTarget.style.opacity = "0";
    }}
  />
  const navigate = useNavigate();
  const list = badges ?? status ?? [];
  const isAI = mode === "ai" && ai;
  const pct = isAI ? Math.round((ai.score <= 1 ? ai.score*100 : ai.score) * 10) / 10 : 0;
  const rankSafe = isAI ? Math.min(Math.max(parseInt(ai?.rank ?? 0, 10), 1), 5) : null;
  const rankIcon = rankSafe ? RANK_ICON[rankSafe] : null;

  const handleClick = () => {
    if (!labId) return;
    navigate(`/labs/${labId}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === "") {
      e.preventDefault();
      handleClick();
    }
  };

  return isAI ? (
  <section className="ai-composite" data-lab-id={labId ?? ""}>         {/* ← 감싸는 래퍼 */}
    <article
      className="prof-card compact"
      data-lab-id={labId ?? ""}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      {list.length > 0 && (
        <div className="status-fixed">
          {list.slice(0, 3).map((code) => {
            const m = STATUS_ICON[code];
            return m ? (
              <img key={code} src={m.src} alt={m.label} title={m.label} className="status-icon" />
            ) : null;
          })}
        </div>
      )}
      <div className="prof-left">
        <img
          src={photoSrc}
          alt={`${name}`}
          className="prof-photo"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.style.opacity = "0";
          }}
        />
      </div>

      <div className="prof-right">
          {(deptName || deptIcon) && (
            <span
              className="dept-badge"
              style={{ "--dept-color": deptColor || "#E3E6E8" }}
            >
              {deptIcon && <img src={deptIcon} alt="" className="dept-badge-icon" />}
              <span className="dept-badge-text">{deptName}</span>
            </span>
          )}
          <div className="prof-head">
          <h3 className="prof-name">{name}</h3>
        </div>

        <div className="prof-fields">
          {fields.map((f) => (
            <span
              key={f}
              className="field-tag"
              style={{ background: FIELD_META[f]?.color ?? "#777" }}
            >
              {f}
            </span>
          ))}
        </div>

        <p className="prof-summary">{summary}</p>

        {website && (
          <a
            className="lab-home"
            href={website}
            target="_blank"
            rel="noreferrer noopener"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="currentColor" d="M12 3l9 8h-3v9h-5v-6H11v6H6v-9H3l9-8z"/>
            </svg>
          </a>
        )}
      </div>
    </article>

    {/* 오른쪽 회색 패널 */}
    <aside className="ai-panel" data-lab-id={labId ?? ""}>
      {/* 순위 아이콘 */}
      {rankIcon && (
        <img src={rankIcon} alt={`${rankSafe}위`} className="ai-rank" />
      )}

      {/* 도넛 그래프 */}
      <div className="ai-donut" aria-label={`Match rate ${pct}%`}>
        <svg viewBox="0 0 120 120">
          <circle className="bg" cx="60" cy="60" r="48"></circle>
          <circle
            className="fg"
            cx="60" cy="60" r="48"
            style={{
              strokeDasharray: `${(pct/100)*2*Math.PI*48} ${2*Math.PI*48}`,
            }}
          />
        </svg>
        <div className="center">
          <div className="t">Match rate</div>
          <div className="v">{pct}%</div>
        </div>
      </div>

      {/* AI 상세 보기 토글 */}
      <AIDetail aiText="AI" text="Details" content={ai.reason} />
    </aside>
  </section>
) : (
    <article
      className="prof-card wide"
      data-lab-id={labId ?? ""}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <div className="prof-left">
        <img
          src={photoSrc}
          alt={`${name}`}
          className="prof-photo"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.style.opacity = "0";
          }}
        />
      </div>

      <div className="prof-right">
        {(deptName || deptIcon) && (
          <span
            className="dept-badge"
            style={{ "--dept-color": deptColor || "#E3E6E8" }}
          >              {deptIcon && <img src={deptIcon} alt="" className="dept-badge-icon" />}
           <span className="dept-badge-text">{deptName}</span>
          </span>
        )}
        <div className="prof-head">
          <h3 className="prof-name">{name}</h3>

          {list.length > 0 && (
            <div className="status-icons">
              {list.slice(0, 3).map((code) => {
                const m = STATUS_ICON[code];
                return m ? (
                  <img
                    key={code}
                    src={m.src}
                    alt={m.label}
                    title={m.label}
                    className={`status-icon status-${code}`}
                    aria-label={m.label}
                  />
                ) : null;
              })}
            </div>
          )}
        </div>

        <div className="prof-fields">
          {fields.map((f) => (
            <span
              key={f}
              className="field-tag"
              style={{ background: FIELD_META[f]?.color ?? "#777" }}
            >
              {f}
            </span>
          ))}
        </div>

        <p className="prof-summary">{summary}</p>

        {website && (
          <a
            className="lab-home"
            href={website}
            target="_blank"
            rel="noreferrer noopener"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="currentColor" d="M12 3l9 8h-3v9h-5v-6H11v6H6v-9H3l9-8z"/>
            </svg>
          </a>
        )}
      </div>
    </article>
  );
}

function AIDetail({ aiText="AI", text="Details", content="" }) {
  const [open, setOpen] = useState(false);
  const [typed, setTyped] = useState("");           // 타자기 출력 텍스트
  const speed = 18;                                  // 타자 속도(ms/글자) — 원하면 조절

  const boxRef = useRef(null);   // 말풍선 전체 박스(.ai-reason)
  const innerRef = useRef(null); // 실제 텍스트 래퍼(.ai-reason__inner)
  const btnRef = useRef(null);

  // 바깥 클릭 시 닫기
  useEffect(() => {
    if (!open) return;
    const onDown = (e) => {
      if (boxRef.current?.contains(e.target) || btnRef.current?.contains(e.target)) return;
      setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  // 열릴 때마다 타자기 효과 재생
  useEffect(() => {
    if (!open) { setTyped(""); return; }
    setTyped("");
    const txt = content ?? "";
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setTyped(txt.slice(0, i));
      if (i >= txt.length) clearInterval(id);
    }, speed);
    return () => clearInterval(id);
  }, [open, content]);

  // 글자 수가 늘어날 때마다 말풍선 높이를 부드럽게 늘림
  useEffect(() => {
    if (!open) return;
    const box = boxRef.current;
    const inner = innerRef.current;
    if (!box || !inner) return;
    // 현재 내용 높이를 측정해 max-height에 반영 (CSS transition으로 부드럽게 커짐)
    box.style.maxHeight = inner.scrollHeight + "px";
  }, [typed, open]);

  return (
    <div className="ai-detail">
      <button
        ref={btnRef}
        type="button"
        className={`ai-see-btn ${open ? "active" : ""}`}
        aria-pressed={open}
        onClick={() => setOpen(v => !v)}
      >
        <span className="ai-badge">{aiText}</span>{text}
      </button>

      {open && (
        <div ref={boxRef} className="ai-reason open">
          <div ref={innerRef} className="ai-reason__inner">
            <div className="ai-typing">{typed}</div>
          </div>
        </div>
      )}
    </div>
  );
}
