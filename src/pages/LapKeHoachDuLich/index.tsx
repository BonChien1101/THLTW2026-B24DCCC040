import React , { useState } from "react";
import { Menu, MenuProps } from "antd";
import TrangChuKhamPhaDiemDen from "./TrangChu";
import LichTrinhDuLichPage from "./LichTrinhDuLich";
import QuanLiNganSachPage from "./QuanLiNganSach";
import TrangQuanTriPage from "./TrangQuanTri";

const LapKeHoachDuLichLayouts: React.FC = () => {
    const [activeKey, setActiveKey] = useState<string> ("trang-chu");
    const items: MenuProps['items'] = [
        {key: 'trang-chu', label: 'Trang Chủ'},
        {key: 'lich-trinh-du-lich', label: 'Lịch Trình Du Lịch'},
        {key: 'quan-li-ngan-sach', label: 'Quản Lý Ngân Sách'},
        {key: 'trang-quan-tri', label: 'Trang Quản Trị'}
    ]

    const renderContent = () => {
        switch (activeKey) {
            case 'trang-chu':
                return <TrangChuKhamPhaDiemDen />;
            case 'lich-trinh-du-lich':
                return <LichTrinhDuLichPage />;
            case 'quan-li-ngan-sach':
                return <QuanLiNganSachPage />;
            case 'trang-quan-tri':
                return <TrangQuanTriPage />;
            default:
                return null;
    
        }
    }
    return (
        <div>
            <div className="khdl-menu-wrapper" style={{display:'flex', justifyContent:'center'}}>
                <Menu
                    mode="horizontal"
                    selectedKeys={[activeKey]}
                    items={items}
                    onClick={(info) => setActiveKey(info.key)}
                    style={{ width: '100%', maxWidth: 670 }}
                    className="khdl-menu"
                />
            </div>

            <div style={{ marginTop: 16 }}>
                {renderContent()}
            </div>
        </div>
    )


}
export default LapKeHoachDuLichLayouts;