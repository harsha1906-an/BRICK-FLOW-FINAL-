import { ErpContextProvider } from '@/context/erp';
import { Layout, Grid } from 'antd';
import { useSelector } from 'react-redux';

const { Content } = Layout;
const { useBreakpoint } = Grid;

export default function ErpLayout({ children }) {
  const screens = useBreakpoint();
  const isMobile = !screens.md;
  return (
    <ErpContextProvider>
      <Content
        className="whiteBox shadow layoutPadding"
        style={{
          margin: isMobile ? '10px auto' : '30px auto',
          width: '100%',
          maxWidth: '1100px',
          minHeight: '600px',
          padding: isMobile ? '15px' : undefined
        }}
      >
        {children}
      </Content>
    </ErpContextProvider>
  );
}
