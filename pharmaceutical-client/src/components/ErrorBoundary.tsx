import React from 'react';

type Props = {
  children: React.ReactNode;
};

type State = {
  hasError: boolean;
};

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  // エラーがスローされたときにReactが呼ぶメソッド
  static getDerivedStateFromError(error: Error) {
    console.error(error);
    // 次回レンダリング時にフォールバックUIを表示するよう状態を更新
    return { hasError: true };
  }

  // エラー情報をログしたり外部サービスに送信したりできる
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
    // SentryやLogRocketなどのエラー追跡サービスに送ることも可能
  }

  render() {
    if (this.state.hasError) {
      // フォールバックUI
      return <h1>Something went wrong.</h1>;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
