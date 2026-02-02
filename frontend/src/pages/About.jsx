import { Button, Result } from 'antd';

import useLanguage from '@/locale/useLanguage';

const About = () => {
  const translate = useLanguage();
  return (
    <Result
      status="info"
      title={'Brick Flow'}
      subTitle={translate('Do you need help on customize of this app')}
      extra={
        <>
          <p>
            Website : <a href="https://www.brickflow.com">www.brickflow.com</a>{' '}
          </p>
          <p>
            GitHub :{' '}
            <a href="https://github.com/brickflow/brick-flow">
              https://github.com/brickflow/brick-flow
            </a>
          </p>
          <Button
            type="primary"
            onClick={() => {
              window.open(`https://www.brickflow.com/contact-us/`);
            }}
          >
            {translate('Contact us')}
          </Button>
        </>
      }
    />
  );
};

export default About;
