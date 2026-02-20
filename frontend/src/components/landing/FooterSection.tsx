export default function FooterSection() {
    return (
        <footer className="border-t border-slate-800 bg-slate-950">
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="col-span-2 md:col-span-1">
                        <span className="text-lg font-bold text-emerald-400 tracking-tight">
                            Quotation<span className="text-white">System</span>
                        </span>
                        <p className="mt-3 text-sm text-slate-500 leading-relaxed">
                            Professional quotation management for modern businesses.
                        </p>
                    </div>

                    {/* Product */}
                    <div>
                        <h4 className="text-sm font-semibold text-white mb-3">Product</h4>
                        <ul className="space-y-2 text-sm text-slate-500">
                            <li><a href="#features" className="hover:text-slate-300 transition-colors">Features</a></li>
                            <li><a href="#pricing" className="hover:text-slate-300 transition-colors">Pricing</a></li>
                            <li><a href="#how-it-works" className="hover:text-slate-300 transition-colors">How it Works</a></li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h4 className="text-sm font-semibold text-white mb-3">Company</h4>
                        <ul className="space-y-2 text-sm text-slate-500">
                            <li><a href="#" className="hover:text-slate-300 transition-colors">About</a></li>
                            <li><a href="#" className="hover:text-slate-300 transition-colors">Blog</a></li>
                            <li><a href="#" className="hover:text-slate-300 transition-colors">Careers</a></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="text-sm font-semibold text-white mb-3">Support</h4>
                        <ul className="space-y-2 text-sm text-slate-500">
                            <li><a href="#faq" className="hover:text-slate-300 transition-colors">FAQ</a></li>
                            <li><a href="#" className="hover:text-slate-300 transition-colors">Contact</a></li>
                            <li><a href="#" className="hover:text-slate-300 transition-colors">Privacy</a></li>
                        </ul>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="mt-10 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-slate-600">
                        © {new Date().getFullYear()} QuotationSystem. All rights reserved.
                    </p>
                    <div className="flex items-center gap-4 text-sm text-slate-600">
                        <a href="#" className="hover:text-slate-400 transition-colors">Terms</a>
                        <a href="#" className="hover:text-slate-400 transition-colors">Privacy</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
