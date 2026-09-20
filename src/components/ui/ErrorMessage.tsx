interface ErrorMessageProps {
  message: string
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  return <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{message}</p>
}
