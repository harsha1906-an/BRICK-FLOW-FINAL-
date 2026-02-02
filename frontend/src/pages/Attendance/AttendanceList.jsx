import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Select, DatePicker, Switch, Form, Tag, App } from 'antd';
import { PlusOutlined, EditOutlined } from '@ant-design/icons';
import useLanguage from '@/locale/useLanguage';
import { useUserRole } from '@/hooks/useUserRole';
import { request } from '@/request';
import { useAppContext } from '@/context/appContext';
import dayjs from 'dayjs';

const AttendanceList = () => {
  const { message } = App.useApp();
  const [data, setData] = useState([]);
  const [labourList, setLabourList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();
  const translate = useLanguage();
  const { role } = useUserRole();
  const { state } = useAppContext();
  const companyId = state.currentCompany;

  const fetchAttendance = async () => {
    if (!companyId) return;
    setLoading(true);
    try {
      const res = await request.get({ entity: `companies/${companyId}/attendance` });
      setData(res);
    } catch (e) {
      message.error('Failed to load attendance');
    }
    setLoading(false);
  };

  const fetchLabour = async () => {
    if (!companyId) return;
    try {
      const res = await request.get({ entity: `companies/${companyId}/labour` });
      setLabourList(res);
    } catch (e) {
      message.error('Failed to load labour list');
    }
  };

  useEffect(() => {
    if (companyId) {
      fetchAttendance();
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
        form.setFieldsValue({
          ...editing,
          date: dayjs(editing.date),
          status: editing.status || 'present',
        });
      } else {
        form.resetFields();
        form.setFieldsValue({ status: 'present', date: dayjs() });
      }
    }
  }, [modalOpen, editing, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        ...values,
        date: values.date.format('YYYY-MM-DD'),
      };
      if (editing) {
        await request.patch({ entity: `companies/${companyId}/attendance/${editing._id}`, jsonData: payload });
        message.success('Attendance updated');
      } else {
        await request.post({ entity: `companies/${companyId}/attendance`, jsonData: payload });
        message.success('Attendance marked');
      }
      setModalOpen(false);
      fetchAttendance();
    } catch (e) {
      if (e?.response?.status === 409) {
        message.error('Attendance already marked for this labour and date');
      } else {
        message.error('Failed to save attendance');
      }
    }
  };

  const columns = [
    { title: 'Date', dataIndex: 'date', key: 'date', render: v => dayjs(v).format('YYYY-MM-DD') },
    { title: 'Labour', dataIndex: 'labourId', key: 'labourId', render: v => labourList.find(l => l._id === v)?.name || v },
    { title: 'Status', dataIndex: 'status', key: 'status', render: v => v === 'present' ? <Tag color="green">Present</Tag> : <Tag color="red">Absent</Tag> },
  ];
  if (role === 'OWNER' || role === 'ENGINEER') {
    columns.push({
      title: 'Action',
      key: 'action',
      render: (_, record) => <Button icon={<EditOutlined />} onClick={() => openModal(record)} />,
    });
  }

  return (
    <div>
      <h2>Attendance</h2>
      {(role === 'OWNER' || role === 'ENGINEER') && (
        <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal()} style={{ marginBottom: 16 }}>
          Mark Attendance
        </Button>
      )}
      <Table rowKey="_id" columns={columns} dataSource={data} loading={loading} />
      <Modal
        title={editing ? 'Edit Attendance' : 'Mark Attendance'}
        open={modalOpen}
        onOk={role === 'ACCOUNTANT' ? undefined : handleOk}
        onCancel={() => setModalOpen(false)}
        destroyOnClose
        okButtonProps={role === 'ACCOUNTANT' ? { disabled: true } : {}}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="date" label="Date" rules={[{ required: true }]}>
            <DatePicker disabled={role === 'ACCOUNTANT'} />
          </Form.Item>
          <Form.Item name="labourId" label="Labour" rules={[{ required: true }]}>
            <Select options={labourList.map(l => ({ value: l._id, label: l.name }))} disabled={role === 'ACCOUNTANT'} />
          </Form.Item>
          <Form.Item
            name="status"
            label="Status"
            valuePropName="checked"
            getValueProps={(value) => ({ checked: value === 'present' })}
            getValueFromEvent={(checked) => (checked ? 'present' : 'absent')}
            rules={[{ required: true }]}
          >
            <Switch checkedChildren="Present" unCheckedChildren="Absent" disabled={role === 'ACCOUNTANT'} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AttendanceList;
