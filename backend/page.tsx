"use client";

import React, { useState } from 'react';
import { 
  Heart, Users, Briefcase, MapPin, Search, PlusCircle, 
  QrCode, ShieldCheck, CheckCircle2, Menu, X, ArrowRight 
} from 'lucide-react';

interface Opportunity {
  id: number;
  title: string;
  category: string;
  location: string;
  slots: number;
  description: string;
  ong: {
    name: string;
    pix_key: string;
  };
}

const INITIAL_OPPORTUNITIES: Opportunity[] = [
  {
    id: 1,
    title: "Apoio em Reforço Escolar para Crianças",
    category: "Educação",
    location: "João Pessoa, PB (Híbrido)",
    slots: 4,
    description: "Auxílio em leitura, escrita e matemática básica para jovens da comunidade.",
    ong: { name: "Instituto Aprender & Sorrir", pix_key: "ongaprender@solidario.org" }
  },
  {
    id: 2,
    title: "Resgate e Cuidados Veterinários Básicos",
    category: "Causa Animal",
    location: "Remoto / Presencial",
    slots: 2,
    description: "Ajuda na organização de feiras de adoção e triagem de rações e medicamentos.",
    ong: { name: "Amigos de Quatro Patas", pix_key: "000.111.222-33" }
  },
  {
    id: 3,
    title: "Mutirão de Reflorestamento e Horta Comunitária",
    category: "Meio Ambiente",
    location: "Cabedelo, PB",
    slots: 10,
    description: "Plantio de mudas nativas e manejo sustentável em hortas comunitárias.",
    ong: { name: "EcoVida Paraíba", pix_key: "contato@ecovidapb.org" }
  }
];

