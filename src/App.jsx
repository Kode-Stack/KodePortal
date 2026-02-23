import React, { useState, useEffect } from 'react';
import { 
  Eye, EyeOff, Copy, ExternalLink, Plus, Lock, Globe, Server, 
  LogOut, Trash2, Check, Home, LayoutGrid, CheckSquare, Search, 
  Calendar, Clock, BarChart3, AlertCircle, Pencil, Code2, Terminal, X, Mail
} from 'lucide-react';

// --- Funciones auxiliares ---
const copyToClipboard = (text, setCopiedState) => {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.position = "fixed";
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand('copy');
    if (setCopiedState) {
      setCopiedState(true);
      setTimeout(() => setCopiedState(false), 2000);
    }
  } catch (err) {
    console.error('Error al copiar', err);
  }
  document.body.removeChild(textArea);
};

// --- Datos de prueba iniciales ---
const MOCK_PROJECTS = [
  {
    id: 1,
    name: 'E-commerce Cliente A',
    emoji: '🛒',
    siteUrl: 'https://www.tiendacliente-a.com',
    cpanelUrl: 'https://www.tiendacliente-a.com:2083',
    username: 'admin_cliente_a',
    password: 'SuperSecretPassword123!',
    createdAt: Date.now() - 86400000 * 2
  },
  {
    id: 2,
    name: 'Blog Personal',
    emoji: '📝',
    siteUrl: 'https://www.miblog.dev',
    cpanelUrl: 'https://cpanel.miblog.dev',
    username: 'dev_user_89',
    password: 'Miblog@Password2026',
    createdAt: Date.now() - 86400000
  },
  {
    id: 3,
    name: 'Landing Page Evento',
    emoji: '🎉',
    siteUrl: 'https://www.evento2026.com',
    cpanelUrl: 'https://www.evento2026.com:2083',
    username: 'evento_admin',
    password: 'Event@2026!Secure',
    createdAt: Date.now()
  }
];

const MOCK_TASKS = [
  { id: 1, title: 'Actualizar plugins de WordPress', category: 'Mantenimiento', dueDate: '2026-03-01', completed: false },
  { id: 2, title: 'Configurar certificado SSL', category: 'Seguridad', dueDate: '2026-02-28', completed: false },
  { id: 3, title: 'Migrar base de datos', category: 'Desarrollo', dueDate: '2026-02-25', completed: true },
  { id: 4, title: 'Renovar dominio', category: 'Administración', dueDate: '2026-03-15', completed: false },
  { id: 5, title: 'Optimizar imágenes', category: 'Mantenimiento', dueDate: '2026-03-05', completed: true },
];

