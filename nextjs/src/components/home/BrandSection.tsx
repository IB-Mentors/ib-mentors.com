import s from "./Home.module.css";
import { ScrollAppear, Ticker } from "./fx";

/**
 * Framer "Brand Section" (hidden on phone): a Ticker (speed 80, gap 40 desktop / 20 tablet, no fade) of the four
 * "Brand Title Wrapper" cards (variants "Brand Card 01" filled / "Brand Card 02" outlined). "Content" scroll-appears.
 */
function cards() {
  return (
    <>
      <div className={s.c_1cw1isp} data-framer-name="Brand card 1">
        <div className={s.c_4ff0dp_container}>
          <div className={`${s.c_o9rj2} ${s.c_im8t6} ${s.v_1otnx2n}`} data-framer-name="Brand Card 02" data-border="true" style={{"--border-bottom-width": "1px", "--border-color": "var(--token-080e1a25-cec7-42ff-8f40-b5b92f071114, rgb(26, 69, 60))", "--border-left-width": "1px", "--border-right-width": "1px", "--border-style": "solid", "--border-top-width": "1px", backgroundColor: "rgba(0, 0, 0, 0)", borderBottomLeftRadius: "80px", borderBottomRightRadius: "80px", borderTopLeftRadius: "80px", borderTopRightRadius: "80px"}}>
            <div className={`${s.c_1ke1jx0} ${s.rt}`} data-framer-name="Title 01" style={{"--variable-reference-skMwZgele-xyCnfjF39": "var(--token-080e1a25-cec7-42ff-8f40-b5b92f071114, rgb(26, 69, 60))"}}>
              <h2 className={`p-1ktddze`} style={{textAlign: "left", color: "var(--variable-reference-skMwZgele-xyCnfjF39)"}}>
                IA/EE/TOKサポート
              </h2>
            </div>
          </div>
        </div>
      </div>
      <div className={s.c_17fj1pp} data-framer-name="Brand card 4">
        <div className={s.c_fg47ws_container}>
          <div className={`${s.c_o9rj2} ${s.c_im8t6} ${s.v_im8t6}`} data-framer-name="Brand Card 01" style={{"--border-bottom-width": "0px", "--border-color": "rgba(0, 0, 0, 0)", "--border-left-width": "0px", "--border-right-width": "0px", "--border-style": "solid", "--border-top-width": "0px", backgroundColor: "var(--token-7815bd49-9bc8-4647-bba4-8c93a9b00cc9, rgb(255, 255, 255))", borderBottomLeftRadius: "80px", borderBottomRightRadius: "80px", borderTopLeftRadius: "80px", borderTopRightRadius: "80px"}}>
            <div className={`${s.c_1ke1jx0} ${s.rt}`} data-framer-name="Title 01" style={{"--variable-reference-skMwZgele-xyCnfjF39": "var(--token-080e1a25-cec7-42ff-8f40-b5b92f071114, rgb(26, 69, 60))"}}>
              <h2 className={`p-1ktddze`} style={{textAlign: "left", color: "var(--variable-reference-skMwZgele-xyCnfjF39)"}}>
                科目別試験対策
              </h2>
            </div>
          </div>
        </div>
      </div>
      <div className={s.c_w8dtig} data-framer-name="Brand card 3">
        <div className={s.c_1pdp5ny_container}>
          <div className={`${s.c_o9rj2} ${s.c_im8t6} ${s.v_im8t6}`} data-framer-name="Brand Card 01" style={{"--border-bottom-width": "0px", "--border-color": "rgba(0, 0, 0, 0)", "--border-left-width": "0px", "--border-right-width": "0px", "--border-style": "solid", "--border-top-width": "0px", backgroundColor: "var(--token-080e1a25-cec7-42ff-8f40-b5b92f071114, rgb(26, 69, 60))", borderBottomLeftRadius: "80px", borderBottomRightRadius: "80px", borderTopLeftRadius: "80px", borderTopRightRadius: "80px"}}>
            <div className={`${s.c_1ke1jx0} ${s.rt}`} data-framer-name="Title 01" style={{"--variable-reference-skMwZgele-xyCnfjF39": "var(--token-7815bd49-9bc8-4647-bba4-8c93a9b00cc9, rgb(255, 255, 255))"}}>
              <h2 className={`p-1ktddze`} style={{textAlign: "left", color: "var(--variable-reference-skMwZgele-xyCnfjF39)"}}>
                IB特化
              </h2>
            </div>
          </div>
        </div>
      </div>
      <div className={s.c_1xtgyfg} data-framer-name="Brand card 2">
        <div className={s.c_1iwzokl_container}>
          <div className={`${s.c_o9rj2} ${s.c_im8t6} ${s.v_im8t6}`} data-framer-name="Brand Card 01" style={{"--border-bottom-width": "0px", "--border-color": "rgba(0, 0, 0, 0)", "--border-left-width": "0px", "--border-right-width": "0px", "--border-style": "solid", "--border-top-width": "0px", backgroundColor: "var(--token-c3255d5e-8803-4307-aa11-957eacb5776a, rgb(133, 62, 0))", borderBottomLeftRadius: "80px", borderBottomRightRadius: "80px", borderTopLeftRadius: "80px", borderTopRightRadius: "80px"}}>
            <div className={`${s.c_1ke1jx0} ${s.rt}`} data-framer-name="Title 01" style={{"--variable-reference-skMwZgele-xyCnfjF39": "var(--token-7815bd49-9bc8-4647-bba4-8c93a9b00cc9, rgb(255, 255, 255))"}}>
              <h2 className={`p-1ktddze`} style={{textAlign: "left", color: "var(--variable-reference-skMwZgele-xyCnfjF39)"}}>
                オーダーメイドで管理
              </h2>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export function BrandSection() {
  return (
    <section className={`${s.c_f9qm0r} hide-phone`} data-section="Brand Section" data-framer-name="Brand Section">
      <div className={s.c_1es9a5a} data-framer-name="Container">
        <ScrollAppear className={s.c_g5hecl} data-framer-name="Content">
          <div className={s.c_4ro06x_container}>
            <div className="hide-tablet" style={{ display: "contents" }}>
              <Ticker gap={40} speed={80}>
                {cards()}
              </Ticker>
            </div>
            <div className="hide-phone hide-desktop" style={{ display: "contents" }}>
              <Ticker gap={20} speed={80}>
                {cards()}
              </Ticker>
            </div>
          </div>
        </ScrollAppear>
      </div>
    </section>
  );
}
