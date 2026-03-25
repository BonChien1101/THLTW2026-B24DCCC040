import React, { useEffect, useMemo, useState } from 'react';
import { Button, DatePicker, Form, Input, InputNumber, Modal, Select, Space, Table, Tag, message } from 'antd';
import dayjs, { Dayjs } from 'dayjs';

type SoVanBang = {
	id: string;
	nam: number;
	ten: string;
	soHienTai: number;
};

type QuyetDinh = {
	id: string;
	soQuyetDinh: string;
	ngayBanHanh: string;
	trichYeu: string;
	idSoVanBang: string;
};

type KieuDuLieu = 'string' | 'number' | 'date';

type TruongPhuLuc = {
	id: string;
	ma: string;
	tenHienThi: string;
	kieuDuLieu: KieuDuLieu;
	batBuoc: boolean;
};

type VanBang = {
	id: string;
	idSoVanBang: string;
	soVaoSo: number;
	soHieuVanBang: string;
	maSinhVien: string;
	hoTen: string;
	ngaySinh: string;
	idQuyetDinh: string;
	giaTriPhuLuc: Record<string, any>;
};

type GiaTriForm = {
	idSoVanBang: string;
	idQuyetDinh: string;
	soHieuVanBang: string;
	maSinhVien: string;
	hoTen: string;
	ngaySinh: Dayjs;
	giaTriPhuLuc: Record<string, any>;
};

const KHOA_SO_VAN_BANG = 'soVanBangList';
const KHOA_QUYET_DINH = 'quyetDinhList';
const KHOA_PHU_LUC = 'extraFieldList';
const KHOA_VAN_BANG = 'vanBangList';

const docSoVanBang = (): SoVanBang[] => {
	try {
		const raw = localStorage.getItem(KHOA_SO_VAN_BANG);
		if (!raw) return [];
		const parsed: SoVanBang[] = JSON.parse(raw);
		return Array.isArray(parsed) ? parsed : [];
	} catch {
		return [];
	}
};

const luuSoVanBang = (ds: SoVanBang[]) => {
	localStorage.setItem(KHOA_SO_VAN_BANG, JSON.stringify(ds));
};

const docQuyetDinh = (): QuyetDinh[] => {
	try {
		const raw = localStorage.getItem(KHOA_QUYET_DINH);
		if (!raw) return [];
		const parsed: QuyetDinh[] = JSON.parse(raw);
		return Array.isArray(parsed) ? parsed : [];
	} catch {
		return [];
	}
};

const docPhuLuc = (): TruongPhuLuc[] => {
	try {
		const raw = localStorage.getItem(KHOA_PHU_LUC);
		if (!raw) return [];
		const parsed: TruongPhuLuc[] = JSON.parse(raw);
		return Array.isArray(parsed) ? parsed : [];
	} catch {
		return [];
	}
};

const docVanBang = (): VanBang[] => {
	try {
		const raw = localStorage.getItem(KHOA_VAN_BANG);
		if (!raw) return [];
		const parsed: VanBang[] = JSON.parse(raw);
		return Array.isArray(parsed) ? parsed : [];
	} catch {
		return [];
	}
};

const luuVanBang = (ds: VanBang[]) => {
	localStorage.setItem(KHOA_VAN_BANG, JSON.stringify(ds));
};

