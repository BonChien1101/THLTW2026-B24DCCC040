import React, { useEffect, useState } from 'react';
import { Button, Form, Input, InputNumber, Modal, Space, Table, message } from 'antd';

type SoVanBang = {
	id: string;
	nam: number;
	ten: string;
	soHienTai: number;
};

const KHOA_LUU_TRU = 'soVanBangList';
const docDanhSach = (): SoVanBang[] => {
	try {
		const raw = localStorage.getItem(KHOA_LUU_TRU);
		if (!raw) return [];
		const parsed: SoVanBang[] = JSON.parse(raw);
		return Array.isArray(parsed) ? parsed : [];
	} catch (e) {
		return [];
	}
};

const luuDanhSach = (ds: SoVanBang[]) => {
	localStorage.setItem(KHOA_LUU_TRU, JSON.stringify(ds));
};

const SoVanBangPage: React.FC = () => {
	const [duLieu, setDuLieu] = useState<SoVanBang[]>([]);
	const [hienModal, setHienModal] = useState(false);
	const [form] = Form.useForm();
	const [dangSua, setDangSua] = useState<SoVanBang | null>(null);

	useEffect(() => {
		setDuLieu(docDanhSach());
	}, []);

	const moModalThem = () => {
		setDangSua(null);
		form.resetFields();
		setHienModal(true);
	};

	const moModalSua = (banGhi: SoVanBang) => {
		setDangSua(banGhi);
		form.setFieldsValue({ nam: banGhi.nam, ten: banGhi.ten });
		setHienModal(true);
	};

	const dongModal = () => {
		setHienModal(false);
	};

	const onLuu = (values: { nam: number; ten: string }) => {
		const dsHienTai = docDanhSach();
		if (!dangSua) {
			if (dsHienTai.some((x) => x.nam === values.nam)) {
				message.error('Mỗi năm chỉ có một sổ văn bằng');
				return;
			}
			const moi: SoVanBang = {
				id: `svb-${Date.now()}`,
				nam: values.nam,
				ten: values.ten || `Sổ văn bằng năm ${values.nam}`,
				soHienTai: 0,
			};
			const dsMoi = [...dsHienTai, moi];
			luuDanhSach(dsMoi);
			setDuLieu(dsMoi);
			message.success('Đã tạo sổ văn bằng');
		} else {
			const dsMoi = dsHienTai.map((x) =>
				x.id === dangSua.id
					? { ...x, ten: values.ten || x.ten, nam: values.nam }
					: x,
			);
			luuDanhSach(dsMoi);
			setDuLieu(dsMoi);
			message.success('Đã cập nhật sổ văn bằng');
		}
		setHienModal(false);
	};

	const xoaSo = (banGhi: SoVanBang) => {
		const dsHienTai = docDanhSach();
		const dsMoi = dsHienTai.filter((x) => x.id !== banGhi.id);
		luuDanhSach(dsMoi);
		setDuLieu(dsMoi);
		message.success('Đã xóa sổ văn bằng');
	};

	const cot = [
		{
			title: 'Năm',
			dataIndex: 'nam',
			key: 'nam',
		},
		{
			title: 'Tên sổ',
			dataIndex: 'ten',
			key: 'ten',
		},
		{
			title: 'Số vào sổ hiện tại',
			dataIndex: 'soHienTai',
			key: 'soHienTai',
		},
		{
			title: 'Thao tác',
			key: 'thaotac',
			render: (_: any, banGhi: SoVanBang) => (
				<Space>
					<Button type='link' onClick={() => moModalSua(banGhi)}>
						Sửa
					</Button>
					<Button type='link' danger onClick={() => xoaSo(banGhi)}>
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
					Thêm sổ văn bằng
				</Button>
			</Space>
			<Table rowKey='id' columns={cot} dataSource={duLieu} pagination={false} />
				<Modal
				visible={hienModal}
				title={dangSua ? 'Cập nhật sổ văn bằng' : 'Thêm sổ văn bằng'}
				onCancel={dongModal}
				footer={null}
				destroyOnClose
			>
				<Form form={form} layout='vertical' onFinish={onLuu}>
					<Form.Item
						label='Năm'
						name='nam'
						rules={[{ required: true, message: 'Vui lòng nhập năm' }]}
					>
						<InputNumber style={{ width: '100%' }} min={2000} max={2100} />
					</Form.Item>
					<Form.Item label='Tên sổ' name='ten'>
						<Input />
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

export default SoVanBangPage;

