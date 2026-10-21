export default function Logo({ onClick, className = '' }) {
  return (
    <a
      href="#home"
      className={`logo ${className}`}
      onClick={(e) => {
        if (onClick) {
          e.preventDefault();
          onClick();
        }
      }}
      aria-label="Beauven home"
    >
      Beauven
    </a>
  );
}
