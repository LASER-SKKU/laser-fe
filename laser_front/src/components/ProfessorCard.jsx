import { useNavigate } from "react-router-dom";
import nopct from "../assets/icons/nopct.svg";

export default function ProfessorCard({
  labId,
  name,
  photoSrc,
  fields = [],
  summary = "",
  deptName,
  deptColor,
  deptIcon,
  website,
  badges,
  status,
  mode = "normal",
  ai,
}) {
  const navigate = useNavigate();
  const isAI = mode === "ai" && ai;

  const effectivePhotoSrc = photoSrc && String(photoSrc).trim() !== ""
    ? photoSrc
    : nopct;

  const handleImgError = (e) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = nopct;
  };

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
    <section className="ai-composite" data-lab-id={labId ?? ""}>
      <article
        className="prof-card compact"
        data-lab-id={labId ?? ""}
        onClick={handleClick}
        role="button"
        tabIndex={0}
        onKeyDown={handleKeyDown}
      >
        <div className="prof-left">
          <img
            src={effectivePhotoSrc}
            alt={name}
            className="prof-photo"
            onError={handleImgError}
          />
        </div>

        <div className="prof-right">
          {(deptName || deptIcon) && (
            <span
              className="dept-badge"
              style={{ "--dept-color": deptColor || "#E3E6E8" }}
            >
              {deptIcon && (
                <img src={deptIcon} alt="" className="dept-badge-icon" />
              )}
              <span className="dept-badge-text">{deptName}</span>
            </span>
          )}

          <div className="prof-head">
            <h3 className="prof-name">{name}</h3>
          </div>

          <div className="prof-fields">
            {fields.map((f) => (
              <span key={f} className="field-tag">
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
                <path
                  fill="currentColor"
                  d="M12 3l9 8h-3v9h-5v-6H11v6H6v-9H3l9-8z"
                />
              </svg>
            </a>
          )}
        </div>
      </article>
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
          src={effectivePhotoSrc}
          alt={name}
          className="prof-photo"
          onError={handleImgError}
        />
      </div>

      <div className="prof-right">
        {(deptName || deptIcon) && (
          <span
            className="dept-badge"
            style={{ "--dept-color": deptColor || "#E3E6E8" }}
          >
            {deptIcon && (
              <img src={deptIcon} alt="" className="dept-badge-icon" />
            )}
            <span className="dept-badge-text">{deptName}</span>
          </span>
        )}

        <div className="prof-head">
          <h3 className="prof-name">{name}</h3>
        </div>

        <div className="prof-fields">
          {fields.map((f) => (
            <span key={f} className="field-tag">
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
              <path
                fill="currentColor"
                d="M12 3l9 8h-3v9h-5v-6H11v6H6v-9H3l9-8z"
              />
            </svg>
          </a>
        )}
      </div>
    </article>
  );
}