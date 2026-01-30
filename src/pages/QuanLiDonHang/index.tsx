
import { Table, Button, Modal, Form, Input, InputNumber, message, Popconfirm, Select, Descriptions, DatePicker, Space } from 'antd';
import React, { useMemo, useState } from 'react';
import { useModel } from 'umi';

export default () => {
    const [open, setOpen] = useState(false);
    const [form] = Form.useForm();
    const { dataSource: orders, setDataSource: setOrders } = useModel('danhsachdonhang');
    const { dataSource: products, setDataSource: setProducts } = useModel('danhsachsanpham');
    const [sanphamchon, setsanphamchon] = useState<number[]>([]);
    const [detailOpen, setDetailOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<any>(null);
    const [searchText, setSearchText] = useState('');
    type OrderStatus = 'Chờ xử lý' | 'Đang vận chuyển' | 'Đã hoàn thành' | 'Đã hủy';
    const [locTrangThai, setLocTrangThai] = useState<string | undefined>(undefined);
    const [locNgayTao, setLocNgayTao] = useState<any>(null);
    const productOptions = useMemo( // Tạo danh sách tùy chọn sản phẩm
        () => (products || []).map((p: any) => ({ label: `${p.name} (Tồn: ${p.quantity.toLocaleString('vi-VN')})`, value: p.id })),
        [products]
    );

    const quantities = Form.useWatch('quantities', form) || {}; //so lg san pham
    const selectedProducts = useMemo( // Sản phẩm đã chọn
        () => (products || []).filter((p: any) => sanphamchon.includes(p.id)),
        [products, sanphamchon]
    );
    const totalAmount = useMemo( // Tổng tiền
        () => selectedProducts.reduce((sum: number, p: any) => sum + p.price * (Number(quantities?.[p.id]) || 0), 0),
        [selectedProducts, quantities]
    );
    const DataSauLoc = useMemo (() =>{
        return (orders || []).filter((item:any) => {
            const text = searchText.toLowerCase().trim();
            const customer = String(item.customerName || '').toLowerCase();
            const id = String(item.id || '').toLowerCase();
            const matchStatus = locTrangThai ? item.status === locTrangThai : true;
            const matchDate = locNgayTao ? (new Date(item.createdAt) >= new Date(locNgayTao[0]) && new Date(item.createdAt) <= new Date(locNgayTao[1])) : true;
            return (customer.includes(text) || id.includes(text))&& matchStatus && matchDate; 
        });
    }, [orders, searchText, locTrangThai, locNgayTao])
    const columns = [
        { title: 'Mã Đơn Hàng', 
            dataIndex: 'id',
            align: 'center',
            key: 'id', 
            width: 120 },
        { title: 'Tên Khách Hàng', 
            dataIndex: 'customerName', 
            key: 'customerName', 
            width: 200 },
        { title: 'Số Sản Phẩm', 
            align: 'center',
            key: 'productCount',
            width: 50, 
            render: (_: any, r: any) => r.products?.length || 0 },
        { title: 'Tổng Tiền', 
            dataIndex: 'totalAmount', 
            key: 'totalAmount', 
            width: 160, 
            render: (v: number) => v?.toLocaleString('vi-VN') + ' ₫' },
        {
            title: 'Trạng Thái', 
            dataIndex: 'status', 
            key: 'status', 
            width: 200,
            align: 'center',    
            render: (_: any, r: any) => {
                const options = [
                    { label: 'Chờ xử lý', value: 'Chờ xử lý' },
                    { label: 'Đang vận chuyển', value: 'Đang vận chuyển' },
                    { label: 'Đã hoàn thành', value: 'Đã hoàn thành' },
                    { label: 'Đã hủy', value: 'Đã hủy' },
                ];
                const handleStatusChange = (nextStatus: string) => {
                    const prevStatus = r.status;
                    const hadDeducted = !!r.inventoryDeducted;

                    const items = r.products || [];
                    const findItem = (pid: any) => items.find((i: any) => i.productId === pid);

                    const canDeductAll = () => {
                        for (const p of (products || [])) {
                            const it = findItem(p.id);
                            if (it && p.quantity < Number(it.quantity || 0)) return false;
                        }
                        return true;
                    };

                    let shouldUpdateProducts = false;
                    let nextInventoryDeducted = hadDeducted;
                    let updatedProducts = products || [];

                    const enteringShipping = prevStatus !== 'Đang vận chuyển' && nextStatus === 'Đang vận chuyển';
                    const fallbackEnteringCompleted = prevStatus !== 'Đã hoàn thành' && nextStatus === 'Đã hoàn thành' && !hadDeducted;
                    const returningNeeded = (
                        (nextStatus === 'Đã hủy' && hadDeducted) ||

                        (prevStatus === 'Đang vận chuyển' && nextStatus === 'Chờ xử lý' && hadDeducted)
                    );

                    if ((enteringShipping || fallbackEnteringCompleted) && !hadDeducted) {
                        if (!canDeductAll()) {
                            message.error('Tồn kho không đủ để xuất hàng. Hãy kiểm tra lại.');
                            return;
                        }
                        updatedProducts = updatedProducts.map((p: any) => {
                            const it = findItem(p.id);
                            if (!it) return p;
                            return { ...p, quantity: p.quantity - Number(it.quantity || 0) };
                        });
                        shouldUpdateProducts = true;
                        nextInventoryDeducted = true;
                    } else if (returningNeeded) {
                        updatedProducts = updatedProducts.map((p: any) => {
                            const it = findItem(p.id);
                            if (!it) return p;
                            return { ...p, quantity: p.quantity + Number(it.quantity || 0) };
                        });
                        shouldUpdateProducts = true;
                        nextInventoryDeducted = false;
                    }

                    if (shouldUpdateProducts) setProducts(updatedProducts);

                    const updatedOrders = (orders || []).map((o: any) => o.id === r.id ? { ...o, status: nextStatus, inventoryDeducted: nextInventoryDeducted } : o);
                    setOrders(updatedOrders);
                    message.success('Đã cập nhật trạng thái');
                };

                return (
                    <Select
                        value={r.status}
                        options={options}
                        onChange={handleStatusChange}
                        style={{ width: 180 }}
                    />
                );
            }
        },
        { title: 'Ngày Tạo', dataIndex: 'createdAt', key: 'createdAt', width: 140 },
        {
        title: 'Thao Tác', key: 'action', width: 260,
            render: (_: any, record: any) => (
                <>
            <Button onClick={() => { setSelectedOrder(record); setDetailOpen(true); }}>Chi tiết</Button>
            <span style={{ margin: '0 8px' }} />
                    <Button type="primary" disabled>Sửa</Button>
                    <span style={{ margin: '0 8px' }} />
                    <Popconfirm
                        title="Bạn có chắc muốn xóa đơn hàng này?"
                        onConfirm={() => {
                            const list = (orders || []).filter((item: any) => item.id !== record.id);
                            setOrders(list);
                            message.success('Đã xóa');
                        }}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button type="primary" danger>Xoá</Button>
                    </Popconfirm>
                </>
            )
        }
    ];

    return (
        <>
            <Button type="primary" onClick={() => setOpen(true)} style={{ marginBottom: 12 }}>
                Thêm Đơn Hàng
            </Button>
            <Input.Search
                placeholder="Tìm kiếm đơn hàng"
                onSearch={value => setSearchText(value)}
                onChange={e => setSearchText(e.target.value)} //auto render
                style={{ width: 300, marginBottom: 12 }}
            />
            <Select 
                allowClear
                placeholder='Lọc theo trạng thái'
                style={{ width: 200, marginRight: 12, marginBottom: 12 }}
                onChange={(val: OrderStatus | undefined) => setLocTrangThai(val)}
                options={[
                    { label: 'Chờ xử lý', value: 'Chờ xử lý' },
                    { label: 'Đang vận chuyển', value: 'Đang vận chuyển' },
                    { label: 'Đã hoàn thành', value: 'Đã hoàn thành' },
                    { label: 'Đã hủy', value: 'Đã hủy' }
                ]}
            />
            <Space direction= 'vertical' size={12}>
                <DatePicker.RangePicker
                    style={{ width: '100%' }}
                    onChange={(dates) => {
                        setLocNgayTao(dates);
                    }}
                />
            </Space>
            <Modal
                title="Tạo Đơn Hàng"
                visible={open}
                onCancel={() => { setOpen(false); form.resetFields(); setsanphamchon([]); }}
                footer={null}
                destroyOnClose
                width={720}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={(values: any) => {
                        if (!sanphamchon.length) { message.error('Hãy chọn ít nhất 1 sản phẩm'); return; }
                        const items = selectedProducts.map((p: any) => ({
                            productId: p.id,
                            productName: p.name,
                            quantity: Number(values.quantities?.[p.id] || 0),
                            price: p.price,
                        }));
                        // dk
                        if (items.some(i => !Number.isInteger(i.quantity) || i.quantity < 1)) {
                            message.error('Số lượng phải là số nguyên >= 1');
                            return;
                        }
                        for (const it of items) {
                            const p = products.find((x: any) => x.id === it.productId);
                            if (p && it.quantity > p.quantity) {
                                message.error(`Số lượng đặt của "${p.name}" không vượt quá tồn kho (${p.quantity})`);
                                return;
                            }
                        }
                        const total = items.reduce((s, i) => s + i.price * i.quantity, 0);
                        const newOrder = {
                            id: 'DH' + Date.now(),
                            customerName: values.customerName,
                            phone: values.phone,
                            address: values.address,
                            products: items,
                            totalAmount: total,
                            status: 'Chờ xử lý',
                            createdAt: new Date().toISOString().slice(0, 10),
                        };
                        setOrders([...(orders || []), newOrder]);
                        message.success('Tạo đơn hàng thành công');
                        setOpen(false);
                        form.resetFields();
                        setsanphamchon([]);
                    }}
                >
                    <Form.Item
                        label="Sản phẩm"
                        name="productIds"
                        rules={[{ required: true, message: 'Chọn ít nhất 1 sản phẩm' }]}
                    >
                        <Select
                            mode="multiple"
                            placeholder="Chọn sản phẩm"
                            options={productOptions}
                            onChange={(vals: number[]) => setsanphamchon(vals)}
                        />
                    </Form.Item>

                    {selectedProducts.length > 0 && (
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 180px',
                            gap: 12,
                            alignItems: 'center',
                            marginBottom: 12
                        }}>
                            {selectedProducts.map((p: any) => (
                                <React.Fragment key={p.id}>
                                    <div>
                                        <div style={{ fontWeight: 600 }}>{p.name}</div>
                                        <div style={{ fontSize: 12, color: '#888' }}>Giá: {p.price.toLocaleString('vi-VN')} ₫ • Tồn: {p.quantity}</div>
                                    </div>
                                    <Form.Item
                                        label="Số lượng"
                                        name={['quantities', p.id]}
                                        rules={[
                                            { required: true, message: 'Nhập số lượng' },
                                            { type: 'number', min: 1, message: 'Hết Hàng' },
                                            {
                                                validator: (_: any, value: any) => {
                                                    const n = Number(value);
                                                    if (!Number.isInteger(n)) return Promise.reject('Phải là số nguyên');
                                                    if (n > p.quantity) return Promise.reject(`Tối đa ${p.quantity}`);
                                                    return Promise.resolve();
                                                }
                                            }
                                        ]}
                                    >
                                        <InputNumber min={1} max={p.quantity} style={{ width: 80 }} />
                                    </Form.Item>
                                </React.Fragment>
                            ))}
                        </div>
                    )}

                    <Form.Item
                        label="Tên khách hàng"
                        name="customerName"
                        rules={[
                            { required: true, message: 'Hãy nhập tên khách hàng' },
                            {
                                validator: (_: any, v: any) => {
                                    const s = String(v || '').trim();
                                    return s ? Promise.resolve() : Promise.reject('Tên không được toàn khoảng trắng');
                                }
                            }
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Số điện thoại"
                        name="phone"
                        rules={[
                            { required: true, message: 'Hãy nhập số điện thoại' },
                            { pattern: /^\d{10,11}$/, message: 'Số điện thoại phải 10-11 số' }
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Địa chỉ"
                        name="address"
                        rules={[{ required: true, message: 'Hãy nhập địa chỉ' }]}
                    >
                        <Input.TextArea rows={2} />
                    </Form.Item>

                    <div style={{ textAlign: 'right', fontWeight: 600, marginTop: 8 }}>
                        Tổng tiền: {totalAmount.toLocaleString('vi-VN')} ₫
                    </div>

                    <Form.Item style={{ marginTop: 12 }}>
                        <Button type="primary" htmlType="submit">Tạo đơn</Button>
                        <Button style={{ marginLeft: 8 }} onClick={() => { setOpen(false); form.resetFields(); setsanphamchon([]); }}>Hủy</Button>
                    </Form.Item>
                </Form>
            </Modal>

            <Table
                rowKey="id"
                columns={columns as any[]}
                dataSource={DataSauLoc}
                pagination={{ pageSize: 10 }}
            />

            <Modal
                title={`Chi tiết đơn hàng`}
                visible={detailOpen}
                onCancel={() => { setDetailOpen(false); setSelectedOrder(null); }}
                footer={<Button onClick={() => { setDetailOpen(false); setSelectedOrder(null); }}>Đóng</Button>}
                width={800}
            >
                {selectedOrder && ( // chi tiết đơn hàng
                    <div>
                        <Descriptions bordered column={2} size="small">
                            <Descriptions.Item label="Mã đơn">{selectedOrder.id}</Descriptions.Item>
                            <Descriptions.Item label="Trạng thái">{selectedOrder.status}</Descriptions.Item>
                            <Descriptions.Item label="Khách hàng">{selectedOrder.customerName}</Descriptions.Item>
                            <Descriptions.Item label="SĐT">{selectedOrder.phone}</Descriptions.Item>
                            <Descriptions.Item label="Địa chỉ" span={2}>{selectedOrder.address}</Descriptions.Item>
                            <Descriptions.Item label="Ngày tạo">{selectedOrder.createdAt}</Descriptions.Item>
                            <Descriptions.Item label="Tổng tiền">{selectedOrder.totalAmount?.toLocaleString('vi-VN')} ₫</Descriptions.Item>
                        </Descriptions>

                        <div style={{ marginTop: 16 }}>
                            <Table
                                size="small"
                                rowKey={(r: any) => `${selectedOrder.id}-${r.productId}`}
                                dataSource={selectedOrder.products || []}
                                pagination={false}
                                columns={[
                                    { 
                                        title: 'Sản phẩm', 
                                        dataIndex: 'productName', 
                                        key: 'productName' },
                                    { 
                                        title: 'Số lượng', 
                                        dataIndex: 'quantity', 
                                        key: 'quantity', 
                                        align: 'right', 
                                        width: 120 },
                                    { 
                                        title: 'Đơn giá', 
                                        dataIndex: 'price',
                                        key: 'price',
                                        align: 'right', 
                                        width: 160, 
                                        render: (v: number) => v?.toLocaleString('vi-VN') + ' ₫' },
                                    { 
                                        title: 'Thành tiền', 
                                        key: 'amount', 
                                        align: 'right', 
                                        width: 160, 
                                        render: (_: any, r: any) => (r.price * r.quantity).toLocaleString('vi-VN') + ' ₫' },
                                ]}
                            />
                        </div>
                    </div>
                )}
            </Modal>
        </>
    );
}