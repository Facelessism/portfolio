import Button from "./Button";

function ActivityEvent({ event }) {
  const date = new Date(event.timestamp);

  const dateLabel = date.toLocaleDateString([], {
    day: "2-digit",
    month: "short",
  });

  const time = date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const typeClass =
    event.type?.toLowerCase() || "activity";

  return (
    <article className="activity-event">
      <time
        className="activity-time"
        dateTime={event.timestamp}
        title={date.toLocaleString()}
      >
        <span>{dateLabel}</span>
        <span>{time}</span>
      </time>

      <div className="activity-main">
        <div className="activity-event-top">
          <span className="activity-repository">
            {event.repository}
          </span>

          <span
            className={`activity-type activity-type-${typeClass}`}
          >
            {event.type}
          </span>
        </div>

        <p className="activity-details">
          {event.details}
        </p>
      </div>

      {event.url && (
        <Button
          href={event.url}
          external
          variant="secondary"
          className="activity-event-action"
        >
          Open
        </Button>
      )}
    </article>
  );
}

export default ActivityEvent;
