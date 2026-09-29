"use client"

import { useState } from "react"

type EditableField = {
  id: string
  type: string
  label: string
  value: string
  href?: string
}

export default function HtmlProcessorPage() {
  const [htmlInput, setHtmlInput] = useState("")
  const [editableFields, setEditableFields] = useState<EditableField[]>([])
  const [htmlProcessed, setHtmlProcessed] = useState(false)

  const processEmailHtml = () => {
    if (!htmlInput.trim()) {
      alert("Cole o HTML do email antes de processar.")
      return
    }

    const document = new DOMParser().parseFromString(htmlInput, "text/html")
    const fields: EditableField[] = []
    let index = 0

    document.querySelectorAll("h1, h2, h3, h4, h5, h6, p, span, td, th, a, button, img").forEach((element) => {
      const value = element.tagName === "IMG" ? element.getAttribute("alt")?.trim() : element.textContent?.trim()
      if (!value || element.closest("script, style, head, title")) return

      const type = element.tagName === "A" ? "Link" : element.tagName === "IMG" ? "Imagem" : /^H[1-6]$/.test(element.tagName) ? "Título" : "Texto"
      fields.push({
        id: `${element.tagName.toLowerCase()}-${index}`,
        type,
        label: `${type} ${index + 1}`,
        value,
        href: element.tagName === "A" ? element.getAttribute("href") || "" : undefined,
      })
      index += 1
    })

    setEditableFields(fields)
    setHtmlProcessed(true)
  }

  const updateEditableField = (id: string, value: string) => {
    setEditableFields((current) => current.map((field) => (field.id === id ? { ...field, value } : field)))
  }

  return (
    <main className="min-h-screen bg-slate-950 p-6 text-slate-900 md:p-10">
      <section className="mx-auto max-w-7xl rounded-2xl bg-white/95 p-6 shadow-xl md:p-8" aria-labelledby="html-processor-title">
        <div className="mb-6 flex flex-col gap-2">
          <a href="/" className="text-sm font-medium text-blue-600 hover:text-blue-800">Voltar para o painel</a>
          <h1 id="html-processor-title" className="text-2xl font-bold text-slate-800">Editor de HTML para o time</h1>
          <p className="text-sm text-slate-500">Cole um email já criado para identificar títulos, textos, links e imagens que podem ser revisados pela equipe.</p>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <div className="flex flex-col gap-3">
            <label htmlFor="email-html" className="text-xs font-semibold uppercase tracking-wide text-slate-700">HTML do email</label>
            <textarea
              id="email-html"
              value={htmlInput}
              onChange={(event) => setHtmlInput(event.target.value)}
              placeholder="Cole aqui o código HTML do email..."
              className="min-h-56 w-full rounded-lg border border-slate-300 bg-slate-50 p-4 font-mono text-xs text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              aria-describedby="html-help"
            />
            <div className="flex items-center justify-between gap-3">
              <span id="html-help" className="text-xs text-slate-500">O processamento acontece no navegador.</span>
              <button onClick={processEmailHtml} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700">Processar HTML</button>
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 className="text-sm font-bold text-slate-800">Campos encontrados</h2>
              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">{editableFields.length} campos</span>
            </div>
            {!htmlProcessed ? (
              <p className="rounded-lg border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">O resultado aparecerá aqui após o processamento.</p>
            ) : editableFields.length === 0 ? (
              <p className="rounded-lg border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">Nenhum campo editável foi identificado.</p>
            ) : (
              <div className="flex max-h-96 flex-col gap-3 overflow-y-auto pr-1">
                {editableFields.map((field) => (
                  <div key={field.id} className="rounded-lg border border-slate-200 bg-white p-3">
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <label htmlFor={field.id} className="text-xs font-semibold text-slate-700">{field.label}</label>
                      <span className="text-[10px] font-semibold uppercase text-slate-400">{field.type}</span>
                    </div>
                    <input id={field.id} value={field.value} onChange={(event) => updateEditableField(field.id, event.target.value)} className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500" />
                    {field.href !== undefined && <p className="mt-1 truncate text-[11px] text-slate-400">Destino: {field.href || "sem link"}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}
