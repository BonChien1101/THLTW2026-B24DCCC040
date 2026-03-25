import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Modal, Radio, Select, Space, Table, Tag, message } from 'antd';

type KieuDuLieu = 'string' | 'number' | 'date';

type TruongPhuLuc = {
	id: string;
	ma: string;
	tenHienThi: string;
	kieuDuLieu: KieuDuLieu;
	batBuoc: boolean;
};

const KHOA_PHU_LUC = 'extraFieldList';

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

const luuPhuLuc = (ds: TruongPhuLuc[]) => {
	localStorage.setItem(KHOA_PHU_LUC, JSON.stringify(ds));
};

type GiaTriForm = {
	ma: string;
	tenHienThi: string;
	kieuDuLieu: KieuDuLieu;
	batBuoc: boolean;
};

const CauHinhPhuLucPage: React.FC = () => {
	const [duLieu, setDuLieu] = useState<TruongPhuLuc[]>([]);
	const [hienModal, setHienModal] = useState(false);
	const [form] = Form.useForm<GiaTriForm>();
	const [dangSua, setDangSua] = useState<TruongPhuLuc | null>(null);

	useEffect(() => {
		setDuLieu(docPhuLuc());
	}, []);

	const moModalThem = () => {
		setDangSua(null);
		form.resetFields();
		form.setFieldsValue({ kieuDuLieu: 'string', batBuoc: false } as any);
		setHienModal(true);
	};

	const moModalSua = (banGhi: TruongPhuLuc) => {
		setDangSua(banGhi);
		form.setFieldsValue({
			ma: banGhi.ma,
			tenHienThi: banGhi.tenHienThi,
			kieuDuLieu: banGhi.kieuDuLieu,
			batBuoc: banGhi.batBuoc,
		});
		setHienModal(true);
	};

	const dongModal = () => {
		setHienModal(false);
	};

	const onLuu = (values: GiaTriForm) => {
		const dsHienTai = docPhuLuc();
		if (!dangSua) {
			if (dsHienTai.some((x) => x.ma === values.ma)) {
				message.error('Mã trường đã tồn tại');
				return;
			}
			const moi: TruongPhuLuc = {
				id: `pl-${Date.now()}`,
				ma: values.ma,
				tenHienThi: values.tenHienThi,
				kieuDuLieu: values.kieuDuLieu,
				batBuoc: values.batBuoc,
			};
			const dsMoi = [...dsHienTai, moi];
			luuPhuLuc(dsMoi);
			setDuLieu(dsMoi);
			message.success('Đã thêm trường phụ lục');
		} else {
			const dsMoi = dsHienTai.map((x) =>
				x.id === dangSua.id
					? {
						...x,
						ma: values.ma,
						tenHienThi: values.tenHienThi,
						kieuDuLieu: values.kieuDuLieu,
						batBuoc: values.batBuoc,
					}
					: x,
			);
			luuPhuLuc(dsMoi);
			setDuLieu(dsMoi);
			message.success('Đã cập nhật trường phụ lục');
		}
		setHienModal(false);
	};

	const xoaTruong = (banGhi: TruongPhuLuc) => {
		const dsHienTai = docPhuLuc();
		const dsMoi = dsHienTai.filter((x) => x.id !== banGhi.id);
		luuPhuLuc(dsMoi);
		setDuLieu(dsMoi);
		message.success('Đã xóa trường phụ lục');
	};

	const cot = [
		{
			title: 'Mã trường',
			dataIndex: 'ma',
			key: 'ma',
		},
		{
			title: 'Tên hiển thị',
			dataIndex: 'tenHienThi',
			key: 'tenHienThi',
		},
		{
			title: 'Kiểu dữ liệu',
			dataIndex: 'kieuDuLieu',
			key: 'kieuDuLieu',
			render: (val: KieuDuLieu) => {
				if (val === 'string') return <Tag color='blue'>Chuỗi</Tag>;
				if (val === 'number') return <Tag color='green'>Số</Tag>;
				return <Tag color='purple'>Ngày</Tag>;
			},
		},
		{
			title: 'Bắt buộc',
			dataIndex: 'batBuoc',
			key: 'batBuoc',
			render: (val: boolean) => (val ? <Tag color='red'>Có</Tag> : <Tag>Không</Tag>),
		},
		{
			title: 'Thao tác',
			key: 'thaotac',
			render: (_: any, banGhi: TruongPhuLuc) => (
				<Space>
					<Button type='link' onClick={() => moModalSua(banGhi)}>
						Sửa
					</Button>
					<Button danger type='link' onClick={() => xoaTruong(banGhi)}>
						Xóa
					</Button>
				</Space>
			),
		},
	];

	return (
		<div>
			<Space style={{ marginBottom: 16 }}>
				<Button type='primary' onClick={moModalThem}>
					Thêm trường phụ lục
				</Button>
			</Space>
			<Table rowKey='id' columns={cot} dataSource={duLieu} pagination={false} />
			<Modal
				visible={hienModal}
				title={dangSua ? 'Cập nhật trường phụ lục' : 'Thêm trường phụ lục'}
				onCancel={dongModal}
				footer={null}
				destroyOnClose
			>
				<Form<GiaTriForm> form={form} layout='vertical' onFinish={onLuu}>
					<Form.Item
						label='Mã trường'
						name='ma'
						rules={[{ required: true, message: 'Vui lòng nhập mã trường' }]}
					>
						<Input />
					</Form.Item>
					<Form.Item
						label='Tên hiển thị'
						name='tenHienThi'
						rules={[{ required: true, message: 'Vui lòng nhập tên hiển thị' }]}
					>
						<Input />
					</Form.Item>
					<Form.Item
						label='Kiểu dữ liệu'
						name='kieuDuLieu'
						rules={[{ required: true, message: 'Vui lòng chọn kiểu dữ liệu' }]}
					>
						<Select
							options={[
								{ label: 'Chuỗi', value: 'string' },
								{ label: 'Số', value: 'number' },
								{ label: 'Ngày', value: 'date' },
							]}
						/>
					</Form.Item>
					<Form.Item label='Bắt buộc' name='batBuoc' valuePropName='checked'>
						<Radio.Group>
							<Radio value={true}>Có</Radio>
							<Radio value={false}>Không</Radio>
						</Radio.Group>
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

export default CauHinhPhuLucPage;

