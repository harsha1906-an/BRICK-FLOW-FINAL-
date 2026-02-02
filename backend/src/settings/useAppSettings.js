const useAppSettings = () => {
  let settings = {};
  settings['brickflow_app_email'] = 'noreply@brickflowapp.com';
  settings['brickflow_base_url'] = 'https://cloud.brickflowapp.com';
  return settings;
};

module.exports = useAppSettings;
