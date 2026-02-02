import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Tag, Switch, Select, Form, Input, App, Space, Tabs } from 'antd';
import { PlusOutlined, EditOutlined } from '@ant-design/icons';
import useLanguage from '@/locale/useLanguage';
import { useUserRole } from '@/hooks/useUserRole';
import { request } from '@/request';
import { useAppContext } from '@/context/appContext';

const skillOptions = [
  { value: 'mason', label: 'Mason' },
  { value: 'electrician', label: 'Electrician' },
  { value: 'plumber', label: 'Plumber' },
  { value: 'helper', label: 'Helper' },
  { value: 'other', label: 'Other' },
];

const LabourList = () => {
  const { message } = App.useApp();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();
  const translate = useLanguage();
  const { role } = useUserRole();
  const { state } = useAppContext();
  const companyId = state.currentCompany;

  const fetchLabour = async () => {
    if (!companyId) return;
    setLoading(true);
    try {
      const res = await request.get({ entity: `companies/${companyId}/labour` });
      setData(res);
    } catch (e) {
      message.error('Failed to load labour list');
    }
    setLoading(false);
  };

  useEffect(() => {
    if (companyId) {
      fetchLabour();
    }
    // eslint-disable-next-line
  }, [companyId]);

  const openModal = (record = null) => {
    setEditing(record);
    setModalOpen(true);
  };

  useEffect(() => {
    if (modalOpen) {
      if (editing) {
        form.setFieldsValue(editing);
      } else {
        form.resetFields();
      }
    }
  }, [modalOpen, editing, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (editing) {
        await request.patch({ entity: `companies/${companyId}/labour/${editing._id}`, jsonData: values });
        message.success('Labour updated');
      } else {
        await request.post({ entity: `companies/${companyId}/labour`, jsonData: values });
        message.success('Labour created');
      }
      setModalOpen(false);
      fetchLabour();
    } catch (e) {
      message.error('Failed to save labour');
    }
  };

  const columns = [
    {
      title: 'Name', dataIndex: 'name', key: 'name', render: (text, record) => (
        <Space>
          {text}
          {record.isSubstitute && <Tag color="blue">Substitute</Tag>}
        </Space>
      )
    },
    { title: 'Skill', dataIndex: 'skill', key: 'skill', render: v => skillOptions.find(o => o.value === v)?.label || v },
    { title: 'Phone', dataIndex: 'phone', key: 'phone' },
    { title: 'Type', dataIndex: 'employmentType', key: 'employmentType', render: v => v ? v.charAt(0).toUpperCase() + v.slice(1) : 'Daily' },
    {
      title: 'Rate/Salary', key: 'rate', render: (_, record) => {
        if (record.employmentType === 'monthly') return `₹${record.monthlySalary}/mo`;
        return `₹${record.dailyWage}/day`;
      }
    },
    { title: 'Status', dataIndex: 'isActive', key: 'isActive', render: v => v ? <Tag color="green">Active</Tag> : <Tag color="red">Inactive</Tag> },
  ];
  if (role === 'OWNER' || role === 'ENGINEER') {
    columns.push({
      title: 'Action',
      key: 'action',
      render: (_, record) => <Button icon={<EditOutlined />} onClick={() => openModal(record)} />,
    });
  }

  const filteredData = (type) => data.filter(item => {
    if (type === 'all') return true;
    return item.employmentType === type;
  });

  const tabItems = [
    { key: 'all', label: 'All Labour', children: <Table rowKey="_id" columns={columns} dataSource={data} loading={loading} /> },
    { key: 'daily', label: 'Daily Wage', children: <Table rowKey="_id" columns={columns} dataSource={filteredData('daily')} loading={loading} /> },
    { key: 'monthly', label: 'Monthly Salary', children: <Table rowKey="_id" columns={columns} dataSource={filteredData('monthly')} loading={loading} /> },
    { key: 'contract', label: 'Contract Based', children: <Table rowKey="_id" columns={columns} dataSource={filteredData('contract')} loading={loading} /> },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2 style={{ margin: 0 }}>Labour Management</h2>
        {(role === 'OWNER' || role === 'ENGINEER') && (
          <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal()}>
            Add Labour
          </Button>
        )}
      </div>

      <Tabs defaultActiveKey="all" items={tabItems} />
      <Modal
        title={editing ? 'Edit Labour' : 'Add Labour'}
        open={modalOpen}
        onOk={role === 'ACCOUNTANT' ? undefined : handleOk}
        onCancel={() => setModalOpen(false)}
        destroyOnClose
        okButtonProps={role === 'ACCOUNTANT' ? { disabled: true } : {}}
        width={600}
      >
        <Form form={form} layout="vertical" initialValues={{ employmentType: 'daily', isActive: true }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Form.Item name="name" label="Name" rules={[{ required: true }]}>
              <Input disabled={role === 'ACCOUNTANT'} />
            </Form.Item>
            <Form.Item name="phone" label="Phone">
              <Input disabled={role === 'ACCOUNTANT'} />
            </Form.Item>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Form.Item name="skill" label="Skill / Worker Type" rules={[{ required: true }]}>
              <Select options={skillOptions} disabled={role === 'ACCOUNTANT'} />
            </Form.Item>
            <Form.Item name="employmentType" label="Employment Type" rules={[{ required: true }]}>
              <Select
                options={[
                  { value: 'daily', label: 'Daily Wage' },
                  { value: 'monthly', label: 'Monthly Salary' },
                  { value: 'contract', label: 'Contract Based' },
                ]}
                disabled={role === 'ACCOUNTANT'}
              />
            </Form.Item>
          </div>

          <Form.Item noStyle shouldUpdate={(prev, curr) => prev.employmentType !== curr.employmentType}>
            {({ getFieldValue }) => {
              const type = getFieldValue('employmentType');
              if (type === 'daily') {
                return (
                  <Form.Item name="dailyWage" label="Daily Wage Rate" rules={[{ required: true }]}>
                    <Input type="number" prefix="₹" disabled={role === 'ACCOUNTANT'} />
                  </Form.Item>
                );
              }
              if (type === 'monthly') {
                return (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <Form.Item name="monthlySalary" label="Monthly Salary" rules={[{ required: true }]}>
                      <Input type="number" prefix="₹" disabled={role === 'ACCOUNTANT'} />
                    </Form.Item>
                    <Form.Item name="paymentDay" label="Payment Day (of month)" rules={[{ required: true }]}>
                      <Input type="number" min={1} max={31} disabled={role === 'ACCOUNTANT'} />
                    </Form.Item>
                  </div>
                );
              }
              return null;
            }}
          </Form.Item>

          <div style={{ display: 'flex', gap: '24px', marginTop: '8px' }}>
            <Form.Item name="isActive" label="Account Status" valuePropName="checked">
              <Switch checkedChildren="Active" unCheckedChildren="Inactive" disabled={role === 'ACCOUNTANT'} />
            </Form.Item>
            <Form.Item name="isSubstitute" label="Substitute Worker" valuePropName="checked">
              <Switch checkedChildren="Yes" unCheckedChildren="No" disabled={role === 'ACCOUNTANT'} />
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default LabourList;
