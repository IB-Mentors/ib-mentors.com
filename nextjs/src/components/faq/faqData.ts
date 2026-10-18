// /faq questions and answers, verbatim from the Framer module x44xsz38*.mjs (`Faq Tab 01` / `Faq Tab 02`, props
// kocSifLCN = question, cPfJNt4Ls = answer). Framer server-renders only the first answer of each group; all eight
// are rendered in our HTML. The lead wires the FAQPage JSON-LD from FAQ_ITEMS.

export type FaqItem = { q: string; a: string };
export type FaqGroup = { title: string; items: FaqItem[] };

export const FAQ_GROUPS: FaqGroup[] = [
  {
    // Faq Tab 01 (left column on desktop)
    title: "サービスについて",
    items: [
      {
        q: "IB-Mentorsはどのようなサービスですか？",
        a: "IB-Mentorsは、国際バカロレア（IB）ディプロマプログラム（DP）を履修する生徒を対象とした、専属メンターによる完全オンライン伴走型サポートです。科目ごとの個別指導にとどまらず、学習計画の立案・習慣化・IA/EE対策・提出物管理まで、IBに関わるすべてを一人のメンターが一貫してサポートします。",
      },
      {
        q: "どの科目・コンポーネントに対応していますか？",
        a: "DP全科目（Group 1〜6）に加え、Extended Essay（EE）・Theory of Knowledge（TOK）・Internal Assessment（IA）にも対応しています。追加料金は一切なく、一つのプランですべてのサポートを受けることができます。",
      },
      {
        q: "メンターはどのような方々ですか？",
        a: "メンターは全員IB経験者です。世界各国の大学に在籍・卒業した先輩たちが、自身のIB経験をもとに具体的・実践的なアドバイスを行います。科目知識だけでなく、試験戦略・IA/EEの進め方・時間管理まで、リアルな経験に基づいた支援が特徴です。",
      },
      {
        q: "完全オンラインとのことですが、授業の質は大丈夫ですか？",
        a: "はい、ご安心ください。ビデオ通話・専用チャット・共有ドキュメントを組み合わせることで、対面指導と遜色のない質のサポートを提供しています。また24時間以内のLINE返信対応により、授業外でも気軽に質問できる環境を整えています。",
      },
    ],
  },
  {
    // Faq Tab 02 (right column on desktop)
    title: "料金・お申し込みについて",
    items: [
      {
        q: "料金の仕組みを教えてください。",
        a: "IB-Mentorsでは、月額サブスクリプションプラン・コース単位のパッケージ・セッション単位の利用など、生徒のニーズに合わせた複数の料金体系をご用意しています。まずは無料の初回相談にてご状況をお伺いし、最適なプランをご提案します。",
      },
      {
        q: "途中で解約やプランの変更はできますか？",
        a: "はい、可能です。月額プランは月単位で解約・変更が可能です。コース・セッション単位のプランについては、ご利用開始前であれば変更を承ります。詳しくは初回相談時にご確認ください。",
      },
      {
        q: "入塾の流れを教えてください。",
        a: "①LINEまたはフォームからお問い合わせ → ②無料の個別相談（オンライン） → ③ご状況に合わせたプランのご提案 → ④お手続き後、専属メンターとのサポート開始、という流れになります。最短で相談から数日以内にスタートできます。",
      },
      {
        q: "LINEでのサポートはどのように行われますか？",
        a: "専用のLINEグループにて、担当メンターと直接やり取りいただけます。質問・進捗報告・提出物の確認など、授業外でもいつでも連絡が可能です。原則として24時間以内に返信しており、学習の流れを止めないサポート体制を整えています。",
      },
    ],
  },
];

export const FAQ_ITEMS: { q: string; a: string }[] = FAQ_GROUPS.flatMap((g) => g.items);
