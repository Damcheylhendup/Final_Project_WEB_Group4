import './ThemeToggle.css';

function ThemeToggle({ name, checked, onChange }) {
  return (
    <label className="theme-toggle">
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
      />
      <span className="theme-slider"></span>
    </label>
  );
}

export default ThemeToggle;