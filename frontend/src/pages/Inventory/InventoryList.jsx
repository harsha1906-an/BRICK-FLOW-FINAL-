import React, { useState, useEffect } from 'react';
import { Card, Table, Tag, Button, Space, Input, Select, Modal, InputNumber, Form, DatePicker, Tooltip } from 'antd';
import { PlusOutlined, SearchOutlined, HistoryOutlined, ArrowUpOutlined, ArrowDownOutlined, WarningOutlined } from '@ant-design/icons';
import { request } from '@/request';
import { message } from '@/utils/antdGlobal';
import { useUserRole } from '@/hooks/useUserRole';
import MaterialForm from '@/forms/MaterialForm';
import dayjs from 'dayjs';

export default function InventoryList() {
    const [data, setData] = useState([]);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');

    // Modal States
    const [isMaterialModalOpen, setIsMaterialModalOpen] = useState(false);
    const [stockModal, setStockModal] = useState({ open: false, type: null, material: null });
    const [historyModal, setHistoryModal] = useState({ open: false, material: null, data: [] });

    const { role } = useUserRole();
    const canEdit = role === 'OWNER' || role === 'ENGINEER'; // Engineers need to issue stock

    useEffect(() => {
        fetchData();
        fetchProjects();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const data = await request.listAll({ entity: 'material' });
            if (data.success) setData(data.result);
        } catch (e) { message.error('Failed to load inventory'); }
        setLoading(false);
    };

    const fetchProjects = async () => {
        try {
            const data = await request.listAll({ entity: 'project' });
            if (data.success) setProjects(data.result);
        } catch (e) { console.error('Failed to load projects'); }
    };

    const filteredData = data.filter(item => {
        const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
        const matchesSearch = item.name.toLowerCase().includes(searchText.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const categories = ['Cement', 'Steel', 'Aggregates', 'Bricks/Blocks', 'Electrical', 'Plumbing', 'Paint', 'Wood', 'Other'];

    const columns = [
        { title: 'Material', dataIndex: 'name', key: 'name', sorter: (a, b) => a.name.localeCompare(b.name) },
        {
            title: 'Category', dataIndex: 'category', key: 'category',
            render: c => <Tag>{c}</Tag>
        },
        {
            title: 'Current Stock',
            key: 'currentStock',
            render: (_, r) => {
                const isLow = r.reorderLevel > 0 && r.currentStock <= r.reorderLevel;
                return (
                    <span style={{ fontWeight: 'bold', color: isLow ? 'red' : 'inherit' }}>
                        {r.currentStock} {r.unit}
                        {isLow && <Tooltip title="Low Stock"><WarningOutlined style={{ marginLeft: 8, color: 'red' }} /></Tooltip>}
                    </span>
                );
            },
            sorter: (a, b) => a.currentStock - b.currentStock
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, r) => (
                <Space>
                    {canEdit && (
                        <>
                            <Tooltip title="Add Stock (Inward)">
                                <Button size="small" icon={<ArrowDownOutlined style={{ color: 'green' }} />} onClick={() => openStockModal('inward', r)} />
                            </Tooltip>
                            <Tooltip title="Issue Stock (Outward)">
                                <Button size="small" icon={<ArrowUpOutlined style={{ color: 'red' }} />} onClick={() => openStockModal('outward', r)} />
                            </Tooltip>
                        </>
                    )}
                    <Tooltip title="View History">
                        <Button size="small" icon={<HistoryOutlined />} onClick={() => openHistory(r)} />
                    </Tooltip>
                </Space>
            )
        }
    ];

    const openStockModal = (type, material) => {
        setStockModal({ open: true, type, material });
    };

    const openHistory = async (material) => {
        try {
            const data = await request.get({ entity: `material/history/${material._id}` });
            if (data.success) {
                setHistoryModal({ open: true, material, data: data.result });
            }
        } catch (e) { message.error('Failed to view history'); }
    };

    return (
        <Card title="Inventory Management" extra={canEdit && <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsMaterialModalOpen(true)}>Add Material</Button>}>
            <div style={{ marginBottom: 16, display: 'flex', gap: 16 }}>
                <Input placeholder="Search materials..." prefix={<SearchOutlined />} style={{ width: 200 }} onChange={e => setSearchText(e.target.value)} />
                <Select defaultValue="all" style={{ width: 150 }} onChange={setCategoryFilter}>
                    <Select.Option value="all">All Categories</Select.Option>
                    {categories.map(c => <Select.Option key={c} value={c}>{c}</Select.Option>)}
                </Select>
            </div>

            <Table
                columns={columns}
                dataSource={filteredData}
                rowKey="_id"
                loading={loading}
                pagination={{ pageSize: 10 }}
            />

            {/* Create Material Modal */}
            {isMaterialModalOpen && (
                <CreateMaterialModal
                    open={isMaterialModalOpen}
                    onCancel={() => setIsMaterialModalOpen(false)}
                    onSuccess={() => { setIsMaterialModalOpen(false); fetchData(); }}
                />
            )}

            {/* Stock Adjustment Modal */}
            {stockModal.open && (
                <StockAdjustmentModal
                    data={stockModal}
                    projects={projects}
                    onCancel={() => setStockModal({ ...stockModal, open: false })}
                    onSuccess={() => { setStockModal({ ...stockModal, open: false }); fetchData(); }}
                />
            )}

            {/* History Modal */}
            <Modal title={`History: ${historyModal.material?.name}`} open={historyModal.open} onCancel={() => setHistoryModal({ open: false, material: null, data: [] })} footer={null} width={700}>
                <Table
                    dataSource={historyModal.data}
                    rowKey="_id"
                    pagination={{ pageSize: 5 }}
                    columns={[
                        { title: 'Date', dataIndex: 'date', render: d => dayjs(d).format('DD MMM YYYY') },
                        { title: 'Type', dataIndex: 'type', render: t => t === 'inward' ? <Tag color="green">IN</Tag> : <Tag color="red">OUT</Tag> },
                        { title: 'Qty', dataIndex: 'quantity', render: q => <b>{q}</b> },
                        { title: 'Project', dataIndex: 'project', render: p => p?.name || '-' },
                        { title: 'Usage', dataIndex: 'usageCategory', render: u => <Tag size="small">{u?.replace('_', ' ')}</Tag> },
                        { title: 'Ref/Notes', key: 'notes', render: (_, r) => <Tooltip title={r.notes}>{r.reference || '-'}</Tooltip> }
                    ]}
                />
            </Modal>
        </Card>
    );
}

function CreateMaterialModal({ open, onCancel, onSuccess }) {
    const [form] = Form.useForm();
    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            await request.create({ entity: 'material', jsonData: values });
            message.success('Material created');
            form.resetFields();
            onSuccess();
        } catch (e) { message.error('Failed to create'); }
    };
    return (
        <Modal title="Add New Material" open={open} onCancel={onCancel} onOk={handleSubmit}>
            <Form form={form} layout="vertical"><MaterialForm /></Form>
        </Modal>
    );
}

