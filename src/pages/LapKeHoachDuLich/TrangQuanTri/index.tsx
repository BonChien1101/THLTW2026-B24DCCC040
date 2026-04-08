import { useEffect, useMemo, useState } from "react";
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Space,
  Statistic,
  Table,
  Tag,
  Typography,
} from "antd";

const { Text } = Typography;

const STORAGE_DESTINATIONS = "khdl_diem_den";
const STORAGE_TRIP = "khdl_lich_trinh";
const STORAGE_BUDGET = "khdl_ngan_sach";

interface DiemDenAdmin {
  id: string;
  ten: string;
  diaDiem: string;
  moTa?: string;
  loaiHinh: string;
  rating: number;
  thoiGianThamQuan?: number;
  chiPhiAnUong?: number;
  chiPhiLuuTru?: number;
  chiPhiDiChuyen?: number;
  hinhAnh?: string;
}

interface LichTrinhItem {
  id: string;
  diemDenId: string;
  diemDenTen: string;
  thoiGian: string;
  thoiGianHienThi: string;
  tieuDe: string;
  ghiChu?: string;
  chiPhi?: number;
}

interface ChiPhiItem {
  id: string;
  hangMuc: string;
  soTien: number;
  loai: string;
}

const loaiHinhOptions = [
  { value: "bien", label: "Biển" },
  { value: "nui", label: "Núi" },
  { value: "thanh-pho", label: "Thành phố" },
];

