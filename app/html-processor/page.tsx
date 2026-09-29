"use client"

import { useMemo, useState } from "react"

type EditableField = {
  id: string
  type: string
  label: string
  value: string
  href?: string
  tagName: string
}

const FIELD_SELECTOR = "h1, h2, h3, h4, h5, h6, p, td, th, a, button, img"

function decodeQuotedPrintable(value: string) {
  const withoutSoftBreaks = value.replace(/=\\r?\\n/g, "")
  const bytes: number[] = []
  let decoded = ""

  for (let index = 0; index < withoutSoftBreaks.length; index += 1) {
    if (withoutSoftBreaks[index] === "=" && /^[0-9A-F]{2}$/i.test(withoutSoftBreaks.slice(index + 1, index + 3))) {
      bytes.push(Number.parseInt(withoutSoftBreaks.slice(index + 1, index + 3), 16))
      index += 2
      continue
    }
    if (bytes.length) {
      decoded += new TextDecoder("utf-8").decode(new Uint8Array(bytes))
      bytes.length = 0
    }
    decoded += withoutSoftBreaks[index]
  }

  if (bytes.length) decoded += new TextDecoder("utf-8").decode(new Uint8Array(bytes))
  return decoded
}

function getHtmlDocument(source: string) {
  const normalizedSource = decodeQuotedPrintable(source.trim())
  const htmlStart = normalizedSource.search(/<!doctype\\s+html|<html[\\s>]|<body[\\s>]|<table[\\s>]/i)
  const htmlSource = htmlStart >= 0 ? normalizedSource.slice(htmlStart) : normalizedSource
  const document = new DOMParser().parseFromString(htmlSource, "text/html")
  document.querySelectorAll("script, meta, base").forEach((element) => element.remove())
  return document
}

function isEditableCandidate(element: Element) {
  if (element.closest("script, style, head, title, meta, link, pre, code")) return false
  if (element.tagName !== "IMG" && !element.textContent?.trim()) return false
  const hasEditableChild = Array.from(element.children).some((child) => child.matches(FIELD_SELECTOR))
  return !hasEditableChild
}

function getFieldValue(element: Element) {
  if (element.tagName === "IMG") return element.getAttribute("alt")?.trim() || element.getAttribute("src")?.trim() || ""
  return element.textContent?.replace(/\\s+/g, " ").trim() || ""
}

function updateElementText(element: Element, value: string) {
  const walker = element.ownerDocument?.createTreeWalker(element, NodeFilter.SHOW_TEXT)
  const textNodes: Text[] = []
  let currentNode = walker?.nextNode()
  while (currentNode) {
    textNodes.push(currentNode as Text)
    currentNode = walker?.nextNode()
  }

  if (!textNodes.length) {
    element.textContent = value
    return
  }

  textNodes[0].nodeValue = value
  textNodes.slice(1).forEach((node) => {
    node.nodeValue = ""
  })
}

