import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Tag, Input, notification, Space, Typography } from 'antd';
import { CheckOutlined, CloseOutlined, EyeOutlined } from '@ant-design/icons';
import { request } from '@/request';
import useLanguage from '@/locale/useLanguage';
import dayjs from 'dayjs';

const { Text } = Typography;

export default function ApprovalsList() {
    const translate = useLanguage();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [rejectModalVisible, setRejectModalVisible] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [rejectReason, setRejectReason] = useState('');

    const fetchData = async () => {
        setLoading(true);
        try {
            const [invoiceRes, paymentRes] = await Promise.all([
                request.list({ entity: 'invoiceupdate', options: { items: 100 } }),
                request.list({ entity: 'paymentupdate', options: { items: 100 } })
            ]);

            const invoices = (invoiceRes.result || []).map(item => ({ ...item, approvalType: 'Invoice' }));
            const payments = (paymentRes.result || []).map(item => ({ ...item, approvalType: 'Payment' }));

            const merged = [...invoices, ...payments].sort((a, b) => dayjs(b.created).diff(dayjs(a.created)));
            setData(merged);
        } catch (e) {
            notification.error({ message: 'Failed to fetch requests' });
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleApprove = async (record) => {
        try {
            const entity = record.approvalType === 'Invoice' ? 'invoice' : 'payment';
            const response = await request.post({
                entity: `${entity}/approve/${record._id}`,
                jsonData: {}
            });
            if (response.success) {
                notification.success({ message: 'Request Approved' });
                fetchData();
            } else {
                notification.error({ message: response.message || 'Failed to approve' });
            }
        } catch (e) {
            notification.error({ message: 'Error approving request' });
        }
    };

    const handleReject = async () => {
        if (!rejectReason) {
            notification.warning({ message: 'Please provide a reason' });
            return;
        }
        try {
            const entity = selectedRecord.approvalType === 'Invoice' ? 'invoice' : 'payment';
            const response = await request.post({
                entity: `${entity}/reject/${selectedRecord._id}`,
                jsonData: { reason: rejectReason }
            });
            if (response.success) {
                notification.success({ message: 'Request Rejected' });
                setRejectModalVisible(false);
                setRejectReason('');
                fetchData();
            } else {
                notification.error({ message: response.message || 'Failed to reject' });
            }
        } catch (e) {
            notification.error({ message: 'Error rejecting request' });
        }
    };

    const columns = [
        {
            title: 'Type',
            dataIndex: 'approvalType',
            key: 'approvalType',
            render: (type) => <Tag color={type === 'Invoice' ? 'blue' : 'orange'}>{type}</Tag>
        },
        {
            title: 'Ref',
            key: 'ref',
            render: (_, record) => {
                const target = record.invoice || record.payment;
                return target ? (target.number || target.paymentReference || target._id) : '-';
            }
        },
        {
            title: 'Requested By',
            dataIndex: ['requestedBy', 'name'],
            key: 'requestedBy',
        },
        {
            title: 'Date',
            dataIndex: 'created',
            key: 'created',
            render: (date) => dayjs(date).format('DD/MM/YYYY HH:mm'),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                let color = 'gold';
                if (status === 'approved') color = 'green';
                if (status === 'rejected') color = 'red';
                return <Tag color={color}>{status.toUpperCase()}</Tag>;
            }
        },
        {
            title: 'Note/Reason',
            dataIndex: 'reason',
            key: 'reason',
            render: (reason) => reason || '-'
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    {record.status === 'pending' ? (
                        <>
                            <Button
                                type="primary"
                                icon={<CheckOutlined />}
                                onClick={() => handleApprove(record)}
                                size="small"
                            >
                                Approve
                            </Button>
                            <Button
                                danger
                                icon={<CloseOutlined />}
                                onClick={() => {
                                    setSelectedRecord(record);
                                    setRejectModalVisible(true);
                                }}
                                size="small"
                            >
                                Reject
                            </Button>
                        </>
                    ) : (
                        <Text type="secondary">Processed</Text>
                    )}
                </Space>
            )
        }
    ];

    return (
        <div style={{ padding: '24px', borderRadius: '8px' }}>
            <h2>Approvals Management</h2>
            <Table
                columns={columns}
                dataSource={data}
                rowKey="_id"
                loading={loading}
                pagination={{ pageSize: 15 }}
            />

            <Modal
                title="Reject Request"
                open={rejectModalVisible}
                onOk={handleReject}
                onCancel={() => setRejectModalVisible(false)}
                okText="Submit Rejection"
                okButtonProps={{ danger: true }}
            >
                <div style={{ marginBottom: 16 }}>
                    <p>Enter the reason for rejecting this {selectedRecord?.approvalType} request:</p>
                    <Input.TextArea
                        rows={4}
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        placeholder="e.g. Invalid amounts, missing documentation, etc."
                    />
                </div>
            </Modal>
        </div>
    );
}
