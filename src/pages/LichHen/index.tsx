import React, { useEffect, useMemo, useState } from 'react';
import { Button, Card, DatePicker, Form, Input, message, Select, Space, Table, Tag, TimePicker, Alert } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import moment from 'moment';

export type TrangThaiLichHen = 'Chờ duyệt' | 'Xác nhận' | 'Hoàn thành' | 'Hủy';

export interface LichHen {
  id: string;
  tenKhachHang: string;
  soDienThoai: string;
  maDichVu: string;
  maNhanVien: string;
  ngay: string;
  gioBatDau: string;
  gioKetThuc: string;
  trangThai: TrangThaiLichHen;
  ghiChu?: string;
}

interface CaLamViec {
    id: string;
    ngayTrongTuan: string; // 1-7 (string) như bên trang quản lý
    gioBatDau: string; // 'HH:mm'
    gioKetThuc: string; // 'HH:mm'
}

interface NhanVienDatLich {
    id: string;
    ten: string;
    lichLam?: CaLamViec[];
}

const mauTrangThai: Record<TrangThaiLichHen, string> = {
  'Chờ duyệt': 'gold',
  'Xác nhận': 'blue',
  'Hoàn thành': 'green',
  'Hủy': 'red',
};


const STORAGE_KEY = 'lichHenList';

