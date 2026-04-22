import { useEffect, useMemo, useState } from 'react';
import type { BaiViet } from './kieuDuLieu';
import { damBaoDuLieuMau, docDanhSachBaiViet, ghiDanhSachBaiViet } from './luuTru';

export const useBlogCaNhan = () => {
	const [dsBaiViet, setDsBaiViet] = useState<BaiViet[]>([]);

	useEffect(() => {
		damBaoDuLieuMau();
		setDsBaiViet(docDanhSachBaiViet());
	}, []);

	useEffect(() => {
		ghiDanhSachBaiViet(dsBaiViet);
	}, [dsBaiViet]);

	const dsThe = useMemo(() => {
		const tap = new Set<string>();
		dsBaiViet.forEach((b) => (b.the || []).forEach((t) => tap.add(t)));
		return Array.from(tap).sort((a, b) => a.localeCompare(b));
	}, [dsBaiViet]);

	return { dsBaiViet, setDsBaiViet, dsThe };
};
