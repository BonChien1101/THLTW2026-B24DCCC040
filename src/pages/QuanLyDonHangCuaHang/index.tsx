import React, { useEffect, useMemo, useState } from "react";
import { Button, Form, Input, InputNumber, Modal, Popconfirm, Select, Space, Table, Tag, Typography, message, DatePicker } from "antd";
import moment from "moment";

type TrangThaiDonHang = "CHO_XAC_NHAN" | "DANG_GIAO" | "HOAN_THANH" | "HUY";

interface SanPhamTrongDon {
    id: string;
    ten: string;
    gia: number;
}

interface SanPhamChonTrongDon extends SanPhamTrongDon {
    soLuong: number;
}

interface KhachHang {
    id: string;
    ten: string;
}
interface DonHang {
    id: string;
    maDonHang: string;
    khachHangId: string;
    ngayDat: string;
    trangThai: TrangThaiDonHang;
    sanPham: SanPhamChonTrongDon[];
    tongTien: number;
}

const DANH_SACH_KHACH_HANG: KhachHang[] = [
    { id: "kh1", ten: "Nguyễn Văn An" },
    { id: "kh2", ten: "Trần Thị Bình" },
    { id: "kh3", ten: "Lê Hoàng Cường" },
    { id: "kh4", ten: "Phạm Minh Đức" },
    { id: "kh5", ten: "Võ Thảo Em" },
];

const DANH_SACH_SAN_PHAM: SanPhamTrongDon[] = [
    { id: "sp1", ten: "Áo thun nam", gia: 150000 },
    { id: "sp2", ten: "Áo sơ mi nữ", gia: 250000 },
    { id: "sp3", ten: "Quần jean", gia: 350000 },
    { id: "sp4", ten: "Giày thể thao", gia: 500000 },
    { id: "sp5", ten: "Balo laptop", gia: 450000 },
];

const MAP_TRANG_THAI: Record<TrangThaiDonHang, { nhan: string; mau: string }> = {
    CHO_XAC_NHAN: { nhan: "Chờ xác nhận", mau: "gold" },
    DANG_GIAO: { nhan: "Đang giao", mau: "blue" },
    HOAN_THANH: { nhan: "Hoàn thành", mau: "green" },
    HUY: { nhan: "Hủy", mau: "red" },
};

const KHOA_LOCAL_STORAGE = "quan_ly_don_hang_cua_hang";

const DU_LIEU_DON_HANG_MAU: DonHang[] = [
    {
        id: "dh1",
        maDonHang: "DH0001",
        khachHangId: "kh1",
        ngayDat: new Date().toISOString(),
        trangThai: "CHO_XAC_NHAN",
        sanPham: [
        { ...DANH_SACH_SAN_PHAM[0], soLuong: 2 },
        { ...DANH_SACH_SAN_PHAM[2], soLuong: 1 },
        ],
        tongTien: DANH_SACH_SAN_PHAM[0].gia * 2 + DANH_SACH_SAN_PHAM[2].gia * 1,
    },
    {
        id: "dh2",
        maDonHang: "DH0002",
        khachHangId: "kh2",
        ngayDat: new Date(Date.now() - 3600 * 1000 * 5).toISOString(),
        trangThai: "DANG_GIAO",
        sanPham: [{ ...DANH_SACH_SAN_PHAM[3], soLuong: 1 }],
        tongTien: DANH_SACH_SAN_PHAM[3].gia * 1,
    },
    {
        id: "dh3",
        maDonHang: "DH0003",
        khachHangId: "kh3",
        ngayDat: new Date(Date.now() - 3600 * 1000 * 24).toISOString(),
        trangThai: "HOAN_THANH",
        sanPham: [
        { ...DANH_SACH_SAN_PHAM[1], soLuong: 1 },
        { ...DANH_SACH_SAN_PHAM[4], soLuong: 1 },
        ],
        tongTien: DANH_SACH_SAN_PHAM[1].gia + DANH_SACH_SAN_PHAM[4].gia,
    },
    {
        id: "dh4",
        maDonHang: "DH0004",
        khachHangId: "kh4",
        ngayDat: new Date(Date.now() - 3600 * 1000 * 48).toISOString(),
        trangThai: "HUY",
        sanPham: [{ ...DANH_SACH_SAN_PHAM[0], soLuong: 1 }],
        tongTien: DANH_SACH_SAN_PHAM[0].gia,
    },
    {
        id: "dh5",
        maDonHang: "DH0005",
        khachHangId: "kh5",
        ngayDat: new Date(Date.now() - 3600 * 1000 * 2).toISOString(),
        trangThai: "CHO_XAC_NHAN",
        sanPham: [
        { ...DANH_SACH_SAN_PHAM[2], soLuong: 2 },
        { ...DANH_SACH_SAN_PHAM[3], soLuong: 1 },
        ],
        tongTien: DANH_SACH_SAN_PHAM[2].gia * 2 + DANH_SACH_SAN_PHAM[3].gia,
    },
];

