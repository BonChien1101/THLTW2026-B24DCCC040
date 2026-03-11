import React, { useEffect, useMemo, useState } from 'react';
import {
	Button, Card, Col, Form, Input, InputNumber, message, Row, Select, Tabs, Table, Tag, Space,
} from 'antd';
import type { ColumnsType } from 'antd/lib/table';

const { TabPane } = Tabs;
const { Option } = Select;


// Kiểu dữ liệu 
type Difficulty = 'DE' | 'TB' | 'KHO' | 'RAT_KHO';

interface KnowledgeBlock {
	id: number;
	ten: string;
}

interface Subject {
	id: number;
	maMon: string;
	tenMon: string;
	soTinChi: number;
}

interface Question {
	id: number;
	idMon: number;
	idKhoi: number;
	noiDung: string;
	mucDo: Difficulty;
}

interface StructureDetail {
	id: number;
	idCauTruc: number;
	idKhoi: number;
	mucDo: Difficulty;
	soLuong: number;
}

interface ExamStructure {
	id: number;
	ten: string;
	idMon: number;
}

interface ExamDetail {
	id: number;
	idDe: number;
	idCauHoi: number;
}

interface Exam {
	id: number;
	ten: string;
	idMon: number;
	idCauTruc: number | null;
}

const difficultyLabel: Record<Difficulty, string> = {
	DE: 'Dễ',
	TB: 'Trung bình',
	KHO: 'Khó',
	RAT_KHO: 'Rất khó',
};

