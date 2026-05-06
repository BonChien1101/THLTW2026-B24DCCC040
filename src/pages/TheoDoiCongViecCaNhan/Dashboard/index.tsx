import { Badge, Card, Col, List, Progress, Row, Space, Statistic, Tag, Typography } from 'antd';
import { useMemo } from 'react';
import { useModel } from 'umi';

const { Text } = Typography;

const nhanTrangThai: Record<TheoDoiCongViecCaNhan.TrangThaiCongViec, string> = {
	can_lam: 'Cần làm',
	dang_lam: 'Đang làm',
	hoan_thanh: 'Hoàn thành',
};

const mauTrangThai: Record<TheoDoiCongViecCaNhan.TrangThaiCongViec, string> = {
	can_lam: 'blue',
	dang_lam: 'gold',
	hoan_thanh: 'green',
};

const mauUuTien: Record<TheoDoiCongViecCaNhan.MucDoUuTien, string> = {
	Cao: 'red',
	'Trung bình': 'orange',
	Thấp: 'default',
};

const Dashboard: React.FC = () => {
	const { thongKe, danhSachCongViec } = useModel('theodoicongvieccanhan');

	const tiLeHoanThanh = useMemo(() => {
		if (!thongKe.tong) return 0;
		return Math.round((thongKe.hoanThanh / thongKe.tong) * 100);
	}, [thongKe.hoanThanh, thongKe.tong]);

	const thongKeTrangThai = useMemo(() => {
		const ketQua: Record<TheoDoiCongViecCaNhan.TrangThaiCongViec, number> = { can_lam: 0, dang_lam: 0, hoan_thanh: 0 };
		danhSachCongViec.forEach((cv) => {
			ketQua[cv.trangThai] += 1;
		});
		return ketQua;
	}, [danhSachCongViec]);

	const thongKeUuTien = useMemo(() => {
		const ketQua: Record<TheoDoiCongViecCaNhan.MucDoUuTien, number> = { Cao: 0, 'Trung bình': 0, Thấp: 0 };
		danhSachCongViec.forEach((cv) => {
			ketQua[cv.mucDoUuTien] += 1;
		});
		return ketQua;
	}, [danhSachCongViec]);

	const dsQuaHan = useMemo(() => {
		return danhSachCongViec
			.filter((cv) => cv.deadline && cv.trangThai !== 'hoan_thanh' && new Date(cv.deadline).getTime() < Date.now())
			.sort((a, b) => new Date(a.deadline as string).getTime() - new Date(b.deadline as string).getTime())
			.slice(0, 5);
	}, [danhSachCongViec]);

	const dsSapToi = useMemo(() => {
		const gioiHan = Date.now() + 1000 * 60 * 60 * 48;
		return danhSachCongViec
			.filter((cv) => cv.deadline && cv.trangThai !== 'hoan_thanh' && new Date(cv.deadline).getTime() >= Date.now())
			.filter((cv) => new Date(cv.deadline as string).getTime() <= gioiHan)
			.sort((a, b) => new Date(a.deadline as string).getTime() - new Date(b.deadline as string).getTime())
			.slice(0, 5);
	}, [danhSachCongViec]);

	return (
		<Row gutter={[12, 12]}>
			<Col xs={24} md={6}>
				<Card>
					<Statistic title='Tổng số task' value={thongKe.tong} />
				</Card>
			</Col>
			<Col xs={24} md={6}>
				<Card>
					<Statistic title='Đã hoàn thành' value={thongKe.hoanThanh} />
				</Card>
			</Col>
			<Col xs={24} md={6}>
				<Card>
					<Statistic title='Quá hạn' value={thongKe.quaHan} valueStyle={{ color: thongKe.quaHan ? '#cf1322' : undefined }} />
				</Card>
			</Col>
			<Col xs={24} md={6}>
				<Card>
					<Space direction='vertical' style={{ width: '100%' }} size={6}>
						<Text type='secondary'>Tiến độ</Text>
						<Progress percent={tiLeHoanThanh} status={tiLeHoanThanh === 100 ? 'success' : 'active'} />
					</Space>
				</Card>
			</Col>

			<Col xs={24} md={12}>
				<Card title='Phân bố theo trạng thái'>
					<Space wrap>
						{(Object.keys(thongKeTrangThai) as TheoDoiCongViecCaNhan.TrangThaiCongViec[]).map((k) => (
							<Badge
								key={k}
								count={thongKeTrangThai[k]}
								showZero
								style={{ backgroundColor: '#fff', color: '#000', boxShadow: '0 0 0 1px #d9d9d9 inset' }}
							>
								<Tag color={mauTrangThai[k]} style={{ marginRight: 0 }}>
									{nhanTrangThai[k]}
								</Tag>
							</Badge>
						))}
					</Space>
				</Card>
			</Col>

			<Col xs={24} md={12}>
				<Card title='Phân bố theo ưu tiên'>
					<Space wrap>
						{(Object.keys(thongKeUuTien) as TheoDoiCongViecCaNhan.MucDoUuTien[]).map((k) => (
							<Badge
								key={k}
								count={thongKeUuTien[k]}
								showZero
								style={{ backgroundColor: '#fff', color: '#000', boxShadow: '0 0 0 1px #d9d9d9 inset' }}
							>
								<Tag color={mauUuTien[k]} style={{ marginRight: 0 }}>
									{k}
								</Tag>
							</Badge>
						))}
					</Space>
				</Card>
			</Col>

			<Col xs={24} md={12}>
				<Card title='Task sắp tới (48 giờ)'>
					<List
						dataSource={dsSapToi}
						locale={{ emptyText: 'Không có task sắp tới' }}
						renderItem={(cv) => (
							<List.Item>
								<Space direction='vertical' size={0} style={{ width: '100%' }}>
									<Space style={{ width: '100%', justifyContent: 'space-between' }}>
										<Text strong>{cv.ten}</Text>
										<Tag color={mauUuTien[cv.mucDoUuTien]}>{cv.mucDoUuTien}</Tag>
									</Space>
									<Text type='secondary'>Deadline: {new Date(cv.deadline as string).toLocaleString()}</Text>
								</Space>
							</List.Item>
						)}
					/>
				</Card>
			</Col>

			<Col xs={24} md={12}>
				<Card title='Task quá hạn'>
					<List
						dataSource={dsQuaHan}
						locale={{ emptyText: 'Không có task quá hạn' }}
						renderItem={(cv) => (
							<List.Item>
								<Space direction='vertical' size={0} style={{ width: '100%' }}>
									<Space style={{ width: '100%', justifyContent: 'space-between' }}>
										<Text strong>{cv.ten}</Text>
										<Tag color='red'>Quá hạn</Tag>
									</Space>
									<Text type='secondary'>Deadline: {new Date(cv.deadline as string).toLocaleString()}</Text>
									<Space wrap>
										<Tag color={mauTrangThai[cv.trangThai]}>{nhanTrangThai[cv.trangThai]}</Tag>
										<Tag color={mauUuTien[cv.mucDoUuTien]}>{cv.mucDoUuTien}</Tag>
									</Space>
								</Space>
							</List.Item>
						)}
					/>
				</Card>
			</Col>
		</Row>
	);
};

export default Dashboard;