function StockAdjustmentModal({ data, projects, onCancel, onSuccess }) {
    const [form] = Form.useForm();
    const { type, material, open } = data;
    const isInward = type === 'inward';

    useEffect(() => { form.resetFields(); }, [open]);

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            await request.post({
                entity: `material/adjust/${material._id}`,
                jsonData: {
                    ...values,
                    type: type,
                    date: values.date.format('YYYY-MM-DD')
                }
            });
            message.success('Stock updated');
            onSuccess();
        } catch (e) {
            const { response } = e;
            message.error(response?.data?.message || 'Failed');
        }
    };

    return (
        <Modal
            title={isInward ? `Add Stock: ${material?.name}` : `Issue Material: ${material?.name}`}
            open={open}
            onCancel={onCancel}
            onOk={handleSubmit}
            okType={isInward ? 'primary' : 'danger'}
            okText={isInward ? 'Add Stock' : 'Issue Material'}
        >
            {material && (
                <Form form={form} layout="vertical">
                    <Form.Item name="date" label="Date" initialValue={dayjs()} rules={[{ required: true }]}>
                        <DatePicker style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item name="quantity" label={`Quantity (${material.unit})`} rules={[{ required: true }]}>
                        <InputNumber style={{ width: '100%' }} min={0.01} />
                    </Form.Item>

                    {!isInward && (
                        <>
                            <Form.Item name="project" label="For Project (Site)" rules={[{ required: true }]}>
                                <Select placeholder="Select Site">
                                    {projects.map(p => <Select.Option key={p._id} value={p._id}>{p.name}</Select.Option>)}
                                </Select>
                            </Form.Item>
                            <Form.Item name="usageCategory" label="Usage Reason" initialValue="daily_work">
                                <Select>
                                    <Select.Option value="daily_work">Daily Work</Select.Option>
                                    <Select.Option value="waste">Waste</Select.Option>
                                    <Select.Option value="transfer">Transfer</Select.Option>
                                    <Select.Option value="other">Other</Select.Option>
                                </Select>
                            </Form.Item>
                        </>
                    )}

                    <Form.Item name="reference" label={isInward ? "Source / PO Number" : "Reference (Gate Pass / Slip No.)"} rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="notes" label="Notes">
                        <Input.TextArea />
                    </Form.Item>
                </Form>
            )}
        </Modal>
    );
}
