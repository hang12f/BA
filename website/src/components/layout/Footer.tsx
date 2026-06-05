export default function Footer() {
  return (
    <footer className="border-t border-border/50 bg-surface/50">
      <div className="container-custom py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary-grad flex items-center justify-center text-white font-bold text-sm">BA</div>
            <div>
              <p className="text-slate-300 font-medium text-sm">英国航空客户反馈数据分析</p>
              <p className="text-slate-500 text-xs mt-0.5">基于 PySpark 大数据分析技术</p>
            </div>
          </div>
          <div className="flex items-center gap-6 text-sm text-slate-500">
            <span>9 个分析模块</span>
            <span className="w-1 h-1 rounded-full bg-slate-600" />
            <span>4 种 ML 模型</span>
            <span className="w-1 h-1 rounded-full bg-slate-600" />
            <span>~3,923 条评论</span>
          </div>
          <p className="text-slate-600 text-xs">
            &copy; {new Date().getFullYear()} &mdash; 数据分析作品集展示
          </p>
        </div>
      </div>
    </footer>
  );
}
