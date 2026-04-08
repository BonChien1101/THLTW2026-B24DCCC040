import { useEffect, useMemo, useState } from "react";
import { Card, Col, Input, Rate, Row, Select, Space, Tag, Typography } from "antd";

const { Title, Text } = Typography;

const STORAGE_DESTINATIONS = "khdl_diem_den";

type LoaiHinh = "bien" | "nui" | "thanh-pho" | "khac";

interface DiemDen {
	id: string;
	ten: string;
	diaDiem: string;
	loaiHinh: LoaiHinh;
	rating: number;
	giaTu: number;
	hinhAnh?: string;
}

const loaiHinhOptions = [
	{ value: "tat-ca", label: "Tất cả" },
	{ value: "bien", label: "Biển" },
	{ value: "nui", label: "Núi" },
	{ value: "thanh-pho", label: "Thành phố" },
];

const sortOptions = [
	{ value: "mac-dinh", label: "Mặc định" },
	{ value: "gia-tang", label: "Giá tăng dần" },
	{ value: "gia-giam", label: "Giá giảm dần" },
	{ value: "rating-giam", label: "Rating cao nhất" },
];

const defaultData: DiemDen[] = [
		{
			id: "ha-long",
			ten: "Vịnh Hạ Long",
			diaDiem: "Quảng Ninh",
			loaiHinh: "bien",
			rating: 4.8,
			giaTu: 1500000,
			hinhAnh:
				"https://images.pexels.com/photos/1632790/pexels-photo-1632790.jpeg?auto=compress&cs=tinysrgb&w=800",
		},
		{
			id: "da-nang",
			ten: "Đà Nẵng - Hội An",
			diaDiem: "Đà Nẵng",
			loaiHinh: "bien",
			rating: 4.7,
			giaTu: 1300000,
			hinhAnh:
				"https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=800",
		},
		{
			id: "sa-pa",
			ten: "Sa Pa",
			diaDiem: "Lào Cai",
			loaiHinh: "nui",
			rating: 4.6,
			giaTu: 1100000,
			hinhAnh:
				"https://images.pexels.com/photos/2128034/pexels-photo-2128034.jpeg?auto=compress&cs=tinysrgb&w=800",
		},
		{
			id: "ha-noi",
			ten: "Hà Nội city tour",
			diaDiem: "Hà Nội",
			loaiHinh: "thanh-pho",
			rating: 4.5,
			giaTu: 800000,
			hinhAnh:
				"https://images.pexels.com/photos/1796727/pexels-photo-1796727.jpeg?auto=compress&cs=tinysrgb&w=800",
		},
];

const getLoaiHinhTag = (loai: LoaiHinh) => {
	if (loai === "bien") return <Tag color="blue">Biển</Tag>;
	if (loai === "nui") return <Tag color="green">Núi</Tag>;
	if (loai === "thanh-pho") return <Tag color="orange">Thành phố</Tag>;
	return <Tag>Khác</Tag>;
};

