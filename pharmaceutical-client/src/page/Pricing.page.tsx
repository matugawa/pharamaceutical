import { useState } from "react";
import { getPharmaceutical } from "../query/pharmaceuticalQuery";
import clipIcon from "../assets/clip.svg";
import { Loading } from "../components/loading/Loading";
import { ContraindicationModal } from "../components/modal/ContraindicationModal";
import { Helmet } from "react-helmet-async";

export const Pricing = () => {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<
    {
      ingredient: string;
      pharmaceuticals: {
        category: string | null;
        product: string | null;
        specification: string | null;
        manufacturer: string | null;
        brandGeneric: string | null;
        brandGenericWithGeneric: string | null;
        price: number | null;
        previousePrice: number | null;
        expiraryDate: string | null;
        remarks: string | null;
      }[];
    }[]
  >([]);
  const [contraindicationHtml, setContraindicationHtml] = useState("");
  const [showContraindicationModal, setShowContraindicationModal] =
    useState(false);

  const displayValue = (value: string | null | undefined) => {
    return value && value !== "NaN" ? value : "";
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim().length < 3) {
      setError("3文字以上から検索可能です");
      return;
    }
    setError("");

    getPharmaceutical({
      input: {
        search: {
          category: "",
          searchName: input,
          specification: "",
        },
      },
      onStart: () => console.log("検索開始"),
      onNext: () => console.log("データ取得中"),
      onComplete: (res) => {
        setResults(
          res.ingredients?.map((g) => ({
            ingredient: g.ingredient,
            pharmaceuticals: g.pharmaceuticals.map((p) => ({
              category: p.category ?? null,
              product: p.product ?? null,
              specification: p.specification ?? null,
              manufacturer: p.manufacturer ?? null,
              brandGeneric: p.brandGeneric ?? null,
              brandGenericWithGeneric: p.brandGenericWithGeneric ?? null,
              price: p.price ?? null,
              previousePrice: p.previousePrice ?? null,
              expiraryDate: p.expiraryDate ?? null,
              remarks: p.remarks ?? null,
            })),
          })) ?? []
        );
      },
      onError: () => console.error("検索エラー"),
    });
  };

  const handleContraindicationClick = async (productName: string | null) => {
    if (import.meta.env.VITE_IS_PROD === "true") {
      window.gtag("event", "click_contraindication", {
        event_category: "interaction",
        event_label: productName ?? "不明",
      });
    }
    if (!productName) return;

    setLoading(true);
    try {
      console.log("FRONT");
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/contraindication?nameWord=${encodeURIComponent(productName)}`
      );

      if (!res.ok) {
        console.error("禁忌取得エラー", res.status);
        return;
      }

      const data = await res.json();

      console.log("data", data);
      setContraindicationHtml(data.html || "<p>見つかりませんでした。</p>");
      setShowContraindicationModal(true);
    } catch (e) {
      alert("禁忌情報の取得に失敗しました");
    } finally {
      setLoading(false); // ← 完了時に解除
    }
  };

  const handlePackageInsertClick = async (productName: string | null) => {
    if (import.meta.env.VITE_IS_PROD === "true") {
      window.gtag("event", "click_package_insert", {
        event_category: "interaction",
        event_label: productName ?? "不明",
      });
    }
    if (!productName) return;

    // 先に開く
    const newTab = window.open("about:blank", "_blank");
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/package_insert?nameWord=${encodeURIComponent(productName)}`
      );
      const { pdf_url } = await res.json();

      if (pdf_url) {
        // url差し替え
        newTab?.location.replace(pdf_url);
      } else {
        newTab?.close(); // URLなければタブ閉じる
        alert("添付文書 PDF が見つかりませんでした。");
      }
    } catch (err) {
      newTab?.close();
      console.error("添付文書取得エラー", err);
      alert("添付文書取得に失敗しました。");
    }
  };

  return (
    <>
      <Helmet>
        <title>薬価サーチ - 医薬品薬科検索サイト</title>
        <meta
          name="description"
          content="医薬品の薬価、メーカー、規格などをすばやく検索できるサイト。禁忌情報や添付文書PDFも確認可能。"
        />
        <meta property="og:title" content="薬価サーチ - 医薬品薬価検索" />
        <meta
          property="og:description"
          content="医薬品の情報を簡単に検索。禁忌・添付文書も対応。"
        />
        <meta property="og:url" content="https://www.okusuri-info.com/search" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="薬価サーチ" />
        <meta name="twitter:card" content="summary" />

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "薬価サーチ",
            url: "https://www.okusuri-info.com",
            description:
              "医薬品の薬価、禁忌情報、添付文書PDFが検索できる医療系薬品情報サイト。",
            inLanguage: "ja",
            publisher: {
              "@type": "Organization",
              name: "okusuri-info.com",
            },
          })}
        </script>
      </Helmet>
      {loading && <Loading />}
      <div className="min-h-screen flex flex-col bg-[#f8fafc]">
        {/* Header */}
        <header className="text-center py-12">
          <h1 className="text-5xl font-extrabold text-blue-800 tracking-wide">
            薬価サーチ
          </h1>
        </header>

        {/* Search Form */}
        <main className="flex-1 px-6">
          <div className="max-w-6xl mx-auto space-y-16">
            {/* Search */}
            <div className="flex justify-center w-full">
              <div className="bg-white rounded-3xl shadow-lg p-10 w-full">
                <form
                  onSubmit={handleSearch}
                  className="flex items-center bg-[#f0f4fa] rounded-2xl p-6 gap-6"
                >
                  <input
                    type="text"
                    placeholder="アスベリン"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="flex-grow bg-transparent text-lg placeholder-gray-400 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="bg-[#1a237e] text-white rounded-full px-8 py-3 text-lg font-semibold hover:bg-[#0d155f] transition"
                  >
                    検索
                  </button>
                </form>
                {error && (
                  <p className="text-red-500 text-sm mt-2 px-2">{error}</p>
                )}
              </div>
            </div>

            {/* Results */}
            {results.length > 0 && (
              <div className="space-y-12">
                {results.map((group, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl overflow-hidden bg-white shadow-md"
                  >
                    {/* 成分名 */}
                    <div className="bg-blue-100 px-6 py-4 font-bold text-gray-800 text-xl">
                      {group.ingredient}
                    </div>

                    {/* Table */}
                    <table className="w-full text-sm">
                      <thead className="bg-blue-50">
                        <tr>
                          <th className="text-left px-6 py-3">区分</th>
                          <th className="text-left px-6 py-3">品名</th>
                          <th className="text-center px-6 py-3">規格</th>
                          <th className="text-left px-6 py-3">メーカー名</th>
                          <th className="text-center px-6 py-3">先後分類</th>
                          <th className="text-right px-6 py-3">薬価</th>
                          <th className="text-center px-6 py-3">期限</th>
                          <th className="text-left px-6 py-3">備考</th>
                          <th className="text-center px-6 py-3">添付文書</th>
                          <th className="text-center px-6 py-3">禁忌</th>
                          {/* <th className="text-right px-6 py-3">旧薬価</th> */}
                        </tr>
                      </thead>
                      <tbody>
                        {group.pharmaceuticals.map((p, i) => {
                          const classification =
                            displayValue(p.brandGeneric) ||
                            displayValue(p.brandGenericWithGeneric);
                          const isOrigin = classification === "先発品";

                          return (
                            <tr
                              key={i}
                              className={`${
                                isOrigin ? "bg-red-50" : ""
                              } hover:bg-gray-50 transition border-b last:border-0`}
                            >
                              <td className="px-6 py-3 text-left">
                                {displayValue(p.category)}
                              </td>
                              <td className="pl-6 pr-2 py-3 text-left">
                                {p.product ?? ""}
                              </td>
                              <td className="px-6 py-3 text-center">
                                {p.specification ?? ""}
                              </td>
                              <td className="px-6 py-3 text-left">
                                {displayValue(p.manufacturer)}
                              </td>
                              <td className="px-6 py-3 text-center">
                                {classification}
                              </td>
                              <td className="px-6 py-3 text-right">
                                {p.price ?? ""}
                              </td>
                              <td className="px-6 py-3 text-center">
                                {displayValue(p.expiraryDate)}
                              </td>
                              <td className="px-6 py-3 text-left">
                                {displayValue(p.remarks)}
                              </td>
                              <td className="px-6 py-3 text-center">
                                {displayValue(p.manufacturer) && (
                                  <button
                                    onClick={() =>
                                      handlePackageInsertClick(p.product)
                                    }
                                    className="
                                bg-transparent
                                border-0
                                p-0
                                m-0
                                rounded-none
                                focus:outline-none
                                hover:opacity-80"
                                    title="添付文書を見る"
                                  >
                                    <img
                                      src={clipIcon}
                                      alt="禁忌アイコン"
                                      className="w-6 h-6 inline-block"
                                    />
                                  </button>
                                )}
                              </td>
                              <td className="px-6 py-3 text-center">
                                {displayValue(p.manufacturer) && (
                                  <button
                                    onClick={() =>
                                      handleContraindicationClick(p.product)
                                    }
                                    className="
                                bg-transparent
                                border-0
                                p-0
                                m-0
                                rounded-none
                                focus:outline-none
                                hover:opacity-80"
                                    title="禁忌情報を見る"
                                  >
                                    <img
                                      src={clipIcon}
                                      alt="禁忌アイコン"
                                      className="w-6 h-6 inline-block"
                                    />
                                  </button>
                                )}
                              </td>
                              {/* <td className="px-6 py-3 text-right">
                              {p.previousePrice !== null
                                ? `${p.previousePrice}`
                                : ""}
                            </td> */}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>

        {/* Footer */}
        <div className="flex flex-col items-center justify-center py-10 bg-[#f8fafc]">
          <div className="flex items-center gap-4">
            {/* 左のアイコン */}
            <div className="flex flex-col gap-2">
              <div className="w-2.5 h-2.5 rounded-sm bg-gradient-to-r from-pink-300 via-pink-200 to-pink-100 animate-colorShift"></div>
              <div className="w-2.5 h-2.5 rounded-sm bg-gradient-to-r from-purple-300 via-purple-200 to-purple-100 animate-colorShift delay-150"></div>
              <div className="w-2.5 h-2.5 rounded-sm bg-gradient-to-r from-blue-300 via-blue-200 to-blue-100 animate-colorShift delay-300"></div>
            </div>

            {/* メッセージ */}
            <div className="text-center space-y-1 text-gray-700 text-sm">
              <p className="font-semibold">Drugs for Health.</p>
              <p className="font-semibold">
                For the town, for the people we meet every day.
              </p>
            </div>

            {/* 右のアイコン */}
            <div className="flex flex-col gap-2">
              <div className="w-2.5 h-2.5 rounded-sm bg-gradient-to-r from-green-300 via-green-200 to-green-100 animate-colorShift"></div>
              <div className="w-2.5 h-2.5 rounded-sm bg-gradient-to-r from-yellow-300 via-yellow-200 to-yellow-100 animate-colorShift delay-150"></div>
              <div className="w-2.5 h-2.5 rounded-sm bg-gradient-to-r from-red-300 via-red-200 to-red-100 animate-colorShift delay-300"></div>
            </div>
          </div>
        </div>
      </div>
      <ContraindicationModal
        open={showContraindicationModal}
        html={contraindicationHtml}
        onClose={() => setShowContraindicationModal(false)}
      />
    </>
  );
};
