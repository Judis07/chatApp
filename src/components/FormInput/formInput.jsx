import './formInput.scss';

const FormInput = (props) => {
  const { type, isRequired, name, label, value, userTyping } = props;

  return (
    <div className="formInputContainer">
      <label className="inputLabel">{label}</label>
      <input
        className="mainInput"
        value={value}
        name={name}
        type={type}
        required={isRequired}
        onChange={(event) => userTyping(event)}
      />
    </div>
  );
};

export default FormInput;
