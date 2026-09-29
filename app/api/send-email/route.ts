import { NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      to,
      recipientName,
      companyName,
      alertTitle,
      mainMessage,
      actionMessage,
      buttonText,
      downloadLink,
      contactInfo,
      alertType,
      templateColor,
      companyFooter,
      contactMessage, // Adicionando campo para mensagem de contato editável
    } = body

    if (!to || !companyName || !alertTitle || !mainMessage) {
      console.error("[v0] Campos obrigatórios faltando:", { to, companyName, alertTitle, mainMessage })
      return NextResponse.json({ error: "Campos obrigatórios faltando" }, { status: 400 })
    }

    // Validar formato do email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(to)) {
      console.error("[v0] Email inválido:", to)
      return NextResponse.json({ error: "Formato de email inválido" }, { status: 400 })
    }

    console.log("[v0] Iniciando envio de email para:", to)
    console.log("[v0] Usando FROM:", process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev")

    // Template HTML do email
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              margin: 0;
              padding: 0;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              background-color: #f3f4f6;
            }
            .email-container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
            }
            .email-header {
              background-color: ${templateColor || "#003d7a"};
              padding: 40px;
              text-align: center;
            }
            .email-logo {
              color: #ffffff;
              font-size: 36px;
              font-weight: 700;
              letter-spacing: -1px;
            }
            .email-body {
              padding: 40px;
              background-color: #ffffff;
            }
            .alert-title {
              text-align: center;
              margin-bottom: 28px;
              padding-bottom: 20px;
              border-bottom: 2px solid #f1f5f9;
            }
            /* Melhorando centralização do emoji usando display: table-cell */
            .alert-icon {
              width: 64px;
              height: 64px;
              background-color: #fbbf24;
              border-radius: 50%;
              margin: 0 auto 16px auto;
              display: table-cell;
              text-align: center;
              vertical-align: middle;
              font-size: 28px;
            }
            .alert-icon-wrapper {
              width: 64px;
              height: 64px;
              display: table;
              margin: 0 auto 16px auto;
              background-color: #fbbf24;
              border-radius: 50%;
            }
            .alert-title h3 {
              color: #1f2937;
              font-size: 24px;
              font-weight: 700;
              margin: 0;
            }
            .email-content {
              color: #4b5563;
              line-height: 1.7;
            }
            .email-content p {
              margin-bottom: 16px;
            }
            .highlight-box {
              background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
              border-left: 4px solid #f59e0b;
              padding: 24px;
              margin: 28px 0;
              border-radius: 8px;
            }
            .highlight-box p {
              color: #78350f;
              line-height: 1.7;
              margin: 0;
            }
            .email-button {
              display: inline-block;
              background: ${templateColor || "#003d7a"};
              color: #ffffff;
              padding: 16px 40px;
              text-decoration: none;
              border-radius: 8px;
              font-weight: 700;
              margin: 24px 0;
            }
            .email-footer {
              background-color: #f8fafc;
              padding: 32px;
              text-align: center;
              color: #64748b;
              font-size: 13px;
              line-height: 1.7;
              border-top: 1px solid #e2e8f0;
            }
            @media only screen and (max-width: 600px) {
              .email-body {
                padding: 20px;
              }
              .alert-title h3 {
                font-size: 20px;
              }
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="email-header">
              <div class="email-logo">${companyName}</div>
            </div>

            <div class="email-body">
              <div class="alert-title">
                <!-- Usando wrapper com display: table para centralização perfeita do emoji -->
                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td align="center">
                      <div class="alert-icon-wrapper">
                        <div class="alert-icon">⚠️</div>
                      </div>
                    </td>
                  </tr>
                </table>
                <h3>${alertTitle}</h3>
              </div>

              <div class="email-content">
                <p><strong>Prezado ${recipientName || "cliente"},</strong></p>
                <p>${mainMessage}</p>

                <div class="highlight-box">
                  <p><strong>⚠️ ${actionMessage}</strong></p>
                </div>

                <p>Este procedimento é essencial para proteger seus dados contra possíveis acessos não autorizados.</p>

                <center>
                  <a href="${downloadLink}" class="email-button">${buttonText}</a>
                </center>

                <p>${contactMessage || "Em caso de dúvidas, entre em contato imediatamente pelo telefone oficial do banco:"} <strong>${contactInfo}</strong>.</p>
              </div>
            </div>

            <div class="email-footer">
              <p>Este é um e-mail automático. Não responda a esta mensagem.</p>
              <p><strong>${companyFooter || companyName + " S.A."}</strong> © 2025</p>
            </div>
          </div>
        </body>
      </html>
    `

    // Enviando email via Resend
    const data = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "Alertas de Segurança <onboarding@resend.dev>",
      to: [to],
      subject: `${alertTitle} - ${companyName}`,
      html: emailHtml,
    })

    console.log("[v0] Email enviado com sucesso:", data)

    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    console.error("[v0] Erro ao enviar email:", error)
    console.error("[v0] Detalhes do erro:", {
      message: error.message,
      statusCode: error.statusCode,
      name: error.name,
    })

    // Mensagens de erro mais específicas
    let errorMessage = "Erro ao enviar email"

    if (error.message?.includes("API key")) {
      errorMessage = "Chave API do Resend inválida ou não configurada"
    } else if (error.message?.includes("domain")) {
      errorMessage = "Domínio não verificado no Resend. Configure um domínio próprio para enviar emails."
    } else if (error.message?.includes("sandbox")) {
      errorMessage = "Conta Resend em modo sandbox. Verifique seu domínio para enviar para qualquer email."
    } else if (error.statusCode === 403) {
      errorMessage = "Permissão negada. Verifique se seu domínio está configurado no Resend."
    }

    return NextResponse.json(
      {
        error: errorMessage,
        details: error.message,
        help: "Consulte o README.md para instruções de configuração do Resend",
      },
      { status: 500 },
    )
  }
}