export default function SethoPlatform() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>(INITIAL_OPPORTUNITIES);
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'vagas' | 'nova-vaga' | 'doacoes'>('vagas');
  const [selectedOpp, setSelectedOpp] = useState<Opportunity | null>(null);
  const [appliedList, setAppliedList] = useState<number[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Formulário de Nova Vaga (ONG)
  const [formData, setFormData] = useState({
    title: '',
    category: 'Educação',
    location: '',
    slots: 1,
    description: '',
    ongName: '',
    pixKey: ''
  });

  const categories = ['Todas', 'Educação', 'Causa Animal', 'Meio Ambiente', 'Saúde', 'Acolhimento'];

  const filteredOpps = opportunities.filter((op) => {
    const matchesCategory = selectedCategory === 'Todas' || op.category === selectedCategory;
    const matchesSearch = op.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          op.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          op.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleApply = (id: number) => {
    setAppliedList([...appliedList, id]);
    alert("Inscrição confirmada com sucesso! A ONG entrará em contato.");
    setSelectedOpp(null);
  };

  const handleCreateOpportunity = (e: React.FormEvent) => {
    e.preventDefault();
    const newOp: Opportunity = {
      id: Date.now(),
      title: formData.title,
      category: formData.category,
      location: formData.location,
      slots: Number(formData.slots),
      description: formData.description,
      ong: {
        name: formData.ongName || "Minha Organização",
        pix_key: formData.pixKey || "pix@ongexemplo.org"
      }
    };
    setOpportunities([newOp, ...opportunities]);
    setActiveTab('vagas');
    alert("Oportunidade cadastrada com sucesso!");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      {/* HEADER / NAVBAR */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-200">
              <Heart className="w-5 h-5 fill-white" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-slate-800">Setho</span>
          </div>

          <nav className="hidden md:flex items-center gap-2">
            <button 
              onClick={() => setActiveTab('vagas')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === 'vagas' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Explorar Vagas
            </button>
            <button 
              onClick={() => setActiveTab('nova-vaga')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === 'nova-vaga' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Área da ONG (Publicar)
            </button>
            <button 
              onClick={() => setActiveTab('doacoes')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === 'doacoes' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Apoio Solidário & Pix
            </button>
          </nav>

          <div className="md:hidden">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-slate-600">
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Menu Mobile */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-slate-200 bg-white px-4 py-3 space-y-2">
            <button 
              onClick={() => { setActiveTab('vagas'); setMobileMenuOpen(false); }}
              className="block w-full text-left py-2 text-sm font-medium text-slate-700"
            >
              Explorar Vagas
            </button>
            <button 
              onClick={() => { setActiveTab('nova-vaga'); setMobileMenuOpen(false); }}
              className="block w-full text-left py-2 text-sm font-medium text-slate-700"
            >
              Área da ONG (Publicar)
            </button>
            <button 
              onClick={() => { setActiveTab('doacoes'); setMobileMenuOpen(false); }}
              className="block w-full text-left py-2 text-sm font-medium text-slate-700"
            >
              Apoio Solidário & Pix
            </button>
          </div>
        )}
      </header>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8">
        
        {/* TAB 1: EXPLORAR VAGAS */}
        {activeTab === 'vagas' && (
          <div className="space-y-6">
            {/* HERO & BUSCA */}
            <div className="bg-linear-to-br from-emerald-600 to-teal-700 rounded-3xl p-6 sm:p-10 text-white shadow-lg shadow-emerald-100">
              <h1 className="text-2xl sm:text-4xl font-bold tracking-tight mb-2">Conectando quem quer ajudar a quem precisa.</h1>
              <p className="text-emerald-100 max-w-2xl text-sm sm:text-base mb-6">
                Descubra projetos sociais, ofereça seu talento e transforme realidades comunitárias.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-2 bg-white rounded-2xl p-2 text-slate-800 shadow-md">
                <div className="flex items-center gap-2 flex-1 px-3 py-1">
                  <Search className="w-5 h-5 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Buscar por cargo, causa ou cidade..." 
                    className="w-full bg-transparent focus:outline-none text-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* FILTROS DE CATEGORIA */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition ${
                    selectedCategory === cat 
                      ? 'bg-slate-900 text-white' 
                      : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* GRID DE OPORTUNIDADES */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredOpps.map((item) => (
                <div key={item.id} className="bg-white border border-slate-200/80 rounded-2xl p-5 flex flex-col justify-between hover:shadow-md transition">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
                        {item.category}
                      </span>
                      <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                        <Users className="w-3.5 h-3.5" /> {item.slots} vagas
                      </span>
                    </div>

                    <h3 className="font-bold text-slate-800 text-base line-clamp-2">{item.title}</h3>
                    <p className="text-slate-600 text-xs sm:text-sm line-clamp-3 leading-relaxed">{item.description}</p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 space-y-3">
                    <div className="flex flex-col gap-1 text-xs text-slate-500">
                      <span className="font-semibold text-slate-700">{item.ong.name}</span>
                      <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-slate-400" /> {item.location}</span>
                    </div>

                    <button 
                      disabled={appliedList.includes(item.id)}
                      onClick={() => setSelectedOpp(item)}
                      className={`w-full py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition flex items-center justify-center gap-1.5 ${
                        appliedList.includes(item.id) 
                          ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                          : 'bg-slate-900 hover:bg-slate-800 text-white shadow-sm'
                      }`}
                    >
                      {appliedList.includes(item.id) ? (
                        <>Inscrito <CheckCircle2 className="w-4 h-4 text-emerald-600" /></>
                      ) : (
                        <>Quero Ajudar <ArrowRight className="w-4 h-4" /></>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: NOVA VAGA (ÁREA ONG) */}
        {activeTab === 'nova-vaga' && (
          <div className="max-w-xl mx-auto bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                <Briefcase className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-800">Publicar Vaga de Voluntariado</h2>
                <p className="text-xs text-slate-500">Divulgue as necessidades da sua instituição e recrute voluntários.</p>
              </div>
            </div>

            <form onSubmit={handleCreateOpportunity} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Título da Oportunidade</label>
                <input 
                  required
                  type="text" 
                  placeholder="Ex: Instrutor de Informática Básica"
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Categoria</label>
                  <select 
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                  >
                    {categories.filter(c => c !== 'Todas').map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Vagas Disponíveis</label>
                  <input 
                    type="number" 
                    min="1"
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    value={formData.slots}
                    onChange={(e) => setFormData({...formData, slots: Number(e.target.value)})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Localização ou Modelo</label>
                <input 
                  required
                  type="text" 
                  placeholder="Ex: Remoto ou João Pessoa - PB"
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nome da Instituição (ONG)</label>
                <input 
                  required
                  type="text" 
                  placeholder="Ex: Associação Esperança Viva"
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  value={formData.ongName}
                  onChange={(e) => setFormData({...formData, ongName: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Chave Pix para Doações Diretas</label>
                <input 
                  type="text" 
                  placeholder="E-mail, CNPJ ou chave aleatória"
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  value={formData.pixKey}
                  onChange={(e) => setFormData({...formData, pixKey: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Descrição e Requisitos</label>
                <textarea 
                  rows={4}
                  required
                  placeholder="Descreva as atividades, disponibilidade de horário e impacto esperado..."
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>

              <button 
                type="submit" 
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-sm transition shadow-md shadow-emerald-200"
              >
                Cadastrar Oportunidade
              </button>
            </form>
          </div>
        )}

        {/* TAB 3: DOAÇÕES PIX */}
        {activeTab === 'doacoes' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-slate-800">Apoio Financeiro Solidário</h2>
              <p className="text-sm text-slate-500 max-w-lg mx-auto">
                Não pode doar seu tempo agora? Você pode apoiar as ações das ONGs diretamente sem taxas ou intermediários via Pix.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {opportunities.map((op) => (
                <div key={op.id} className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
                  <div>
                    <h3 className="font-bold text-slate-800 text-base">{op.ong.name}</h3>
                    <p className="text-xs text-slate-500 mt-1">Causa principal: {op.category}</p>
                  </div>
                  
                  <div className="p-3 bg-slate-50 border border-slate-200/60 rounded-xl flex items-center justify-between">
                    <div className="truncate pr-2">
                      <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">Chave Pix</span>
                      <span className="text-xs font-mono text-slate-700 select-all">{op.ong.pix_key}</span>
                    </div>
                    <QrCode className="w-6 h-6 text-slate-600 shrink-0" />
                  </div>

                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(op.ong.pix_key);
                      alert("Chave Pix copiada!");
                    }}
                    className="w-full py-2 bg-emerald-50 text-emerald-700 font-semibold rounded-xl text-xs hover:bg-emerald-100 transition"
                  >
                    Copiar Chave Pix
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* MODAL DE CANDIDATURA */}
      {selectedOpp && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-3xl p-6 space-y-4 shadow-xl border border-slate-100">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">Confirmação de Interesse</span>
                <h3 className="font-bold text-lg text-slate-800 mt-1">{selectedOpp.title}</h3>
                <p className="text-xs text-slate-500">{selectedOpp.ong.name}</p>
              </div>
              <button onClick={() => setSelectedOpp(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-50 border border-slate-200/70 p-3.5 rounded-2xl space-y-2 text-xs text-slate-600">
              <p><strong className="text-slate-800">Local:</strong> {selectedOpp.location}</p>
              <p><strong className="text-slate-800">Sobre o projeto:</strong> {selectedOpp.description}</p>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Mensagem para a ONG (opcional)</label>
              <textarea 
                rows={3}
                placeholder="Apresente-se brevemente e conte sobre sua motivação..."
                className="w-full border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button 
                onClick={() => setSelectedOpp(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-medium hover:bg-slate-50"
              >
                Cancelar
              </button>
              <button 
                onClick={() => handleApply(selectedOpp.id)}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition"
              >
                Confirmar Candidatura
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}