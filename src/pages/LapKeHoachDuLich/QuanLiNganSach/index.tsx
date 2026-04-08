import { useEffect, useMemo, useState } from "react";
import { Alert, Button, Card, Col, Input, InputNumber, Row, Space, Table, Typography, Tag, Progress, Statistic, Select } from "antd";

const { Text, Title } = Typography;

const STORAGE_KEY = "khdl_ngan_sach";

interface ChiPhiItem {
  id: string;
  hangMuc: string;
  soTien: number;
  loai: string;
  ghiChuLoai?: string;
}

const QuanLiNganSachPage: React.FC = () => {
  const [hangMuc, setHangMuc] = useState("");
  const [soTien, setSoTien] = useState<number | null>(null);
  const [loai, setLoai] = useState<string>("an-uong");
  const [ghiChuLoai, setGhiChuLoai] = useState<string>("");
  const [items, setItems] = useState<ChiPhiItem[]>([]);
  const [tongDuKien, setTongDuKien] = useState<number | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed.items)) setItems(parsed.items);
        if (typeof parsed.tongDuKien === "number") setTongDuKien(parsed.tongDuKien);
      }
    } catch {}
  }, []);

  useEffect(() => {
    try {
      const data = {
        items,
        tongDuKien,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {}
  }, [items, tongDuKien]);

  const tongChiPhi = useMemo(
    () => items.reduce((sum, item) => sum + item.soTien, 0),
    [items]
  );

  const conLai =
    typeof tongDuKien === "number" ? Math.max(tongDuKien - tongChiPhi, 0) : null;

  const handleAdd = () => {
    if (!hangMuc.trim() || !soTien || soTien <= 0) return;

    const newItem: ChiPhiItem = {
      id: `${Date.now()}`,
      hangMuc: hangMuc.trim(),
      soTien,
      loai,
      ghiChuLoai: ghiChuLoai.trim() || undefined,
    };

    setItems((prev) => [...prev, newItem]);
    setHangMuc("");
    setSoTien(null);
    setGhiChuLoai("");
  };

  const handleRemove = (id: string) => {
    setItems((prev) => prev.filter((x) => x.id !== id));
  };

  const columns = [
    {
      title: "Hạng mục",
      dataIndex: "hangMuc",
      key: "hangMuc",
    },
    {
      title: "Loại",
      dataIndex: "loai",
      key: "loai",
      render: (_: string, record: ChiPhiItem) => {
        const { loai, ghiChuLoai } = record;
        let label = "Khác";
        let color: string | undefined;
        if (loai === "an-uong") {
          label = "Ăn uống";
          color = "green";
        } else if (loai === "di-chuyen") {
          label = "Di chuyển";
          color = "blue";
        } else if (loai === "luu-tru") {
          label = "Lưu trú";
          color = "purple";
        } else if (loai === "ve-tham-quan") {
          label = "Vé tham quan";
          color = "orange";
        }

        return (
          <Space size={4}>
            <Tag color={color}>{label}</Tag>
            {ghiChuLoai && <Text type="secondary">{ghiChuLoai}</Text>}
          </Space>
        );
      },
    },
    {
      title: "Số tiền",
      dataIndex: "soTien",
      key: "soTien",
      render: (value: number) =>
        value.toLocaleString("vi-VN", { style: "currency", currency: "VND" }),
    },
    {
      title: "",
      key: "action",
      render: (_: unknown, record: ChiPhiItem) => (
        <Button danger type="link" onClick={() => handleRemove(record.id)}>
          Xoá
        </Button>
      ),
    },
  ];

  return (
    <div
      style={{
        padding: 24,
        maxWidth: 1100,
        margin: "0 auto",
        minHeight: "calc(100vh - 160px)",
        background: "#f5f5f5",
      }}
    >
      <Space direction="vertical" size={24} style={{ width: "100%" }}>
        <div>
          <Title level={2} style={{ marginBottom: 4 }}>
            Quản lý ngân sách
          </Title>
          <Text type="secondary">
            Lập kế hoạch chi tiêu cho chuyến đi, theo dõi từng hạng mục và cảnh báo vượt ngân sách.
          </Text>
        </div>

        <Row gutter={[16, 16]}>
          <Col xs={24} md={10}>
            <Card title="Thiết lập ngân sách">
              <Space direction="vertical" size={12} style={{ width: "100%" }}>
                <Text>Ngân sách dự kiến</Text>
                <InputNumber
                  style={{ width: "100%" }}
                  placeholder="Nhập tổng ngân sách cho chuyến đi (VND)"
                  value={tongDuKien ?? undefined}
                  min={0}
                  onChange={(v) => setTongDuKien(v ?? null)}
                />
              </Space>
            </Card>
          </Col>

          <Col xs={24} md={14}>
            <Card title="Tổng quan chi tiêu">
              <Row gutter={[16, 16]}>
                <Col xs={24} md={8}>
                  <Statistic title="Tổng chi phí" value={tongChiPhi} suffix="đ" />
                </Col>
                <Col xs={24} md={8}>
                  <Statistic
                    title="Ngân sách dự kiến"
                    value={tongDuKien || 0}
                    suffix="đ"
                  />
                </Col>
                <Col xs={24} md={8}>
                  <Statistic
                    title="Còn lại"
                    value={conLai || 0}
                    suffix="đ"
                    valueStyle={{
                      color:
                        conLai === 0 && tongChiPhi > (tongDuKien || 0)
                          ? "#cf1322"
                          : "#3f8600",
                    }}
                  />
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>

        {typeof tongDuKien === "number" && tongChiPhi > tongDuKien && (
          <Alert
            type="error"
            showIcon
            message="Vượt quá ngân sách dự kiến"
            description={`Ngân sách: ${tongDuKien.toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
            })} – Đã chi: ${tongChiPhi.toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
            })}`}
          />
        )}

        <Row gutter={[16, 16]}>
          <Col xs={24} md={10}>
            <Card title="Thêm khoản chi">
              <Space direction="vertical" size={12} style={{ width: "100%" }}>
                <Input
                  style={{ width: "100%" }}
                  placeholder="Tên hạng mục"
                  value={hangMuc}
                  onChange={(e) => setHangMuc(e.target.value)}
                />
                <Select
                  style={{ width: "100%" }}
                  value={loai}
                  onChange={(v) => setLoai(v)}
                  options={[
                    { value: "an-uong", label: "Ăn uống" },
                    { value: "di-chuyen", label: "Di chuyển" },
                    { value: "luu-tru", label: "Lưu trú" },
                    { value: "ve-tham-quan", label: "Vé tham quan" },
                    { value: "khac", label: "Khác" },
                  ]}
                  placeholder="Chọn loại chi tiêu"
                />
                <Input
                  placeholder="Ghi chú"
                  value={ghiChuLoai}
                  onChange={(e) => setGhiChuLoai(e.target.value)}
                />
                <InputNumber
                  style={{ width: "100%" }}
                  placeholder="Số tiền (VND)"
                  value={soTien ?? undefined}
                  min={0}
                  onChange={(v) => setSoTien(v ?? null)}
                />
                <Button type="primary" block onClick={handleAdd}>
                  Thêm khoản chi
                </Button>
              </Space>
            </Card>
          </Col>

          <Col xs={24} md={14}>
            <Card title="Danh sách khoản chi">
              <Table
                dataSource={items}
                columns={columns}
                pagination={false}
                rowKey="id"
              />
            </Card>

            <Card title="Phân bố ngân sách" style={{ marginTop: 16 }}>
              {items.length === 0 ? (
                <Text type="secondary">Chưa có dữ liệu khoản chi.</Text>
              ) : (
                <Space direction="vertical" style={{ width: "100%" }}>
                  {(() => {
                    const tong = tongChiPhi || 1;
                    const theoLoai: Record<string, number> = {};
                    items.forEach((item) => {
                      theoLoai[item.loai] =
                        (theoLoai[item.loai] || 0) + item.soTien;
                    });
                    const entries = Object.entries(theoLoai);
                    return entries.map(([key, value]) => {
                      let label = "Khác";
                      if (key === "an-uong") label = "Ăn uống";
                      else if (key === "di-chuyen") label = "Di chuyển";
                      else if (key === "luu-tru") label = "Lưu trú";
                      else if (key === "ve-tham-quan") label = "Vé tham quan";

                      const percent = Math.round((value / tong) * 100);
                      return (
                        <div key={key}>
                          <Space
                            style={{
                              width: "100%",
                              justifyContent: "space-between",
                            }}
                          >
                            <Text>{label}</Text>
                            <Text>
                              {value.toLocaleString("vi-VN", {
                                style: "currency",
                                currency: "VND",
                              })} ({percent}%)
                            </Text>
                          </Space>
                          <Progress
                            percent={percent}
                            showInfo={false}
                            strokeColor="#1677ff"
                          />
                        </div>
                      );
                    });
                  })()}
                </Space>
              )}
            </Card>
          </Col>
        </Row>
      </Space>
    </div>
  );
};

export default QuanLiNganSachPage;
