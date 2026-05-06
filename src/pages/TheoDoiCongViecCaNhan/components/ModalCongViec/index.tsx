import { Button, DatePicker, Form, Input, Select, Space } from 'antd';
import moment from 'moment';
import { useMemo } from 'react';
import { useModel } from 'umi';

const { TextArea } = Input;

const ModalCongViec = (props: { congViec?: TheoDoiCongViecCaNhan.CongViec }) => {
	const { congViec } = props;
	const { themCongViec, capNhatCongViec, setHienForm, dangSua } = useModel('theodoicongvieccanhan');
	const [form] = Form.useForm();

	const giaTriKhoiTao = useMemo(() => {
		if (!congViec) {
			return {
				ten: '',
				moTa: '',
				deadline: undefined,
				mucDoUuTien: 'Trung bình',
				trangThai: 'can_lam',
			};
		}
		return {
			ten: congViec.ten,
			moTa: congViec.moTa,
			deadline: congViec.deadline ? moment(congViec.deadline) : undefined,
			mucDoUuTien: congViec.mucDoUuTien,
			trangThai: congViec.trangThai,
		};
	}, [congViec]);

	return (
		<Form
			form={form}
			layout='vertical'
			initialValues={giaTriKhoiTao}
			onFinish={(v) => {
				const deadline = v.deadline ? (v.deadline as moment.Moment).toISOString() : undefined;
				if (dangSua && congViec) {
					capNhatCongViec(congViec.id, {
						ten: v.ten,
						moTa: v.moTa,
						deadline,
						mucDoUuTien: v.mucDoUuTien,
						trangThai: v.trangThai,
					});
				} else {
					themCongViec({
						ten: v.ten,
						moTa: v.moTa,
						deadline,
						mucDoUuTien: v.mucDoUuTien,
						trangThai: v.trangThai,
					});
				}
				setHienForm(false);
			}}
		>
			<Form.Item label='Tên task' name='ten' rules={[{ required: true, message: 'Nhập tên task' }]}>
				<Input placeholder='Ví dụ: Hoàn thiện báo cáo' />
			</Form.Item>
			<Form.Item label='Mô tả' name='moTa'>
				<TextArea rows={4} placeholder='Mô tả ngắn' />
			</Form.Item>
			<Form.Item label='Deadline' name='deadline'>
				<DatePicker showTime style={{ width: '100%' }} />
			</Form.Item>
			<Form.Item label='Mức độ ưu tiên' name='mucDoUuTien' rules={[{ required: true, message: 'Chọn mức độ ưu tiên' }]}>
				<Select
					options={[
						{ value: 'Cao', label: 'Cao' },
						{ value: 'Trung bình', label: 'Trung bình' },
						{ value: 'Thấp', label: 'Thấp' },
					]}
				/>
			</Form.Item>
			<Form.Item label='Trạng thái' name='trangThai' rules={[{ required: true, message: 'Chọn trạng thái' }]}>
				<Select
					options={[
						{ value: 'can_lam', label: 'Cần làm' },
						{ value: 'dang_lam', label: 'Đang làm' },
						{ value: 'hoan_thanh', label: 'Hoàn thành' },
					]}
				/>
			</Form.Item>
			<Space style={{ width: '100%', justifyContent: 'flex-end' }}>
				<Button onClick={() => setHienForm(false)}>Hủy</Button>
				<Button type='primary' htmlType='submit'>
					{dangSua ? 'Lưu' : 'Thêm'}
				</Button>
			</Space>
		</Form>
	);
};

export default ModalCongViec;
