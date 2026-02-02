import React, { useState, useEffect } from 'react';
import { Form, Input, InputNumber, Button, Select, DatePicker, Divider, Row, Col, App, Card } from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import useLanguage from '@/locale/useLanguage';
import { request } from '@/request';
import SelectAsync from '@/components/SelectAsync';

export default function BookingCreate() {
    const { message } = App.useApp();
    const [form] = Form.useForm();
    const translate = useLanguage();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const { state } = useLocation();
    const [villas, setVillas] = useState([]);

    // Fetch Available Villas
    // We need a custom fetch because SelectAsync works for general cases, 
    // but we specifically want 'available' villas or filtered by company.
    // For now, let's use SelectAsync with filter if possible, or just a custom useEffect.
    // Using SelectAsync is easier if the backend supports filtering. 
    // Let's assume we can fetch all villas and filter client-side or add a filter param later.

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const response = await request.create({ entity: 'booking', jsonData: values });
            if (response.success) {
                message.success('Booking created successfully');
                navigate('/booking');
            } else {
                message.error(response.message || 'Failed to create booking');
            }
        } catch (error) {
            message.error('An error occurred');
            console.error(error);
        }
        setLoading(false);
    };

    return (
        <div style={{ padding: '20px' }}>
            <Card title={translate('Create New Booking')}>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    initialValues={{
                        paymentPlan: [{ name: 'Booking Amount', amount: 0, status: 'pending' }],
                        villa: state?.villaId
                    }}
                >
                    <Row gutter={24}>
                        <Col span={12}>
                            <Form.Item
                                name="client"
                                label={translate('Client')}
                                rules={[{ required: true, message: 'Please select a client' }]}
                            >
                                <SelectAsync
                                    entity={'client'}
                                    displayLabels={['name']}
                                    outputValue={'_id'}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="villa"
                                label={translate('Villa')}
                                rules={[{ required: true, message: 'Please select a villa' }]}
                            >
                                {/* Showing all villas as there is only one project */}
                                <SelectAsync
                                    entity={'villa'}
                                    displayLabels={['villaNumber']}
                                    outputValue={'_id'}
                                    options={{ status: 'available', items: 1000 }} // Filter only available villas
                                    onChange={async (value) => {
                                        if (value) {
                                            try {
                                                const response = await request.read({ entity: 'villa', id: value });
                                                if (response.success && response.result) {
                                                    const price = response.result.price;
                                                    form.setFieldsValue({ totalAmount: price });
                                                }
                                            } catch (e) {
                                                console.error('Failed to fetch villa price', e);
                                            }
                                        }
                                    }}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    {/* Moved to previous row */}

                    <Row gutter={24}>
                        <Col span={12}>
                            <Form.Item
                                label={translate('Official Amount (White)')}
                                name="officialAmount"
                                initialValue={0}
                            >
                                <InputNumber
                                    style={{ width: '100%' }}
                                    formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                    onChange={(value) => {
                                        const internal = form.getFieldValue('internalAmount') || 0;
                                        form.setFieldsValue({ totalAmount: (value || 0) + internal });
                                    }}
                                />
                            </Form.Item>
                            <Form.Item
                                label={translate('Internal Amount (Black)')}
                                name="internalAmount"
                                initialValue={0}
                            >
                                <InputNumber
                                    style={{ width: '100%' }}
                                    formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                    onChange={(value) => {
                                        const official = form.getFieldValue('officialAmount') || 0;
                                        form.setFieldsValue({ totalAmount: official + (value || 0) });
                                    }}
                                />
                            </Form.Item>
                            <Form.Item
                                name="totalAmount"
                                label={translate('Total Agreement Amount')}
                                rules={[{ required: true, message: 'Please enter total amount' }]}
                            >
                                <InputNumber
                                    style={{ width: '100%' }}
                                    formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                    readOnly
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="bookingDate"
                                label={translate('Booking Date')}
                                rules={[{ required: true }]}
                            >
                                <DatePicker style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Divider orientation="left">{translate('Payment Plan / Milestones')}</Divider>

                    <Form.List name="paymentPlan">
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map(({ key, name, ...restField }) => (
                                    <Row key={key} gutter={16} align="middle" style={{ marginBottom: 8 }}>
                                        <Col span={8}>
                                            <Form.Item
                                                {...restField}
                                                name={[name, 'name']}
                                                rules={[{ required: true, message: 'Missing milestone name' }]}
                                                style={{ marginBottom: 0 }}
                                            >
                                                <Input placeholder="Milestone Name (e.g. Plinth)" />
                                            </Form.Item>
                                        </Col>
                                        <Col span={6}>
                                            <Form.Item
                                                {...restField}
                                                name={[name, 'amount']}
                                                rules={[{ required: true, message: 'Missing amount' }]}
                                                style={{ marginBottom: 0 }}
                                            >
                                                <InputNumber placeholder="Amount" style={{ width: '100%' }} />
                                            </Form.Item>
                                        </Col>
                                        <Col span={6}>
                                            <Form.Item
                                                {...restField}
                                                name={[name, 'dueDate']}
                                                style={{ marginBottom: 0 }}
                                            >
                                                <DatePicker placeholder="Due Date" style={{ width: '100%' }} />
                                            </Form.Item>
                                        </Col>
                                        <Col span={2}>
                                            <Form.Item
                                                {...restField}
                                                name={[name, 'status']}
                                                hidden
                                            >
                                                <Input />
                                            </Form.Item>
                                            <MinusCircleOutlined onClick={() => remove(name)} />
                                        </Col>
                                    </Row>
                                ))}
                                <Form.Item>
                                    <Button type="dashed" onClick={() => add({ status: 'pending' })} block icon={<PlusOutlined />}>
                                        Add Milestone
                                    </Button>
                                </Form.Item>
                            </>
                        )}
                    </Form.List>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading}>
                            {translate('Create Booking')}
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
}
