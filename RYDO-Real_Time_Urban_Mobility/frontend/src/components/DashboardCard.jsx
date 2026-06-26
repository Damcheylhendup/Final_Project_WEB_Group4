import './DashboardCard.css';

function DashboardCard({ icon, title, description, buttonText, onClick }) {
  return (
    <div className="dashboard-card">
      <h2>
        {icon}
        {title}
      </h2>

      <p>{description}</p>

      <button onClick={onClick}>{buttonText}</button>
    </div>
  );
}

export default DashboardCard;