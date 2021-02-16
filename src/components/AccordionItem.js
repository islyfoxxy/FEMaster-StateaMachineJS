export default function AccordionItem({ title, component, index }) {
  return (
    <div className="card">
      <div className="card-header" id={`heading${index}`}>
        <h2 className="mb-0">
          <button
            className="btn btn-link btn-block text-left"
            type="button"
            data-toggle="collapse"
            data-target={`#collapse${index}`}
            aria-expanded="true"
            aria-controls={`collapse${index}`}
          >
            {title}
          </button>
        </h2>
      </div>

      <div
        id={`collapse${index}`}
        className="collapse"
        aria-labelledby={`heading${index}`}
        data-parent="#exercises"
      >
        <div className="card-body mb-5">{component}</div>
      </div>
    </div>
  );
}
