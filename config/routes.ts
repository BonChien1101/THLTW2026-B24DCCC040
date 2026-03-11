// Redirect import is not needed; use `redirect` field in route config

export default [
	{
		path: '/user',
		layout: false,
		routes: [
			{
				path: '/user/login',
				layout: false,
				name: 'login',
				component: './user/Login',
			},
			{
				path: '/user',
				redirect: '/user/login',
			},

		],
	},

	///////////////////////////////////
	// DEFAULT MENU
	{
		path: '/dashboard',
		name: 'Dashboard',
		component: './TrangChu',
		icon: 'HomeOutlined',
	},
	{
		path: '/gioi-thieu',
		name: 'About',
		component: './TienIch/GioiThieu',
		hideInMenu: true,
	},
	{
		path: '/random-user',
		name: 'RandomUser',
		component: './RandomUser',
		icon: 'ArrowsAltOutlined',
	},
	{
		path: '/todo-list',
		name: 'TodoList',
		icon: 'OrderedListOutlined',
		component: './TodoList',
	},
	{
		path: '/quan-li-de-thi',
		name: 'QuanLiDeThi',
		icon: 'FileTextOutlined',
		component: './QuanLiDeThi',
	},
	{
		path: '/oan-tu-ti',
		name: 'OanTuTi',
		icon: 'ScissorOutlined',
		component: './OanTuTi',
	},
	{
		path: '/doan-so',
		name: 'DoanSo',
		icon: 'CalculatorOutlined',
		component: './DoanSo',
	},
	{
		path: "/quanlimonhoc",
		name: "Quản Lý Môn Học",
		icon: "AppstoreAddOutlined",
		component: './QuanLiMonHoc',
	},
	{
    	path: '/quan-ly-danh-muc-mon-hoc',
    	component: '@/pages/QuanLyDanhMucMonHoc',
  	},
  	{
    	path: '/quan-ly-tien-do-hoc-tap',
    	component: '@/pages/QuanLyTienDoHocTap',
  	},
  	{
    	path: '/thiet-lap-muc-tieu-hang-thang',
    	component: '@/pages/ThietLapMucTieuHangThang',
  	},
	{
		path: '/dashboard1',
		name: 'Dashboard1',
		component: './Dashboard1',
		icon: "HomeOutlined",
	},
	{
		path: "/sanpham",
		name: "Sản Phẩm",
		component: './SanPham',
		hideInMenu: true,

	},
	{
		path: '/',
		redirect: '/quan-li-san-pham',
	},
	{
		path: "/",
		component: '@/layouts/index',
		routes: [
			
			{
				path: '/quan-li-san-pham',
				component: './QuanLiSanPham',
			},
			{
				path: '/quan-li-don-hang',
				component: './QuanLiDonHang',
			},


		]
	},
	{	
		path: '/quan-li-san-pham-va-don-hang',
		name: 'Quan li san pham va don hang',
		component: './QuanLiSanPham',
	},


	// DANH MUC HE THONG
	// {
	// 	name: 'DanhMuc',
	// 	path: '/danh-muc',
	// 	icon: 'copy',
	// 	routes: [
	// 		{
	// 			name: 'ChucVu',
	// 			path: 'chuc-vu',
	// 			component: './DanhMuc/ChucVu',
	// 		},
	// 	],
	// },

	{
		path: '/notification',
		routes: [
			{
				path: './subscribe',
				exact: true,
				component: './ThongBao/Subscribe',
			},
			{
				path: './check',
				exact: true,
				component: './ThongBao/Check',
			},
			{
				path: './',
				exact: true,
				component: './ThongBao/NotifOneSignal',
			},
		],
		layout: false,
		hideInMenu: true,
	},
	{
		path: '/403',
		component: './exception/403/403Page',
		layout: false,
	},
	{
		path: '/hold-on',
		component: './exception/DangCapNhat',
		layout: false,
	},
	{
		component: './exception/404',
	},
];
