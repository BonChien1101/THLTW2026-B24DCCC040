export type TrangThaiBaiViet = 'nhap' | 'da_dang';

export type BaiViet = {
	id: string;
	tieuDe: string;
	slug: string;
	tomTat: string;
	noiDung: string;
	anhDaiDien: string;
	the: string[];
	trangThai: TrangThaiBaiViet;
	ngayTao: string;
	ngayDang: string | null;
	tacGia: {
		ten: string;
		avatar: string;
	};
	luotXem: number;
};
