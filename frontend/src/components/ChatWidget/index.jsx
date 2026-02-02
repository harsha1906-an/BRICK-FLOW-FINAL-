import { Button, Input, List, Card, Avatar, Typography, FloatButton, Spin, theme } from 'antd';
import { RobotOutlined, SendOutlined, CloseOutlined, UserOutlined } from '@ant-design/icons';
import { request } from '@/request';
import useLanguage from '@/locale/useLanguage';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react'; // Added useState, useEffect, useRef

const { Text } = Typography;
const { useToken } = theme;

export default function ChatWidget() {
    const { token } = useToken();
    const navigate = useNavigate();

    // Simple, robust mobile detection
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { type: 'text', content: 'Hi! I am Manoj, your AI assistant. Ask me anything about your data.', sender: 'bot' }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef(null);

    const translate = useLanguage();

    const toggleChat = () => setIsOpen(!isOpen);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isOpen]);

    const handleSend = async () => {
        if (!inputValue.trim()) return;

        const userMsg = { type: 'text', content: inputValue, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setInputValue('');
        setLoading(true);

        try {
            const response = await request.post({ entity: 'chat/query', jsonData: { query: userMsg.content } });

            if (response.result.text) {
                setMessages(prev => [...prev, { type: 'text', content: response.result.text, sender: 'bot' }]);
            }

            if (response.result.data && response.result.data.length > 0) {
                response.result.data.forEach(item => {
                    setMessages(prev => [...prev, { ...item, sender: 'bot' }]);
                });
            }

        } catch (error) {
            setMessages(prev => [...prev, { type: 'text', content: 'Sorry, I encountered an error searching for that.', sender: 'bot' }]);
        } finally {
            setLoading(false);
        }
    };

    const handleNavigate = (path) => {
        navigate(path);
        setIsOpen(false); // Optional: close chat on navigation
    };

    const renderMessage = (msg) => {
        const isUser = msg.sender === 'user';

        if (msg.type === 'text') {
            return (
                <div style={{ display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start', marginBottom: 10 }}>
                    <div style={{
                        maxWidth: '80%',
                        padding: '8px 12px',
                        borderRadius: '12px',
                        background: isUser ? token.colorPrimary : token.colorFillSecondary,
                        color: isUser ? '#fff' : token.colorText,
                        borderBottomRightRadius: isUser ? 0 : '12px',
                        borderBottomLeftRadius: isUser ? '12px' : 0
                    }}>
                        {msg.content}
                    </div>
                </div>
            );
        }

        if (msg.type === 'action' && msg.action === 'navigate') {
            return (
                <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 10 }}>
                    <Button type="primary" size="small" onClick={() => handleNavigate(msg.path)}>
                        {msg.label}
                    </Button>
                </div>
            );
        }

        if (msg.type === 'card') {
            return (
                <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 10 }}>
                    <Card size="small" title={msg.title} style={{ width: isMobile ? '100%' : 250, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                        {Object.keys(msg).map(key => {
                            if (['type', 'entity', 'title', 'sender'].includes(key)) return null;
                            return (
                                <div key={key} style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Text type="secondary" style={{ textTransform: 'capitalize' }}>{key}:</Text>
                                    <Text strong>{msg[key]}</Text>
                                </div>
                            );
                        })}
                    </Card>
                </div>
            );
        }
    };

    return (
        <>
            <FloatButton
                icon={<RobotOutlined />}
                type="primary"
                style={{ right: 24, bottom: 24 }}
                onClick={toggleChat}
                tooltip="Manoj - AI Assistant"
            />

            {isOpen && (
                <div style={{
                    position: 'fixed',
                    right: isMobile ? 0 : 24,
                    bottom: isMobile ? 0 : 80,
                    width: isMobile ? '100%' : 350,
                    height: isMobile ? '80vh' : 500,
                    background: token.colorBgContainer,
                    borderRadius: isMobile ? '16px 16px 0 0' : '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    zIndex: 1000,
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    border: `1px solid ${token.colorBorder}`,
                    borderBottom: 'none'
                }}>
                    {/* Header */}
                    <div style={{ padding: '12px 16px', background: token.colorPrimary, color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <RobotOutlined />
                            <span style={{ fontWeight: 600 }}>Manoj</span>
                        </div>
                        <CloseOutlined onClick={toggleChat} style={{ cursor: 'pointer' }} />
                    </div>

                    {/* Messages */}
                    <div ref={scrollRef} style={{ flex: 1, padding: 16, overflowY: 'auto', background: token.colorBgContainer }}>
                        {messages.map((msg, idx) => (
                            <div key={idx}>{renderMessage(msg)}</div>
                        ))}
                        {loading && <div style={{ textAlign: 'left', color: token.colorTextSecondary, fontStyle: 'italic' }}>Thinking...</div>}
                    </div>

                    {/* Input */}
                    <div style={{ padding: 12, borderTop: `1px solid ${token.colorBorder}` }}>
                        <div style={{ display: 'flex', gap: 8 }}>
                            <Input
                                placeholder="Type a query..."
                                value={inputValue}
                                onChange={e => setInputValue(e.target.value)}
                                onPressEnter={handleSend}
                                style={{ background: token.colorBgContainer, color: token.colorText }}
                            />
                            <Button type="primary" icon={<SendOutlined />} onClick={handleSend} />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
