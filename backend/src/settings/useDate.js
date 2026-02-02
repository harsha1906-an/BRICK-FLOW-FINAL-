const useDate = ({ settings }) => {
  const { brickflow_app_date_format } = settings;

  const dateFormat = brickflow_app_date_format;

  return {
    dateFormat,
  };
};

module.exports = useDate;
