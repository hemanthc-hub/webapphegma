import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import { setupPackages } from "./OfflineOrder";
import {
	FileText,
	Phone,
	Package,
	Check,
	CheckCircle2,
	Zap,
	Shield,
	Weight,
	Lightbulb,
	Droplets,
	Move,
	Box,
	Award,
	Wrench,
	ShieldCheck,
	Truck,
	BadgeIndianRupee,
	List as ListIcon,
  Settings,
  BookOpen,
  Info,
  ChevronDown,
} from "lucide-react";
const packageDetails = [
	{
		id: "1",
		description: "hi Hello world.",

		highlights: [
			"Feature or highlight number 1",
			"Feature or highlight number 2",
			"Feature or highlight number 3",
			"Feature or highlight number 4",
			"Feature or highlight number 5",
		],

		specifications: [
			{
				icon: Zap,
				title: "Power Supply",
				value: "220V / 50Hz",
			},
			{
				icon: Weight,
				title: "Weight Capacity",
				value: "Up to 180 kg",
			},
			{
				icon: Move,
				title: "Movement",
				value: "6 Way",
			},
			{
				icon: Shield,
				title: "Warranty",
				value: "2 Years",
			},
		],
		whatsIncluded: [
			{
				image:
					"https://r2dkmedia.dentalkart.com/media/catalog/product/ctlp/b/e/bestodent-classic-dental-chair-free-installation-in-delhi-ncr-8.jpg",
				title: "Chiru Dental Chair  ",
				quantity: "1 Unit",
			},
			{
				image:
					"https://r2dkmedia.dentalkart.com/media/catalog/product/w/a/waldent_carpo_rvg_v-sensor_size_-_1_3__1.png",
				title: "Xpect Vision RVG",
				quantity: "1 Unit",
			},
			{
				image:
					"https://r2dkmedia.dentalkart.com/media/catalog/product/ctlp/d/e/dentalkart-asset-27-3-2026--10-45-01-pm.jpg",
				title: "AMS Wall mount Xray ",
				quantity: "1 Unit",
			},
			{
				image:
					"https://dentalkart-application-media.s3.ap-south-1.amazonaws.com/uploads/d058bbef-a845-47a4-9d6d-a58e820a6977.jpg",
				title: "Autoclave Cooker Type",
				quantity: "1 Unit",
			},
			{
				image:
					"https://r2dkmedia.dentalkart.com/media/catalog/product/a/e/aerqr3ey.jpg",
				title: "Woodpecker Scaler",
				quantity: "1 Unit",
			},
			{
				image:
					"https://r2dkmedia.dentalkart.com/media/catalog/product/r/t/rta-1.jpg",
				title: "Woodpecker light ",
				quantity: "2 Units",
			},
			{
				image:
					"https://r2dkmedia.dentalkart.com/media/catalog/product/ctlp/w/a/waldent-dental-compressor-oil-free-head-075-hp-3.jpg",
				title: "IDS Compressor",
				quantity: "1 Unit",
			},
			{
				image:
					"https://r2dkmedia.dentalkart.com/media/catalog/product/t/u/turbox_pro_air_compressor-1.jpg",
				title: "Air Compressor",
				quantity: "1 Unit",
			},
			{
				image:
					"https://r2dkmedia.dentalkart.com/media/catalog/product/3/d/3def7ecb-8b7e-4cbb-9a0e-d73c327c0bf8_1.jpg",
				title: "UV Chamber",
				quantity: "2 Units",
			},
		],
	},

	{
		id: "2",
		description:
			"Add the complete description for Product 2 here.",

		highlights: [
			"Product 2 feature 1",
			"Product 2 feature 2",
			"Product 2 feature 3",
		],

		specifications: [
			{
				icon: Lightbulb,
				title: "Operating Light",
				value: "LED Light",
			},
			{
				icon: Droplets,
				title: "Water Supply",
				value: "Direct",
			},
			{
				icon: Shield,
				title: "Warranty",
				value: "1 Year",
			},
		],
		whatsIncluded: [
			{
				image:
					"https://r2dkmedia.dentalkart.com/media/catalog/product/ctlp/b/e/bestodent-platinum-dental-chair-5.jpg",
				title:
					"Chiru PLATINUM Dental Chair with Motorized Suction ",
				quantity: "1 Unit",
			},
			{
				image:
					"https://r2dkmedia.dentalkart.com/media/catalog/product/s/d/sdf_5_2.jpg",
				title: "Woodpecker Rvg",
				quantity: "1 Unit",
			},
			{
				image:
					"https://r2dkmedia.dentalkart.com/media/catalog/product/a/r/artboard_3_203.jpg",
				title: "Woodpecker Portable Xray",
				quantity: "1 Unit",
			},
			{
				image:
					"https://dentalkart-application-media.s3.ap-south-1.amazonaws.com/uploads/d058bbef-a845-47a4-9d6d-a58e820a6977.jpg",
				title: "Autoclave Cooker Type",
				quantity: "1 Unit",
			},
			{
				image:
					"https://r2dkmedia.dentalkart.com/media/catalog/product/w/o/woodpecker-uds-p-led-ultrasonic-scaler.jpg",
				title: "Woodpecker Scalar UDS P",
				quantity: "1 Unit",
			},
			{
				image:
					"https://r2dkmedia.dentalkart.com/media/catalog/product/b/a/base-image-group_2_.jpg",
				title: "UV Chamber",
				quantity: "2 Units",
			},
			{
				image:
					"https://r2dkmedia.dentalkart.com/media/catalog/product/r/t/rta-1.jpg",
				title: "Woodpecker Light Cure",
				quantity: "1 Unit",
			},
			{
				image:
					"https://r2dkmedia.dentalkart.com/media/catalog/product/ctlp/w/a/waldent-dental-air-compressor-oil-free-1-hp-cylindrical-tank-wac-100-ct-1.jpg",
				title: "IDS Compressor",
				quantity: "1 Unit",
			},
		],
	},

	{
		id: "3",
		description: "Add Product 3 description here.",

		highlights: [
			"Product 3 feature 1",
			"Product 3 feature 2",
			"Product 3 feature 3",
		],

		specifications: [
			{
				icon: Box,
				title: "Material",
				value: "Add material",
			},
			{
				icon: Award,
				title: "Quality",
				value: "Premium",
			},
		],
		whatsIncluded: [
			{
				image:
					"https://r2dkmedia.dentalkart.com/media/catalog/product/ctlp/b/e/bestodent-platinum-dental-chair-5.jpg",
				title:
					"Chiru PLATINUM Dental Chair with Motorized Suction ",
				quantity: "1 Unit",
			},
			{
				image:
					"https://r2dkmedia.dentalkart.com/media/catalog/product/s/d/sdf_5_2.jpg",
				title: "Woodpecker Rvg",
				quantity: "1 Unit",
			},
			{
				image:
					"https://r2dkmedia.dentalkart.com/media/catalog/product/a/r/artboard_3_203.jpg",
				title: "Woodpecker Portable Xray",
				quantity: "1 Unit",
			},
			{
				image:
					"https://r2dkmedia.dentalkart.com/media/catalog/product/v/d/vdhrt.jpg",
				title: "Class N Autoclave With autodrain",
				quantity: "1 Unit",
			},
			{
				image:
					"https://r2dkmedia.dentalkart.com/media/catalog/product/f/8/f80b0a3d.jpg",
				title: "Woodpecker Scalar ",
				quantity: "1 Unit",
			},
			{
				image:
					"https://r2dkmedia.dentalkart.com/media/catalog/product/b/a/base-image-group_2_.jpg",
				title: "UV Chamber",
				quantity: "2 Units",
			},
			{
				image:
					"https://r2dkmedia.dentalkart.com/media/catalog/product/r/t/rta-1.jpg",
				title: "Woodpecker Light Cure",
				quantity: "1 Unit",
			},
			{
				image:
					"https://r2dkmedia.dentalkart.com/media/catalog/product/ctlp/w/a/waldent-dental-air-compressor-oil-free-1-hp-cylindrical-tank-wac-100-ct-1.jpg",
				title: "IDS Compressor",
				quantity: "1 Unit",
			},
		],
	},

	{
		id: "4",
		description: "Add Product 3 description here.",

		highlights: [
			"Product 3 feature 1",
			"Product 3 feature 2",
			"Product 3 feature 3",
		],

		specifications: [
			{
				icon: Box,
				title: "Material",
				value: "Add material",
			},
			{
				icon: Award,
				title: "Quality",
				value: "Premium",
			},
		],
		whatsIncluded: [
			{
				image:
					"https://r2dkmedia.dentalkart.com/media/catalog/product/ctlp/b/e/bestodent-atlas-dental-chair-1-3db033.jpg",
				title:
					"Chiru Dental Platinum Plus Chair with motorized Suction",
				quantity: "1 Unit",
			},
			{
				image:
					"https://dentalkart-catalog-products.s3.ap-south-1.amazonaws.com/media/catalog/product/w/a/waldent_carpo_rvg_v-sensor_size_-_1_3__1_1.png",
				title: "Vatech Rvg",
				quantity: "1 Unit",
			},
			{
				image:
					"https://r2dkmedia.dentalkart.com/media/catalog/product/n/e/new_one_date.jpg?w=512",
				title: "Eigtheeth Hyperlight Portable Xray Unit",
				quantity: "1 Unit",
			},
			{
				image:
					"https://dentalkart-application-media.s3.ap-south-1.amazonaws.com/uploads/d058bbef-a845-47a4-9d6d-a58e820a6977.jpg",
				title: "Class N Autoclave With autodrain",
				quantity: "1 Unit",
			},
			{
				image:
					"https://r2dkmedia.dentalkart.com/media/catalog/product/e/d/ed2-2.jpg",
				title: "Woodpecker Scalar ",
				quantity: "1 Unit",
			},
			{
				image:
					"https://r2dkmedia.dentalkart.com/media/catalog/product/b/a/base-image-group_2_.jpg",
				title: "UV Chamber",
				quantity: "2 Units",
			},
			{
				image:
					"https://r2dkmedia.dentalkart.com/media/catalog/product/r/t/rta-1.jpg",
				title: "Woodpecker Light Cure",
				quantity: "1 Unit",
			},
			{
				image:
					"https://r2dkmedia.dentalkart.com/media/catalog/product/t/u/turbox_pro_air_compressor-1.jpg",
				title: "Chiru Compressor",
				quantity: "1 Unit",
			},
			{
				image:
					"https://dentalkart-catalog-products.s3.ap-south-1.amazonaws.com/media/catalog/product/ctlp/W/h/WhatsAppImage2025-09-01at5_3.56",
				title: "Ultrasonic cleaner ",
				quantity: "1 Unit",
			},
		],
	},

	{
		id: "5",
		description: "Add Product 3 description here.",

		highlights: [
			"Product 3 feature 1",
			"Product 3 feature 2",
			"Product 3 feature 3",
		],

		specifications: [
			{
				icon: Box,
				title: "Material",
				value: "Add material",
			},
			{
				icon: Award,
				title: "Quality",
				value: "Premium",
			},
		],
		whatsIncluded: [
			{
				image:
					"https://r2dkmedia.dentalkart.com/media/catalog/product/ctlp/b/e/bestodent-platinum-dental-chair-5.jpg",
				title: "Siger V6000 Dental Chair",
				quantity: "1 Unit",
			},
			{
				image:
					"https://r2dkmedia.dentalkart.com/media/catalog/product/ctlp/M/a/MaxPiezo2Artboard2.jpg",
				title: "Vmax 450 Motorized Suction unit ",
				quantity: "1 Unit",
			},
			{
				image:
					"https://dentalkart-catalog-products.s3.ap-south-1.amazonaws.com/media/catalog/product/w/a/waldent_carpo_rvg_v-sensor_size_-_1_3__1_1.png",
				title: "Vatech Rvg",
				quantity: "1 Unit",
			},
			{
				image:
					"https://r2dkmedia.dentalkart.com/media/catalog/product/ctlp/e/i/eighteeth-brilliance-flip-up-loupes-with-softouch-surgical-headlight-2.jpg",
				title: "Eigtheeth Hyperlight Portable Xray Unit",
				quantity: "1 Unit",
			},
			{
				image:
					"https://r2dkmedia.dentalkart.com/media/catalog/product/f/8/f80b0a3d.jpg",
				title: "Class N Autoclave With autodrain",
				quantity: "1 Unit",
			},
			{
				image:
					"https://r2dkmedia.dentalkart.com/media/catalog/product/b/a/base-image-group_2_.jpg",
				title: "UV Chamber",
				quantity: "2 Units",
			},
			{
				image:
					"https://r2dkmedia.dentalkart.com/media/catalog/product/r/t/rta-1.jpg",
				title: "Woodpecker Light Cure",
				quantity: "1 Unit",
			},
			{
				image:
					"https://r2dkmedia.dentalkart.com/media/catalog/product/ctlp/w/a/waldent-dental-air-compressor-oil-free-1-hp-cylindrical-tank-wac-100-ct-1.jpg",
				title: "Chiru Compressor",
				quantity: "1 Unit",
			},
			{
				image:
					"https://r2dkmedia.dentalkart.com/media/catalog/product/ctlp/c/o/codyson-ultrasonic-cleaner-cd-4801-14litre-13.jpg",
				title: "Ultrasonic cleaner",
				quantity: "1 Unit",
			},
		],
	},

	{
		id: "6",
		description: "Add Product 3 description here.",

		highlights: [
			"Product 3 feature 1",
			"Product 3 feature 2",
			"Product 3 feature 3",
		],

		specifications: [
			{
				icon: Box,
				title: "Material",
				value: "Add material",
			},
			{
				icon: Award,
				title: "Quality",
				value: "Premium",
			},
		],
		whatsIncluded: [
			{
				image:
					"https://r2dkmedia.dentalkart.com/media/catalog/product/ctlp/b/e/bestodent-platinum-dental-chair-5.jpg",
				title: "Siger U100 Dental Chair/ Gnatus S300 ",
				quantity: "1 Unit",
			},
			{
				image:
					"https://r2dkmedia.dentalkart.com/media/catalog/product/f/a/fawerg.jpg",
				title: "Vmax 450 Motorized Suction unit ",
				quantity: "1 Unit",
			},
			{
				image:
					"https://r2dkmedia.dentalkart.com/media/catalog/product/c/a/carestream-kodak-rvg-5200-digital-radiography-system-3.jpg?w=512",
				title: "Carestream 5200 RVG",
				quantity: "1 Unit",
			},
			{
				image:
					"https://r2dkmedia.dentalkart.com/media/catalog/product/v/d/vdhrt.jpg",
				title: "Vatech Portable Xray unit",
				quantity: "1 Unit",
			},
			{
				image:
					"https://r2dkmedia.dentalkart.com/media/catalog/product/f/8/f80b0a3d.jpg",
				title: "Woodpecker Scalar ",
				quantity: "1 Unit",
			},
			{
				image:
					"https://r2dkmedia.dentalkart.com/media/catalog/product/b/a/base-image-group_2_.jpg",
				title: "UV Chamber",
				quantity: "2 Units",
			},
			{
				image:
					"https://r2dkmedia.dentalkart.com/media/catalog/product/r/t/rta-1.jpg",
				title: "Woodpecker Light Cure",
				quantity: "1 Unit",
			},
			{
				image:
					"https://r2dkmedia.dentalkart.com/media/catalog/product/ctlp/w/a/waldent-dental-air-compressor-oil-free-1-hp-cylindrical-tank-wac-100-ct-1.jpg",
				title: "IDS Compressor",
				quantity: "1 Unit",
			},
		],
	},

	{
		id: "7",
		description: "Add Product 3 description here.",

		highlights: [
			"Product 3 feature 1",
			"Product 3 feature 2",
			"Product 3 feature 3",
		],

		specifications: [
			{
				icon: Box,
				title: "Material",
				value: "Add material",
			},
			{
				icon: Award,
				title: "Quality",
				value: "Premium",
			},
		],
		whatsIncluded: [
			{
				image:
					"https://r2dkmedia.dentalkart.com/media/catalog/product/ctlp/b/e/bestodent-platinum-dental-chair-5.jpg",
				title: "Chiru Dental Chair  ",
				quantity: "1 Unit",
			},
			{
				image:
					"https://r2dkmedia.dentalkart.com/media/catalog/product/s/d/sdf_5_2.jpg",
				title: "Woodpecker Rvg",
				quantity: "1 Unit",
			},
			{
				image:
					"https://r2dkmedia.dentalkart.com/media/catalog/product/a/r/artboard_3_203.jpg",
				title: "Woodpecker Portable Xray",
				quantity: "1 Unit",
			},
			{
				image:
					"https://r2dkmedia.dentalkart.com/media/catalog/product/v/d/vdhrt.jpg",
				title: "Class N Autoclave ",
				quantity: "1 Unit",
			},
			{
				image:
					"https://r2dkmedia.dentalkart.com/media/catalog/product/f/8/f80b0a3d.jpg",
				title: "Woodpecker Scalar ",
				quantity: "1 Unit",
			},
			{
				image:
					"https://r2dkmedia.dentalkart.com/media/catalog/product/b/a/base-image-group_2_.jpg",
				title: "UV Chamber",
				quantity: "2 Units",
			},
			{
				image:
					"https://r2dkmedia.dentalkart.com/media/catalog/product/r/t/rta-1.jpg",
				title: "Woodpecker Light Cure",
				quantity: "1 Unit",
			},
			{
				image:
					"https://r2dkmedia.dentalkart.com/media/catalog/product/ctlp/w/a/waldent-dental-air-compressor-oil-free-1-hp-cylindrical-tank-wac-100-ct-1.jpg",
				title: "IDS Compressor",
				quantity: "1 Unit",
			},
		],
	},
];

