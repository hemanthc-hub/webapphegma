import re

with open('src/screens/ProductScreen.js', 'r') as f:
    content = f.read()

imports = """
import {
  Star, Heart, Truck, RotateCcw, CheckCircle, ChevronRight, ChevronDown, ChevronUp,
  Plus, Minus, ShoppingCart, Info, Banknote, Landmark, CreditCard, Wallet, BadgePercent,
  ShieldCheck, Receipt, IndianRupee, FileText, List, Package, ClipboardList, BookOpen,
  PencilLine, Sparkles, Tags, PackageSearch, ArrowRight, CheckCircle2, Headphones, Clock3
} from "lucide-react";
"""

helper_components = """

function VariantRow({ variant, productName, product, onAddToCart }) {
  const [qty, setQty] = React.useState(1);
  return (
    <div className="hidden lg:block border border-slate-200 rounded-2xl p-4 bg-white hover:border-blue-200 hover:shadow-sm transition-all mb-4">
      <div className="flex w-full items-start gap-4">
        <div className="w-20 h-20 shrink-0 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-center overflow-hidden">
          <img src={product.image} alt={variant.name} className="w-full h-full object-contain" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-slate-800 text-sm mb-1">{productName} - {variant.name}</div>
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="text-lg font-black text-slate-900">₹{variant.pricing?.price?.net?.amount || variant.price}</span>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
             <span className="flex items-center gap-1"><Truck size={12} className="text-slate-400" /> Arrives in 3-5 days</span>
             <span className="text-slate-300">|</span>
             <span className="flex items-center gap-1"><CheckCircle size={12} className="text-green-500" /> COD Available</span>
          </div>
        </div>
        <div className="flex flex-col items-center gap-2 shrink-0">
          <div className="w-28 flex items-center border border-slate-200 rounded-lg overflow-hidden">
            <button onClick={() => setQty(q => Math.max(1, q - 1))} className="flex-1 h-8 flex items-center justify-center bg-slate-50 hover:bg-slate-100 transition-colors"><Minus size={12} /></button>
            <span className="w-10 text-center text-sm font-semibold">{qty}</span>
            <button onClick={() => setQty(q => q + 1)} className="flex-1 h-8 flex items-center justify-center bg-slate-50 hover:bg-slate-100 transition-colors"><Plus size={12} /></button>
          </div>
          <button onClick={() => onAddToCart(variant.id, qty)} disabled={qty === 0} className={`w-28 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors ${qty === 0 ? "bg-slate-300 text-slate-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white"}`}>
            <ShoppingCart size={16} /> <span>ADD</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function TabContent({ activeTab, showAllFeatures, setShowAllFeatures, descriptionObj, attributes }) {
  const baseFeatures = ["High quality material", "Durable and reliable", "Industry standard compliant"];
  return (
    <div className="p-3 sm:p-4 lg:p-5 text-slate-600 text-xs sm:text-sm">
      {activeTab === "description" && (
        <div className="space-y-3 leading-relaxed" dangerouslySetInnerHTML={{__html: descriptionObj?.blocks?.[0]?.data?.text || "No description available."}}>
        </div>
      )}
      {activeTab === "specifications" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
           {attributes?.map(attr => (
              <div key={attr.attribute.name}>
                 <span className="font-semibold text-slate-800">{attr.attribute.name}:</span>
                 <p className="mt-1">{attr.values.map(v => v.name).join(", ")}</p>
              </div>
           ))}
        </div>
      )}
      {activeTab !== "description" && activeTab !== "specifications" && (
         <div className="space-y-3 leading-relaxed">
            <p>Information not available.</p>
         </div>
      )}
    </div>
  );
}

const paymentOptions = [
  { icon: <Banknote className="w-5 h-5 text-green-600" />, label: "COD" },
  { icon: <span className="text-1xl font-bold text-green-600">↠</span>, label: "UPI" },
  { icon: <CreditCard className="w-5 h-5 text-blue-600" />, label: "Card" },
  { icon: <Landmark className="w-5 h-5 text-blue-700" />, label: "NetBank" },
  { icon: <Wallet className="w-5 h-5 text-amber-500" />, label: "EMI" },
  { icon: <Wallet className="w-5 h-5 text-violet-600" />, label: "Wallet" },
];

const benefits = [
  { icon: <ShieldCheck className="w-5 h-5 text-green-600" />, label: "Genuine" },
  { icon: <Truck className="w-5 h-5 text-blue-600" />, label: "Fast Ship" },
  { icon: <Tags className="w-5 h-5 text-pink-600" />, label: "Best Price" },
  { icon: <Receipt className="w-5 h-5 text-violet-600" />, label: "GST Invoice" },
];

const TABS = [
  { id: "description", label: "Description", icon: FileText },
  { id: "specifications", label: "Specifications", icon: ClipboardList },
  { id: "features", label: "Features", icon: List },
  { id: "packaging", label: "Packaging", icon: Package },
];

"""