const taoMaDonHang = (soThuTu: number) => { //tao ma don hang tu dong
    return `DH${soThuTu.toString().padStart(4, "0")}`;
};

const tinhTongTien = (sanPham: SanPhamChonTrongDon[]) => {
    return sanPham.reduce((tong, item) => tong + item.gia * item.soLuong, 0);
};

const QuanLyDonHangCuaHang: React.FC = () => {
    const [danhSachDonHang, setDanhSachDonHang] = useState<DonHang[]>([]);
    const [tuKhoaTimKiem, setTuKhoaTimKiem] = useState("");
    const [trangThaiLoc, setTrangThaiLoc] = useState<TrangThaiDonHang | "">("");
    const [tieuChiSapXep, setTieuChiSapXep] = useState<"ngayDat" | "tongTien">("ngayDat");
    const [moModalDonHang, setMoModalDonHang] = useState(false);
    const [donHangDangChinhSua, setDonHangDangChinhSua] = useState<DonHang | null>(null);
    const [tongTienTamTinh, setTongTienTamTinh] = useState(0);
    const [form] = Form.useForm();

    useEffect(() => {
        const duLieu = localStorage.getItem(KHOA_LOCAL_STORAGE);
        if (duLieu) {
        try {
            const parsed: DonHang[] = JSON.parse(duLieu);
            setDanhSachDonHang(parsed);
        } catch {
            setDanhSachDonHang(DU_LIEU_DON_HANG_MAU);
        }
        } else {
        setDanhSachDonHang(DU_LIEU_DON_HANG_MAU);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem(KHOA_LOCAL_STORAGE, JSON.stringify(danhSachDonHang));
    }, [danhSachDonHang]);

    const danhSachDonHangHienThi = useMemo(() => {
        let ds = [...danhSachDonHang];
        if (tuKhoaTimKiem.trim()) {
        const tuKhoa = tuKhoaTimKiem.trim().toLowerCase();
        ds = ds.filter((don) => {
            const khachHang = DANH_SACH_KHACH_HANG.find((k) => k.id === don.khachHangId)?.ten.toLowerCase() || "";
            return don.maDonHang.toLowerCase().includes(tuKhoa) || khachHang.includes(tuKhoa);
        });
        }
        if (trangThaiLoc) {
        ds = ds.filter((don) => don.trangThai === trangThaiLoc);
        }
        ds.sort((a, b) => {
        if (tieuChiSapXep === "ngayDat") {
            return new Date(b.ngayDat).getTime() - new Date(a.ngayDat).getTime();
        }
        return b.tongTien - a.tongTien;
        });
        return ds;
    }, [danhSachDonHang, tuKhoaTimKiem, trangThaiLoc, tieuChiSapXep]);

    const moModalThemMoi = () => {
        setDonHangDangChinhSua(null);
        form.resetFields();
    form.setFieldsValue({ ngayDat: moment(), trangThai: "CHO_XAC_NHAN", sanPham: [] });
    setTongTienTamTinh(0);
        setMoModalDonHang(true);
    };

    const moModalChinhSua = (don: DonHang) => {
        setDonHangDangChinhSua(don);
        form.setFieldsValue({
        khachHangId: don.khachHangId,
    ngayDat: moment(don.ngayDat),
        trangThai: don.trangThai,
        sanPham: don.sanPham.map((sp) => ({ id: sp.id, soLuong: sp.soLuong })),
        });
        setTongTienTamTinh(don.tongTien);
        setMoModalDonHang(true);
    };

    const capNhatTongTienTamTinh = () => {
        const giaTri = form.getFieldsValue();
        const sanPhamChon: SanPhamChonTrongDon[] = (giaTri.sanPham || [])
        .filter((item: { id?: string; soLuong?: number }) => item && item.id && item.soLuong)
        .map((item: { id: string; soLuong: number }) => {
            const sp = DANH_SACH_SAN_PHAM.find((s) => s.id === item.id)!;
            return { ...sp, soLuong: item.soLuong };
        });
        const tong = tinhTongTien(sanPhamChon);
        setTongTienTamTinh(tong);
    };

    const xuLyLuuDonHang = () => {
        form
        .validateFields()
        .then((values) => {
            const thoiGianDat: string = values.ngayDat
            ? values.ngayDat.toDate().toISOString()
            : new Date().toISOString();
            const sanPhamChon: SanPhamChonTrongDon[] = (values.sanPham || []).map((item: { id: string; soLuong: number }) => {
            const sp = DANH_SACH_SAN_PHAM.find((s) => s.id === item.id)!;
            return { ...sp, soLuong: item.soLuong };
            });
            const tongTien = tinhTongTien(sanPhamChon);
            if (!sanPhamChon.length) {
            message.error("Đơn hàng phải có ít nhất 1 sản phẩm");
            return;
            }
            if (donHangDangChinhSua) {
            const dsMoi = danhSachDonHang.map((don) =>
                don.id === donHangDangChinhSua.id
                ? {
                    ...don,
                    khachHangId: values.khachHangId,
                    ngayDat: thoiGianDat,
                    trangThai: values.trangThai,
                    sanPham: sanPhamChon,
                    tongTien,
                    }
                : don
            );
            setDanhSachDonHang(dsMoi);
            message.success("Cập nhật đơn hàng thành công");
            } else {
            const maDonHangTiepTheo = taoMaDonHang(danhSachDonHang.length + 1);
            if (danhSachDonHang.some((don) => don.maDonHang === maDonHangTiepTheo)) {
                message.error("Mã đơn hàng bị trùng, vui lòng thử lại");
                return;
            }
            const donMoi: DonHang = {
                id: Date.now().toString(),
                maDonHang: maDonHangTiepTheo,
                khachHangId: values.khachHangId,
                ngayDat: thoiGianDat,
                trangThai: values.trangThai,
                sanPham: sanPhamChon,
                tongTien,
            };
            setDanhSachDonHang([...danhSachDonHang, donMoi]);
            message.success("Thêm đơn hàng thành công");
            }
            setMoModalDonHang(false);
        })
        .catch(() => {});
    };

    const xuLyHuyDonHang = (don: DonHang) => {
        if (don.trangThai !== "CHO_XAC_NHAN") {
        message.error("Chỉ được hủy đơn hàng ở trạng thái 'Chờ xác nhận'");
        return;
        }
        Modal.confirm({
        title: "Xác nhận hủy đơn hàng",
        content: `Bạn có chắc chắn muốn hủy đơn hàng ${don.maDonHang}?`,
        okText: "Hủy đơn",
        cancelText: "Không",
        onOk: () => {
            const dsMoi: DonHang[] = danhSachDonHang.map((d) =>
            d.id === don.id ? { ...d, trangThai: "HUY" as TrangThaiDonHang } : d
            );
            setDanhSachDonHang(dsMoi);
            message.success("Đã hủy đơn hàng");
        },
        });
    };

    const cot = [
        {
        title: "Mã đơn hàng",
        dataIndex: "maDonHang",
        key: "maDonHang",
        },
        {
        title: "Khách hàng",
        dataIndex: "khachHangId",
        key: "khachHangId",
        render: (khachHangId: string) => DANH_SACH_KHACH_HANG.find((k) => k.id === khachHangId)?.ten || "",
        },
        {
        title: "Ngày đặt",
        dataIndex: "ngayDat",
        key: "ngayDat",
    render: (ngayDat: string) => new Date(ngayDat).toLocaleString("vi-VN"),
        },
        {
        title: "Tổng tiền",
        dataIndex: "tongTien",
        key: "tongTien",
        render: (tongTien: number) => tongTien.toLocaleString("vi-VN") + " đ",
        },
        {
        title: "Trạng thái",
        dataIndex: "trangThai",
        key: "trangThai",
        render: (trangThai: TrangThaiDonHang) => {
            const tt = MAP_TRANG_THAI[trangThai];
            return <Tag color={tt.mau}>{tt.nhan}</Tag>;
        },
        },
        {
        title: "Hành động",
        key: "hanhDong",
        render: (_: unknown, banGhi: DonHang) => (
            <Space>
            <Button type="link" onClick={() => moModalChinhSua(banGhi)}>
                Sửa
            </Button>
            <Popconfirm
                title="Hủy đơn hàng"
                okText="Hủy đơn"
                cancelText="Không"
                onConfirm={() => xuLyHuyDonHang(banGhi)}
                disabled={banGhi.trangThai !== "CHO_XAC_NHAN"}
            >
                <Button type="link" danger disabled={banGhi.trangThai !== "CHO_XAC_NHAN"}>
                Hủy
                </Button>
            </Popconfirm>
            </Space>
        ),
        },
    ];

    return (
        <div style={{ padding: 24 }}>
        <Space style={{ marginBottom: 16, width: "100%", justifyContent: "space-between" }}>
            <Typography.Title level={3} style={{ margin: 0 }}>
            Quản lý đơn hàng cửa hàng
            </Typography.Title>
            <Button type="primary" onClick={moModalThemMoi}>
            Thêm đơn hàng
            </Button>
        </Space>
        <Space style={{ marginBottom: 16 }} wrap>
            <Input
            placeholder="Tìm kiếm theo mã đơn hàng hoặc khách hàng"
            value={tuKhoaTimKiem}
            onChange={(e) => setTuKhoaTimKiem(e.target.value)}
            style={{ width: 320 }}
            />
            <Select
            allowClear
            placeholder="Lọc theo trạng thái"
            style={{ width: 200 }}
            value={trangThaiLoc || undefined}
            onChange={(value) => setTrangThaiLoc((value || "") as TrangThaiDonHang | "")}
            options={Object.entries(MAP_TRANG_THAI).map(([key, val]) => ({ label: val.nhan, value: key }))}
            />
            <Select
            value={tieuChiSapXep}
            style={{ width: 220 }}
            onChange={(value) => setTieuChiSapXep(value)}
            options={[
                { value: "ngayDat", label: "Sắp xếp theo ngày đặt" },
                { value: "tongTien", label: "Sắp xếp theo tổng tiền" },
            ]}
            />
        </Space>
        <Table rowKey="id" dataSource={danhSachDonHangHienThi} columns={cot} pagination={{ pageSize: 5 }} />

        <Modal
            visible={moModalDonHang}
            title={donHangDangChinhSua ? "Chỉnh sửa đơn hàng" : "Thêm đơn hàng"}
            onCancel={() => setMoModalDonHang(false)}
            onOk={xuLyLuuDonHang}
            okText="Lưu"
            cancelText="Hủy"
            width={720}
        >
            <Form form={form} layout="vertical">
            <Form.Item name="khachHangId" label="Khách hàng" rules={[{ required: true, message: "Vui lòng chọn khách hàng" }]}>
                <Select
                options={DANH_SACH_KHACH_HANG.map((kh) => ({ value: kh.id, label: kh.ten }))}
                placeholder="Chọn khách hàng"
                />
            </Form.Item>
            <Form.Item name="ngayDat" label="Ngày đặt" rules={[{ required: true, message: "Vui lòng chọn ngày đặt" }]}>
                <DatePicker
                showTime
                style={{ width: "100%" }}
                format="DD/MM/YYYY HH:mm"
                />
            </Form.Item>
            <Form.Item name="trangThai" label="Trạng thái" rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}>
                <Select
                options={Object.entries(MAP_TRANG_THAI).map(([key, val]) => ({ label: val.nhan, value: key }))}
                placeholder="Chọn trạng thái"
                />
            </Form.Item>
            <Form.List name="sanPham">
                {(fields, { add, remove }) => (
                <div>
                    <Space style={{ marginBottom: 8, justifyContent: "space-between", width: "100%" }}>
                    <Typography.Text strong>Sản phẩm trong đơn</Typography.Text>
                    <Button
                        type="dashed"
                        onClick={() => {
                        add({ soLuong: 1 });
                        setTimeout(capNhatTongTienTamTinh, 0);
                        }}
                    >
                        Thêm sản phẩm
                    </Button>
                    </Space>
                    {fields.map((field) => (
                    <Space key={field.key} align="baseline" style={{ display: "flex", marginBottom: 8 }}>
                        <Form.Item
                        {...field}
                        name={[field.name, "id"]}
                        fieldKey={[field.fieldKey!, "id"]}
                        rules={[{ required: true, message: "Chọn sản phẩm" }]}
                        >
                        <Select
                            style={{ width: 220 }}
                            placeholder="Chọn sản phẩm"
                            options={DANH_SACH_SAN_PHAM.map((sp) => ({
                            value: sp.id,
                            label: `${sp.ten} (${sp.gia.toLocaleString("vi-VN")} đ)` ,
                            }))}
                            onChange={capNhatTongTienTamTinh}
                        />
                        </Form.Item>
                        <Form.Item
                        {...field}
                        name={[field.name, "soLuong"]}
                        fieldKey={[field.fieldKey!, "soLuong"]}
                        rules={[{ required: true, message: "Nhập số lượng" }]}
                        >
                        <InputNumber min={1} onChange={capNhatTongTienTamTinh} />
                        </Form.Item>
                        <Button
                        danger
                        type="link"
                        onClick={() => {
                            remove(field.name);
                            setTimeout(capNhatTongTienTamTinh, 0);
                        }}
                        >
                        Xóa
                        </Button>
                    </Space>
                    ))}
                    <Typography.Paragraph style={{ marginTop: 8 }}>
                    Tổng tiền tạm tính: <Typography.Text strong>{tongTienTamTinh.toLocaleString("vi-VN")} đ</Typography.Text>
                    </Typography.Paragraph>
                </div>
                )}
            </Form.List>
            </Form>
        </Modal>
        </div>
    );
};

export default QuanLyDonHangCuaHang;
