import React, { useState } from 'react';
import { Form, Input, InputNumber, Button, Select, Divider, Row, Col, App, Card } from 'antd';
import { useNavigate } from 'react-router-dom';
import useLanguage from '@/locale/useLanguage';
import { request } from '@/request';

export default function VillaCreate() {
    const { message } = App.useApp();
    const [form] = Form.useForm();
    const translate = useLanguage();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const response = await request.create({ entity: 'villa', jsonData: values });
            if (response.success) {
                message.success('Villa created successfully');
                navigate('/villa');
            } else {
                message.error(response.message || 'Failed to create villa');
            }
        } catch (error) {
            message.error('An error occurred');
            console.error(error);
        }
        setLoading(false);
    };

    return (
        <div style={{ padding: '20px' }}>
            <Card title={translate('Add New Villa')}>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    initialValues={{
                        status: 'available',
                        houseType: '3BHK'
                    }}
                >
                    <Row gutter={24}>
                        <Col span={12}>
                            <Form.Item
                                name="villaNumber"
                                label={translate('Villa Number')}
                                rules={[{ required: true, message: 'Please enter villa number' }]}
                            >
                                <Input placeholder="e.g. V-101" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="houseType"
                                label={translate('House Type')}
                                rules={[{ required: true }]}
                            >
                                <Select>
                                    <Select.Option value="3BHK">3BHK</Select.Option>
                                    <Select.Option value="4BHK">4BHK</Select.Option>
                                    <Select.Option value="5BHK">5BHK</Select.Option>
                                    <Select.Option value="Other">Other</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={12}>
                            <Form.Item
                                name="builtUpArea"
                                label={translate('Built Up Area (sqft)')}
                            >
                                <InputNumber style={{ width: '100%' }} min={0} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="price"
                                label={translate('Price')}
                                rules={[{ required: true, message: 'Please enter price' }]}
                            >
                                <InputNumber
                                    style={{ width: '100%' }}
                                    formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={12}>
                            <Form.Item
                                name="status"
                                label={translate('Status')}
                                rules={[{ required: true }]}
                            >
                                <Select>
                                    <Select.Option value="available">Available</Select.Option>
                                    <Select.Option value="booked">Booked</Select.Option>
                                    <Select.Option value="sold">Sold</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading}>
                            {translate('Save')}
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
}
