/** REST API 베이스 URL (환경변수에서 로드) */
export function getApiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL ?? "";
}
