export async function uploadProductImage(file: File): Promise<string> {
  const presignResponse = await fetch('/api/presigned-url', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fileName: file.name, fileType: file.type }),
  })

  if (!presignResponse.ok) {
    throw new Error('Não foi possível gerar a URL de upload.')
  }

  const { uploadUrl, publicUrl } = await presignResponse.json()

  const uploadResponse = await fetch(uploadUrl, {
    method: 'PUT',
    headers: { 'Content-Type': file.type },
    body: file,
  })

  if (!uploadResponse.ok) {
    throw new Error('Falha ao enviar a imagem para o S3.')
  }

  return publicUrl
}
