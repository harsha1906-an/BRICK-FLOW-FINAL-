import React, { useEffect, useState } from 'react';
import { Button } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';

const InstallApp = () => {
    const [deferredPrompt, setDeferredPrompt] = useState(null);

    useEffect(() => {
        const handler = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
        };

        window.addEventListener('beforeinstallprompt', handler);

        return () => {
            window.removeEventListener('beforeinstallprompt', handler);
        };
    }, []);

    const handleInstallClick = () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('User accepted the install prompt');
                } else {
                    console.log('User dismissed the install prompt');
                }
                setDeferredPrompt(null);
            });
        }
    };

    if (!deferredPrompt) return null;

    return (
        <Button
            type="primary"
            icon={<DownloadOutlined />}
            onClick={handleInstallClick}
            style={{ marginRight: 16 }}
        >
            Install App
        </Button>
    );
};

export default InstallApp;
