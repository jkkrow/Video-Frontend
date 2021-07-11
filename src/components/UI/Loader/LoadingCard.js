import Card from "../Card";
import "./LoadingCard.css";

const LoadingCard = ({ display }) =>
  display ? (
    <Card className="loading-card">
      <div className="loading-card__thumbnail" />
      <div className="loading-card__info">
        <div className="loading-card__info__avatar" />
        <div className="loading-card__info__title" />
      </div>
    </Card>
  ) : null;

export default LoadingCard;
