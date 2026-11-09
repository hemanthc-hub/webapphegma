import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
	ShieldCheck,
	Network,
	Headphones,
	MessageCircle,
	Phone,
	Wrench,
	Package,
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';

export const setupPackages = [
	{
		id: 'starter-clinic',
		number: '01',
		name: 'Starter Clinic Setup Package',
		description: 'Ideal for new clinics',
		image: 'https://r2dkmedia.dentalkart.com/media/catalog/product/ctlp/x/a/xasxscdsxc.jpg',
		equipmentCount: '8+ Equipments',
		chairs: '1 Chair Setup',
		price: 350000,
		badgeColor: 'bg-green-600',
		equipmentList: [
			'Chiru Sparkle Dental Chair with Motorized Suction',
			'Xpect Vision RVG',
			'AMS Wall Mount X-Ray Unit',
			'Autoclave Cooker Type',
			'Woodpecker Ultrasonic Scaler UDS-J',
			'Woodpecker Light Cure Mini S',
			'IDS Compressor',
			'UV Chamber',
		],
	},
	{
		id: 'smile-starter',
		number: '02',
		name: 'Smile Starter Clinic Setup Package',
		description: 'Best for budget clinics',
		image: 'https://r2dkmedia.dentalkart.com/media/catalog/product/ctlp/W/A/WALXX01848.jpg',
		equipmentCount: '8+ Equipments',
		chairs: '1 Chair Setup',
		price: 400000,
		badgeColor: 'bg-blue-600',
		equipmentList: [
			'Chiru PLATINUM Dental Chair with Motorized Suction',
			'Woodpecker RVG',
			'Woodpecker Portable X-Ray',
			'Autoclave Cooker Type',
			'Woodpecker Scaler UDS-P',
			'UV Chamber',
			'Woodpecker Light Cure',
			'IDS Compressor',
		],
	},
	{
		id: 'procare',
		number: '03',
		name: 'ProCare Clinic Setup Package',
		description: 'Perfect for growing clinics',
		image: 'https://r2dkmedia.dentalkart.com/media/catalog/product/ctlp/x/a/xasxscdsxc.jpg',
		equipmentCount: '9+ Equipments',
		chairs: '1 Chair Setup',
		price: 500000,
		badgeColor: 'bg-purple-600',
		equipmentList: [
			'Chiru Dental Platinum Pro Chair with Motorized Suction',
			'Woodpecker RVG',
			'Woodpecker Portable X-Ray',
			'Class N Autoclave with Autodrain',
			'Woodpecker Scaler',
			'UV Chamber',
			'Woodpecker Light Cure',
			'IDS Compressor',
			'Intra Oral Camera 19 Screen with WiFi by HegmaKart',
		],
	},
	{
		id: 'advanced',
		number: '04',
		name: 'Advanced Clinic Setup Package',
		description: 'Complete premium setup Package',
		image: 'https://r2dkmedia.dentalkart.com/media/catalog/product/ctlp/W/A/WALXX01850.jpg',
		equipmentCount: '11+ Equipments',
		chairs: '1 Chair Setup',
		price: 650000,
		badgeColor: 'bg-orange-500',
		equipmentList: [
			'Chiru Dental Platinum Plus Chair with Motorized Suction',
			'Vatech RVG',
			'Eigtheeth Hyperlight Portable X-Ray Unit',
			'Class N Autoclave with Autodrain',
			'Woodpecker Scaler',
			'UV Chamber',
			'Woodpecker Light Cure',
			'Chiru Compressor',
			'Ultrasonic Cleaner',
			'Intra Oral Camera 19 Screen with WiFi by HegmaKart',
		],
	},
	{
		id: 'elite',
		number: '05',
		name: 'Elite Clinic Setup Package',
		description: 'Premium dental clinic setup',
		image: 'https://r2dkmedia.dentalkart.com/media/catalog/product/ctlp/d/a/darkredfdskfm.jpg',
		equipmentCount: '11+ Equipments',
		chairs: '1 Chair Setup',
		price: 800000,
		badgeColor: 'bg-pink-500',
		equipmentList: [
			'Siger V6000 Dental Chair',
			'Vmax 450 Motorized Suction Unit',
			'Vatech RVG',
			'Eigtheeth Hyperlight Portable X-Ray Unit',
			'Class N Autoclave with Autodrain',
			'Woodpecker Ultrasonic Scaler UDS-E LED',
			'UV Chamber',
			'Woodpecker Light Cure',
			'Chiru Compressor',
			'Ultrasonic Cleaner',
			'Intra Oral Camera 19 Screen with WiFi by HegmaKart',
		],
	},
	{
		id: 'diamond',
		number: '06',
		name: 'Diamond Clinic Setup Package',
		description: 'Advanced professional clinic setup',
		image: 'https://r2dkmedia.dentalkart.com/media/catalog/product/ctlp/e/n/enhance_this_image_show_the_chair_and_its_accesori_1_20260327090630.?w=512',
		equipmentCount: '11+ Equipments',
		chairs: '1 Chair Setup',
		price: 1000000,
		badgeColor: 'bg-cyan-600',
		equipmentList: [
			'Siger U100 Dental Chair / Gnatus S300',
			'Vmax 450 Motorized Suction Unit',
			'Carestream 5200 RVG',
			'Vatech Portable X-Ray Unit',
			'Runyes Class B Autoclave',
			'Woodpecker Ultrasonic Scaler UDS-X LED',
			'UV Chamber',
			'Woodpecker Light Cure',
			'Chiru Compressor',
			'Ultrasonic Cleaner',
			'Intra Oral Camera 19 Screen with WiFi by HegmaKart',
		],
	},
	{
		id: 'signature',
		number: '07',
		name: 'Signature Clinic Setup Package',
		description: 'Complete premium dental setup',
		image: 'https://r2dkmedia.dentalkart.com/media/catalog/product/ctlp/0/1/011wkefj.jpg?w=256',
		equipmentCount: '11+ Equipments',
		chairs: '1 Chair Setup',
		price: 1200000,
		badgeColor: 'bg-indigo-600',
		equipmentList: [
			'Gnatus S400 Dental Chair',
			'Vmax 450 Motorized Suction Unit',
			'Carestream 5200 RVG',
			'Vatech Portable X-Ray Unit',
			'Runyes Class B Autoclave',
			'Woodpecker Ultrasonic Scaler U-600 LED',
			'UV Chamber',
			'Woodpecker Light Cure',
			'Chiru Compressor',
			'Ultrasonic Cleaner',
			'Intra Oral Camera 19 Screen with WiFi by HegmaKart',
		],
	},
];
const OfflineOrder = () => (
	<>
		<Helmet>
			<title>Hegmakart: Clinic Setup Packages</title>
			<meta name="description" content="Dental clinic setup packages" />
		</Helmet>
		<Header />

		<main className="main info-box-wrapper bg-white text-slate-900">
			<div className="hidden lg:block">
				<div className="max-w-[1500px] mx-auto px-5 lg:px-8">
					<PageHeading />
					<PackageGrid />
					<ConsultationCta desktop />
				</div>
			</div>

			<div className="lg:hidden min-h-screen">
				<div className="w-full max-w-[1500px] mx-auto px-3 sm:px-5">
					<PageHeading mobile />
					<PackageGrid mobile />
					<ConsultationCta />
				</div>
			</div>
		</main>

		<Footer />
	</>
);

