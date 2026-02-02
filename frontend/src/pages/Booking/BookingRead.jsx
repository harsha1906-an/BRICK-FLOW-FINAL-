import React, { useEffect, useState } from 'react';
import { Card, Descriptions, Table, Tag, Button, Row, Col, App, Statistic, Divider, Modal, Form, DatePicker, InputNumber, Select, Input } from 'antd';
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

    // --- Payment Modal State ---
    const [paymentModal, setPaymentModal] = useState({ open: false, milestone: null });
    const [form] = Form.useForm(); // Needed for PaymentModal

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

    const handlePay = (milestone) => {
        setPaymentModal({ open: true, milestone });
    };

    const handlePaymentSubmit = async () => {
        try {
            const values = await form.validateFields();
            // Prepare data for backend
            const payload = {
                ...values,
                booking: id,
                client: booking.client._id, // Ensure client is passed
                villa: booking.villa._id, // Required for backend guards
                villaId: booking.villa._id, // Redundant but safe
                number: Math.floor(Math.random() * 1000000), // Required by schema
                buildingStage: paymentModal.milestone?.name,
                // We don't have an invoice ID, so we skip it. Backend handles this now.
            };

            setLoading(true);
            const response = await request.create({ entity: 'payment', jsonData: payload });

            if (response.success) {
                message.success('Payment recorded successfully');
                setPaymentModal({ open: false, milestone: null });
                form.resetFields();
                fetchBooking(); // Refresh to show updated status
            } else {
                message.error(response.message || 'Failed to record payment');
            }
        } catch (e) {
            console.error(e);
            message.error('Please check the form fields');
        } finally {
            setLoading(false);
        }
    };

    const paymentPlanColumns = [
        { title: translate('Milestone'), dataIndex: 'name', key: 'name' },
        { title: translate('Due Date'), dataIndex: 'dueDate', key: 'dueDate', render: (d) => d ? dayjs(d).format(dateFormat) : '-' },
        { title: translate('Amount'), dataIndex: 'amount', key: 'amount', render: (amount) => moneyFormatter({ amount }) },
        {
            title: translate('Paid'),
            dataIndex: 'paidAmount',
            key: 'paidAmount',
            render: (paid) => <b style={{ color: 'green' }}>{moneyFormatter({ amount: paid || 0 })}</b>
        },
        {
            title: translate('Status'), dataIndex: 'status', key: 'status', render: (status) => {
                let color = status === 'paid' ? 'green' : status === 'overdue' ? 'red' : 'gold';
                return <Tag color={color}>{status ? status.toUpperCase() : 'PENDING'}</Tag>;
            }
        },
        {
            title: translate('Action'), key: 'action', render: (_, record) => {
                const pending = record.amount - (record.paidAmount || 0);
                // Show button if there is pending amount OR if status is explicitly not paid (even if amount is 0)
                if (pending > 0 || record.status !== 'paid') {
                    return <Button type="primary" size="small" onClick={() => handlePay(record)}>Pay</Button>
                }
                return <span>Paid</span>;
            }
        }
    ];

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
                            value={moneyFormatter({ amount: booking.paymentPlan.filter(p => p.paidAmount).reduce((acc, curr) => acc + (curr.paidAmount || 0), 0) })}
                            valueStyle={{ color: '#3f8600' }}
                        />
                        <Divider />
                        <Statistic
                            title="Pending Amount"
                            value={moneyFormatter({ amount: booking.totalAmount - booking.paymentPlan.filter(p => p.paidAmount).reduce((acc, curr) => acc + (curr.paidAmount || 0), 0) })}
                            valueStyle={{ color: '#cf1322' }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Record Payment Modal */}
            <Modal
                title={`Record Payment: ${paymentModal.milestone?.name}`}
                open={paymentModal.open}
                onCancel={() => setPaymentModal({ open: false, milestone: null })}
                onOk={handlePaymentSubmit}
                okText="Record Payment"
                destroyOnClose
            >
                <Form form={form} layout="vertical" initialValues={{
                    date: dayjs(),
                    amount: paymentModal.milestone ? (paymentModal.milestone.amount - (paymentModal.milestone.paidAmount || 0)) : 0,
                    paymentMode: 'Bank Transfer',
                    ledger: 'official'
                }}>
                    <Form.Item name="date" label="Date" rules={[{ required: true }]}>
                        <DatePicker style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item name="amount" label="Amount" rules={[{ required: true }]}>
                        <InputNumber style={{ width: '100%' }} min={1} />
                    </Form.Item>
                    <Form.Item name="paymentMode" label="Payment Mode" rules={[{ required: true }]}>
                        <Select>
                            <Select.Option value="Cash">Cash</Select.Option>
                            <Select.Option value="Bank Transfer">Bank Transfer</Select.Option>
                            <Select.Option value="Card">Card</Select.Option>
                            <Select.Option value="Loan">Loan</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="ledger"
                        label="Ledger / Account"
                        rules={[{ required: true, message: 'Please select an account type' }]}
                    >
                        <Select>
                            <Select.Option value="official">Official Account (White)</Select.Option>
                            <Select.Option value="internal">Internal Account (Black)</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item name="ref" label="Reference / Transaction ID">
                        <Input />
                    </Form.Item>
                    <Form.Item name="description" label="Description">
                        <Input.TextArea />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}