const LichHenPage: React.FC = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [duLieu, setDuLieu] = useState<LichHen[]>([]);
    const [ngayLoc, setNgayLoc] = useState<string | undefined>(moment().format('YYYY-MM-DD'));
    const [danhSachLichHen, setDanhSachLichHen] = useState<LichHen[]>([]);
    const [danhSachDichVu, setDanhSachDichVu] = useState<{ id: string; ten: string }[]>([]);
    const [danhSachNhanVien, setDanhSachNhanVien] = useState<NhanVienDatLich[]>([]);
    const loadFromStorage = () => {
    if (typeof window === 'undefined') return [];
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return [];
        const parsed: LichHen[] = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
        console.error('Lỗi đọc localStorage:', e);
        return [];
    }
    };
    const saveToStorage = (data: LichHen[]) => {
        if (typeof window === 'undefined') return;
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } catch (e) {
            console.error('Lỗi ghi localStorage:', e);
        }
    };

    const loadServicesFromStorage = () => {
        try {
            const raw = localStorage.getItem('dichVuList');
            if (!raw) return [] as { id: string; ten: string }[];
            const parsed = JSON.parse(raw) as { id: string; ten: string }[];
            return Array.isArray(parsed) ? parsed : ([] as { id: string; ten: string }[]);
        } catch (e) {
            console.error('Lỗi đọc dichVuList từ localStorage:', e);
            return [] as { id: string; ten: string }[];
        }
    };

    const loadStaffFromStorage = () => {
        try {
            const raw = localStorage.getItem('nhanVienList');
            if (!raw) return [] as NhanVienDatLich[];
            const parsed = JSON.parse(raw) as NhanVienDatLich[];
            return Array.isArray(parsed) ? parsed : ([] as NhanVienDatLich[]);
        } catch (e) {
            console.error('Lỗi đọc nhanVienList từ localStorage:', e);
            return [] as NhanVienDatLich[];
        }
    };

    const [staffId, setStaffId] = useState<string | undefined>(undefined);
    const [ngayHen, setNgayHen] = useState<moment.Moment | null>(null);

    const caLamHopLe = useMemo(() => {
        if (!staffId || !ngayHen) return [] as CaLamViec[];
        const nv = danhSachNhanVien.find((n) => n.id === staffId);
        if (!nv || !nv.lichLam || !Array.isArray(nv.lichLam)) return [] as CaLamViec[];
        const dayOfWeek = ngayHen.isoWeekday(); // 1-7 (Mon-Sun)
        return nv.lichLam.filter((ca) => String(ca.ngayTrongTuan) === String(dayOfWeek));
    }, [staffId, ngayHen, danhSachNhanVien]);

    const fetchData = () => {
        setLoading(true);
        const filtered = danhSachLichHen.filter((lich) => {
            if (ngayLoc && lich.ngay !== ngayLoc) return false;
            return true;
        });
        setDuLieu(filtered);
        setLoading(false);
    };

    useEffect(() => {
        const ds = loadFromStorage();
        setDanhSachLichHen(ds);
    const dv = loadServicesFromStorage();
    setDanhSachDichVu(dv);
    const nv = loadStaffFromStorage();
    setDanhSachNhanVien(nv);
    }, []);

    useEffect(() => {
        fetchData();
    }, [ngayLoc, danhSachLichHen]);

    const handleCreate = async (values: any) => {
        const ngay = values.date.format('YYYY-MM-DD');
        const gioBatDau = values.time.format('HH:mm');
        const gioKetThuc = moment(values.time).add(1, 'hour').format('HH:mm');
        //ktra gio lam nv
        const nv = danhSachNhanVien.find((n) => n.id === values.staffId);
        if (nv && Array.isArray(nv.lichLam) && nv.lichLam.length > 0) {
            const dayOfWeek = values.date.isoWeekday();
            const caTrongNgay = nv.lichLam.filter((ca) => String(ca.ngayTrongTuan) === String(dayOfWeek));
            if (caTrongNgay.length === 0) {
                message.error('Nhân viên này không làm việc trong ngày đã chọn');
                return;
            }
            const isInShift = caTrongNgay.some((ca) => {
                return (
                    gioBatDau >= ca.gioBatDau &&
                    gioBatDau < ca.gioKetThuc
                );
            });
            if (!isInShift) {
                message.error('Giờ bắt đầu không nằm trong ca làm việc của nhân viên');
                return;
            }
        }

        const lichHenMoi: LichHen = {
        id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        tenKhachHang: values.customerName,
        soDienThoai: values.customerPhone,
        maDichVu: values.serviceId,
        maNhanVien: values.staffId,
        ngay,
        gioBatDau,
        gioKetThuc,
        trangThai: 'Chờ duyệt',
        ghiChu: values.note,
        };

        const conflict = danhSachLichHen.some((lich) => {
            if (lich.maNhanVien !== lichHenMoi.maNhanVien || lich.ngay !== lichHenMoi.ngay) return false;
            return lich.gioBatDau < lichHenMoi.gioKetThuc && lichHenMoi.gioBatDau < lich.gioKetThuc;
        });

        if (conflict) {
            message.error('Lịch hẹn bị trùng với lịch khác của nhân viên này');
            return;
        }

        const newList = [...danhSachLichHen, lichHenMoi];
    setDanhSachLichHen(newList);
    saveToStorage(newList);
    setNgayLoc(ngay);
    message.success('Đặt lịch thành công');
    form.resetFields();
    };

    const handleChangeStatus = (lich: LichHen, trangThai: TrangThaiLichHen) => {
    const newList = danhSachLichHen.map((item) => (item.id === lich.id ? { ...item, trangThai } : item));
    setDanhSachLichHen(newList);
    saveToStorage(newList);
    message.success('Cập nhật trạng thái thành công');
    };

    const columns: ColumnsType<LichHen> = [
        {
        title: 'Khách hàng',
        dataIndex: 'tenKhachHang',
        },
        {
        title: 'SĐT',
        dataIndex: 'soDienThoai',
        },
        {
        title: 'Dịch vụ',
        dataIndex: 'maDichVu',
        render: (ma: string) => {
            const dv = danhSachDichVu.find((d) => d.id === ma);
            return dv ? dv.ten : ma;
        },
        },
        {
        title: 'Nhân viên',
        dataIndex: 'maNhanVien',
        render: (ma: string) => {
            const nv = danhSachNhanVien.find((n) => n.id === ma);
            return nv ? nv.ten : ma;
        },
        },
        {
        title: 'Ngày',
    dataIndex: 'ngay',
        },
        {
        title: 'Giờ',
    render: (_, r) => `${r.gioBatDau} - ${r.gioKetThuc}`,
        },
        {
        title: 'Trạng thái',
    dataIndex: 'trangThai',
    render: (v: TrangThaiLichHen) => <Tag color={mauTrangThai[v]}>{v}</Tag>,
        },
        {
        title: 'Hành động',
    render: (_, record) => (
            <Space>
            {record.trangThai === 'Chờ duyệt' && (
                <>
                <Button size="small" onClick={() => handleChangeStatus(record, 'Xác nhận')}>
                    Xác nhận
                </Button>
                <Button size="small" danger onClick={() => handleChangeStatus(record, 'Hủy')}>
                    Hủy
                </Button>
                </>
            )}
            {record.trangThai === 'Xác nhận' && (
                <Button size="small" type="primary" onClick={() => handleChangeStatus(record, 'Hoàn thành')}>
                Hoàn thành
                </Button>
            )}
            </Space>
        ),
        },
    ];

    return (
        <Space direction="vertical" style={{ width: '100%' }} size="large">
        <Card title="Đặt lịch hẹn mới">
            <Form form={form} layout="vertical" onFinish={handleCreate}>
            <Form.Item
                name="customerName"
                label="Tên khách hàng"
                rules={[
                    { required: true, message: 'Vui lòng nhập tên khách hàng' },
                    { min: 2, message: 'Tên phải có ít nhất 2 ký tự' },
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                name="customerPhone"
                label="Số điện thoại"
                rules={[
                    { required: true, message: 'Vui lòng nhập số điện thoại' },
                    {
                        pattern: /^(0|\+84)[0-9]{8,9}$/,
                        message: 'Số điện thoại không hợp lệ',
                    },
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                name="serviceId"
                label="Dịch vụ"
                rules={[{ required: true, message: 'Vui lòng chọn dịch vụ' }]}
            >
                <Select placeholder="Chọn dịch vụ">
                    {danhSachDichVu.map((dv) => (
                        <Select.Option key={dv.id} value={dv.id}>
                            {dv.ten}
                        </Select.Option>
                    ))}
                </Select>
            </Form.Item>
            <Form.Item
                name="staffId"
                label="Nhân viên"
                rules={[{ required: true, message: 'Vui lòng chọn nhân viên' }]}
            > 
                <Select
                    placeholder="Chọn nhân viên"
                    onChange={(value) => setStaffId(value)}
                >
                    {danhSachNhanVien.map((nv) => (
                        <Select.Option key={nv.id} value={nv.id}>
                            {nv.ten}
                        </Select.Option>
                    ))}
                </Select>
            </Form.Item>
            <Form.Item
                name="date"
                label="Ngày"
                rules={[{ required: true, message: 'Vui lòng chọn ngày' }]}
            > 
                <DatePicker
                    format="YYYY-MM-DD"
                    onChange={(d) => setNgayHen(d)}
                />
            </Form.Item>
            {staffId && ngayHen && (
                <Form.Item label="Ca làm việc trong ngày">
                    {caLamHopLe.length > 0 ? (
                        <Space direction="vertical">
                            {caLamHopLe.map((ca) => (
                                <Alert
                                    key={ca.id}
                                    type="info"
                                    showIcon
                                    message={`Ca: ${ca.gioBatDau} - ${ca.gioKetThuc}`}
                                />
                            ))}
                        </Space>
                    ) : (
                        <Alert
                            type="warning"
                            showIcon
                            message="Nhân viên không có ca làm việc trong ngày này"
                        />
                    )}
                </Form.Item>
            )}
            <Form.Item
                name="time"
                label="Giờ bắt đầu"
                rules={[
                    { required: true, message: 'Vui lòng chọn giờ bắt đầu' }]}
            > 
                <TimePicker format="HH:mm" />
            </Form.Item>
            <Form.Item name="note" label="Ghi chú">
                <Input.TextArea rows={3} />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit">
                Đặt lịch
                </Button>
            </Form.Item>
            </Form>
        </Card>

        <Card
            title="Danh sách lịch hẹn"
            extra={
            <DatePicker
        value={ngayLoc ? moment(ngayLoc) : undefined}
        onChange={(d) => setNgayLoc(d ? d.format('YYYY-MM-DD') : undefined)}
                format="YYYY-MM-DD"
            />
            }
        >
        <Table rowKey="id" loading={loading} columns={columns} dataSource={duLieu} />
        </Card>
        </Space>
    );
};

export default LichHenPage;
