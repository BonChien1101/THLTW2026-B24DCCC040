import { useState } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, message, Popconfirm, } from 'antd';
import { useModel, } from 'umi';
//Tabs dùng cho cùng trang, menu + layout + routing Link của umiJS dùng cho 2 trang riêng antd.
export default () => {
    const {dataSource, setDataSource} = useModel('danhsachsanpham');
    const [open,setOpen] = useState(false);
    const [isEditing,setIsEditing] = useState(false);
    const [addForm] = Form.useForm();
    const [editForm] = Form.useForm();
    const handleCancelConfirm = (e?: React.MouseEvent<HTMLElement>) => {
        if (e) console.log(e);
        message.info('Đã hủy');
    };

    const columns = [
        {
            title: 'STT',
            dataIndex: 'id',
            key: 'id',
            width: 50,
            align: 'center',
        },
        {
            title: 'Tên Sản Phẩm',
            dataIndex: 'name',
            key: 'name',
            width: 200,
        },
        {
            title: 'Danh Mục',
            dataIndex: 'category',
            key: 'category',
            width: 200,
        },
        {
            title: 'Giá Cả',
            dataIndex: 'price',
            key: 'price',
            width: 200,
            align: 'center',
        },
        {
            title: 'Số Lượng Tồn Kho',
            dataIndex: 'quantity',
            key: 'quantity',
            align: 'center',
            width: 100,
        },
        {
            title: 'Trạng Thái',
            dataIndex: 'status',
            key: 'status',
            width: 200,
            align: 'center',
            render: (_: any, record: any) => {
            const qty = Number(record.quantity) || 0; // || 0 là giá trị mặc định nếu không có số lượng
            if (qty === 0 ) return <span style={{color:'red',}}><strong>Hết Hàng</strong></span>;
            if (qty <= 10) return <span style={{color:'orange'}}><strong>Sắp Hết Hàng</strong></span>;
            return <span style={{color:'green'}}><strong>Còn Hàng</strong></span>;
            },
        },
        {
            title: 'Thao Tác',
            key: 'action',
            width: 200,
            align: 'center',
            render: (_: any, record: any) => (
                <>
                    <Button
                        type="primary"
                        onClick={() => {
                            setIsEditing(true);
                            editForm.setFieldsValue({ ...record });
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
        <Button style={{marginBottom: 12}} type="primary" onClick={() => setOpen(true)}>
                Thêm Sản Phẩm
            </Button>      
            <Modal
                title="Thêm Sản Phẩm Mới"
                visible={open}
                onCancel={() => setOpen(false)}
                footer={null}
                destroyOnClose
            >
                <Form
                form={addForm}
                name="basic"
                onFinish={(formValues)=>{
                    setDataSource([...dataSource, { id: Date.now(), ...formValues }]);
                    setOpen(false); addForm.resetFields();
                    message.success('Thêm Sản Phẩm Thành Công!');
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
                    rules={[{ required: true, message: 'Hãy nhập giá cả sản phẩm!' },
                        {type:'number', message: 'Giá cả phải là số!'},
                        { type: 'number', min: 0, message: 'Giá cả phải là số dương!' },
                        {
                            validator: async (_,_value) =>  Promise.resolve(),
                        }
                    ]}
                >
                    <InputNumber />
                </Form.Item>
                <Form.Item
                    label="Số Lượng"
                    name="quantity"
                    rules={[{ required: true, message: 'Hãy nhập số lượng sản phẩm!' },
                        {type:'number', message: 'Số lượng phải là số!'},
                        { type: 'number', min: 0, message: 'Số lượng phải là số dương!' },
                        {
                            validator:  (_,_value) => {if (Number.isInteger(_value)) return Promise.resolve(); return Promise.reject(new Error('Số lượng phải là số nguyên!'));},
                        }
                    ]}
                >
                    <InputNumber />
                </Form.Item>



                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                    <Button type="primary" htmlType="submit">
                    Thêm
                    </Button>
                </Form.Item>
                </Form>
            </Modal>
            <Modal
                title="Chỉnh Sửa Sản Phẩm"
                visible={isEditing}
                onCancel={() => { setIsEditing(false); editForm.resetFields(); }}
                footer={null}
                destroyOnClose
            >
                <Form
                    form={editForm}
                    name="edit"
                    onFinish={(formValues) => {
                        const updatedDataSource = dataSource.map((item) =>
                            item.id === formValues.id ? { ...item, ...formValues } : item
                        );
                        setDataSource(updatedDataSource);
                        setIsEditing(false);
                        editForm.resetFields();
                        message.success('Chỉnh Sửa Sản Phẩm Thành Công!');
                    }}

                    autoComplete="off"
                >   
                    <Form.Item name='id' hidden></Form.Item>
                    <Form.Item
                        label="Tên Sản Phẩm"
                        name="name"
                        rules={[{ required: true, message: 'Hãy nhập tên sản phẩm!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item label="Danh Mục" name="category" rules={[{ required: true, message: 'Hãy nhập danh mục sản phẩm!' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Giá Cả"
                        name="price"
                        rules={[{ required: true, message: 'Hãy nhập giá cả sản phẩm!' },
                            {type:'number', message: 'Giá cả phải là số!'},
                            { type: 'number', min: 0, message: 'Giá cả phải là số dương!' },
                            {
                                validator: async (_,_value) =>  Promise.resolve(),
                            }
                        ]}
                    >
                        <InputNumber />
                    </Form.Item>
                    <Form.Item
                        label="Số Lượng Tồn Kho"
                        name="quantity"
                        rules={[{ required: true, message: 'Hãy nhập số lượng sản phẩm!' },
                            {type:'number', message: 'Số lượng phải là số!'},
                            { type: 'number', min: 0, message: 'Số lượng phải là số dương!' },
                            {
                                validator:  (_,_value) => {if (Number.isInteger(_value)) return Promise.resolve(); return Promise.reject(('Số lượng phải là số nguyên!'));},
                            }
                        ]}
                    >
                        <InputNumber />
                    </Form.Item>

                    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                        <Button type="primary" htmlType="submit">
                            Sửa
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        <Table
        rowKey="id"
        columns={columns as any}
        dataSource={dataSource} 
        pagination={{ pageSize: 5 }}
        />
        </>
    );
}
