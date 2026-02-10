import { NextResponse } from "next/server";
import { readdirSync } from "fs";
import { join } from "path";

const SEQUENCE_DIR = "video-sequence-1";
const EXTENSIONS = /\.(jpg|jpeg|png|webp)$/i;

function naturalSort(files: string[]): string[] {
  return files.slice().sort((a, b) => {
    const numA = parseInt(a.replace(/\D/g, ""), 10) || 0;
    const numB = parseInt(b.replace(/\D/g, ""), 10) || 0;
    if (numA !== numB) return numA - numB;
    return a.localeCompare(b);
  });
}

export async function GET() {
  try {
    const dir = join(process.cwd(), "public", SEQUENCE_DIR);
    const files = readdirSync(dir).filter((f) => EXTENSIONS.test(f));
    const sorted = naturalSort(files);
    const urls = sorted.map((f) => `/${SEQUENCE_DIR}/${f}`);
    return NextResponse.json({ urls });
  } catch (e) {
    console.error("Sequence API error:", e);
    return NextResponse.json({ urls: [] }, { status: 500 });
  }
}
