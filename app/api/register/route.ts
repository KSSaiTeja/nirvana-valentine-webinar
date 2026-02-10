import { NextResponse } from "next/server";
import { google } from "googleapis";

const SHEET_ID = process.env.GOOGLE_SHEET_ID;
const SHEET_RANGE = process.env.GOOGLE_SHEET_RANGE ?? "Sheet1!A:C";

function getAuth() {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!raw) throw new Error("GOOGLE_SERVICE_ACCOUNT_JSON is not set");
  const credentials = JSON.parse(raw) as {
    client_email: string;
    private_key: string;
  };
  if (!credentials.private_key || !credentials.client_email) {
    throw new Error("Invalid GOOGLE_SERVICE_ACCOUNT_JSON");
  }
  const privateKey = credentials.private_key.replace(/\\n/g, "\n");
  return new google.auth.GoogleAuth({
    credentials: { ...credentials, private_key: privateKey },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const phone = typeof body.phone === "string" ? body.phone.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";

    if (!name || !phone || !email) {
      return NextResponse.json(
        { error: "Name, phone, and email are required." },
        { status: 400 }
      );
    }

    const phoneDigits = phone.replace(/\D/g, "");
    const validPhone =
      (phoneDigits.length === 10 && /^[6-9]\d{9}$/.test(phoneDigits)) ||
      (phoneDigits.length === 11 && phoneDigits.startsWith("0") && /^0[6-9]\d{9}$/.test(phoneDigits)) ||
      (phoneDigits.length === 12 && phoneDigits.startsWith("91") && /^91[6-9]\d{9}$/.test(phoneDigits));
    if (!validPhone) {
      return NextResponse.json(
        { error: "Please enter a valid 10-digit Indian mobile number." },
        { status: 400 }
      );
    }

    if (!SHEET_ID) {
      console.error("GOOGLE_SHEET_ID is not set");
      return NextResponse.json(
        { error: "Server configuration error." },
        { status: 500 }
      );
    }

    const auth = getAuth();
    const sheets = google.sheets({ version: "v4", auth });

    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: SHEET_RANGE,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[name, phone, email]],
      },
    });

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Register API error:", e);
    return NextResponse.json(
      { error: "Failed to save. Please try again." },
      { status: 500 }
    );
  }
}
