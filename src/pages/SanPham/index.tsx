import { useState } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, message, Popconfirm } from 'antd';
import { useModel } from 'umi';

export default () => {
    const [open, setOpen] = useState(false);
    const [form] = Form.useForm();
    const { dataSource, setDataSource } = useModel('sanpham');

    const handleAddProduct = (value: any) => {
        // Tùy chỉnh thêm logic lưu sản phẩm vào model tại đây nếu cần
        message.success('Thêm Sản Phẩm Thành Công!');
        setOpen(false);
        form.resetFields();
    };

    const handleCancelConfirm = (e?: React.MouseEvent<HTMLElement>) => {
        // Có thể hiển thị thông báo khi hủy
        if (e) console.log(e);
        message.info('Đã hủy');
    };

    const columns = [
        {
            title: 'Mã',
            dataIndex: 'id',
            key: 'id',
            width: 200,
        },
        {
            title: 'Tên Sản Phẩm',
            dataIndex: 'name',
            key: 'name',
            width: 200,
        },
        {
            title: 'Giá Cả',
            dataIndex: 'price',
            key: 'price',
            width: 200,
        },
        {
            title: 'Số Lượng',
            dataIndex: 'quantity',
            key: 'quantity',
            width: 200,
        },
        {
            title: 'Hành Động',
            key: 'action',
            width: 200,
            render: (_: any, record: any) => (
                <Popconfirm
                    title="Bạn có chắc muốn xóa sản phẩm này?"
                    onConfirm={() => {
                        const danhsachSPmoi = dataSource.filter((item: any) => item.id !== record.id);
                        setDataSource(danhsachSPmoi);
                        message.success('Đã xóa');
                    }}
                    onCancel={handleCancelConfirm}
                    okText="Yes"
                    cancelText="No"
                >
                    <a><Button type='primary' danger>Xoá</Button></a>
                </Popconfirm>
            ),
        },
    ];

    return (
        <>
            <Button type="primary" onClick={() => setOpen(true)}>
                Thêm Sản Phẩm
            </Button>
            {/* Lưu ý: ở trên, dùng useState: const [open, setOpen] = useState(false); */}
                    <Modal
                        title="Thêm Sản Phẩm Mới"
                        visible={open}
                        onCancel={() => setOpen(false)}
                        footer={null}
                        destroyOnClose
                    >
                <Form form={form} onFinish={handleAddProduct} layout="vertical">
                    <Form.Item
                        label="Tên Sản Phẩm"
                        name="name"
                        rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Giá"
                        name="price"
                        rules={[{ required: true, message: 'Vui lòng nhập giá sản phẩm!' }]}
                    >
                        <InputNumber style={{ width: '100%' }} min={0} />
                    </Form.Item>
                    <Form.Item
                        label="Số Lượng"
                        name="quantity"
                        rules={[{ required: true, message: 'Vui lòng nhập số lượng sản phẩm!' }]}
                    >
                        <InputNumber style={{ width: '100%' }} min={0} />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Thêm
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
            <Table
                rowKey="id"
                dataSource={dataSource}
                columns={columns as any}
                pagination={{ pageSize: 5 }}
            />
        </>
    );
};
