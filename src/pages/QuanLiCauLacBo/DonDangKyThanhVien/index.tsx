import React, { useEffect, useMemo, useState } from 'react';
import { Button, Form, Input, Modal, Radio, Space, Table, Tag, Typography, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';

const { Title } = Typography;

type TrangThaiDon = 'Pending' | 'Approved' | 'Rejected';

export const STORAGE_KEY_DON_THANH_VIEN = 'quan-ly-cau-lac-bo-don-dang-ky-thanh-vien';

interface CauLacBoNgan {
	id: number;
	ten: string;
}

export interface DonDangKyThanhVien {
	id: number;
	hoTen: string;
	email: string;
	sdt: string;
	gioiTinh: 'Nam' | 'Nữ' | 'Khác';
	diaChi?: string;
	soTruong?: string;
	idCauLacBo: number;
	lyDoDangKy?: string;
	trangThai: TrangThaiDon;
	ghiChu?: string;
}

type DonFormValues = Omit<DonDangKyThanhVien, 'id'>;

export const docDonTuLocalStorage = (): DonDangKyThanhVien[] => {
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

const luuDonVaoLocalStorage = (ds: DonDangKyThanhVien[]) => {
	if (typeof window === 'undefined') return;
	try {
		window.localStorage.setItem(STORAGE_KEY_DON_THANH_VIEN, JSON.stringify(ds));
	} catch (e) {}
};

const STORAGE_KEY_CLB = 'quan-ly-cau-lac-bo-danh-sach';

const docDanhSachClb = (): CauLacBoNgan[] => {
	if (typeof window === 'undefined') return [];
	try {
		const raw = window.localStorage.getItem(STORAGE_KEY_CLB);
		if (!raw) return [];
		const parsed = JSON.parse(raw) as { id: number; ten: string }[];
		if (!Array.isArray(parsed)) return [];
		return parsed.map((clb) => ({ id: clb.id, ten: clb.ten }));
	} catch (e) {
		return [];
	}
};

const DonDangKyThanhVienPage: React.FC = () => {
	const [form] = Form.useForm<DonFormValues>();
	const [dsDon, setDsDon] = useState<DonDangKyThanhVien[]>(() => docDonTuLocalStorage());
	const [tuKhoa, setTuKhoa] = useState('');
	const [modalVisible, setModalVisible] = useState(false);
	const [donDangSua, setDonDangSua] = useState<DonDangKyThanhVien | null>(null);
	const [modalDuyet, setModalDuyet] = useState(false);
	const [donDangDuyet, setDonDangDuyet] = useState<DonDangKyThanhVien | null>(null);
	const [lyDoTuChoi, setLyDoTuChoi] = useState('');
	const [trangThaiDuyet, setTrangThaiDuyet] = useState<TrangThaiDon>('Approved');
	const [dsCauLacBo, setDsCauLacBo] = useState<CauLacBoNgan[]>([]);

	useEffect(() => {
		luuDonVaoLocalStorage(dsDon);
	}, [dsDon]);

	useEffect(() => {
		setDsCauLacBo(docDanhSachClb());
	}, []);

	const duLieuLoc = useMemo(() => {
		if (!tuKhoa) return dsDon;
		const text = tuKhoa.toLowerCase();
		return dsDon.filter((item) =>
			[item.hoTen, item.email, item.sdt, item.lyDoDangKy, item.ghiChu]
				.filter(Boolean)
				.some((field) => field!.toLowerCase().includes(text)),
		);
	}, [dsDon, tuKhoa]);

	const moModalThemMoi = () => {
		setDonDangSua(null);
		form.resetFields();
		form.setFieldsValue({ trangThai: 'Pending' } as any);
		setModalVisible(true);
	};

	const moModalChinhSua = (record: DonDangKyThanhVien) => {
		setDonDangSua(record);
		form.setFieldsValue(record as any);
		setModalVisible(true);
	};

	const xoaDon = (id: number) => {
		setDsDon((prev) => prev.filter((x) => x.id !== id));
	};

	const moModalDuyetDon = (record: DonDangKyThanhVien) => {
		setDonDangDuyet(record);
		setTrangThaiDuyet('Approved');
		setLyDoTuChoi('');
		setModalDuyet(true);
	};

	const xuLyLuuDon = () => {
		form
			.validateFields()
			.then((values) => {
				const donMoi: DonDangKyThanhVien = donDangSua
					? { ...donDangSua, ...values }
					: { id: Date.now(), ...(values as DonFormValues) };

				setDsDon((prev) => {
					if (donDangSua) {
						return prev.map((d) => (d.id === donDangSua.id ? donMoi : d));
					}
					return [donMoi, ...prev];
				});

				setModalVisible(false);
				setDonDangSua(null);
				form.resetFields();
			})
			.catch(() => undefined);
	};

	const thucHienDuyet = () => {
		if (!donDangDuyet) return;
		if (trangThaiDuyet === 'Rejected' && !lyDoTuChoi.trim()) {
			message.warning('Vui lòng nhập lý do từ chối');
			return;
		}

		setDsDon((prev) =>
			prev.map((d) =>
				d.id === donDangDuyet.id
					? {
						...d,
						trangThai: trangThaiDuyet,
						ghiChu: trangThaiDuyet === 'Rejected' ? lyDoTuChoi : d.ghiChu,
					}
					: d,
			),
		);

		setModalDuyet(false);
		setDonDangDuyet(null);
		setLyDoTuChoi('');
	};

	const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

	const thayDoiTrangThaiNhieuDon = (trangThai: TrangThaiDon) => {
		if (!selectedRowKeys.length) {
			message.info('Vui lòng chọn ít nhất 1 đơn');
			return;
		}

		let ghiChu = '';
		if (trangThai === 'Rejected') {
			Modal.confirm({
				title: 'Nhập lý do từ chối chung',
				content: (
					<Input.TextArea
						rows={4}
						onChange={(e) => {
							ghiChu = e.target.value;
						}}
					/>
				),
				onOk: () => {
					if (!ghiChu.trim()) {
						message.warning('Vui lòng nhập lý do từ chối');
						return Promise.resolve();
					}
					setDsDon((prev) =>
						prev.map((d) =>
							selectedRowKeys.includes(d.id)
								? { ...d, trangThai, ghiChu }
								: d,
						),
					);
					setSelectedRowKeys([]);
					return Promise.resolve();
				},
			});
			return;
		}

		setDsDon((prev) =>
			prev.map((d) =>
				selectedRowKeys.includes(d.id) ? { ...d, trangThai } : d,
			),
		);
		setSelectedRowKeys([]);
	};

	const columns: ColumnsType<DonDangKyThanhVien> = [
		{
			title: 'Họ tên',
			dataIndex: 'hoTen',
			key: 'hoTen',
		},
		{
			title: 'Email',
			dataIndex: 'email',
			key: 'email',
		},
		{
			title: 'SĐT',
			dataIndex: 'sdt',
			key: 'sdt',
		},
		{
			title: 'Giới tính',
			dataIndex: 'gioiTinh',
			key: 'gioiTinh',
		},
		{
			title: 'Câu lạc bộ',
			dataIndex: 'idCauLacBo',
			key: 'idCauLacBo',
			render: (id: number) => dsCauLacBo.find((c) => c.id === id)?.ten || '—',
		},
		{
			title: 'Lý do đăng ký',
			dataIndex: 'lyDoDangKy',
			key: 'lyDoDangKy',
			ellipsis: true,
		},
		{
			title: 'Trạng thái',
			dataIndex: 'trangThai',
			key: 'trangThai',
			filters: [
				{ text: 'Chờ duyệt', value: 'Pending' },
				{ text: 'Đã duyệt', value: 'Approved' },
				{ text: 'Từ chối', value: 'Rejected' },
			],
			onFilter: (value, record) => record.trangThai === value,
			render: (value: TrangThaiDon) => {
				let color: 'default' | 'green' | 'red' | 'blue' = 'default';
				if (value === 'Approved') color = 'green';
				if (value === 'Rejected') color = 'red';
				if (value === 'Pending') color = 'blue';
				return <Tag color={color}>{value}</Tag>;
			},
		},
		{
			title: 'Ghi chú',
			dataIndex: 'ghiChu',
			key: 'ghiChu',
			ellipsis: true,
		},
		{
			title: 'Thao tác',
			key: 'action',
			fixed: 'right',
			width: 260,
			render: (_, record) => (
				<Space>
					<Button size="small" onClick={() => moModalChinhSua(record)}>
						Xem / Sửa
					</Button>
					<Button size="small" type="primary" onClick={() => moModalDuyetDon(record)}>
						Duyệt / Từ chối
					</Button>
					<Button size="small" danger onClick={() => xoaDon(record.id)}>
						Xóa
					</Button>
				</Space>
			),
		},
	];

	return (
		<div style={{ background: '#fff', padding: 24 }}>
			<Space style={{ width: '100%', marginBottom: 16, display: 'flex', justifyContent: 'space-between' }} align="center">
				<Title level={3} style={{ margin: 0 }}>
					Quản lý đơn đăng ký thành viên
				</Title>
				<Space>
					<Input.Search
						placeholder="Tìm kiếm ..."
						allowClear
						style={{ width: 320 }}
						onSearch={setTuKhoa}
						onChange={(e) => setTuKhoa(e.target.value)}
					/>
					<Button type="primary" onClick={moModalThemMoi}>
						Thêm đơn đăng ký
					</Button>
					<Button onClick={() => thayDoiTrangThaiNhieuDon('Approved')}>
						Duyệt các đơn đã chọn
					</Button>
					<Button danger onClick={() => thayDoiTrangThaiNhieuDon('Rejected')}>
						Không duyệt các đơn đã chọn
					</Button>
				</Space>
			</Space>

			<Table<DonDangKyThanhVien>
				rowKey="id"
				columns={columns}
				dataSource={duLieuLoc}
				bordered
				rowSelection={{
					selectedRowKeys,
					onChange: (keys) => setSelectedRowKeys(keys),
				}}
				scroll={{ x: 1000 }}
			/>

			<Modal
				visible={modalVisible}
				title={donDangSua ? 'Chi tiết / Chỉnh sửa đơn' : 'Thêm mới đơn đăng ký'}
				onCancel={() => {
					setModalVisible(false);
					setDonDangSua(null);
					form.resetFields();
				}}
				onOk={xuLyLuuDon}
				okText={donDangSua ? 'Lưu thay đổi' : 'Thêm mới'}
				cancelText="Hủy"
				width={720}
			>
				<Form<DonFormValues> form={form} layout="vertical" initialValues={{ trangThai: 'Pending', gioiTinh: 'Nam' }}>
					<Form.Item label="Họ tên" name="hoTen" rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}>
						<Input />
					</Form.Item>
					<Form.Item label="Email" name="email" rules={[{ required: true, message: 'Vui lòng nhập email' }]}>
						<Input />
					</Form.Item>
					<Form.Item label="Số điện thoại" name="sdt" rules={[{ required: true, message: 'Vui lòng nhập SĐT' }]}>
						<Input />
					</Form.Item>
					<Form.Item label="Giới tính" name="gioiTinh">
						<Radio.Group>
							<Radio value="Nam">Nam</Radio>
							<Radio value="Nữ">Nữ</Radio>
							<Radio value="Khác">Khác</Radio>
						</Radio.Group>
					</Form.Item>
					<Form.Item label="Địa chỉ" name="diaChi">
						<Input />
					</Form.Item>
					<Form.Item label="Sở trường" name="soTruong">
						<Input />
					</Form.Item>
					<Form.Item label="Câu lạc bộ đăng ký" name="idCauLacBo" rules={[{ required: true, message: 'Vui lòng chọn CLB' }]}>
						<Radio.Group>
							{dsCauLacBo.map((clb) => (
								<Radio key={clb.id} value={clb.id}>
									{clb.ten}
								</Radio>
							))}
						</Radio.Group>
					</Form.Item>
					<Form.Item label="Lý do đăng ký" name="lyDoDangKy">
						<Input.TextArea rows={4} />
					</Form.Item>
					<Form.Item label="Trạng thái" name="trangThai">
						<Radio.Group>
							<Radio value="Pending">Chờ duyệt</Radio>
							<Radio value="Approved">Đã duyệt</Radio>
							<Radio value="Rejected">Từ chối</Radio>
						</Radio.Group>
					</Form.Item>
					<Form.Item label="Ghi chú (lý do từ chối)" name="ghiChu">
						<Input.TextArea rows={3} />
					</Form.Item>
				</Form>
			</Modal>

			<Modal
				visible={modalDuyet}
				title="Duyệt / Từ chối đơn đăng ký"
				onCancel={() => {
					setModalDuyet(false);
					setDonDangDuyet(null);
					setLyDoTuChoi('');
				}}
				onOk={thucHienDuyet}
				okText="Xác nhận"
				cancelText="Hủy"
			>
				<Space direction="vertical" style={{ width: '100%' }}>
					<Radio.Group value={trangThaiDuyet} onChange={(e) => setTrangThaiDuyet(e.target.value)}>
						<Radio value="Approved">Duyệt đơn</Radio>
						<Radio value="Rejected">Từ chối đơn</Radio>
					</Radio.Group>
					{trangThaiDuyet === 'Rejected' && (
						<Input.TextArea
							rows={4}
							placeholder="Nhập lý do từ chối"
							value={lyDoTuChoi}
							onChange={(e) => setLyDoTuChoi(e.target.value)}
						/>
					)}
				</Space>
			</Modal>
		</div>
	);
};

export default DonDangKyThanhVienPage;