function PageHeading({ mobile = false }) {
	return (
		<>
			<div className="hidden lg:block bg-white text-slate-900">
				<main className="max-w-[1500px] mx-auto px-3 lg:px-8">
					{/* TITLE + BENEFITS */}
					<div className="flex flex-col xl:flex-row xl:items-center justify-between gap-5 pt-7 pb-5">
						<div>
							<h1 className="text-[24px] lg:text-[26px] font-black text-[#10263a] uppercase">
								OUR CLINIC SETUP PACKAGES
							</h1>

							<p className="text-[13px] text-slate-600 mt-1">
								Choose the perfect package for your clinic. All
								packages include installation, training &
								after-sales support.
							</p>
						</div>

						{/* BENEFITS */}
						<div className="flex border border-slate-200 rounded-lg overflow-hidden shadow-sm">
							<Benefit
								icon={<ShieldCheck size={20} />}
								title="100% Genuine"
								subtitle="Products"
							/>

							<Benefit
								icon={<Network size={20} />}
								title="Installation"
								subtitle="& Training"
							/>

							<Benefit
								icon={<ShieldCheck size={20} />}
								title="Warranty &"
								subtitle="AMC Support"
							/>
						</div>
					</div>

				</main>
			</div>
			<div className="block lg:hidden bg-white text-slate-900">
				<main className="max-w-[1500px] mx-auto px-1">

					<div className="
      flex flex-col
      gap-5
      pt-5
      pb-5
    ">

						{/* TITLE + PARAGRAPH */}
						<div>
							<h1 className="
          text-[20px] sm:text-[24px]
          font-black
          text-[#10263a]
          uppercase
        ">
								OUR CLINIC SETUP PACKAGES
							</h1>

							<p className="
          text-[11px] sm:text-[13px]
          text-slate-600
          mt-1
        ">
								Choose the perfect package for your clinic. All packages include
								installation, training & after-sales support.
							</p>
						</div>

						{/* BENEFITS */}
						<div className="
        flex
        w-full
        border border-slate-200
        rounded-lg
        overflow-hidden
        shadow-sm
      ">
							<Benefit
								icon={<ShieldCheck size={20} />}
								title="100% Genuine"
								subtitle="Products"
							/>

							<Benefit
								icon={<Network size={20} />}
								title="Installation"
								subtitle="& Training"
							/>

							<Benefit
								icon={<ShieldCheck size={20} />}
								title="Warranty &"
								subtitle="AMC Support"
							/>
						</div>

					</div>

				</main>
			</div>
		</>
	);
}

function PackageGrid({ mobile = false }) {
	return (
		<div className={`grid grid-cols-1 ${mobile ? 'sm:grid-cols-2 gap-3 sm:gap-4 pb-5' : 'md:grid-cols-2 xl:grid-cols-3 gap-4 pb-6'}`}>
			{setupPackages.map((item) => <PackageCard key={item.id} item={item} />)}
		</div>
	);
}

function PackageCard({ item }) {
	const navigate = useNavigate();

	return (
		<article className="group bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-[2px] transition-all duration-200">
			<div className="flex min-h-[155px]">
				<div className="relative w-[42%] sm:w-[48%] shrink-0 bg-slate-100 overflow-hidden">
					<img
						src={item.image}
						alt={`${item.name} equipment`}
						className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
						loading="lazy"
					/>
					<span className={`absolute left-2 top-2 ${item.badgeColor} text-white text-[9px] sm:text-[10px] font-extrabold px-2.5 py-1.5 rounded-md shadow-md`}>
						BEST SELLER
					</span>
				</div>

				<div className="flex-1 p-3 sm:p-4 flex flex-col min-w-0">
					<span className="text-[10px] font-bold text-[#087f87]">PACKAGE {item.number}</span>
					<h2 className="mt-0 font-extrabold text-[15px] sm:text-[18px] leading-tight text-[#10263a]">
						{item.name}
					</h2>

					<p className="text-[12px] sm:text-[14px] text-slate-700 mt-0 font-bold">
						{item.description}
					</p>

					<p className="text-[16px] sm:text-[20px] font-black text-blue-600 mt-1">
						₹{item.price.toLocaleString('en-IN')}
					</p>

					{/* <ul className="mt-3 space-y-1 text-[11px] text-slate-600">
						{(showAllEquipment ? item.equipmentList : item.equipmentList.slice(0, 3)).map((equipment) => (
							<li key={equipment} className="truncate">{equipment}</li>
						))}
						{!showAllEquipment && item.equipmentList.length > 3 && (
							<li className="font-semibold text-[#087f87]">+{item.equipmentList.length - 3} more items</li>
						)}
					</ul> */}
					<div className="mt-auto pt-4">
						<button
							type="button"
							onClick={() => navigate(`/new-clinic-setup/${item.id}`)}
							className="inline-flex items-center justify-center border-0 outline-none shadow-none bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-semibold px-3 py-2 rounded-md transition"
						>
							View Details
						</button>
					</div>
				</div>
			</div>
		</article>
	);
}

function ConsultationCta({ desktop = false }) {
	return (
		<>
			<section className="hidden md:block w-full mx-auto my-2">
				<div
					className="
      w-full
      bg-[#effcfd]
      border border-[#c9edef]
      rounded-xl
      px-5 py-4
      flex items-center
      gap-5
    "
				>
					{/* Left Chat Icon */}
					<div className="flex-shrink-0 w-14 h-12 rounded-full bg-white flex items-center justify-center">
						<MessageCircle
							size={20}
							strokeWidth={1.8}
							className="text-[#0795a0]"
						/>
					</div>

					{/* Main Text */}
					<div className="min-w-[270px] flex-1">
						<h3 className="text-[15px] font-bold text-[#087f8c] leading-tight">
							Need Help Choosing the Right Package?
						</h3>

						<p className="mt-0 text-[9px] leading-[13px] text-[#5b8d91] max-w-[330px]">
							Our experts will help you choose the perfect setup for your clinic
							based on your space, budget & requirements.
						</p>
					</div>

					{/* Features */}
					<div className="flex items-center justify-center gap-6 flex-1">

						<div className="flex items-center gap-2">
							<Headphones
								size={22}
								strokeWidth={1.2}
								className="text-[#0795a0] flex-shrink-0"
							/>

							<div>
								<p className="text-[10px] font-bold text-[#087f8c] whitespace-nowrap m-0">
									Free Consultation
								</p>

								<p className="text-[8px] text-[#6d9699] whitespace-nowrap m-0">
									Expert guidance for your clinic
								</p>
							</div>
						</div>

						<div className="flex items-center gap-2">
							<Package
								size={22}
								strokeWidth={1.8}
								className="text-[#0795a0] flex-shrink-0"
							/>

							<div>
								<p className="text-[10px] font-bold text-[#087f8c] whitespace-nowrap m-0">
									Custom Packages
								</p>

								<p className="text-[8px] text-[#6d9699] whitespace-nowrap m-0">
									Tailored to your needs
								</p>
							</div>
						</div>

						<div className="flex items-center gap-2">
							<Wrench
								size={22}
								strokeWidth={1.8}
								className="text-[#0795a0] flex-shrink-0"
							/>

							<div>
								<p className="text-[10px] font-bold text-[#087f8c] whitespace-nowrap m-0">
									End to End Support
								</p>

								<p className="text-[8px] text-[#6d9699] whitespace-nowrap m-0">
									From planning to installation
								</p>
							</div>
						</div>

					</div>
					<button
						className="
    flex-shrink-0
    px-6 py-4
    bg-white
    border border-blue
    rounded-md
    text-[11px]
    font-semibold
    text-[#087f8c]
    whitespace-nowrap
    outline-none
    ring-0
  "
					>
						Talk To Our Expert
						<Phone size={14} className="inline ml-1" />
					</button>
				</div>
			</section>
			<section className="block sm:hidden w-full mx-auto my-2">
				<div
					className="
      w-full
      bg-[#effcfd]
      rounded-xl
      p-4
      flex flex-col gap-5
    "
				>
					{/* Top Section */}
					<div className="flex items-start gap-3">
						{/* Chat Icon */}
						<div className="flex-shrink-0 w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm">
							<MessageCircle
								size={24}
								strokeWidth={1.8}
								className="text-[#0795a0]"
							/>
						</div>

						{/* Main Text */}
						<div className="flex-1 min-w-0 pt-1">
							<h3 className="text-[14px] font-bold text-[#087f8c] leading-tight">
								Need Help Choosing the Right Package?
							</h3>
							<p className="mt-1.5 text-[10px] leading-[14px] text-[#5b8d91]">
								Our experts will help you choose the perfect setup for your clinic
								based on your space, budget & requirements.
							</p>
						</div>
					</div>

					{/* FEATURES - Vertical Layout */}
					<div className="flex flex-col gap-3 px-1">
						{/* Free Consultation */}
						<div className="flex items-center gap-3">
							<div className="w-6 flex justify-center flex-shrink-0">
								<Headphones
									size={18}
									strokeWidth={2}
									className="text-[#0795a0]"
								/>
							</div>
							<div className="flex flex-col">
								<p className="text-[11px] font-bold text-[#087f8c] leading-tight m-0">
									Free Consultation
								</p>
								<p className="text-[9px] text-[#6d9699] leading-[12px] m-0">
									Expert guidance for your clinic
								</p>
							</div>
						</div>

						{/* Custom Packages */}
						<div className="flex items-center gap-3">
							<div className="w-6 flex justify-center flex-shrink-0">
								<Package
									size={18}
									strokeWidth={2}
									className="text-[#0795a0]"
								/>
							</div>
							<div className="flex flex-col">
								<p className="text-[11px] font-bold text-[#087f8c] leading-tight m-0">
									Custom Packages
								</p>
								<p className="text-[9px] text-[#6d9699] leading-[12px] m-0">
									Tailored to your needs
								</p>
							</div>
						</div>

						{/* End to End Support */}
						<div className="flex items-center gap-3">
							<div className="w-6 flex justify-center flex-shrink-0">
								<Wrench
									size={18}
									strokeWidth={2}
									className="text-[#0795a0]"
								/>
							</div>
							<div className="flex flex-col">
								<p className="text-[11px] font-bold text-[#087f8c] leading-tight m-0">
									End to End Support
								</p>
								<p className="text-[9px] text-[#6d9699] leading-[12px] m-0">
									From planning to installation
								</p>
							</div>
						</div>
					</div>

					{/* Full-width CTA Button at Bottom */}
					<button
						className="
    w-full
    flex items-center justify-center gap-1.5
    py-4
    bg-white
    border border-[#087f8c]
    rounded-md
    text-[11px]
    font-semibold
    text-[#087f8c]
    whitespace-nowrap
    outline-none
    ring-0
    active:bg-gray-50
  "
					>
						Talk To Our Expert
						<Phone size={14} className="text-[#087f8c]" />
					</button>
				</div>
			</section>

		</>
	);
}


function Benefit({ icon, title, subtitle, mobile = false }) {
	return (
		<div
			className={
				mobile
					? "flex flex-col items-center justify-center text-center px-1 py-1 w-[100px] border-r last:border-r-0 border-slate-200"
					: "flex items-center justify-center gap-2 px-2 py-1 w-[170px] border-r last:border-r-0 border-slate-200"
			}
		>
			{/* ICON */}
			<div
				className={
					mobile
						? "text-[#087f87] mb-1"
						: "text-[#087f87] shrink-0 mb-1"
				}
			>
				{icon}
			</div>

			{/* TEXT */}
			<div className="leading-tight">
				<p
					className={
						mobile
							? "m-0 text-[10px] sm:text-xs font-bold text-[#10263a]"
							: "m-0 text-[10px] lg:text-[11px] xl:text-[12px] font-bold text-[#10263a] pt-3"
					}
				>
					{title}
				</p>

				<p
					className={
						mobile
							? "text-[9px] sm:text-[10px] text-slate-500"
							: "text-[9px] lg:text-[10px] xl:text-[11px] text-slate-500"
					}
				>
					{subtitle}
				</p>
			</div>
		</div>
	);
}

function CtaFeature({ icon, title, text }) {
	return (
		<div className="flex items-center gap-3 min-w-0">
			<div className="text-[#087f87] shrink-0">{icon}</div>
			<div>
				<p className="text-[11px] font-bold text-[#10263a]">{title}</p>
				<p className="text-[10px] text-slate-600">{text}</p>
			</div>
		</div>
	);
}

export default OfflineOrder;