const MOCK_SNIPPETS = [
  {
    id: 1,
    title: 'Forzar HTTPS (.htaccess)',
    code: '<IfModule mod_rewrite.c>\nRewriteEngine On\nRewriteCond %{HTTPS} off\nRewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]\n</IfModule>'
  }
];

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('home'); // 'home', 'projects', 'tasks'
  const [isSnippetsOpen, setIsSnippetsOpen] = useState(false);
  
  // Carga inicial desde localStorage o Mocks
  const [projects, setProjects] = useState(() => {
    const saved = localStorage.getItem('kodeportal_projects');
    return saved ? JSON.parse(saved) : MOCK_PROJECTS;
  });
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('kodeportal_tasks');
    return saved ? JSON.parse(saved) : MOCK_TASKS;
  });
  const [snippets, setSnippets] = useState(() => {
    const saved = localStorage.getItem('kodeportal_snippets');
    return saved ? JSON.parse(saved) : MOCK_SNIPPETS;
  });

  // Efectos para autoguardado local
  useEffect(() => { localStorage.setItem('kodeportal_projects', JSON.stringify(projects)); }, [projects]);
  useEffect(() => { localStorage.setItem('kodeportal_tasks', JSON.stringify(tasks)); }, [tasks]);
  useEffect(() => { localStorage.setItem('kodeportal_snippets', JSON.stringify(snippets)); }, [snippets]);

  // --- Vista de Login ---
  if (!isAuthenticated) {
    return <LoginScreen onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200 font-sans selection:bg-zinc-800 flex flex-col overflow-x-hidden">
      {/* Navbar Superior (Centrado) */}
      <nav className="bg-zinc-950/80 backdrop-blur-md border-b border-zinc-900 px-6 py-4 flex items-center justify-between sticky top-0 z-20 transition-all duration-300">
        {/* Izquierda: Logo */}
        <div className="flex items-center gap-3 w-1/3">
          <div className="bg-zinc-100 p-2 rounded-lg transition-transform hover:scale-105 cursor-default">
            <Server className="w-5 h-5 text-zinc-950" />
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight hidden lg:block">
            KodePortal
          </h1>
        </div>
        
        {/* Centro: Pestañas de Navegación (Solo Iconos) */}
        <div className="w-1/3 flex justify-center">
          <div className="flex bg-zinc-900/50 p-1.5 rounded-xl border border-zinc-800/80 gap-1.5">
            <TabButton icon={<LayoutGrid className="w-5 h-5"/>} label="Proyectos" isActive={activeTab === 'projects'} onClick={() => setActiveTab('projects')} />
            <TabButton icon={<Home className="w-5 h-5"/>} label="Inicio" isActive={activeTab === 'home'} onClick={() => setActiveTab('home')} />
            <TabButton icon={<CheckSquare className="w-5 h-5"/>} label="Tareas" isActive={activeTab === 'tasks'} onClick={() => setActiveTab('tasks')} />
          </div>
        </div>

        {/* Derecha: Correo, Snippets y Cerrar Sesión */}
        <div className="w-1/3 flex justify-end gap-1 sm:gap-2">
          <a 
            href="https://mail.google.com/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center w-10 h-10 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-lg transition-all duration-300 group"
            title="Abrir Correo"
          >
            <Mail className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </a>
          <button 
            onClick={() => setIsSnippetsOpen(true)}
            className="flex items-center justify-center w-10 h-10 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-lg transition-all duration-300 group"
            title="Mis Snippets"
          >
            <Code2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </button>
          <button 
            onClick={() => setIsAuthenticated(false)}
            className="flex items-center gap-2 text-zinc-400 hover:text-white hover:bg-zinc-900 px-3 py-2 rounded-lg transition-all duration-300 text-sm font-medium group"
            title="Cerrar Sesión"
          >
            <span className="hidden sm:inline">Salir</span>
            <LogOut className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </nav>

      {/* Contenido Principal con animación suave de montaje */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 md:p-8">
        {activeTab === 'home' && <HomeView projects={projects} tasks={tasks} onNavigate={setActiveTab} />}
        {activeTab === 'projects' && <ProjectsView projects={projects} setProjects={setProjects} />}
        {activeTab === 'tasks' && <TasksView tasks={tasks} setTasks={setTasks} />}
      </main>

      {/* Panel lateral de Snippets */}
      {isSnippetsOpen && (
        <SnippetsManager 
          snippets={snippets} 
          setSnippets={setSnippets} 
          onClose={() => setIsSnippetsOpen(false)} 
        />
      )}
    </div>
  );
}

// --- Componentes de Navegación ---
function TabButton({ icon, label, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      title={label}
      className={`flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-300 ${
        isActive 
          ? 'bg-zinc-100 text-zinc-950 shadow-sm scale-105' 
          : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 hover:scale-105'
      }`}
    >
      {icon}
    </button>
  );
}

// ==========================================
// VISTAS PRINCIPALES
// ==========================================

