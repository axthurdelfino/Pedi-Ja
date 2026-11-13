export default function RetryMessage({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void | Promise<void>;
}) {
  return (
    <div className="form-error error-with-action" role="alert">
      <span>{message}</span>
      <button
        type="button"
        className="outline-button"
        onClick={() => void onRetry()}
      >
        Tentar novamente
      </button>
    </div>
  );
}
