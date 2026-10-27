export default function SectionHeading({
  eyebrow,
  title,
  description,
  action,
}) {
  return (
    <div className="section-heading">
      <div className="section-heading-copy">
        {eyebrow ? <div className="section-eyebrow">{eyebrow}</div> : null}
        {title ? <h2 className="section-title">{title}</h2> : null}
        {description ? (
          <p className="section-description no-print">{description}</p>
        ) : null}
      </div>
      {action ? <div className="section-action no-print">{action}</div> : null}
    </div>
  );
}
