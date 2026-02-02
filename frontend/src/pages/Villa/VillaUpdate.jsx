import React, { useState, useEffect } from 'react';
import { Form, Input, InputNumber, Button, Select, Divider, Row, Col, App, Card, Spin } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import useLanguage from '@/locale/useLanguage';
import { request } from '@/request';

export default function VillaUpdate() {
    const { message } = App.useApp();
    const [form] = Form.useForm();
    const translate = useLanguage();
    const navigate = useNavigate();
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [villaData, setVillaData] = useState({});

    useEffect(() => {
        const fetchVilla = async () => {
            try {
                const response = await request.read({ entity: 'villa', id });
                if (response.success) {
                    setVillaData(response.result);
                } else {
                    message.error('Failed to load villa details');
                    navigate('/villa');
                }
            } catch (error) {
                console.error(error);
            }
            setFetching(false);
        };
        if (id) fetchVilla();
    }, [id, navigate]);

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const response = await request.update({ entity: 'villa', id, jsonData: values });
            if (response.success) {
                message.success('Villa updated successfully');
                navigate('/villa');
            } else {
                message.error(response.message || 'Failed to update villa');
            }
        } catch (error) {
            message.error('An error occurred');
            console.error(error);
        }
        setLoading(false);
    };

    if (fetching) return <Spin />;

    return (
        <div style={{ padding: '20px' }}>
            <Card title={translate('Update Villa')}>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    initialValues={villaData}
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
