import { useEffect, useMemo, useState } from "react";
import { Button, Card, Col, DatePicker, Input, InputNumber, List, Row, Select, Space, Statistic, Tag, TimePicker, Typography } from "antd";

const { Text, Title } = Typography;

const STORAGE_KEY = "khdl_lich_trinh";
const STORAGE_DESTINATIONS = "khdl_diem_den";

interface LichTrinhItem {
    id: string;
    diemDenId: string;
    diemDenTen: string;
    thoiGian: string;
    thoiGianHienThi: string;
    tieuDe: string;
    ghiChu?: string;
    chiPhi?: number;
    thoiGianDiChuyen?: number;
}

const LichTrinhDuLichPage: React.FC = () => {
    const [ngay, setNgay] = useState<string | null>(null);
    const [time, setTime] = useState<string | null>(null);
    const [diemDen, setDiemDen] = useState<string | undefined>();
    const [title, setTitle] = useState("");
    const [note, setNote] = useState("");
    const [chiPhi, setChiPhi] = useState<number | null>(null);
    const [thoiGianDiChuyen, setThoiGianDiChuyen] = useState<number | null>(null);
    const [items, setItems] = useState<LichTrinhItem[]>([]);
    const [danhSachDiemDen, setDanhSachDiemDen] = useState<{ value: string; label: string }[]>([]);

    useEffect(() => {
        try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) setItems(parsed);
        }
        } catch {}
    }, []);

    useEffect(() => {
        try {
            const rawAdmin = localStorage.getItem(STORAGE_DESTINATIONS);
            if (rawAdmin) {
                const parsed = JSON.parse(rawAdmin);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    const options = parsed.map((item: any) => ({
                        value: item.id,
                        label: item.ten,
                    }));
                    setDanhSachDiemDen(options);
                    return;
                }
            }
        } catch {}

        setDanhSachDiemDen([
            { value: "ha-long", label: "Vịnh Hạ Long" },
            { value: "da-nang", label: "Đà Nẵng - Hội An" },
            { value: "sa-pa", label: "Sa Pa" },
            { value: "nha-trang", label: "Nha Trang" },
            { value: "ha-noi", label: "Hà Nội city tour" },
        ]);
    }, []);

    useEffect(() => {
        try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
        } catch {}
    }, [items]);

    const tongChiPhi = useMemo(
        () => items.reduce((sum, item) => sum + (item.chiPhi || 0), 0),
        [items]
    );

    const tongThoiGianDiChuyen = useMemo(
        () => items.reduce((sum, item) => sum + (item.thoiGianDiChuyen || 0), 0),
        [items]
    );

    const soHoatDong = items.length;

    const handleAdd = () => {
    if (!ngay || !time || !title.trim() || !diemDen) return;

    const thongTinDiem = danhSachDiemDen.find((x) => x.value === diemDen);

        const newItem: LichTrinhItem = {
        id: `${Date.now()}`,
    diemDenId: diemDen,
    diemDenTen: thongTinDiem?.label || diemDen,
        thoiGian: `${ngay} ${time}`,
        thoiGianHienThi: `${ngay} • ${time}`,
        tieuDe: title.trim(),
        ghiChu: note.trim() || undefined,
    chiPhi: chiPhi || undefined,
    thoiGianDiChuyen: thoiGianDiChuyen || undefined,
        };

        const newList = [...items, newItem].sort((a, b) =>
        a.thoiGian.localeCompare(b.thoiGian)
        );

        setItems(newList);
        setTitle("");
        setNote("");
    setDiemDen(undefined);
    setChiPhi(null);
    setThoiGianDiChuyen(null);
    };

    const handleRemove = (id: string) => {
        setItems((prev) => prev.filter((x) => x.id !== id));
    };

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
            <Title level={2} style={{ marginBottom: 4 }}>Lịch trình du lịch</Title>
            <Text type="secondary">
                Lên kế hoạch chi tiết cho từng ngày, theo dõi chi phí và thời gian di chuyển.
            </Text>
            </div>

            <Row gutter={[16, 16]}>
                <Col xs={24} md={10}>
                    <Card title="Thêm hoạt động / điểm đến">
                        <Space direction="vertical" size={16} style={{ width: "100%" }}>
                            <Space wrap>
                                <DatePicker
                                    placeholder="Chọn ngày"
                                    onChange={(_, dateString) => setNgay(dateString || null)}
                                />
                                <TimePicker
                                    placeholder="Chọn giờ"
                                    format="HH:mm"
                                    onChange={(_, timeString) => setTime(timeString || null)}
                                />
                            </Space>
                            <Select
                                style={{ width: "100%" }}
                                placeholder="Chọn điểm đến"
                                value={diemDen}
                                onChange={(value) => setDiemDen(value)}
                                options={danhSachDiemDen}
                            />
                            <Input
                                placeholder="Tiêu đề hoạt động "
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                            <Input.TextArea
                                placeholder="Ghi chú chi tiết cho hoạt động"
                                rows={3}
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                            />
                            <Space wrap>
                                <InputNumber
                                    placeholder="Chi phí hoạt động (VND)"
                                    value={chiPhi ?? undefined}
                                    min={0}
                                    onChange={(v) => setChiPhi(v ?? null)}
                                />
                                <InputNumber
                                    placeholder="Thời gian di chuyển"
                                    value={thoiGianDiChuyen ?? undefined}
                                    min={0}
                                    onChange={(v) => setThoiGianDiChuyen(v ?? null)}
                                />
                            </Space>
                            <Button type="primary" block onClick={handleAdd}>
                                Thêm vào lịch trình
                            </Button>
                        </Space>
                    </Card>
                </Col>

                <Col xs={24} md={14}>
                    <Card title="Tổng quan chuyến đi">
                        <Row gutter={[16, 16]}>
                            <Col xs={24} md={8}>
                                <Statistic
                                    title="Số hoạt động"
                                    value={soHoatDong}
                                />
                            </Col>
                            <Col xs={24} md={8}>
                                <Statistic
                                    title="Tổng chi phí"
                                    value={tongChiPhi}
                                    precision={0}
                                    suffix="đ"
                                />
                            </Col>
                            <Col xs={24} md={8}>
                                <Statistic
                                    title="Tổng thời gian di chuyển"
                                    value={tongThoiGianDiChuyen}
                                    suffix="phút"
                                />
                            </Col>
                        </Row>
                        <div style={{ marginTop: 16 }}>
                            {items.length === 0 ? (
                                <Text type="secondary">
                                    Chưa có hoạt động nào, hãy thêm mới ở khung bên trái.
                                </Text>
                            ) : (
                                <Text type="secondary">
                                    Lịch trình được sắp xếp theo thời gian tăng dần.
                                </Text>
                            )}
                        </div>
                    </Card>

                    <Card title="Danh sách hoạt động / điểm đến" style={{ marginTop: 16 }}>
            {items.length === 0 ? (
                <Text type="secondary">Chưa có hoạt động nào, hãy thêm mới.</Text>
            ) : (
                <List
                dataSource={items}
                renderItem={(item) => (
                    <List.Item
                    actions={[
                        <Button danger type="link" onClick={() => handleRemove(item.id)}>
                        Xoá
                        </Button>,
                    ]}
                    >
                    <List.Item.Meta
                        title={
                        <Space direction="vertical" size={0}>
                            <Space direction="horizontal" style={{ justifyContent: "space-between", width: "100%" }}>
                                <span>
                                    <Text strong>{item.tieuDe}</Text>
                                    <Text type="secondary" style={{ fontSize: 12, display: "block" }}>
                                        {item.thoiGianHienThi}
                                    </Text>
                                </span>
                                <Tag color="blue">{item.diemDenTen}</Tag>
                            </Space>
                            {typeof item.chiPhi === "number" && (
                                <Text style={{ fontSize: 12 }}>
                                    Chi phí: {item.chiPhi.toLocaleString("vi-VN", {
                                        style: "currency",
                                        currency: "VND",
                                    })}
                                </Text>
                            )}
                            {typeof item.thoiGianDiChuyen === "number" && (
                                <Text style={{ fontSize: 12 }}>
                                    Thời gian di chuyển: {item.thoiGianDiChuyen} phút
                                </Text>
                            )}
                        </Space>
                        }
                        description={item.ghiChu}
                    />
                    </List.Item>
                )}
                />
            )}
            </Card>
                </Col>
            </Row>
        </Space>
        </div>
    );
};

export default LichTrinhDuLichPage;