// --- 1. VISTA: INICIO (DASHBOARD) ---
function HomeView({ projects, tasks, onNavigate }) {
  const recentProjects = [...projects].sort((a, b) => b.createdAt - a.createdAt).slice(0, 3);
  const upcomingTasks = tasks
    .filter(t => !t.completed)
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 4);

  const taskStats = tasks.reduce((acc, task) => {
    if (!acc[task.category]) acc[task.category] = { total: 0, completed: 0 };
    acc[task.category].total++;
    if (task.completed) acc[task.category].completed++;
    return acc;
  }, {});

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out fill-mode-both">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white tracking-tight">Resumen de Trabajo</h2>
        <p className="text-zinc-400 text-sm mt-1">Un vistazo a tus proyectos recientes y tareas pendientes.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna Izquierda: Proyectos y Progreso */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-sm transition-all hover:border-zinc-700/50">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-medium text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-zinc-400" /> Proyectos Recientes
              </h3>
              <button onClick={() => onNavigate('projects')} className="text-sm text-zinc-400 hover:text-white transition-colors">Ver todos</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentProjects.map(p => (
                <div key={p.id} className="bg-zinc-950 border border-zinc-800/80 p-4 rounded-xl flex items-center gap-3 hover:border-zinc-600 transition-all cursor-default">
                  <div className="text-2xl">{p.emoji}</div>
                  <div className="truncate">
                    <p className="font-medium text-sm text-white truncate">{p.name}</p>
                    <a href={p.siteUrl} target="_blank" rel="noreferrer" className="text-xs text-zinc-500 hover:text-white truncate block mt-0.5 transition-colors">
                      {p.siteUrl.replace('https://', '')}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-sm transition-all hover:border-zinc-700/50">
            <h3 className="text-lg font-medium text-white flex items-center gap-2 mb-6">
              <BarChart3 className="w-5 h-5 text-zinc-400" /> Cumplimiento por Categoría
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {Object.entries(taskStats).map(([category, stats]) => {
                const percentage = Math.round((stats.completed / stats.total) * 100);
                return (
                  <div key={category}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-zinc-300 font-medium">{category}</span>
                      <span className="text-zinc-500 font-mono text-xs">{stats.completed}/{stats.total} ({percentage}%)</span>
                    </div>
                    <div className="w-full bg-zinc-950 rounded-full h-2 border border-zinc-800 overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ease-out ${percentage === 100 ? 'bg-zinc-200' : 'bg-zinc-500'}`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
              {Object.keys(taskStats).length === 0 && <p className="text-zinc-500 text-sm">No hay tareas para mostrar progreso.</p>}
            </div>
          </div>
        </div>

        {/* Columna Derecha: Tareas Próximas */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col h-full shadow-sm transition-all hover:border-zinc-700/50">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-zinc-400" /> Próximas Tareas
            </h3>
            <button onClick={() => onNavigate('tasks')} className="text-sm text-zinc-400 hover:text-white transition-colors">Ir a Tareas</button>
          </div>
          
          <div className="space-y-3 flex-1">
            {upcomingTasks.length > 0 ? upcomingTasks.map(task => (
              <div key={task.id} className="bg-zinc-950 border border-zinc-800/80 p-4 rounded-xl border-l-2 border-l-zinc-300 hover:border-l-zinc-100 transition-colors">
                <p className="font-medium text-sm text-zinc-100 mb-2 leading-tight">{task.title}</p>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-xs px-2 py-1 rounded-md bg-zinc-900 text-zinc-400 font-medium border border-zinc-800">{task.category}</span>
                  <span className="text-xs text-amber-400/90 flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3" /> {task.dueDate}
                  </span>
                </div>
              </div>
            )) : (
              <div className="text-center py-10 animate-in zoom-in duration-300">
                <AlertCircle className="w-8 h-8 text-zinc-700 mx-auto mb-3" />
                <p className="text-zinc-500 text-sm">Todo al día. No hay tareas pendientes próximas.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// --- 2. VISTA: PROYECTOS ---
function ProjectsView({ projects, setProjects }) {
  const [modalState, setModalState] = useState({ isOpen: false, project: null });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState(null);

  // Extraer emojis únicos de los proyectos existentes
  const uniqueEmojis = [...new Set(projects.map(p => p.emoji))].filter(Boolean);

  const handleSaveProject = (projectData) => {
    if (modalState.project) {
      setProjects(projects.map(p => p.id === projectData.id ? projectData : p));
    } else {
      setProjects([{ ...projectData, id: Date.now(), createdAt: Date.now() }, ...projects]);
    }
    setModalState({ isOpen: false, project: null });
  };

  const deleteProject = (id) => {
    setProjects(projects.filter(p => p.id !== id));
  };

  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesEmoji = selectedEmoji ? p.emoji === selectedEmoji : true;
    return matchesSearch && matchesEmoji;
  });

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out fill-mode-both">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Mis Proyectos</h2>
          <p className="text-zinc-400 text-sm mt-1">Gestiona los accesos a los paneles de control.</p>
        </div>
        <button 
          onClick={() => setModalState({ isOpen: true, project: null })}
          className="flex items-center gap-2 bg-zinc-100 hover:bg-white text-zinc-950 px-5 py-2.5 rounded-xl font-medium transition-all duration-300 w-full md:w-auto justify-center hover:scale-[1.02] shadow-sm"
        >
          <Plus className="w-5 h-5" /> Nuevo Proyecto
        </button>
      </div>

      {/* Área de Filtros y Búsqueda */}
      <div className="mb-8 flex flex-col gap-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-zinc-500" />
          </div>
          <input
            type="text"
            placeholder="Buscar proyecto por nombre..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-11 pr-4 py-3 border border-zinc-800 rounded-xl bg-zinc-900/50 text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-500 focus:bg-zinc-900 transition-all text-sm"
          />
        </div>

        {/* Filtro de Emojis Extraídos Automáticamente */}
        {uniqueEmojis.length > 0 && (
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mr-2">Filtrar:</span>
            <button
              onClick={() => setSelectedEmoji(null)}
              className={`px-3 py-1.5 rounded-lg text-sm transition-all duration-300 ${
                !selectedEmoji 
                  ? 'bg-zinc-100 text-zinc-950 font-medium' 
                  : 'bg-zinc-900/50 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 border border-transparent hover:border-zinc-700'
              }`}
            >
              Todos
            </button>
            {uniqueEmojis.map(emoji => (
              <button
                key={emoji}
                onClick={() => setSelectedEmoji(emoji === selectedEmoji ? null : emoji)}
                className={`flex items-center justify-center w-10 h-8 rounded-lg text-lg transition-all duration-300 ${
                  selectedEmoji === emoji 
                    ? 'bg-zinc-100 border-zinc-100 scale-110 shadow-sm' 
                    : 'bg-zinc-900/50 border-transparent hover:bg-zinc-800 hover:scale-105 opacity-60 hover:opacity-100'
                } border`}
                title={`Filtrar por ${emoji}`}
              >
                {emoji}
              </button>
            ))}
          </div>
        )}
      </div>

      {filteredProjects.length === 0 ? (
        <div className="text-center py-24 bg-zinc-900/30 rounded-2xl border border-zinc-800/50 border-dashed animate-in zoom-in-95 duration-300">
          <Server className="w-10 h-10 text-zinc-700 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-zinc-300">No se encontraron proyectos</h3>
          <p className="text-zinc-500 mt-1 text-sm">Prueba con otra búsqueda o añade un nuevo proyecto.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project, index) => (
            <div 
              key={project.id} 
              className="animate-in fade-in slide-in-from-bottom-4 fill-mode-both"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <ProjectCard 
                project={project} 
                onEdit={() => setModalState({ isOpen: true, project })}
                onDelete={deleteProject} 
              />
            </div>
          ))}
        </div>
      )}

      {modalState.isOpen && (
        <ProjectModal 
          initialData={modalState.project}
          onClose={() => setModalState({ isOpen: false, project: null })} 
          onSave={handleSaveProject} 
        />
      )}
    </div>
  );
}

// --- 3. VISTA: TAREAS ---
function TasksView({ tasks, setTasks }) {
  const [modalState, setModalState] = useState({ isOpen: false, task: null });
  const [filter, setFilter] = useState('all'); // all, pending, completed

  const handleSaveTask = (taskData) => {
    if (modalState.task) {
      setTasks(tasks.map(t => t.id === taskData.id ? taskData : t));
    } else {
      setTasks([...tasks, { ...taskData, id: Date.now(), completed: false }]);
    }
    setModalState({ isOpen: false, task: null });
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const filteredTasks = tasks
    .filter(t => {
      if (filter === 'pending') return !t.completed;
      if (filter === 'completed') return t.completed;
      return true;
    })
    .sort((a, b) => {
      if (a.completed === b.completed) {
        return new Date(a.dueDate) - new Date(b.dueDate);
      }
      return a.completed ? 1 : -1;
    });

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out fill-mode-both max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Calendario de Tareas</h2>
          <p className="text-zinc-400 text-sm mt-1">Organiza tus mantenimientos, renovaciones y pendientes.</p>
        </div>
        <button 
          onClick={() => setModalState({ isOpen: true, task: null })}
          className="flex items-center gap-2 bg-zinc-100 hover:bg-white text-zinc-950 px-5 py-2.5 rounded-xl font-medium transition-all duration-300 hover:scale-[1.02] shadow-sm"
        >
          <Plus className="w-5 h-5" /> Nueva Tarea
        </button>
      </div>

      <div className="flex gap-2 mb-6 border-b border-zinc-800/80 pb-4">
        {['all', 'pending', 'completed'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 ${
              filter === f 
                ? 'bg-zinc-800 text-white shadow-sm' 
                : 'bg-transparent text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900'
            }`}
          >
            {f === 'all' ? 'Todas' : f === 'pending' ? 'Pendientes' : 'Completadas'}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-16 bg-zinc-900/30 rounded-2xl border border-zinc-800/50 border-dashed animate-in zoom-in-95 duration-300">
            <CheckSquare className="w-10 h-10 text-zinc-700 mx-auto mb-3" />
            <p className="text-zinc-500 text-sm">No hay tareas que mostrar en esta vista.</p>
          </div>
        ) : (
          filteredTasks.map((task, index) => (
            <div 
              key={task.id} 
              className={`group flex items-center justify-between p-4 rounded-xl border transition-all duration-300 animate-in fade-in slide-in-from-bottom-2 fill-mode-both ${
                task.completed ? 'bg-zinc-950/50 border-zinc-900 opacity-60 hover:opacity-100' : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700 hover:shadow-sm'
              }`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-center gap-4 flex-1">
                <button 
                  onClick={() => toggleTask(task.id)}
                  className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                    task.completed ? 'bg-zinc-500 text-zinc-950 scale-110' : 'bg-zinc-950 border border-zinc-700 hover:border-zinc-400 hover:scale-110'
                  }`}
                >
                  {task.completed && <Check className="w-3.5 h-3.5" />}
                </button>
                <div className="flex-1 min-w-0">
                  <h4 className={`font-medium truncate text-sm transition-colors duration-300 ${task.completed ? 'line-through text-zinc-500' : 'text-zinc-200'}`}>
                    {task.title}
                  </h4>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="text-[11px] px-2 py-0.5 rounded-md bg-zinc-950 border border-zinc-800 text-zinc-400 font-medium">
                      {task.category}
                    </span>
                    <span className={`text-[11px] font-mono flex items-center gap-1 transition-colors ${
                      !task.completed && new Date(task.dueDate) < new Date() ? 'text-amber-500' : 'text-zinc-500'
                    }`}>
                      <Calendar className="w-3 h-3" /> {task.dueDate}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button 
                  onClick={() => setModalState({ isOpen: true, task })}
                  className="p-2 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
                  title="Editar tarea"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => deleteTask(task.id)}
                  className="p-2 text-zinc-500 hover:text-red-400 hover:bg-zinc-800 rounded-lg transition-colors"
                  title="Eliminar tarea"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {modalState.isOpen && (
        <TaskModal 
          initialData={modalState.task}
          onClose={() => setModalState({ isOpen: false, task: null })} 
          onSave={handleSaveTask} 
        />
      )}
    </div>
  );
}

// ==========================================
// COMPONENTES SECUNDARIOS Y MODALES
// ==========================================

function ProjectCard({ project, onEdit, onDelete }) {
  const [showPassword, setShowPassword] = useState(false);
  const [copiedUser, setCopiedUser] = useState(false);
  const [copiedPass, setCopiedPass] = useState(false);

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 hover:border-zinc-700 transition-all duration-300 group flex flex-col h-full shadow-sm hover:shadow-md">
      <div className="flex justify-between items-start mb-5">
        <div className="flex gap-3 flex-1 overflow-hidden pr-2">
          <span className="text-2xl bg-zinc-950 w-11 h-11 flex items-center justify-center rounded-xl shrink-0 border border-zinc-800/50 group-hover:scale-110 transition-transform duration-300">{project.emoji}</span>
          <div className="flex-1 min-w-0 flex flex-col justify-center">
            <h3 className="text-base font-medium text-white truncate" title={project.name}>{project.name}</h3>
            <a 
              href={project.siteUrl} target="_blank" rel="noreferrer"
              className="text-zinc-400 hover:text-zinc-200 text-xs flex items-center gap-1.5 mt-0.5 transition-colors w-fit truncate max-w-full"
            >
              <Globe className="w-3 h-3 shrink-0" />
              <span className="truncate">{project.siteUrl.replace(/^https?:\/\//, '')}</span>
            </a>
          </div>
        </div>
        <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button onClick={onEdit} className="text-zinc-500 hover:text-white p-1.5 rounded-lg hover:bg-zinc-800 transition-colors">
            <Pencil className="w-4 h-4" />
          </button>
          <button onClick={() => onDelete(project.id)} className="text-zinc-500 hover:text-red-400 p-1.5 rounded-lg hover:bg-zinc-800 transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="bg-zinc-950 rounded-xl p-4 flex-1 space-y-4 border border-zinc-800/50">
        <div>
          <label className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-1.5 block">Usuario cPanel</label>
          <div className="flex items-center justify-between bg-zinc-900 rounded-lg p-2.5 border border-zinc-800/80 transition-colors hover:border-zinc-700">
            <span className="text-sm font-mono text-zinc-300 truncate pr-2">{project.username}</span>
            <button onClick={() => copyToClipboard(project.username, setCopiedUser)} className="text-zinc-500 hover:text-white p-1 transition-transform hover:scale-110">
              {copiedUser ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>
        <div>
          <label className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-1.5 block">Contraseña cPanel</label>
          <div className="flex items-center justify-between bg-zinc-900 rounded-lg p-2.5 border border-zinc-800/80 transition-colors hover:border-zinc-700">
            <span className="text-sm font-mono text-zinc-300 truncate pr-2">{showPassword ? project.password : '••••••••••••••••'}</span>
            <div className="flex items-center gap-1">
              <button onClick={() => setShowPassword(!showPassword)} className="text-zinc-500 hover:text-white p-1 transition-transform hover:scale-110">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
              <button onClick={() => copyToClipboard(project.password, setCopiedPass)} className="text-zinc-500 hover:text-white p-1 transition-transform hover:scale-110">
                {copiedPass ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      <a 
        href={project.cpanelUrl} target="_blank" rel="noreferrer"
        className="mt-4 w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-medium text-sm py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 border border-zinc-700/50 hover:border-zinc-600"
      >
        Ir al Panel <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
      </a>
    </div>
  );
}

function ProjectModal({ initialData, onClose, onSave }) {
  const [formData, setFormData] = useState(initialData || { name: '', emoji: '📁', siteUrl: '', cpanelUrl: '', username: '', password: '' });

  const handleSubmit = (e) => { e.preventDefault(); onSave(formData); };
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-950/50">
          <div>
            <h2 className="text-xl font-bold text-white">{initialData ? 'Editar Proyecto' : 'Nuevo Proyecto'}</h2>
            <p className="text-sm text-zinc-400 mt-1">Ingresa los detalles del sitio y acceso.</p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="flex gap-4">
            <div className="w-20">
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">Emoji</label>
              <input required type="text" name="emoji" maxLength="2" value={formData.emoji} onChange={handleChange} 
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-2 py-2.5 text-center text-xl focus:ring-1 focus:ring-zinc-400 focus:outline-none transition-colors" />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">Nombre</label>
              <input required type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Ej: Mi Tienda Online"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-white focus:ring-1 focus:ring-zinc-400 focus:outline-none transition-colors text-sm" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">Sitio Web</label>
              <input required type="url" name="siteUrl" value={formData.siteUrl} onChange={handleChange} placeholder="https://misitio.com"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-white focus:ring-1 focus:ring-zinc-400 focus:outline-none transition-colors text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">URL Panel</label>
              <input required type="url" name="cpanelUrl" value={formData.cpanelUrl} onChange={handleChange} placeholder="https://misitio.com:2083"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-white focus:ring-1 focus:ring-zinc-400 focus:outline-none transition-colors text-sm" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">Usuario</label>
              <input required type="text" name="username" value={formData.username} onChange={handleChange} placeholder="admin_user"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-white focus:ring-1 focus:ring-zinc-400 font-mono text-sm focus:outline-none transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">Contraseña</label>
              <input required type="password" name="password" value={formData.password} onChange={handleChange} placeholder="••••••••"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-white focus:ring-1 focus:ring-zinc-400 font-mono text-sm focus:outline-none transition-colors" />
            </div>
          </div>

          <div className="flex gap-3 mt-8 pt-4 border-t border-zinc-800/50">
            <button type="button" onClick={onClose} className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white font-medium py-2.5 rounded-xl transition-colors text-sm">Cancelar</button>
            <button type="submit" className="flex-1 bg-zinc-100 hover:bg-white text-zinc-950 font-medium py-2.5 rounded-xl transition-colors text-sm">
              {initialData ? 'Guardar Cambios' : 'Añadir Proyecto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function TaskModal({ initialData, onClose, onSave }) {
  const [formData, setFormData] = useState(initialData || { title: '', category: 'Mantenimiento', dueDate: new Date().toISOString().split('T')[0] });

  const handleSubmit = (e) => { e.preventDefault(); onSave(formData); };
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-zinc-800 bg-zinc-950/50">
          <h2 className="text-xl font-bold text-white">{initialData ? 'Editar Tarea' : 'Nueva Tarea'}</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">Descripción</label>
            <input required type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Ej: Renovar certificado SSL..."
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-white focus:ring-1 focus:ring-zinc-400 focus:outline-none transition-colors text-sm" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">Categoría</label>
              <select name="category" value={formData.category} onChange={handleChange} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-white focus:ring-1 focus:ring-zinc-400 focus:outline-none appearance-none text-sm transition-colors">
                <option value="Mantenimiento">Mantenimiento</option>
                <option value="Seguridad">Seguridad</option>
                <option value="Desarrollo">Desarrollo</option>
                <option value="Administración">Administración</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">Fecha límite</label>
              <input required type="date" name="dueDate" value={formData.dueDate} onChange={handleChange}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-white focus:ring-1 focus:ring-zinc-400 focus:outline-none color-scheme-dark text-sm transition-colors" />
            </div>
          </div>

          <div className="flex gap-3 mt-8 pt-4 border-t border-zinc-800/50">
            <button type="button" onClick={onClose} className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white font-medium py-2.5 rounded-xl transition-colors text-sm">Cancelar</button>
            <button type="submit" className="flex-1 bg-zinc-100 hover:bg-white text-zinc-950 font-medium py-2.5 rounded-xl transition-colors text-sm">
              {initialData ? 'Guardar Cambios' : 'Añadir Tarea'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// --- Pantalla de Login ---
function LoginScreen({ onLogin }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'admin' || password.length > 0) onLogin();
    else setError('Acceso denegado. Contraseña inválida.');
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Elementos Decorativos de Fondo */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.15] pointer-events-none" 
        style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,1) 1px, transparent 0)', backgroundSize: '32px 32px' }}
      ></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-zinc-800/20 rounded-full blur-[120px] z-0 pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10">
        {/* Cabecera / Logo */}
        <div className="flex flex-col items-center mb-8 animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out">
          <div className="bg-zinc-100 p-3.5 rounded-2xl mb-5 shadow-xl shadow-zinc-100/5">
            <Server className="w-8 h-8 text-zinc-950" />
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">KodePortal</h1>
          <p className="text-zinc-500 font-mono text-sm mt-2 flex items-center gap-2">
            <Code2 className="w-4 h-4" /> Workspace
          </p>
        </div>

        {/* Tarjeta de Login */}
        <div className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-800/80 rounded-[2rem] p-8 shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-500 delay-150 ease-out fill-mode-both">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-px bg-zinc-800 flex-1"></div>
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em]">Acceso Restringido</span>
            <div className="h-px bg-zinc-800 flex-1"></div>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="relative group">
              <div className={`absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none transition-colors duration-300 ${isFocused ? 'text-zinc-200' : 'text-zinc-600'}`}>
                <Lock className="w-5 h-5" />
              </div>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="Contraseña maestra" 
                autoFocus
                className="w-full bg-zinc-950/50 border border-zinc-800 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-zinc-500 focus:bg-zinc-950 transition-all font-mono tracking-widest placeholder:tracking-normal placeholder:font-sans placeholder:text-zinc-600 shadow-inner" 
              />
              {error && <p className="text-red-400 text-xs mt-2 absolute -bottom-6 left-2 animate-in fade-in">{error}</p>}
            </div>

            <button 
              type="submit" 
              className="w-full flex items-center justify-center gap-2 bg-zinc-100 hover:bg-white text-zinc-950 font-bold py-4 rounded-2xl transition-all duration-300 shadow-lg active:scale-[0.98] hover:scale-[1.02] group"
            >
              Desbloquear Bóveda 
              <Terminal className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-xs text-zinc-600 flex items-center justify-center gap-1.5 font-medium">
              <Lock className="w-3 h-3" /> Entorno local seguro
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Gestor de Snippets (Panel Lateral) ---
function SnippetsManager({ snippets, setSnippets, onClose }) {
  const [isAdding, setIsAdding] = useState(false);
  const [newSnippet, setNewSnippet] = useState({ title: '', code: '' });
  const [copiedId, setCopiedId] = useState(null);

  const handleAdd = (e) => {
    e.preventDefault();
    setSnippets([{ ...newSnippet, id: Date.now() }, ...snippets]);
    setIsAdding(false);
    setNewSnippet({ title: '', code: '' });
  };

  const deleteSnippet = (id) => {
    setSnippets(snippets.filter(s => s.id !== id));
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Fondo oscuro con clic para cerrar */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose}></div>
      
      {/* Drawer (Panel Lateral) */}
      <div className="relative w-full sm:w-[400px] md:w-[450px] bg-zinc-950 border-l border-zinc-800 h-full flex flex-col shadow-2xl animate-in slide-in-from-right-full duration-300 ease-out">
        
        {/* Header del Panel */}
        <div className="p-5 border-b border-zinc-800 bg-zinc-900/50 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-zinc-800 p-2 rounded-lg">
              <Terminal className="w-5 h-5 text-zinc-300" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">Mis Snippets</h2>
              <p className="text-xs text-zinc-500">Trozos de código rápidos</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Área de contenido */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {isAdding ? (
            <form onSubmit={handleAdd} className="bg-zinc-900 p-4 rounded-2xl border border-zinc-700 space-y-4 animate-in fade-in zoom-in-95 duration-200">
              <input 
                required type="text" placeholder="Título (ej: Redirección 301)" 
                value={newSnippet.title} onChange={e => setNewSnippet({...newSnippet, title: e.target.value})} 
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-zinc-500 text-sm transition-colors" 
              />
              <textarea 
                required placeholder="Pega tu código aquí..." 
                value={newSnippet.code} onChange={e => setNewSnippet({...newSnippet, code: e.target.value})} 
                rows={6} 
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-300 font-mono text-[13px] focus:outline-none focus:border-zinc-500 transition-colors resize-none leading-relaxed" 
              />
              <div className="flex gap-2">
                <button type="button" onClick={() => setIsAdding(false)} className="flex-1 py-2.5 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-xl transition-colors">Cancelar</button>
                <button type="submit" className="flex-1 bg-zinc-100 hover:bg-white text-zinc-950 text-sm font-medium py-2.5 rounded-xl transition-colors shadow-sm">Guardar Snippet</button>
              </div>
            </form>
          ) : (
            <button onClick={() => setIsAdding(true)} className="w-full border border-dashed border-zinc-800 hover:border-zinc-600 bg-zinc-900/30 hover:bg-zinc-900/80 text-zinc-400 hover:text-zinc-200 rounded-2xl py-4 flex items-center justify-center gap-2 transition-all text-sm font-medium">
              <Plus className="w-4 h-4" /> Añadir Nuevo Snippet
            </button>
          )}

          <div className="space-y-4">
            {snippets.map((snippet, index) => (
              <div key={snippet.id} className="bg-zinc-900/80 border border-zinc-800 rounded-2xl overflow-hidden group animate-in fade-in slide-in-from-bottom-2" style={{ animationDelay: `${index * 50}ms` }}>
                <div className="px-4 py-3 bg-zinc-800/30 flex justify-between items-center border-b border-zinc-800/80">
                  <h4 className="text-sm font-medium text-zinc-200 truncate pr-4">{snippet.title}</h4>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => deleteSnippet(snippet.id)} className="p-1.5 text-zinc-500 hover:text-red-400 rounded-md hover:bg-zinc-800 transition-colors" title="Eliminar"><Trash2 className="w-4 h-4" /></button>
                    <button onClick={() => copyToClipboard(snippet.code, (val) => val ? setCopiedId(snippet.id) : setCopiedId(null))} className="p-1.5 text-zinc-500 hover:text-white rounded-md hover:bg-zinc-800 transition-colors" title="Copiar código">
                      {copiedId === snippet.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div className="p-4 bg-zinc-950/50 overflow-x-auto relative">
                  <pre className="text-[13px] text-zinc-400 font-mono leading-relaxed inline-block min-w-full">
                    <code>{snippet.code}</code>
                  </pre>
                </div>
              </div>
            ))}
            {snippets.length === 0 && !isAdding && (
              <div className="text-center py-10 opacity-60">
                <Code2 className="w-8 h-8 text-zinc-600 mx-auto mb-3" />
                <p className="text-sm text-zinc-500">No hay snippets guardados.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}