const ThongTinVanBangPage: React.FC = () => {
	const [soVanBang, setSoVanBang] = useState<SoVanBang[]>([]);
	const [quyetDinh, setQuyetDinh] = useState<QuyetDinh[]>([]);
	const [truongPhuLuc, setTruongPhuLuc] = useState<TruongPhuLuc[]>([]);
	const [duLieu, setDuLieu] = useState<VanBang[]>([]);
	const [hienModal, setHienModal] = useState(false);
	const [form] = Form.useForm<GiaTriForm>();
	const [dangSua, setDangSua] = useState<VanBang | null>(null);
	const [idSoLoc, setIdSoLoc] = useState<string | undefined>(undefined);

	useEffect(() => {
		setSoVanBang(docSoVanBang());
		setQuyetDinh(docQuyetDinh());
		setTruongPhuLuc(docPhuLuc());
		setDuLieu(docVanBang());
	}, []);

	const duLieuHienThi = useMemo(() => {
		if (!idSoLoc) return duLieu;
		return duLieu.filter((x) => x.idSoVanBang === idSoLoc);
	}, [duLieu, idSoLoc]);

	const danhSachSo = useMemo(
		() =>
			soVanBang.map((x) => ({
				label: `${x.ten} (${x.nam})`,
				value: x.id,
			})),
		[soVanBang],
	);

	const laySoVaoSoMoi = (idSo: string): { soMoi: number; dsCapNhat: SoVanBang[] } => {
	const ds = docSoVanBang();
	const dsMoi = ds.map((x) =>
		x.id === idSo
			? { ...x, soHienTai: (x.soHienTai || 0) + 1 }
			: x,
	);
	const so = dsMoi.find((x) => x.id === idSo);
	return { soMoi: so ? so.soHienTai : 1, dsCapNhat: dsMoi };
};

	const moModalThem = () => {
		setDangSua(null);
		form.resetFields();
		setHienModal(true);
	};

	const moModalSua = (banGhi: VanBang) => {
		setDangSua(banGhi);
		form.setFieldsValue({
			idSoVanBang: banGhi.idSoVanBang,
			idQuyetDinh: banGhi.idQuyetDinh,
			soHieuVanBang: banGhi.soHieuVanBang,
			maSinhVien: banGhi.maSinhVien,
			hoTen: banGhi.hoTen,
			ngaySinh: dayjs(banGhi.ngaySinh),
			giaTriPhuLuc: banGhi.giaTriPhuLuc,
		});
		setHienModal(true);
	};

	const dongModal = () => {
		setHienModal(false);
	};

	const onLuu = (values: GiaTriForm) => {
		const dsVanBang = docVanBang();
		if (!dangSua) {
			const { soMoi, dsCapNhat } = laySoVaoSoMoi(values.idSoVanBang);
			luuSoVanBang(dsCapNhat);
			setSoVanBang(dsCapNhat);
			const moi: VanBang = {
				id: `vb-${Date.now()}`,
				idSoVanBang: values.idSoVanBang,
				soVaoSo: soMoi,
				soHieuVanBang: values.soHieuVanBang,
				maSinhVien: values.maSinhVien,
				hoTen: values.hoTen,
				ngaySinh: values.ngaySinh.toISOString(),
				idQuyetDinh: values.idQuyetDinh,
				giaTriPhuLuc: values.giaTriPhuLuc || {},
			};
			const dsMoi = [...dsVanBang, moi];
			luuVanBang(dsMoi);
			setDuLieu(dsMoi);
			message.success('Đã thêm thông tin văn bằng');
		} else {
			const dsMoi = dsVanBang.map((x) =>
				x.id === dangSua.id
					? {
						...x,
						idSoVanBang: values.idSoVanBang,
						soHieuVanBang: values.soHieuVanBang,
						maSinhVien: values.maSinhVien,
						hoTen: values.hoTen,
						ngaySinh: values.ngaySinh.toISOString(),
						idQuyetDinh: values.idQuyetDinh,
						giaTriPhuLuc: values.giaTriPhuLuc || {},
					}
					: x,
			);
			luuVanBang(dsMoi);
			setDuLieu(dsMoi);
			message.success('Đã cập nhật thông tin văn bằng');
		}
		setHienModal(false);
	};

	const xoaVanBang = (banGhi: VanBang) => {
		const ds = docVanBang();
		const dsMoi = ds.filter((x) => x.id !== banGhi.id);
		luuVanBang(dsMoi);
		setDuLieu(dsMoi);
		message.success('Đã xóa văn bằng');
	};

	const truongPhuLucSapXep = useMemo(() => truongPhuLuc.slice(), [truongPhuLuc]);

	const cot = [
		{
			title: 'Số vào sổ',
			dataIndex: 'soVaoSo',
			key: 'soVaoSo',
		},
		{
			title: 'Số hiệu văn bằng',
			dataIndex: 'soHieuVanBang',
			key: 'soHieuVanBang',
		},
		{
			title: 'Mã sinh viên',
			dataIndex: 'maSinhVien',
			key: 'maSinhVien',
		},
		{
			title: 'Họ tên',
			dataIndex: 'hoTen',
			key: 'hoTen',
		},
		{
			title: 'Ngày sinh',
			dataIndex: 'ngaySinh',
			key: 'ngaySinh',
			render: (val: string) => dayjs(val).format('DD/MM/YYYY'),
		},
		{
			title: 'Quyết định',
			dataIndex: 'idQuyetDinh',
			key: 'idQuyetDinh',
			render: (val: string) => {
				const qd = quyetDinh.find((x) => x.id === val);
				if (!qd) return null;
				return <Tag color='blue'>{qd.soQuyetDinh}</Tag>;
			},
		},
		...truongPhuLucSapXep.map((t) => ({
			title: t.tenHienThi,
			dataIndex: ['giaTriPhuLuc', t.ma],
			key: t.ma,
		})),
		{
			title: 'Thao tác',
			key: 'thaotac',
			render: (_: any, banGhi: VanBang) => (
				<Space>
					<Button type='link' onClick={() => moModalSua(banGhi)}>
						Sửa
					</Button>
					<Button danger type='link' onClick={() => xoaVanBang(banGhi)}>
						Xóa
					</Button>
				</Space>
			),
		},
	];

	const idSoTrongForm = Form.useWatch('idSoVanBang', form) as string | undefined;
	const dsQuyetDinhTheoSo = useMemo(() => {
		if (!idSoTrongForm) return quyetDinh;
		return quyetDinh.filter((x) => x.idSoVanBang === idSoTrongForm);
	}, [idSoTrongForm, quyetDinh]);

	const renderInputTheoKieu = (kieu: KieuDuLieu, ma: string) => {
		if (kieu === 'number') return <InputNumber style={{ width: '100%' }} />;
		if (kieu === 'date') return <DatePicker style={{ width: '100%' }} format='DD/MM/YYYY' />;
		return <Input />;
	};

	return (
		<div>
			<Space style={{ marginBottom: 16 }}>
				<Select
					allowClear
					placeholder='Lọc theo sổ văn bằng'
					style={{ width: 260 }}
					options={danhSachSo}
					value={idSoLoc}
					onChange={(val) => setIdSoLoc(val)}
				/>
				<Button type='primary' onClick={moModalThem} disabled={!soVanBang.length || !quyetDinh.length}>
					Thêm thông tin văn bằng
				</Button>
			</Space>
			<Table rowKey='id' columns={cot} dataSource={duLieuHienThi} pagination={false} />
			<Modal
				visible={hienModal}
				title={dangSua ? 'Cập nhật thông tin văn bằng' : 'Thêm thông tin văn bằng'}
				onCancel={dongModal}
				footer={null}
				destroyOnClose
			>
				<Form<GiaTriForm>
					form={form}
					layout='vertical'
					onFinish={onLuu}
					initialValues={{ giaTriPhuLuc: {} }}
				>
					<Form.Item
						label='Sổ văn bằng'
						name='idSoVanBang'
						rules={[{ required: true, message: 'Vui lòng chọn sổ văn bằng' }]}
					>
						<Select options={danhSachSo} />
					</Form.Item>
					<Form.Item
						label='Quyết định tốt nghiệp'
						name='idQuyetDinh'
						rules={[{ required: true, message: 'Vui lòng chọn quyết định' }]}
					>
						<Select
							options={dsQuyetDinhTheoSo.map((x) => ({
								label: x.soQuyetDinh,
								value: x.id,
							}))}
						/>
					</Form.Item>
					<Form.Item
						label='Số hiệu văn bằng'
						name='soHieuVanBang'
						rules={[{ required: true, message: 'Vui lòng nhập số hiệu văn bằng' }]}
					>
						<Input />
					</Form.Item>
					<Form.Item
						label='Mã sinh viên'
						name='maSinhVien'
						rules={[{ required: true, message: 'Vui lòng nhập mã sinh viên' }]}
					>
						<Input />
					</Form.Item>
					<Form.Item
						label='Họ tên sinh viên'
						name='hoTen'
						rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
					>
						<Input />
					</Form.Item>
					<Form.Item
						label='Ngày sinh'
						name='ngaySinh'
						rules={[{ required: true, message: 'Vui lòng chọn ngày sinh' }]}
					>
						<DatePicker style={{ width: '100%' }} format='DD/MM/YYYY' />
					</Form.Item>
					{truongPhuLucSapXep.map((t) => (
						<Form.Item
							key={t.id}
							label={t.tenHienThi}
							name={['giaTriPhuLuc', t.ma]}
							rules={t.batBuoc ? [{ required: true, message: 'Vui lòng nhập trường này' }] : []}
						>
							{renderInputTheoKieu(t.kieuDuLieu, t.ma)}
						</Form.Item>
					))}
					<div style={{ textAlign: 'right' }}>
						<Button onClick={dongModal} style={{ marginRight: 8 }}>
							Hủy
						</Button>
						<Button type='primary' htmlType='submit'>
							Lưu
						</Button>
					</div>
				</Form>
			</Modal>
		</div>
	);
};

export default ThongTinVanBangPage;

