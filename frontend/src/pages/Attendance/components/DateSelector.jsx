import React from 'react';
import { DatePicker, Space, Button } from 'antd';
import dayjs from 'dayjs';

const DateSelector = ({ value, onChange, disabled = false }) => {
    const handleQuickSelect = (daysOffset) => {
        const date = dayjs().add(daysOffset, 'day');
        onChange(date);
    };

    return (
        <Space size="middle">
            <DatePicker
                value={value}
                onChange={onChange}
                disabled={disabled}
                format="YYYY-MM-DD"
                placeholder="Select date"
                style={{ width: 200 }}
            />
            <Button size="small" onClick={() => handleQuickSelect(0)} disabled={disabled}>
                Today
            </Button>
            <Button size="small" onClick={() => handleQuickSelect(-1)} disabled={disabled}>
                Yesterday
            </Button>
        </Space>
    );
};

export default DateSelector;
