import React, { useEffect, useMemo, useState } from 'react';
import { Button, DatePicker, Form, Input, Modal, Select, Space, Table, Tag, message } from 'antd';
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

const KHOA_SO_VAN_BANG = 'soVanBangList';
const KHOA_QUYET_DINH = 'quyetDinhList';

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

const luuQuyetDinh = (ds: QuyetDinh[]) => {
	localStorage.setItem(KHOA_QUYET_DINH, JSON.stringify(ds));
};

type GiaTriForm = {
	soQuyetDinh: string;
	ngayBanHanh: Dayjs;
	trichYeu: string;
	idSoVanBang: string;
};

const QuyetDinhTotNghiepPage: React.FC = () => {
	const [soVanBang, setSoVanBang] = useState<SoVanBang[]>([]);
	const [duLieu, setDuLieu] = useState<QuyetDinh[]>([]);
	const [hienModal, setHienModal] = useState(false);
	const [form] = Form.useForm<GiaTriForm>();
	const [dangSua, setDangSua] = useState<QuyetDinh | null>(null);
	const [namLoc, setNamLoc] = useState<number | undefined>(undefined);

	useEffect(() => {
		setSoVanBang(docSoVanBang());
		setDuLieu(docQuyetDinh());
	}, []);

	const danhSachNam = useMemo(
		() =>
			[...new Set(soVanBang.map((x) => x.nam))]
				.sort((a, b) => a - b)
				.map((nam) => ({ label: nam.toString(), value: nam })),
		[soVanBang],
	);

	const duLieuHienThi = useMemo(() => {
		if (!namLoc) return duLieu;
		const idSoTheoNam = soVanBang.filter((x) => x.nam === namLoc).map((x) => x.id);
		return duLieu.filter((x) => idSoTheoNam.includes(x.idSoVanBang));
	}, [duLieu, namLoc, soVanBang]);

	const moModalThem = () => {
		setDangSua(null);
		form.resetFields();
		setHienModal(true);
	};

	const moModalSua = (banGhi: QuyetDinh) => {
		setDangSua(banGhi);
		form.setFieldsValue({
			soQuyetDinh: banGhi.soQuyetDinh,
			trichYeu: banGhi.trichYeu,
			idSoVanBang: banGhi.idSoVanBang,
			ngayBanHanh: dayjs(banGhi.ngayBanHanh),
		});
		setHienModal(true);
	};

	const dongModal = () => {
		setHienModal(false);
	};

	const onLuu = (values: GiaTriForm) => {
		const dsHienTai = docQuyetDinh();
		const ngay = values.ngayBanHanh ? values.ngayBanHanh.toISOString() : dayjs().toISOString();
		if (!dangSua) {
			const moi: QuyetDinh = {
				id: `qd-${Date.now()}`,
				soQuyetDinh: values.soQuyetDinh,
				ngayBanHanh: ngay,
				trichYeu: values.trichYeu,
				idSoVanBang: values.idSoVanBang,
			};
			const dsMoi = [...dsHienTai, moi];
			luuQuyetDinh(dsMoi);
			setDuLieu(dsMoi);
			message.success('Đã thêm quyết định');
		} else {
			const dsMoi = dsHienTai.map((x) =>
				x.id === dangSua.id
					? {
						...x,
						soQuyetDinh: values.soQuyetDinh,
						ngayBanHanh: ngay,
						trichYeu: values.trichYeu,
						idSoVanBang: values.idSoVanBang,
					}
					: x,
			);
			luuQuyetDinh(dsMoi);
			setDuLieu(dsMoi);
			message.success('Đã cập nhật quyết định');
		}
		setHienModal(false);
	};

	const xoaQuyetDinh = (banGhi: QuyetDinh) => {
		const dsHienTai = docQuyetDinh();
		const dsMoi = dsHienTai.filter((x) => x.id !== banGhi.id);
		luuQuyetDinh(dsMoi);
		setDuLieu(dsMoi);
		message.success('Đã xóa quyết định');
	};

	const cot = [
		{
			title: 'Số quyết định',
			dataIndex: 'soQuyetDinh',
			key: 'soQuyetDinh',
		},
		{
			title: 'Ngày ban hành',
			dataIndex: 'ngayBanHanh',
			key: 'ngayBanHanh',
			render: (val: string) => dayjs(val).format('DD/MM/YYYY'),
		},
		{
			title: 'Trích yếu',
			dataIndex: 'trichYeu',
			key: 'trichYeu',
		},
		{
			title: 'Sổ văn bằng',
			dataIndex: 'idSoVanBang',
			key: 'idSoVanBang',
			render: (val: string) => {
				const so = soVanBang.find((x) => x.id === val);
				if (!so) return null;
				return <Tag color='blue'>{`${so.ten} (${so.nam})`}</Tag>;
			},
		},
		{
			title: 'Thao tác',
			key: 'thaotac',
			render: (_: any, banGhi: QuyetDinh) => (
				<Space>
					<Button type='link' onClick={() => moModalSua(banGhi)}>
						Sửa
					</Button>
					<Button danger type='link' onClick={() => xoaQuyetDinh(banGhi)}>
						Xóa
					</Button>
				</Space>
			),
		},
	];

	return (
		<div>
			<Space style={{ marginBottom: 16 }}>
				<Select
					allowClear
					placeholder='Lọc theo năm sổ văn bằng'
					style={{ width: 220 }}
					options={danhSachNam}
					value={namLoc}
					onChange={(val) => setNamLoc(val)}
				/>
				<Button type='primary' onClick={moModalThem} disabled={!soVanBang.length}>
					Thêm quyết định
				</Button>
			</Space>
			<Table rowKey='id' columns={cot} dataSource={duLieuHienThi} pagination={false} />
			<Modal
				visible={hienModal}
				title={dangSua ? 'Cập nhật quyết định tốt nghiệp' : 'Thêm quyết định tốt nghiệp'}
				onCancel={dongModal}
				footer={null}
				destroyOnClose
			>
				<Form<GiaTriForm> form={form} layout='vertical' onFinish={onLuu}>
					<Form.Item
						label='Số quyết định'
						name='soQuyetDinh'
						rules={[{ required: true, message: 'Vui lòng nhập số quyết định' }]}
					>
						<Input />
					</Form.Item>
					<Form.Item
						label='Ngày ban hành'
						name='ngayBanHanh'
						rules={[{ required: true, message: 'Vui lòng chọn ngày ban hành' }]}
					>
						<DatePicker style={{ width: '100%' }} format='DD/MM/YYYY' />
					</Form.Item>
					<Form.Item
						label='Thuộc sổ văn bằng'
						name='idSoVanBang'
						rules={[{ required: true, message: 'Vui lòng chọn sổ văn bằng' }]}
					>
						<Select
							options={soVanBang.map((x) => ({
								label: `${x.ten} (${x.nam})`,
								value: x.id,
							}))}
						/>
					</Form.Item>
					<Form.Item label='Trích yếu' name='trichYeu'>
						<Input.TextArea rows={3} />
					</Form.Item>
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

export default QuyetDinhTotNghiepPage;

