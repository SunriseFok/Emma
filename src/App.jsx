import React, { useMemo, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Bell,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Database,
  Droplets,
  ExternalLink,
  Eye,
  Filter,
  Gauge,
  LayoutDashboard,
  ListTodo,
  Package,
  Search,
  ShieldAlert,
  TimerReset,
  TrendingUp,
  Truck,
  User,
  Wrench
} from 'lucide-react';

const sidebarItems = [
  { key: 'dashboard', label: 'Dashboard', icon: BarChart3 },
  { key: 'home', label: '我的任务', icon: ListTodo },
  { key: 'asset-events', label: '设备', icon: Truck },
  { key: 'alarms', label: '事件', icon: Bell },
  { key: 'maintenance', label: '计划维修', icon: Wrench }
];

const events = [
  {
    id: 'EVT-240901-001',
    code: 'EID:1190',
    title: '高液压油温',
    asset: 'XE2000-01',
    model: 'XE2000',
    severity: '高',
    source: '发动机/液压',
    location: '巴西北部矿区-1号采场',
    time: '09/01 08:12',
    occurrences: 40,
    meter: '2,501h',
    status: '待处理',
    owner: '张工',
    summary: '液压油温持续高于设定阈值，存在降功率与停机风险。'
  },
  {
    id: 'EVT-240901-002',
    code: 'CID:247-FMI:9',
    title: '数据链路异常',
    asset: 'XE5600-02',
    model: 'XE5600',
    severity: '中',
    source: '车载控制网络',
    location: '巴西北部矿区-2号采场',
    time: '09/01 07:48',
    occurrences: 13,
    meter: '3,772h',
    status: '处理中',
    owner: '李工',
    summary: '控制器间通信异常，影响状态采集与部分诊断联动。'
  },
  {
    id: 'EVT-240901-003',
    code: 'SOS-ENG-312',
    title: '油液样本异常',
    asset: 'XDE130-07',
    model: 'XDE130',
    severity: '中',
    source: '油液实验室',
    location: '排土场运输道路',
    time: '09/01 06:20',
    occurrences: 1,
    meter: '1,205h',
    status: '待确认',
    owner: '王工',
    summary: '铁含量与硅含量升高，建议排查磨损与外部污染来源。'
  },
  {
    id: 'EVT-240901-004',
    code: 'INSP-TA1-RED',
    title: 'TA1 点检红项',
    asset: 'GR3505-12',
    model: 'GR3505',
    severity: '低',
    source: '移动点检',
    location: '维修工位A',
    time: '08/31 17:33',
    occurrences: 2,
    meter: '496h',
    status: '待处理',
    owner: '赵工',
    summary: '履带张紧度与液位检查出现异常，需复核处理结果。'
  }
];

const oilSamples = [
  { sample: '发动机油', meter: '2,500h', date: '08/27', severity: '需处理', recommendation: '钠/钾升高，建议排查冷却液渗入' },
  { sample: '主泵液压油', meter: '2,500h', date: '08/27', severity: '关注', recommendation: '黏度偏高，建议结合油温趋势复核' },
  { sample: '终传动', meter: '2,500h', date: '08/27', severity: '正常', recommendation: '未见异常磨损金属' }
];

const inspections = [
  { item: 'TA1 Inspection', inspector: 'Hunter Moore', date: '08/28 13:07', red: 19, yellow: 2, green: 43, gray: 10 },
  { item: '班前点检', inspector: '张工', date: '09/01 07:20', red: 2, yellow: 3, green: 24, gray: 1 }
];

const knowledgeSteps = [
  '查看事件说明，确认阈值、触发条件与影响范围。',
  '检查历史趋势：油温、环境温度、负载、风扇转速、液压压力。',
  '按引导式诊断步骤执行：油位 → 散热器 → 风扇 → 油路堵塞 → 传感器校验。',
  '若定位为部件失效，跳转维修步骤，查看标准工艺、工时、工具与技能要求。',
  '如需更换件，联动备件信息，查看件号、替代件、库存与推荐套包。'
];

