import Card from "../Card";
import "./LoadingCard.css";

const LoadingCard = ({ on, detail }) =>
  on ? (
    <Card className="loading-card">
      <div className="loading-card__thumbnail" />
      {detail ? (
        <div className="loading-card__info">
          <div className="loading-card__info__avatar" />
          <div className="loading-card__info__detail">
            <div className="loading-card__info__detail__title" />
            <div className="loading-card__info__detail__description" />
          </div>
        </div>
      ) : null}
    </Card>
  ) : null;

export default LoadingCard;