# Add imports
content = content.replace('import Editor from "../components/Editor";', 'import Editor from "../components/Editor";\n' + imports)

# Add helper components before ProductScreen
content = content.replace('function ProductScreen() {', helper_components + '\nfunction ProductScreen() {')


# State changes
state_adds = """
  const [activeTab, setActiveTab] = useState("description");
  const [showAllFeatures, setShowAllFeatures] = useState(false);
  const [pincodeStatus, setPincodeStatus] = useState("idle");
  const [estimatedDelivery, setEstimatedDelivery] = useState("");
  const deliveryDate = "3-5 Business Days";

  const customAddToCart = (id, qty) => {
    setLoader(true);
    if (localStorage.getItem("cartToken") === null) {
      CreateCheckout({
        variables: {
          channel: "default-channel",
          email: localStorage.getItem("user") !== null ? localStorage.getItem("email") : "hegmakart@gmail.com",
          lines: [{ quantity: qty, variantId: id }],
        },
        onCompleted: (data) => {
          if (data.checkoutCreate.checkout !== null) {
            localStorage.setItem("cartToken", data.checkoutCreate.checkout.token);
          }
          window.dispatchEvent(new CustomEvent('cart-updated'));
        }
      });
    } else {
      addLineCheckout({
        variables: {
          token: localStorage.getItem("cartToken"),
          lines: [{ quantity: qty, variantId: id }],
        },
        onCompleted: (data) => {
          window.dispatchEvent(new CustomEvent('cart-updated'));
        }
      });
    }
  };
"""

content = content.replace('const [modals, setModals] = useState("")', 'const [modals, setModals] = useState("")\n' + state_adds)


# replace the main return
old_return_start = content.find('<main style={{ position: "relative" }} className={`main ${modals}`}>')
old_return_end = content.find('</main>', old_return_start) + 7