const TrangChuKhamPhaDiemDen: React.FC = () => {
	const [destinations, setDestinations] = useState<DiemDen[]>([]);
	const [search, setSearch] = useState("");
	const [filterLoai, setFilterLoai] = useState<string>("tat-ca");
	const [sortBy, setSortBy] = useState<string>("mac-dinh");

	useEffect(() => {
		try {
				const rawAdmin = localStorage.getItem(STORAGE_DESTINATIONS);
				if (rawAdmin) {
					const parsedAdmin = JSON.parse(rawAdmin);
					if (Array.isArray(parsedAdmin) && parsedAdmin.length > 0) {
						const mapped: DiemDen[] = parsedAdmin.map((item: any) => ({
							id: item.id || `${item.ten}-${item.diaDiem}`,
							ten: item.ten,
							diaDiem: item.diaDiem,
							loaiHinh: (item.loaiHinh as LoaiHinh) || "khac",
							rating: typeof item.rating === "number" ? item.rating : 0,
							giaTu:
								typeof item.chiPhiAnUong === "number" ||
								typeof item.chiPhiLuuTru === "number" ||
								typeof item.chiPhiDiChuyen === "number"
									? (item.chiPhiAnUong || 0) +
										(item.chiPhiLuuTru || 0) +
										(item.chiPhiDiChuyen || 0)
									: 1000000,
							hinhAnh: item.hinhAnh,
						}));
						setDestinations(mapped);
						return;
					}
				}
		} catch {}
		setDestinations(defaultData);
	}, []);

	const hienThi = useMemo(() => {
		let list = [...destinations];
		if (filterLoai !== "tat-ca") {
			list = list.filter((x) => x.loaiHinh === filterLoai);
		}
		if (search.trim()) {
			const q = search.trim().toLowerCase();
			list = list.filter(
				(x) =>
					x.ten.toLowerCase().includes(q) ||
					x.diaDiem.toLowerCase().includes(q)
			);
		}
		if (sortBy === "gia-tang") {
			list.sort((a, b) => a.giaTu - b.giaTu);
		} else if (sortBy === "gia-giam") {
			list.sort((a, b) => b.giaTu - a.giaTu);
		} else if (sortBy === "rating-giam") {
			list.sort((a, b) => b.rating - a.rating);
		}
		return list;
	}, [destinations, search, filterLoai, sortBy]);

	return (
		<div style={{ padding: 24, maxWidth: 1200, margin: "0 auto" }}>
			<Space direction="vertical" size={24} style={{ width: "100%" }}>
				<div>
					<Title level={2} style={{ marginBottom: 4 }}>
						Khám phá điểm đến
					</Title>
					<Text type="secondary">
						Chọn điểm đến yêu thích cho chuyến đi, lọc theo loại hình và sắp xếp theo
						giá hoặc đánh giá.
					</Text>
				</div>

				<Card>
					<Row gutter={[16, 16]}>
						<Col xs={24} md={10}>
							<Input
								placeholder="Tìm kiếm theo tên, địa điểm"
								value={search}
								onChange={(e) => setSearch(e.target.value)}
							/>
						</Col>
						<Col xs={12} md={7}>
							<Select
								style={{ width: "100%" }}
								value={filterLoai}
								onChange={setFilterLoai}
								options={loaiHinhOptions}
							/>
						</Col>
						<Col xs={12} md={7}>
							<Select
								style={{ width: "100%" }}
								value={sortBy}
								onChange={setSortBy}
								options={sortOptions}
							/>
						</Col>
					</Row>
				</Card>

				<Row gutter={[16, 16]}>
					{hienThi.map((item) => (
						<Col key={item.id} xs={24} sm={12} md={8} lg={6}>
							<Card
								hoverable
								cover={
									item.hinhAnh ? (
										<div
											style={{
												height: 180,
												overflow: "hidden",
												display: "flex",
												alignItems: "center",
												justifyContent: "center",
												background: "#f5f5f5",
											}}
										>
											<img
												src={item.hinhAnh}
												alt={item.ten}
												style={{ width: "100%", objectFit: "cover" }}
											/>
										</div>
									) : null
								}
							>
								<Space direction="vertical" style={{ width: "100%" }} size={4}>
									<Space style={{ justifyContent: "space-between", width: "100%" }}>
										<Text strong>{item.ten}</Text>
										{getLoaiHinhTag(item.loaiHinh)}
									</Space>
									<Text type="secondary">{item.diaDiem}</Text>
									<Space align="center" size={8}>
										<Rate disabled allowHalf value={item.rating} />
										<Text> {item.rating.toFixed(1)}</Text>
									</Space>
									<Text strong>
										Giá từ: {item.giaTu.toLocaleString("vi-VN", {
											style: "currency",
											currency: "VND",
										})}
									</Text>
								</Space>
							</Card>
						</Col>
					))}
					{hienThi.length === 0 && (
						<Col span={24}>
							<Text type="secondary">Không tìm thấy điểm đến phù hợp.</Text>
						</Col>
					)}
				</Row>
			</Space>
		</div>
	);
};

export default TrangChuKhamPhaDiemDen;

