export default function RSVPDisplay({ word }) {
  return (
    <div className="rsvp-display">
      <span>{word?.text ?? "Upload a PDF"}</span>
    </div>
  );
}