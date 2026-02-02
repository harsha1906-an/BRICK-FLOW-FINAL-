import React, { useEffect, useState } from 'react';
import { Card, DatePicker, Row, Col, Statistic, Spin, message, Button, Space, Table, Tag } from 'antd';
import { ArrowLeftOutlined, ReloadOutlined, WalletOutlined, BuildOutlined, UserOutlined, DownloadOutlined, EuroOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { request } from '@/request';
import { useAppContext } from '@/context/appContext';
import { useMoney } from '@/settings';

const DailyReport = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const [date, setDate] = useState(dayjs());
    const [loading, setLoading] = useState(false);
    const [summary, setSummary] = useState(null);
    const { moneyFormatter, currency_symbol } = useMoney();
    const { state } = useAppContext();
    const companyId = state.currentCompany;

    useEffect(() => {
        fetchSummary();
    }, [date]);

    const fetchSummary = async () => {
        if (!companyId) return;
        setLoading(true);
        try {
            const dateStr = date.format('YYYY-MM-DD');
            const data = await request.get({ entity: `companies/${companyId}/daily-summary?date=${dateStr}` });
            setSummary(data);
        } catch (e) {
            messageApi.error('Failed to load daily summary');
        }
        setLoading(false);
    };

    const handleDownload = () => {
        if (!summary) return;

        const headers = ['Date', 'Labour Wages', 'Petty Cash', 'Inventory Inward', 'Inventory Outward', 'Customer Collections', 'Total Daily Cost'];
        const row = [
            summary.date,
            summary.labour.netWage,
            summary.pettyCash?.expense || 0,
            summary.inventory.inward,
            summary.inventory.outward,
            summary.customerCollections,
            summary.totalDailyExpense
        ];

        const csvContent = "data:text/csv;charset=utf-8,"
            + headers.join(",") + "\n"
            + row.join(",");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `daily_summary_${summary.date}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <Card>
            {contextHolder}
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Space>
                        <h2 style={{ margin: 0 }}>Daily Expense Summary</h2>
                    </Space>
                    <Space>
                        <DatePicker value={date} onChange={setDate} allowClear={false} />
                        <Button icon={<ReloadOutlined />} onClick={fetchSummary} loading={loading} />
                        <Button icon={<DownloadOutlined />} onClick={handleDownload} disabled={!summary}>Download</Button>
                    </Space>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '50px' }}><Spin size="large" /></div>
                ) : summary ? (
                    <>
                        <Row gutter={[16, 16]}>
                            <Col span={6}>
                                <Card bordered={true}>
                                    <Statistic
                                        title="Labour Wages (Net)"
                                        value={summary.labour.netWage}
                                        precision={2}
                                        prefix={<UserOutlined />}
                                        suffix={currency_symbol}
                                    />
                                    <div style={{ fontSize: '12px', color: '#888', marginTop: 8 }}>
                                        {summary.labour.count} Workers Marked
                                    </div>
                                </Card>
                            </Col>
                            <Col span={6}>
                                <Card bordered={true}>
                                    <Statistic
                                        title="Petty Cash Expenses"
                                        value={summary.pettyCash?.expense || 0}
                                        precision={2}
                                        prefix={<EuroOutlined />}
                                        suffix={currency_symbol}
                                    />
                                    <div style={{ fontSize: '12px', color: '#888', marginTop: 8 }}>
                                        {summary.pettyCash?.count || 0} Transactions
                                    </div>
                                </Card>
                            </Col>
                            <Col span={6}>
                                <Card bordered={true}>
                                    <Statistic
                                        title="Customer Collections"
                                        value={summary.customerCollections}
                                        precision={2}
                                        prefix={<BuildOutlined />}
                                        suffix={currency_symbol}
                                        valueStyle={{ color: '#3f8600' }}
                                    />
                                </Card>
                            </Col>
                            <Col span={6}>
                                <Card bordered={true}>
                                    <Statistic
                                        title="Total Daily Cost"
                                        value={summary.totalDailyExpense}
                                        precision={2}
                                        prefix={<WalletOutlined />}
                                        suffix={currency_symbol}
                                        valueStyle={{ color: '#cf1322' }}
                                    />
                                </Card>
                            </Col>
                        </Row>

                        <Card title="Detailed Breakdown" size="small">
                            <Row gutter={32}>
                                <Col span={12}>
                                    <h4>Labour Adjustments</h4>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                        <span>Total Advances Deducted:</span>
                                        <b style={{ color: 'red' }}>-{moneyFormatter({ amount: summary.labour.advances })}</b>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span>Total Penalties Deducted:</span>
                                        <b style={{ color: 'red' }}>-{moneyFormatter({ amount: summary.labour.penalties })}</b>
                                    </div>
                                </Col>
                                <Col span={12}>
                                    <h4>Inventory Activity</h4>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                        <span>Materials Received (In):</span>
                                        <Tag color="green">{summary.inventory.inward} Items</Tag>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span>Materials Issued (Out):</span>
                                        <Tag color="orange">{summary.inventory.outward} Items</Tag>
                                    </div>
                                </Col>
                            </Row>
                        </Card>
                    </>
                ) : null}
            </Space>
        </Card>
    );
};

export default DailyReport;
