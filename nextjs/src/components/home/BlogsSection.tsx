import s from "./Home.module.css";
import { BLOG_POSTS, type BlogPost } from "@/content/blogs";
import { BlogCardV1, type BlogCardV1Variant } from "./BlogCardV1";
import { ScrollAppear } from "./fx";

/** One card per breakpoint, as Framer renders it (ssr-variant + hidden-* classes). */
function Card({ post, container, desktop }: { post: BlogPost; container: string; desktop: BlogCardV1Variant }) {
  return (
    <>
      <div className="hide-phone hide-tablet" style={{ display: "contents" }}>
        <div className={container}>
          <BlogCardV1 post={post} variant={desktop} />
        </div>
      </div>
      <div className="hide-desktop hide-tablet" style={{ display: "contents" }}>
        <div className={container}>
          <BlogCardV1 post={post} variant="Phone Blog Card V1" />
        </div>
      </div>
      <div className="hide-phone hide-desktop" style={{ display: "contents" }}>
        <div className={container}>
          <BlogCardV1 post={post} variant="Tablet Blog Card V1" />
        </div>
      </div>
    </>
  );
}

/**
 * Framer "Blogs Section": the first four posts of the CMS collection (oldest first, as Framer's query returns them):
 * one big "Desktop Blog Card V1" and three "Desktop Blog Card V2" rows; Tablet / Phone Blog Card V1 below 1380px.
 */
export function BlogsSection() {
  const [big, ...small] = BLOG_POSTS.slice(0, 4);
  return (
    <section className={s.c_3s1syp} data-section="Blogs Section" data-framer-name="Blogs Section">
      <div className={s.c_faq8cz} data-framer-name="Container">
        <ScrollAppear className={s.c_bqpvdf} data-framer-name="Content">
          <div className={s.c_pezh56} data-framer-name="Title Wrapper">
            <div className={`${s.c_181e7rw} ${s.rt}`}>
              <h2 className={`p-1ktddze`} dir="auto" style={{textAlign: "center", color: "var(--token-080e1a25-cec7-42ff-8f40-b5b92f071114, rgb(10, 34, 107))"}}>
                会社
                <span style={{color: "var(--token-6b7381ba-6de4-49e1-a897-8666d0895cc7, rgb(207, 117, 39))"}}>
                  情報
                </span>
              </h2>
            </div>
            <div className={`${s.c_6uccw4} ${s.rt}`}>
              <p className={`p-1ijstdn`} dir="auto" style={{textAlign: "center", color: "var(--token-c7693201-4213-426e-a6de-0fbb44d0f402, rgb(68, 68, 68))"}}>
                Insights, News, and Resources About the Company
              </p>
            </div>
          </div>
          <div className={s.c_olq6yx} data-framer-name="Card Wrapper">
            <div className={s.c_zo7mz8} data-framer-name="Big Card Wrapper">
              <div className={s.c_11ba0lp}>
                <Card post={big} container={s.c_3s8bot_container} desktop="Desktop Blog Card V1" />
              </div>
            </div>
            <div className={s.c_sz3yhq} data-framer-name="Small Card Wrapper">
              <div className={s.c_17nzujy}>
                {small.map((p) => (
                  <Card key={p.slug} post={p} container={s.c_f8czok_container} desktop="Desktop Blog Card V2" />
                ))}
              </div>
            </div>
          </div>
        </ScrollAppear>
      </div>
    </section>
  );
}
