import Loader from '../Loader/loader';
import './button.scss';

const Button = (props) => {
  const { type, text, isLoading } = props;
  return (
    <div>
      {isLoading ? (
        <button className="custom_btn">
          <Loader />
        </button>
      ) : (
        <button className="custom_btn" type={type}>
          {text}
        </button>
      )}
    </div>
  );
};

export default Button;
