/* Filter card component */
export default function FilterCard({ group, open, selected, onToggle, onPickSub }) {
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