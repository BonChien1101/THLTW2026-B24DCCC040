import React, { useEffect, useState } from 'react';
import { Button, Card, Form, Input, message, Select, Space,InputNumber , Table, Tag, TimePicker } from 'antd';
import moment from 'moment';
import type {ColumnsType} from 'antd/es/table';

export type TrangThaiNhanVien = 'Bận' | 'Rảnh' | 'Nghỉ';
export interface CaLamViec{
    id: string;
    ngayTrongTuan: string;
    gioBatDau: string;
    gioKetThuc: string;
}
export interface NhanVien {
    id: string;
    ten: string;
    soDienThoai: string;
    email: string;
    lichLam: CaLamViec[];
    ghiChu?: string;
    soKhachGioiHan: number;
    trangThai: TrangThaiNhanVien;
}
export interface DichVu {
    id: string;
    ten: string;
    gia: number;
    thoiGian: number;
    moTa: string;
}
const STORAGE_KEY_NV = 'nhanVienList';
const STORAGE_KEY_DV = 'dichVuList';

const TrangThaiColor: Record<TrangThaiNhanVien, string> = {
    'Bận': 'red',
    'Rảnh': 'green',
    'Nghỉ': 'gray',
};

const TEN_THU: Record<string, string> = {
    '1': 'Thứ 2',
    '2': 'Thứ 3',
    '3': 'Thứ 4',
    '4': 'Thứ 5',
    '5': 'Thứ 6',
    '6': 'Thứ 7',
    '7': 'Chủ nhật',
};
const QuanLyNhanVienDichVu: React.FC = () => {
    const [formNV] = Form.useForm<NhanVien>();
    const [formDV] = Form.useForm<DichVu>();
    const [dsNhanVien, setDsNhanVien] = useState<NhanVien[]>([]);
    const [dsDichVu, setDsDichVu] = useState<DichVu[]>([]);
    const [editingDV, setEditingDV] = useState<DichVu | null>(null);
    const [editingNV, setEditingNV] = useState<NhanVien | null>(null);

    const loadNhanVien = (): NhanVien[] => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY_NV);
            if (!raw) return [];
            const parsed = JSON.parse(raw) as NhanVien[];
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return [];
        }
    }
    const saveNhanVien = (list: NhanVien[]) => {
        localStorage.setItem(STORAGE_KEY_NV, JSON.stringify(list));
    }
    const loadDichVu = (): DichVu[] => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY_DV);
            if (!raw) return [];
            const parsed = JSON.parse(raw) as DichVu[];
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return []
        }
    }
    const saveDichVu = (list: DichVu[]) => {
        localStorage.setItem(STORAGE_KEY_DV, JSON.stringify(list));
    };
    
    useEffect(() => {
        setDsDichVu(loadDichVu())
        setDsNhanVien(loadNhanVien())
    }, [])

    //crud
     const handeSubmitNhanVien = (values: any) => {
        const caLam: CaLamViec[] = (values.lichLam || []).map((item: any) => ({
            id: item.id || `${Date.now()}-${Math.random().toString(16).slice(2)}`,
            ngayTrongTuan: item.ngayTrongTuan,
            gioBatDau: item.thoiGian?.[0]?.format('HH:mm'),
            gioKetThuc: item.thoiGian?.[1]?.format('HH:mm') ,
        }));
        if (editingNV) {
            const updated: NhanVien = {
                ...editingNV,
                ten: values.ten,
                soDienThoai: values.soDienThoai,
                email: values.email,
                ghiChu: values.ghiChu,
                soKhachGioiHan: values.soKhachGioiHan,
                trangThai: values.trangThai,
                lichLam: caLam,
            };
            const list = dsNhanVien.map((nv) => (nv.id === updated.id ? updated : nv));
            setDsNhanVien(list);
            saveNhanVien(list);
            message.success('Cập nhật nhân viên thành công');
        } else {
            const nv: NhanVien = {
                id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
                ten: values.ten,
                soDienThoai: values.soDienThoai,
                email: values.email,
                ghiChu: values.ghiChu,
                soKhachGioiHan: values.soKhachGioiHan,
                trangThai: values.trangThai,
                lichLam: caLam,
            };
            const list = [...dsNhanVien, nv]
            setDsNhanVien(list);
            saveNhanVien(list);
            message.success('Thêm nhân viên thành công');
        }
        setEditingNV(null);
        formNV.resetFields();
     };
     const handleEditNhanVien = (record: NhanVien) => {
        setEditingNV(record);
        formNV.setFieldsValue({
            ten: record.ten,
            soDienThoai: record.soDienThoai,
            email: record.email,
            ghiChu: record.ghiChu,
            soKhachGioiHan: record.soKhachGioiHan,
            trangThai: record.trangThai,
            lichLam: record.lichLam.map((ca) => ({
                id: ca.id,
                ngayTrongTuan: ca.ngayTrongTuan,
                thoiGian: [
                    moment(ca.gioBatDau, 'HH:mm'),
                    moment(ca.gioKetThuc, 'HH:mm')
                ],
            })),
        });
    };
    const handleDeleteNhanVien = (record: NhanVien) => {
        const list = dsNhanVien.filter((nv) => nv.id !== record.id);
        setDsNhanVien(list);
        saveNhanVien(list);
        message.success('Xóa nhân viên thành công');
    };