const NewClinicSetup = () => {
	const { packageId } = useParams();
	const product = setupPackages.find((item) => item.id === packageId);
	const [selectedImage, setSelectedImage] = useState(0);
	const [includedStart, setIncludedStart] = useState(0);
	const [activeTab, setActiveTab] = useState("description");
	const rating = product?.rating || 4.8;
	const ratingCount = 128;
	if (!product) {
		return (
			<>
				<Header />
				<main className="flex min-h-[60vh] items-center justify-center bg-slate-50 px-4">
					<div className="text-center">
						<Package size={48} className="mx-auto mb-4 text-blue-700" />
						<h1 className="text-2xl font-bold text-slate-800">Package not found</h1>
						<p className="mt-2 text-slate-600">The clinic setup package does not exist.</p>
						<Link
							to="/offline-order"
							className="mt-5 inline-flex rounded-xl bg-blue-700 px-5 py-3 font-semibold text-white hover:bg-blue-800"
						>
							View all packages
						</Link>
					</div>
				</main>
				<Footer />
			</>
		);
	}

	const productId = String(parseInt(product.number, 10));
	const details = packageDetails.find((item) => item.id === productId);
	const includedProducts = details?.whatsIncluded?.length
		? details.whatsIncluded
		: (product.equipmentList || []).map((title) => ({
			image: product.image,
			title,
			quantity: "1 Unit",
		}));
	const productImages = [
		...(product.images?.length ? product.images : [product.image]),
		...includedProducts.map((item) => item.image),
	].filter((image, index, images) => image && images.indexOf(image) === index);
	const currentImage = productImages[selectedImage] || product.image;
	const fallbackImage = "https://placehold.co/700x500/F8FAFC/0F766E?text=Clinic+Setup";

	const handleImageError = (event) => {
		if (event.currentTarget.src !== fallbackImage) {
			event.currentTarget.src = fallbackImage;
		}
	};

	const changeImage = (direction) => {
		setSelectedImage((current) => (
			(current + direction + productImages.length) % productImages.length
		));
	};
	const previousIncluded = () => {
		setIncludedStart((prev) => {
			if (prev === 0) {
				return Math.max(0, includedProducts.length - 3);
			}

			return prev - 1;
		});
	};

	const nextIncluded = () => {
		setIncludedStart((prev) => {
			if (prev + 3 >= includedProducts.length) {
				return 0;
			}

			return prev + 1;
		});
	};

	const detailTabs = [
		{ id: "description", label: "Description" },
		{ id: "specifications", label: "Specifications" },
		{ id: "features", label: "Features" },
		{ id: "included", label: "What's Included" },
		{ id: "downloads", label: "Downloads" },
		{ id: "reviews", label: `Reviews (${ratingCount})` },
	];


	return (
		<>
			<Helmet>
				<title>{`Hegmakart: ${product.name}`}</title>
				<meta name="description" content={product.description} />
			</Helmet>
			<Header />
			<main className="min-h-screen bg-slate-50 pb-0 text-slate-900 lg:pb-0">
				<div className="hidden xl:block min-h-screen bg-slate-50">
					<div className="mx-auto max-w-[1900px] px-4 py-3 md:px-6 md:py-6">
						{/* TOP SECTION */}
						<div className="grid grid-cols-1 gap-2 xl:grid-cols-[36%_40%_24%]">

							{/* LEFT SIDE - PRODUCT IMAGES */}
							<div className="min-w-0 space-y-2">

								{/* MAIN IMAGE */}
								<div className="relative h-[400px] w-[450px] ml-4 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
									<div className="flex h-full w-full items-center justify-center p-6">
										<img
											src={productImages[selectedImage]}
											alt={product.name || "Clinic Setup"}
											onError={handleImageError}
											className="h-full w-full object-contain"
										/>
									</div>
								</div>
								<div className="flex w-full min-w-0 flex-nowrap gap-3 overflow-x-auto overscroll-x-contain touch-pan-x pb-2 pt-3 scrollbar-hide pl-3">
									{productImages.slice(0, 4).map((image, index) => (
										<button
											key={index}
											type="button"
											onClick={() => setSelectedImage(index)}
											className={`h-[100px] w-[110px] shrink-0 overflow-hidden rounded-2xl border bg-white p-0 transition ${selectedImage === index
												? "border-teal-700 ring-2 ring-teal-100"
												: "border-slate-200 hover:border-teal-400"
												}`}
										>
											<img
												src={image}
												alt={`Thumbnail ${index + 1}`}
												onError={handleImageError}
												className="h-full w-full object-contain"
											/>
										</button>
									))}
								</div>

							</div>
							<div className="space-y-5">
								{/* PRODUCT TITLE */}
								<div>
									<h1 className="text-3xl font-bold leading-tight text-slate-800 xl:text-[38px]">
										{product.name || product.title || "Advanced Dental Chair"}
									</h1>

									{/* DESCRIPTION */}
									<p className="mt-3 text-base leading-7 text-slate-600">
										{details?.description ||
											"Ergonomic design with advanced features for maximum patient comfort and seamless workflow."}
									</p>
								</div>

								{/* PRODUCTS INCLUDED */}
								<div className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-3 shadow-sm">
									{/* HEADER */}
									<div className="mb-2 flex items-center justify-between">
										<h2 className="text-lg font-bold text-slate-800 xl:text-xl">
											Products Included in this Package
										</h2>
									</div>

									{/* PRODUCTS SLIDER */}
									<div className="relative">

										{/* PRODUCTS */}
										<div className="flex gap-3 overflow-x-auto overflow-y-hidden scrollbar-hide scroll-smooth">
											{includedProducts.map((item, index) => (
												<div
													key={item.id ?? item.title ?? index}
													className="w-[100px] min-w-[150px] flex-shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50"
												>
													{/* PRODUCT IMAGE */}
													<div className="m-1 flex h-[110px] items-center justify-center overflow-hidden rounded-xl bg-white">
														<img
															src={item.image}
															alt={item.title || "Included product"}
															onError={handleImageError}
															className="h-full w-full object-contain p-2"
														/>
													</div>

													{/* PRODUCT DETAILS */}
													<div className="px-3 pb-4 text-center">
														<h3 className="line-clamp-1 text-sm font-bold text-slate-800">
															{item.title}
														</h3>

														<p className="mt-1 text-sm text-slate-500">
															{item.quantity}
														</p>
													</div>
												</div>
											))}
										</div>
									</div>
								</div>
							</div>
							<div className="xl:sticky xl:top-3 w-full xl:w-[300px]">
								<div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
									{/* PRICE */}
									<div>
										<p className="text-lg text-slate-500">Starting From</p>

										<h2 className="mt-1 text-3xl font-bold text-slate-800 md:text-4xl">
											₹ {product.price || "1,45,000"}
										</h2>

										<p className="mt-1 text-lg text-slate-500">
											(Inclusive of all taxes)
										</p>
									</div>

									{/* REQUEST QUOTE */}
									<button
										type="button"
										className="mt-1 flex h-14 w-full items-center justify-center gap-3 rounded-2xl border border-blue-700 bg-blue-700 text-lg  font-semibold text-white transition hover:bg-blue-800"
									>
										<FileText size={20} />
										Request a Quote
									</button>

									{/* TALK TO EXPERT */}
									<button
										type="button"
										className="mt-1 flex h-14 w-full items-center justify-center gap-3 rounded-2xl border border-blue-700 bg-blue-700 text-lg  font-semibold text-white transition hover:bg-blue-800"
									>
										<Phone size={20} />
										Talk to Expert
									</button>

									{/* DIVIDER */}
									<div className="my-5 border-t border-slate-200" />

									{/* BENEFITS */}
									<div className="space-y-1 -mt-6">
										{/* FREE INSTALLATION */}
										<div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white px-4 py-4 shadow-sm transition hover:shadow-md">
											<div className="flex h-15 w-10 shrink-0 items-center justify-center ml-3">
												<Wrench size={22} className="text-blue-900" />
											</div>

											<div className="flex flex-col items-start m-0 p-0">
												<div >
													<h4 className="m-0 p-0 text-lg font-semibold leading-6 text-slate-700">
														Free Installation
													</h4>
												</div>

												<div className="m-0 p-0">
													<p className="m-0 p-0 text-lg leading-6 text-slate-500">
														Professional setup
													</p>
												</div>
											</div>
										</div>

										{/* AMC SUPPORT */}
										<div className="flex  items-center gap-4 rounded-xl border border-slate-200 bg-white px-4 py-4 shadow-sm transition hover:shadow-md">
											{/* ICON */}
											<div className="flex h-15 w-10 shrink-0 items-center justify-center">
												<ShieldCheck size={22} className="text-blue-900" />
											</div>

											{/* TEXT */}
											<div className="flex flex-col items-start justify-center m-0 p-0">
												<div>
													<h4 className="m-0 p-0 text-lg font-semibold leading-6 text-slate-700">
														AMC Support
													</h4>
												</div>

												<div>
													<p className="m-0 p-0 text-lg leading-6 text-slate-500">
														Reliable after-sales service
													</p>
												</div>
											</div>
										</div>

										{/* PAN INDIA DELIVERY */}
										<div className="flex  items-center gap-4 rounded-xl border border-slate-200 bg-white px-4 py-4 shadow-sm transition hover:shadow-md">
											{/* ICON */}
											<div className="flex h-16 w-10 shrink-0 items-center justify-center">
												<Truck size={22} className="text-blue-900" />
											</div>

											{/* TEXT */}
											<div className="flex flex-col items-start justify-center m-0 p-0">
												<div>
													<h4 className="m-0 p-0 text-lg font-semibold leading-6 text-slate-700">
														Pan India Delivery
													</h4>
												</div>

												<div>
													<p className="m-0 p-0 text-lg leading-6 text-slate-500">
														Delivered to your clinic
													</p>
												</div>
											</div>
										</div>

										{/* EASY EMI OPTIONS */}
										<div className="flex  items-center gap-4 rounded-xl border border-slate-200 bg-white px-4 py-4 shadow-sm transition hover:shadow-md">
											{/* ICON */}
											<div className="flex h-16 w-10 shrink-0 items-center justify-center">
												<BadgeIndianRupee size={22} className="text-blue-900" />
											</div>

											{/* TEXT */}
											<div className="flex flex-col items-start justify-center m-0 p-0">
												<div>
													<h4 className="m-0 p-0 text-lg font-semibold leading-6 text-slate-700">
														Easy EMI Options
													</h4>
												</div>

												<div>
													<p className="m-0 p-0 text-lg leading-6 text-slate-500">
														Flexible payment options
													</p>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className="mt-1 overflow-hidden rounded-xl  bg-white">
							{/* TAB BUTTONS */}
							<div className="flex overflow-x-auto border-0 border-b border-solid border-slate-200 scrollbar-hide">
								{detailTabs.map((tab) => (
									<button
										type="button"
										key={tab.id}
										onClick={() => setActiveTab(tab.id)}
										className={`relative shrink-0 appearance-none whitespace-nowrap rounded-none border-0 !border-0 !bg-transparent px-5 py-4 text-lg font-semibold !shadow-none outline-none transition focus:border-0 focus:outline-none focus:ring-0 sm:px-7 ${activeTab === tab.id
											? "text-teal-800"
											: "text-slate-500 hover:text-slate-800"
											}`}
									>
										{tab.label}

										{activeTab === tab.id && (
											<span className="absolute bottom-0 left-4 right-4 h-0.5 bg-teal-800" />
										)}
									</button>
								))}
							</div>

							<div className="min-h-[120px] p-5 sm:p-6">
								<h2 className="text-lg font-bold text-slate-800">
									{detailTabs.find((tab) => tab.id === activeTab)?.label}
								</h2>

								{activeTab === "description" && details?.description && (
									<p className="mt-2 text-lg leading-6 text-slate-600">
										{details.description}
									</p>
								)}

								{activeTab === "specifications" && details?.specifications?.length > 0 && (
									<dl className="mt-3 grid gap-3 sm:grid-cols-2">
										{details.specifications.map(({ icon: Icon, title, value }) => (
											<div key={title} className="flex items-center gap-3 rounded-lg bg-slate-50 p-3">
												<Icon size={18} className="shrink-0 text-teal-700" />
												<dt className="flex-1 text-lg text-slate-600">{title}</dt>
												<dd className="text-lg font-semibold text-slate-800">{value}</dd>
											</div>
										))}
									</dl>
								)}

								{activeTab === "features" && details?.highlights?.length > 0 && (
									<ul className="mt-3 space-y-2">
										{details.highlights.map((highlight) => (
											<li key={highlight} className="text-lg leading-6 text-slate-600">
												{highlight}
											</li>
										))}
									</ul>
								)}

								{activeTab === "included" && includedProducts.length > 0 && (
									<ul className="mt-3 grid gap-2 sm:grid-cols-2">
										{includedProducts.map((item, index) => (
											<li
												key={`${item.title}-${index}`}
												className="flex items-center justify-between gap-3 rounded-lg bg-slate-50 px-3 py-2 text-lg"
											>
												<span className="text-slate-700">{item.title}</span>
												<span className="shrink-0 text-slate-500">{item.quantity}</span>
											</li>
										))}
									</ul>
								)}

								{activeTab === "downloads" && details?.downloads?.length > 0 && (
									<ul className="mt-3 space-y-2">
										{details.downloads.map((download) => (
											<li key={download.url}>
												<a
													href={download.url}
													className="text-sm font-medium text-blue-700 hover:underline"
												>
													{download.title}
												</a>
											</li>
										))}
									</ul>
								)}
							</div>
						</div>
					</div>
				</div>
				{/* MOBILE VIEW */}
				<div className="block lg:hidden min-h-screen w-full bg-slate-50">
					{/* ================= MAIN IMAGE ================= */}
					<div className="relative w-full overflow-hidden bg-white px-3 py-3 sm:px-5 sm:py-4">
						<img
							src={productImages[selectedImage]}
							alt={`Product ${selectedImage + 1}`}
							className="block h-auto w-full object-contain"
						/>
					</div>
					<div className="block lg:hidden bg-white px-4 pt-0 pb-4">
						<div className="flex w-full gap-3 overflow-x-auto overflow-y-hidden scrollbar-hide">
							{productImages.map((image, index) => (
								<button
									key={index}
									type="button"
									onClick={() => setSelectedImage(index)}
									aria-label={`View product image ${index + 1}`}
									className={`h-[70px] w-[70px] min-w-[70px] flex-shrink-0 overflow-hidden rounded-xl border-2 bg-white transition-all sm:h-[78px] sm:w-[78px] sm:min-w-[78px] ${selectedImage === index
										? "border-blue-600"
										: "border-slate-200"
										}`}
								>
									<img
										src={image}
										alt={`Thumbnail ${index + 1}`}
										className="h-full w-full object-contain p-1"
									/>
								</button>
							))}
						</div>
					</div>
					<h1 className="text-4xl md:text-[50px] leading-tight font-bold text-slate-800 px-4 mt-2">
						{product.name ||
							product.title ||
							"Advanced Dental Chair"}
					</h1>
					<div className=" rounded-3xl  px-4 ">
						{/* PRICE */}
						<div>
							<p className="text-lg font-bold text-slate-500">
								Starting From
							</p>

							<h2 className="text-5xl font-bold text-slate-800 mt-1">
								₹ {product.price || "1,45,000"}
							</h2>

							<p className="text-lg text-slate-500 mt-1">
								(Inclusive of all taxes)
							</p>
						</div>

						{/* STOCK */}
						<div className="flex items-center gap-2 mt-1">
							<Check size={20} className="text-blue-700" />

							<span className="text-lg font-semibold text-blue-700">
								In Stock
							</span>
						</div>
					</div>
					<div className=" rounded-3xl  px-4 overflow-hidden">
						{/* HEADER */}
						<div className="flex items-center justify-between mb-2 mt-2">
							<h2 className="text-2xl md:text-3xl font-black text-slate-800">
								Products Included in this Package
							</h2>
						</div>
						<div className="flex gap-3 overflow-x-auto scrollbar-hide lg:hidden">
							{includedProducts.map((item, index) => (
								<div
									key={index}
									className="min-w-[140px] w-[150px] border border-slate-200 rounded-2xl bg-white overflow-hidden shrink-0 "
								>
									{/* PRODUCT IMAGE */}
									<div className="h-[130px] bg-white flex items-center justify-center overflow-hidden">
										<img
											src={item.image}
											alt={item.title}
											onError={handleImageError}
											className="w-full h-full object-contain p-3"
										/>
									</div>

									{/* PRODUCT DETAILS */}
									<div className="px-3 pb-1 text-center">
										<h3 className="font-bold text-lg text-slate-900 line-clamp-1">
											{item.title}
										</h3>

										<p className="text-lg text-slate-500 mt-0">
											{item.quantity}
										</p>
									</div>
								</div>
							))}
						</div>
						{/* BENEFITS */}
						<div className="grid grid-cols-4 gap-2 mt-2 px-0 ">
							{/* Free Installation */}
							<div className="flex h-[100px] flex-col items-center justify-center rounded-xl border border-slate-200 bg-white px-1 py-2 shadow-sm">
								<Wrench size={30} className="mb-2 text-teal-600" />

								<h4 className="text-lg font-semibold leading-tight text-center text-slate-1000">
									Free
									<br />
									Installation
								</h4>
							</div>

							{/* AMC Support */}
							<div className="flex h-[100px] flex-col items-center justify-center rounded-xl border border-slate-200 bg-white px-1 py-2 shadow-sm">
								<ShieldCheck
									size={30}
									className="text-teal-600 mb-2"
								/>

								<h4 className="text-lg font-semibold text-slate-900 text-center leading-tight">
									AMC
									<br />
									Support
								</h4>
							</div>

							{/* Pan India Delivery */}
							<div className="flex h-[100px] flex-col items-center justify-center rounded-xl border border-slate-200 bg-white px-1 py-2 shadow-sm">
								<Truck size={30} className="text-teal-600 mb-2" />

								<h4 className="text-lg font-semibold text-slate-900 text-center leading-tight">
									Pan India
									<br />
									Delivery
								</h4>
							</div>

							{/* Easy EMI Options */}
							<div className="flex h-[100px] flex-col items-center justify-center rounded-xl border border-slate-200 bg-white px-1 py-2 shadow-sm">
								<BadgeIndianRupee
									size={30}
									className="text-teal-600 mb-2"
								/>

								<h4 className="text-lg font-semibold text-slate-900 text-center leading-tight">
									Easy EMI
									<br />
									Options
								</h4>
							</div>
						</div>
					</div>
<div className="mx-4 mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm sm:mx-4  sm:mt-5 md:mx-5">
  {[
    {
      id: "features",
      label: "Features",
      icon: ListIcon,
      color: "bg-blue-600",
    },
    {
      id: "description",
      label: "Description",
      icon: FileText,
      color: "bg-orange-500",
    },
    {
      id: "specifications",
      label: "Key Specifications",
      icon: Settings,
      color: "bg-purple-500",
    },
    {
      id: "direction",
      label: "Direction To Use",
      icon: BookOpen,
      color: "bg-pink-500",
    },
    {
      id: "additional",
      label: "Additional Info",
      icon: Info,
      color: "bg-cyan-600",
    },
  ].map((tab, index, tabs) => {
    const Icon = tab.icon;
    const isOpen = activeTab === tab.id;

    return (
      <div
  key={tab.id}
  className="mx-2 sm:mx-3"
>
  {/* ACCORDION HEADER */}
  <button
    type="button"
    onClick={() => setActiveTab(isOpen ? "" : tab.id)}
    className="flex min-h-[56px] w-full items-center justify-between gap-2 border-0 !border-0 bg-white px-2 py-3 text-left shadow-none outline-none transition hover:bg-slate-50 focus:border-0 focus:outline-none focus:ring-0 active:border-0 sm:min-h-[60px] sm:px-4 sm:py-3.5"
  >
    {/* ICON + LABEL */}
    <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-white sm:h-9 sm:w-9 ${tab.color}`}
      >
        <Icon size={20} />
      </div>

      <span className="break-words text-lg font-semibold leading-snug text-slate-800 sm:text-base">
        {tab.label}
      </span>
    </div>

    {/* ARROW */}
    <ChevronDown
      size={18}
      className={`shrink-0 text-slate-600 transition-transform duration-300 ${
        isOpen ? "rotate-180" : ""
      }`}
    />
  </button>
        {/* ACCORDION CONTENT */}
{isOpen && (
  <div className="bg-white px-5 pb-5 pt-2">
    {tab.id === "features" && (
      <div className="space-y-3">
        {details?.highlights?.map((feature, index) => (
          <div key={index} className="flex items-center gap-3">
            <CheckCircle2
              size={20}
              className="shrink-0 text-blue-600"
            />
            <span className="text-lg text-slate-600">
              {feature}
            </span>
          </div>
        ))}
      </div>
    )}
  </div>
)}
        {index < tabs.length - 1 && (
          <div aria-hidden="true" className="mx-2 h-px bg-slate-300 sm:mx-3" />
        )}
      </div>
    );
  })}
</div>

				</div>


			</main>

			<div className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white p-3 shadow-lg lg:hidden">
				<div className="mx-auto flex max-w-xl gap-3">
					<Link
						to="/contact-us"
						className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl border border-blue-700 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
					>
						<FileText size={18} />
						<span>Request a Quote</span>
					</Link>
					<Link
						to="/contact-us"
						className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-blue-700 text-sm font-semibold text-white transition hover:bg-blue-800"
					>
						<Phone size={18} />
						<span>Talk to Expert</span>
					</Link>
				</div>
			</div>
			<div className="pb-20 lg:pb-0">
				<Footer />
			</div>
		</>
	);
};

export default NewClinicSetup;
