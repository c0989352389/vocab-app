// 顯示音標,類似 Google: 美式優先,英式若有也顯示
export default function Phonetic({ data, size = 'md', className = '' }) {
  if (!data) return null
  const us = data.us || data.ipa
  const uk = data.uk && data.uk !== us ? data.uk : ''
  if (!us && !uk) return null

  const fontSize = size === 'lg' ? 'text-xl' : size === 'sm' ? 'text-sm' : 'text-base'

  return (
    <div className={`flex flex-wrap items-center justify-center gap-x-3 gap-y-1 ${fontSize} ${className}`}>
      {us && (
        <span className="font-phonetic text-duo-ink/70">
          <span className="text-[10px] text-duo-gray font-bold mr-1 align-middle">美</span>
          {us}
        </span>
      )}
      {uk && (
        <span className="font-phonetic text-duo-ink/70">
          <span className="text-[10px] text-duo-gray font-bold mr-1 align-middle">英</span>
          {uk}
        </span>
      )}
    </div>
  )
}