export default function HtmlProcessorPage() {
  const [htmlInput, setHtmlInput] = useState("")
  const [editableFields, setEditableFields] = useState<EditableField[]>([])
  const [processedHtml, setProcessedHtml] = useState("")
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null)

  const processEmailHtml = () => {
    if (!htmlInput.trim()) {
      alert("Cole o HTML do email antes de processar.")
      return
    }

    const parsed = getHtmlDocument(htmlInput)
    const fields: EditableField[] = []
    let fieldIndex = 0
    parsed.querySelectorAll(FIELD_SELECTOR).forEach((element) => {
      if (!isEditableCandidate(element)) return
      const value = getFieldValue(element)
      if (!value) return
      const type = element.tagName === "A" ? "Link" : element.tagName === "IMG" ? "Imagem" : /^H[1-6]$/.test(element.tagName) ? "Título" : "Texto"
      const id = `${element.tagName.toLowerCase()}-${fieldIndex++}`
      fields.push({ id, type, label: `${type} ${fields.filter((field) => field.type === type).length + 1}`, value, href: element.tagName === "A" ? element.getAttribute("href") || "" : undefined, tagName: element.tagName })
      element.setAttribute("data-editable-id", id)
    })

    setEditableFields(fields)
    setProcessedHtml(parsed.documentElement.outerHTML)
    setSelectedFieldId(fields[0]?.id ?? null)
  }

  const updateEditableField = (id: string, value: string) => {
    setEditableFields((current) => current.map((field) => (field.id === id ? { ...field, value } : field)))
  }

  const previewHtml = useMemo(() => {
    if (!processedHtml) return ""
    const document = new DOMParser().parseFromString(processedHtml, "text/html")
    editableFields.forEach((field) => {
      const element = document.querySelector(`[data-editable-id="${field.id}"]`)
      if (!element) return
      if (field.tagName === "IMG") {
        if (field.value.startsWith("http") || field.value.startsWith("data:")) element.setAttribute("src", field.value)
        else element.setAttribute("alt", field.value)
      } else {
        updateElementText(element, field.value)
      }
      if (field.tagName === "A" && field.href !== undefined) element.setAttribute("href", field.href)
    })
    const style = document.createElement("style")
    style.textContent = `[data-editable-id]{transition:background .2s,outline .2s;cursor:default} [data-editable-id]:hover{outline:2px solid #93c5fd;background:#eff6ff}`
    document.head.appendChild(style)
    return document.documentElement.outerHTML
  }, [processedHtml, editableFields])

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-slate-900 md:px-8 md:py-8">
      <section className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-[1500px] flex-col rounded-3xl bg-white p-5 shadow-2xl md:p-8" aria-labelledby="html-processor-title">
        <header className="mb-7 flex flex-col gap-3 border-b border-slate-200 pb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <a href="/" className="mb-3 inline-block text-sm font-semibold text-blue-600 transition hover:text-blue-800">Voltar para o painel</a>
            <h1 id="html-processor-title" className="text-3xl font-bold tracking-tight text-slate-900">Processador de HTML de emails</h1>
            <p className="mt-2 max-w-3xl text-sm text-slate-500">Cole um email já criado, identifique os campos editáveis e revise o resultado visual em tempo real.</p>
          </div>
          {processedHtml && <span className="rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">{editableFields.length} campos encontrados</span>}
        </header>

        <div className="grid min-h-0 flex-1 gap-6 xl:grid-cols-[minmax(280px,360px)_minmax(420px,1fr)_minmax(300px,380px)]">
          <section className="flex flex-col gap-3" aria-labelledby="input-title">
            <h2 id="input-title" className="text-sm font-bold uppercase tracking-wide text-slate-700">HTML do email</h2>
            <textarea id="email-html" value={htmlInput} onChange={(event) => setHtmlInput(event.target.value)} placeholder="Cole aqui o código HTML do email..." className="min-h-72 flex-1 resize-y rounded-xl border border-slate-300 bg-slate-50 p-4 font-mono text-xs leading-5 text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10" />
            <p className="text-xs text-slate-500">O processamento acontece com segurança no navegador.</p>
            <button onClick={processEmailHtml} className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700">Processar HTML</button>
          </section>

          <section className="flex min-h-[430px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-slate-100" aria-labelledby="preview-title">
            <div className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4"><div><h2 id="preview-title" className="font-bold text-slate-900">Visualização do email</h2><p className="text-xs text-slate-500">As alterações aparecem aqui instantaneamente.</p></div><span className="size-3 rounded-full bg-emerald-400" aria-label="Visualização em tempo real" /> </div>
            <div className="flex flex-1 items-start justify-center overflow-auto p-5 md:p-8">
              {previewHtml ? <iframe title="Pré-visualização do email" srcDoc={previewHtml} className="min-h-[500px] w-full rounded-lg border border-slate-200 bg-white shadow-md" sandbox="allow-same-origin" /> : <p className="self-center rounded-xl border border-dashed border-slate-300 bg-white/60 px-8 py-10 text-center text-sm text-slate-500">O email processado aparecerá aqui.</p>}
            </div>
          </section>

          <section className="flex min-h-0 flex-col rounded-2xl border border-slate-200 bg-slate-50 p-5" aria-labelledby="fields-title">
            <div className="mb-4 flex items-center justify-between gap-3"><h2 id="fields-title" className="font-bold text-slate-900">Campos editáveis</h2><span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">{editableFields.length}</span></div>
            {!editableFields.length ? <p className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">Processe um HTML para listar títulos, textos, links e imagens.</p> : <div className="flex min-h-0 flex-col gap-3 overflow-y-auto pr-1">{editableFields.map((field) => <div key={field.id} className={`rounded-xl border bg-white p-3 transition ${selectedFieldId === field.id ? "border-blue-400 ring-2 ring-blue-100" : "border-slate-200"}`} onFocus={() => setSelectedFieldId(field.id)}><div className="mb-2 flex items-center justify-between gap-3"><label htmlFor={field.id} className="text-xs font-bold text-slate-700">{field.label}</label><span className="text-[10px] font-bold uppercase text-slate-400">{field.type}</span></div><input id={field.id} value={field.value} onChange={(event) => updateEditableField(field.id, event.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10" />{field.href !== undefined && <p className="mt-2 truncate text-[11px] text-slate-400">Destino: {field.href || "sem link"}</p>}</div>)}</div>}
          </section>
        </div>
      </section>
    </main>
  )
}