//dvu

    const handleSubmitDichVu = (values: any) =>{
        if (editingDV) {
            const updated: DichVu = {
                ...editingDV,
                ten: values.ten,
                gia: values.gia,
                thoiGian: values.thoiGian,
                moTa: values.moTa,
            };
            const list = dsDichVu.map((dv) =>(dv.id === updated.id ? updated : dv));
            
            setDsDichVu(list);
            saveDichVu(list);
            message.success('Cập nhật dịch vụ thành công');
        } else {
            const dv: DichVu = {
                id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
                ten: values.ten,
                gia: values.gia,
                thoiGian: values.thoiGian,
                moTa: values.moTa,
            };
            const list = [...dsDichVu, dv];
            setDsDichVu(list);
            saveDichVu(list);
            message.success('Thêm dịch vụ thành công');
        }
        setEditingDV(null);
        formDV.resetFields();
    };
    const handleEditDichVu = (record: DichVu) => {
        setEditingDV(record);
        formDV.setFieldsValue(record);
    };
    const handleDeleteDichVu = (record: DichVu) => {
        const list = dsDichVu.filter((dv) => dv.id !== record.id);
        setDsDichVu(list);
        saveDichVu(list);
        message.success('Xóa dịch vụ thành công');
    };

//Bang

    const columnsNV: ColumnsType<NhanVien> = [
        {title: 'Tên Nhân Viên', dataIndex: 'ten'},
        {title: 'SĐT',dataIndex: 'soDienThoai'},
        {title: 'Email',dataIndex: 'email'},
        {title: "Số Khách giới hạn/ngày", dataIndex: 'soKhachGioiHan'},
        {title: 'Trạng thái', dataIndex: 'trangThai', render: (v: TrangThaiNhanVien) => <Tag color={TrangThaiColor[v]}>{v}</Tag>},
        {title: 'Lịch làm việc',
            render: (_, record) => 
                record.lichLam.map((ca) => {
                    const tenThu = TEN_THU[String(ca.ngayTrongTuan)] || `Thứ ${ca.ngayTrongTuan}`;
                    return `${tenThu}: ${ca.gioBatDau} - ${ca.gioKetThuc}`;
                }).join('; '),
        },
        {
            title: 'Hành động',
            render: (_,record) => (
                <Space>
                    <Button size="small" onClick= {() => handleEditNhanVien(record)}>Sửa</Button>
                    <Button size="small" danger onClick= {() => handleDeleteNhanVien(record)}>Xóa</Button>
                </Space>
            ),
        },
    ];

    const columnsDV: ColumnsType<DichVu> = [
        {title: "Tên dịch vụ", dataIndex: 'ten'},
        {title: 'Giá (VNĐ)', dataIndex: 'gia',
            render: (v: number) => v.toLocaleString('vi-VN')
        },
        {title: 'Thời gian thực hiện', dataIndex: 'thoiGian'},
        {title: 'Mô tả', dataIndex: 'moTa'},
        {title: 'Hành động',
            render: (_,record) => (
                <Space>
                    <Button size="small" onClick= {() => handleEditDichVu(record)}>Sửa</Button>
                    <Button size="small" danger onClick= {() => handleDeleteDichVu(record)}>Xóa</Button>
                </Space>
            ),
        },
    ];
    return (
        <Space direction='vertical' style={{width: '100%'}} size="large">
            <Card
                title= {editingNV ? 'Sửa nhân viên':'Thêm nhân viên'}
                extra= {
                    editingNV && (
                        <Button onClick={() => {
                            setEditingNV(null);
                            formNV.resetFields();
                        }}>Thêm mới</Button>
                    )
                }
            >
                <Form form= {formNV} layout='vertical' onFinish={handeSubmitNhanVien}>
                    <Form.Item name= 'ten' label='Tên nhân viên' rules={[{required: true, message: 'Vui lòng nhập tên nhân viên'}]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name= 'soDienThoai' label='SĐT' rules={[{required: true, message: 'Vui lòng nhập số điện thoại'},
                        {pattern: /^[0-9]{10}$/, message: 'SĐT không hợp lệ'}
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item name= 'email' label='Email' rules={[{required: true, message: 'Vui lòng nhập email'},
                        {type: 'email', message: 'Email không hợp lệ'}
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="soKhachGioiHan"
                    label="Số khách giới hạn/ngày"
                    rules={[{ required: true, message: 'Nhập số khách giới hạn' }]}
                >
                    <InputNumber min={1} style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item
                    name="trangThai"
                    label="Trạng thái"
                    rules={[{ required: true, message: 'Chọn trạng thái' }]}
                >
                    <Select>
                    <Select.Option value="Rảnh">Rảnh</Select.Option>
                    <Select.Option value="Bận">Bận</Select.Option>
                    <Select.Option value="Nghỉ">Nghỉ</Select.Option>
                    </Select>
                </Form.Item>

                <Form.List name="lichLam">
                    {(fields, { add, remove }) => (
                        <>
                        <Space direction="vertical" style={{ width: '100%' }}>
                        {fields.map((field) => (
                            <Space
                            key={field.key}
                            style={{ display: 'flex', marginBottom: 8 }}
                            align="baseline"
                            >
                            <Form.Item
                                {...field}
                                name={[field.name, 'ngayTrongTuan']}
                                fieldKey={[field.fieldKey!, 'ngayTrongTuan']}
                                label="Ngày trong tuần"
                                rules={[
                                {
                                    required: true,
                                    message: 'Chọn ngày trong tuần',
                                },
                                ]}
                            >
                                <Select style={{ width: 150 }}>
                                <Select.Option value={1}>Thứ 2</Select.Option>
                                <Select.Option value={2}>Thứ 3</Select.Option>
                                <Select.Option value={3}>Thứ 4</Select.Option>
                                <Select.Option value={4}>Thứ 5</Select.Option>
                                <Select.Option value={5}>Thứ 6</Select.Option>
                                <Select.Option value={6}>Thứ 7</Select.Option>
                                <Select.Option value={7}>Chủ nhật</Select.Option>
                                </Select>
                            </Form.Item>

                            <Form.Item
                                {...field}
                                name={[field.name, 'thoiGian']}
                                fieldKey={[field.fieldKey!, 'thoiGian']}
                                label="Thời gian"
                                rules={[
                                {
                                    required: true,
                                    message: 'Chọn khoảng thời gian',
                                },
                                ]}
                            >
                                <TimePicker.RangePicker format="HH:mm" />
                            </Form.Item>

                            <Button danger onClick={() => remove(field.name)}>
                                Xóa
                            </Button>
                            </Space>
                        ))}
                        <Button type="dashed" onClick={() => add()}>
                            Thêm ca làm việc
                        </Button>
                        </Space>
                    </>
                    )}
                </Form.List>
                <Form.Item name="ghiChu" label="Ghi chú">
                    <Input.TextArea rows={3} />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        {editingNV ? 'Lưu thay đổi' : 'Thêm nhân viên'}
                    </Button>
                </Form.Item>
                </Form>
            </Card>
            <Card title="Danh sách nhân viên">
                <Table rowKey="id" columns={columnsNV} dataSource={dsNhanVien} />
            </Card>
            <Card
                title={editingDV ? 'Sửa dịch vụ' : 'Thêm dịch vụ'}
                extra={
                editingDV && (
                    <Button
                    onClick={() => {
                        setEditingDV(null);
                        formDV.resetFields();
                    }}
                    >
                    Thêm mới
                    </Button>
                )
                }
                >
                <Form form={formDV} layout="vertical" onFinish={handleSubmitDichVu}>
                <Form.Item
                    name="ten"
                    label="Tên dịch vụ"
                    rules={[{ required: true, message: 'Nhập tên dịch vụ' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="gia"
                    label="Giá (VND)"
                    rules={[{ required: true, message: 'Nhập giá' }]}
                >
                    <InputNumber min={0} style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item
                    name="thoiGianThucHien"
                    label="Thời gian thực hiện (phút)"
                    rules={[{ required: true, message: 'Nhập thời gian thực hiện' }]}
                >
                    <InputNumber min={1} style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item name="moTa" label="Mô tả">
                    <Input.TextArea rows={3} />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                    {editingDV ? 'Lưu thay đổi' : 'Thêm dịch vụ'}
                    </Button>
                </Form.Item>
                </Form>
            </Card>

            <Card title="Danh sách dịch vụ">
                <Table rowKey="id" columns={columnsDV} dataSource={dsDichVu} />
            </Card>                    


        </Space>

    )
}
export default QuanLyNhanVienDichVu;    