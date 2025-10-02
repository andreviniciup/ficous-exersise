import { useState } from 'react';
import { Calendar, Clock, BookOpen, Target, TrendingUp, Award } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

export function PerformancePage() {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('week');

  // Dados mockados para demonstração
  const studyTimeData = [
    { day: 'Seg', hours: 2.5, sessions: 3 },
    { day: 'Ter', hours: 3.2, sessions: 4 },
    { day: 'Qua', hours: 1.8, sessions: 2 },
    { day: 'Qui', hours: 4.1, sessions: 5 },
    { day: 'Sex', hours: 2.9, sessions: 3 },
    { day: 'Sáb', hours: 1.2, sessions: 1 },
    { day: 'Dom', hours: 3.5, sessions: 4 }
  ];

  const subjectData = [
    { subject: 'Projeto de Programação', hours: 8.5, color: '#c89558' },
    { subject: 'Redes de Computadores', hours: 6.2, color: '#9cbe7a' },
    { subject: 'Cálculo 1', hours: 4.8, color: '#91acc5' },
    { subject: 'Engenharia de Software', hours: 3.7, color: '#ab2c32' }
  ];

  const focusSessionsData = [
    { period: 'Semana 1', completed: 12, total: 15 },
    { period: 'Semana 2', completed: 18, total: 20 },
    { period: 'Semana 3', completed: 14, total: 18 },
    { period: 'Semana 4', completed: 22, total: 25 }
  ];

  const totalStudyHours = subjectData.reduce((sum, item) => sum + item.hours, 0);
  const totalSessions = studyTimeData.reduce((sum, item) => sum + item.sessions, 0);
  const avgSessionLength = totalStudyHours / totalSessions;
  const completedFocusSessions = focusSessionsData.reduce((sum, item) => sum + item.completed, 0);

  const StatCard = ({ icon: Icon, title, value, subtitle, color }: {
    icon: any;
    title: string;
    value: string;
    subtitle: string;
    color: string;
  }) => (
    <div className="bg-white rounded-[12px] border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-3">
        <div 
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${color}20` }}
        >
          <Icon size={20} style={{ color }} />
        </div>
        <div>
          <h3 className="font-['Alexandria:Medium',_sans-serif] font-medium text-[16px] text-[#202020]">
            {title}
          </h3>
          <p className="font-['Alexandria:Regular',_sans-serif] font-normal text-[12px] text-gray-500">
            {subtitle}
          </p>
        </div>
      </div>
      <p className="font-['Alexandria:Medium',_sans-serif] font-medium text-[28px] text-[#202020]">
        {value}
      </p>
    </div>
  );

  return (
    <div className="absolute h-[982px] left-[241px] overflow-clip top-0 w-[1271px]">
      {/* Header Rectangle */}
      <div className="absolute h-[110px] left-[60px] rounded-[11px] top-[48px] w-[1151px] bg-[#6366f1]" />
      
      <p className="absolute font-['Alexandria:Medium',_sans-serif] font-medium leading-[normal] left-[61px] text-[36px] text-black text-nowrap top-[193px] whitespace-pre">
        Desempenho
      </p>
      <p className="absolute font-['Alexandria:Regular',_sans-serif] font-normal leading-[normal] left-[61px] text-[20px] text-black text-nowrap whitespace-pre top-[246px]">
        Relatórios e estatísticas dos seus estudos
      </p>

      {/* Period Selector */}
      <div className="absolute left-[980px] top-[200px] flex gap-2">
        {['week', 'month', 'year'].map((period) => (
          <button
            key={period}
            onClick={() => setSelectedPeriod(period as any)}
            className={`px-4 py-2 rounded-lg font-['Alexandria:Medium',_sans-serif] font-medium text-[14px] transition-colors ${
              selectedPeriod === period
                ? 'bg-[#6366f1] text-white'
                : 'text-gray-600 bg-gray-100 hover:bg-gray-200'
            }`}
          >
            {period === 'week' ? 'Semana' : period === 'month' ? 'Mês' : 'Ano'}
          </button>
        ))}
      </div>

      {/* Stats Cards */}
      <div className="absolute left-[61px] top-[290px] grid grid-cols-4 gap-4 w-[1150px]">
        <StatCard
          icon={Clock}
          title="Tempo Total"
          value={`${totalStudyHours.toFixed(1)}h`}
          subtitle="Esta semana"
          color="#6366f1"
        />
        <StatCard
          icon={Target}
          title="Sessões de Foco"
          value={completedFocusSessions.toString()}
          subtitle="Pomodoros completos"
          color="#10b981"
        />
        <StatCard
          icon={BookOpen}
          title="Sessões de Estudo"
          value={totalSessions.toString()}
          subtitle="Total de sessões"
          color="#f59e0b"
        />
        <StatCard
          icon={TrendingUp}
          title="Tempo Médio"
          value={`${avgSessionLength.toFixed(1)}h`}
          subtitle="Por sessão"
          color="#ef4444"
        />
      </div>

      {/* Charts Section */}
      <div className="absolute left-[61px] top-[420px] w-[1150px] h-[500px] grid grid-cols-2 gap-6">
        
        {/* Study Time Chart */}
        <div className="bg-white rounded-[12px] border border-gray-200 p-6 shadow-sm">
          <h3 className="font-['Alexandria:Medium',_sans-serif] font-medium text-[18px] text-[#202020] mb-4">
            Tempo de Estudo Diário
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={studyTimeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="day" 
                tick={{ fontSize: 12, fontFamily: 'Alexandria' }}
                stroke="#666"
              />
              <YAxis 
                tick={{ fontSize: 12, fontFamily: 'Alexandria' }}
                stroke="#666"
                label={{ value: 'Horas', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontFamily: 'Alexandria'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="hours" 
                stroke="#6366f1" 
                strokeWidth={3}
                dot={{ fill: '#6366f1', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: '#6366f1' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Subject Distribution */}
        <div className="bg-white rounded-[12px] border border-gray-200 p-6 shadow-sm">
          <h3 className="font-['Alexandria:Medium',_sans-serif] font-medium text-[18px] text-[#202020] mb-4">
            Distribuição por Disciplina
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={subjectData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="hours"
              >
                {subjectData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontFamily: 'Alexandria'
                }}
                formatter={(value: any) => [`${value}h`, 'Tempo']}
              />
            </PieChart>
          </ResponsiveContainer>
          
          {/* Legend */}
          <div className="mt-4 space-y-2">
            {subjectData.map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="font-['Alexandria:Regular',_sans-serif] font-normal text-[12px] text-gray-600 flex-1">
                  {item.subject}
                </span>
                <span className="font-['Alexandria:Medium',_sans-serif] font-medium text-[12px] text-[#202020]">
                  {item.hours}h
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section - Focus Sessions Progress */}
      <div className="absolute left-[61px] top-[940px] w-[1150px]">
        <div className="bg-white rounded-[12px] border border-gray-200 p-6 shadow-sm">
          <h3 className="font-['Alexandria:Medium',_sans-serif] font-medium text-[18px] text-[#202020] mb-4">
            Progresso das Sessões de Foco
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={focusSessionsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="period"
                tick={{ fontSize: 12, fontFamily: 'Alexandria' }}
                stroke="#666"
              />
              <YAxis 
                tick={{ fontSize: 12, fontFamily: 'Alexandria' }}
                stroke="#666"
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontFamily: 'Alexandria'
                }}
              />
              <Bar dataKey="total" fill="#e0e0e0" name="Meta" radius={[4, 4, 0, 0]} />
              <Bar dataKey="completed" fill="#10b981" name="Completas" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}