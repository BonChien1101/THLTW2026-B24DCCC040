import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Input, Modal, Space, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/lib/table';
import React, { useMemo, useState } from 'react';
import { useModel } from 'umi';

const mauTrangThai: Record<TheoDoiCongViecCaNhan.TrangThaiCongViec, string> = {
	can_lam: 'blue',
	dang_lam: 'gold',
	hoan_thanh: 'green',
};

const nhanTrangThai: Record<TheoDoiCongViecCaNhan.TrangThaiCongViec, string> = {
	can_lam: 'Cần làm',
	dang_lam: 'Đang làm',
	hoan_thanh: 'Hoàn thành',
};

const mauUuTien: Record<TheoDoiCongViecCaNhan.MucDoUuTien, string> = {
	Cao: 'red',
	'Trung bình': 'orange',
	Thấp: 'default',
};

const DanhSachCongViec: React.FC = () => {
	const { danhSachCongViec, xoaCongViec, setHienForm, setDangSua, setCongViecDangChon } = useModel('theodoicongvieccanhan');
	const [tuKhoa, setTuKhoa] = useState<string>('');
	const [locTrangThai, setLocTrangThai] = useState<TheoDoiCongViecCaNhan.TrangThaiCongViec | 'tat_ca'>('tat_ca');

	const duLieu = useMemo(() => {
		let ds = [...danhSachCongViec];
		if (locTrangThai !== 'tat_ca') ds = ds.filter((cv) => cv.trangThai === locTrangThai);
		if (tuKhoa.trim()) {
			const t = tuKhoa.trim().toLowerCase();
			ds = ds.filter((cv) => cv.ten.toLowerCase().includes(t));
		}
		return ds;
	}, [danhSachCongViec, locTrangThai, tuKhoa]);

	const cot: ColumnsType<TheoDoiCongViecCaNhan.CongViec> = useMemo(
		() => [
			{
				title: 'Tên task',
				dataIndex: 'ten',
				key: 'ten',
				render: (v: string) => v,
			},
			{
				title: 'Trạng thái',
				dataIndex: 'trangThai',
				key: 'trangThai',
				filters: [
					{ text: 'Cần làm', value: 'can_lam' },
					{ text: 'Đang làm', value: 'dang_lam' },
					{ text: 'Hoàn thành', value: 'hoan_thanh' },
				],
				onFilter: (value, record) => record.trangThai === value,
				render: (v: TheoDoiCongViecCaNhan.TrangThaiCongViec) => <Tag color={mauTrangThai[v]}>{nhanTrangThai[v]}</Tag>,
			},
			{
				title: 'Deadline',
				dataIndex: 'deadline',
				key: 'deadline',
				sorter: (a, b) => {
					const da = a.deadline ? new Date(a.deadline).getTime() : Number.POSITIVE_INFINITY;
					const db = b.deadline ? new Date(b.deadline).getTime() : Number.POSITIVE_INFINITY;
					return da - db;
				},
				render: (v?: string) => (v ? new Date(v).toLocaleString() : '-'),
			},
			{
				title: 'Ưu tiên',
				dataIndex: 'mucDoUuTien',
				key: 'mucDoUuTien',
				render: (v: TheoDoiCongViecCaNhan.MucDoUuTien) => <Tag color={mauUuTien[v]}>{v}</Tag>,
			},
			{
				title: 'Hành động',
				key: 'hanhDong',
				render: (_, record) => (
					<Space>
						<Button
							size='small'
							icon={<EditOutlined />}
							onClick={() => {
								setDangSua(true);
								setCongViecDangChon(record);
								setHienForm(true);
							}}
						>
							Sửa
						</Button>
						<Button
							danger
							size='small'
							icon={<DeleteOutlined />}
							onClick={() => {
								Modal.confirm({
									title: 'Xóa task?',
									icon: <ExclamationCircleOutlined />,
									content: record.ten,
									onOk: () => xoaCongViec(record.id),
								});
							}}
						>
							Xóa
						</Button>
					</Space>
				),
			},
		],
		[setCongViecDangChon, setDangSua, setHienForm, xoaCongViec],
	);

	return (
		<div>
			<Space style={{ marginBottom: 12, width: '100%', justifyContent: 'space-between' }}>
				<Input
					allowClear
					style={{ maxWidth: 360 }}
					prefix={<SearchOutlined />}
					placeholder='Tìm theo tên task'
					value={tuKhoa}
					onChange={(e) => setTuKhoa(e.target.value)}
				/>
				<Space>
					<Button type={locTrangThai === 'tat_ca' ? 'primary' : 'default'} onClick={() => setLocTrangThai('tat_ca')}>
						Tất cả
					</Button>
					<Button type={locTrangThai === 'can_lam' ? 'primary' : 'default'} onClick={() => setLocTrangThai('can_lam')}>
						Cần làm
					</Button>
					<Button type={locTrangThai === 'dang_lam' ? 'primary' : 'default'} onClick={() => setLocTrangThai('dang_lam')}>
						Đang làm
					</Button>
					<Button type={locTrangThai === 'hoan_thanh' ? 'primary' : 'default'} onClick={() => setLocTrangThai('hoan_thanh')}>
						Hoàn thành
					</Button>
				</Space>
			</Space>

			<Table
				rowKey='id'
				columns={cot}
				dataSource={duLieu}
				pagination={{ pageSize: 8 }}
			/>
		</div>
	);
};

export default DanhSachCongViec;
