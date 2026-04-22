import type { BaiViet } from './kieuDuLieu';

const KHOA_BAI_VIET = 'blog-ca-nhan-bai-viet';
const KHOA_BAI_VIET_DANG_XEM = 'blog-ca-nhan-bai-viet-dang-xem';

const taoId = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`;

export const taoSlug = (tieuDe: string) => {
	const coDau = 'àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ';
	const khongDau = 'aaaaaaaaaaaaaaaaaeeeeeeeeeeeiiiiiooooooooooooooooouuuuuuuuuuuyyyyyd';
	let s = (tieuDe || '').toLowerCase().trim();
	for (let i = 0; i < coDau.length; i += 1) s = s.replaceAll(coDau[i], khongDau[i]);
	s = s.replace(/[^a-z0-9\s-]/g, '');
	s = s.replace(/\s+/g, '-').replace(/-+/g, '-');
	return s.replace(/^-|-$/g, '');
}; 

export const taoIdBaiViet = () => taoId();

export const capNhatBaiVietTheoSlug = (slug: string, capNhat: Partial<BaiViet>) => {
	const ds = docDanhSachBaiViet();
	const idx = ds.findIndex((b) => b.slug === slug);
	if (idx < 0) return;
	ds[idx] = { ...ds[idx], ...capNhat };
	ghiDanhSachBaiViet(ds);
};

export const xoaBaiVietTheoSlug = (slug: string) => {
	const ds = docDanhSachBaiViet();
	ghiDanhSachBaiViet(ds.filter((b) => b.slug !== slug));
};

const duLieuMau = (): BaiViet[] => {
	const tacGia = {
		ten: 'Trương Công Chiến',
		avatar: 'https://scontent.fhan5-6.fna.fbcdn.net/v/t39.30808-1/670656019_3935099566626168_108047487248855275_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=107&ccb=1-7&_nc_sid=e99d92&_nc_eui2=AeHhmBTxVItbEAG-KkbJ_532J7FTNz7mCe8nsVM3PuYJ710ldEfQsTHcLhto2-qUoPYUISbqXU1lkvKYv6AHAKCj&_nc_ohc=ZJlPYUccUacQ7kNvwHy_vb2&_nc_oc=AdoCwkPELAfHp9rFhlJ9zHHB6TRBZWVmXS5pKfBA2q3j_wbSju7sk_HpeGLIaobNu6E&_nc_zt=24&_nc_ht=scontent.fhan5-6.fna&_nc_gid=ptTIAgLWnU2mdVannTCEXQ&_nc_ss=7a3a8&oh=00_Af0k8k5V0OFCcYiMF9rxt3IrbPeFbFjLR3BRP_KwUUvb1Q&oe=69EE5263',
	};

	const ngay = new Date();

	void ngay;
	const congNgay = (n: number) => new Date(Date.now() - n * 24 * 60 * 60 * 1000).toISOString();

	return [
		{
			id: taoId(),
			tieuDe: 'Bắt đầu với React và Ant Design',
			slug: 'bat-dau-voi-react-va-ant-design',
			tomTat: 'Gợi ý cấu trúc dự án, layout, Table/Form và cách dựng UI nhanh với Ant Design.',
			noiDung: '# React + Ant Design\n\n- Chọn layout\n- Chia component\n- Table + Form\n\n> Mục tiêu: làm giao diện rõ ràng, dễ dùng.',
			anhDaiDien: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1200&q=80&auto=format&fit=crop',
			the: ['react', 'antd', 'ui'],
			trangThai: 'da_dang',
			ngayTao: congNgay(0),
			ngayDang: congNgay(0),
			tacGia: tacGia,
			luotXem: 12,
		},
		{
			id: taoId(),
			tieuDe: 'Tối ưu trải nghiệm tìm kiếm với debounce 300ms',
			slug: 'toi-uu-trai-nghiem-tim-kiem-voi-debounce-300ms',
			tomTat: 'Vì sao cần debounce khi gõ tìm kiếm, và cách triển khai mượt với React hook.',
			noiDung: '# Debounce\n\n- Giảm số lần filter\n- Tránh giật UI\n- Trải nghiệm mượt\n\n> 300ms là mức phổ biến.',
			anhDaiDien: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&q=80&auto=format&fit=crop',
			the: ['react', 'ux', 'performance'],
			trangThai: 'da_dang',
			ngayTao: congNgay(1),
			ngayDang: congNgay(1),
			tacGia: tacGia,
			luotXem: 8,
		},
		{
			id: taoId(),
			tieuDe: 'Thiết kế Card list: ảnh, tiêu đề, tóm tắt, thẻ',
			slug: 'thiet-ke-card-list-anh-tieu-de-tom-tat-the',
			tomTat: 'Một layout card dễ đọc: cover 16:9, title rõ, tags gọn, và CTA một click.',
			noiDung: '# Card list\n\n- Ảnh đại diện\n- Tiêu đề\n- Tóm tắt\n- Thẻ\n\n> Ưu tiên hiển thị thông tin quan trọng.',
			anhDaiDien: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&q=80&auto=format&fit=crop',
			the: ['ui', 'antd', 'layout'],
			trangThai: 'da_dang',
			ngayTao: congNgay(2),
			ngayDang: congNgay(2),
			tacGia: tacGia,
			luotXem: 4,
		},
		{
			id: taoId(),
			tieuDe: 'State management đơn giản với LocalStorage',
			slug: 'state-management-don-gian-voi-localstorage',
			tomTat: 'Dùng 1 khoá lưu trữ cho danh sách bài viết, thao tác CRUD và đồng bộ đa trang.',
			noiDung: '# LocalStorage\n\n- Đọc dữ liệu khi mount\n- Ghi lại mỗi khi thay đổi\n- Tách service lưu trữ\n',
			anhDaiDien: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=1200&q=80&auto=format&fit=crop',
			the: ['storage', 'react', 'pattern'],
			trangThai: 'da_dang',
			ngayTao: congNgay(3),
			ngayDang: congNgay(3),
			tacGia: tacGia,
			luotXem: 10,
		},
		{
			id: taoId(),
			tieuDe: 'Slug là gì và vì sao cần slug cho bài viết',
			slug: 'slug-la-gi-va-vi-sao-can-slug-cho-bai-viet',
			tomTat: 'Slug giúp URL đẹp, dễ chia sẻ và định danh bài viết ổn định hơn so với id.',
			noiDung: '# Slug\n\n- URL thân thiện\n- Không dấu\n- Không trùng\n',
			anhDaiDien: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1200&q=80&auto=format&fit=crop',
			the: ['seo', 'content', 'pattern'],
			trangThai: 'da_dang',
			ngayTao: congNgay(4),
			ngayDang: congNgay(4),
			tacGia: tacGia,
			luotXem: 6,
		},
		{
			id: taoId(),
			tieuDe: 'Pagination 9 bài/trang: cách tính slice chuẩn',
			slug: 'pagination-9-bai-trang-cach-tinh-slice-chuan',
			tomTat: 'Cách tính startIndex và endIndex, đồng bộ page lên URL, tránh off-by-one.',
			noiDung: '# Pagination\n\n- pageSize = 9\n- start = (page - 1) * 9\n- slice(start, start + 9)\n',
			anhDaiDien: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1200&q=80&auto=format&fit=crop',
			the: ['react', 'ui', 'pagination'],
			trangThai: 'da_dang',
			ngayTao: congNgay(5),
			ngayDang: congNgay(5),
			tacGia: tacGia,
			luotXem: 3,
		},
		{
			id: taoId(),
			tieuDe: 'Thiết kế trang chi tiết: bố cục 2 cột và bài liên quan',
			slug: 'thiet-ke-trang-chi-tiet-bo-cuc-2-cot-va-bai-lien-quan',
			tomTat: 'Trang chi tiết nên có tác giả/ngày/thẻ, ảnh, nội dung và sidebar bài liên quan.',
			noiDung: '# Trang chi tiết\n\n- Header thông tin\n- Ảnh đại diện\n- Nội dung\n- Sidebar liên quan\n',
			anhDaiDien: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&q=80&auto=format&fit=crop',
			the: ['ui', 'layout', 'content'],
			trangThai: 'da_dang',
			ngayTao: congNgay(6),
			ngayDang: congNgay(6),
			tacGia: tacGia,
			luotXem: 5,
		},
		{
			id: taoId(),
			tieuDe: 'Đếm lượt xem tự động khi truy cập bài viết',
			slug: 'dem-luot-xem-tu-dong-khi-truy-cap-bai-viet',
			tomTat: 'Mỗi lần vào trang chi tiết, tăng viewCount và lưu lại vào LocalStorage.',
			noiDung: '# View count\n\n- tangLuotXem(slug)\n- ghi lại danh sách\n- hiển thị ở header\n',
			anhDaiDien: 'https://images.unsplash.com/photo-1556155092-490a1ba16284?w=1200&q=80&auto=format&fit=crop',
			the: ['storage', 'feature', 'analytics'],
			trangThai: 'da_dang',
			ngayTao: congNgay(7),
			ngayDang: congNgay(7),
			tacGia: tacGia,
			luotXem: 14,
		},
		{
			id: taoId(),
			tieuDe: 'Quy ước tag giúp nội dung dễ lọc và dễ mở rộng',
			slug: 'quy-uoc-tag-giup-noi-dung-de-loc-va-de-mo-rong',
			tomTat: 'Tag nên ngắn gọn, không dấu, quy về lowercase và tránh trùng nghĩa.',
			noiDung: '# Tag\n\n- lowercase\n- không dấu\n- ngắn gọn\n',
			anhDaiDien: 'https://images.unsplash.com/photo-1526378722484-bd91ca387e72?w=1200&q=80&auto=format&fit=crop',
			the: ['content', 'ux'],
			trangThai: 'da_dang',
			ngayTao: congNgay(8),
			ngayDang: congNgay(8),
			tacGia: tacGia,
			luotXem: 2,
		},
		{
			id: taoId(),
			tieuDe: 'UI dễ dùng: khoảng trắng, typography và nhịp thông tin',
			slug: 'ui-de-dung-khoang-trang-typography-va-nhip-thong-tin',
			tomTat: 'Nhìn “thoáng” giúp đọc nhanh. Dùng Title/Text/Paragraph hợp lý và nhất quán.',
			noiDung: '# UI/UX\n\n- spacing\n- font-size\n- phân cấp tiêu đề\n',
			anhDaiDien: 'https://images.unsplash.com/photo-1526498460520-4c246339dccb?w=1200&q=80&auto=format&fit=crop',
			the: ['ux', 'ui', 'antd'],
			trangThai: 'da_dang',
			ngayTao: congNgay(9),
			ngayDang: congNgay(9),
			tacGia: tacGia,
			luotXem: 7,
		},
		{
			id: taoId(),
			tieuDe: 'Sắp xếp bài mới nhất: ưu tiên ngày đăng',
			slug: 'sap-xep-bai-moi-nhat-uu-tien-ngay-dang',
			tomTat: 'Bài đã đăng sắp xếp theo ngày đăng; bài nháp vẫn có ngày tạo để quản lý.',
			noiDung: '# Sorting\n\n- publishedAt\n- createdAt\n- fallback hợp lý\n',
			anhDaiDien: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=1200&q=80&auto=format&fit=crop',
			the: ['pattern', 'content'],
			trangThai: 'da_dang',
			ngayTao: congNgay(10),
			ngayDang: congNgay(10),
			tacGia: tacGia,
			luotXem: 1,
		},
		{
			id: taoId(),
			tieuDe: 'Form viết bài: checklist trường cần có',
			slug: 'form-viet-bai-checklist-truong-can-co',
			tomTat: 'Tiêu đề, slug, tóm tắt, nội dung, ảnh đại diện, thẻ, trạng thái là đủ cho 1 blog cá nhân.',
			noiDung: '# Form\n\n- title\n- slug\n- summary\n- content\n- cover\n- tags\n- status\n',
			anhDaiDien: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&q=80&auto=format&fit=crop',
			the: ['antd', 'form', 'ui'],
			trangThai: 'da_dang',
			ngayTao: congNgay(11),
			ngayDang: congNgay(11),
			tacGia: tacGia,
			luotXem: 0,
		},
		{
			id: taoId(),
			tieuDe: 'Bài nháp: kế hoạch viết series React hooks',
			slug: 'bai-nhap-ke-hoach-viet-series-react-hooks',
			tomTat: 'Nháp nội dung cho series useEffect/useMemo/useCallback kèm ví dụ thực tế.',
			noiDung: '# Nháp\n\n- Tổng quan hooks\n- Ví dụ\n- Bài tập\n',
			anhDaiDien: 'https://images.unsplash.com/photo-1519337265831-281ec6cc8514?w=1200&q=80&auto=format&fit=crop',
			the: ['draft', 'react'],
			trangThai: 'nhap',
			ngayTao: congNgay(12),
			ngayDang: null,
			tacGia: tacGia,
			luotXem: 0,
		},
		{
			id: taoId(),
			tieuDe: 'Bài nháp: ý tưởng nâng cấp markdown renderer',
			slug: 'bai-nhap-y-tuong-nang-cap-markdown-renderer',
			tomTat: 'Dự định hỗ trợ code block, link, bold/italic mà không cần thư viện ngoài.',
			noiDung: '# Nháp\n\n- code block\n- link\n- inline styles\n',
			anhDaiDien: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&q=80&auto=format&fit=crop',
			the: ['draft', 'feature'],
			trangThai: 'nhap',
			ngayTao: congNgay(13),
			ngayDang: null,
			tacGia: tacGia,
			luotXem: 0,
		},
		{
			id: taoId(),
			tieuDe: 'Checklist hoàn thiện bài viết trước khi đăng',
			slug: 'checklist-hoan-thien-bai-viet-truoc-khi-dang',
			tomTat: 'Soát lỗi chính tả, ảnh đại diện rõ, tag phù hợp, tóm tắt ngắn gọn và đúng trọng tâm.',
			noiDung: '# Checklist\n\n- Tiêu đề rõ\n- Tóm tắt ngắn\n- Tag đúng chủ đề\n- Ảnh đẹp\n',
			anhDaiDien: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&q=80&auto=format&fit=crop',
			the: ['content', 'workflow'],
			trangThai: 'da_dang',
			ngayTao: congNgay(14),
			ngayDang: congNgay(14),
			tacGia: tacGia,
			luotXem: 9,
		},
	];
};

export const docDanhSachBaiViet = (): BaiViet[] => {
	if (typeof window === 'undefined') return [];
	try {
		const raw = window.localStorage.getItem(KHOA_BAI_VIET);
		if (!raw) return [];
		const parsed = JSON.parse(raw) as BaiViet[];
		return Array.isArray(parsed) ? parsed : [];
	} catch {
		return [];
	}
};

export const ghiDanhSachBaiViet = (ds: BaiViet[]) => {
	if (typeof window === 'undefined') return;
	try {
		window.localStorage.setItem(KHOA_BAI_VIET, JSON.stringify(ds));
	} catch {}
};

export const damBaoDuLieuMau = () => {
	const ds = docDanhSachBaiViet();
	if (ds.length > 0) return;
	ghiDanhSachBaiViet(duLieuMau());
};

export const luuBaiVietDangXem = (slug: string | null) => {
	if (typeof window === 'undefined') return;
	try {
		if (!slug) window.localStorage.removeItem(KHOA_BAI_VIET_DANG_XEM);
		else window.localStorage.setItem(KHOA_BAI_VIET_DANG_XEM, slug);
	} catch {}
};

export const docBaiVietDangXem = () => {
	if (typeof window === 'undefined') return null;
	try {
		return window.localStorage.getItem(KHOA_BAI_VIET_DANG_XEM);
	} catch {
		return null;
	}
};

export const timBaiVietTheoSlug = (slug: string): BaiViet | null => {
	const ds = docDanhSachBaiViet();
	return ds.find((b) => b.slug === slug) || null;
};

export const tangLuotXem = (slug: string) => {
	const ds = docDanhSachBaiViet();
	const idx = ds.findIndex((b) => b.slug === slug);
	if (idx < 0) return;
	const bai = ds[idx];
	ds[idx] = { ...bai, luotXem: (bai.luotXem || 0) + 1 };
	ghiDanhSachBaiViet(ds);
};
