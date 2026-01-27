import { useState } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Checkbox, message, Popconfirm } from 'antd';
import { useModel } from 'umi';

export default () => {
    const [open, setOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [bienThamChieuForm] = Form.useForm();
    const { dataSource, setDataSource } = useModel('sanpham');

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
                <>
                    <Button
                        type="primary"
                        onClick={() => {
                            setIsEditing(true);
                            setOpen(true);
                            bienThamChieuForm.setFieldsValue({ ...record });
                        }}
                    >
                        Sửa
                    </Button>
                    <span style={{ margin: '0 8px' }} />
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
                        <Button type="primary" danger>
                            Xoá
                        </Button>
                    </Popconfirm>
                </>
            ),

        },
    ];

    return (
        <>
            <Button
                style={{ marginBottom: 12 }}
                type="primary"
                onClick={() => {
                    setIsEditing(false);
                    bienThamChieuForm.resetFields();
                    setOpen(true);
                }}
            >
                Thêm Sản Phẩm
            </Button>      
                    <Modal
                        title={isEditing ? 'Sửa Sản Phẩm' : 'Thêm Sản Phẩm Mới'}
                        visible={open}
                        onCancel={() => {
                            setOpen(false);
                            setIsEditing(false);
                            bienThamChieuForm.resetFields();
                        }}
                        footer={null}
                        destroyOnClose
                    >
                <Form
                form={bienThamChieuForm}
                name="basic"
                onFinish={(formValues) => {
                    const { id, ...rest } = formValues as any;
                    if (isEditing && id != null) {
                        //sua sp
                        const updated = dataSource.map((item: any) =>
                            item.id === id ? { ...item, ...rest, id } : item
                        );
                        setDataSource(updated);
                        message.success('Sửa Sản Phẩm Thành Công!');
                    } else {
                        //thêm sản phẩm mới
                        const newId = Date.now();
                        setDataSource([...dataSource, { id: newId, ...formValues }]);
                        message.success('Thêm Sản Phẩm Thành Công!');
                    }
                    setOpen(false);
                    setIsEditing(false);
                    bienThamChieuForm.resetFields();
                }}
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                initialValues={{ remember: true }}
                // onFinish={onFinish}
                // onFinishFailed={onFinishFailed}
                autoComplete="off"
                >

                <Form.Item
                    label="Tên Sản Phẩm"
                    name="name"
                    
                    rules={[{ required: true, message: 'Hãy nhập tên sản phẩm!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Giá Cả"
                    name="price"
                    rules={[{ required: true, message: 'Hãy nhập giá cả sản phẩm!' }]}
                >
                    <InputNumber />
                </Form.Item>
                <Form.Item
                    label="Số Lượng"
                    name="quantity"
                    rules={[{ required: true, message: 'Hãy nhập số lượng sản phẩm!' }]}
                >
                    <InputNumber />
                </Form.Item>



                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                    <Button type="primary" htmlType="submit">
                        {isEditing ? 'Lưu' : 'Submit'}
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