if old_return_start != -1 and old_return_end != -1:
    new_ui = """
      <main style={{ position: "relative", backgroundColor: "#f8fafc" }} className={`main ${modals}`}>
        <Header />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24">
          <div className="flex items-center gap-2 text-sm mt-3 mb-6">
             <span className="text-slate-400">Home</span>
             {product.category && (
                <>
                   <ChevronRight className="w-4 h-4 text-slate-300" />
                   <span className="text-slate-400">{product.category.name}</span>
                </>
             )}
             <ChevronRight className="w-4 h-4 text-slate-300" />
             <span className="font-medium text-slate-900">{product.name}</span>
          </div>
          
          <div className="grid lg:grid-cols-[460px_minmax(0,1fr)_320px] gap-6 w-full">
             
             {/* LEFT SIDE - Sticky */}
             <div className="sticky top-6 self-start">
               <div className="flex flex-col gap-4">
                  <div className="relative bg-white rounded-xl border border-slate-200 flex items-center justify-center h-[500px] w-full overflow-hidden group">
                     <img src={currentImage} alt={product.name} className="w-full h-full object-contain p-4 transition-transform duration-300 group-hover:scale-110" />
                     <button onClick={() => onAddToWishlist(product.id)} className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white shadow-md border border-slate-100 flex items-center justify-center hover:scale-110 transition-transform">
                        <Heart size={18} className={checkWishlist.includes(product.id) ? "fill-red-500 text-red-500" : "text-slate-400"} />
                     </button>
                  </div>
                  <div className="flex w-full gap-4 overflow-x-auto">
                     {product.media?.slice(0,4).map((img, idx) => (
                        <button key={idx} onClick={() => setCurrentImage(img.url)} className={`flex-1 h-[110px] rounded-2xl overflow-hidden border-2 bg-white p-2 transition-all ${currentImage === img.url ? "border-blue-500 shadow-md" : "border-slate-200 hover:border-slate-300"}`}>
                           <img src={img.url} alt="thumb" className="w-full h-full object-contain" />
                        </button>
                     ))}
                  </div>
               </div>
             </div>

             {/* MIDDLE SIDE - Scrollable */}
             <div className="max-w-[560px] space-y-5 lg:ml-8">
                <h1 className="text-[28px] lg:text-3xl font-semibold text-slate-900 leading-tight mb-1">{product.name}</h1>
                {setattributes.map((attr) => attr.attribute.name === "Manufacturer" && (
                  <p className="text-sm text-slate-500 font-medium">By {attr.values[0]?.name}</p>
                ))}
                
                <div className="flex items-center gap-2 flex-wrap mt-2">
                   <div className="flex items-center gap-1.5">
                      {[1,2,3,4,5].map(star => (
                         <Star key={star} size={16} className={star <= (product.rating || 5) ? "fill-amber-400 text-amber-400" : "text-slate-300"} />
                      ))}
                   </div>
                   <span className="text-lg font-semibold text-slate-800">{(product.rating || 5).toFixed(1)}</span>
                </div>

                {!product.productType?.hasVariants ? (
                   <>
                     <div className="flex items-center gap-4 mt-3">
                        <span className="text-4xl font-bold text-slate-900">₹{product?.pricing?.priceRange?.start?.net?.amount}</span>
                     </div>
                     <div className="flex items-center gap-4 mt-4">
                        <div className="flex items-center gap-3">
                           <span className="text-lg font-medium text-slate-600">Qty:</span>
                           <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-white">
                              <button onClick={() => setProductQuantity(Math.max(1, productQuantity - 1))} className="w-10 h-10 flex items-center justify-center border-r border-slate-200 text-slate-700 hover:bg-blue-600 hover:text-white transition-all"><Minus size={14}/></button>
                              <span className="w-12 h-10 flex items-center justify-center text-sm font-semibold">{productQuantity}</span>
                              <button onClick={() => setProductQuantity(productQuantity + 1)} className="w-10 h-10 flex items-center justify-center border-l border-slate-200 text-slate-700 hover:bg-blue-600 hover:text-white transition-all"><Plus size={14}/></button>
                           </div>
                        </div>
                        <button onClick={() => customAddToCart(variantId, productQuantity)} className="w-[130px] h-12 flex items-center justify-center gap-1.5 rounded-lg text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-all"><ShoppingCart size={16} /> Add</button>
                        <button onClick={() => { setShowBulkEnquiry(true); setModals("pageBg"); }} className="w-[140px] h-12 flex items-center justify-center border-2 border-blue-600 text-blue-600 hover:bg-blue-50 rounded-lg text-sm font-semibold transition-colors">Bulk Enquiry</button>
                     </div>
                   </>
                ) : (
                   <div className="mt-4">
                      <h3 className="font-semibold text-lg mb-3">Select Variant</h3>
                      {setvariants.map(variant => (
                         <VariantRow key={variant.id} variant={variant} productName={product.name} product={{image: currentImage}} onAddToCart={customAddToCart} />
                      ))}
                      <div className="mt-4">
                         <button onClick={() => { setShowBulkEnquiry(true); setModals("pageBg"); }} className="w-[140px] h-12 flex items-center justify-center border-2 border-blue-600 text-blue-600 hover:bg-blue-50 rounded-lg text-sm font-semibold transition-colors">Bulk Enquiry</button>
                      </div>
                   </div>
                )}
                
                {/* Delivery and Pincode */}
                <div className="w-[480px] flex flex-col gap-3 mt-8">
                   <p className="text-lg font-semibold text-slate-800 mb-2">Check Delivery Availability</p>
                   <div className="flex gap-2">
                      <input type="text" value={productA} onChange={(e) => setProductA(e.target.value)} placeholder="Enter 6-digit pincode" className="w-[200px] border border-slate-200 rounded-xl px-6 py-4 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition" maxLength={6} />
                      <button onClick={checkProductAvailability} className="px-6 py-4 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition">CHECK</button>
                   </div>
                   {ServiceAvailabilityPopup && <p className="text-emerald-600 text-xs font-medium flex items-center gap-1"><CheckCircle size={13} />Delivery available at pincode <strong>{productA}</strong></p>}
                   {ServiceUnavailabilityPopup && <p className="text-red-500 text-xs font-medium">Delivery not available at pincode <strong>{productA}</strong></p>}
                </div>
                
                {/* Tabs */}
                <div className="mt-8 border border-slate-200 rounded-2xl bg-white overflow-hidden shadow-sm">
                   <div className="flex overflow-x-auto border-b border-slate-100 scrollbar-hide">
                      {TABS.map(tab => {
                         const Icon = tab.icon;
                         const isActive = activeTab === tab.id;
                         return (
                            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-4 py-3.5 text-sm font-semibold whitespace-nowrap transition-all border-b-2 ${isActive ? "border-blue-600 text-blue-600 bg-blue-50/50" : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50"}`}>
                               <Icon size={16} className={isActive ? "text-blue-600" : "text-slate-400"} />
                               {tab.label}
                            </button>
                         )
                      })}
                   </div>
                   <TabContent activeTab={activeTab} showAllFeatures={showAllFeatures} setShowAllFeatures={setShowAllFeatures} descriptionObj={obj} attributes={setattributes} />
                </div>
             </div>
             
             {/* RIGHT SIDE - Benefits & Payment */}
             <div className="space-y-4">
                <div className="border border-slate-200 rounded-2xl bg-white p-5 shadow-sm">
                   <h3 className="font-bold text-slate-800 mb-4 text-sm uppercase tracking-wider flex items-center gap-2">
                      <Sparkles size={16} className="text-amber-500" /> Hegmakart Benefits
                   </h3>
                   <div className="space-y-4">
                      {benefits.map((b, i) => (
                         <div key={i} className="flex items-center gap-3"><div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">{b.icon}</div><span className="font-semibold text-slate-700 text-sm">{b.label}</span></div>
                      ))}
                   </div>
                </div>
                
                <div className="border border-slate-200 rounded-2xl bg-white p-5 shadow-sm">
                   <h3 className="font-bold text-slate-800 mb-4 text-sm uppercase tracking-wider flex items-center gap-2">
                      <CreditCard size={16} className="text-blue-500" /> Payment Options
                   </h3>
                   <div className="grid grid-cols-2 gap-3">
                      {paymentOptions.map((opt, idx) => (
                         <div key={idx} className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-50 transition-colors"><div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 shadow-sm">{opt.icon}</div><span className="text-xs font-semibold text-slate-600">{opt.label}</span></div>
                      ))}
                   </div>
                </div>
             </div>
             
          </div>
          
          <div className="mt-12">
             <RelatedProducts categoryId={product?.category?.id} excludeProductId={notMatchRecently} />
             <RecentlyViewed excludeProductId={notMatchRecently} />
          </div>
        </div>
        <Footer />
      </main>
"""
    content = content[:old_return_start] + new_ui + content[old_return_end:]

with open('src/screens/ProductScreen.js', 'w') as f:
    f.write(content)

print("Updated ProductScreen.js successfully.")
