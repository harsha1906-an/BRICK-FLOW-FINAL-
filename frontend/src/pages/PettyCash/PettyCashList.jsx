import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Tag, Form, Input, InputNumber, App, Card, Row, Col, Statistic, DatePicker } from 'antd';
import { PlusOutlined, MinusOutlined, WalletOutlined } from '@ant-design/icons';
import useLanguage from '@/locale/useLanguage';
import { useUserRole } from '@/hooks/useUserRole';
import { request } from '@/request';
import { useMoney } from '@/settings';
import dayjs from 'dayjs';

const PettyCashList = () => {
    const { message } = App.useApp();
    const { moneyFormatter } = useMoney();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [summary, setSummary] = useState({ totalInward: 0, totalOutward: 0, balance: 0 });
    const [modalOpen, setModalOpen] = useState(false);
    const [modalType, setModalType] = useState('outward'); // 'inward' or 'outward'
    const [form] = Form.useForm();
    const translate = useLanguage();
    const { role } = useUserRole();

    const fetchData = async () => {
        setLoading(true);
        try {
            const [listRes, summaryRes] = await Promise.all([
                request.list({ entity: 'pettycashtransaction' }),
                request.summary({ entity: 'pettycashtransaction' })
            ]);
            setData(listRes.result);
            setSummary(summaryRes.result);
        } catch (e) {
            console.error(e);
            message.error('Failed to load petty cash data');
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const openModal = (type) => {
        setModalType(type);
        setModalOpen(true);
    };

    useEffect(() => {
        if (modalOpen) {
            form.resetFields();
            form.setFieldsValue({ date: dayjs() });
        }
    }, [modalOpen]);

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            values.type = modalType;
            // Convert dayjs to JS Date for backend
            if (values.date) values.date = values.date.toDate();

            await request.post({ entity: 'pettycashtransaction/create', jsonData: values });
            message.success(modalType === 'inward' ? 'Cash added successfully' : 'Expense recorded successfully');
            setModalOpen(false);
            fetchData();
        } catch (e) {
            if (e.errorFields) return;
            message.error(e.response?.data?.message || 'Failed to save transaction');
        }
    };

    const columns = [
        { title: 'Date', dataIndex: 'date', key: 'date', render: (date) => dayjs(date).format('DD/MM/YYYY') },
        { title: 'Name', dataIndex: 'name', key: 'name' },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
            render: (type) => type === 'inward' ? <Tag color="green">Top-up</Tag> : <Tag color="red">Expense</Tag>
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
            render: (amount, record) => (
                <span style={{ color: record.type === 'inward' ? 'green' : 'red', fontWeight: 'bold' }}>
                    {record.type === 'inward' ? '+' : '-'}{moneyFormatter({ amount })}
                </span>
            )
        },
        { title: 'Receipt #', dataIndex: 'receiptNumber', key: 'receiptNumber' },
        { title: 'Notes', dataIndex: 'note', key: 'note' },
    ];

    return (
        <div style={{ padding: '20px' }}>
            <Row gutter={16} style={{ marginBottom: 24 }}>
                <Col span={8}>
                    <Card bordered={false} className="summary-card">
                        <Statistic title="Total Cash Received" value={summary.totalInward} precision={2} prefix={<WalletOutlined />} valueStyle={{ color: '#3f8600' }} />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card bordered={false} className="summary-card">
                        <Statistic title="Total Expenses" value={summary.totalOutward} precision={2} prefix={<MinusOutlined />} valueStyle={{ color: '#cf1322' }} />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card bordered={false} className="summary-card">
                        <Statistic title="Current Balance" value={summary.balance} precision={2} prefix={<WalletOutlined />} valueStyle={{ color: summary.balance < 0 ? '#cf1322' : '#1890ff' }} />
                    </Card>
                </Col>
            </Row>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h2 style={{ margin: 0 }}>Petty Cash Ledger</h2>
                <div style={{ display: 'flex', gap: 12 }}>
                    {role === 'OWNER' && (
                        <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal('inward')} style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}>
                            Add Cash
                        </Button>
                    )}
                    {(role === 'OWNER' || role === 'ENGINEER') && (
                        <Button type="primary" danger icon={<MinusOutlined />} onClick={() => openModal('outward')}>
                            Log Expense
                        </Button>
                    )}
                </div>
            </div>

            <Table
                rowKey="_id"
                columns={columns}
                dataSource={data}
                loading={loading}
                pagination={{ pageSize: 10 }}
                style={{ borderRadius: '8px', overflow: 'hidden' }}
            />

            <Modal
                title={modalType === 'inward' ? 'Add Petty Cash (Top-up)' : 'Record New Expense'}
                open={modalOpen}
                onCancel={() => setModalOpen(false)}
                onOk={handleOk}
                destroyOnClose
                okText="Confirm"
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="name" label={modalType === 'inward' ? 'Reference / Title' : 'Expense Description'} rules={[{ required: true, message: 'Please enter a name' }]}>
                        <Input placeholder={modalType === 'inward' ? 'e.g. Weekly Cash for Site' : 'e.g. Material Purchase'} />
                    </Form.Item>
                    <Form.Item name="amount" label="Amount" rules={[{ required: true, message: 'Please enter amount' }]}>
                        <InputNumber style={{ width: '100%' }} min={1} placeholder="0.00" />
                    </Form.Item>
                    <Form.Item name="date" label="Date" rules={[{ required: true }]}>
                        <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
                    </Form.Item>
                    <Form.Item name="receiptNumber" label="Receipt / Voucher Number">
                        <Input placeholder="Optional" />
                    </Form.Item>
                    <Form.Item name="note" label="Additional Notes">
                        <Input.TextArea placeholder="Describe the transaction detail..." />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default PettyCashList;
