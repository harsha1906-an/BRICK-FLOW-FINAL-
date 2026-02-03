import { Button, Tooltip } from 'antd';
import { SunOutlined, MoonOutlined } from '@ant-design/icons';
import { useThemeContext } from '@/context/ThemeContext';

export default function ThemeToggle() {
    const { isDarkMode, toggleTheme } = useThemeContext();

    return (
        <Tooltip title={`Switch to ${isDarkMode ? 'Light' : 'Dark'} Mode`}>
            <Button
                type="text"
                shape="circle"
                icon={isDarkMode ? <SunOutlined /> : <MoonOutlined />}
                onClick={toggleTheme}
                style={{
                    fontSize: '20px',
                    color: isDarkMode ? '#fadb14' : '#1640D6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            />
        </Tooltip>
    );
}
