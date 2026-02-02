import React, { useState } from 'react';
import { Modal, Form, Button } from 'antd';
import { request } from '@/request';
import { message, modal as AntdModal } from '@/utils/antdGlobal';
import LeadForm from '@/forms/LeadForm';
import { useUserRole } from '@/hooks/useUserRole';

export default function LeadCreate({ open, onCancel, onSuccess }) {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const { role } = useUserRole();
    const canCreate = role === 'OWNER' || role === 'MANAGER' || role === 'AGENT'; // Assuming common roles that can create
    const canOverride = role === 'OWNER';

    const handleSubmit = async (forceCreate = false) => {
        try {
            const values = await form.validateFields();
            setLoading(true);

            // If forcing, add the flag
            const payload = forceCreate ? { ...values, forceCreate: true } : values;

            const data = await request.create({ entity: 'lead', jsonData: payload });

            if (data.success) {
                message.success('Lead created successfully');
                form.resetFields();
                onSuccess();
            }
        } catch (error) {
            const { response } = error;
            if (response?.status === 409) {
                // Duplicate detected
                if (canOverride) {
                    AntdModal.confirm({
                        title: 'Duplicate Lead Warning',
                        content: `${response.data.message}. Do you want to create it anyway??`,
                        okText: 'Yes, Create Anyway',
                        cancelText: 'Cancel',
                        onOk: () => handleSubmit(true), // Recursive call with force flag
                    });
                } else {
                    AntdModal.error({
                        title: 'Duplicate Lead',
                        content: 'A lead with this phone number already exists. You cannot create duplicates.',
                    });
                }
            } else {
                message.error('Failed to create lead');
            }
        }
        setLoading(false);
    };

    return (
        <Modal
            title="Create New Lead"
            open={open}
            onCancel={onCancel}
            footer={[
                <Button key="cancel" onClick={onCancel}>
                    Cancel
                </Button>,
                <Button key="submit" type="primary" loading={loading} onClick={() => handleSubmit(false)}>
                    Create Lead
                </Button>,
            ]}
        >
            <Form form={form} layout="vertical">
                <LeadForm />
            </Form>
        </Modal>
    );
}
