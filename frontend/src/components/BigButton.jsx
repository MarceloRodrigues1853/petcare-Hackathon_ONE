export default function BigButton({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="bigbtn"
    >
      {children}
    </button>
  );
}
