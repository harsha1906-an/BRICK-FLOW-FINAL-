import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, WarningOutlined } from '@ant-design/icons';

const AttendanceSummary = ({ total, present, absent, unmarked }) => {
    return (
        <Card size="small" style={{ marginBottom: 16 }}>
            <Row gutter={16}>
                <Col span={6}>
                    <Statistic
                        title="Total Labour"
                        value={total}
                        valueStyle={{ color: '#1890ff' }}
                    />
                </Col>
                <Col span={6}>
                    <Statistic
                        title="Present"
                        value={present}
                        valueStyle={{ color: '#52c41a' }}
                        prefix={<CheckCircleOutlined />}
                    />
                </Col>
                <Col span={6}>
                    <Statistic
                        title="Absent"
                        value={absent}
                        valueStyle={{ color: '#ff4d4f' }}
                        prefix={<CloseCircleOutlined />}
                    />
                </Col>
                <Col span={6}>
                    <Statistic
                        title="Unmarked"
                        value={unmarked}
                        valueStyle={{ color: unmarked > 0 ? '#faad14' : '#52c41a' }}
                        prefix={unmarked > 0 ? <WarningOutlined /> : <CheckCircleOutlined />}
                    />
                </Col>
            </Row>
        </Card>
    );
};

export default AttendanceSummary;
