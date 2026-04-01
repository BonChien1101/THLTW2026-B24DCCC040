import React, { useEffect, useMemo, useState } from 'react';
import { Card, Col, Row, Statistic, Typography } from 'antd';
import Chart from 'react-apexcharts';
import { DonDangKyThanhVien, STORAGE_KEY_DON_THANH_VIEN } from '../DonDangKyThanhVien';

const { Title } = Typography;

interface CauLacBoFromStorage {
	id: number;
	ten: string;
}

const STORAGE_KEY_CLB = 'quan-ly-cau-lac-bo-danh-sach';

const docDanhSachClb = (): CauLacBoFromStorage[] => {
	if (typeof window === 'undefined') return [];
	try {
		const raw = window.localStorage.getItem(STORAGE_KEY_CLB);
		if (!raw) return [];
		const parsed = JSON.parse(raw) as CauLacBoFromStorage[];
		return Array.isArray(parsed) ? parsed : [];
	} catch (e) {
		return [];
	}
};

const docDanhSachDon = (): DonDangKyThanhVien[] => {
	if (typeof window === 'undefined') return [];
	try {
		const raw = window.localStorage.getItem(STORAGE_KEY_DON_THANH_VIEN);
		if (!raw) return [];
		const parsed = JSON.parse(raw) as DonDangKyThanhVien[];
		return Array.isArray(parsed) ? parsed : [];
	} catch (e) {
		return [];
	}
};

const BaoCaoThongKePage: React.FC = () => {
	const [dsClb, setDsClb] = useState<CauLacBoFromStorage[]>([]);
	const [dsDon, setDsDon] = useState<DonDangKyThanhVien[]>([]);

	useEffect(() => {
		setDsClb(docDanhSachClb());
		setDsDon(docDanhSachDon());
	}, []);

	const tongSoClb = dsClb.length;
	const tongDon = dsDon.length;
	const tongPending = dsDon.filter((d) => d.trangThai === 'Pending').length;
	const tongApproved = dsDon.filter((d) => d.trangThai === 'Approved').length;
	const tongRejected = dsDon.filter((d) => d.trangThai === 'Rejected').length;

	const duLieuCot = useMemo(() => {
		const tenClbTheoId = new Map<number, string>();
		dsClb.forEach((clb) => tenClbTheoId.set(clb.id, clb.ten));

		const dem: Record<string, { Pending: number; Approved: number; Rejected: number }> = {};
		dsDon.forEach((don) => {
			const key = String(don.idCauLacBo);
			if (!dem[key]) {
				dem[key] = { Pending: 0, Approved: 0, Rejected: 0 };
			}
			if (don.trangThai === 'Pending') dem[key].Pending += 1;
			if (don.trangThai === 'Approved') dem[key].Approved += 1;
			if (don.trangThai === 'Rejected') dem[key].Rejected += 1;
		});

		const result: { clb: string; trangThai: string; soDon: number }[] = [];
		Object.entries(dem).forEach(([id, value]) => {
			const ten = tenClbTheoId.get(Number(id)) || `CLB #${id}`;
			result.push(
				{ clb: ten, trangThai: 'Pending', soDon: value.Pending },
				{ clb: ten, trangThai: 'Approved', soDon: value.Approved },
				{ clb: ten, trangThai: 'Rejected', soDon: value.Rejected },
			);
		});
		return result;
	}, [dsClb, dsDon]);

	const trangThaiList = ['Pending', 'Approved', 'Rejected'];
	const categories = Array.from(new Set(duLieuCot.map((d) => d.clb)));
	const series = trangThaiList.map((status) => ({
		name: status,
		data: categories.map((clb) => {
			const item = duLieuCot.find((d) => d.clb === clb && d.trangThai === status);
			return item ? item.soDon : 0;
		}),
	}));

	const chartOptions: ApexCharts.ApexOptions = {
		chart: { type: 'bar', stacked: false },
		xaxis: { categories },
		plotOptions: { bar: { columnWidth: '50%' } },
		dataLabels: { enabled: true },
		legend: { position: 'top' },
	};

	return (
		<div style={{ background: '#fff', padding: 24 }}>
			<Title level={3} style={{ marginBottom: 24 }}>
				Báo cáo & Thống kê Câu lạc bộ
			</Title>
			<Row gutter={16} style={{ marginBottom: 24 }}>
				<Col span={6}>
					<Card>
						<Statistic title="Số CLB" value={tongSoClb} />
					</Card>
				</Col>
				<Col span={6}>
					<Card>
						<Statistic title="Tổng số đơn" value={tongDon} />
					</Card>
				</Col>
				<Col span={4}>
					<Card>
						<Statistic title="Pending" value={tongPending} />
					</Card>
				</Col>
				<Col span={4}>
					<Card>
						<Statistic title="Approved" value={tongApproved} />
					</Card>
				</Col>
				<Col span={4}>
					<Card>
						<Statistic title="Rejected" value={tongRejected} />
					</Card>
				</Col>
			</Row>

			<Card title="Số đơn đăng ký theo từng CLB">
				<Chart options={chartOptions} series={series} type="bar" height={400} />
			</Card>
		</div>
	);
};

export default BaoCaoThongKePage;

