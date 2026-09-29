import { Resend } from "resend"
import { NextResponse } from "next/server"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      emails,
      companyName,
      recipientName,
      alertTitle,
      mainMessage,
      actionMessage,
      buttonText,
      downloadLink,
      contactInfo,
      templateColor,
      accentColor,
      companyFooter,
      contactMessage,
    } = body

    if (!emails || !Array.isArray(emails) || emails.length === 0) {
      console.error("[v0] Lista de emails inválida")
      return NextResponse.json({ error: "Lista de emails inválida" }, { status: 400 })
    }

    console.log(`[v0] Iniciando envio em massa para ${emails.length} destinatários`)
    console.log("[v0] Usando FROM:", process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev")

    const results = {
      successCount: 0,
      failureCount: 0,
      errors: [] as string[],
    }

    // Enviar emails em lote (com delay para evitar rate limiting)
    for (const email of emails) {
      try {
        console.log(`[v0] Enviando para: ${email}`)

        const emailHtml = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <style>
                body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; }
                .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
                .header { background-color: ${templateColor || "#003d7a"}; padding: 40px 20px; text-align: center; }
                .header h1 { color: #ffffff; font-size: 32px; margin: 0; font-weight: bold; }
                .content { padding: 40px 30px; color: #4b5563; line-height: 1.6; }
                .alert-icon { width: 64px; height: 64px; background-color: #fbbf24; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 32px; margin: 0 auto 16px; line-height: 64px; text-align: center; }
                .alert-title { text-align: center; margin-bottom: 28px; padding-bottom: 20px; border-bottom: 2px solid #e5e7eb; }
                .alert-title h2 { color: #1f2937; font-size: 24px; margin: 0; font-weight: bold; }
                .action-box { background-color: ${accentColor || "#fef3c7"}; border-left: 4px solid ${templateColor || "#003d7a"}; padding: 24px; margin: 28px 0; border-radius: 8px; }
                .action-box p { margin: 0; color: #1f2937; font-weight: 600; }
                .button { display: inline-block; background-color: ${templateColor || "#003d7a"}; color: #ffffff; padding: 16px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 24px 0; }
                .footer { background-color: #f9fafb; padding: 32px; text-align: center; color: #6b7280; font-size: 14px; border-top: 1px solid #e5e7eb; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>${companyName}</h1>
                </div>
                
                <div class="content">
                  <table width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td align="center">
                        <div class="alert-icon">⚠️</div>
                      </td>
                    </tr>
                  </table>
                  
                  <div class="alert-title">
                    <h2>${alertTitle}</h2>
                  </div>
                  
                  <p><strong>Prezado ${recipientName || "cliente"},</strong></p>
                  
                  <p>${mainMessage}</p>
                  
                  <div class="action-box">
                    <p>⚠️ ${actionMessage}</p>
                  </div>
                  
                  <p>Este procedimento é essencial para proteger seus dados contra possíveis acessos não autorizados.</p>
                  
                  <div style="text-align: center;">
                    <a href="${downloadLink}" class="button">${buttonText}</a>
                  </div>
                  
                  <p>${contactMessage || "Em caso de dúvidas, entre em contato imediatamente pelo telefone oficial: <strong>" + contactInfo + "</strong>."}</p>
                </div>
                
                <div class="footer">
                  <p>Este é um e-mail automático. Não responda a esta mensagem.</p>
                  <p style="margin-top: 4px;"><strong>${companyFooter || companyName}</strong> © 2025</p>
                </div>
              </div>
            </body>
          </html>
        `

        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
          to: email,
          subject: `${alertTitle} - ${companyName}`,
          html: emailHtml,
        })

        results.successCount++
        console.log(`[v0] ✅ Enviado com sucesso para: ${email}`)

        // Delay de 100ms entre emails para evitar rate limiting
        await new Promise((resolve) => setTimeout(resolve, 100))
      } catch (error: any) {
        results.failureCount++
        const errorMsg = error.message || "Erro desconhecido"
        results.errors.push(`${email}: ${errorMsg}`)
        console.error(`[v0] ❌ Erro ao enviar para ${email}:`, errorMsg)
      }
    }

    console.log(`[v0] Envio em massa concluído: ${results.successCount} sucessos, ${results.failureCount} falhas`)

    return NextResponse.json({
      success: true,
      successCount: results.successCount,
      failureCount: results.failureCount,
      errors: results.errors,
    })
  } catch (error: any) {
    console.error("[v0] Erro no envio em massa:", error)

    let errorMessage = error.message || "Erro ao enviar emails em massa"

    if (error.message?.includes("domain")) {
      errorMessage = "Domínio não verificado. Configure um domínio próprio no Resend para enviar emails."
    } else if (error.message?.includes("sandbox")) {
      errorMessage = "Conta em modo sandbox. Verifique seu domínio no Resend para enviar para qualquer email."
    }

    return NextResponse.json(
      {
        error: errorMessage,
        help: "Consulte o README.md seção 'Configuração para Produção'",
      },
      { status: 500 },
    )
  }
}
