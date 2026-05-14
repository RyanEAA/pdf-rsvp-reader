export default function RSVPDisplay({ word }) {
  const text = word?.text;
  const middleIndex = text ? Math.floor(text.length / 2) : -1;

  return (
    <div className="rsvp-display">
      <span className="rsvp-word">
        {text
          ? text.split("").map((letter, index) => (
              <span
                key={`${letter}-${index}`}
                className={index === middleIndex ? "rsvp-letter is-middle" : "rsvp-letter"}
              >
                {letter}
              </span>
            ))
          : "Upload a PDF"}
      </span>
    </div>
  );
}