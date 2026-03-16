export default function PlausibleAnalytics({ domain }: { domain: string }) {
  return (
    <script
      defer
      data-domain={domain}
      src="https://plausible.io/js/script.tagged-events.js"
    />
  )
}
