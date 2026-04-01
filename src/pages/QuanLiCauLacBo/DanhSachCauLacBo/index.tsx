import React, { useEffect, useMemo, useState } from 'react';
import { Button, Form, Image, Input, Modal, Popconfirm, Space, Switch, Table, Typography, DatePicker } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { DonDangKyThanhVien, STORAGE_KEY_DON_THANH_VIEN } from '../DonDangKyThanhVien';

const { Title } = Typography;

interface CauLacBo {
	id: number;
	ten: string;
	ngayThanhLap: string; 
	moTa: string;
	chuNhiem: string;
	dangHoatDong: boolean;
	anhDaiDien?: string;
}

const duLieuBanDau: CauLacBo[] = [
	{
		id: 1,
		ten: 'CLB Lập trình',
		ngayThanhLap: '2020-09-01',
		moTa: 'Câu lạc bộ dành cho những bạn yêu thích lập trình.',
		chuNhiem: 'Trương Công Chiến',
		dangHoatDong: true,
		anhDaiDien: 'https://cdn2.fptshop.com.vn/unsafe/800x0/hinh_nen_may_tinh_4k_34_dda04a760c.png',
	},
	{
		id: 2,
		ten: 'CLB Bóng đá',
		ngayThanhLap: '2018-03-15',
		moTa: 'Câu lạc bộ bóng đá của trường.',
		chuNhiem: 'Trương Công Chiến',
		dangHoatDong: false,
		anhDaiDien: 'https://img.tripi.vn/cdn-cgi/image/width=700,height=700/https://gcs.tripi.vn/public-tripi/tripi-feed/img/482742hPC/anh-mo-ta.png',
	},
];

const STORAGE_KEY = 'quan-ly-cau-lac-bo-danh-sach';

