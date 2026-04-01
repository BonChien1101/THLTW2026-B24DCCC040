import React, { useEffect, useMemo, useState } from 'react';
import { Button, Modal, Select, Space, Table, Tag, Typography, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { DonDangKyThanhVien, STORAGE_KEY_DON_THANH_VIEN } from '../DonDangKyThanhVien';
import type { DefaultOptionType } from 'antd/es/select';

const { Title } = Typography;

interface CauLacBoOption {
	value: number;
	label: string;
}

const STORAGE_KEY_CLB = 'quan-ly-cau-lac-bo-danh-sach';

const docDanhSachClb = (): CauLacBoOption[] => {
	if (typeof window === 'undefined') {
		return [];
	}
	try {
		const raw = window.localStorage.getItem(STORAGE_KEY_CLB);
		if (!raw) return [];
		const parsed = JSON.parse(raw) as { id: number; ten: string }[];
		if (!Array.isArray(parsed)) return [];
		return parsed.map((clb) => ({ value: clb.id, label: clb.ten }));
	} catch (e) {
		return [];
	}
};

const QuanLyThanhVienCLBPage: React.FC = () => {
	const [dsThanhVien, setDsThanhVien] = useState<DonDangKyThanhVien[]>([]);
	const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
	const [modalChuyenClb, setModalChuyenClb] = useState(false);
	const [clbMoi, setClbMoi] = useState<number | null>(null);
	const [tuKhoa, setTuKhoa] = useState('');
	const [dsClb, setDsClb] = useState<CauLacBoOption[]>([]);

	useEffect(() => {
		if (typeof window === 'undefined') return;
		try {
			const raw = window.localStorage.getItem(STORAGE_KEY_DON_THANH_VIEN);
			const all: DonDangKyThanhVien[] = raw ? JSON.parse(raw) : [];
			const approved = Array.isArray(all) ? all.filter((d) => d.trangThai === 'Approved') : [];
			setDsThanhVien(approved);
		} catch (e) {
			setDsThanhVien([]);
		}
		setDsClb(docDanhSachClb());
	}, []);

	const duLieuLoc = useMemo(() => {
		if (!tuKhoa) return dsThanhVien;
		const text = tuKhoa.toLowerCase();
		return dsThanhVien.filter((item) =>
			[item.hoTen, item.email, item.sdt, item.diaChi, item.soTruong]
				.filter(Boolean)
				.some((f) => f!.toLowerCase().includes(text)),
		);
	}, [dsThanhVien, tuKhoa]);

	const columns: ColumnsType<DonDangKyThanhVien> = [
		{ title: 'Họ tên', dataIndex: 'hoTen', key: 'hoTen' },
		{ title: 'Email', dataIndex: 'email', key: 'email' },
		{ title: 'SĐT', dataIndex: 'sdt', key: 'sdt' },
		{ title: 'Giới tính', dataIndex: 'gioiTinh', key: 'gioiTinh' },
		{ title: 'Địa chỉ', dataIndex: 'diaChi', key: 'diaChi' },
		{ title: 'Sở trường', dataIndex: 'soTruong', key: 'soTruong' },
		{
			title: 'CLB hiện tại',
			dataIndex: 'idCauLacBo',
			key: 'idCauLacBo',
			render: (id: number) => dsClb.find((c) => c.value === id)?.label || `CLB #${id}`,
		},
		{
			title: 'Trạng thái',
			dataIndex: 'trangThai',
			key: 'trangThai',
			render: (value) => <Tag color="green">{value}</Tag>,
		},
	];

	const moModalChuyenClb = () => {
		if (!selectedRowKeys.length) {
			message.info('Vui lòng chọn ít nhất 1 thành viên');
			return;
		}
		setClbMoi(null);
		setModalChuyenClb(true);
	};

	const thucHienChuyenClb = () => {
		if (!clbMoi) {
			message.warning('Vui lòng chọn CLB muốn chuyển đến');
			return;
		}
		setDsThanhVien((prev) => {
			const updated = prev.map((tv) =>
				selectedRowKeys.includes(tv.id) ? { ...tv, idCauLacBo: clbMoi } : tv,
			);
			if (typeof window !== 'undefined') {
				try {
					const raw = window.localStorage.getItem(STORAGE_KEY_DON_THANH_VIEN);
					const all: DonDangKyThanhVien[] = raw ? JSON.parse(raw) : [];
					const merged = all.map((d) => {
						const found = updated.find((u) => u.id === d.id);
						return found ? { ...d, idCauLacBo: found.idCauLacBo } : d;
					});
					window.localStorage.setItem(STORAGE_KEY_DON_THANH_VIEN, JSON.stringify(merged));
				} catch (e) {}
			}
			return updated;
		});
		setSelectedRowKeys([]);
		setModalChuyenClb(false);
		message.success('Đã chuyển CLB cho các thành viên đã chọn');
	};

	return (
		<div style={{ background: '#fff', padding: 24 }}>
			<Space style={{ width: '100%', marginBottom: 16, display: 'flex', justifyContent: 'space-between' }} align="center">
				<Title level={3} style={{ margin: 0 }}>
					Quản lý thành viên Câu lạc bộ
				</Title>
				<Space>
					<input
						placeholder="Tìm kiếm theo tên, email, SĐT..."
						style={{ width: 260, padding: 4 }}
						value={tuKhoa}
						onChange={(e) => setTuKhoa(e.target.value)}
					/>
					<Button onClick={moModalChuyenClb}>Đổi CLB cho thành viên đã chọn</Button>
				</Space>
			</Space>

			<Table<DonDangKyThanhVien>
				rowKey="id"
				columns={columns}
				dataSource={duLieuLoc}
				rowSelection={{ selectedRowKeys, onChange: (keys) => setSelectedRowKeys(keys) }}
				bordered
				scroll={{ x: 1000 }}
			/>

			<Modal
				visible={modalChuyenClb}
				title="Chuyển CLB cho thành viên"
				onCancel={() => setModalChuyenClb(false)}
				onOk={thucHienChuyenClb}
				okText="Xác nhận"
				cancelText="Hủy"
			>
				<Space direction="vertical" style={{ width: '100%' }}>
					<div>Đang chọn {selectedRowKeys.length} thành viên.</div>
					<Select<number>
						style={{ width: '100%' }}
						placeholder="Chọn CLB muốn chuyển đến"
						value={clbMoi as number | undefined}
						onChange={(value) => setClbMoi(value)}
						options={dsClb as DefaultOptionType[]}
					/>
				</Space>
			</Modal>
		</div>
	);
};

export default QuanLyThanhVienCLBPage;