const QuanLiDeThiPage: React.FC = () => {

	const [khoiKienThuc, setKhoiKienThuc] = useState<KnowledgeBlock[]>([]);
	const [monHoc, setMonHoc] = useState<Subject[]>([]);
	const [cauHoi, setCauHoi] = useState<Question[]>([]);
	const [cauTrucDe, setCauTrucDe] = useState<ExamStructure[]>([]);
	const [chiTietCauTruc, setChiTietCauTruc] = useState<StructureDetail[]>([]);
	const [deThi, setDeThi] = useState<Exam[]>([]);
	const [chiTietDeThi, setChiTietDeThi] = useState<ExamDetail[]>([]);
	const [formKhoi] = Form.useForm();
	const [formMon] = Form.useForm();
	const [formCauHoi] = Form.useForm();
	const [formCauTruc] = Form.useForm();
	const [formChiTietCauTruc] = Form.useForm();
	const [formSinhDe] = Form.useForm();

	const nextId = (items: { id: number }[]): number => {
		if (!items.length) return 1;
		return Math.max(...items.map((i) => i.id)) + 1;
	};

	const STORAGE_KEY = 'ltw_quan_li_de_thi';

	interface StoredData {
		khoiKienThuc: KnowledgeBlock[];
		monHoc: Subject[];
		cauHoi: Question[];
		cauTrucDe: ExamStructure[];
		chiTietCauTruc: StructureDetail[];
		deThi: Exam[];
		chiTietDeThi: ExamDetail[];
	}

	const defaultSeedData: StoredData = {
		khoiKienThuc: [
			{ id: 1, ten: 'Tổng quan React' },
			{ id: 2, ten: 'JSX & Component cơ bản' },
			{ id: 3, ten: 'Hooks nâng cao' },
			{ id: 4, ten: 'Quản lý state' },
			{ id: 5, ten: 'Routing' },
			{ id: 6, ten: 'TypeScript cơ bản' },
			{ id: 7, ten: 'Kết nối API' },
		],
		monHoc: [
			{ id: 1, maMon: 'LTW1', tenMon: 'Lập trình Web 1', soTinChi: 3 },
			{ id: 2, maMon: 'LTW2', tenMon: 'Lập trình Web 2', soTinChi: 3 },
			{ id: 3, maMon: 'JSNC', tenMon: 'JavaScript nâng cao', soTinChi: 3 },
			{ id: 4, maMon: 'TS101', tenMon: 'TypeScript 101', soTinChi: 2 },
		],
		cauHoi: [
			{
				id: 1,
				idMon: 1,
				idKhoi: 1,
				noiDung: 'React là gì? Nêu khái niệm cơ bản.',
				mucDo: 'DE',
			},
			{
				id: 2,
				idMon: 1,
				idKhoi: 2,
				noiDung: 'Sự khác nhau giữa component function và class?',
				mucDo: 'TB',
			},
			{
				id: 3,
				idMon: 1,
				idKhoi: 3,
				noiDung: 'Trình bày useState và useEffect, ví dụ minh hoạ.',
				mucDo: 'TB',
			},
			{
				id: 4,
				idMon: 1,
				idKhoi: 3,
				noiDung: 'useMemo dùng để làm gì? Khi nào nên dùng?',
				mucDo: 'KHO',
			},
			{
				id: 5,
				idMon: 2,
				idKhoi: 6,
				noiDung: 'Khai báo kiểu cho props trong TypeScript như thế nào?',
				mucDo: 'DE',
			},
			{
				id: 6,
				idMon: 1,
				idKhoi: 4,
				noiDung: 'So sánh state trong component và useState hook.',
				mucDo: 'TB',
			},
			{
				id: 7,
				idMon: 1,
				idKhoi: 4,
				noiDung: 'Giải thích quy trình cập nhật state bất đồng bộ trong React.',
				mucDo: 'KHO',
			},
			{
				id: 8,
				idMon: 1,
				idKhoi: 5,
				noiDung: 'React Router dùng để làm gì? Trình bày cách cấu hình route cơ bản.',
				mucDo: 'DE',
			},
			{
				id: 9,
				idMon: 1,
				idKhoi: 5,
				noiDung: 'Khác nhau giữa BrowserRouter và HashRouter.',
				mucDo: 'TB',
			},
			{
				id: 10,
				idMon: 3,
				idKhoi: 2,
				noiDung: 'Giải thích cơ chế hoisting của function và var trong JavaScript.',
				mucDo: 'KHO',
			},
			{
				id: 11,
				idMon: 3,
				idKhoi: 2,
				noiDung: 'Sự khác nhau giữa let, const và var.',
				mucDo: 'DE',
			},
			{
				id: 12,
				idMon: 3,
				idKhoi: 7,
				noiDung: 'Fetch API là gì? Ví dụ gọi API GET đơn giản.',
				mucDo: 'DE',
			},
			{
				id: 13,
				idMon: 3,
				idKhoi: 7,
				noiDung: 'Xử lý lỗi khi gọi API trong JavaScript như thế nào?',
				mucDo: 'TB',
			},
			{
				id: 14,
				idMon: 4,
				idKhoi: 6,
				noiDung: 'Type alias và interface khác nhau như thế nào trong TypeScript?',
				mucDo: 'TB',
			},
			{
				id: 15,
				idMon: 4,
				idKhoi: 6,
				noiDung: 'Trình bày Generic trong TypeScript với ví dụ minh hoạ.',
				mucDo: 'KHO',
			},
		],
		cauTrucDe: [
			{ id: 1, ten: 'Giữa kỳ LTW1', idMon: 1 },
			{ id: 2, ten: 'Cuối kỳ LTW1', idMon: 1 },
			{ id: 3, ten: 'Giữa kỳ JS nâng cao', idMon: 3 },
			{ id: 4, ten: 'Giữa kỳ TypeScript 101', idMon: 4 },
		],
		chiTietCauTruc: [
			// Giữa kỳ LTW1
			{ id: 1, idCauTruc: 1, idKhoi: 1, mucDo: 'DE', soLuong: 2 },
			{ id: 2, idCauTruc: 1, idKhoi: 2, mucDo: 'TB', soLuong: 2 },
			{ id: 3, idCauTruc: 1, idKhoi: 3, mucDo: 'KHO', soLuong: 1 },
			// Cuối kỳ LTW1
			{ id: 4, idCauTruc: 2, idKhoi: 1, mucDo: 'DE', soLuong: 2 },
			{ id: 5, idCauTruc: 2, idKhoi: 4, mucDo: 'TB', soLuong: 2 },
			{ id: 6, idCauTruc: 2, idKhoi: 5, mucDo: 'TB', soLuong: 1 },
			// Giữa kỳ JS nâng cao
			{ id: 7, idCauTruc: 3, idKhoi: 2, mucDo: 'DE', soLuong: 2 },
			{ id: 8, idCauTruc: 3, idKhoi: 7, mucDo: 'TB', soLuong: 2 },
			// Giữa kỳ TS 101
			{ id: 9, idCauTruc: 4, idKhoi: 6, mucDo: 'DE', soLuong: 1 },
			{ id: 10, idCauTruc: 4, idKhoi: 6, mucDo: 'TB', soLuong: 1 },
		],
		deThi: [],
		chiTietDeThi: [],
	};

	const saveToStorage = (data: StoredData) => {
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
		} catch (error) {
			console.error('Lưu localStorage thất bại', error);
		}
	};

	const loadFromStorage = (): StoredData | null => {
		try {
			const raw = localStorage.getItem(STORAGE_KEY);
			if (!raw) return null;
			return JSON.parse(raw) as StoredData;
		} catch (error) {
			console.error('Đọc localStorage thất bại', error);
			return null;
		}
	};

	useEffect(() => {
		const stored = loadFromStorage();
		const data = stored ?? defaultSeedData;

		setKhoiKienThuc(data.khoiKienThuc);
		setMonHoc(data.monHoc);
		setCauHoi(data.cauHoi);
		setCauTrucDe(data.cauTrucDe);
		setChiTietCauTruc(data.chiTietCauTruc);
		setDeThi(data.deThi);
		setChiTietDeThi(data.chiTietDeThi);
	}, []);

	useEffect(() => {
		const data: StoredData = {
			khoiKienThuc,
			monHoc,
			cauHoi,
			cauTrucDe,
			chiTietCauTruc,
			deThi,
			chiTietDeThi,
		};
		
		if (khoiKienThuc.length || monHoc.length || cauHoi.length || cauTrucDe.length) {
			saveToStorage(data);
		}
	}, [khoiKienThuc, monHoc, cauHoi, cauTrucDe, chiTietCauTruc, deThi, chiTietDeThi]);

	const khoiColumns: ColumnsType<KnowledgeBlock> = [
		{
			title: 'ID',
			dataIndex: 'id',
			width: 80,
		},
		{
			title: 'Tên khối kiến thức',
			dataIndex: 'ten',
		},
	];

	const handleAddKhoi = (values: { ten: string }) => {
		const item: KnowledgeBlock = {
			id: nextId(khoiKienThuc),
			ten: values.ten.trim(),
		};
		setKhoiKienThuc((prev) => [...prev, item]);
		formKhoi.resetFields();
		message.success('Đã thêm khối kiến thức');
	};

	const monColumns: ColumnsType<Subject> = [
		{
			title: 'ID',
			dataIndex: 'id',
			width: 60,
		},
		{
			title: 'Mã môn',
			dataIndex: 'maMon',
		},
		{
			title: 'Tên môn',
			dataIndex: 'tenMon',
		},
		{
			title: 'Số tín chỉ',
			dataIndex: 'soTinChi',
			width: 100,
		},
	];

	const handleAddMon = (values: { maMon: string; tenMon: string; soTinChi: number }) => {
		const item: Subject = {
			id: nextId(monHoc),
			maMon: values.maMon.trim(),
			tenMon: values.tenMon.trim(),
			soTinChi: values.soTinChi,
		};
		setMonHoc((prev) => [...prev, item]);
		formMon.resetFields();
		message.success('Đã thêm môn học');
	};

	
	const cauHoiColumns: ColumnsType<Question & { mon?: string; khoi?: string }> = [
		{
			title: 'ID',
			dataIndex: 'id',
			width: 60,
		},
		{
			title: 'Môn học',
			dataIndex: 'mon',
		},
		{
			title: 'Khối kiến thức',
			dataIndex: 'khoi',
		},
		{
			title: 'Mức độ',
			dataIndex: 'mucDo',
			render: (val: Difficulty) => <Tag color='blue'>{difficultyLabel[val]}</Tag>,
			width: 120,
		},
		{
			title: 'Nội dung câu hỏi',
			dataIndex: 'noiDung',
		},
	];

	const cauHoiDataSource = useMemo(
		() =>
			cauHoi.map((q) => ({
				...q,
				mon: monHoc.find((m) => m.id === q.idMon)?.tenMon,
				khoi: khoiKienThuc.find((k) => k.id === q.idKhoi)?.ten,
			})),
		[cauHoi, monHoc, khoiKienThuc],
	);

	const handleAddCauHoi = (values: {
		idMon: number;
		idKhoi: number;
		mucDo: Difficulty;
		noiDung: string;
	}) => {
		const item: Question = {
			id: nextId(cauHoi),
			...values,
		};
		setCauHoi((prev) => [...prev, item]);
		formCauHoi.resetFields();
		message.success('Đã thêm câu hỏi');
	};

	const cauTrucColumns: ColumnsType<ExamStructure & { mon?: string; tongSoCau: number }> = [
		{ title: 'ID', dataIndex: 'id', width: 60 },
		{ title: 'Tên cấu trúc', dataIndex: 'ten' },
		{ title: 'Môn học', dataIndex: 'mon' },
		{ title: 'Tổng số câu', dataIndex: 'tongSoCau', width: 120 },
	];

	const cauTrucDataSource = useMemo(
		() =>
			cauTrucDe.map((ct) => {
				const chiTiet = chiTietCauTruc.filter((c) => c.idCauTruc === ct.id);
				return {
					...ct,
					mon: monHoc.find((m) => m.id === ct.idMon)?.tenMon,
					tongSoCau: chiTiet.reduce((sum, x) => sum + x.soLuong, 0),
				};
			}),
		[cauTrucDe, chiTietCauTruc, monHoc],
	);

	const chiTietCauTrucColumns: ColumnsType<StructureDetail & { khoi?: string }> = [
		{ title: 'ID', dataIndex: 'id', width: 60 },
		{ title: 'Khối kiến thức', dataIndex: 'khoi' },
		{
			title: 'Mức độ',
			dataIndex: 'mucDo',
			render: (val: Difficulty) => <Tag color='blue'>{difficultyLabel[val]}</Tag>,
			width: 120,
		},
		{ title: 'Số lượng câu', dataIndex: 'soLuong', width: 120 },
	];

	const handleAddCauTruc = (values: { ten: string; idMon: number }) => {
		const item: ExamStructure = {
			id: nextId(cauTrucDe),
			...values,
		};
		setCauTrucDe((prev) => [...prev, item]);
		formCauTruc.resetFields();
		message.success('Đã thêm cấu trúc đề');
	};

	const handleAddChiTietCauTruc = (values: {
		idCauTruc: number;
		idKhoi: number;
		mucDo: Difficulty;
		soLuong: number;
	}) => {
		const item: StructureDetail = {
			id: nextId(chiTietCauTruc),
			...values,
		};
		setChiTietCauTruc((prev) => [...prev, item]);
		formChiTietCauTruc.resetFields();
		message.success('Đã thêm dòng chi tiết cấu trúc đề');
	};


	const deThiColumns: ColumnsType<Exam & { mon?: string; soCau?: number }> = [
		{ title: 'ID', dataIndex: 'id', width: 60 },
		{ title: 'Tên đề', dataIndex: 'ten' },
		{ title: 'Môn học', dataIndex: 'mon' },
		{ title: 'Số câu', dataIndex: 'soCau', width: 100 },
	];

	const deThiDataSource = useMemo(
		() =>
			deThi.map((d) => {
				const dsChiTiet = chiTietDeThi.filter((ct) => ct.idDe === d.id);
				return {
					...d,
					mon: monHoc.find((m) => m.id === d.idMon)?.tenMon,
					soCau: dsChiTiet.length,
				};
			}),
		[deThi, chiTietDeThi, monHoc],
	);


	const handleSinhDe = (values: { idCauTruc: number; tenDe: string }) => {
		const cauTruc = cauTrucDe.find((c) => c.id === values.idCauTruc);
		if (!cauTruc) {
			message.error('Không tìm thấy cấu trúc đề');
			return;
		}

		const dsChiTiet = chiTietCauTruc.filter((c) => c.idCauTruc === cauTruc.id);
		if (!dsChiTiet.length) {
			message.error('Cấu trúc đề chưa có chi tiết');
			return;
		}


		for (const dong of dsChiTiet) {
			const dsCauHoiPhuHop = cauHoi.filter(
				(ch) =>
					ch.idMon === cauTruc.idMon &&
					ch.idKhoi === dong.idKhoi &&
					ch.mucDo === dong.mucDo,
			);
			if (dsCauHoiPhuHop.length < dong.soLuong) {
				const tenKhoi = khoiKienThuc.find((k) => k.id === dong.idKhoi)?.ten ?? '';
				message.error(
					`Không đủ câu hỏi cho khối "${tenKhoi}" mức độ "${difficultyLabel[dong.mucDo]}". Cần ${dong.soLuong}, có ${dsCauHoiPhuHop.length}.`,
				);
				return;
			}
		}


		const selectedQuestionIds: number[] = [];
		for (const dong of dsChiTiet) {
			const dsCauHoiPhuHop = cauHoi.filter(
				(ch) =>
					ch.idMon === cauTruc.idMon &&
					ch.idKhoi === dong.idKhoi &&
					ch.mucDo === dong.mucDo,
			);
	
			const shuffled = [...dsCauHoiPhuHop].sort(() => Math.random() - 0.5);
			selectedQuestionIds.push(...shuffled.slice(0, dong.soLuong).map((x) => x.id));
		}

		const newExam: Exam = {
			id: nextId(deThi),
			idMon: cauTruc.idMon,
			idCauTruc: cauTruc.id,
			ten: values.tenDe.trim(),
		};
		setDeThi((prev) => [...prev, newExam]);

		const startId = nextId(chiTietDeThi);
		const newChiTiet: ExamDetail[] = selectedQuestionIds.map((qid, index) => ({
			id: startId + index,
			idDe: newExam.id,
			idCauHoi: qid,
		}));
		setChiTietDeThi((prev) => [...prev, ...newChiTiet]);

		formSinhDe.resetFields();
		message.success('Đã sinh đề thi thành công');
	};

	return (
		<Card title='Quản lý ngân hàng câu hỏi & tạo đề thi'>
			<Tabs defaultActiveKey='khoi'>
				<TabPane tab='1. Khối kiến thức' key='khoi'>
					<Row gutter={16}>
						<Col span={10}>
							<Card title='Thêm khối kiến thức' size='small'>
								<Form form={formKhoi} layout='vertical' onFinish={handleAddKhoi}>
									<Form.Item
										label='Tên khối kiến thức'
										name='ten'
										rules={[{ required: true, message: 'Nhập tên khối kiến thức' }]}
									>
										<Input placeholder='VD: Tổng quan, Chuyên sâu...' />
									</Form.Item>
									<Form.Item>
										<Button type='primary' htmlType='submit'>
											Thêm
										</Button>
									</Form.Item>
								</Form>
							</Card>
						</Col>
						<Col span={14}>
							<Card title='Danh sách khối kiến thức' size='small'>
								<Table
									rowKey='id'
									dataSource={khoiKienThuc}
									columns={khoiColumns}
									pagination={false}
								/>
							</Card>
						</Col>
					</Row>
				</TabPane>

				<TabPane tab='2. Môn học' key='mon'>
					<Row gutter={16}>
						<Col span={10}>
							<Card title='Thêm môn học' size='small'>
								<Form form={formMon} layout='vertical' onFinish={handleAddMon}>
									<Form.Item
										label='Mã môn'
										name='maMon'
										rules={[{ required: true, message: 'Nhập mã môn' }]}
									>
										<Input />
									</Form.Item>
									<Form.Item
										label='Tên môn'
										name='tenMon'
										rules={[{ required: true, message: 'Nhập tên môn' }]}
									>
										<Input />
									</Form.Item>
									<Form.Item
										label='Số tín chỉ'
										name='soTinChi'
										rules={[{ required: true, message: 'Nhập số tín chỉ' }]}
									>
										<InputNumber min={1} style={{ width: '100%' }} />
									</Form.Item>
									<Form.Item>
										<Button type='primary' htmlType='submit'>
											Thêm
										</Button>
									</Form.Item>
								</Form>
							</Card>
						</Col>
						<Col span={14}>
							<Card title='Danh sách môn học' size='small'>
								<Table
									rowKey='id'
									dataSource={monHoc}
									columns={monColumns}
									pagination={false}
								/>
							</Card>
						</Col>
					</Row>
				</TabPane>

				<TabPane tab='3. Ngân hàng câu hỏi' key='cauhoi'>
					<Row gutter={16}>
						<Col span={10}>
							<Card title='Thêm câu hỏi' size='small'>
								<Form form={formCauHoi} layout='vertical' onFinish={handleAddCauHoi}>
									<Form.Item
										label='Môn học'
										name='idMon'
										rules={[{ required: true, message: 'Chọn môn học' }]}
									>
										<Select placeholder='Chọn môn'>
											{monHoc.map((m) => (
												<Option key={m.id} value={m.id}>
													{m.tenMon}
												</Option>
											))}
										</Select>
									</Form.Item>
									<Form.Item
										label='Khối kiến thức'
										name='idKhoi'
										rules={[{ required: true, message: 'Chọn khối kiến thức' }]}
									>
										<Select placeholder='Chọn khối kiến thức'>
											{khoiKienThuc.map((k) => (
												<Option key={k.id} value={k.id}>
													{k.ten}
												</Option>
											))}
										</Select>
									</Form.Item>
									<Form.Item
										label='Mức độ khó'
										name='mucDo'
										rules={[{ required: true, message: 'Chọn mức độ' }]}
									>
										<Select placeholder='Chọn mức độ'>
											<Option value='DE'>Dễ</Option>
											<Option value='TB'>Trung bình</Option>
											<Option value='KHO'>Khó</Option>
											<Option value='RAT_KHO'>Rất khó</Option>
										</Select>
									</Form.Item>
									<Form.Item
										label='Nội dung câu hỏi'
										name='noiDung'
										rules={[{ required: true, message: 'Nhập nội dung câu hỏi' }]}
									>
										<Input.TextArea rows={4} />
									</Form.Item>
									<Form.Item>
										<Button type='primary' htmlType='submit'>
											Thêm câu hỏi
										</Button>
									</Form.Item>
								</Form>
							</Card>
						</Col>
						<Col span={14}>
							<Card title='Danh sách câu hỏi' size='small'>
								<Table
									rowKey='id'
									dataSource={cauHoiDataSource}
									columns={cauHoiColumns}
									scroll={{ y: 400 }}
								/>
							</Card>
						</Col>
					</Row>
				</TabPane>

				<TabPane tab='4. Cấu trúc & sinh đề thi' key='dethi'>
					<Row gutter={[16, 16]}>
						<Col span={24}>
							<Card title='4.1. Tạo cấu trúc đề thi' size='small'>
								<Row gutter={16}>
									<Col span={8}>
										<Form form={formCauTruc} layout='vertical' onFinish={handleAddCauTruc}>
											<Form.Item
												label='Tên cấu trúc đề'
												name='ten'
												rules={[{ required: true, message: 'Nhập tên cấu trúc' }]}
											>
												<Input placeholder='VD: Đề giữa kỳ LTW1' />
											</Form.Item>
											<Form.Item
												label='Môn học'
												name='idMon'
												rules={[{ required: true, message: 'Chọn môn học' }]}
											>
												<Select placeholder='Chọn môn'>
													{monHoc.map((m) => (
														<Option key={m.id} value={m.id}>
															{m.tenMon}
														</Option>
													))}
												</Select>
											</Form.Item>
											<Form.Item>
												<Button type='primary' htmlType='submit'>
													Lưu cấu trúc
												</Button>
											</Form.Item>
										</Form>
									</Col>
									<Col span={16}>
										<Space direction='vertical' style={{ width: '100%' }} size='middle'>
											<Card title='Danh sách cấu trúc đề' size='small'>
												<Table
													rowKey='id'
													columns={cauTrucColumns}
													dataSource={cauTrucDataSource}
													pagination={false}
													bordered
													size='small'
												/>
											</Card>
											<Card title='Chi tiết cấu trúc (khối / mức độ / số câu)' size='small'>
												<Form
													form={formChiTietCauTruc}
													layout='horizontal'
													onFinish={handleAddChiTietCauTruc}
												>
													<Row gutter={12}>
														<Col span={7}>
															<Form.Item
																name='idCauTruc'
																label='Cấu trúc'
																rules={[{ required: true, message: 'Chọn cấu trúc' }]}
															>
																<Select placeholder='Chọn cấu trúc đề'>
																	{cauTrucDe.map((ct) => (
																		<Option key={ct.id} value={ct.id}>
																			{ct.ten}
																		</Option>
																	))}
																</Select>
															</Form.Item>
														</Col>
														<Col span={6}>
															<Form.Item
																name='idKhoi'
																label='Khối'
																rules={[{ required: true, message: 'Chọn khối' }]}
															>
																<Select placeholder='Chọn khối'>
																	{khoiKienThuc.map((k) => (
																		<Option key={k.id} value={k.id}>
																			{k.ten}
																		</Option>
																	))}
																</Select>
															</Form.Item>
														</Col>
														<Col span={5}>
															<Form.Item
																name='mucDo'
																label='Mức độ'
																rules={[{ required: true, message: 'Chọn mức độ' }]}
															>
																<Select>
																	<Option value='DE'>Dễ</Option>
																	<Option value='TB'>Trung bình</Option>
																	<Option value='KHO'>Khó</Option>
																	<Option value='RAT_KHO'>Rất khó</Option>
																</Select>
															</Form.Item>
														</Col>
														<Col span={4}>
															<Form.Item
																name='soLuong'
																label='Số câu'
																rules={[{ required: true, message: 'Nhập số câu' }]}
															>
																<InputNumber min={1} style={{ width: '100%' }} />
															</Form.Item>
														</Col>
														<Col span={2}>
															<Form.Item label=' ' colon={false}>
																<Button type='primary' htmlType='submit' block>
																	Thêm
																</Button>
															</Form.Item>
														</Col>
													</Row>
												</Form>
												<Table
													rowKey='id'
													columns={chiTietCauTrucColumns}
													dataSource={chiTietCauTruc.map((ct) => ({
														...ct,
														khoi: khoiKienThuc.find((k) => k.id === ct.idKhoi)?.ten,
													}))}
													bordered
													size='small'
													scroll={{ y: 240 }}
												/>
											</Card>
										</Space>
									</Col>
								</Row>
							</Card>
						</Col>
						<Col span={24}>
							<Card title='4.2. Sinh đề thi tự động' size='small'>
								<Row gutter={16}>
									<Col span={10}>
										<Form form={formSinhDe} layout='vertical' onFinish={handleSinhDe}>
											<Form.Item
												label='Cấu trúc đề'
												name='idCauTruc'
												rules={[{ required: true, message: 'Chọn cấu trúc đề' }]}
											>
												<Select placeholder='Chọn cấu trúc đề'>
													{cauTrucDe.map((ct) => (
														<Option key={ct.id} value={ct.id}>
															{ct.ten}
														</Option>
													))}
												</Select>
											</Form.Item>
											<Form.Item
												label='Tên đề thi'
												name='tenDe'
												rules={[{ required: true, message: 'Nhập tên đề thi' }]}
											>
												<Input placeholder='VD: Đề giữa kỳ nhóm 1' />
											</Form.Item>
											<Form.Item>
												<Button type='primary' htmlType='submit'>
													Sinh đề thi
												</Button>
											</Form.Item>
										</Form>
									</Col>
									<Col span={14}>
										<Card title='Danh sách đề thi đã sinh' size='small'>
											<Table
												rowKey='id'
												columns={deThiColumns}
												dataSource={deThiDataSource}
													pagination={false}
													bordered
													size='small'
											/>
										</Card>
									</Col>
								</Row>
							</Card>
						</Col>
					</Row>
				</TabPane>
			</Tabs>
		</Card>
	);
};

export default QuanLiDeThiPage;
