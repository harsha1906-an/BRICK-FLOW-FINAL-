import { ConfigProvider, theme } from 'antd';
import { useThemeContext } from '@/context/ThemeContext';

export default function Localization({ children }) {
  const { isDarkMode } = useThemeContext();
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#339393',
          colorLink: '#1640D6',
          borderRadius: 2,
        },
        algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
      }}
    >
      {children}
    </ConfigProvider>
  );
}