const TrangQuanTriPage: React.FC = () => {
  const [form] = Form.useForm<DiemDenAdmin>();
  const [danhSachDiemDen, setDanhSachDiemDen] = useState<DiemDenAdmin[]>([]);
  const [dangChinhSua, setDangChinhSua] = useState<string | null>(null);

  const [soLichTrinh, setSoLichTrinh] = useState<number>(0);
  const [soDiemPhoBien, setSoDiemPhoBien] = useState<number>(0);
  const [tongThuTheoHangMuc, setTongThuTheoHangMuc] =
    useState<Record<string, number>>({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_DESTINATIONS);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setDanhSachDiemDen(parsed);
      }
    } catch {}

    try {
      const rawTrip = localStorage.getItem(STORAGE_TRIP);
      if (rawTrip) {
        const parsed: LichTrinhItem[] = JSON.parse(rawTrip);
        if (Array.isArray(parsed)) {
          setSoLichTrinh(parsed.length);

          const demTheoDiem: Record<string, number> = {};
          parsed.forEach((item) => {
            demTheoDiem[item.diemDenId] =
              (demTheoDiem[item.diemDenId] || 0) + 1;
          });
          const tong = Object.values(demTheoDiem).reduce((s, v) => s + v, 0);
          setSoDiemPhoBien(tong);
        }
      }
    } catch {}

    try {
      const rawBudget = localStorage.getItem(STORAGE_BUDGET);
      if (rawBudget) {
        const parsed = JSON.parse(rawBudget);
        if (Array.isArray(parsed.items)) {
          const tong: Record<string, number> = {};
          (parsed.items as ChiPhiItem[]).forEach((item) => {
            tong[item.loai] = (tong[item.loai] || 0) + item.soTien;
          });
          setTongThuTheoHangMuc(tong);
        }
      }
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_DESTINATIONS,
        JSON.stringify(danhSachDiemDen)
      );
    } catch {}
  }, [danhSachDiemDen]);

  const handleSubmit = (values: DiemDenAdmin) => {
    if (dangChinhSua) {
      setDanhSachDiemDen((prev) =>
        prev.map((item) =>
          item.id === dangChinhSua
            ? { ...values, id: dangChinhSua }
            : item
        )
      );
    } else {
      const id = `${Date.now()}`;
      const moi: DiemDenAdmin = { ...values, id };
      setDanhSachDiemDen((prev) => [...prev, moi]);
    }

    setDangChinhSua(null);
    form.resetFields();
  };

  const handleEdit = (record: DiemDenAdmin) => {
    setDangChinhSua(record.id);
    form.setFieldsValue(record);
  };

  const handleDelete = (id: string) => {
    setDanhSachDiemDen((prev) => prev.filter((x) => x.id !== id));
    if (dangChinhSua === id) {
      setDangChinhSua(null);
      form.resetFields();
    }
  };

  const tongDiemDen = danhSachDiemDen.length;

  const tongChiPhiTrungBinh = useMemo(() => {
    if (danhSachDiemDen.length === 0) return 0;
    const tong = danhSachDiemDen.reduce((sum, item) => {
      const c =
        (item.chiPhiAnUong || 0) +
        (item.chiPhiLuuTru || 0) +
        (item.chiPhiDiChuyen || 0);
      return sum + c;
    }, 0);
    return Math.round(tong / danhSachDiemDen.length);
  }, [danhSachDiemDen]);

  const columns = [
    {
      title: "Tên điểm đến",
      dataIndex: "ten",
      key: "ten",
    },
    {
      title: "Địa điểm",
      dataIndex: "diaDiem",
      key: "diaDiem",
    },
    {
      title: "Loại hình",
      dataIndex: "loaiHinh",
      key: "loaiHinh",
      render: (value: string) => {
        if (value === "bien") return <Tag color="blue">Biển</Tag>;
        if (value === "nui") return <Tag color="green">Núi</Tag>;
        if (value === "thanh-pho") return <Tag color="orange">Thành phố</Tag>;
        return <Tag>Khác</Tag>;
      },
    },
    {
      title: "Rating",
      dataIndex: "rating",
      key: "rating",
    },
    {
      title: "TG tham quan",
      dataIndex: "thoiGianThamQuan",
      key: "thoiGianThamQuan",
    },
    {
      title: "Chi phí ăn uống",
      dataIndex: "chiPhiAnUong",
      key: "chiPhiAnUong",
      render: (v: number) =>
        typeof v === "number"
          ? v.toLocaleString("vi-VN", { style: "currency", currency: "VND" })
          : "",
    },
    {
      title: "Chi phí lưu trú",
      dataIndex: "chiPhiLuuTru",
      key: "chiPhiLuuTru",
      render: (v: number) =>
        typeof v === "number"
          ? v.toLocaleString("vi-VN", { style: "currency", currency: "VND" })
          : "",
    },
    {
      title: "Chi phí di chuyển",
      dataIndex: "chiPhiDiChuyen",
      key: "chiPhiDiChuyen",
      render: (v: number) =>
        typeof v === "number"
          ? v.toLocaleString("vi-VN", { style: "currency", currency: "VND" })
          : "",
    },
    {
      title: "",
      key: "action",
      render: (_: unknown, record: DiemDenAdmin) => (
        <Space>
          <Button type="link" onClick={() => handleEdit(record)}>
            Sửa
          </Button>
          <Button danger type="link" onClick={() => handleDelete(record.id)}>
            Xoá
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: "0 auto" }}>
      <Space direction="vertical" size={24} style={{ width: "100%" }}>
        <div>
          <h1 style={{ marginBottom: 8 }}>Trang quản trị</h1>
          <p style={{ margin: 0, color: "#666" }}>
            Quản lý danh sách điểm đến và xem thống kê tổng quan.
          </p>
        </div>

        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <Card title={dangChinhSua ? "Chỉnh sửa điểm đến" : "Thêm điểm đến"}>
              <Form<DiemDenAdmin> form={form} layout="vertical" onFinish={handleSubmit}>
                <Form.Item name="ten" label="Tên điểm đến" rules={[{ required: true }]}>
                  <Input placeholder="Ví dụ: Vịnh Hạ Long" />
                </Form.Item>
                <Form.Item
                  name="diaDiem"
                  label="Địa điểm"
                  rules={[{ required: true }]}
                >
                  <Input placeholder="Tỉnh/Thành phố" />
                </Form.Item>
                <Form.Item
                  name="loaiHinh"
                  label="Loại hình"
                  rules={[{ required: true }]}
                >
                  <Select options={loaiHinhOptions} placeholder="Chọn loại hình" />
                </Form.Item>
                <Form.Item
                  name="rating"
                  label="Rating"
                  rules={[{ required: true }]}
                >
                  <InputNumber min={0} max={5} step={0.1} style={{ width: "100%" }} />
                </Form.Item>
                <Form.Item name="thoiGianThamQuan" label="Thời gian tham quan ">
                  <InputNumber min={0} style={{ width: "100%" }} />
                </Form.Item>
                <Form.Item name="chiPhiAnUong" label="Mức chi ăn uống (VND)">
                  <InputNumber min={0} style={{ width: "100%" }} />
                </Form.Item>
                <Form.Item name="chiPhiLuuTru" label="Mức chi lưu trú (VND)">
                  <InputNumber min={0} style={{ width: "100%" }} />
                </Form.Item>
                <Form.Item name="chiPhiDiChuyen" label="Mức chi di chuyển (VND)">
                  <InputNumber min={0} style={{ width: "100%" }} />
                </Form.Item>
                <Form.Item name="moTa" label="Mô tả">
                  <Input.TextArea rows={3} />
                </Form.Item>
                <Form.Item name="hinhAnh" label="Link hình ảnh">
                  <Input placeholder="URL hình ảnh" />
                </Form.Item>
                <Form.Item>
                  <Space>
                    <Button type="primary" htmlType="submit">
                      {dangChinhSua ? "Lưu chỉnh sửa" : "Thêm mới"}
                    </Button>
                    {dangChinhSua && (
                      <Button
                        onClick={() => {
                          setDangChinhSua(null);
                          form.resetFields();
                        }}
                      >
                        Hủy
                      </Button>
                    )}
                  </Space>
                </Form.Item>
              </Form>
            </Card>
          </Col>

          <Col xs={24} md={16}>
            <Card title="Danh sách điểm đến">
              <Table
                dataSource={danhSachDiemDen}
                columns={columns}
                rowKey="id"
                pagination={false}
              />
            </Card>
          </Col>
        </Row>

        <Card title="Thống kê nhanh">
          <Row gutter={[16, 16]}>
            <Col xs={24} md={6}>
              <Statistic title="Tổng số điểm đến" value={tongDiemDen} />
            </Col>
            <Col xs={24} md={6}>
              <Statistic title="Số lịch trình đã tạo" value={soLichTrinh} />
            </Col>
            <Col xs={24} md={6}>
              <Statistic title="Tổng lượt chọn điểm đến" value={soDiemPhoBien} />
            </Col>
            <Col xs={24} md={6}>
              <Statistic
                title="Chi phí TB một điểm đến"
                value={tongChiPhiTrungBinh}
                suffix="đ"
              />
            </Col>
          </Row>

          <div style={{ marginTop: 24 }}>
            <Text strong>Chi phí theo hạng mục (từ trang Ngân sách)</Text>
            <div style={{ marginTop: 8 }}>
              {Object.keys(tongThuTheoHangMuc).length === 0 ? (
                <Text type="secondary">
                  Chưa có dữ liệu, hãy thêm khoản chi ở trang Quản lý ngân sách.
                </Text>
              ) : (
                <Space direction="vertical" style={{ width: "100%" }}>
                  {Object.entries(tongThuTheoHangMuc).map(([key, value]) => {
                    let label = key;
                    if (key === "an-uong") label = "Ăn uống";
                    else if (key === "di-chuyen") label = "Di chuyển";
                    else if (key === "luu-tru") label = "Lưu trú";
                    else if (key === "ve-tham-quan") label = "Vé tham quan";

                    return (
                      <div key={key} style={{ display: "flex", justifyContent: "space-between" }}>
                        <span>{label}</span>
                        <span>
                          {value.toLocaleString("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          })}
                        </span>
                      </div>
                    );
                  })}
                </Space>
              )}
            </div>
          </div>
        </Card>
      </Space>
    </div>
  );
};

export default TrangQuanTriPage;
