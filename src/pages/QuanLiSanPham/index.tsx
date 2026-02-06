import { useMemo, useState } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, message, Popconfirm, Select, Slider, Space} from 'antd';
import { useModel, } from 'umi';

//Tabs dùng cho cùng trang, menu + layout + routing Link của umiJS dùng cho 2 trang riêng antd.
export default () => {
    const {dataSource, setDataSource} = useModel('danhsachsanpham');
    const [open,setOpen] = useState(false);
    const [isEditing,setIsEditing] = useState(false);
    const [addForm] = Form.useForm();
    const [editForm] = Form.useForm();
    const [searchText, setSearchText] = useState('');
    const handleCancelConfirm = (e?: React.MouseEvent<HTMLElement>) => {
        if (e) console.log(e);
        message.info('Đã hủy');
    };
    const [locDanhMuc, setLocDanhMuc] = useState<string | undefined>(undefined);
    const [locGiaCa, setLocGiaCa] = useState<[number, number]>([0, 100000000]);
    const [locTrangThai, setLocTrangThai] = useState<string | undefined>(undefined);
    // laay dsach du lieu loc
    const DSDanhMuc = useMemo(() => {
        const set = new Set<string>();
        (dataSource || []).forEach((item:any) => {
            if (item.category) {
                set.add(String(item.category));
            }
        });
        return Array.from(set).map(item => ({ label: item, value: item }));
    }, [dataSource]);

    const DataSauLoc = useMemo(() => {
        return (dataSource || []).filter((item: any) => {
            const matchSearch = item.name.toLowerCase().includes(searchText.trim().toLowerCase());
            const matchCategory = locDanhMuc ? item.category === locDanhMuc : true;
            const matchPrice = item.price >= locGiaCa[0] && item.price <= locGiaCa[1];
            const qty = Number(item.quantity) || 0;
            const matchQty = qty === 0 ? 'Hết Hàng' : qty <= 10 ? 'Sắp Hết Hàng' : 'Còn Hàng';
            const matchStatus = locTrangThai ? matchQty === locTrangThai : true;
            return matchCategory && matchPrice && matchStatus && matchSearch ;
        });
    }, [dataSource,searchText, locDanhMuc, locGiaCa, locTrangThai]
    );
      // sap xep
    const sortAZ = () => {
    if (Array.isArray(dataSource)) {
      const sorted = [...dataSource].sort((a, b) => (a.name).localeCompare((b.name)));
      setDataSource(sorted);
    }
    };
    const sortZA = () => {
    if (Array.isArray(dataSource)) {
      const sorted = [...dataSource].sort((a, b) => (b.name).localeCompare((a.name)));
      setDataSource(sorted);
    }
    };
    const sortPriceAsc = () => {
    if (Array.isArray(dataSource)) {
      const sorted = [...dataSource].sort((a, b) => (a.price - b.price));
      setDataSource(sorted);
    }
    };
    const sortPriceDesc = () => {
    if (Array.isArray(dataSource)) {
      const sorted = [...dataSource].sort((a, b) => (b.price - a.price));
      setDataSource(sorted);
    }
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
            <Input.Search
                placeholder="Tìm kiếm sản phẩm"
                onSearch={value => setSearchText(value)}
                onChange={e => setSearchText(e.target.value)} //auto render
                style={{ width: 300, marginBottom: 12 }}
            />
            <Select
                defaultValue="loctheodanhmuc"
                allowClear
                style={{ width: 200, marginRight: 12, marginBottom:  12 }}
                onChange={val => setLocDanhMuc(val)}
                options={DSDanhMuc}
                showSearch
                optionFilterProp='label'
                />
            <div style={{ width: 300, display: 'inline-block', marginBottom: 12, marginRight: 12 }}>
                <div style={{marginBottom: 4}}>Lọc Theo Giá Cả:{locGiaCa[0].toLocaleString('vi-VN')} đ - {locGiaCa[1].toLocaleString('vi-VN')} đ</div>
                <Slider
                    range
                    min={0}
                    max={100000000}
                    step={10000}
                    value={locGiaCa}
                    onChange={(values: [number,number]) => setLocGiaCa(values)}
                />
            </div>

            <Select 
                allowClear
                placeholder='Lọc theo trạng thái'
                style={{ width: 200, marginRight: 12, marginBottom: 12 }}
                value={locTrangThai}
                onChange={val => setLocTrangThai(val)}
                options={[
                    { label: 'Còn Hàng', value: 'Còn Hàng' },
                    { label: 'Hết Hàng', value: 'Hết Hàng' },
                    { label: 'Sắp Hết Hàng', value: 'Sắp Hết Hàng' },
                ]}
            />
            <Space>
                <Select
                    defaultValue="Sắp xếp A-Z"
                    onChange={val => {
                        switch (val) {
                            case "Sắp xếp A-Z":
                                sortAZ();
                                break;
                            case "Sắp xếp Z-A":
                                sortZA();
                                break;
                            case "Giá tăng dần":
                                sortPriceAsc();
                                break;
                            case "Giá giảm dần":
                                sortPriceDesc();
                                break;
                            default:
                                break;
                        }
                    }}
                    style={{ width: 120 }}
                    options={[
                        { label: 'Sắp xếp A-Z', value: 'Sắp xếp A-Z' },
                        { label: 'Sắp xếp Z-A', value: 'Sắp xếp Z-A' },
                        { label: 'Giá tăng dần', value: 'Giá tăng dần' },
                        { label: 'Giá giảm dần', value: 'Giá giảm dần' },
                    ]}
                />
            </Space>
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
        dataSource={DataSauLoc}
        pagination={{ pageSize: 5 }}
        />
        </>
    );
}
