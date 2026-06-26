import './Logo.css';

function Logo({ size = 'medium' }) {
  return (
    <div className={`rydo-logo ${size}`}>
      <span className="yellow">RY</span>
      <span className="red">DO</span>
    </div>
  );
}

export default Logo;