const DanhSachCauLacBo: React.FC = () => {
	const [form] = Form.useForm<CauLacBo>();
	const [dsCauLacBo, setDsCauLacBo] = useState<CauLacBo[]>(() => {
		if (typeof window === 'undefined') return duLieuBanDau;
		try {
			const raw = window.localStorage.getItem(STORAGE_KEY);
			if (!raw) return duLieuBanDau;
			const parsed = JSON.parse(raw) as CauLacBo[];
			if (!Array.isArray(parsed)) return duLieuBanDau;
			return parsed;
		} catch (e) {
			return duLieuBanDau;
		}
	});
	const [tuKhoaTimKiem, setTuKhoaTimKiem] = useState('');
	const [hienModal, setHienModal] = useState(false);
	const [clbDangSua, setClbDangSua] = useState<CauLacBo | null>(null);
	const [hienModalThanhVien, setHienModalThanhVien] = useState(false);
	const [thanhVienTrongClb, setThanhVienTrongClb] = useState<DonDangKyThanhVien[]>([]);
	const [clbDangXem, setClbDangXem] = useState<CauLacBo | null>(null);

	useEffect(() => {
		if (typeof window === 'undefined') return;
		try {
			window.localStorage.setItem(STORAGE_KEY, JSON.stringify(dsCauLacBo));
		} catch (e) {
			// ignore quota / private mode errors
		}
	}, [dsCauLacBo]);

	const duLieuLoc = useMemo(() => {
		if (!tuKhoaTimKiem) return dsCauLacBo;
		const text = tuKhoaTimKiem.toLowerCase();
		return dsCauLacBo.filter((item) =>
			[item.ten, item.chuNhiem, item.moTa]
				.filter(Boolean)
				.some((field) => field.toLowerCase().includes(text)),
		);
	}, [dsCauLacBo, tuKhoaTimKiem]);

	const xuLyThemMoi = () => {
		setClbDangSua(null);
		form.resetFields();
		setHienModal(true);
	};

	const xuLyChinhSua = (banGhi: CauLacBo) => {
		setClbDangSua(banGhi);
		form.setFieldsValue({
			...banGhi,
			ngayThanhLap: undefined as any,
		});
		setHienModal(true);
	};

	const xuLyXoa = (id: number) => {
		setDsCauLacBo((prev) => prev.filter((item) => item.id !== id));
	};

	const xuLyXemThanhVien = (banGhi: CauLacBo) => {
		if (typeof window === 'undefined') return;
		try {
			const raw = window.localStorage.getItem(STORAGE_KEY_DON_THANH_VIEN);
			const dsDon: DonDangKyThanhVien[] = raw ? JSON.parse(raw) : [];
			const dsThanhVien = Array.isArray(dsDon)
				? dsDon.filter((d) => d.idCauLacBo === banGhi.id && d.trangThai === 'Approved')
				: [];
			setThanhVienTrongClb(dsThanhVien);
			setClbDangXem(banGhi);
			setHienModalThanhVien(true);
		} catch (e) {
			setThanhVienTrongClb([]);
			setClbDangXem(banGhi);
			setHienModalThanhVien(true);
		}
	};

	const xuLyLuu = () => {
		form
			.validateFields()
			.then((values) => {
				const duLieuMoi: CauLacBo = {
					id: clbDangSua ? clbDangSua.id : Date.now(),
					ten: values.ten,
					chuNhiem: values.chuNhiem,
					moTa: values.moTa,
					dangHoatDong: values.dangHoatDong,
					anhDaiDien: values.anhDaiDien,
					ngayThanhLap: values.ngayThanhLap
						? (values.ngayThanhLap as any).format('YYYY-MM-DD')
						: '',
				};

				setDsCauLacBo((prev) => {
					if (clbDangSua) {
						return prev.map((item) => (item.id === clbDangSua.id ? duLieuMoi : item));
					}
					return [duLieuMoi, ...prev];
				});

				setHienModal(false);
				setClbDangSua(null);
				form.resetFields();
			})
			.catch(() => undefined);
	};

	const columns: ColumnsType<CauLacBo> = [
		{
			title: 'Ảnh đại diện',
			dataIndex: 'anhDaiDien',
			key: 'anhDaiDien',
			align: 'center',
			width: 120,
			render: (src: string | undefined) =>
				src ? <Image src={src} width={64} height={64} style={{ objectFit: 'cover' }} /> : '—',
		},
		{
			title: 'Tên câu lạc bộ',
			dataIndex: 'ten',
			key: 'ten',
			sorter: (a, b) => a.ten.localeCompare(b.ten),
		},
		{
			title: 'Ngày thành lập',
			dataIndex: 'ngayThanhLap',
			key: 'ngayThanhLap',
			sorter: (a, b) => a.ngayThanhLap.localeCompare(b.ngayThanhLap),
			render: (value: string) => (value ? new Date(value).toLocaleDateString('vi-VN') : ''),
			width: 160,
		},
		{
			title: 'Mô tả',
			dataIndex: 'moTa',
			key: 'moTa',
			ellipsis: true,
		},
		{
			title: 'Chủ nhiệm CLB',
			dataIndex: 'chuNhiem',
			key: 'chuNhiem',
		},
		{
			title: 'Hoạt động',
			dataIndex: 'dangHoatDong',
			key: 'dangHoatDong',
			align: 'center',
			width: 120,
			filters: [
				{ text: 'Đang hoạt động', value: true },
				{ text: 'Ngừng hoạt động', value: false },
			],
			onFilter: (value, record) => record.dangHoatDong === value,
			render: (value: boolean) => <Switch checked={value} disabled />,
		},
		{
			title: 'Thao tác',
			key: 'action',
			fixed: 'right',
			width: 260,
			render: (_, record) => (
				<Space>
					<Button size="small" onClick={() => xuLyXemThanhVien(record)}>
						Thành viên
					</Button>
					<Button size="small" type="primary" onClick={() => xuLyChinhSua(record)}>
						Chỉnh sửa
					</Button>
								<Popconfirm
									title="Bạn có chắc chắn muốn xóa CLB này?"
									okText="Xóa"
									cancelText="Hủy"
									onConfirm={() => xuLyXoa(record.id)}
								>
						<Button size="small" danger>
							Xóa
						</Button>
					</Popconfirm>
				</Space>
			),
		},
	];

	return (
		<div style={{ background: '#fff', padding: 24 }}>
			<Space style={{ width: '100%', marginBottom: 16, display: 'flex', justifyContent: 'space-between' }} align="center">
				<Title level={3} style={{ margin: 0 }}>
					Danh sách câu lạc bộ
				</Title>
				<Space>
					<Input.Search
						placeholder="Tìm kiếm ..."
						allowClear
						style={{ width: 320 }}
						onSearch={setTuKhoaTimKiem}
						onChange={(e) => setTuKhoaTimKiem(e.target.value)}
					/>
					<Button type="primary" onClick={xuLyThemMoi}>
						Thêm câu lạc bộ
					</Button>
				</Space>
			</Space>

			<Table<CauLacBo>
				rowKey="id"
				columns={columns}
				dataSource={duLieuLoc}
				bordered
				scroll={{ x: 1000 }}
			/>

			<Modal
				visible={hienModalThanhVien}
				title={clbDangXem ? `Danh sách thành viên - ${clbDangXem.ten}` : 'Danh sách thành viên'}
				onCancel={() => {
					setHienModalThanhVien(false);
					setThanhVienTrongClb([]);
					setClbDangXem(null);
				}}
				footer={null}
				width={900}
			>
				<Table<DonDangKyThanhVien>
					rowKey="id"
					dataSource={thanhVienTrongClb}
					bordered
					size="small"
					columns={[
						{ title: 'Họ tên', dataIndex: 'hoTen', key: 'hoTen' },
						{ title: 'Email', dataIndex: 'email', key: 'email' },
						{ title: 'SĐT', dataIndex: 'sdt', key: 'sdt' },
						{ title: 'Giới tính', dataIndex: 'gioiTinh', key: 'gioiTinh' },
						{ title: 'Địa chỉ', dataIndex: 'diaChi', key: 'diaChi' },
						{ title: 'Sở trường', dataIndex: 'soTruong', key: 'soTruong' },
						{ title: 'Lý do đăng ký', dataIndex: 'lyDoDangKy', key: 'lyDoDangKy', ellipsis: true },
					]}
					locale={{ emptyText: 'Chưa có thành viên nào được duyệt trong CLB này.' }}
				/>
			</Modal>

					<Modal
						visible={hienModal}
				title={clbDangSua ? 'Chỉnh sửa câu lạc bộ' : 'Thêm mới câu lạc bộ'}
				onCancel={() => {
					setHienModal(false);
					setClbDangSua(null);
					form.resetFields();
				}}
				onOk={xuLyLuu}
				okText={clbDangSua ? 'Lưu thay đổi' : 'Thêm mới'}
				cancelText="Hủy"
				destroyOnClose
				width={720}
			>
				<Form<CauLacBo>
					form={form}
					layout="vertical"
					initialValues={{ isActive: true }}
				>
					<Form.Item
						label="Tên câu lạc bộ"
						name="ten"
						rules={[{ required: true, message: 'Vui lòng nhập tên câu lạc bộ' }]}
					>
						<Input />
					</Form.Item>

					<Form.Item label="Ngày thành lập" name="ngayThanhLap">
						<DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
					</Form.Item>

					<Form.Item label="Mô tả" name="moTa">
						<Input.TextArea rows={4} />
					</Form.Item>

					<Form.Item label="Chủ nhiệm CLB" name="chuNhiem">
						<Input />
					</Form.Item>

					<Form.Item label="Ảnh đại diện (URL)" name="anhDaiDien">
						<Input placeholder="Dán đường dẫn ảnh hoặc tích hợp upload sau" />
					</Form.Item>

					<Form.Item label="Hoạt động" name="dangHoatDong" valuePropName="checked">
						<Switch checkedChildren="Có" unCheckedChildren="Không" />
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
};

export default DanhSachCauLacBo;

