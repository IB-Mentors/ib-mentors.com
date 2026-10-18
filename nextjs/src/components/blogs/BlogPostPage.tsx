import { Page } from "@/components/shell/Page";
import { getPost } from "@/content/blogs";
import { Appear, TWEEN_04 } from "./fx";
import { GoBackButton } from "./GoBackButton";
import s from "./BlogPostPage.module.css";

/**
 * Route /blogs/<slug>. Framer page module ps3eJN4x*.mjs (`Blogs`, framer-YwhOb).
 *   Hero Section: empty spacer under the header (74/80/75 px tall with 110 px top padding on desktop).
 *   Details Section: image, Date & Category, title, rich-text body, Go Back button; Content appears from y 60, tween 0.4 s.
 */

const PRESET: Record<string, string> = { h2: "p-1ktddze", h3: "p-qapw0k", h4: "p-1goqrxy", p: "p-1ijstdn" };

/** The rich-text body of a post with Framer's per-tag preset classes (stylesPresetsClassNames in ps3eJN4x*.mjs).
 *  src/content/blogs.ts stores the whole Framer details block (images, date, category, title, body, Go Back
 *  links); the body is what sits between the title's </h2> and the first component marker. */
function bodyHtml(html: string): string {
  const start = html.indexOf("</h2>");
  let body = start >= 0 ? html.slice(start + 5) : html;
  const end = body.indexOf("<!--$-->");
  if (end >= 0) body = body.slice(0, end);
  return body.replace(/<(h2|h3|h4|p)>/g, (_, t: string) => `<${t} class="${PRESET[t]}" dir="auto">`);
}

export function BlogPostPage({ slug }: { slug: string }) {
  const post = getPost(slug);
  if (!post) return null;
  return (
    <Page>
      <section className={s.hero} data-section="Hero Section" />
      <section className={s.details} data-section="Details Section">
        <div className={s.container} data-framer-name="Container">
          <Appear className={s.content} y={60} transition={TWEEN_04} data-framer-name="Content">
            <div className={s.contentWrapper} data-framer-name="Content Wrapper">
              <div className={s.imageWrapper} data-framer-name="Image Wrapper">
                <div className={s.image}>
                  {post.image && <img className={s.img} src={post.image.src} alt={post.image.alt} decoding="async" />}
                </div>
              </div>
              <div className={s.titleWrapper} data-framer-name="Title Wrapper">
                <div className={s.titleInner} data-framer-name="Title Wrapper">
                  <div className={s.dateCategory} data-framer-name="Date & Category">
                    <div className={s.nowrap} data-framer-name="Date">
                      <p className="p-1ijstdn">{post.date}</p>
                    </div>
                    <div className={s.nowrap} data-framer-name="Category">
                      <p className={`p-w4t77b ${s.category}`}>{post.category}</p>
                    </div>
                  </div>
                  <div className={s.rich} data-framer-name="Title">
                    <h2 className={`p-1ktddze ${s.title}`}>{post.title}</h2>
                  </div>
                </div>
                <div className={s.bodyWrapper} data-framer-name="Content Wrapper">
                  <div className={s.body} data-framer-name="Content" dangerouslySetInnerHTML={{ __html: bodyHtml(post.html) }} />
                </div>
              </div>
              <div className={s.goBack}>
                <GoBackButton href="/blogs" />
              </div>
            </div>
          </Appear>
        </div>
      </section>
    </Page>
  );
}
