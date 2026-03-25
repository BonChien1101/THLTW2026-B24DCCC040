import React, { useEffect, useMemo, useState } from 'react';
import { Button, Card, DatePicker, Form, Input, InputNumber, Space, Table, Tag, Typography, message } from 'antd';
import dayjs, { Dayjs } from 'dayjs';

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

type QuyetDinh = {
	id: string;
	soQuyetDinh: string;
	ngayBanHanh: string;
	trichYeu: string;
	idSoVanBang: string;
};

type GiaTriForm = {
	soHieuVanBang?: string;
	soVaoSo?: number;
	maSinhVien?: string;
	hoTen?: string;
	ngaySinh?: Dayjs;
};

type ThongKeTraCuu = {
	[idQuyetDinh: string]: number;
};

const KHOA_VAN_BANG = 'vanBangList';
const KHOA_QUYET_DINH = 'quyetDinhList';
const KHOA_THONG_KE = 'traCuuThongKe';

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

const docThongKe = (): ThongKeTraCuu => {
	try {
		const raw = localStorage.getItem(KHOA_THONG_KE);
		if (!raw) return {};
		const parsed: ThongKeTraCuu = JSON.parse(raw);
		return parsed && typeof parsed === 'object' ? parsed : {};
	} catch {
		return {};
	}
};

const luuThongKe = (tk: ThongKeTraCuu) => {
	localStorage.setItem(KHOA_THONG_KE, JSON.stringify(tk));
};

const TraCuuVanBangPage: React.FC = () => {
	const [form] = Form.useForm<GiaTriForm>();
	const [quyetDinh, setQuyetDinh] = useState<QuyetDinh[]>([]);
	const [ketQua, setKetQua] = useState<VanBang[]>([]);
	const [thongKe, setThongKe] = useState<ThongKeTraCuu>({});

	useEffect(() => {
		setQuyetDinh(docQuyetDinh());
		setThongKe(docThongKe());
	}, []);

	const onTraCuu = (values: GiaTriForm) => {
		const dieuKien: GiaTriForm = values || {};
		const soField = [
			dieuKien.soHieuVanBang,
			dieuKien.soVaoSo,
			dieuKien.maSinhVien,
			dieuKien.hoTen,
			dieuKien.ngaySinh,
		].filter((v) => v !== undefined && v !== null && v !== '');
		if (soField.length < 2) {
			message.warning('Vui lòng nhập ít nhất 2 thông tin để tra cứu');
			return;
		}
		const ds = docVanBang();
		const kq = ds.filter((vb) => {
			if (dieuKien.soHieuVanBang && !vb.soHieuVanBang.toLowerCase().includes(dieuKien.soHieuVanBang.toLowerCase()))
				return false;
			if (dieuKien.soVaoSo && vb.soVaoSo !== dieuKien.soVaoSo) return false;
			if (dieuKien.maSinhVien && !vb.maSinhVien.toLowerCase().includes(dieuKien.maSinhVien.toLowerCase()))
				return false;
			if (dieuKien.hoTen && !vb.hoTen.toLowerCase().includes(dieuKien.hoTen.toLowerCase())) return false;
			if (dieuKien.ngaySinh) {
				const d1 = dayjs(vb.ngaySinh).startOf('day');
				const d2 = dieuKien.ngaySinh.startOf('day');
				if (!d1.isSame(d2)) return false;
			}
			return true;
		});
		setKetQua(kq);
		if (kq.length) {
			const tkHienTai = docThongKe();
			kq.forEach((vb) => {
				const id = vb.idQuyetDinh;
				tkHienTai[id] = (tkHienTai[id] || 0) + 1;
			});
			luuThongKe(tkHienTai);
			setThongKe(tkHienTai);
		}
	};

	const cotKetQua = [
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
				return (
					<Space direction='vertical' size={0}>
						<Tag color='blue'>{qd.soQuyetDinh}</Tag>
						<Typography.Text type='secondary' style={{ fontSize: 12 }}>
							{dayjs(qd.ngayBanHanh).format('DD/MM/YYYY')}
						</Typography.Text>
					</Space>
				);
			},
		},
	];

	const duLieuThongKe = useMemo(() => {
		const ds: { idQuyetDinh: string; soLuot: number }[] = Object.keys(thongKe).map((id) => ({
			idQuyetDinh: id,
			soLuot: thongKe[id],
		}));
		return ds;
	}, [thongKe]);

	const cotThongKe = [
		{
			title: 'Số quyết định',
			dataIndex: 'idQuyetDinh',
			key: 'idQuyetDinh',
			render: (val: string) => {
				const qd = quyetDinh.find((x) => x.id === val);
				if (!qd) return val;
				return qd.soQuyetDinh;
			},
		},
		{
			title: 'Ngày ban hành',
			key: 'ngayBanHanh',
			render: (_: any, rec: { idQuyetDinh: string }) => {
				const qd = quyetDinh.find((x) => x.id === rec.idQuyetDinh);
				if (!qd) return null;
				return dayjs(qd.ngayBanHanh).format('DD/MM/YYYY');
			},
		},
		{
			title: 'Số lượt tra cứu',
			dataIndex: 'soLuot',
			key: 'soLuot',
		},
	];

	return (
		<div>
			<Card title='Tra cứu văn bằng' style={{ marginBottom: 24 }}>
				<Form<GiaTriForm> form={form} layout='vertical' onFinish={onTraCuu}>
					<Space style={{ width: '100%' }} wrap>
						<Form.Item label='Số hiệu văn bằng' name='soHieuVanBang' style={{ minWidth: 220 }}>
							<Input />
						</Form.Item>
						<Form.Item label='Số vào sổ' name='soVaoSo' style={{ minWidth: 160 }}>
							<InputNumber style={{ width: '100%' }} min={1} />
						</Form.Item>
						<Form.Item label='Mã sinh viên' name='maSinhVien' style={{ minWidth: 200 }}>
							<Input />
						</Form.Item>
						<Form.Item label='Họ tên' name='hoTen' style={{ minWidth: 220 }}>
							<Input />
						</Form.Item>
						<Form.Item label='Ngày sinh' name='ngaySinh' style={{ minWidth: 200 }}>
							<DatePicker style={{ width: '100%' }} format='DD/MM/YYYY' />
						</Form.Item>
					</Space>
					<div style={{ textAlign: 'right' }}>
						<Button
							style={{ marginRight: 8 }}
							onClick={() => {
								form.resetFields();
								setKetQua([]);
						}}
						>
							Làm mới
						</Button>
						<Button type='primary' htmlType='submit'>
							Tra cứu
						</Button>
					</div>
				</Form>
			</Card>
			<Card title='Kết quả tra cứu' style={{ marginBottom: 24 }}>
				<Table rowKey='id' columns={cotKetQua} dataSource={ketQua} pagination={false} />
			</Card>
			<Card title='Thống kê lượt tra cứu theo quyết định tốt nghiệp'>
				<Table
					rowKey='idQuyetDinh'
					columns={cotThongKe}
					dataSource={duLieuThongKe}
					pagination={false}
				/>
			</Card>
		</div>
	);
};

export default TraCuuVanBangPage;

