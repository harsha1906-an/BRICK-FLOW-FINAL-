import React, { useEffect, useState } from 'react';
import { Card, Descriptions, Table, Tag, Button, Row, Col, App, Statistic, Divider } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import useLanguage from '@/locale/useLanguage';
import { request } from '@/request';
import { useMoney, useDate } from '@/settings';
import dayjs from 'dayjs';
import { PageHeader } from '@ant-design/pro-layout';

export default function BookingRead() {
    const { message } = App.useApp();
    const { id } = useParams();
    const navigate = useNavigate();
    const translate = useLanguage();
    const { moneyFormatter } = useMoney();
    const { dateFormat } = useDate();
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchBooking = async () => {
        setLoading(true);
        const response = await request.read({ entity: 'booking', id });
        if (response.success) {
            setBooking(response.result);
        } else {
            message.error('Failed to load booking');
            navigate('/booking');
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchBooking();
    }, [id]);

    if (!booking) return <></>;

    const paymentPlanColumns = [
        { title: translate('Milestone'), dataIndex: 'name', key: 'name' },
        { title: translate('Due Date'), dataIndex: 'dueDate', key: 'dueDate', render: (d) => d ? dayjs(d).format(dateFormat) : '-' },
        { title: translate('Amount'), dataIndex: 'amount', key: 'amount', render: (amount) => moneyFormatter({ amount }) },
        {
            title: translate('Status'), dataIndex: 'status', key: 'status', render: (status) => {
                let color = status === 'paid' ? 'green' : status === 'overdue' ? 'red' : 'gold';
                return <Tag color={color}>{status.toUpperCase()}</Tag>;
            }
        },
        {
            title: translate('Action'), key: 'action', render: (_, record) => {
                if (record.status !== 'paid') {
                    return <Button type="link" onClick={() => handleMarkPaid(record)}>Mark Paid</Button>
                }
                return null;
            }
        }
    ];

    const handleMarkPaid = async (milestone) => {
        // In a real app, this should open a payment modal.
        // For now, we update the local booking state or call an API to update the milestone status.
        // Since our update API replaces the object, we need to carefully update.
        const updatedPlan = booking.paymentPlan.map(p => {
            if (p._id === milestone._id || (p.name === milestone.name && p.amount === milestone.amount)) {
                return { ...p, status: 'paid', paidAmount: p.amount, paymentDate: new Date() };
            }
            return p;
        });

        const response = await request.update({ entity: 'booking', id, jsonData: { paymentPlan: updatedPlan } });
        if (response.success) {
            message.success('Milestone marked as paid');
            fetchBooking();
        } else {
            message.error('Failed to update status');
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <PageHeader
                onBack={() => navigate('/booking')}
                title={translate('Booking Details')}
                subTitle={`#${id.substr(-6)}`}
                extra={[
                    <Button key="edit" onClick={() => navigate(`/booking/update/${id}`)} disabled>Edit</Button>,
                    <Button key="refresh" onClick={fetchBooking}>Refresh</Button>
                ]}
            />
            <Row gutter={24}>
                <Col span={16}>
                    <Card title="Booking Information" bordered={false}>
                        <Descriptions column={2}>
                            <Descriptions.Item label="Client">{booking.client?.name}</Descriptions.Item>
                            <Descriptions.Item label="Villa">{booking.villa?.villaNumber}</Descriptions.Item>
                            <Descriptions.Item label="Date">{dayjs(booking.bookingDate).format(dateFormat)}</Descriptions.Item>
                            <Descriptions.Item label="Status"><Tag color="blue">{booking.status}</Tag></Descriptions.Item>
                        </Descriptions>
                        <Divider />
                        <h3>Payment Plan / Milestones</h3>
                        <Table
                            dataSource={booking.paymentPlan}
                            columns={paymentPlanColumns}
                            pagination={false}
                            rowKey={(record) => record._id || record.name}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card title="Financials" bordered={false}>
                        <Statistic title="Total Amount" value={moneyFormatter({ amount: booking.totalAmount })} />
                        <Divider />
                        <Statistic
                            title="Paid Amount"
                            value={moneyFormatter({ amount: booking.paymentPlan.filter(p => p.status === 'paid').reduce((acc, curr) => acc + curr.amount, 0) })}
                            valueStyle={{ color: '#3f8600' }}
                        />
                        <Divider />
                        <Statistic
                            title="Pending Amount"
                            value={moneyFormatter({ amount: booking.totalAmount - booking.paymentPlan.filter(p => p.status === 'paid').reduce((acc, curr) => acc + curr.amount, 0) })}
                            valueStyle={{ color: '#cf1322' }}
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
}
