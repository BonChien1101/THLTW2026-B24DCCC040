import { useCallback, useMemo, useState } from 'react';

const KHOA_LUU = 'theo_doi_cong_viec_ca_nhan';

const taoId = () => {
	if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
		return (crypto as any).randomUUID();
	}
	return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
};

const docLocalStorage = () => {
	try {
		const chuoi = localStorage.getItem(KHOA_LUU);
		const duLieu = chuoi ? JSON.parse(chuoi) : [];
		return Array.isArray(duLieu) ? duLieu : [];
	} catch (e) {
		return [];
	}
};

const ghiLocalStorage = (ds: TheoDoiCongViecCaNhan.CongViec[]) => {
	localStorage.setItem(KHOA_LUU, JSON.stringify(ds));
};

const taoDuLieuMau = (): TheoDoiCongViecCaNhan.CongViec[] => {
	const ngayHomNay = new Date();
	const congNgay = (soNgay: number) => {
		const d = new Date(ngayHomNay);
		d.setDate(d.getDate() + soNgay);
		return d.toISOString();
	};
	const congGio = (soGio: number) => {
		const d = new Date(ngayHomNay);
		d.setHours(d.getHours() + soGio);
		return d.toISOString();
	};

	const tao = (
		ten: string,
		trangThai: TheoDoiCongViecCaNhan.TrangThaiCongViec,
		mucDoUuTien: TheoDoiCongViecCaNhan.MucDoUuTien,
		deadline?: string,
		moTa?: string,
	): TheoDoiCongViecCaNhan.CongViec => {
		const now = new Date().toISOString();
		return {
			id: taoId(),
			ten,
			moTa,
			deadline,
			mucDoUuTien,
			trangThai,
			ngayTao: now,
			ngayCapNhat: now,
		};
	};

	return [
		tao('Soạn outline báo cáo cuối kỳ', 'can_lam', 'Cao', congNgay(1), 'Tổng hợp mục tiêu, phạm vi, timeline'),
		tao('Gửi email xin feedback đề cương', 'can_lam', 'Trung bình', congNgay(2), 'Gửi cho giảng viên và nhóm'),
		tao('Chuẩn bị slide thuyết trình', 'can_lam', 'Thấp', congNgay(5), 'Slide 8-10 trang, có demo'),
		tao('Fix bug validate form thêm/sửa task', 'dang_lam', 'Cao', congGio(6), 'Kiểm tra các trường bắt buộc, format deadline'),
		tao('Thiết kế UI Dashboard', 'dang_lam', 'Trung bình', congNgay(3), 'Thêm thống kê, tiến độ, danh sách sắp tới'),
		tao('Refactor model lưu localStorage', 'dang_lam', 'Thấp', congNgay(4), 'Tách hàm đọc/ghi, chống lỗi JSON'),
		tao('Họp nhóm phân chia công việc', 'hoan_thanh', 'Trung bình', congNgay(-2), 'Đã chốt đầu việc cho từng thành viên'),
		tao('Tạo Kanban board kéo thả', 'hoan_thanh', 'Cao', congNgay(-1), 'Đã xong chức năng drag & drop'),
		tao('Viết checklist test nhanh', 'hoan_thanh', 'Thấp', congNgay(-3), 'Happy path + edge cases'),
		tao('Nộp bản nháp báo cáo', 'can_lam', 'Cao', congNgay(-1), 'Quá hạn, cần nộp gấp'),
	];
};

export default () => {
	const [danhSachCongViec, setDanhSachCongViec] = useState<TheoDoiCongViecCaNhan.CongViec[]>([]);
	const [dangTai, setDangTai] = useState<boolean>(false);
	const [hienForm, setHienForm] = useState<boolean>(false);
	const [dangSua, setDangSua] = useState<boolean>(false);
	const [congViecDangChon, setCongViecDangChon] = useState<TheoDoiCongViecCaNhan.CongViec | undefined>();

	const taiDuLieu = useCallback(async () => {
		setDangTai(true);
		const duLieu = docLocalStorage();
		if (duLieu.length === 0) {
			const mau = taoDuLieuMau();
			ghiLocalStorage(mau);
			setDanhSachCongViec(mau);
			setDangTai(false);
			return;
		}
		setDanhSachCongViec(duLieu);
		setDangTai(false);
	}, []);

	const themCongViec = useCallback(
		(values: {
			ten: string;
			moTa?: string;
			deadline?: string;
			mucDoUuTien: TheoDoiCongViecCaNhan.MucDoUuTien;
			trangThai: TheoDoiCongViecCaNhan.TrangThaiCongViec;
		}) => {
			const now = new Date().toISOString();
			const moi: TheoDoiCongViecCaNhan.CongViec = {
				id: taoId(),
				ten: values.ten,
				moTa: values.moTa,
				deadline: values.deadline,
				mucDoUuTien: values.mucDoUuTien,
				trangThai: values.trangThai,
				ngayTao: now,
				ngayCapNhat: now,
			};
			const dsMoi = [moi, ...danhSachCongViec];
			setDanhSachCongViec(dsMoi);
			ghiLocalStorage(dsMoi);
		},
		[danhSachCongViec],
	);

	const capNhatCongViec = useCallback(
		(id: string, values: Partial<Omit<TheoDoiCongViecCaNhan.CongViec, 'id' | 'ngayTao'>>): void => {
			const now = new Date().toISOString();
			const dsMoi = danhSachCongViec.map((cv) => {
				if (cv.id !== id) return cv;
				return {
					...cv,
					...values,
					ngayCapNhat: now,
				};
			});
			setDanhSachCongViec(dsMoi);
			ghiLocalStorage(dsMoi);
		},
		[danhSachCongViec],
	);

	const xoaCongViec = useCallback(
		(id: string) => {
			const dsMoi = danhSachCongViec.filter((cv) => cv.id !== id);
			setDanhSachCongViec(dsMoi);
			ghiLocalStorage(dsMoi);
		},
		[danhSachCongViec],
	);

	const doiTrangThaiHangLoat = useCallback(
		(id: string, trangThai: TheoDoiCongViecCaNhan.TrangThaiCongViec) => {
			capNhatCongViec(id, { trangThai });
		},
		[capNhatCongViec],
	);

	const thongKe = useMemo(() => {
		const tong = danhSachCongViec.length;
		const hoanThanh = danhSachCongViec.filter((cv) => cv.trangThai === 'hoan_thanh').length;
		const quaHan = danhSachCongViec.filter((cv) => {
			if (!cv.deadline) return false;
			if (cv.trangThai === 'hoan_thanh') return false;
			return new Date(cv.deadline).getTime() < Date.now();
		}).length;
		return { tong, hoanThanh, quaHan };
	}, [danhSachCongViec]);

	return {
		danhSachCongViec,
		setDanhSachCongViec,
		dangTai,
		taiDuLieu,
		themCongViec,
		capNhatCongViec,
		xoaCongViec,
		doiTrangThaiHangLoat,
		thongKe,
		hienForm,
		setHienForm,
		dangSua,
		setDangSua,
		congViecDangChon,
		setCongViecDangChon,
	};
};
