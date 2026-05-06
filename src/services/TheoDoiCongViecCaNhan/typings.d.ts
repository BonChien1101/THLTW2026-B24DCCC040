declare module TheoDoiCongViecCaNhan {
	export type TrangThaiCongViec = 'can_lam' | 'dang_lam' | 'hoan_thanh';

	export type MucDoUuTien = 'Cao' | 'Trung bình' | 'Thấp';

	export interface CongViec {
		id: string;
		ten: string;
		moTa?: string;
		deadline?: string;
		mucDoUuTien: MucDoUuTien;
		trangThai: TrangThaiCongViec;
		ngayTao: string;
		ngayCapNhat: string;
	}
}
