import s from "./Home.module.css";
import { FImg } from "./parts";
import { Counter, HoverScaleLink, LoadAppear } from "./fx";

/** Framer "Hero Section" (page module QWoqitfISDBm*.mjs, displayName `Home`). */
export function HeroSection() {
  return (
    <section className={s.c_3t30n7} data-section="Hero Section" data-framer-name="Hero Section">
      <div className={s.c_1y9ta5j} data-framer-name="Container">
        <div className={s.c_1f9dtub} data-framer-name="Content">
          <LoadAppear className={s.c_1piykzo} data-framer-name="Title Wrapper" duration={0.4}>
            <div className={s.c_1ertw5e} data-framer-name="Title & Search bar">
              <div className={`${s.c_ia7zk9} ${s.rt}`}>
                <h1 className={`p-1da19g0`} dir="auto" style={{textAlign: "center"}}>
                  専属
                  <span style={{color: "var(--token-6b7381ba-6de4-49e1-a897-8666d0895cc7, rgb(207, 117, 39))"}}>
                    <em>
                      メンターと共に
                    </em>
                  </span>
                  <br />
                  IBの二年間を迷わず走り切ろう
                </h1>
                <p className={`p-ztkeh`} dir="auto">
                  <br />
                </p>
              </div>
              <div className="hide-tablet" style={{ display: "contents" }}>
                <div className={`${s.c_1yfxdzf} hide-phone`} data-framer-name="Shape" style={{height: "auto", aspectRatio: "3.6582278481012658"}}>
                  <FImg src="/framer/m1TmjgUit1Onxls1fwkmkyvcf0.svg" alt="Shape" />
                </div>
              </div>
              <div className="hide-phone hide-desktop" style={{ display: "contents" }}>
                <div className={`${s.c_1yfxdzf} hide-phone`} data-framer-name="Shape">
                  <FImg src="/framer/m1TmjgUit1Onxls1fwkmkyvcf0.svg" alt="Shape" />
                </div>
              </div>
              <HoverScaleLink className={`${s.c_n3dwfx} ${s.c_lux5qc}`} data-framer-name="Search Bar" href="https://lin.ee/EPTH4OI" target="_blank">
                <div className={s.c_1fu2m7}>
                  <div className={s.c_1g3197n} data-framer-name="LINE APP_Android">
                    <FImg src="/framer/xmQvzuMOUvp89kEZ62tt7duryc.png" />
                  </div>
                  <div className={`${s.c_hsuvq0} ${s.rt}`} data-framer-name="Title">
                    <p className={`p-5bbaju`} dir="auto" style={{color: "var(--token-7815bd49-9bc8-4647-bba4-8c93a9b00cc9, rgb(255, 255, 255))"}}>
                      LINEで無料相談
                    </p>
                  </div>
                </div>
                <div className={s.c_b9htoh} data-framer-name="Icon Wrapper">
                  <svg data-framer-name="Emoji Happy" role="presentation" viewBox="0 0 24 24" style={{ "--1335ju": "1.5", "--18mrqx2": "#4cc765", "--3it368": "1", aspectRatio: "1", width: "24px", flex: "none", position: "relative", display: "block" }} dangerouslySetInnerHTML={{ __html: "<path d=\"M 0 0 L 5.5 5.25 L 0 10.5\" fill=\"transparent\" height=\"10.5px\" id=\"pTO_zwTXv\" stroke-dasharray=\"\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"var(--1335ju, 1.5)\" stroke=\"var(--18mrqx2, rgb(0, 0, 0))\" transform=\"translate(13.75 6.75)\" width=\"5.5px\"/><path d=\"M 14.25 0 L 0 0\" fill=\"transparent\" height=\"1px\" id=\"Jh7NTfV71\" stroke-dasharray=\"\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"var(--1335ju, 1.5)\" stroke=\"var(--18mrqx2, rgb(0, 0, 0))\" transform=\"translate(4.75 12)\" width=\"14.25px\"/>" }} />
                </div>
              </HoverScaleLink>
              <div className="" style={{ display: "contents" }}>
                <div className={`${s.c_1ip3qr} hide-desktop hide-tablet`} data-framer-name="Shape">
                  <FImg src="/framer/m1TmjgUit1Onxls1fwkmkyvcf0.svg" alt="Shape" />
                </div>
              </div>
            </div>
          </LoadAppear>
          <LoadAppear className={s.c_n21idn} data-framer-name="Card Wrapper" duration={0.5}>
            <div className={`${s.c_15vbafg} hide-tablet hide-phone`} data-framer-name="Card Wrapper 01">
              <div className={s.c_1md6oqw} data-framer-name="01">
                <div className={s.c_1env5k1} data-framer-name="Image " style={{transform: "rotateY(180deg)"}}>
                  <FImg src="/framer/gqm1WqqsTGX7961k2TiQkP4bM.jpg" pos="center top" alt="Image" />
                </div>
              </div>
              <div className={s.c_1f8kqll} data-framer-name="02">
                <div className={s.c_10k9y5k_container} data-framer-name="Counter Card 01">
                  <div className={`${s.c_8ju81m} ${s.v_1enre3z}`} data-framer-name="Counter Card 03" style={{"--1hyot11": "25px 30px 30px 30px", "--kvg6r": "0px", backgroundColor: "rgba(0, 0, 0, 0)", width: "100%", borderBottomLeftRadius: "10px", borderBottomRightRadius: "10px", borderTopLeftRadius: "10px", borderTopRightRadius: "10px"}}>
                    <div className={s.c_mwkyge_container}>
<Counter start={0} end={5} suffix="" size={64} suffixSerif />
                    </div>
                    <div className={`${s.c_c2cdc8} ${s.rt}`} data-framer-name="Title" style={{"--variable-reference-k1gFLewLX-Iv2HKfivL": "var(--token-7815bd49-9bc8-4647-bba4-8c93a9b00cc9, rgb(255, 255, 255))"}}>
                      <p className={`p-1ijstdn`} style={{textAlign: "center", color: "var(--variable-reference-k1gFLewLX-Iv2HKfivL)"}}>
                        予測スコア平均アップ（学期）
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={s.c_19jjixw} data-framer-name="Card Wrapper 02">
              <div className={s.c_13y7k1k} data-framer-name="01">
                <div className="hide-phone hide-tablet" style={{ display: "contents" }}>
                  <div className={s.c_s0kg4k_container} data-framer-name="Counter ">
                    <div className={`${s.c_8ju81m} ${s.v_nwf1t7}`} data-framer-name="Counter Card 02" style={{"--1hyot11": "0px", "--kvg6r": "0px", backgroundColor: "rgba(0, 0, 0, 0)", width: "100%", borderBottomLeftRadius: "10px", borderBottomRightRadius: "10px", borderTopLeftRadius: "10px", borderTopRightRadius: "10px"}}>
                      <div className={s.c_mwkyge_container}>
<Counter start={50} end={75} suffix="%" size={64} />
                      </div>
                      <div className={`${s.c_c2cdc8} ${s.rt}`} data-framer-name="Title" style={{"--variable-reference-k1gFLewLX-Iv2HKfivL": "var(--token-7815bd49-9bc8-4647-bba4-8c93a9b00cc9, rgb(255, 255, 255))"}}>
                        <p className={`p-1ijstdn`} style={{textAlign: "left", color: "var(--variable-reference-k1gFLewLX-Iv2HKfivL)"}}>
                          以上の生徒がスコアアップ、効果を実感
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="hide-desktop hide-tablet" style={{ display: "contents" }}>
                  <div className={s.c_s0kg4k_container} data-framer-name="Counter ">
                    <div className={`${s.c_8ju81m} ${s.v_nwf1t7}`} data-framer-name="Counter Card 02" style={{"--1hyot11": "0px", "--kvg6r": "9px", backgroundColor: "rgba(0, 0, 0, 0)", width: "100%", borderBottomLeftRadius: "10px", borderBottomRightRadius: "10px", borderTopLeftRadius: "10px", borderTopRightRadius: "10px"}}>
                      <div className={s.c_mwkyge_container}>
<Counter start={50} end={75} suffix="%" size={40} />
                      </div>
                      <div className={`${s.c_c2cdc8} ${s.rt}`} data-framer-name="Title" style={{"--variable-reference-k1gFLewLX-Iv2HKfivL": "var(--token-7815bd49-9bc8-4647-bba4-8c93a9b00cc9, rgb(255, 255, 255))"}}>
                        <p className={`p-1ijstdn`} style={{textAlign: "left", color: "var(--variable-reference-k1gFLewLX-Iv2HKfivL)"}}>
                          以上の生徒がスコアアップ、効果を実感
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="hide-phone hide-desktop" style={{ display: "contents" }}>
                  <div className={s.c_s0kg4k_container} data-framer-name="Counter ">
                    <div className={`${s.c_8ju81m} ${s.v_nwf1t7}`} data-framer-name="Counter Card 02" style={{"--1hyot11": "0px", "--kvg6r": "10px", backgroundColor: "rgba(0, 0, 0, 0)", width: "100%", borderBottomLeftRadius: "10px", borderBottomRightRadius: "10px", borderTopLeftRadius: "10px", borderTopRightRadius: "10px"}}>
                      <div className={s.c_mwkyge_container}>
<Counter start={50} end={75} suffix="%" size={64} />
                      </div>
                      <div className={`${s.c_c2cdc8} ${s.rt}`} data-framer-name="Title" style={{"--variable-reference-k1gFLewLX-Iv2HKfivL": "var(--token-7815bd49-9bc8-4647-bba4-8c93a9b00cc9, rgb(255, 255, 255))"}}>
                        <p className={`p-1ijstdn`} style={{textAlign: "left", color: "var(--variable-reference-k1gFLewLX-Iv2HKfivL)"}}>
                          以上の生徒がスコアアップ、効果を実感
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="hide-phone" style={{ display: "contents" }}>
                  <div className={s.c_15q5bnt} data-framer-name="Image ">
                    <FImg src="/framer/zBhOEl1W3kMqP2GaidnpmRFdXPc.jpg" pos="center top" alt="Image" />
                  </div>
                </div>
                <div className="hide-desktop hide-tablet" style={{ display: "contents" }}>
                  <div className={s.c_15q5bnt} data-framer-name="Image ">
                    <FImg src="/framer/5d5dVmNqrikZcLagdj88QiqxA.png" pos="center top" alt="Image" />
                  </div>
                </div>
                <div className={s.c_c75xeq} data-framer-name="Linear" />
              </div>
              <div className={`${s.c_1c6y68l} hide-phone`} data-framer-name="02">
                <div className={s.c_17ot9xt} data-framer-name="Shape">
                  <FImg src="/framer/MtbxwDJlWMeYWvc6xNiXkb94.svg" alt="Image" />
                </div>
                <div className={s.c_tudrcs} data-framer-name="Title & Button Wrapper">
                  <div className={s.c_xpnr4n} data-framer-name="Title Wrapper">
                    <div className={`${s.c_19pixf2} ${s.rt}`} data-framer-name="Title">
                      <h4 className={`p-1goqrxy`} dir="auto" style={{textAlign: "left", color: "var(--token-7815bd49-9bc8-4647-bba4-8c93a9b00cc9, rgb(255, 255, 255))"}}>
                        全科目対応！追加料金なしでメンターが伴走
                      </h4>
                    </div>
                  </div>
                  <div className="hide-tablet" style={{ display: "contents" }}>
                    <div className={s.c_eu6j8f_container} data-framer-name="Button">
                      <a className={`${s.c_47kb1k} ${s.v_47kb1k} ${s.c_19dx2zv}`} data-framer-name="Hero Card Button" href="/contact" style={{backgroundColor: "var(--token-7815bd49-9bc8-4647-bba4-8c93a9b00cc9, rgb(255, 255, 255))", width: "100%", borderBottomLeftRadius: "40px", borderBottomRightRadius: "40px", borderTopLeftRadius: "40px", borderTopRightRadius: "40px"}}>
                        <div className={s.c_1lfyfzb} data-framer-name="Text Wrapper">
                          <div className={`${s.c_11ais6m} ${s.rt}`} data-framer-name="Title">
                            <p className={`p-w4t77b`} style={{textAlign: "center", color: "var(--token-080e1a25-cec7-42ff-8f40-b5b92f071114, rgb(26, 69, 60))"}}>
                              Join Community
                            </p>
                          </div>
                          <div className={`${s.c_1gfz083} ${s.rt}`} data-framer-name="Title">
                            <p className={`p-w4t77b`} style={{textAlign: "center", color: "var(--token-080e1a25-cec7-42ff-8f40-b5b92f071114, rgb(26, 69, 60))"}}>
                              Join Community
                            </p>
                          </div>
                        </div>
                      </a>
                    </div>
                  </div>
                  <div className="hide-phone hide-desktop" style={{ display: "contents" }}>
                    <div className={s.c_eu6j8f_container} data-framer-name="Button">
                      <a className={`${s.c_47kb1k} ${s.v_r5tmzd} ${s.c_19dx2zv}`} data-framer-name="Tablet" href="/contact" style={{backgroundColor: "var(--token-7815bd49-9bc8-4647-bba4-8c93a9b00cc9, rgb(255, 255, 255))", width: "100%", borderBottomLeftRadius: "40px", borderBottomRightRadius: "40px", borderTopLeftRadius: "40px", borderTopRightRadius: "40px"}}>
                        <div className={s.c_1lfyfzb} data-framer-name="Text Wrapper">
                          <div className={`${s.c_11ais6m} ${s.rt}`} data-framer-name="Title">
                            <p className={`p-w4t77b`} style={{textAlign: "center", color: "var(--token-080e1a25-cec7-42ff-8f40-b5b92f071114, rgb(26, 69, 60))"}}>
                              Join Community
                            </p>
                          </div>
                          <div className={`${s.c_1gfz083} ${s.rt}`} data-framer-name="Title">
                            <p className={`p-w4t77b`} style={{textAlign: "center", color: "var(--token-080e1a25-cec7-42ff-8f40-b5b92f071114, rgb(26, 69, 60))"}}>
                              Join Community
                            </p>
                          </div>
                        </div>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div className={`${s.c_1529s4l} hide-phone`} data-framer-name="03">
                <div className="" style={{ display: "contents" }}>
                  <div className={s.c_1l930ct} data-framer-name="Image ">
                    <FImg src="/framer/CpaLRqsNnc6BPXSe9xELpAwEc.jpg" pos="center top" alt="Image" />
                  </div>
                </div>
                <div className={s.c_qbrz51} data-framer-name="Title Wrapper">
                  <div className={`${s.c_17i5z4g} ${s.rt}`} data-framer-name="Title">
                    <h4 className={`p-1goqrxy`} dir="auto" style={{textAlign: "left", color: "var(--token-7815bd49-9bc8-4647-bba4-8c93a9b00cc9, rgb(255, 255, 255))"}}>
                      専用チャットで365日の
                      <br />
                      学習・進捗
                      <br />
                      徹底サポート
                    </h4>
                  </div>
                </div>
                <div className={s.c_v28h1g} data-framer-name="Linear" />
              </div>
            </div>
            <div className={`${s.c_15k6tpr} hide-tablet hide-phone`} data-framer-name="Card Wrapper 03">
              <div className={s.c_rr34a6} data-framer-name="01">
                <div className={s.c_1lpeziv} data-framer-name="Shape">
                  <FImg src="/framer/pYReVPfQVl9M3Ev7kUFkXj1frCQ.png" alt="Image" />
                </div>
                <div className={s.c_ruvgx1} data-framer-name="Title Wrapper">
                  <div className={`${s.c_1mdbvvj} ${s.rt}`} data-framer-name="Title">
                    <h4 className={`p-1goqrxy`} dir="auto" style={{textAlign: "right", color: "var(--token-7815bd49-9bc8-4647-bba4-8c93a9b00cc9, rgb(255, 255, 255))"}}>
                      あなたの
                    </h4>
                    <h4 className={`p-1goqrxy`} dir="auto" style={{textAlign: "right", color: "var(--token-6b7381ba-6de4-49e1-a897-8666d0895cc7, rgb(207, 117, 39))"}}>
                      専用学習計画
                      <span style={{color: "var(--token-7815bd49-9bc8-4647-bba4-8c93a9b00cc9, rgb(255, 255, 255))"}}>
                        を作成
                      </span>
                    </h4>
                  </div>
                </div>
              </div>
              <div className={s.c_11tkzmo} data-framer-name="02">
                <div className={s.c_b03pi4} data-framer-name="Image ">
                  <FImg src="/framer/NvnBkBrpVWC2NVIjH9dEm72q3CQ.webp" alt="Image" />
                </div>
                <div className={s.c_pod2va} data-framer-name="Title Wrapper">
                  <div className={`${s.c_17ysexh} ${s.rt}`} data-framer-name="Title">
                    <h5 className={`p-1q957ix`} dir="auto" style={{textAlign: "left", color: "var(--token-7815bd49-9bc8-4647-bba4-8c93a9b00cc9, rgb(255, 255, 255))"}}>
                      面接対策・
                      <br />
                      エッセイ添削までフル対応
                    </h5>
                  </div>
                </div>
                <div className={s.c_1s48li6} data-framer-name="linear" />
              </div>
            </div>
          </LoadAppear>
        </div>
      </div>
    </section>
  );
}
