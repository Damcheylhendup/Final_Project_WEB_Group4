import { useNavigate } from 'react-router-dom';
import './BackButton.css';

function BackButton({ to = '/dashboard', label = '← Back' }) {
  const navigate = useNavigate();

  return (
    <button className="back-btn" onClick={() => navigate(to)}>
      {label}
    </button>
  );
}

export default BackButton;