export default function Stage({ isFocusMode, children }) {
  return (
    <section className={isFocusMode ? "stage is-focus" : "stage"}>
      {children}
    </section>
  );
}
