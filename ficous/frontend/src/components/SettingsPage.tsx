import { useState } from 'react';
import { User, Bell, Palette, Clock, Shield, Database, Download, Trash2 } from 'lucide-react';

export function SettingsPage() {
  const [userInfo, setUserInfo] = useState({
    name: 'João Silva',
    email: 'joao.silva@email.com',
    university: 'Universidade Federal',
    course: 'Ciência da Computação',
    semester: '6º Semestre'
  });

  const [notifications, setNotifications] = useState({
    studyReminders: true,
    breakReminders: true,
    dailyGoals: true,
    weeklyReports: false
  });

  const [theme, setTheme] = useState({
    darkMode: false,
    accentColor: '#6366f1',
    fontSize: 'medium'
  });

  const [studySettings, setStudySettings] = useState({
    defaultFocusTime: 25,
    defaultBreakTime: 5,
    dailyGoalHours: 4,
    autoStartBreaks: false
  });

  const handleUserInfoChange = (field: string, value: string) => {
    setUserInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleNotificationChange = (field: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [field]: value }));
  };

  const handleThemeChange = (field: string, value: any) => {
    setTheme(prev => ({ ...prev, [field]: value }));
  };

  const handleStudySettingsChange = (field: string, value: any) => {
    setStudySettings(prev => ({ ...prev, [field]: value }));
  };

  const SettingSection = ({ icon: Icon, title, children }: {
    icon: any;
    title: string;
    children: React.ReactNode;
  }) => (
    <div className="bg-white rounded-[12px] border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
          <Icon size={20} className="text-gray-600" />
        </div>
        <h3 className="font-['Alexandria:Medium',_sans-serif] font-medium text-[20px] text-[#202020]">
          {title}
        </h3>
      </div>
      {children}
    </div>
  );

  const ToggleSwitch = ({ checked, onChange, label }: {
    checked: boolean;
    onChange: (checked: boolean) => void;
    label: string;
  }) => (
    <div className="flex items-center justify-between py-3">
      <span className="font-['Alexandria:Regular',_sans-serif] font-normal text-[16px] text-[#202020]">
        {label}
      </span>
      <button
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          checked ? 'bg-[#6366f1]' : 'bg-gray-300'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );

  const InputField = ({ label, value, onChange, type = 'text', placeholder }: {
    label: string;
    value: string | number;
    onChange: (value: string) => void;
    type?: string;
    placeholder?: string;
  }) => (
    <div className="mb-4">
      <label className="block font-['Alexandria:Medium',_sans-serif] font-medium text-[14px] text-[#202020] mb-2">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-gray-200 rounded-lg font-['Alexandria:Regular',_sans-serif] font-normal text-[16px] focus:border-[#6366f1] focus:outline-none transition-colors"
      />
    </div>
  );

  return (
    <div className="absolute h-[982px] left-[241px] overflow-y-auto top-0 w-[1271px]">
      {/* Header Rectangle */}
      <div className="absolute h-[110px] left-[60px] rounded-[11px] top-[48px] w-[1151px] bg-[#6366f1]" />
      
      <p className="absolute font-['Alexandria:Medium',_sans-serif] font-medium leading-[normal] left-[61px] text-[36px] text-black text-nowrap top-[193px] whitespace-pre">
        Configurações
      </p>
      <p className="absolute font-['Alexandria:Regular',_sans-serif] font-normal leading-[normal] left-[61px] text-[20px] text-black text-nowrap whitespace-pre top-[246px]">
        Personalize sua experiência de estudos
      </p>

      <div className="absolute left-[61px] top-[300px] w-[1150px] space-y-6 pb-20">
        
        {/* Informações Pessoais */}
        <SettingSection icon={User} title="Informações Pessoais">
          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Nome Completo"
              value={userInfo.name}
              onChange={(value) => handleUserInfoChange('name', value)}
              placeholder="Seu nome completo"
            />
            <InputField
              label="Email"
              value={userInfo.email}
              onChange={(value) => handleUserInfoChange('email', value)}
              type="email"
              placeholder="seu@email.com"
            />
            <InputField
              label="Universidade"
              value={userInfo.university}
              onChange={(value) => handleUserInfoChange('university', value)}
              placeholder="Nome da sua universidade"
            />
            <InputField
              label="Curso"
              value={userInfo.course}
              onChange={(value) => handleUserInfoChange('course', value)}
              placeholder="Seu curso"
            />
            <InputField
              label="Semestre"
              value={userInfo.semester}
              onChange={(value) => handleUserInfoChange('semester', value)}
              placeholder="Ex: 6º Semestre"
            />
          </div>
        </SettingSection>

        {/* Notificações */}
        <SettingSection icon={Bell} title="Notificações">
          <div className="space-y-2">
            <ToggleSwitch
              checked={notifications.studyReminders}
              onChange={(value) => handleNotificationChange('studyReminders', value)}
              label="Lembretes de estudo"
            />
            <ToggleSwitch
              checked={notifications.breakReminders}
              onChange={(value) => handleNotificationChange('breakReminders', value)}
              label="Lembretes de pausa"
            />
            <ToggleSwitch
              checked={notifications.dailyGoals}
              onChange={(value) => handleNotificationChange('dailyGoals', value)}
              label="Metas diárias"
            />
            <ToggleSwitch
              checked={notifications.weeklyReports}
              onChange={(value) => handleNotificationChange('weeklyReports', value)}
              label="Relatórios semanais"
            />
          </div>
        </SettingSection>

        {/* Tema e Aparência */}
        <SettingSection icon={Palette} title="Tema e Aparência">
          <div className="space-y-4">
            <ToggleSwitch
              checked={theme.darkMode}
              onChange={(value) => handleThemeChange('darkMode', value)}
              label="Modo escuro"
            />
            
            <div>
              <label className="block font-['Alexandria:Medium',_sans-serif] font-medium text-[14px] text-[#202020] mb-2">
                Cor de destaque
              </label>
              <div className="flex gap-3">
                {['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'].map((color) => (
                  <button
                    key={color}
                    onClick={() => handleThemeChange('accentColor', color)}
                    className={`w-8 h-8 rounded-lg border-2 transition-all ${
                      theme.accentColor === color ? 'border-gray-400 scale-110' : 'border-gray-200'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="block font-['Alexandria:Medium',_sans-serif] font-medium text-[14px] text-[#202020] mb-2">
                Tamanho da fonte
              </label>
              <select
                value={theme.fontSize}
                onChange={(e) => handleThemeChange('fontSize', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg font-['Alexandria:Regular',_sans-serif] font-normal text-[16px] focus:border-[#6366f1] focus:outline-none"
              >
                <option value="small">Pequena</option>
                <option value="medium">Média</option>
                <option value="large">Grande</option>
              </select>
            </div>
          </div>
        </SettingSection>

        {/* Configurações de Estudo */}
        <SettingSection icon={Clock} title="Configurações de Estudo">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-['Alexandria:Medium',_sans-serif] font-medium text-[14px] text-[#202020] mb-2">
                Tempo de foco padrão (minutos)
              </label>
              <input
                type="number"
                min="5"
                max="60"
                value={studySettings.defaultFocusTime}
                onChange={(e) => handleStudySettingsChange('defaultFocusTime', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg font-['Alexandria:Regular',_sans-serif] font-normal text-[16px] focus:border-[#6366f1] focus:outline-none"
              />
            </div>
            
            <div>
              <label className="block font-['Alexandria:Medium',_sans-serif] font-medium text-[14px] text-[#202020] mb-2">
                Tempo de pausa padrão (minutos)
              </label>
              <input
                type="number"
                min="1"
                max="30"
                value={studySettings.defaultBreakTime}
                onChange={(e) => handleStudySettingsChange('defaultBreakTime', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg font-['Alexandria:Regular',_sans-serif] font-normal text-[16px] focus:border-[#6366f1] focus:outline-none"
              />
            </div>
            
            <div>
              <label className="block font-['Alexandria:Medium',_sans-serif] font-medium text-[14px] text-[#202020] mb-2">
                Meta diária (horas)
              </label>
              <input
                type="number"
                min="1"
                max="12"
                value={studySettings.dailyGoalHours}
                onChange={(e) => handleStudySettingsChange('dailyGoalHours', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg font-['Alexandria:Regular',_sans-serif] font-normal text-[16px] focus:border-[#6366f1] focus:outline-none"
              />
            </div>
          </div>
          
          <div className="mt-6">
            <ToggleSwitch
              checked={studySettings.autoStartBreaks}
              onChange={(value) => handleStudySettingsChange('autoStartBreaks', value)}
              label="Iniciar pausas automaticamente"
            />
          </div>
        </SettingSection>

        {/* Dados e Privacidade */}
        <SettingSection icon={Shield} title="Dados e Privacidade">
          <div className="space-y-4">
            <button className="w-full px-4 py-3 bg-[#6366f1] text-white rounded-lg font-['Alexandria:Medium',_sans-serif] font-medium text-[16px] hover:bg-[#5855eb] transition-colors flex items-center justify-center gap-2">
              <Download size={20} />
              Exportar Dados
            </button>
            
            <button className="w-full px-4 py-3 bg-white border border-gray-200 text-gray-700 rounded-lg font-['Alexandria:Medium',_sans-serif] font-medium text-[16px] hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
              <Database size={20} />
              Backup Local
            </button>
            
            <button className="w-full px-4 py-3 bg-red-50 border border-red-200 text-red-600 rounded-lg font-['Alexandria:Medium',_sans-serif] font-medium text-[16px] hover:bg-red-100 transition-colors flex items-center justify-center gap-2">
              <Trash2 size={20} />
              Limpar Todos os Dados
            </button>
          </div>
        </SettingSection>

        {/* Save Button */}
        <div className="flex justify-end pt-6">
          <button className="px-8 py-3 bg-[#6366f1] text-white rounded-lg font-['Alexandria:Medium',_sans-serif] font-medium text-[16px] hover:bg-[#5855eb] transition-colors">
            Salvar Configurações
          </button>
        </div>
      </div>
    </div>
  );
}