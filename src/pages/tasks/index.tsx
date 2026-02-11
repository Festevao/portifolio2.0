"use client";

import { useEffect, useState } from "react";

interface Tag {
  _id: string;
  name: string;
  description: string;
  weight: number;
}

interface Task {
  _id: string;
  clean_text: string;
  raw_input: string;
  status: string;
  createdAt: string;
  completedAt: string | null;
  urgency: number;
  effort: number;
  energy_required: number;
  tags: Tag[];
  suggested_by_ai: boolean;
  confirmed_by_user: boolean;
  ai_analysis: {
    confidence: number;
    detected_intent: string;
    extracted_entities: string[];
    reasoning: string;
  };
}

interface ApiResponse {
  page: number;
  limit: number;
  total: number;
  tasks: Task[];
}

interface TaskFilters {
  status?: string[];
  createdFrom?: string;
  createdTo?: string;
  completedFrom?: string;
  completedTo?: string;
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  // --- Autenticação por senha ---
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [passwordInput, setPasswordInput] = useState("");

  // Carrega a senha do localStorage apenas no cliente
  useEffect(() => {
    const storedKey = localStorage.getItem("tasksApiKey");
    if (storedKey) setApiKey(storedKey);
  }, []);

  const handlePasswordSubmit = () => {
    if (passwordInput.trim()) {
      localStorage.setItem("tasksApiKey", passwordInput.trim());
      setApiKey(passwordInput.trim());
      setPasswordInput("");
    }
  };

  const clearApiKey = () => {
    localStorage.removeItem("tasksApiKey");
    setApiKey(null);
  };

  const filters: TaskFilters = {
    status: ["pending", "in-progress"], // só tasks não concluídas
  };

  const buildQueryString = (page: number, limit: number) => {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("limit", limit.toString());
    if (filters.status) filters.status.forEach((s) => params.append("status", s));
    if (filters.createdFrom) params.append("createdFrom", filters.createdFrom);
    if (filters.createdTo) params.append("createdTo", filters.createdTo);
    if (filters.completedFrom) params.append("completedFrom", filters.completedFrom);
    if (filters.completedTo) params.append("completedTo", filters.completedTo);
    return params.toString();
  };

  const fetchTasks = async (nextPage = 1) => {
    if (!apiKey) return; // não faz requisição sem senha
    setLoading(true);
    const query = buildQueryString(nextPage, 20);
    try {
      const res = await fetch(`/api/tasks?${query}`, {
        headers: {
          "x-api-key": apiKey,
        },
      });

      if (res.status === 403) {
        clearApiKey();
        return;
      }

      const data: ApiResponse = await res.json();
      if (nextPage === 1) setTasks(data.tasks);
      else setTasks((prev) => [...prev, ...data.tasks]);
      setPage(data.page);
      setTotal(data.total);
    } catch (err) {
      console.error("Erro ao buscar tasks:", err);
      setFeedbackMessage("Erro ao carregar tasks.");
      setTimeout(() => setFeedbackMessage(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  const completeTask = async (taskId: string) => {
    if (!apiKey) return;
    setButtonLoading(true);
    setFeedbackMessage(null);
    try {
      const res = await fetch(`/api/tasks/${taskId}/complete`, {
        method: "PATCH",
        headers: { "x-api-key": apiKey },
      });
      if (res.status === 403) {
        clearApiKey();
        return;
      }
      if (!res.ok) throw new Error("Erro ao concluir task");
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
      setFeedbackMessage("Task concluída com sucesso!");
      setSelectedTask(null);
    } catch (err) {
      console.error(err);
      setFeedbackMessage("Erro ao concluir task.");
    } finally {
      setButtonLoading(false);
      setTimeout(() => setFeedbackMessage(null), 3000);
    }
  };

  useEffect(() => {
    if (apiKey) fetchTasks();
  }, [apiKey]);

  // --- Se não houver senha, mostra input de senha ---
  if (!apiKey) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-100 p-4">
        <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-sm">
          <h2 className="text-lg font-bold mb-4">Digite a senha para acessar</h2>
          <input
            type="password"
            className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Senha"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handlePasswordSubmit()}
          />
          <button
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
            onClick={handlePasswordSubmit}
          >
            Entrar
          </button>
        </div>
      </div>
    );
  }

  // --- Página principal de tasks (já autenticado) ---
  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 md:p-8">
      {feedbackMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded shadow z-50">
          {feedbackMessage}
        </div>
      )}

      <div className="max-w-xl mx-auto space-y-4">
        {tasks.map((task) => (
          <div
            key={task._id}
            className="bg-white rounded-xl shadow p-4 flex flex-col justify-between border-l-4 border-blue-500 cursor-pointer hover:shadow-lg transition"
            onClick={() => setSelectedTask(task)}
          >
            <p className="font-medium text-lg line-clamp-2">{task.clean_text}</p>
            <div className="flex flex-wrap gap-1 mt-2">
              {task.tags.map((tag) => (
                <span
                  key={tag._id}
                  className="bg-gray-200 text-gray-800 text-xs px-2 py-0.5 rounded"
                  title={tag.description}
                >
                  {tag.name}
                </span>
              ))}
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm font-semibold text-gray-600">{task.status}</span>
              <span className="text-sm font-bold text-red-500">
                Urgência: {task.urgency}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedTask && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={() => setSelectedTask(null)}
        >
          <div
            className="bg-white rounded-xl shadow-xl w-11/12 max-w-lg p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
              onClick={() => setSelectedTask(null)}
            >
              ✕
            </button>
            <h2 className="font-bold text-xl mb-2">{selectedTask.clean_text}</h2>
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedTask.tags.map((tag) => (
                <span
                  key={tag._id}
                  className="bg-gray-200 text-gray-800 text-xs px-2 py-0.5 rounded"
                >
                  {tag.name}
                </span>
              ))}
            </div>

            <div className="space-y-2 text-sm text-gray-700">
              <p>
                <strong>Texto original:</strong> {selectedTask.raw_input}
              </p>
              <p>
                <strong>Esforço:</strong> {selectedTask.effort} | <strong>Energia:</strong>{" "}
                {selectedTask.energy_required}
              </p>
              <p>
                <strong>AI Confiança:</strong> {selectedTask.ai_analysis.confidence}
              </p>
              <p>
                <strong>Intenção detectada:</strong> {selectedTask.ai_analysis.detected_intent}
              </p>
              <p>
                <strong>Entidades:</strong>{" "}
                {selectedTask.ai_analysis.extracted_entities.join(", ")}
              </p>
              <p>
                <strong>Raciocínio AI:</strong> {selectedTask.ai_analysis.reasoning}
              </p>
              <p>
                <strong>Criado em:</strong>{" "}
                {new Date(selectedTask.createdAt).toLocaleString()}
              </p>
            </div>

            <div className="mt-4 flex gap-3">
              <button
                className={`flex-1 bg-green-500 text-white py-2 rounded transition ${
                  buttonLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-green-600"
                }`}
                onClick={() => completeTask(selectedTask._id)}
                disabled={buttonLoading}
              >
                {buttonLoading ? "Concluindo..." : "Concluir"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Paginação */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-300 p-2 flex justify-center gap-2">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition disabled:bg-gray-400"
          onClick={() => fetchTasks(page - 1)}
          disabled={page <= 1 || loading}
        >
          Anterior
        </button>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition disabled:bg-gray-400"
          onClick={() => fetchTasks(page + 1)}
          disabled={tasks.length >= total || loading}
        >
          Próximo
        </button>
      </div>
    </div>
  );
}
