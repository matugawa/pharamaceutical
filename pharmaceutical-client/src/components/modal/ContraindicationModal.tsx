import { useMemo } from "react";
import DOMPurify from "dompurify";
import styles from "./ContraindicationModal.module.css";

type Props = {
  open: boolean;
  html: string;
  onClose: () => void;
};

/**
 * クリック（モーダル内でも外でも）で閉じる簡易モーダル。
 * 500×600px に収まらない場合はスクロール。
 */
export const ContraindicationModal = ({ open, html, onClose }: Props) => {
  if (!open) return null;

  const cleanup = (raw: string): string => {
    // 1. href属性を持つaタグ + 直後のカンマを削除
    const noLinks = raw.replace(
      /<a[^>]*href=["'][^"']*["'][^>]*>.*?<\/a>\s*,*/gisu,
      ""
    );

    // 2. **, **,* などのノイズ削除
    const noStars = noLinks.replace(
      /(?:\*\*|&#x2a;&#x2a;)(?:,\*|&nbsp;|\s*,\*|\s*)?/gisu,
      ""
    );

    // 3. <span style="margin-left: ...>〜</span> を削除（2.11ずれ対策）
    const noStyleSpans = noStars.replace(
      /<span[^>]*style=["'][^"']*margin-left:[^"']*["'][^>]*>\s*<\/span>/gisu,
      ""
    );

    // 4. 不要な末尾カンマ整理
    const cleaned = noStyleSpans.replace(/[\s,]+(?=\s*(<\/li>|$))/giu, "");

    return cleaned;
  };

  // ① サニタイズ（XSS 防止）
  const safeHtml = useMemo(
    () => DOMPurify.sanitize(cleanup(html), { USE_PROFILES: { html: true } }),
    [html]
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose} // 背景クリックで閉じる
    >
      <div
        className={`bg-white rounded-2xl shadow-xl max-w-[600px] max-h-[500px] w-[90%] overflow-y-auto p-6 not-prose ${styles.modalContent}`}
        onClick={(e) => e.stopPropagation()} // 中クリックは伝播させない
        dangerouslySetInnerHTML={{ __html: safeHtml }} // ② 挿入
      />
    </div>
  );
};