function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

function SeverityBadge({ value }) {
  const styles = {
    高: 'bg-red-50 text-red-700 border-red-200',
    中: 'bg-amber-50 text-amber-700 border-amber-200',
    低: 'bg-sky-50 text-sky-700 border-sky-200',
    待处理: 'bg-red-50 text-red-700 border-red-200',
    处理中: 'bg-amber-50 text-amber-700 border-amber-200',
    已关闭: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    待确认: 'bg-slate-50 text-slate-700 border-slate-200',
    需处理: 'bg-red-50 text-red-700 border-red-200',
    关注: 'bg-amber-50 text-amber-700 border-amber-200',
    正常: 'bg-emerald-50 text-emerald-700 border-emerald-200'
  };
  return <span className={cn('inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold', styles[value] || 'bg-slate-50 text-slate-700 border-slate-200')}>{value}</span>;
}

function SectionTitle({ title, subtitle, right }) {
  return (
    <div className="mb-4 flex items-start justify-between gap-4">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
        {subtitle ? <p className="mt-1 text-sm text-slate-500">{subtitle}</p> : null}
      </div>
      {right}
    </div>
  );
}

function StatCard({ title, value, sub, icon: Icon, color }) {
  return (
    <div className="rounded-3xl border bg-white p-5 shadow-panel">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm text-slate-500">{title}</div>
          <div className="mt-2 text-3xl font-bold text-slate-900">{value}</div>
          <div className="mt-2 text-xs text-slate-500">{sub}</div>
        </div>
        <div className={cn('rounded-2xl p-3', color)}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

function TopHeader() {
  return (
    <header className="flex h-16 items-center justify-between bg-xcmg px-6 text-white shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-10 items-center rounded-md bg-white px-2 py-1 shadow-sm">
          <img src="./xcmg-logo.svg" alt="XCMG" className="h-8 w-auto object-contain" />
        </div>
        <div className="text-sm font-medium text-blue-50">矿机事件管理平台原型</div>
      </div>
      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/15">
        <User className="h-5 w-5" />
      </div>
    </header>
  );
}

function Sidebar({ currentPage, setCurrentPage }) {
  return (
    <aside className="w-64 border-r bg-white">
      <div className="p-4">
        <div className="rounded-2xl border bg-slate-50 p-3">
          <div className="text-sm text-slate-500">当前角色</div>
          <div className="mt-1 font-semibold text-slate-900">徐工矿机设备运维工程师</div>
        </div>
      </div>
      <nav className="space-y-1 px-3 pb-4">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.key}
              onClick={() => setCurrentPage(item.key)}
              className={cn(
                'flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition',
                currentPage === item.key ? 'bg-xcmg-soft text-xcmg' : 'text-slate-700 hover:bg-slate-50'
              )}
            >
              <Icon className="h-4 w-4" />
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}

function FilterBar({ placeholder = '搜索事件码 / 设备 / 位置' }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <div className="flex flex-1 items-center gap-2 rounded-2xl border bg-white px-4 py-3 shadow-sm">
        <Search className="h-4 w-4 text-slate-400" />
        <input className="w-full bg-transparent text-sm outline-none" placeholder={placeholder} />
      </div>
      <button className="inline-flex items-center gap-2 rounded-2xl border bg-white px-4 py-3 text-sm font-medium shadow-sm">
        <Filter className="h-4 w-4" /> 筛选
      </button>
      <button className="rounded-2xl bg-xcmg px-4 py-3 text-sm font-medium text-white">导出</button>
    </div>
  );
}

function WidgetCard({ title, children, className = '' }) {
  return (
    <div className={cn('overflow-hidden rounded-3xl border bg-white shadow-panel', className)}>
      <div className="border-b border-amber-300 px-5 py-3">
        <div className="font-semibold text-slate-900">{title}</div>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function DonutChart() {
  return (
    <div className="flex items-center gap-8">
      <div>
        <div className="text-sm text-slate-500">Total Event Count</div>
        <div className="mt-2 text-4xl font-bold text-slate-900">27</div>
      </div>
      <div className="h-40 w-40 rounded-full" style={{ background: 'conic-gradient(#facc15 0 67%, #f59e0b 67% 89%, #ef4444 89% 100%)' }}>
        <div className="m-8 flex h-24 w-24 items-center justify-center rounded-full bg-white text-sm font-medium text-slate-600">CAT</div>
      </div>
      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-red-500" /> 高 - 3</div>
        <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-amber-500" /> 中 - 6</div>
        <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-yellow-400" /> 低 - 18</div>
      </div>
    </div>
  );
}

function HorizontalBars({ rows }) {
  return (
    <div className="space-y-4">
      {rows.map((row) => (
        <div key={row.label}>
          <div className="mb-1 flex items-center justify-between text-sm">
            <span className="truncate text-slate-700">{row.label}</span>
            <span className="font-medium text-slate-500">{row.value}</span>
          </div>
          <div className="h-5 rounded-full bg-slate-100">
            <div className="h-5 rounded-full bg-yellow-400" style={{ width: `${row.value * 10}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function DashboardPage() {
  return (
    <div>
      <SectionTitle
        title="Dashboard"
        subtitle="参考 MineStar Health Dashboard 的多模块分析布局，聚合事件统计分析、Top 事件、Top 设备与关键指标。"
        right={<button className="rounded-xl bg-xcmg px-4 py-2 text-sm font-medium text-white">刷新指标</button>}
      />

      <div className="grid grid-cols-4 gap-4">
        <StatCard title="设备可用率 DF" value="92.8%" sub="较上周 +1.4%" icon={Gauge} color="bg-emerald-50 text-emerald-600" />
        <StatCard title="MTTR" value="5.6h" sub="平均修复时间" icon={TimerReset} color="bg-amber-50 text-amber-600" />
        <StatCard title="MTBF" value="186h" sub="平均故障间隔" icon={TrendingUp} color="bg-sky-50 text-sky-600" />
        <StatCard title="活跃事件" value="17" sub="高优先级 4 条" icon={Bell} color="bg-red-50 text-red-600" />
      </div>

      <div className="mt-5 grid grid-cols-12 gap-4">
        <WidgetCard title="Total Event Count" className="col-span-4">
          <DonutChart />
        </WidgetCard>
        <WidgetCard title="Top 10 Events" className="col-span-4">
          <HorizontalBars rows={[
            { label: '高液压油温', value: 4 },
            { label: '数据链路异常', value: 2 },
            { label: '通信网关快照异常', value: 2 }
          ]} />
        </WidgetCard>
        <WidgetCard title="Top 10 Equipment" className="col-span-4">
          <HorizontalBars rows={[
            { label: 'XE2000-01', value: 10 },
            { label: 'XE5600-02', value: 3 }
          ]} />
        </WidgetCard>
      </div>

      <div className="mt-4 grid grid-cols-12 gap-4">
        <WidgetCard title="Snapshot Data" className="col-span-4">
          <div className="rounded-2xl border">
            <div className="grid grid-cols-2 border-b bg-slate-50 px-4 py-3 text-sm font-medium text-slate-500">
              <div>Event Description</div>
              <div>Snapshot Count</div>
            </div>
            <div className="grid grid-cols-2 px-4 py-4 text-sm text-slate-700">
              <div>Low Steering Accumulator Pressure</div>
              <div>7</div>
            </div>
          </div>
        </WidgetCard>
        <WidgetCard title="Trends - Fleet Summary Data" className="col-span-8">
          <div className="overflow-hidden rounded-2xl border">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Channel Name</th>
                  <th className="px-4 py-3 text-left font-medium">Unit</th>
                  <th className="px-4 py-3 text-left font-medium">Channel Group</th>
                  <th className="px-4 py-3 text-left font-medium">Min</th>
                  <th className="px-4 py-3 text-left font-medium">Max</th>
                  <th className="px-4 py-3 text-left font-medium">Avg</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['左前支柱压力平均行程', 'kPa', '悬挂系统', '7019', '8605', '7881.14'],
                  ['发动机空滤阻力', 'kPa', '发动机', '1.4', '3.1', '2.85'],
                  ['左后支柱压力平均行程', 'kPa', '悬挂系统', '8082', '14452', '11216.62'],
                  ['前轮重量-速度', 'TKPH', '轮胎/载荷', '237', '1455.4', '924.15']
                ].map((row) => (
                  <tr key={row[0]} className="border-t">
                    {row.map((cell) => (
                      <td key={cell} className="px-4 py-3 text-slate-700">{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </WidgetCard>
      </div>
    </div>
  );
}

function HomePage({ onOpenEvent }) {
  return (
    <div>
      <SectionTitle
        title="我的任务"
        subtitle="聚合当前运维工程师的待办事件、重点设备和事件健康概览。"
        right={<button className="rounded-xl bg-xcmg px-4 py-2 text-sm font-medium text-white">刷新首页</button>}
      />
      <div className="grid grid-cols-4 gap-4">
        <StatCard title="待处理告警" value="17" sub="其中高优先级 4 条" icon={Bell} color="bg-red-50 text-red-600" />
        <StatCard title="设备异常数" value="9" sub="覆盖 6 台关键设备" icon={AlertTriangle} color="bg-amber-50 text-amber-600" />
        <StatCard title="已分派处理中" value="6" sub="含 2 条需要油液复核" icon={Activity} color="bg-sky-50 text-sky-600" />
        <StatCard title="已关闭事件" value="23" sub="近 7 天闭环完成" icon={CheckCircle2} color="bg-emerald-50 text-emerald-600" />
      </div>

      <div className="mt-5 grid grid-cols-12 gap-4">
        <div className="col-span-7 rounded-3xl border bg-white p-5 shadow-panel">
          <SectionTitle title="我的待办事件" subtitle="按优先级与最新时间排序" />
          <div className="space-y-3">
            {events.slice(0, 3).map((e) => (
              <div key={e.id} className="flex items-center justify-between rounded-2xl border p-4 hover:bg-slate-50">
                <div>
                  <div className="flex items-center gap-2">
                    <SeverityBadge value={e.severity} />
                    <button onClick={() => onOpenEvent(e)} className="font-semibold text-xcmg hover:underline">{e.code}</button>
                    <span className="text-slate-900">{e.title}</span>
                  </div>
                  <div className="mt-2 text-sm text-slate-500">{e.asset} · {e.location} · {e.time}</div>
                </div>
                <button onClick={() => onOpenEvent(e)} className="rounded-xl border px-3 py-2 text-sm font-medium text-slate-700">处理</button>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-5 rounded-3xl border bg-white p-5 shadow-panel">
          <SectionTitle title="事件健康概览" subtitle="参考 VisionLink / MineStar 风格的首页摘要" />
          <div className="space-y-4">
            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="text-sm text-slate-500">健康事件</div>
              <div className="mt-2 flex items-center gap-4 text-sm">
                <span className="font-semibold text-red-600">4 HIGH</span>
                <span className="font-semibold text-amber-600">11 MEDIUM</span>
                <span className="font-semibold text-sky-600">2 LOW</span>
              </div>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="text-sm text-slate-500">维护任务</div>
              <div className="mt-2 flex items-center gap-4 text-sm">
                <span className="font-semibold text-emerald-600">7 COMPLETED</span>
                <span className="font-semibold text-red-600">3 OVERDUE</span>
                <span className="font-semibold text-amber-600">18 UPCOMING</span>
              </div>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="text-sm text-slate-500">设备状态</div>
              <div className="mt-2 flex items-center gap-4 text-sm">
                <span className="font-semibold text-red-600">2 NOT REPORTING</span>
                <span className="font-semibold text-slate-600">1 NETWORK UNSTABLE</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MaintenancePage() {
  return (
    <div>
      <SectionTitle title="计划维修" subtitle="面向运维工程师查看即将到期、已逾期和待执行的计划维修任务。" />
      <div className="grid grid-cols-4 gap-4">
        <StatCard title="本周待执行" value="18" sub="含 6 条关键设备任务" icon={Wrench} color="bg-sky-50 text-sky-600" />
        <StatCard title="已逾期" value="3" sub="需优先协调停机窗口" icon={AlertTriangle} color="bg-red-50 text-red-600" />
        <StatCard title="已完成" value="27" sub="近 7 天已完工任务" icon={CheckCircle2} color="bg-emerald-50 text-emerald-600" />
        <StatCard title="待备件准备" value="5" sub="建议联动备件套包" icon={Package} color="bg-amber-50 text-amber-600" />
      </div>

      <div className="mt-5 overflow-hidden rounded-3xl border bg-white shadow-panel">
        <div className="flex items-center justify-between border-b px-5 py-4">
          <div>
            <div className="font-semibold text-slate-900">计划维修任务列表</div>
            <div className="text-sm text-slate-500">按照到期时间、设备级别和停机要求排序</div>
          </div>
          <button className="rounded-xl bg-xcmg px-4 py-2 text-sm font-medium text-white">生成任务包</button>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-4 py-3 text-left font-medium">设备</th>
              <th className="px-4 py-3 text-left font-medium">任务名称</th>
              <th className="px-4 py-3 text-left font-medium">周期</th>
              <th className="px-4 py-3 text-left font-medium">到期时间</th>
              <th className="px-4 py-3 text-left font-medium">停机要求</th>
              <th className="px-4 py-3 text-left font-medium">备件状态</th>
              <th className="px-4 py-3 text-left font-medium">责任人</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['XE2000-01', '2500h 液压系统保养', '2500h', '09/03', '需停机', '已齐套', '张工'],
              ['XE5600-02', '冷却系统专项检查', '月度', '09/02', '可在线检查', '待确认', '李工'],
              ['XDE130-07', '发动机油液更换', '1000h', '09/05', '需停机', '低库存', '王工']
            ].map((row) => (
              <tr key={row[0]} className="border-t">
                {row.map((cell) => (
                  <td key={cell} className="px-4 py-3 text-slate-700 first:font-medium first:text-slate-900">{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AlarmListPage({ onOpenEvent }) {
  return (
    <div>
      <SectionTitle title="告警清单页" subtitle="显示当前运维工程师需要处理的全部告警事件列表与基本信息。" />
      <FilterBar />
      <div className="overflow-hidden rounded-3xl border bg-white shadow-panel">
        <div className="flex items-center justify-between border-b px-5 py-4">
          <div className="text-sm text-slate-500">共 17 条待处理事件</div>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span>分组方式：</span>
            <button className="rounded-lg bg-slate-100 px-3 py-1 font-medium text-slate-700">按事件</button>
            <button className="rounded-lg px-3 py-1 font-medium text-slate-500">按设备</button>
          </div>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-4 py-3 text-left font-medium">级别</th>
              <th className="px-4 py-3 text-left font-medium">事件码</th>
              <th className="px-4 py-3 text-left font-medium">事件名称</th>
              <th className="px-4 py-3 text-left font-medium">设备</th>
              <th className="px-4 py-3 text-left font-medium">来源</th>
              <th className="px-4 py-3 text-left font-medium">发生时间</th>
              <th className="px-4 py-3 text-left font-medium">次数</th>
              <th className="px-4 py-3 text-left font-medium">状态</th>
              <th className="px-4 py-3 text-left font-medium">责任人</th>
              <th className="px-4 py-3 text-left font-medium">操作</th>
            </tr>
          </thead>
          <tbody>
            {events.map((e) => (
              <tr key={e.id} className="border-t hover:bg-slate-50">
                <td className="px-4 py-3"><SeverityBadge value={e.severity} /></td>
                <td className="px-4 py-3"><button onClick={() => onOpenEvent(e)} className="font-semibold text-xcmg hover:underline">{e.code}</button></td>
                <td className="px-4 py-3 text-slate-900">{e.title}</td>
                <td className="px-4 py-3">{e.asset}</td>
                <td className="px-4 py-3">{e.source}</td>
                <td className="px-4 py-3">{e.time}</td>
                <td className="px-4 py-3">{e.occurrences}</td>
                <td className="px-4 py-3"><SeverityBadge value={e.status} /></td>
                <td className="px-4 py-3">{e.owner}</td>
                <td className="px-4 py-3"><button onClick={() => onOpenEvent(e)} className="rounded-xl border px-3 py-2 font-medium text-slate-700">处理</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AssetEventListPage({ onOpenEvent }) {
  const [assetTab, setAssetTab] = useState('events');
  const assetEvents = useMemo(() => events.filter((e) => e.asset === 'XE2000-01' || e.asset === 'XE5600-02'), []);

  return (
    <div>
      <SectionTitle title="设备事件清单页" subtitle="面向单台设备查看事件列表，并在同一页面切换油液分析与点检结果。" />
      <FilterBar placeholder="搜索设备 / 事件码" />
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-4 rounded-3xl border bg-white p-5 shadow-panel">
          <div className="text-sm text-slate-500">当前设备</div>
          <div className="mt-2 text-2xl font-bold text-slate-900">XE2000-01</div>
          <div className="mt-1 text-sm text-slate-500">XE2000 · 2,501h · 在线</div>
          <div className="mt-5 space-y-3">
            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="text-sm text-slate-500">事件总数</div>
              <div className="mt-1 text-xl font-bold">17</div>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="text-sm text-slate-500">高优先级</div>
              <div className="mt-1 text-xl font-bold text-red-600">4</div>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="text-sm text-slate-500">最后位置</div>
              <div className="mt-1 text-sm font-medium">巴西北部矿区-1号采场</div>
            </div>
          </div>
        </div>

        <div className="col-span-8 overflow-hidden rounded-3xl border bg-white shadow-panel">
          <div className="flex items-center justify-between border-b px-5 py-4">
            <div>
              <div className="font-semibold text-slate-900">设备健康与事件信息</div>
              <div className="text-sm text-slate-500">参考 VisionLink Health 页面，将事件、油液分析与点检结果放在同一页签结构中。</div>
            </div>
            <button className="rounded-xl border px-3 py-2 text-sm font-medium">切换设备</button>
          </div>

          <div className="flex gap-2 border-b bg-slate-50 px-4 py-3">
            {[
              { key: 'events', label: '事件清单', icon: Bell },
              { key: 'oil', label: '油液分析结果', icon: Droplets },
              { key: 'inspection', label: '点检结果', icon: ClipboardCheck }
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.key}
                  onClick={() => setAssetTab(item.key)}
                  className={cn(
                    'inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium',
                    assetTab === item.key ? 'border bg-white text-xcmg shadow-sm' : 'text-slate-600 hover:bg-white/70'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </button>
              );
            })}
          </div>

          {assetTab === 'events' ? (
            <div className="divide-y">
              {assetEvents.map((e) => (
                <div key={e.id} className="p-5 hover:bg-slate-50">
                  <div className="grid grid-cols-12 items-center gap-3">
                    <div className="col-span-3">
                      <div className="text-xs text-slate-500">事件码</div>
                      <button onClick={() => onOpenEvent(e)} className="mt-1 font-semibold text-xcmg hover:underline">{e.code}</button>
                    </div>
                    <div className="col-span-2">
                      <div className="text-xs text-slate-500">来源</div>
                      <div className="mt-1 font-medium">{e.source}</div>
                    </div>
                    <div className="col-span-1">
                      <div className="text-xs text-slate-500">次数</div>
                      <div className="mt-1 font-medium">{e.occurrences}</div>
                    </div>
                    <div className="col-span-2">
                      <div className="text-xs text-slate-500">故障时间</div>
                      <div className="mt-1 font-medium">{e.time}</div>
                    </div>
                    <div className="col-span-2">
                      <div className="text-xs text-slate-500">严重度</div>
                      <div className="mt-1"><SeverityBadge value={e.severity} /></div>
                    </div>
                    <div className="col-span-2 text-right">
                      <button onClick={() => onOpenEvent(e)} className="rounded-xl bg-xcmg px-3 py-2 text-sm font-medium text-white">查看处理</button>
                    </div>
                  </div>
                  <div className="mt-3 text-sm text-slate-600">{e.summary}</div>
                </div>
              ))}
            </div>
          ) : null}

          {assetTab === 'oil' ? (
            <div className="p-5">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium">样本</th>
                    <th className="px-4 py-3 text-left font-medium">样本小时</th>
                    <th className="px-4 py-3 text-left font-medium">样本日期</th>
                    <th className="px-4 py-3 text-left font-medium">严重度</th>
                    <th className="px-4 py-3 text-left font-medium">建议</th>
                  </tr>
                </thead>
                <tbody>
                  {oilSamples.map((sample) => (
                    <tr key={sample.sample} className="border-t">
                      <td className="px-4 py-3 font-medium text-slate-900">{sample.sample}</td>
                      <td className="px-4 py-3">{sample.meter}</td>
                      <td className="px-4 py-3">{sample.date}</td>
                      <td className="px-4 py-3"><SeverityBadge value={sample.severity} /></td>
                      <td className="px-4 py-3 text-slate-600">{sample.recommendation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}

          {assetTab === 'inspection' ? (
            <div className="p-5">
              <div className="space-y-3">
                {inspections.map((ins) => (
                  <div key={ins.item} className="rounded-2xl border p-4">
                    <div className="flex items-center justify-between">
                      <div className="font-medium text-slate-900">{ins.item}</div>
                      <button className="inline-flex items-center gap-1 text-sm font-medium text-xcmg">查看 <Eye className="h-3.5 w-3.5" /></button>
                    </div>
                    <div className="mt-2 text-sm text-slate-500">{ins.inspector} · {ins.date}</div>
                    <div className="mt-3 flex flex-wrap gap-2 text-xs">
                      <span className="rounded-full bg-red-50 px-2.5 py-1 font-semibold text-red-700">{ins.red} RED</span>
                      <span className="rounded-full bg-amber-50 px-2.5 py-1 font-semibold text-amber-700">{ins.yellow} YELLOW</span>
                      <span className="rounded-full bg-emerald-50 px-2.5 py-1 font-semibold text-emerald-700">{ins.green} GREEN</span>
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 font-semibold text-slate-600">{ins.gray} GRAY</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function EventModal({ event, open, onClose }) {
  if (!open || !event) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-6">
      <div className="max-h-[90vh] w-full max-w-7xl overflow-hidden rounded-3xl border bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div>
            <div className="text-xs uppercase tracking-wide text-slate-500">事件处理</div>
            <div className="mt-1 text-2xl font-bold text-slate-900">{event.title}</div>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-slate-500">
              <SeverityBadge value={event.severity} />
              <span>{event.asset}</span>
              <span>·</span>
              <span>{event.time}</span>
              <span>·</span>
              <span>{event.location}</span>
            </div>
          </div>
          <button onClick={onClose} className="rounded-xl border px-3 py-2 text-sm font-medium">关闭</button>
        </div>

        <div className="grid max-h-[calc(90vh-89px)] grid-cols-12 gap-4 overflow-auto bg-slate-50/60 p-6">
          <div className="col-span-7 space-y-4">
            <div className="rounded-3xl border bg-white p-5 shadow-panel">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-sm text-slate-500">事件说明</div>
                  <div className="mt-2 text-lg font-semibold text-slate-900">{event.code} · {event.title}</div>
                </div>
                <button className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium text-xcmg">
                  <ExternalLink className="h-4 w-4" /> 跳转智能知识库
                </button>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-600">{event.summary}</p>
              <div className="mt-4 grid grid-cols-4 gap-3">
                <InfoTile label="来源" value={event.source} />
                <InfoTile label="次数" value={String(event.occurrences)} />
                <InfoTile label="服务小时" value={event.meter} />
                <InfoTile label="状态" value={event.status} />
              </div>
            </div>

            <div className="rounded-3xl border bg-white p-5 shadow-panel">
              <div className="text-base font-semibold text-slate-900">事件分析与处置建议</div>
              <div className="mt-4 space-y-3">
                {[
                  { icon: Activity, label: '趋势判断', desc: '近 2 小时油温持续升高，负载与环境温度同步上升。' },
                  { icon: AlertTriangle, label: '风险提示', desc: '若不处理，可能触发降功率或停机，影响设备可用率。' },
                  { icon: Wrench, label: '建议动作', desc: '优先检查散热系统、液压油位、冷却风扇与滤芯堵塞情况。' }
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4">
                      <div className="rounded-xl bg-xcmg-soft p-2 text-xcmg"><Icon className="h-4 w-4" /></div>
                      <div>
                        <div className="font-medium text-slate-900">{item.label}</div>
                        <div className="mt-1 text-sm text-slate-600">{item.desc}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="col-span-5 space-y-4">
            <div className="rounded-3xl border bg-white p-5 shadow-panel">
              <div className="flex items-center gap-2 text-base font-semibold text-slate-900">
                <Database className="h-4 w-4 text-xcmg" /> 智能知识库联动
              </div>
              <div className="mt-3 text-sm text-slate-600">点击事件码后，可直接进入知识库的事件说明 → 诊断步骤 → 维修步骤 → 备件信息链路。</div>
              <div className="mt-4 space-y-3">
                {knowledgeSteps.map((step, index) => (
                  <div key={step} className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-xcmg text-xs font-bold text-white">{index + 1}</div>
                    <div className="text-sm text-slate-700">{step}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border bg-white p-5 shadow-panel">
              <div className="flex items-center gap-2 text-base font-semibold text-slate-900">
                <Package className="h-4 w-4 text-xcmg" /> 备件信息
              </div>
              <div className="mt-3 overflow-hidden rounded-2xl border">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 text-slate-500">
                    <tr>
                      <th className="px-3 py-2 text-left font-medium">件号</th>
                      <th className="px-3 py-2 text-left font-medium">名称</th>
                      <th className="px-3 py-2 text-left font-medium">库存</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t">
                      <td className="px-3 py-2">803164217</td>
                      <td className="px-3 py-2">液压油滤芯</td>
                      <td className="px-3 py-2 font-medium text-emerald-600">有库存</td>
                    </tr>
                    <tr className="border-t">
                      <td className="px-3 py-2">803164233</td>
                      <td className="px-3 py-2">冷却风扇总成</td>
                      <td className="px-3 py-2 font-medium text-amber-600">低库存</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoTile({ label, value }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-3">
      <div className="text-xs text-slate-500">{label}</div>
      <div className="mt-1 font-medium text-slate-900">{value}</div>
    </div>
  );
}

export default function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [selectedEvent, setSelectedEvent] = useState(events[0]);
  const [eventOpen, setEventOpen] = useState(false);

  const openEvent = (event) => {
    setSelectedEvent(event);
    setEventOpen(true);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage />;
      case 'home':
        return <HomePage onOpenEvent={openEvent} />;
      case 'asset-events':
        return <AssetEventListPage onOpenEvent={openEvent} />;
      case 'alarms':
        return <AlarmListPage onOpenEvent={openEvent} />;
      case 'maintenance':
        return <MaintenancePage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <TopHeader />
      <div className="flex min-h-[calc(100vh-64px)]">
        <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
        <main className="flex-1 overflow-auto p-6">
          <div className="mb-4 flex items-center gap-2 text-sm text-slate-500">
            <span>页面规划</span>
            <ChevronRight className="h-4 w-4" />
            <span className="font-medium text-slate-700">{sidebarItems.find((item) => item.key === currentPage)?.label}</span>
          </div>
          {renderPage()}
        </main>
      </div>
      <EventModal event={selectedEvent} open={eventOpen} onClose={() => setEventOpen(false)} />
    </div>
  );
}
