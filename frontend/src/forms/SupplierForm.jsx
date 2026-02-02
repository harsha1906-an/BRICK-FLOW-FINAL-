import React from 'react';
import { Form, Input, InputNumber, Row, Col } from 'antd';

export default function SupplierForm({ isUpdateForm = false }) {
    return (
        <>
            <Row gutter={[24, 24]}>
                <Col span={24}>
                    <Form.Item
                        label="Supplier Name"
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: 'Please input supplier name!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label="Email" name="email">
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label="Phone" name="phone">
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={24}>
                    <Form.Item label="Address" name="address">
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label="City" name="city">
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label="Country" name="country">
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label="Tax Number (GST/VAT)" name="taxNumber">
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label="Credit Period (Days)" name="creditPeriod">
                        <InputNumber style={{ width: '100%' }} />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label="Website" name="website">
                        <Input />
                    </Form.Item>
                </Col>
            </Row>
        </>
    );
}
